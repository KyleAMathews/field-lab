import { describe, expect, it } from "vitest";
import { groupFieldLogEntries } from "./journal";
import type { FieldLogEntry } from "./projection";

describe("Field Log journal grouping", () => {
	it("collapses consecutive source events and merges collection with examination", () => {
		const entries: FieldLogEntry[] = [
			{
				id: "source-collected-1",
				kind: "source",
				recordedAt: "2026-07-30T09:00:00Z",
				title: "One",
				summary: "Collected for examination.",
				sourceId: "source-1",
			},
			{
				id: "source-examined-2",
				kind: "source",
				recordedAt: "2026-07-30T09:01:00Z",
				title: "One",
				summary: "Read the product specifications.",
				sourceId: "source-1",
			},
			{
				id: "source-examined-3",
				kind: "source",
				recordedAt: "2026-07-30T09:02:00Z",
				title: "Two",
				summary: "Read the recipe.",
				sourceId: "source-2",
			},
			{
				id: "entry-1",
				kind: "instrument",
				recordedAt: "2026-07-30T09:03:00Z",
				title: "Run complete",
				summary: "The bounded result.",
			},
		];

		const grouped = groupFieldLogEntries(entries);

		expect(grouped).toHaveLength(2);
		expect(grouped[0]).toMatchObject({
			type: "source-group",
			recordedAt: "2026-07-30T09:02:00Z",
			sources: [
				{
					id: "source-1",
					title: "One",
					summary: "Read the product specifications.",
				},
				{
					id: "source-2",
					title: "Two",
					summary: "Read the recipe.",
				},
			],
		});
		expect(grouped[1]).toMatchObject({
			type: "entry",
			entry: { id: "entry-1" },
		});
	});

	it("starts a new source group after a diary entry", () => {
		const entries: FieldLogEntry[] = [
			{
				id: "source-1",
				kind: "source",
				recordedAt: null,
				title: "One",
				summary: "Examined.",
			},
			{
				id: "comment-1",
				kind: "comment",
				recordedAt: null,
				title: "Kyle",
				summary: "Keep going.",
			},
			{
				id: "source-2",
				kind: "source",
				recordedAt: null,
				title: "Two",
				summary: "Examined.",
			},
		];

		expect(groupFieldLogEntries(entries).map((item) => item.type)).toEqual([
			"source-group",
			"entry",
			"source-group",
		]);
	});
});
