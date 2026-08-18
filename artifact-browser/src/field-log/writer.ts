import { randomUUID } from "node:crypto";
import {
	access,
	copyFile,
	mkdir,
	readFile,
	realpath,
	rename,
	rm,
} from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import {
	basename,
	dirname,
	isAbsolute,
	relative,
	resolve,
	sep,
} from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import matter from "gray-matter";
import { z } from "zod";
import {
	acquireLogLock,
	appendJsonLines,
	stageTextReplacement,
} from "../log/filesystem";
import { groupFieldLogEntries } from "./journal";
import {
	type FieldLogProjection,
	parseEventStream,
	projectFieldLogEvents,
} from "./projection";
import { validateTransitions } from "./state-machines";

const eventFileName = "field_log.jsonl";
const markdownFileName = "field_log.md";
const lockFileName = ".field_log.lock";

const actorSchema = z.object({
	kind: z.string().min(1),
	pointer: z.string().min(1).optional(),
});

const authorizationKinds = [
	"artifact-consent",
	"publication-consent",
	"user-selection",
	"user-request",
] as const;

const submittedAuthorizationSchema = z.object({
	kind: z.enum(authorizationKinds),
	pointer: z.string().min(1),
	verbatim: z
		.string({
			error: "authorization.verbatim must quote the user's exact words.",
		})
		.trim()
		.min(1, "authorization.verbatim must quote the user's exact words."),
});

const storedAuthorizationSchema = submittedAuthorizationSchema;

