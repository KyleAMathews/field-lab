import type {
	BehaviorId,
	ConformanceEvent,
	ConformanceResult,
	Verdict,
} from "./model";
import { evaluateConformance } from "./model";

export type TraceActor = "user" | "agent" | "tool" | "system" | "subagent";

export interface TraceEvent {
	id: string;
	actor: TraceActor;
	action: string;
	content: string;
	metadata?: Record<string, unknown>;
}

export interface AgentTrajectory {
	id: string;
	description?: string;
	complete: boolean;
	events: TraceEvent[];
}

export interface ExtractedConformanceEvent {
	sourceEventId: string;
	event: ConformanceEvent;
	rationale: string;
}

export interface TraceCitation {
	eventId: string;
	description: string;
}

export type NaReason =
	| "not_applicable"
	| "insufficient_evidence"
	| "behavior_not_judgeable";

export interface TrajectoryBehaviorResult {
	behavior: BehaviorId;
	verdict: Verdict;
	citations: TraceCitation[];
	violations: Array<{
		eventId: string;
		message: string;
	}>;
	naReason: NaReason | null;
}

export interface TrajectoryConformanceResult {
	trajectoryId: string;
	behaviors: Record<BehaviorId, TrajectoryBehaviorResult>;
	semanticEventCount: number;
	unclassifiedEventIds: string[];
	model: ConformanceResult;
}

function traceIndexFor(
	trajectory: AgentTrajectory,
	sourceEventId: string,
): number {
	const index = trajectory.events.findIndex(
		(event) => event.id === sourceEventId,
	);
	if (index < 0)
		throw new Error(
			`Conformance extraction cites unknown trace event ${sourceEventId}.`,
		);
	return index;
}

function assertUniqueEventIds(trajectory: AgentTrajectory): void {
	const ids = new Set<string>();
	for (const event of trajectory.events) {
		if (!event.id.trim()) throw new Error("Trace event IDs must not be empty.");
		if (ids.has(event.id))
			throw new Error(`Trace event ID ${event.id} occurs more than once.`);
		ids.add(event.id);
	}
}

/**
 * Runs the deterministic XState kernel over semantics extracted from a raw trace.
 * The raw event IDs remain the only citation surface.
 */
export function evaluateTrajectoryConformance(
	trajectory: AgentTrajectory,
	extraction: ExtractedConformanceEvent[],
): TrajectoryConformanceResult {
	assertUniqueEventIds(trajectory);
	const sourceIndexBySemanticIndex = extraction.map((item) =>
		traceIndexFor(trajectory, item.sourceEventId),
	);
	const semanticEvents = extraction.map((item, semanticIndex) => ({
		...item.event,
		traceIndex: sourceIndexBySemanticIndex[semanticIndex],
	})) as ConformanceEvent[];
	const model = evaluateConformance(semanticEvents);
	const classifiedIds = new Set(extraction.map((item) => item.sourceEventId));
	const eventIdAt = (traceIndex: number): string => {
		const event = trajectory.events[traceIndex];
		if (!event)
			throw new Error(
				`Conformance model cited missing trace index ${traceIndex}.`,
			);
		return event.id;
	};

	const behaviors = Object.fromEntries(
		Object.entries(model.behaviors).map(
			([behaviorId, behavior]): [BehaviorId, TrajectoryBehaviorResult] => {
				const behaviorKey = behaviorId as BehaviorId;
				const violations = behavior.violations.map((violation) => ({
					eventId: eventIdAt(violation.traceIndex),
					message: violation.message,
				}));
				const evidenceIds = [
					...new Set(behavior.evidence.map((index) => eventIdAt(index))),
				];
				const modelVerdict = behavior.verdict;
				const verdict =
					!trajectory.complete && modelVerdict === "true" ? "na" : modelVerdict;
				const naReason =
					verdict !== "na"
						? null
						: trajectory.complete
							? "not_applicable"
							: "insufficient_evidence";
				return [
					behaviorKey,
					{
						behavior: behaviorKey,
						verdict,
						citations: evidenceIds.map((eventId) => ({
							eventId,
							description: `Visible evidence for ${behaviorKey}.`,
						})),
						violations,
						naReason,
					},
				];
			},
		),
	) as Record<BehaviorId, TrajectoryBehaviorResult>;

	return {
		trajectoryId: trajectory.id,
		behaviors,
		semanticEventCount: extraction.length,
		unclassifiedEventIds: trajectory.events
			.filter((event) => !classifiedIds.has(event.id))
			.map((event) => event.id),
		model,
	};
}

export function serializeTrajectory(trajectory: AgentTrajectory): string {
	return JSON.stringify(
		{ complete: trajectory.complete, events: trajectory.events },
		null,
		2,
	);
}
