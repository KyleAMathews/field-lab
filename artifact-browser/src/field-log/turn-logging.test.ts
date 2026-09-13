import { mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	fieldLogDelta,
	fieldLogState,
	inspectFieldLog,
	readFieldLogItem,
} from "./reader";
import {
	appendFieldLogEvents,
	initializeFieldLog,
	validateFieldLog,
} from "./writer";

const actor = { kind: "orchestrator" };
const selection = {
	kind: "user-selection",
	pointer: "turn-2",
	verbatim: "Yes, start Phase 1.",
};
const event = (
	type: string,
	payload: Record<string, unknown>,
	authorization?: unknown,
) => ({ type, actor, payload, ...(authorization ? { authorization } : {}) });
const checkpoint = (section: string, markdown: string, round = 1) =>
	event(
		"workflow.checkpoint.recorded",
		{
			workflowId: 1,
			round,
			section,
			markdown,
		},
		["anchor", "phase-start"].includes(section) ? selection : undefined,
	);

async function fixture() {
	const directory = await mkdtemp(join(tmpdir(), "kit-turn-"));
	await initializeFieldLog(
		directory,
		event(
			"trip.created",
			{
				title: "Leadership",
				openingQuestion: "What makes teaching useful?",
				scope: "Understand teaching generally.",
			},
			{
				kind: "artifact-consent",
				pointer: "turn-1",
				verbatim: "Start a Field Log.",
			},
		),
	);
	await appendFieldLogEvents(directory, [
		event("workflow.selected", { name: "dialectic" }, selection),
		event("workflow.started", { workflowId: 1 }),
		checkpoint(
			"lineage",
			"Round 1 begins from the original question, event 1.",
		),
		checkpoint("anchor", "What makes teaching useful?"),
		checkpoint(
			"phase-start",
			"Phase 1: frame and ground. Opening card: assistant-turn-1. Return a provisional frame for correction.",
		),
		event("question.added", { role: "current", text: "What did you notice?" }),
		event("instrument.run.selected", { instrumentId: "elenchus" }, selection),
		event("instrument.run.started", { instrumentId: "elenchus", runId: 1 }),
	]);
	return directory;
}

