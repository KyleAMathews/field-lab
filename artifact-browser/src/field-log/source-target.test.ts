import { describe, expect, it } from "vitest";
import { sourceLocalPath } from "./source-target";

describe("sourceLocalPath", () => {
	it("resolves source paths relative to the field log", () => {
		expect(
			sourceLocalPath(
				{ id: "source-1", title: "Paper", path: "./sources/paper.pdf" },
				"trip/field_log.md",
			),
		).toBe("trip/sources/paper.pdf");
	});

	it("supports legacy workspace-relative local-file origins", () => {
		expect(
			sourceLocalPath(
				{
					id: "source-1",
					title: "Notes",
					origin: "local file: trip/notes.md",
				},
				"trip/field_log.md",
			),
		).toBe("trip/notes.md");
	});

	it("matches a legacy path after a redundant workspace prefix", () => {
		expect(
			sourceLocalPath(
				{
					id: "source-1",
					title: "Events",
					origin: "local file: trip/field_log.jsonl",
				},
				"field_log.md",
				new Set(["field_log.md", "field_log.jsonl"]),
			),
		).toBe("field_log.jsonl");
	});

	it("keeps an absolute source identity exact", () => {
		expect(
			sourceLocalPath(
				{
					id: "source-1",
					title: "Paper",
					path: "/Users/kyle/trip/sources/paper.pdf",
				},
				"field_log.md",
				new Set(["field_log.md", "sources/paper.pdf"]),
			),
		).toBe("/Users/kyle/trip/sources/paper.pdf");
	});

	it("does not guess that an unrelated workspace suffix is the source", () => {
		expect(
			sourceLocalPath(
				{
					id: "source-1",
					title: "External notes",
					path: "/private/project/notes.md",
				},
				"field_log.md",
				new Set(["field_log.md", "notes.md"]),
			),
		).toBe("/private/project/notes.md");
	});

	it("preserves paths that leave the workspace for local external access", () => {
		expect(
			sourceLocalPath(
				{ id: "source-1", title: "Secret", path: "../../secret.md" },
				"trip/field_log.md",
			),
		).toBe("../secret.md");
	});
});
