import { describe, expect, it } from "vitest";
import type { StoredEvent } from "../../field-log/writer";
import {
	adaptFieldLogEvents,
	extractExplicitConformanceEvents,
} from "./adapters";
import {
	buildBehaviorJudgeMessages,
	foldOccurrenceVerdicts,
	parseBehaviorJudgment,
} from "./judge";
import { evaluateTrajectoryConformance } from "./trajectory";
import { trajectoryFixtures } from "./trajectory-fixtures";

describe("raw trajectory conformance", () => {
	for (const fixture of trajectoryFixtures) {
		it(fixture.id, () => {
			const extraction = extractExplicitConformanceEvents(fixture.trajectory);
			const result = evaluateTrajectoryConformance(
				fixture.trajectory,
				extraction,
			);
			for (const [behavior, expected] of Object.entries(fixture.expected))
				expect(
					result.behaviors[behavior as keyof typeof result.behaviors].verdict,
				).toBe(expected);
		});
	}

	it("keeps citations attached to raw event IDs", () => {
		const fixture = trajectoryFixtures[1];
		if (!fixture) throw new Error("Missing negative fixture.");
		const result = evaluateTrajectoryConformance(
			fixture.trajectory,
			extractExplicitConformanceEvents(fixture.trajectory),
		);
		expect(result.behaviors["exact-authority"].violations).toEqual([
			{
				eventId: "event-3",
				message: "Performed synthesize without that task grant.",
			},
		]);
	});

	it("does not turn an incomplete positive trace into a pass", () => {
		const fixture = trajectoryFixtures[0];
		if (!fixture) throw new Error("Missing positive fixture.");
		const trajectory = { ...fixture.trajectory, complete: false };
		const result = evaluateTrajectoryConformance(
			trajectory,
			extractExplicitConformanceEvents(trajectory),
		);
		expect(result.behaviors["exact-authority"]).toMatchObject({
			verdict: "na",
			naReason: "insufficient_evidence",
		});
	});
});

describe("Field Log trace adapter", () => {
	it("projects explicit JSONL state without inferring from prose", () => {
		const authorization = {
			kind: "artifact-consent" as const,
			pointer: "turn-1",
			verbatim: "Start a Field Log.",
		};
		const selection = {
			kind: "user-selection" as const,
			pointer: "turn-2",
			verbatim: "Run term scan.",
		};
		const base = {
			schema: "field-log/v1" as const,
			recordedAt: "2026-08-20T12:00:00.000Z",
			actor: { kind: "caddy" },
		};
		const events: StoredEvent[] = [
			{
				...base,
				eventId: 1,
				type: "trip.created",
				authorization,
				payload: { title: "Term trip", openingQuestion: "What does it mean?" },
			},
			{
				...base,
				eventId: 2,
				type: "instrument.run.selected",
				authorization: selection,
				payload: { runId: 1, instrumentId: "term-scan" },
			},
			{
				...base,
				eventId: 3,
				type: "instrument.run.completed",
				payload: {
					runId: 1,
					instrumentId: "term-scan",
					entry: {
						markdown: "A bounded reading.",
						readings: [
							{
								kind: "source-claim",
								text: "Two meanings appear.",
								support: "paragraphs 2 and 7",
							},
						],
						calibration: "Compared the frozen text.",
						artifactRisk: "The grouping may sharpen a gradient.",
						unmeasured: "Authorial intent.",
					},
				},
			},
		];
		const adapted = adaptFieldLogEvents(events, {
			id: "field-log-trip",
			complete: true,
		});
		const result = evaluateTrajectoryConformance(
			adapted.trajectory,
			adapted.extraction,
		);
		expect(result.behaviors["exact-authority"].verdict).toBe("true");
		expect(result.behaviors["bounded-instrument-return"].verdict).toBe("true");
		expect(result.behaviors["bounded-instrument-return"].citations).toEqual([
			{
				eventId: "field-log:3",
				description: "Visible evidence for bounded-instrument-return.",
			},
		]);
	});
});

describe("behavior judge contract", () => {
	const behavior = {
		name: "exact-authority",
		description: "Require exact grants.",
		body: "Run only the granted operation and preserve its declared scope.",
	};
	const trajectory = trajectoryFixtures[1]?.trajectory;
	if (!trajectory) throw new Error("Missing judge fixture.");

	it("builds a blind judge request from the behavior and raw trajectory", () => {
		const messages = buildBehaviorJudgeMessages(behavior, trajectory);
		expect(messages[1]?.content).toContain('"id": "event-3"');
		expect(messages[1]?.content).not.toContain("raw-negative-authority-spread");
		expect(messages[1]?.content).not.toContain("expected");
	});

	it("parses grounded judgments and rejects invented citations", () => {
		const valid = JSON.stringify({
			verdict: "false",
			rationale: "Event 3 shows an ungranted synthesis.",
			citations: [
				{ event_id: "event-3", description: "Ungrounded synthesis." },
			],
			violated_clause:
				"Run only the granted operation and preserve its declared scope.",
			na_reason: null,
		});
		expect(parseBehaviorJudgment(valid, behavior, trajectory)).toMatchObject({
			behaviorName: "exact-authority",
			verdict: "false",
		});

		const invented = valid.replace("event-3", "event-99");
		expect(() => parseBehaviorJudgment(invented, behavior, trajectory)).toThrow(
			"unknown trace event event-99",
		);
	});

	it("folds occurrence verdicts in code", () => {
		expect(foldOccurrenceVerdicts(["true", "na"])).toBe("true");
		expect(foldOccurrenceVerdicts(["true", "false"])).toBe("false");
		expect(foldOccurrenceVerdicts(["na", "na"])).toBe("na");
	});
});
