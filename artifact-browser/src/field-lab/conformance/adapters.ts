import type { StoredEvent } from "../../field-log/writer";
import type {
	ConformanceEvent,
	TaskGrant,
	TypedInstrumentResult,
} from "./model";
import type {
	AgentTrajectory,
	ExtractedConformanceEvent,
	TraceActor,
} from "./trajectory";

export const CONFORMANCE_ACTION = "field_lab.conformance";

interface ExplicitConformanceMetadata extends Record<string, unknown> {
	event: ConformanceEvent;
	rationale?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(
	value: unknown,
	field: string,
	allowEmpty = false,
): string {
	if (typeof value !== "string" || (!allowEmpty && !value.trim()))
		throw new Error(`Explicit conformance field ${field} must be a string.`);
	return value;
}

function requireStrings(value: unknown, field: string): string[] {
	if (!Array.isArray(value) || value.some((item) => typeof item !== "string"))
		throw new Error(
			`Explicit conformance field ${field} must be a string array.`,
		);
	return value;
}

const taskGrants = new Set<TaskGrant>([
	"examine",
	"synthesize",
	"recommend",
	"decide",
	"plan",
	"act",
	"publish",
]);

function requireTask(value: unknown): TaskGrant {
	if (typeof value !== "string" || !taskGrants.has(value as TaskGrant))
		throw new Error(`Unknown Field Lab task grant ${String(value)}.`);
	return value as TaskGrant;
}

export function parseExplicitConformanceEvent(
	value: unknown,
): ConformanceEvent {
	if (!isRecord(value) || typeof value.type !== "string")
		throw new Error("Explicit conformance metadata requires an event type.");
	switch (value.type) {
		case "user.task.granted":
		case "assistant.task.performed":
			return { type: value.type, task: requireTask(value.task) };
		case "user.method.granted":
		case "assistant.method.offered":
		case "assistant.method.started":
			return {
				type: value.type,
				methodId: requireString(value.methodId, "methodId"),
			};
		case "user.queue.granted":
		case "user.queue.revised":
			return {
				type: value.type,
				methodIds: requireStrings(value.methodIds, "methodIds"),
			};
		case "user.workflow.granted":
			return {
				type: value.type,
				fixedMethodIds: requireStrings(value.fixedMethodIds, "fixedMethodIds"),
			};
		case "user.record.granted":
		case "assistant.record.mutated":
		case "assistant.direct.answer":
		case "assistant.stopped":
			return { type: value.type };
		case "user.branch.granted":
		case "assistant.branch.taken":
			return {
				type: value.type,
				branchId: requireString(value.branchId, "branchId"),
			};
		case "assistant.method.completed":
			if (!isRecord(value.result))
				throw new Error("Completed method metadata requires result.");
			return {
				type: value.type,
				methodId: requireString(value.methodId, "methodId"),
				result: value.result,
			};
		case "assistant.method.failed":
		case "assistant.method.stopped":
			return {
				type: value.type,
				methodId: requireString(value.methodId, "methodId"),
				reason: requireString(value.reason, "reason", true),
				residue: requireString(value.residue, "residue", true),
			};
		case "assistant.branch.offered":
			if (typeof value.explained !== "boolean")
				throw new Error("Branch offer metadata requires explained.");
			return {
				type: value.type,
				branchIds: requireStrings(value.branchIds, "branchIds"),
				explained: value.explained,
			};
		case "assistant.queue.revision.requested":
			return {
				type: value.type,
				reason: requireString(value.reason, "reason"),
			};
		default:
			throw new Error(`Unknown explicit conformance event ${value.type}.`);
	}
}

/** Reads only explicit semantic annotations. It never infers authority from prose. */
export function extractExplicitConformanceEvents(
	trajectory: AgentTrajectory,
): ExtractedConformanceEvent[] {
	return trajectory.events.flatMap((traceEvent) => {
		if (traceEvent.action !== CONFORMANCE_ACTION) return [];
		if (!isRecord(traceEvent.metadata))
			throw new Error(
				`Trace event ${traceEvent.id} requires conformance metadata.`,
			);
		const metadata = traceEvent.metadata as ExplicitConformanceMetadata;
		return [
			{
				sourceEventId: traceEvent.id,
				event: parseExplicitConformanceEvent(metadata.event),
				rationale:
					typeof metadata.rationale === "string"
						? metadata.rationale
						: "Explicit Field Lab conformance event.",
			},
		];
	});
}

function traceActor(kind: string): TraceActor {
	if (kind === "user" || kind === "human") return "user";
	if (kind === "tool") return "tool";
	if (kind === "system") return "system";
	if (kind === "subagent") return "subagent";
	return "agent";
}

function stringField(
	record: Record<string, unknown>,
	key: string,
): string | undefined {
	const value = record[key];
	return typeof value === "string" ? value : undefined;
}

function typedResult(
	payload: Record<string, unknown>,
): Partial<TypedInstrumentResult> {
	const entry = isRecord(payload.entry) ? payload.entry : undefined;
	const candidates = [payload.result, entry?.result, entry];
	for (const candidate of candidates) {
		if (!isRecord(candidate)) continue;
		const readings = Array.isArray(candidate.readings)
			? candidate.readings.filter(isRecord).map((reading) => ({
					kind: reading.kind as TypedInstrumentResult["readings"][number]["kind"],
					text: typeof reading.text === "string" ? reading.text : "",
					support: typeof reading.support === "string" ? reading.support : "",
				}))
			: undefined;
		return {
			readings,
			calibration: stringField(candidate, "calibration"),
			artifactRisk: stringField(candidate, "artifactRisk"),
			unmeasured: stringField(candidate, "unmeasured"),
		};
	}
	return {};
}

function fieldLogSemantics(event: StoredEvent): ConformanceEvent[] {
	const payload = event.payload;
	const instrumentId = stringField(payload, "instrumentId") ?? "";
	const recordMutation: ConformanceEvent = { type: "assistant.record.mutated" };
	switch (event.type) {
		case "trip.created":
			return [{ type: "user.record.granted" }, recordMutation];
		case "instrument.run.selected":
			return [
				{ type: "user.method.granted", methodId: instrumentId },
				recordMutation,
			];
		case "instrument.run.started":
			return [
				{ type: "assistant.method.started", methodId: instrumentId },
				recordMutation,
			];
		case "instrument.run.completed":
			return [
				{
					type: "assistant.method.completed",
					methodId: instrumentId,
					result: typedResult(payload),
				},
				recordMutation,
			];
		case "instrument.run.failed":
		case "instrument.run.stopped":
			return [
				{
					type:
						event.type === "instrument.run.failed"
							? "assistant.method.failed"
							: "assistant.method.stopped",
					methodId: instrumentId,
					reason:
						stringField(payload, "reason") ??
						stringField(payload, "error") ??
						"",
					residue: stringField(payload, "residue") ?? "",
				},
				recordMutation,
			];
		case "synthesis.recorded":
			return [
				{ type: "user.task.granted", task: "synthesize" },
				{ type: "assistant.task.performed", task: "synthesize" },
				recordMutation,
			];
		case "workflow.selected": {
			const fixedMethodIds = Array.isArray(payload.fixedMethodIds)
				? payload.fixedMethodIds.filter(
						(methodId): methodId is string => typeof methodId === "string",
					)
				: [];
			return fixedMethodIds.length
				? [{ type: "user.workflow.granted", fixedMethodIds }, recordMutation]
				: [recordMutation];
		}
		default:
			return [recordMutation];
	}
}

export interface FieldLogTrajectory {
	trajectory: AgentTrajectory;
	extraction: ExtractedConformanceEvent[];
}

/**
 * Adapts the canonical JSONL record. A Field Log is a partial agent trace unless
 * the caller can prove that it contains the whole trajectory.
 */
export function adaptFieldLogEvents(
	events: StoredEvent[],
	options: { id: string; description?: string; complete?: boolean },
): FieldLogTrajectory {
	const trajectory: AgentTrajectory = {
		id: options.id,
		description: options.description,
		complete: options.complete ?? false,
		events: events.map((event) => ({
			id: `field-log:${event.eventId}`,
			actor: traceActor(event.actor.kind),
			action: event.type,
			content: JSON.stringify(event.payload),
			metadata: {
				schema: event.schema,
				recordedAt: event.recordedAt,
				authorization: event.authorization,
				payload: event.payload,
			},
		})),
	};
	const extraction = events.flatMap((event) =>
		fieldLogSemantics(event).map((semanticEvent) => ({
			sourceEventId: `field-log:${event.eventId}`,
			event: semanticEvent,
			rationale: `Direct projection of ${event.type}.`,
		})),
	);
	return { trajectory, extraction };
}
