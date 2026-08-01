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

	it("matches an absolute source path to a packaged workspace file", () => {
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
		).toBe("sources/paper.pdf");
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
