import { describe, expect, it } from "vitest";
import { conformanceFixtures } from "./fixtures";
import { evaluateConformance } from "./model";

describe("Field Lab behavior conformance", () => {
	for (const fixture of conformanceFixtures) {
		it(fixture.id, () => {
			const result = evaluateConformance(fixture.events);
			for (const [behavior, expected] of Object.entries(fixture.expected))
				expect(
					result.behaviors[behavior as keyof typeof result.behaviors].verdict,
				).toBe(expected);
		});
	}

	it("attaches trace evidence to every false verdict", () => {
		for (const fixture of conformanceFixtures) {
			const result = evaluateConformance(fixture.events);
			for (const behavior of Object.values(result.behaviors)) {
				if (behavior.verdict !== "false") continue;
				expect(behavior.violations.length).toBeGreaterThan(0);
				expect(
					behavior.violations.every((violation) => violation.traceIndex >= 0),
				).toBe(true);
			}
		}
	});
});
