import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	appendFieldLogEvents,
	initializeFieldLog,
	validateFieldLog,
} from "../field-log/writer";
import {
	joinFieldTrip,
	promoteFieldLogEntry,
	removePromotion,
	searchExpedition,
} from "./operations";
import {
	initializeExpeditionLog,
	inspectExpeditionLog,
	validateExpeditionLog,
} from "./writer";

const actor = { kind: "orchestrator", pointer: "expedition-test" };
const artifactConsent = {
	kind: "artifact-consent" as const,
	pointer: "turn-1",
	verbatim: "Create the Expedition and add this Field Trip.",
};
const directories: string[] = [];

afterEach(async () => {
	await Promise.all(
		directories.splice(0).map((path) => rm(path, { recursive: true })),
	);
});

describe("Expedition Log writer", () => {
	it("resumes a join after the Field Log membership commits", async () => {
		const parent = await mkdtemp(join(tmpdir(), "expedition-log-"));
		directories.push(parent);
		const expedition = join(parent, "expedition");
		const trip = join(expedition, "field-trips", "partial-trip");
		await mkdir(trip, { recursive: true });
		await initializeExpeditionLog(expedition, {
			type: "expedition.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "Recovery", territory: "Retry a partial join." },
		});
		await initializeFieldLog(trip, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: {
				title: "Partial trip",
				openingQuestion: "Can the join resume?",
			},
		});
		await appendFieldLogEvents(trip, {
			type: "trip.expedition.joined",
			actor,
			authorization: artifactConsent,
			payload: { path: "../../expedition_log.md" },
		});

		const recovered = await joinFieldTrip(expedition, trip, {
			actor,
			authorization: artifactConsent,
		});
		expect(recovered).toMatchObject({
			tripId: 1,
			path: "field-trips/partial-trip",
		});
		const resumed = await joinFieldTrip(expedition, trip, {
			actor,
			authorization: artifactConsent,
		});
		expect(resumed).toMatchObject({ tripId: 1, eventIds: [] });
		expect((await inspectExpeditionLog(expedition)).trips).toHaveLength(1);
		expect(await validateFieldLog(trip)).toHaveLength(2);
	});

	it("joins a trip and keeps only current promotions in the projection", async () => {
		const parent = await mkdtemp(join(tmpdir(), "expedition-log-"));
		directories.push(parent);
		const expedition = join(parent, "expedition");
		const trip = join(parent, "trip");
		await mkdir(trip);
		await initializeFieldLog(trip, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: {
				title: "First trip",
				openingQuestion: "What did we learn?",
				scope: "Inspect the first case.",
			},
		});
		await appendFieldLogEvents(trip, {
			type: "note.recorded",
			actor,
			payload: {
				title: "First summary",
				markdown: "The first durable finding.",
			},
		});
		await initializeExpeditionLog(expedition, {
			type: "expedition.created",
			actor,
			authorization: artifactConsent,
			payload: {
				title: "A linked inquiry",
				territory: "Find what carries from one Field Trip to the next.",
				openedAt: "2026-06-30T08:00:00-06:00",
			},
		});

		const joined = await joinFieldTrip(expedition, trip, {
			actor,
			authorization: artifactConsent,
		});
		expect(joined).toMatchObject({ tripId: 1, path: "field-trips/trip" });
		const movedTrip = join(expedition, joined.path);
		const tripEvents = await validateFieldLog(movedTrip);
		expect(tripEvents.at(-1)).toMatchObject({
			type: "trip.expedition.joined",
			payload: { path: "../../expedition_log.md" },
		});

		const first = await promoteFieldLogEntry(expedition, {
			tripId: 1,
			entryId: 1,
			rationale: "Summary of key findings from the Field Trip.",
		});
		expect(first.promotionId).toBe(1);
		await appendFieldLogEvents(movedTrip, {
			type: "note.recorded",
			actor,
			payload: {
				title: "Sharper summary",
				markdown: "The corrected durable finding.",
			},
		});
		const replacement = await promoteFieldLogEntry(expedition, {
			tripId: 1,
			entryId: 2,
			rationale: "Replace the early summary with the sharper one.",
			replacesPromotionId: 1,
		});
		expect(replacement.promotionId).toBe(2);

		const current = await inspectExpeditionLog(expedition);
		expect(current.openedAt).toBe("2026-06-30T08:00:00-06:00");
		expect(current.promotions).toEqual([
			expect.objectContaining({
				promotionId: 2,
				entryId: 2,
				title: "Sharper summary",
			}),
		]);
		const search = await searchExpedition(expedition, "first durable finding");
		expect(search.promotions).toEqual([]);
		const markdown = await readFile(
			join(expedition, "expedition_log.md"),
			"utf8",
		);
		expect(markdown).toContain(
			"### Sharper summary\n\nThe corrected durable finding.",
		);
		expect(markdown).toContain(
			"[Open full entry](?file=./expedition_log.md&promotion=promotion-2)",
		);
		expect(markdown).toContain("[See entry in Field Log]");
		expect(markdown).not.toContain("### First summary");

		await removePromotion(expedition, 2);
		expect((await inspectExpeditionLog(expedition)).promotions).toEqual([]);
		expect(await validateExpeditionLog(expedition)).toHaveLength(5);
	});
});
