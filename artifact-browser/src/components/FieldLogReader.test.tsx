import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FileContent } from "../collections/content";
import type { FileRecord } from "../protocol/types";
import { JournalEntry } from "./FieldLogReader";

const file: FileRecord = {
	id: "field-log",
	path: "trip/field_log.md",
	parentPath: "trip",
	name: "field_log.md",
	kind: "file",
	extension: "md",
	mimeType: "text/markdown",
	size: 100,
	modifiedAt: 1,
	revision: "1",
	rendererId: "markdown",
	readable: true,
};

const content: FileContent = {
	id: "trip/field_log.md@1",
	path: "trip/field_log.md",
	revision: "1",
	mimeType: "text/markdown",
	size: 100,
	etag: "1",
	text: "",
	url: "/api/content",
	tooLarge: false,
};

describe("Field Log journal entries", () => {
	it("renders exact user comments as Markdown", () => {
		render(
			<JournalEntry
				entry={{
					id: "comment-1",
					kind: "comment",
					recordedAt: "2026-07-30T08:00:00-06:00",
					title: "Kyle",
					speaker: "Kyle",
					summary: "Try **whole grain** and read [the notes](notes.md).",
				}}
				selected={false}
				openReadout={vi.fn()}
				markdownContext={{
					file,
					content,
					capability: "test-cap",
				}}
			/>,
		);

		expect(screen.getByText("whole grain").tagName).toBe("STRONG");
		expect(screen.getByRole("link", { name: "the notes" })).toHaveAttribute(
			"href",
			"?file=trip%2Fnotes.md&cap=test-cap",
		);
	});

	it("renders instrument summaries as Markdown", () => {
		render(
			<JournalEntry
				entry={{
					id: "instrument-1",
					kind: "instrument",
					recordedAt: "2026-07-30T08:00:00-06:00",
					title: "Design Grammar",
					summary:
						"Read in this order:\n\n1. **Frozen baseline**\n2. [Primitives](notes.md)",
				}}
				selected={false}
				openReadout={vi.fn()}
				markdownContext={{
					file,
					content,
					capability: "test-cap",
				}}
			/>,
		);

		expect(screen.getByText("Frozen baseline").tagName).toBe("STRONG");
		expect(screen.getByRole("list")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Primitives" })).toHaveAttribute(
			"href",
			"?file=trip%2Fnotes.md&cap=test-cap",
		);
	});

	it("offers the full drawer for long journal entries", () => {
		const openReadout = vi.fn();
		render(
			<JournalEntry
				entry={{
					id: "note-1",
					kind: "note",
					recordedAt: "2026-07-30T08:00:00-06:00",
					title: "A long field note",
					summary: `Start with **the baseline**.\n\n${"A detailed explanation follows. ".repeat(30)}`,
				}}
				selected={false}
				openReadout={openReadout}
				markdownContext={{
					file,
					content,
					capability: "test-cap",
				}}
			/>,
		);

		expect(screen.getByText("the baseline").tagName).toBe("STRONG");
		fireEvent.click(screen.getByRole("button", { name: "Read full entry" }));
		expect(openReadout).toHaveBeenCalledOnce();
	});
});
