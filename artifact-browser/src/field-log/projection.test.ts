import { describe, expect, it } from "vitest";
import {
	parseEventStream,
	parseLegacyFieldLog,
	projectFieldLogEvents,
} from "./projection";

describe("Field Log projection", () => {
	it("ignores only an incomplete trailing JSONL record", () => {
		expect(
			parseEventStream(
				'{"eventId":1,"type":"trip.created","payload":{}}\n{"eventId":',
			),
		).toHaveLength(1);
		expect(() =>
			parseEventStream(
				'{"eventId":\n{"eventId":2,"type":"trip.created","payload":{}}\n',
			),
		).toThrow(/Line 1/);
	});
	it("projects the legacy dashboard, exact comments, and chronological runs", () => {
		const projection = parseLegacyFieldLog(`---
type: field-log
title: A trip
opened-at: 2026-07-27T10:00:00-06:00
opened-by: "Save this."
---
# A trip
## Original question
What is happening?
## Trip scope and goal
Stay bounded.
## Why the field log opened
The evidence needs to survive.
## Field lineage
- **Recorded at:** 2026-07-27T10:00:00-06:00 — Source one: https://example.com
## Instrument ledger
### \`term-scan\` — complete
- **Recorded at:** 2026-07-27T10:00:00-06:00
- **Authorization:** User said “Run it.”
- **Access delta:** A distinction appeared.
- **User feedback:** Confirmed: “That looks right.”
## Key readings
### One term carried two rules
- **Recorded at:** 2026-07-27T10:00:00-06:00
- **Reading:** The rules may conflict.
## Key Terms
- **Recorded at:** now — **Restraint:** Two rules.
## Current tensions
- **Recorded at:** now — The rules may conflict.
## Open gaps, collection plan, and stop rules
### Costly cases
- **Gap:** No costly case is known.
- **Selection state:** open
## Current working question
When does the rule become costly?
## Open Questions
- Which rule wins?
## Workflow ledger
No named workflow has been selected.
`);

		expect(projection.title).toBe("A trip");
		expect(projection.currentQuestion).toBe(
			"When does the rule become costly?",
		);
		expect(projection.questions[0]?.title).toBe("Which rule wins?");
		expect(projection.sources[0]?.url).toBe("https://example.com");
		expect(projection.entries.map((entry) => entry.summary)).toContain(
			"That looks right.",
		);
		expect(
			projection.entries.find((entry) => entry.kind === "instrument"),
		).toMatchObject({
			title: "One term carried two rules",
			summary: "The rules may conflict.",
		});
	});

	it("projects canonical events without inventing synthesis", () => {
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: "2026-07-29T09:00:00-06:00",
				payload: {
					title: "Open weights",
					openingQuestion: "Who controls release?",
				},
			},
			{
				eventId: 2,
				type: "comment.recorded",
				recordedAt: "2026-07-29T09:01:00-06:00",
				payload: {
					commentId: 1,
					speaker: "Kyle",
					text: "Yes.",
					context: "In response to whether the agent should run negation.",
				},
			},
			{
				eventId: 3,
				type: "instrument.run.completed",
				recordedAt: "2026-07-29T09:02:00-06:00",
				payload: {
					runId: 1,
					instrumentId: "negation",
					accessDelta: "Custody became visible.",
					entry: {
						entryId: 1,
						title: "The custody argument runs in reverse",
						markdown: "Concentrated custody is also a risk location.",
					},
				},
			},
		]);

		expect(projection.synthesis).toBeNull();
		expect(projection.entries).toHaveLength(2);
		expect(projection.entries[0]).toMatchObject({
			kind: "comment",
			summary: "Yes.",
			context: "In response to whether the agent should run negation.",
		});
		expect(projection.entries[1]).toMatchObject({
			runId: 1,
			status: "completed",
			summary: "Custody became visible.",
			readoutMarkdown: "Concentrated custody is also a risk location.",
		});
		expect(projection.runs[0]).toMatchObject({
			runId: 1,
			instrumentId: "negation",
			status: "completed",
		});
	});

	it("keeps field notes separate from explicitly recorded synthesis", () => {
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: "2026-07-29T09:00:00-06:00",
				payload: { title: "A trip", openingQuestion: "What changed?" },
			},
			{
				eventId: 2,
				type: "note.recorded",
				recordedAt: "2026-07-29T09:01:00-06:00",
				payload: {
					entryId: 1,
					title: "How to use the map",
					markdown: "Read the **legend** before comparing regions.",
				},
			},
			{
				eventId: 3,
				type: "synthesis.recorded",
				recordedAt: "2026-07-29T09:02:00-06:00",
				payload: {
					entryId: 2,
					title: "Requested synthesis",
					markdown: "The readings converge on a **custody gap**.",
				},
			},
		]);

		expect(projection.synthesis).toBe(
			"The readings converge on a **custody gap**.",
		);
		expect(projection.entries).toMatchObject([
			{
				id: "entry-1",
				kind: "note",
				title: "How to use the map",
			},
			{
				id: "entry-2",
				kind: "synthesis",
				title: "Requested synthesis",
			},
		]);
	});

	it("keeps unmeasured boundaries in a generated readout fallback", () => {
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: "2026-07-29T09:00:00-06:00",
				payload: { title: "A trip", openingQuestion: "What changed?" },
			},
			{
				eventId: 2,
				type: "instrument.run.completed",
				recordedAt: "2026-07-29T09:01:00-06:00",
				payload: {
					runId: 1,
					instrumentId: "probe",
					accessDelta: "One distinction appeared.",
					unmeasured: "No reader study was run.",
					entry: { entryId: 1, title: "A bounded reading" },
				},
			},
		]);

		expect(projection.entries[0]?.readoutMarkdown).toContain(
			"No reader study was run.",
		);
	});

	it("records source examination as a chronological milestone", () => {
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: "2026-07-29T09:00:00-06:00",
				payload: { title: "A trip", openingQuestion: "What changed?" },
			},
			{
				eventId: 2,
				type: "source.collected",
				recordedAt: "2026-07-29T09:01:00-06:00",
				payload: { sourceId: 1, title: "Writer source" },
			},
			{
				eventId: 3,
				type: "source.examined",
				recordedAt: "2026-07-29T09:02:00-06:00",
				payload: {
					sourceId: 1,
					coverage: "Examined assignment and locking, lines 20–180.",
				},
			},
		]);

		expect(projection.sources[0]?.coverage).toBe(
			"Examined assignment and locking, lines 20–180.",
		);
		expect(projection.entries.at(-1)).toMatchObject({
			id: "source-examined-3",
			sourceId: "source-1",
			title: "Writer source",
			summary: "Examined assignment and locking, lines 20–180.",
		});
	});

	it("uses recorded context to revise the displayed aim", () => {
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: "2026-07-29T09:00:00-06:00",
				payload: {
					title: "A trip",
					openingQuestion: "What should we investigate?",
					scope: "The precise aim remains open.",
				},
			},
			{
				eventId: 2,
				type: "trip.context.recorded",
				recordedAt: "2026-07-29T09:01:00-06:00",
				payload: {
					title: "Flour-first direction",
					scope:
						"Find unusual, obtainable flours and match each to yeast breads worth practicing.",
					text: "The user chose to begin with interesting flours.",
				},
			},
		]);

		expect(projection.scope).toBe(
			"Find unusual, obtainable flours and match each to yeast breads worth practicing.",
		);
		expect(projection.lineage[0]).toMatchObject({
			title: "Flour-first direction",
			detail: "The user chose to begin with interesting flours.",
		});
	});

	it("projects feedback, question reasons, and plan order", () => {
		const at = "2026-07-29T09:00:00-06:00";
		const projection = projectFieldLogEvents([
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: at,
				payload: { title: "A trip", openingQuestion: "What changed?" },
			},
			{
				eventId: 2,
				type: "question.added",
				recordedAt: at,
				payload: { questionId: 1, text: "Is it visible?" },
			},
			{
				eventId: 3,
				type: "question.answered",
				recordedAt: at,
				payload: { questionId: 1, answer: "Only in JSONL." },
			},
			{
				eventId: 4,
				type: "question.reopened",
				recordedAt: at,
				payload: { questionId: 1, reason: "Reader feedback is missing." },
			},
			...["Inspect", "Run", "Validate"].map((title, index) => ({
				eventId: index + 5,
				type: "plan.item.added",
				recordedAt: at,
				payload: {
					planItemId: index + 1,
					title,
					status: "queued",
				},
			})),
			{
				eventId: 8,
				type: "plan.item.moved",
				recordedAt: at,
				payload: { planItemId: 2, position: 3, reason: "Run is complete." },
			},
			{
				eventId: 9,
				type: "instrument.run.selected",
				recordedAt: at,
				payload: { runId: 1, instrumentId: "probe" },
			},
			{
				eventId: 10,
				type: "instrument.run.failed",
				recordedAt: at,
				payload: { runId: 1, instrumentId: "probe", reason: "Test failure." },
			},
			{
				eventId: 11,
				type: "instrument.feedback.recorded",
				recordedAt: at,
				payload: {
					runId: 1,
					status: "pending-user-review",
					text: "Needs a human check.",
				},
			},
		]);

		expect(projection.questions[0]).toMatchObject({
			status: "open",
			detail: "Reader feedback is missing.",
		});
		expect(projection.plan.map((item) => item.title)).toEqual([
			"Inspect",
			"Validate",
			"Run",
		]);
		expect(projection.plan[2]?.status).toBe("queued");
		expect(projection.runs[0]).toMatchObject({
			status: "failed",
			feedbackStatus: "pending-user-review",
			feedback: "Needs a human check.",
		});
		expect(projection.entries.map((entry) => entry.title)).toContain(
			"Question reopened: Is it visible?",
		);
		expect(projection.entries.map((entry) => entry.title)).toContain(
			"Plan moved: Run",
		);
	});

	it("keeps a revised question current until it is answered", () => {
		const at = "2026-07-29T09:00:00-06:00";
		const events = [
			{
				eventId: 1,
				type: "trip.created",
				recordedAt: at,
				payload: { title: "A trip", openingQuestion: "What changed?" },
			},
			{
				eventId: 2,
				type: "question.added",
				recordedAt: at,
				payload: {
					questionId: 1,
					text: "What should we inspect?",
					role: "current",
				},
			},
			{
				eventId: 3,
				type: "question.revised",
				recordedAt: at,
				payload: { questionId: 1, text: "Which source should we inspect?" },
			},
		];

		expect(projectFieldLogEvents(events.slice(0, 1)).currentQuestion).toBe(
			"What changed?",
		);
		expect(
			projectFieldLogEvents([
				events[0],
				{
					eventId: 2,
					type: "question.added",
					recordedAt: at,
					payload: {
						questionId: 1,
						text: "What should we revisit?",
						role: "return",
					},
				},
			]).currentQuestion,
		).toBe("What changed?");
		expect(projectFieldLogEvents(events).currentQuestion).toBe(
			"Which source should we inspect?",
		);
		expect(
			projectFieldLogEvents([
				...events,
				{
					eventId: 4,
					type: "question.answered",
					recordedAt: at,
					payload: { questionId: 1, answer: "The primary source." },
				},
			]).currentQuestion,
		).toBe("");
	});
});
