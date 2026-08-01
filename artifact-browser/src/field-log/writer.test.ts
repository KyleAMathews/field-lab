import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	appendFieldLogEvents,
	initializeFieldLog,
	validateFieldLog,
} from "./writer";

const actor = { kind: "orchestrator", pointer: "test-task" };
const artifactConsent = {
	kind: "artifact-consent",
	pointer: "turn-1",
	verbatim: "Start a Field Log for this inquiry.",
};
const authorization = {
	kind: "user-selection",
	pointer: "turn-2",
	verbatim: "Run the negation instrument.",
};
const userRequest = {
	kind: "user-request",
	pointer: "turn-3",
	verbatim: "Synthesize these readings.",
};

describe("Field Log writer", () => {
	it("assigns IDs and timestamps, validates transitions, and regenerates Markdown", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: {
				title: "Open weights",
				openingQuestion: "Who should control release?",
				scope: "Read the custody argument closely.",
			},
		});
		const receipt = await appendFieldLogEvents(directory, [
			{
				type: "comment.recorded",
				actor: { kind: "user", pointer: "turn-2" },
				payload: {
					speaker: "Kyle",
					text: "Yes.",
					context: "In response to whether the agent should run negation.",
				},
			},
			{
				type: "instrument.run.selected",
				actor,
				authorization,
				payload: { instrumentId: "negation" },
			},
			{
				type: "instrument.run.completed",
				actor,
				payload: {
					instrumentId: "negation",
					accessDelta: "Custody became visible on both sides.",
					readings: [
						{
							kind: "inference",
							confidence: "plausible",
							text: "Concentrated custody is also a risk location.",
						},
					],
					control: "The reversal does not prove hostile intent.",
					artifactRisk: "Possibility can be mistaken for accusation.",
					entry: {
						title: "The custody argument runs in reverse",
						markdown: "Concentrated custody is also a risk location.",
					},
				},
			},
		]);

		expect(receipt).toMatchObject({
			eventIds: [2, 3, 4],
			runId: 1,
			entryId: 1,
		});
		const events = await validateFieldLog(directory);
		expect(events[1]?.payload.commentId).toBe(1);
		expect(events[2]?.payload.runId).toBe(1);
		expect(events[2]?.authorization?.verbatim).toBe(
			"Run the negation instrument.",
		);
		expect(events[3]?.payload.runId).toBe(1);
		expect(events[3]?.recordedAt).toMatch(/Z$/);
		const markdown = await readFile(join(directory, "field_log.md"), "utf8");
		expect(markdown).toContain("No synthesis");
		expect(markdown).toContain(
			"In response to whether the agent should run negation.",
		);
		expect(markdown).toContain("“Yes.”");
		expect(markdown).toContain("The custody argument runs in reverse");

		const nextReceipt = await appendFieldLogEvents(directory, [
			{
				type: "instrument.run.selected",
				actor,
				authorization,
				payload: { instrumentId: "term-scan" },
			},
			{
				type: "instrument.run.completed",
				actor,
				payload: {
					instrumentId: "term-scan",
					accessDelta: "The second distinction became visible.",
					entry: {
						title: "A second completion",
						markdown: "The second bounded readout.",
					},
				},
			},
		]);
		expect(nextReceipt).toMatchObject({
			runId: 2,
			entryId: 2,
			relativeHref: "?file=field_log.md&entry=entry-2&readout=2",
		});
	});

	it("rejects the wrong authorization reason or a missing verbatim quote", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Why?" },
		});
		const before = await readFile(join(directory, "field_log.jsonl"), "utf8");

		await expect(
			appendFieldLogEvents(directory, {
				type: "instrument.run.selected",
				actor,
				authorization: artifactConsent,
				payload: { instrumentId: "negation" },
			}),
		).rejects.toThrow(
			"instrument.run.selected requires authorization.kind user-selection",
		);

		await expect(
			appendFieldLogEvents(directory, {
				type: "instrument.run.selected",
				actor,
				authorization: {
					kind: "user-selection",
					pointer: "turn-2",
				},
				payload: { instrumentId: "negation" },
			}),
		).rejects.toThrow(
			"authorization.verbatim must quote the user's exact words",
		);

		expect(await readFile(join(directory, "field_log.jsonl"), "utf8")).toBe(
			before,
		);
	});

	it("records separate verbatim consent before an outside source may be published", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Why?" },
		});
		await appendFieldLogEvents(directory, {
			type: "source.collected",
			actor,
			payload: { path: "/outside/private-transcript.txt" },
		});

		await expect(
			appendFieldLogEvents(directory, {
				type: "source.publication.authorized",
				actor,
				authorization: userRequest,
				payload: { sourceId: 1 },
			}),
		).rejects.toThrow(
			"source.publication.authorized requires authorization.kind publication-consent",
		);

		await appendFieldLogEvents(directory, {
			type: "source.publication.authorized",
			actor,
			authorization: {
				kind: "publication-consent",
				pointer: "turn-4",
				verbatim: "Include the private transcript in the published package.",
			},
			payload: { sourceId: 1 },
		});

		const events = await validateFieldLog(directory);
		expect(events[2]?.authorization).toMatchObject({
			kind: "publication-consent",
			verbatim: "Include the private transcript in the published package.",
		});
	});

	it("requires one current question and an explicit handoff", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Where should we begin?" },
		});
		await appendFieldLogEvents(directory, {
			type: "question.added",
			actor,
			payload: { text: "What does the source mean?", role: "current" },
		});
		const before = await readFile(join(directory, "field_log.jsonl"), "utf8");

		await expect(
			appendFieldLogEvents(directory, {
				type: "question.added",
				actor,
				payload: { text: "What evidence supports it?", role: "current" },
			}),
		).rejects.toThrow("Only one open question may have role current");
		expect(await readFile(join(directory, "field_log.jsonl"), "utf8")).toBe(
			before,
		);

		await appendFieldLogEvents(directory, [
			{
				type: "question.revised",
				actor,
				payload: { questionId: 1, role: "return-to" },
			},
			{
				type: "question.added",
				actor,
				payload: { text: "What evidence supports it?", role: "current" },
			},
		]);

		const markdown = await readFile(join(directory, "field_log.md"), "utf8");
		expect(markdown).toContain("What evidence supports it?");
		expect(markdown).toContain("What does the source mean?");
	});

	it("fails before writing an illegal transition", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Why?" },
		});
		const before = await readFile(join(directory, "field_log.jsonl"), "utf8");
		await expect(
			appendFieldLogEvents(directory, {
				type: "instrument.run.completed",
				actor,
				payload: {
					runId: 1,
					instrumentId: "negation",
					entry: { title: "Invalid", markdown: "No selection." },
				},
			}),
		).rejects.toThrow("Illegal transition");
		expect(await readFile(join(directory, "field_log.jsonl"), "utf8")).toBe(
			before,
		);
	});

	it("records notes without synthesis and requires a direct user request for synthesis", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-writer-"));
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Why?" },
		});

		const noteReceipt = await appendFieldLogEvents(directory, {
			type: "note.recorded",
			actor,
			payload: {
				title: "How to read the instrument",
				markdown: "Start with the **frozen baseline**.",
			},
		});
		expect(noteReceipt).toMatchObject({
			eventIds: [2],
			entryId: 1,
			relativeHref: "?file=field_log.md&entry=entry-1",
		});

		await expect(
			appendFieldLogEvents(directory, {
				type: "synthesis.recorded",
				actor,
				payload: { markdown: "This should not be accepted." },
			}),
		).rejects.toThrow("requires authorization.kind user-request");

		await expect(
			appendFieldLogEvents(directory, {
				type: "synthesis.recorded",
				actor,
				authorization,
				payload: { markdown: "This is not a direct request." },
			}),
		).rejects.toThrow("authorization.kind user-request");

		await expect(
			appendFieldLogEvents(directory, {
				type: "engine.result.recorded",
				actor,
				authorization,
				payload: { markdown: "An ambiguous fallback." },
			}),
		).rejects.toThrow("legacy-only");

		const synthesisReceipt = await appendFieldLogEvents(directory, {
			type: "synthesis.recorded",
			actor,
			authorization: userRequest,
			payload: {
				title: "Requested synthesis",
				markdown: "The readings support a **bounded conclusion**.",
			},
		});
		expect(synthesisReceipt).toMatchObject({
			eventIds: [3],
			entryId: 2,
			relativeHref: "?file=field_log.md&entry=entry-2",
		});

		const markdown = await readFile(join(directory, "field_log.md"), "utf8");
		expect(markdown).toContain("### How to read the instrument");
		expect(markdown).toContain("Start with the **frozen baseline**.");
		expect(markdown).toContain("## Synthesis");
		expect(markdown).toContain(
			"The readings support a **bounded conclusion**.",
		);
	});
});
