import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	initializeExpeditionLog,
	inspectExpeditionLog,
} from "../expedition-log/writer";
import { validateFieldLog } from "../field-log/writer";
import { startTripInExpedition } from "./trip-start";

const directories: string[] = [];
const authorization = {
	kind: "artifact-consent" as const,
	pointer: "user-turn-7",
	verbatim: "Add the reactive API inquiry to the Neon Expedition.",
};
const actor = { kind: "orchestrator", pointer: "trip-start-test" };

afterEach(async () => {
	await Promise.all(
		directories.splice(0).map((path) => rm(path, { recursive: true })),
	);
});

describe("Field Lab trip start", () => {
	it("creates, joins, validates, and safely resumes one prepared trip", async () => {
		const parent = await mkdtemp(join(tmpdir(), "field-lab-trip-start-"));
		directories.push(parent);
		const expedition = join(parent, "neon-expedition");
		await initializeExpeditionLog(expedition, {
			type: "expedition.created",
			actor,
			authorization,
			payload: {
				title: "Neon product fieldwork",
				territory: "Product and platform questions after the acquisition.",
			},
		});
		const input = {
			operationId: "reactive-api-start",
			actor,
			authorization,
			trip: {
				title: "Neon reactive API design",
				openingQuestion: "What should a reactive Neon API expose?",
				scope:
					"Inspect reactive API shapes without choosing a product strategy.",
			},
			events: [
				{
					type: "comment.recorded",
					actor: { kind: "user", pointer: "user-turn-7" },
					payload: {
						speaker: "Kyle",
						text: "Add the reactive API inquiry to the Neon Expedition.",
					},
				},
				{
					type: "trip.context.recorded",
					actor,
					payload: {
						scope:
							"Inspect reactive API shapes without choosing a product strategy.",
						text: "The inquiry inherits the prior API design discussion.",
					},
				},
			],
		};

		const first = await startTripInExpedition(
			expedition,
			"neon-reactive-api-design",
			input,
		);
		expect(first.receipt).toMatchObject({
			status: "complete",
			stage: "validated",
			tripId: 1,
		});
		const trip = join(expedition, "field-trips", "neon-reactive-api-design");
		expect(await validateFieldLog(trip)).toHaveLength(4);
		expect((await inspectExpeditionLog(expedition)).trips).toEqual([
			expect.objectContaining({
				tripId: 1,
				path: "field-trips/neon-reactive-api-design",
			}),
		]);
		expect(
			JSON.parse(await readFile(first.recoveryReceipt, "utf8")),
		).toMatchObject({ status: "complete", operationId: "reactive-api-start" });

		const resumed = await startTripInExpedition(
			expedition,
			"neon-reactive-api-design",
			input,
		);
		expect(resumed.receipt.tripId).toBe(1);
		expect(await validateFieldLog(trip)).toHaveLength(4);
		expect((await inspectExpeditionLog(expedition)).trips).toHaveLength(1);
	});

	it("rejects a prepared batch that does not begin with the user comment", async () => {
		const parent = await mkdtemp(join(tmpdir(), "field-lab-trip-start-"));
		directories.push(parent);
		const expedition = join(parent, "expedition");
		await initializeExpeditionLog(expedition, {
			type: "expedition.created",
			actor,
			authorization,
			payload: { title: "Test", territory: "Test starts." },
		});
		await expect(
			startTripInExpedition(expedition, "bad-start", {
				authorization,
				trip: { title: "Bad", openingQuestion: "What is missing?" },
				events: [
					{
						type: "trip.context.recorded",
						actor,
						payload: { text: "No initiating comment." },
					},
				],
			}),
		).rejects.toThrow("initiating user comment");
	});
});
