import { mkdir, readFile } from "node:fs/promises";
import { isAbsolute, normalize, resolve } from "node:path";
import { z } from "zod";
import {
	acquireLogLock,
	appendJsonLines,
	stageTextReplacement,
} from "../log/filesystem";
import {
	renderExpeditionProjection,
	resolveExpeditionProjection,
} from "./projection";

const actorSchema = z.object({
	kind: z.string().min(1),
	pointer: z.string().min(1).optional(),
});
const authorizationSchema = z.object({
	kind: z.enum(["artifact-consent", "user-selection", "user-request"]),
	pointer: z.string().min(1),
	verbatim: z.string().trim().min(1),
});
const submittedSchema = z
	.object({
		type: z.string().min(1),
		actor: actorSchema,
		authorization: authorizationSchema.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.strict();
const storedSchema = z
	.object({
		schema: z.literal("expedition-log/v1"),
		eventId: z.number().int().positive(),
		type: z.string().min(1),
		recordedAt: z.iso.datetime({ offset: true }),
		actor: actorSchema,
		authorization: authorizationSchema.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.strict();

export type StoredExpeditionEvent = z.infer<typeof storedSchema>;

export interface ExpeditionMutationReceipt {
	eventIds: number[];
	tripId?: number;
	promotionId?: number;
	relativeHref?: string;
	projectionWarning?: string;
}

function paths(directory: string) {
	const root = resolve(directory);
	return {
		root,
		events: resolve(root, "expedition_log.jsonl"),
		markdown: resolve(root, "expedition_log.md"),
		lock: resolve(root, ".expedition_log.lock"),
	};
}

function stringRequired(
	payload: Record<string, unknown>,
	type: string,
	key: string,
): void {
	if (typeof payload[key] !== "string" || !payload[key].trim())
		throw new Error(`${type} requires non-empty payload.${key}.`);
}

function positiveId(
	payload: Record<string, unknown>,
	type: string,
	key: string,
): number {
	const value = payload[key];
	if (!Number.isInteger(value) || Number(value) < 1)
		throw new Error(`${type} requires positive payload.${key}.`);
	return Number(value);
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

function validateSemantics(event: StoredExpeditionEvent): void {
	const { type, payload } = event;
	if (
		(type === "expedition.created" || type === "trip.joined") &&
		event.authorization?.kind !== "artifact-consent"
	)
		throw new Error(`${type} requires authorization.kind artifact-consent.`);
	switch (type) {
		case "expedition.created":
			stringRequired(payload, type, "title");
			stringRequired(payload, type, "territory");
			validateImportedTimestamp(payload, type, "openedAt");
			break;
		case "expedition.title.updated":
			stringRequired(payload, type, "title");
			break;
		case "trip.joined":
			positiveId(payload, type, "tripId");
			stringRequired(payload, type, "path");
			if (
				isAbsolute(String(payload.path)) ||
				normalize(String(payload.path)).startsWith("..") ||
				!normalize(String(payload.path)).startsWith(`field-trips/`)
			)
				throw new Error("trip.joined path must stay under field-trips/.");
			break;
		case "entry.promoted":
			positiveId(payload, type, "promotionId");
			positiveId(payload, type, "tripId");
			positiveId(payload, type, "entryId");
			stringRequired(payload, type, "rationale");
			break;
		case "entry.removed":
			positiveId(payload, type, "promotionId");
			break;
		default:
			throw new Error(`Unknown Expedition event type: ${type}.`);
	}
}

function validateHistory(events: StoredExpeditionEvent[]): void {
	if (events[0]?.type !== "expedition.created")
		throw new Error("The first Expedition event must be expedition.created.");
	if (
		events.filter((event) => event.type === "expedition.created").length !== 1
	)
		throw new Error("An Expedition has exactly one expedition.created event.");
	const trips = new Set<number>();
	const paths = new Set<string>();
	const active = new Set<number>();
	const promotionIds = new Set<number>();
	for (const event of events) {
		validateSemantics(event);
		if (event.type === "trip.joined") {
			const tripId = Number(event.payload.tripId);
			const path = String(event.payload.path);
			if (trips.has(tripId) || paths.has(path))
				throw new Error("A Field Trip may join an Expedition only once.");
			trips.add(tripId);
			paths.add(path);
		}
		if (event.type === "entry.promoted") {
			const tripId = Number(event.payload.tripId);
			if (!trips.has(tripId))
				throw new Error(`Promotion refers to unknown trip ${tripId}.`);
			const promotionId = Number(event.payload.promotionId);
			if (promotionIds.has(promotionId))
				throw new Error(`Duplicate promotion ID ${promotionId}.`);
			promotionIds.add(promotionId);
			const replaces = Number(event.payload.replacesPromotionId || 0);
			if (replaces) {
				if (!active.has(replaces))
					throw new Error(`Cannot replace inactive promotion ${replaces}.`);
				active.delete(replaces);
			}
			active.add(promotionId);
		}
		if (event.type === "entry.removed") {
			const promotionId = Number(event.payload.promotionId);
			if (!active.has(promotionId))
				throw new Error(`Cannot remove inactive promotion ${promotionId}.`);
			active.delete(promotionId);
		}
	}
}

export function parseAndValidateExpeditionLog(
	source: string,
): StoredExpeditionEvent[] {
	const events = source
		.split(/\r?\n/)
		.filter((line) => line.trim())
		.map((line, index) => {
			const event = storedSchema.parse(JSON.parse(line));
			if (event.eventId !== index + 1)
				throw new Error(
					`Expected eventId ${index + 1}, found ${event.eventId}.`,
				);
			return event;
		});
	if (events.length) validateHistory(events);
	return events;
}

async function readEvents(path: string): Promise<StoredExpeditionEvent[]> {
	const source = await readFile(path, "utf8").catch((error) => {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
		throw error;
	});
	return parseAndValidateExpeditionLog(source);
}

function assignEvents(
	existing: StoredExpeditionEvent[],
	inputs: unknown[],
): StoredExpeditionEvent[] {
	let tripId = Math.max(
		0,
		...existing.map((event) => Number(event.payload.tripId || 0)),
	);
	let promotionId = Math.max(
		0,
		...existing.map((event) => Number(event.payload.promotionId || 0)),
	);
	return inputs.map((input, index) => {
		const parsed = submittedSchema.parse(input);
		const payload = { ...parsed.payload };
		if (parsed.type === "trip.joined") {
			if (payload.tripId != null) throw new Error("The CLI assigns tripId.");
			payload.tripId = ++tripId;
		}
		if (parsed.type === "entry.promoted") {
			if (payload.promotionId != null)
				throw new Error("The CLI assigns promotionId.");
			payload.promotionId = ++promotionId;
		}
		return storedSchema.parse({
			schema: "expedition-log/v1",
			eventId: existing.length + index + 1,
			type: parsed.type,
			recordedAt: new Date().toISOString(),
			actor: parsed.actor,
			authorization: parsed.authorization,
			payload,
		});
	});
}

async function stageProjection(
	target: ReturnType<typeof paths>,
	events: StoredExpeditionEvent[],
) {
	const projection = await resolveExpeditionProjection(target.root, events);
	return stageTextReplacement(
		target.markdown,
		renderExpeditionProjection(projection, events.at(-1)?.eventId ?? 0),
	);
}

export async function validateExpeditionLog(directory: string) {
	const target = paths(directory);
	const events = await readEvents(target.events);
	if (!events.length) throw new Error("Expedition Log has no events.");
	await resolveExpeditionProjection(target.root, events);
	return events;
}

export async function initializeExpeditionLog(
	directory: string,
	input: unknown,
): Promise<ExpeditionMutationReceipt> {
	const target = paths(directory);
	await mkdir(target.root, { recursive: true });
	const release = await acquireLogLock(target.lock, "Expedition Log");
	try {
		if ((await readEvents(target.events)).length)
			throw new Error("Expedition Log already exists.");
		const assigned = assignEvents([], [input]);
		if (assigned[0]?.type !== "expedition.created")
			throw new Error("expedition-log init requires expedition.created.");
		validateHistory(assigned);
		const commit = await stageProjection(target, assigned);
		await appendJsonLines(target.events, assigned);
		try {
			await commit();
			return { eventIds: [1] };
		} catch (error) {
			return {
				eventIds: [1],
				projectionWarning:
					error instanceof Error ? error.message : String(error),
			};
		}
	} finally {
		await release();
	}
}

export async function appendExpeditionEvents(
	directory: string,
	input: unknown | unknown[],
): Promise<ExpeditionMutationReceipt> {
	const target = paths(directory);
	const release = await acquireLogLock(target.lock, "Expedition Log");
	try {
		const existing = await readEvents(target.events);
		if (!existing.length)
			throw new Error("Initialize the Expedition Log first.");
		const assigned = assignEvents(
			existing,
			Array.isArray(input) ? input : [input],
		);
		const proposed = [...existing, ...assigned];
		validateHistory(proposed);
		const commit = await stageProjection(target, proposed);
		await appendJsonLines(target.events, assigned);
		const last = assigned.at(-1);
		const receipt: ExpeditionMutationReceipt = {
			eventIds: assigned.map((event) => event.eventId),
			tripId:
				typeof last?.payload.tripId === "number"
					? last.payload.tripId
					: undefined,
			promotionId:
				typeof last?.payload.promotionId === "number"
					? last.payload.promotionId
					: undefined,
		};
		if (receipt.promotionId)
			receipt.relativeHref = `?file=expedition_log.md#promotion-${receipt.promotionId}`;
		try {
			await commit();
		} catch (error) {
			receipt.projectionWarning =
				error instanceof Error ? error.message : String(error);
		}
		return receipt;
	} finally {
		await release();
	}
}

export async function renderExpeditionLog(directory: string): Promise<void> {
	const target = paths(directory);
	const release = await acquireLogLock(target.lock, "Expedition Log");
	try {
		const events = await validateExpeditionLog(target.root);
		await (await stageProjection(target, events))();
	} finally {
		await release();
	}
}

export async function inspectExpeditionLog(directory: string) {
	const target = paths(directory);
	const events = await validateExpeditionLog(target.root);
	return resolveExpeditionProjection(target.root, events);
}

export function expeditionLogLink(promotionId?: number): string {
	if (
		promotionId != null &&
		(!Number.isInteger(promotionId) || promotionId < 1)
	)
		throw new Error("promotionId must be a positive integer.");
	return `?file=expedition_log.md${promotionId ? `#promotion-${promotionId}` : ""}`;
}
