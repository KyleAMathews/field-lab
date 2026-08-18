import { readFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { projectFieldLogEvents } from "./projection";
import { type StoredEvent, validateFieldLog } from "./writer";

export interface FieldLogReadModel {
	directory: string;
	events: StoredEvent[];
	projection: ReturnType<typeof projectFieldLogEvents>;
}

export interface FieldLogSearchHit {
	trip: string;
	tripTitle: string;
	kind: "event" | "entry" | "readout" | "source";
	eventId?: number;
	entryId?: number;
	entry?: string;
	runId?: number;
	sourceId?: number;
	title: string;
	snippet: string;
	path?: string;
	coverage?: "collected" | "examined";
}

function numberValue(value: unknown): number | undefined {
	return typeof value === "number" && Number.isInteger(value)
		? value
		: undefined;
}

function entryValue(event: StoredEvent): Record<string, unknown> | undefined {
	return event.payload.entry && typeof event.payload.entry === "object"
		? (event.payload.entry as Record<string, unknown>)
		: undefined;
}

function entryId(event: StoredEvent): number | undefined {
	return numberValue(entryValue(event)?.entryId ?? event.payload.entryId);
}

function textValue(value: unknown): string {
	return typeof value === "string" ? value : "";
}

function snippet(source: string, query: string, size = 240): string {
	const normalized = source.replace(/\r\n?/g, "\n").trim();
	const index = normalized
		.toLocaleLowerCase()
		.indexOf(query.toLocaleLowerCase());
	if (index < 0) return normalized.slice(0, size);
	const initialStart = Math.max(0, index - Math.floor(size / 3));
	const precedingBreak = normalized.lastIndexOf("\n", initialStart);
	const precedingSpace = normalized.lastIndexOf(" ", initialStart);
	const start =
		precedingBreak >= 0
			? precedingBreak + 1
			: precedingSpace >= 0
				? precedingSpace + 1
				: initialStart;
	const initialEnd = Math.min(normalized.length, start + size);
	const followingBreak = normalized.indexOf("\n", initialEnd);
	const followingSpace = normalized.indexOf(" ", initialEnd);
	const end =
		followingBreak >= 0 && followingBreak - initialEnd <= 80
			? followingBreak
			: followingSpace >= 0 && followingSpace - initialEnd <= 40
				? followingSpace
				: initialEnd;
	return `${start > 0 ? "…\n\n" : ""}${normalized.slice(start, end)}${end < normalized.length ? "\n\n…" : ""}`;
}

function eventMarkdown(event: StoredEvent): string {
	const entry = entryValue(event);
	return (
		textValue(entry?.markdown) ||
		textValue(event.payload.markdown) ||
		textValue(event.payload.text) ||
		textValue(event.payload.exactText) ||
		textValue(event.payload.summary) ||
		JSON.stringify(event.payload)
	);
}

function eventTitle(event: StoredEvent): string {
	const entry = entryValue(event);
	return (
		textValue(entry?.title) ||
		textValue(event.payload.title) ||
		textValue(event.payload.instrumentId) ||
		event.type
	);
}

function eventEntry(event: StoredEvent, model: FieldLogReadModel) {
	const eventId = event.eventId;
	const runId = numberValue(event.payload.runId);
	let id: string | undefined;
	switch (event.type) {
		case "comment.recorded":
			id = `comment-${numberValue(event.payload.commentId) ?? eventId}`;
			break;
		case "note.recorded":
		case "synthesis.recorded":
			id = `entry-${entryId(event) ?? eventId}`;
			break;
		case "source.collected":
			id = `source-collected-${eventId}`;
			break;
		case "source.examined":
			id = `source-examined-${eventId}`;
			break;
		case "question.answered":
			id = `question-answered-${eventId}`;
			break;
		case "question.reopened":
			id = `question-reopened-${eventId}`;
			break;
		case "plan.item.moved":
			id = `plan-moved-${eventId}`;
			break;
		case "plan.item.completed":
			id = `plan-completed-${eventId}`;
			break;
		case "instrument.run.completed":
			id = `entry-${entryId(event) ?? eventId}`;
			break;
		case "instrument.run.failed":
		case "instrument.run.stopped":
			id = `run-${runId ?? eventId}`;
			break;
		case "engine.result.recorded":
			id = `engine-${eventId}`;
			break;
	}
	const direct = id
		? model.projection.entries.find((entry) => entry.id === id)
		: undefined;
	return (
		direct ??
		(runId != null
			? model.projection.entries.find(
					(entry) => String(entry.runId) === String(runId),
				)
			: undefined)
	);
}

export async function readFieldLog(
	directory: string,
): Promise<FieldLogReadModel> {
	const root = resolve(directory);
	const events = await validateFieldLog(root);
	return { directory: root, events, projection: projectFieldLogEvents(events) };
}

export async function inspectFieldLog(directory: string) {
	const model = await readFieldLog(directory);
	return {
		format: "field-log-inspection/v1" as const,
		directory: model.directory,
		title: model.projection.title,
		openedAt: model.projection.openedAt,
		updatedAt: model.projection.updatedAt,
		latestEventId: model.events.at(-1)?.eventId,
		scope: model.projection.scope,
		currentQuestion: model.projection.currentQuestion,
		questions: model.projection.questions,
		sources: model.projection.sources,
		terms: model.projection.terms,
		tensions: model.projection.tensions,
		plan: model.projection.plan,
		runs: model.projection.runs,
		entries: model.projection.entries.map(
			({ readoutMarkdown: _readoutMarkdown, ...entry }) => entry,
		),
	};
}

export async function readFieldLogItem(
	directory: string,
	selector: { entryId?: number; runId?: number; sourceId?: number },
) {
	const model = await readFieldLog(directory);
	if (selector.sourceId) {
		const collected = model.events.find(
			(event) =>
				event.type === "source.collected" &&
				numberValue(event.payload.sourceId) === selector.sourceId,
		);
		if (!collected)
			throw new Error(`Source ${selector.sourceId} was not found.`);
		const path = textValue(collected.payload.path);
		const absolutePath = isAbsolute(path)
			? path
			: resolve(model.directory, path);
		return {
			kind: "source" as const,
			sourceId: selector.sourceId,
			metadata: collected.payload,
			content: await readFile(absolutePath, "utf8"),
		};
	}
	const event = model.events.find((candidate) => {
		if (selector.entryId && entryId(candidate) === selector.entryId)
			return (
				selector.runId == null ||
				numberValue(candidate.payload.runId) === selector.runId
			);
		return (
			selector.runId != null &&
			numberValue(candidate.payload.runId) === selector.runId &&
			candidate.type === "instrument.run.completed"
		);
	});
	if (!event) throw new Error("The requested Field Log item was not found.");
	const projected = model.projection.entries.find(
		(entry) =>
			(selector.entryId != null && entry.id === `entry-${selector.entryId}`) ||
			(selector.runId != null && Number(entry.runId) === selector.runId),
	);
	return {
		kind:
			event.type === "instrument.run.completed"
				? ("readout" as const)
				: ("entry" as const),
		event,
		entry: projected,
		markdown:
			projected?.readoutMarkdown ||
			textValue(entryValue(event)?.markdown) ||
			textValue(event.payload.markdown),
	};
}

export async function searchFieldLog(
	directory: string,
	query: string,
): Promise<FieldLogSearchHit[]> {
	const trimmed = query.trim();
	if (!trimmed) throw new Error("Search requires a non-empty query.");
	const model = await readFieldLog(directory);
	const needle = trimmed.toLocaleLowerCase();
	const hits: FieldLogSearchHit[] = [];
	for (const event of model.events) {
		const searchable = JSON.stringify(event.payload);
		if (!searchable.toLocaleLowerCase().includes(needle)) continue;
		const candidateEntryId = entryId(event);
		const runId = numberValue(event.payload.runId);
		const projectedEntry = eventEntry(event, model);
		hits.push({
			trip: model.directory,
			tripTitle: model.projection.title,
			kind:
				event.type === "instrument.run.completed"
					? "readout"
					: candidateEntryId
						? "entry"
						: "event",
			eventId: event.eventId,
			entryId: candidateEntryId,
			entry: projectedEntry?.id,
			runId,
			title: eventTitle(event),
			snippet: snippet(eventMarkdown(event), trimmed),
		});
	}

	const examinations = new Set(
		model.events
			.filter((event) => event.type === "source.examined")
			.map((event) => numberValue(event.payload.sourceId))
			.filter((value): value is number => value != null),
	);
	for (const event of model.events) {
		if (event.type !== "source.collected") continue;
		const sourceId = numberValue(event.payload.sourceId);
		const path = textValue(event.payload.path);
		if (!sourceId || !path) continue;
		const absolutePath = isAbsolute(path)
			? path
			: resolve(model.directory, path);
		const content = await readFile(absolutePath, "utf8").catch(() => null);
		if (!content?.toLocaleLowerCase().includes(needle)) continue;
		hits.push({
			trip: model.directory,
			tripTitle: model.projection.title,
			kind: "source",
			sourceId,
			title: textValue(event.payload.title) || `Source ${sourceId}`,
			snippet: snippet(content, trimmed),
			path,
			coverage: examinations.has(sourceId) ? "examined" : "collected",
		});
	}
	return hits;
}