describe("Kit turn logging and recovery", () => {
	it("records an interview correction once and recovers its state without a control log", async () => {
		const directory = await fixture();
		const exact =
			"I'm asking generally—not about my job.\nKeep that distinction. 🧭";
		const receipt = await appendFieldLogEvents(
			directory,
			[
				event("comment.recorded", { text: exact }),
				event("trip.context.recorded", {
					scope: "Understand teaching generally, beyond the user's job.",
				}),
				event("question.answered", {
					questionId: 1,
					answer: "The question is general.",
				}),
				event("question.added", {
					role: "current",
					text: "What teaching changed your mind?",
				}),
			],
			{ expectedEventId: 9 },
		);
		expect(receipt.latestEventId).toBe(13);
		expect(receipt.reminder).toContain("Reuse latestEventId");
		expect(receipt.entities?.[0]).toMatchObject({ commentId: 1 });
		expect(receipt.entities?.[3]).toMatchObject({ questionId: 2 });
		const state = await fieldLogState(directory);
		expect(state.writeHelp.interviewEvents["comment.recorded"]).toContain(
			"Exact text",
		);
		expect(state.writeHelp.append).toContain("--expected-event");
		expect(state.currentQuestionId).toBe("question-2");
		expect(state.scope.text).toContain("beyond the user's job");
		expect(state.runs.items).toMatchObject([{ runId: 1, status: "running" }]);
		expect(state.workflows.items[0]?.status).toBe("started");
		expect(
			state.checkpoints.items.find((item) => item.section === "anchor")
				?.markdown.text,
		).toBe("What makes teaching useful?");
		expect(
			(await validateFieldLog(directory))
				.filter((item) => item.type === "comment.recorded")
				.map((item) => item.payload.text),
		).toEqual([exact]);
		expect((await readdir(directory)).sort()).toEqual([
			"field_log.jsonl",
			"field_log.md",
		]);
	});

	it("keeps round history, full checkpoint text, and links when a completion is not last", async () => {
		const directory = await fixture();
		const receipt = await appendFieldLogEvents(directory, [
			event("instrument.run.completed", {
				instrumentId: "elenchus",
				runId: 1,
				entry: {
					markdown: "Full bounded reading.",
					summary: "An assumption became visible.",
				},
			}),
			checkpoint(
				"loop",
				"Pass 1: research selected by user turn 3. Keep the anchor; inspect the missing case.",
			),
			checkpoint("gaps", "Missing a contrasting case."),
			checkpoint(
				"gaps",
				"Contrasting case found; coverage now needs checking.",
			),
			checkpoint("lineage", "Round 2 follows round 1, loop event 11.", 2),
			checkpoint("anchor", "When does repetition help?", 2),
			event("question.added", {
				role: "return-to",
				text: "What remains unclear?",
			}),
		]);
		expect(receipt.entryId).toBeUndefined();
		expect(receipt.entities?.[0]).toMatchObject({
			runId: 1,
			entryId: 4,
			relativeHref: "?file=field_log.md&entry=entry-4&readout=1",
		});
		expect((await fieldLogState(directory)).checkpoints.round).toBe(2);
		const firstRound = await fieldLogState(directory, { round: 1 });
		expect(
			firstRound.checkpoints.items.find((item) => item.section === "gaps")
				?.markdown.text,
		).toContain("coverage now");
		expect(
			(await readFieldLogItem(directory, { eventId: 12 })).event?.payload
				.markdown,
		).toBe("Missing a contrasting case.");
		const saved = await readFieldLogItem(directory, { entryId: 5 });
		expect("markdown" in saved && saved.markdown).toContain(
			"research selected",
		);
		expect(await readFile(join(directory, "field_log.md"), "utf8")).toContain(
			"Round 2 follows round 1",
		);
	});

	it("rejects anchor replacement, missing phase authority, invalid workflow and forward references atomically", async () => {
		const directory = await fixture();
		const before = await readFile(join(directory, "field_log.jsonl"), "utf8");
		for (const invalid of [
			checkpoint("anchor", "A rewritten original."),
			event("workflow.checkpoint.recorded", {
				workflowId: 1,
				round: 1,
				section: "phase-start",
				markdown: "Phase 2",
			}),
			event("workflow.checkpoint.recorded", {
				workflowId: 8,
				round: 1,
				section: "gaps",
				markdown: "Unknown workflow.",
			}),
			event("workflow.checkpoint.recorded", {
				workflowId: 1,
				round: 1,
				section: "gaps",
				markdown: "Invalid reference.",
				eventRefs: [999],
			}),
		]) {
			await expect(
				appendFieldLogEvents(directory, [
					event("comment.recorded", { text: "Must not partially commit." }),
					invalid,
				]),
			).rejects.toThrow();
			expect(await readFile(join(directory, "field_log.jsonl"), "utf8")).toBe(
				before,
			);
		}
	});

	it("detects stale state and pages every intervening event before a reassessed retry", async () => {
		const directory = await fixture();
		await appendFieldLogEvents(
			directory,
			event("comment.recorded", { text: "Another writer's correction." }),
			{ expectedEventId: 9 },
		);
		await expect(
			appendFieldLogEvents(directory, checkpoint("gaps", "Stale change."), {
				expectedEventId: 9,
			}),
		).rejects.toThrow("latest event 10");
		const delta = await fieldLogDelta(directory, 8, 1);
		expect(delta).toMatchObject({
			latestEventId: 10,
			nextEventId: 9,
			hasMore: true,
		});
		const next = await fieldLogDelta(directory, delta.nextEventId, 1);
		expect(next.events[0]?.payload.text).toBe("Another writer's correction.");
		expect(next.hasMore).toBe(false);
		await appendFieldLogEvents(
			directory,
			checkpoint("gaps", "Reassessed change."),
			{ expectedEventId: next.latestEventId },
		);
		expect((await validateFieldLog(directory)).length).toBe(11);
	});

	it("allows at most one competing write against the same version", async () => {
		const directory = await fixture();
		const results = await Promise.allSettled(
			["A", "B"].map((text) =>
				appendFieldLogEvents(directory, event("comment.recorded", { text }), {
					expectedEventId: 9,
				}),
			),
		);
		expect(
			results.filter((result) => result.status === "fulfilled"),
		).toHaveLength(1);
		expect(await validateFieldLog(directory)).toHaveLength(10);
	});

	it("bounds recovery output, exposes truncation, and retrieves full omitted content", async () => {
		const directory = await fixture();
		await appendFieldLogEvents(directory, [
			...Array.from({ length: 150 }, (_, i) =>
				event("comment.recorded", {
					text: `Comment ${i}: ${"detail ".repeat(1000)}`,
				}),
			),
			checkpoint("gaps", "gap ".repeat(1000)),
		]);
		const state = await fieldLogState(directory, { limit: 3 });
		expect(state.entries.items).toHaveLength(3);
		expect(state.entries.omitted).toBeGreaterThan(140);
		const gap = state.checkpoints.items.find((item) => item.section === "gaps");
		if (!gap) throw new Error("Missing gap checkpoint.");
		expect(gap.markdown.truncated).toBe(true);
		expect(JSON.stringify(state).length).toBeLessThan(8000);
		expect(
			(await readFieldLogItem(directory, { eventId: gap.eventId })).event
				?.payload.markdown,
		).toBe("gap ".repeat(1000));
		expect((await inspectFieldLog(directory)).entries.length).toBeGreaterThan(
			150,
		);
		await expect(fieldLogState(directory, { limit: 0 })).rejects.toThrow(
			"limit",
		);
		await expect(fieldLogDelta(directory, 999)).rejects.toThrow("exceeds");
	});

	it("recovers omitted workflows and clipped titles through full inspection", async () => {
		const directory = await fixture();
		const title = "Detailed workflow ".repeat(100);
		await appendFieldLogEvents(directory, [
			event("workflow.selected", { name: "Another workflow" }, selection),
			event("workflow.selected", { name: title }, selection),
		]);
		const state = await fieldLogState(directory, { limit: 1 });
		expect(state.workflows.omitted).toBe(2);
		expect(state.workflows.items[0]?.title.truncated).toBe(true);
		const full = await inspectFieldLog(directory);
		expect(full.workflows).toHaveLength(3);
		expect(full.workflows[2]?.title).toBe(title);
		expect(full.openingQuestion).toBe("What makes teaching useful?");
		expect(full.currentQuestionId).toBe("question-1");
	});

	it("still detects corrupt old history during compact recovery and writes", async () => {
		const directory = await fixture();
		const path = join(directory, "field_log.jsonl");
		const source = await readFile(path, "utf8");
		await writeFile(path, source.replace('"eventId":1,', '"eventId":7,'));
		await expect(fieldLogState(directory)).rejects.toThrow(
			"Expected eventId 1",
		);
		await expect(
			appendFieldLogEvents(directory, checkpoint("gaps", "New gap.")),
		).rejects.toThrow("Expected eventId 1");
	});
});
