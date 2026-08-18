import { describe, expect, it } from "vitest";
import { projectBrowserExpedition } from "./browser-projection";

function event(type: string, payload: Record<string, unknown>): string {
	return JSON.stringify({ type, payload });
}

describe("browser Expedition projection", () => {
	it("resolves current promotions and their Field Trip pointers", () => {
		const projection = projectBrowserExpedition(
			[
				event("trip.joined", { tripId: 1, path: "field-trips/first" }),
				event("entry.promoted", {
					promotionId: 1,
					tripId: 1,
					entryId: 3,
					runId: 2,
				}),
				event("entry.promoted", {
					promotionId: 2,
					tripId: 1,
					entryId: 5,
					replacesPromotionId: 1,
				}),
			].join("\n"),
		);

		expect(projection.trips).toEqual([
			{ tripId: 1, path: "field-trips/first" },
		]);
		expect(projection.promotions).toEqual([
			{ promotionId: 2, tripId: 1, entryId: 5, runId: undefined },
		]);
	});

	it("does not expose removed promotions", () => {
		const projection = projectBrowserExpedition(
			[
				event("entry.promoted", {
					promotionId: 1,
					tripId: 1,
					entryId: 3,
				}),
				event("entry.removed", { promotionId: 1 }),
			].join("\n"),
		);

		expect(projection.promotions).toEqual([]);
	});
});
