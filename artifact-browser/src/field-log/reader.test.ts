import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { inspectFieldLog, readFieldLogItem, searchFieldLog } from "./reader";
import { appendFieldLogEvents, initializeFieldLog } from "./writer";

const actor = { kind: "orchestrator", pointer: "reader-test" };
const artifactConsent = {
	kind: "artifact-consent" as const,
	pointer: "turn-1",
	verbatim: "Start a Field Log.",
};
const selection = {
	kind: "user-selection" as const,
	pointer: "turn-2",
	verbatim: "Run fracture.",
};
const directories: string[] = [];

afterEach(async () => {
	await Promise.all(
		directories.splice(0).map((path) => rm(path, { recursive: true })),
	);
});

describe("Field Log reader", () => {
	it("inspects compact projections and searches or reads full entries and sources", async () => {
		const directory = await mkdtemp(join(tmpdir(), "field-log-reader-"));
		directories.push(directory);
		const sourcePath = join(directory, "customer-notes.txt");
		await writeFile(
			sourcePath,
			"A customer names the hidden fracture in the handoff.",
		);
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: {
				title: "Reader trip",
				openingQuestion: "What breaks?",
				scope: "Inspect the handoff.",
				openedAt: "2026-07-01T09:30:00-06:00",
			},
		});
		await appendFieldLogEvents(directory, [
			{
				type: "source.collected",
				actor,
				payload: { title: "Customer notes", path: sourcePath },
			},
			{
				type: "source.examined",
				actor,
				payload: { sourceId: 1, coverage: "Read in full." },
			},
			{
				type: "instrument.run.selected",
				actor,
				authorization: selection,
				payload: { instrumentId: "fracture" },
			},
			{
				type: "instrument.run.completed",
				actor,
				payload: {
					instrumentId: "fracture",
					entry: {
						title: "The handoff fracture",
						markdown:
							"The full readout names a **hidden coordination fracture**.",
					},
				},
			},
		]);

		const inspection = await inspectFieldLog(directory);
		expect(inspection).toMatchObject({
			title: "Reader trip",
			openedAt: "2026-07-01T09:30:00-06:00",
			latestEventId: 5,
			scope: "Inspect the handoff.",
		});
		expect(inspection.entries[0]).not.toHaveProperty("readoutMarkdown");

		const readoutHits = await searchFieldLog(
			directory,
			"coordination fracture",
		);
		expect(readoutHits).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: "readout",
					entryId: 1,
					runId: 1,
					snippet: "The full readout names a **hidden coordination fracture**.",
				}),
			]),
		);
		const sourceHits = await searchFieldLog(directory, "hidden fracture");
		expect(sourceHits).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: "source",
					sourceId: 1,
					coverage: "examined",
				}),
			]),
		);

		const examinedHits = await searchFieldLog(directory, "Read in full");
		expect(examinedHits).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: "event",
					eventId: 3,
					entry: "source-examined-3",
				}),
			]),
		);

		await appendFieldLogEvents(directory, [
			{
				type: "comment.recorded",
				actor,
				payload: {
					speaker: "Kyle",
					text: "Inspect Mastra directly.",
				},
			},
		]);
		const commentHits = await searchFieldLog(directory, "Inspect Mastra");
		expect(commentHits).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					kind: "event",
					eventId: 6,
					entry: "comment-1",
				}),
			]),
		);
		expect(
			await readFieldLogItem(directory, { entryId: 1, runId: 1 }),
		).toMatchObject({
			kind: "readout",
			markdown: "The full readout names a **hidden coordination fracture**.",
		});
		expect(await readFieldLogItem(directory, { sourceId: 1 })).toMatchObject({
			kind: "source",
			content: "A customer names the hidden fracture in the handoff.",
		});

		await appendFieldLogEvents(directory, {
			type: "trip.title.updated",
			actor,
			payload: { title: "Renamed reader trip" },
		});
		expect((await inspectFieldLog(directory)).title).toBe(
			"Renamed reader trip",
		);
		expect(await readFile(join(directory, "field_log.md"), "utf8")).toContain(
			"# Renamed reader trip",
		);
	});
});
