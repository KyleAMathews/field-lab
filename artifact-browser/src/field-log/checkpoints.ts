import { z } from "zod";

export const checkpointSchema = z.object({
	workflowId: z.number().int().positive(),
	round: z.number().int().positive(),
	section: z.enum([
		"lineage",
		"anchor",
		"phase-start",
		"tension",
		"hidden-question",
		"frontier",
		"loop",
		"gaps",
		"context",
	]),
	markdown: z.string().trim().min(1),
	title: z.string().trim().min(1).optional(),
	eventRefs: z.array(z.number().int().positive()).optional(),
});

interface CheckpointEvent {
	type?: string;
	eventId?: number;
	payload?: Record<string, unknown>;
}

/** Full history remains in JSONL; this view indexes the latest section per round. */
export function checkpointIndex(events: CheckpointEvent[]) {
	const latest = new Map<
		string,
		{
			workflowId: number;
			round: number;
			section: string;
			eventId: number | undefined;
			entryId: unknown;
		}
	>();
	for (const event of events) {
		if (event.type !== "workflow.checkpoint.recorded") continue;
		const parsed = checkpointSchema.safeParse(event.payload);
		if (!parsed.success) continue;
		const { workflowId, round, section } = parsed.data;
		latest.set(`${workflowId}:${round}:${section}`, {
			workflowId,
			round,
			section,
			eventId: event.eventId,
			entryId: event.payload?.entryId,
		});
	}
	return [...latest.values()];
}

export function validateCheckpoints(events: CheckpointEvent[]): void {
	const anchors = new Set<string>();
	for (const event of events) {
		if (event.type !== "workflow.checkpoint.recorded") continue;
		const checkpoint = checkpointSchema.parse(event.payload);
		if (checkpoint.section === "anchor") {
			const key = `${checkpoint.workflowId}:${checkpoint.round}`;
			if (anchors.has(key))
				throw new Error(`Round ${key} already has a frozen anchor.`);
			anchors.add(key);
		}
		for (const ref of checkpoint.eventRefs ?? []) {
			if (ref >= (event.eventId ?? 0))
				throw new Error(
					`Checkpoint eventRefs must name earlier events; found ${ref}.`,
				);
		}
	}
}