const submittedEventSchema = z
	.object({
		type: z.string().min(1),
		actor: actorSchema,
		authorization: submittedAuthorizationSchema.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.strict()
	.superRefine((event, context) => {
		for (const key of ["eventId", "recordedAt", "schema"]) {
			if (key in event) {
				context.addIssue({
					code: "custom",
					message: `The CLI assigns ${key}; do not submit it.`,
					path: [key],
				});
			}
		}
	});

const storedEventSchema = z
	.object({
		schema: z.literal("field-log/v1"),
		eventId: z.number().int().positive(),
		type: z.string().min(1),
		recordedAt: z.iso.datetime({ offset: true }),
		actor: actorSchema,
		authorization: storedAuthorizationSchema.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.strict();

export type SubmittedEvent = z.infer<typeof submittedEventSchema>;
export type StoredEvent = z.infer<typeof storedEventSchema>;

const generatedIds = {
	"comment.recorded": "commentId",
	"note.recorded": "entryId",
	"synthesis.recorded": "entryId",
	"source.collected": "sourceId",
	"instrument.run.selected": "runId",
	"question.added": "questionId",
	"term.added": "termId",
	"tension.added": "tensionId",
	"plan.item.added": "planItemId",
	"workflow.selected": "workflowId",
} as const;

const idKeys = [
	"commentId",
	"sourceId",
	"runId",
	"entryId",
	"questionId",
	"termId",
	"tensionId",
	"planItemId",
	"workflowId",
] as const;

const requiredAuthorizationKind = {
	"trip.created": "artifact-consent",
	"instrument.run.selected": "user-selection",
	"source.publication.authorized": "publication-consent",
	"workflow.selected": "user-selection",
	"synthesis.recorded": "user-request",
	"plan.item.removed": "user-request",
} as const satisfies Record<string, (typeof authorizationKinds)[number]>;

function validateCurrentQuestionInvariant(events: StoredEvent[]): void {
	const questions = new Map<
		number,
		{ role: "current" | "return-to"; open: boolean }
	>();
	for (const event of events) {
		if (!event.type.startsWith("question.")) continue;
		const questionId = Number(event.payload.questionId);
		if (!Number.isInteger(questionId) || questionId < 1) continue;
		const prior = questions.get(questionId);
		if (event.type === "question.added") {
			const role = event.payload.role ?? "return-to";
			if (role !== "current" && role !== "return-to")
				throw new Error(
					`question.added requires payload.role current or return-to.`,
				);
			questions.set(questionId, { role, open: true });
		}
		if (event.type === "question.revised" && prior) {
			const role = event.payload.role ?? prior.role;
			if (role !== "current" && role !== "return-to")
				throw new Error(
					`question.revised requires payload.role current or return-to.`,
				);
			questions.set(questionId, { ...prior, role });
		}
		if (
			(event.type === "question.answered" ||
				event.type === "question.removed") &&
			prior
		) {
			questions.set(questionId, { ...prior, open: false });
		}
		if (event.type === "question.reopened" && prior) {
			questions.set(questionId, { ...prior, open: true });
		}

		const current = [...questions].filter(
			([, question]) => question.open && question.role === "current",
		);
		if (current.length > 1) {
			const existingId = current[0]?.[0];
			throw new Error(
				`Only one open question may have role current. Revise question ${existingId} to return-to, answer it, or remove it before making question ${questionId} current.`,
			);
		}
	}
}

function validateHistory(events: StoredEvent[]): void {
	validateTransitions(events);
	validateCurrentQuestionInvariant(events);
}

export interface MutationReceipt {
	eventIds: number[];
	runId?: number;
	entryId?: number;
	relativeHref?: string;
	projectionWarning?: string;
}

function paths(directory: string) {
	const root = resolve(directory);
	return {
		root,
		events: resolve(root, eventFileName),
		markdown: resolve(root, markdownFileName),
		lock: resolve(root, lockFileName),
	};
}

export async function acquireFieldLogLock(
	path: string,
): Promise<() => Promise<void>> {
	return acquireLogLock(path, "Field Log");
}

async function readStoredEvents(path: string): Promise<StoredEvent[]> {
	const source = await readFile(path, "utf8").catch((error) => {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
		throw error;
	});
	return parseAndValidateFieldLog(source);
}

function requireString(
	payload: Record<string, unknown>,
	type: string,
	...keys: string[]
): void {
	if (
		!keys.some((key) => typeof payload[key] === "string" && payload[key].trim())
	)
		throw new Error(
			`${type} requires non-empty payload.${keys.join(" or payload.")}.`,
		);
}

function validateImportedTimestamp(
	payload: Record<string, unknown>,
	type: string,
	key: string,
): void {
	const value = payload[key];
	if (value === undefined) return;
	if (
		typeof value !== "string" ||
		!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
			value,
		) ||
		Number.isNaN(Date.parse(value))
	)
		throw new Error(`${type} has an invalid payload.${key}.`);
}

function validateEventSemantics(event: StoredEvent): void {
	const { type, payload } = event;
	const instrumentId = payload.instrumentId;
	if (
		type.startsWith("instrument.") &&
		instrumentId !== undefined &&
		(typeof instrumentId !== "string" ||
			!/^[a-z0-9][a-z0-9-]*$/.test(instrumentId))
	)
		throw new Error(`${type} has an invalid payload.instrumentId.`);
	const requiredKind =
		requiredAuthorizationKind[type as keyof typeof requiredAuthorizationKind];
	if (requiredKind && event.authorization?.kind !== requiredKind)
		throw new Error(`${type} requires authorization.kind ${requiredKind}.`);
	switch (type) {
		case "trip.created":
			requireString(payload, type, "title");
			requireString(payload, type, "openingQuestion");
			validateImportedTimestamp(payload, type, "openedAt");
			break;
		case "trip.context.recorded":
			requireString(payload, type, "scope", "aim", "text", "context");
			break;
		case "trip.title.updated":
			requireString(payload, type, "title");
			break;
		case "trip.expedition.joined":
			requireString(payload, type, "path");
			break;
		case "comment.recorded":
			requireString(payload, type, "text");
			break;
		case "note.recorded":
		case "synthesis.recorded":
		case "engine.result.recorded":
			requireString(payload, type, "markdown");
			break;
		case "source.collected":
			requireString(payload, type, "title");
			requireString(payload, type, "url", "path", "origin");
			break;
		case "source.examined":
			requireString(payload, type, "coverage");
			break;
		case "question.added":
			requireString(payload, type, "text");
			if (payload.role !== "current" && payload.role !== "return-to")
				throw new Error(`${type} requires payload.role current or return-to.`);
			break;
		case "question.revised":
			requireString(payload, type, "text", "role", "status");
			break;
		case "question.answered":
			requireString(payload, type, "answer", "reason");
			break;
		case "question.reopened":
		case "tension.resolved":
		case "tension.reopened":
			requireString(payload, type, "reason", "evidence");
			break;
		case "term.added":
		case "term.revised":
			requireString(payload, type, "term", "title");
			break;
		case "tension.added":
		case "tension.revised":
			requireString(payload, type, "title", "description");
			break;
		case "plan.item.added":
			requireString(payload, type, "title");
			break;
		case "plan.item.completed":
			requireString(payload, type, "result");
			break;
		case "plan.item.removed":
			requireString(payload, type, "reason");
			break;
		case "workflow.selected":
			requireString(payload, type, "name", "title");
			break;
		case "instrument.run.selected":
		case "instrument.run.prepared":
		case "instrument.run.started": {
			requireString(payload, type, "instrumentId");
			break;
		}
		case "instrument.run.completed": {
			requireString(payload, type, "instrumentId");
			const entry = payload.entry as Record<string, unknown> | undefined;
			if (!entry || typeof entry !== "object")
				throw new Error(`${type} requires payload.entry.`);
			requireString(entry, type, "markdown");
			break;
		}
		case "instrument.run.failed":
		case "instrument.run.stopped":
			requireString(payload, type, "reason", "error", "residue");
			break;
		case "instrument.feedback.recorded":
			requireString(payload, type, "text");
			break;
	}
}

export function parseAndValidateFieldLog(source: string): StoredEvent[] {
	const parsed = parseEventStream(source, {
		allowIncompleteTrailingLine: false,
	});
	const events = parsed.map((event, index) => {
		const stored = storedEventSchema.parse(event);
		if (stored.eventId !== index + 1)
			throw new Error(
				`Expected eventId ${index + 1}, found ${stored.eventId}.`,
			);
		validateEventSemantics(stored);
		return stored;
	});
	validateHistory(events);
	return events;
}

function counters(
	events: StoredEvent[],
): Record<(typeof idKeys)[number], number> {
	const result = Object.fromEntries(idKeys.map((key) => [key, 0])) as Record<
		(typeof idKeys)[number],
		number
	>;
	for (const event of events) {
		for (const key of idKeys) {
			const value =
				key === "entryId" &&
				event.payload.entry &&
				typeof event.payload.entry === "object"
					? (event.payload.entry as Record<string, unknown>).entryId
					: event.payload[key];
			if (Number.isInteger(value))
				result[key] = Math.max(result[key], Number(value));
		}
	}
	return result;
}

function requiredEntityId(type: string): (typeof idKeys)[number] | null {
	if (type.startsWith("source.")) return "sourceId";
	if (type.startsWith("instrument.")) return "runId";
	if (type.startsWith("question.")) return "questionId";
	if (type.startsWith("term.")) return "termId";
	if (type.startsWith("tension.")) return "tensionId";
	if (type.startsWith("plan.item.")) return "planItemId";
	if (type.startsWith("workflow.")) return "workflowId";
	return null;
}

function assignEvents(
	existing: StoredEvent[],
	submitted: unknown[],
): StoredEvent[] {
	const next = counters(existing);
	const lastAssigned = new Map<string, number>();
	return submitted.map((input, index) => {
		const parsed = submittedEventSchema.parse(input);
		if (parsed.type === "engine.result.recorded") {
			throw new Error(
				"engine.result.recorded is legacy-only; use synthesis.recorded or note.recorded.",
			);
		}
		const expectedAuthorizationKind =
			requiredAuthorizationKind[
				parsed.type as keyof typeof requiredAuthorizationKind
			];
		if (expectedAuthorizationKind && !parsed.authorization) {
			throw new Error(
				`${parsed.type} requires authorization.kind ${expectedAuthorizationKind}, a pointer, and the user's verbatim text.`,
			);
		}
		if (
			expectedAuthorizationKind &&
			parsed.authorization?.kind !== expectedAuthorizationKind
		) {
			throw new Error(
				`${parsed.type} requires authorization.kind ${expectedAuthorizationKind}.`,
			);
		}
		const payload = { ...parsed.payload };
		if (
			(parsed.type === "note.recorded" ||
				parsed.type === "synthesis.recorded") &&
			(typeof payload.markdown !== "string" || !payload.markdown.trim())
		) {
			throw new Error(`${parsed.type} requires non-empty payload.markdown.`);
		}
		const generatedKey =
			generatedIds[parsed.type as keyof typeof generatedIds] ?? null;
		if (generatedKey) {
			if (payload[generatedKey] != null)
				throw new Error(`The CLI assigns ${generatedKey}; do not submit it.`);
			next[generatedKey] += 1;
			payload[generatedKey] = next[generatedKey];
			lastAssigned.set(generatedKey, next[generatedKey]);
		}
		const entityKey = requiredEntityId(parsed.type);
		if (entityKey && payload[entityKey] == null) {
			const inferred = lastAssigned.get(entityKey);
			if (!inferred) throw new Error(`${parsed.type} requires ${entityKey}.`);
			payload[entityKey] = inferred;
		}
		if (parsed.type === "instrument.run.completed") {
			const entry =
				payload.entry && typeof payload.entry === "object"
					? { ...(payload.entry as Record<string, unknown>) }
					: null;
			if (!entry) throw new Error("instrument.run.completed requires entry.");
			if (entry.entryId != null)
				throw new Error("The CLI assigns entryId; do not submit it.");
			next.entryId += 1;
			entry.entryId = next.entryId;
			entry.readoutIds = [payload.runId];
			payload.entry = entry;
			if (payload.observedAt == null)
				payload.observedAt = new Date().toISOString();
		}
		return storedEventSchema.parse({
			schema: "field-log/v1",
			eventId: existing.length + index + 1,
			type: parsed.type,
			recordedAt: new Date().toISOString(),
			actor: parsed.actor,
			authorization: parsed.authorization,
			payload,
		});
	});
}

function safeRelativePath(root: string, candidate: string): string {
	if (isAbsolute(candidate))
		throw new Error("Instrument card paths must be relative.");
	const absolute = resolve(root, candidate);
	const rel = relative(root, absolute);
	if (rel.startsWith("..") || isAbsolute(rel))
		throw new Error("Instrument card path escapes the Field Log directory.");
	return absolute;
}

async function validateInstrumentSchemas(
	root: string,
	events: StoredEvent[],
): Promise<void> {
	for (const event of events) {
		if (!event.type.startsWith("instrument.")) continue;
		const pointer = event.payload.instrumentCard;
		const instrumentId =
			typeof event.payload.instrumentId === "string"
				? event.payload.instrumentId
				: null;
		let cardPath: string | null = null;
		if (typeof pointer === "string") {
			cardPath = safeRelativePath(root, pointer);
		} else if (instrumentId) {
			const builtIn = resolve(
				dirname(fileURLToPath(import.meta.url)),
				"../../../reference/instruments",
				`${instrumentId}.md`,
			);
			if (
				await access(builtIn)
					.then(() => true)
					.catch(() => false)
			) {
				cardPath = builtIn;
			}
		}
		if (!cardPath) continue;
		const card = matter(await readFile(cardPath, "utf8")).data as Record<
			string,
			unknown
		>;
		const schemas =
			card.event_schemas && typeof card.event_schemas === "object"
				? (card.event_schemas as Record<string, unknown>)
				: {};
		const definition = schemas[event.type];
		if (!definition || typeof definition !== "object") continue;
		const config = definition as Record<string, unknown>;
		const schema =
			config.schema && typeof config.schema === "object" ? config.schema : null;
		if (!schema) continue;
		const payloadPath =
			typeof config.payload_path === "string" ? config.payload_path : null;
		let value: unknown = event.payload;
		for (const segment of payloadPath?.split(".").filter(Boolean) ?? []) {
			value =
				value && typeof value === "object"
					? (value as Record<string, unknown>)[segment]
					: undefined;
		}
		const validate = new Ajv({ allErrors: true, strict: false }).compile(
			schema,
		);
		if (!validate(value)) {
			throw new Error(
				`${event.type} failed ${pointer} validation: ${JSON.stringify(
					validate.errors,
				)}`,
			);
		}
	}
}

function markdownList(
	items: Array<{ title: string; detail?: string }>,
): string {
	return items.length
		? items
				.map(
					(item) =>
						`- **${item.title}**${item.detail ? ` — ${item.detail}` : ""}`,
				)
				.join("\n")
		: "_None recorded._";
}

function renderProjection(
	projection: FieldLogProjection,
	generatedThrough: number,
): string {
	const latestSources = projection.sources.slice(-3).reverse();
	const journalItems = groupFieldLogEntries(projection.entries);
	const lines = [
		"---",
		"type: field-log",
		"format: field-log/v1",
		"event-stream: ./field_log.jsonl",
		`generated-through: ${generatedThrough}`,
		`title: ${JSON.stringify(projection.title)}`,
		projection.openedAt ? `opened-at: ${projection.openedAt}` : "",
		projection.updatedAt ? `updated-at: ${projection.updatedAt}` : "",
		"---",
		"",
		`# ${projection.title}`,
		"",
		projection.scope ? `> ${projection.scope}` : "",
		"",
		"## Opening question",
		"",
		projection.openingQuestion || "_Not recorded._",
		"",
		"## Current working question",
		"",
		projection.currentQuestion ||
			projection.openingQuestion ||
			"_Not recorded._",
		"",
		"## Open Questions",
		"",
		markdownList(projection.questions),
		"",
		"## Source shelf",
		"",
		latestSources.length
			? latestSources
					.map(
						(source) =>
							`- **${source.title}**${source.url ? ` — ${source.url}` : ""} — ${source.coverage ?? "collected"}`,
					)
					.join("\n")
			: "_No sources recorded._",
		projection.sources.length > latestSources.length
			? `\n[View all ${projection.sources.length} sources](?file=field_log.md&page=artifacts&kind=source)`
			: "",
		"",
		"## Key Terms",
		"",
		markdownList(projection.terms),
		"",
		"## Current tensions",
		"",
		markdownList(projection.tensions),
		"",
		"## Plan and open gaps",
		"",
		markdownList(projection.plan),
		"",
		"## Synthesis",
		"",
		projection.synthesis || "_No synthesis has been requested or recorded._",
		"",
		"## Chronological log",
		"",
		...journalItems.flatMap((item) => {
			if (item.type === "source-group") {
				return [
					`### ${item.sources.length} ${item.sources.length === 1 ? "source" : "sources"} examined`,
					"",
					`_${item.recordedAt ?? "Time not recorded"}_`,
					"",
					`Source activity is folded here for readability. [Browse the complete source record](?file=field_log.md&page=artifacts&kind=source).`,
					"",
				];
			}
			const { entry } = item;
			return [
				`### ${entry.title}`,
				"",
				`_${entry.recordedAt ?? "Time not recorded"}${entry.instrumentId ? ` · ${entry.instrumentId}` : ""}_`,
				"",
				entry.kind === "comment" && entry.context ? `_${entry.context}_` : "",
				"",
				entry.kind === "comment"
					? `> **${entry.speaker ?? "User"}:** “${entry.summary}”`
					: entry.summary,
				"",
			];
		}),
	];
	return `${lines
		.filter((line, index) => line || lines[index - 1] !== "")
		.join("\n")
		.trim()}\n`;
}

async function stageProjection(
	path: string,
	events: StoredEvent[],
): Promise<() => Promise<void>> {
	const projection = projectFieldLogEvents(events);
	const markdown = renderProjection(projection, events.at(-1)?.eventId ?? 0);
	return stageTextReplacement(path, markdown);
}

function isWithin(directory: string, path: string): boolean {
	const pathFromDirectory = relative(directory, path);
	return (
		pathFromDirectory === "" ||
		(!pathFromDirectory.startsWith(`..${sep}`) &&
			pathFromDirectory !== ".." &&
			!isAbsolute(pathFromDirectory))
	);
}

interface StagedSourceCopies {
	commit: () => Promise<void>;
	discard: () => Promise<void>;
}

async function stageTransientSourceCopies(
	root: string,
	events: StoredEvent[],
): Promise<StagedSourceCopies> {
	const canonicalRoot = await realpath(root);
	const unstableRoots = await Promise.all(
		[
			resolve(homedir(), "Desktop"),
			resolve(homedir(), "Downloads"),
			resolve(tmpdir()),
		].map(async (path) => realpath(path).catch(() => path)),
	);
	const copies: Array<{
		temporary: string;
		target: string;
		committed: boolean;
	}> = [];

	try {
		for (const event of events) {
			if (event.type !== "source.collected") continue;
			const originalPath = event.payload.path;
			if (typeof originalPath !== "string" || !isAbsolute(originalPath))
				continue;
			const canonicalSource = await realpath(originalPath).catch(() => null);
			if (!canonicalSource || isWithin(canonicalRoot, canonicalSource))
				continue;
			if (!unstableRoots.some((path) => isWithin(path, canonicalSource)))
				continue;

			const sourceId = Number(event.payload.sourceId);
			const relativeTarget = `sources/${sourceId}-${basename(canonicalSource)}`;
			const target = resolve(root, relativeTarget);
			const temporary = `${target}.${process.pid}.${randomUUID()}.tmp`;
			await mkdir(dirname(target), { recursive: true });
			await access(target)
				.then(() => {
					throw new Error(
						`Refusing to replace existing copied source: ${target}`,
					);
				})
				.catch((error: NodeJS.ErrnoException) => {
					if (error.code !== "ENOENT") throw error;
				});
			await copyFile(canonicalSource, temporary);
			copies.push({ temporary, target, committed: false });
			event.payload = {
				...event.payload,
				path: relativeTarget,
				originalPath,
				...(typeof event.payload.origin === "string"
					? {}
					: { origin: `local file: ${originalPath}` }),
			};
		}
	} catch (error) {
		await Promise.all(
			copies.map(({ temporary }) => rm(temporary, { force: true })),
		);
		throw error;
	}

	return {
		commit: async () => {
			try {
				for (const copy of copies) {
					await rename(copy.temporary, copy.target);
					copy.committed = true;
				}
			} catch (error) {
				await Promise.all(
					copies.flatMap((copy) => [
						rm(copy.temporary, { force: true }),
						...(copy.committed ? [rm(copy.target, { force: true })] : []),
					]),
				);
				throw error;
			}
		},
		discard: async () => {
			await Promise.all(
				copies.flatMap((copy) => [
					rm(copy.temporary, { force: true }),
					...(copy.committed ? [rm(copy.target, { force: true })] : []),
				]),
			);
		},
	};
}

async function appendStoredEvents(
	path: string,
	events: StoredEvent[],
): Promise<void> {
	await appendJsonLines(path, events);
}

async function writeProjection(
	path: string,
	events: StoredEvent[],
): Promise<void> {
	const commit = await stageProjection(path, events);
	await commit();
}

export async function validateFieldLog(
	directory: string,
): Promise<StoredEvent[]> {
	const target = paths(directory);
	const events = await readStoredEvents(target.events);
	if (events.length === 0) throw new Error("Field Log has no events.");
	await validateInstrumentSchemas(target.root, events);
	return events;
}

export async function initializeFieldLog(
	directory: string,
	input: unknown,
): Promise<MutationReceipt> {
	const target = paths(directory);
	await mkdir(target.root, { recursive: true });
	const release = await acquireFieldLogLock(target.lock);
	try {
		const existing = await readStoredEvents(target.events);
		if (existing.length) throw new Error("Field Log already exists.");
		const [event] = assignEvents([], [input]);
		if (event?.type !== "trip.created")
			throw new Error("field-log init requires one trip.created event.");
		validateHistory([event]);
		validateEventSemantics(event);
		const commitProjection = await stageProjection(target.markdown, [event]);
		await appendStoredEvents(target.events, [event]);
		try {
			await commitProjection();
			return { eventIds: [event.eventId] };
		} catch (error) {
			return {
				eventIds: [event.eventId],
				projectionWarning:
					error instanceof Error ? error.message : "Projection update failed.",
			};
		}
	} finally {
		await release();
	}
}

export async function appendFieldLogEvents(
	directory: string,
	input: unknown | unknown[],
): Promise<MutationReceipt> {
	const target = paths(directory);
	const release = await acquireFieldLogLock(target.lock);
	try {
		const existing = await readStoredEvents(target.events);
		if (!existing.length) throw new Error("Initialize the Field Log first.");
		const submitted = Array.isArray(input) ? input : [input];
		if (!submitted.length) throw new Error("No events supplied.");
		const assigned = assignEvents(existing, submitted);
		for (const event of assigned) validateEventSemantics(event);
		const proposed = [...existing, ...assigned];
		validateHistory(proposed);
		await validateInstrumentSchemas(target.root, assigned);
		const sourceCopies = await stageTransientSourceCopies(
			target.root,
			assigned,
		);
		let commitProjection: () => Promise<void>;
		try {
			commitProjection = await stageProjection(target.markdown, proposed);
			await sourceCopies.commit();
		} catch (error) {
			await sourceCopies.discard();
			throw error;
		}
		await appendStoredEvents(target.events, assigned);
		const last = assigned.at(-1);
		const runId =
			typeof last?.payload.runId === "number" ? last.payload.runId : undefined;
		const entry =
			last?.payload.entry && typeof last.payload.entry === "object"
				? (last.payload.entry as Record<string, unknown>)
				: null;
		const entryId =
			entry && typeof entry.entryId === "number"
				? entry.entryId
				: typeof last?.payload.entryId === "number"
					? last.payload.entryId
					: undefined;
		const receipt: MutationReceipt = {
			eventIds: assigned.map((event) => event.eventId),
			runId,
			entryId,
			relativeHref: entryId
				? `?file=field_log.md&entry=entry-${entryId}${runId ? `&readout=${runId}` : ""}`
				: undefined,
		};
		try {
			await commitProjection();
		} catch (error) {
			receipt.projectionWarning =
				error instanceof Error ? error.message : "Projection update failed.";
		}
		return receipt;
	} finally {
		await release();
	}
}

export async function renderFieldLog(directory: string): Promise<void> {
	const target = paths(directory);
	const release = await acquireFieldLogLock(target.lock);
	try {
		const events = await validateFieldLog(target.root);
		await writeProjection(target.markdown, events);
	} finally {
		await release();
	}
}

export function fieldLogLink(entryId: number, runId?: number): string {
	if (!Number.isInteger(entryId) || entryId < 1)
		throw new Error("entryId must be a positive integer.");
	return `?file=field_log.md&entry=entry-${entryId}${runId ? `&readout=${runId}` : ""}`;
}
