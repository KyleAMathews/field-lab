import {
	access,
	appendFile,
	mkdir,
	open,
	readFile,
	rename,
	unlink,
	writeFile,
} from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import matter from "gray-matter";
import { z } from "zod";
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

const storedAuthorizationSchema = z.object({
	kind: z.string().min(1),
	pointer: z.string().min(1),
	verbatim: z.string().min(1).optional(),
});

const submittedEventSchema = z
	.object({
		type: z.string().min(1),
		actor: actorSchema,
		authorization: submittedAuthorizationSchema.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.passthrough()
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

const storedEventSchema = z.object({
	schema: z.literal("field-log/v1"),
	eventId: z.number().int().positive(),
	type: z.string().min(1),
	recordedAt: z.iso.datetime({ offset: true }),
	actor: actorSchema,
	authorization: storedAuthorizationSchema.optional(),
	payload: z.record(z.string(), z.unknown()),
});

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

async function acquireLock(path: string): Promise<() => Promise<void>> {
	try {
		const handle = await open(path, "wx");
		await handle.writeFile(`${process.pid}\n`);
		await handle.close();
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
		const owner = Number((await readFile(path, "utf8").catch(() => "")).trim());
		let live = false;
		if (Number.isInteger(owner) && owner > 0) {
			try {
				process.kill(owner, 0);
				live = true;
			} catch (ownerError) {
				live = (ownerError as NodeJS.ErrnoException).code === "EPERM";
			}
		}
		if (live) throw new Error(`Field Log is locked by process ${owner}.`);
		await unlink(path);
		const handle = await open(path, "wx");
		await handle.writeFile(`${process.pid}\n`);
		await handle.close();
	}
	return () => unlink(path).catch(() => undefined);
}

async function readStoredEvents(path: string): Promise<StoredEvent[]> {
	const source = await readFile(path, "utf8").catch((error) => {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
		throw error;
	});
	const parsed = parseEventStream(source);
	return parsed.map((event, index) => {
		const stored = storedEventSchema.parse(event);
		if (stored.eventId !== index + 1)
			throw new Error(
				`Expected eventId ${index + 1}, found ${stored.eventId}.`,
			);
		return stored;
	});
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

async function writeProjection(
	path: string,
	events: StoredEvent[],
): Promise<void> {
	const projection = projectFieldLogEvents(events);
	const markdown = renderProjection(projection, events.at(-1)?.eventId ?? 0);
	const temporary = `${path}.${process.pid}.tmp`;
	await writeFile(temporary, markdown, "utf8");
	await rename(temporary, path);
}

export async function validateFieldLog(
	directory: string,
): Promise<StoredEvent[]> {
	const target = paths(directory);
	const events = await readStoredEvents(target.events);
	if (events.length === 0) throw new Error("Field Log has no events.");
	validateHistory(events);
	await validateInstrumentSchemas(target.root, events);
	return events;
}

export async function initializeFieldLog(
	directory: string,
	input: unknown,
): Promise<MutationReceipt> {
	const target = paths(directory);
	await mkdir(target.root, { recursive: true });
	const release = await acquireLock(target.lock);
	try {
		const existing = await readStoredEvents(target.events);
		if (existing.length) throw new Error("Field Log already exists.");
		const [event] = assignEvents([], [input]);
		if (event?.type !== "trip.created")
			throw new Error("field-log init requires one trip.created event.");
		validateHistory([event]);
		await appendFile(target.events, `${JSON.stringify(event)}\n`, "utf8");
		await writeProjection(target.markdown, [event]);
		return { eventIds: [event.eventId] };
	} finally {
		await release();
	}
}

export async function appendFieldLogEvents(
	directory: string,
	input: unknown | unknown[],
): Promise<MutationReceipt> {
	const target = paths(directory);
	const release = await acquireLock(target.lock);
	try {
		const existing = await readStoredEvents(target.events);
		if (!existing.length) throw new Error("Initialize the Field Log first.");
		const submitted = Array.isArray(input) ? input : [input];
		if (!submitted.length) throw new Error("No events supplied.");
		const assigned = assignEvents(existing, submitted);
		const proposed = [...existing, ...assigned];
		validateHistory(proposed);
		await validateInstrumentSchemas(target.root, assigned);
		await appendFile(
			target.events,
			`${assigned.map((event) => JSON.stringify(event)).join("\n")}\n`,
			"utf8",
		);
		await writeProjection(target.markdown, proposed);
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
		return {
			eventIds: assigned.map((event) => event.eventId),
			runId,
			entryId,
			relativeHref: entryId
				? `?file=field_log.md&entry=entry-${entryId}${runId ? `&readout=${runId}` : ""}`
				: undefined,
		};
	} finally {
		await release();
	}
}

export async function renderFieldLog(directory: string): Promise<void> {
	const target = paths(directory);
	const release = await acquireLock(target.lock);
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
