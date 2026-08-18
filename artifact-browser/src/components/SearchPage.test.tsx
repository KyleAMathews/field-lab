import { useLiveQuery } from "@tanstack/react-db";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchPage } from "./SearchPage";

vi.mock("@tanstack/react-db", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-db")>(
			"@tanstack/react-db",
		);
	return { ...actual, useLiveQuery: vi.fn() };
});

vi.mock("../collections/search-results", () => ({
	getSearchCollection: () => ({}),
}));

describe("workspace search results", () => {
	afterEach(cleanup);

	beforeEach(() => {
		vi.mocked(useLiveQuery).mockReturnValue({
			data: [
				{
					file: "field-trips/example/field_log.md",
					trip: "field-trips/example",
					tripTitle: "Example trip",
					kind: "entry",
					entryId: 4,
					title: "A formatted finding",
					snippet: "A **bold finding** with [support](notes.md).",
				},
				{
					file: "field-trips/example/field_log.md",
					trip: "field-trips/example",
					tripTitle: "Example trip",
					kind: "event",
					eventId: 12,
					entry: "comment-7",
					title: "comment.recorded",
					snippet: "Inspect Mastra directly.",
				},
				{
					file: "field-trips/example/field_log.md",
					trip: "field-trips/example",
					tripTitle: "Example trip",
					kind: "event",
					eventId: 13,
					title: "trip.context.recorded",
					snippet: "A context update without a journal projection.",
				},
			],
			isLoading: false,
		} as never);
	});

	it("renders result snippets as Markdown and keeps opening separate", () => {
		const navigate = vi.fn();
		render(
			<SearchPage
				search={{ cap: "test-cap", q: "finding" }}
				navigate={navigate}
			/>,
		);

		const matches = screen.getAllByText("finding");
		expect(matches).toHaveLength(2);
		for (const match of matches) {
			expect(match.tagName).toBe("MARK");
			expect(match).toHaveClass("search-match");
		}
		expect(matches[1]?.closest("strong")).not.toBeNull();
		expect(screen.getByRole("link", { name: "support" })).toHaveAttribute(
			"href",
			"?file=field-trips%2Fexample%2Fnotes.md&cap=test-cap",
		);

		fireEvent.click(
			screen.getByRole("button", { name: "A formatted finding" }),
		);
		expect(navigate).toHaveBeenCalledWith(
			expect.objectContaining({
				file: "field-trips/example/field_log.md",
				entry: "entry-4",
			}),
		);

		navigate.mockClear();
		fireEvent.click(matches[1] as HTMLElement);
		expect(navigate).toHaveBeenCalledWith(
			expect.objectContaining({
				file: "field-trips/example/field_log.md",
				entry: "entry-4",
			}),
		);

		navigate.mockClear();
		const supportLink = screen.getByRole("link", { name: "support" });
		supportLink.addEventListener("click", (event) => event.preventDefault());
		fireEvent.click(supportLink);
		expect(navigate).not.toHaveBeenCalled();
		expect(
			screen.queryByRole("button", { name: "trip.context.recorded" }),
		).toBeNull();
		expect(screen.getByText("trip.context.recorded")).toHaveClass("is-static");
	});

	it("opens projected events at their journal entry", () => {
		const navigate = vi.fn();
		render(
			<SearchPage
				search={{ cap: "test-cap", q: "Mastra" }}
				navigate={navigate}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "comment.recorded" }));
		expect(navigate).toHaveBeenCalledWith(
			expect.objectContaining({
				file: "field-trips/example/field_log.md",
				entry: "comment-7",
			}),
		);
	});

	it("rebinds the live query when the search text changes", () => {
		const navigate = vi.fn();
		const { rerender } = render(
			<SearchPage
				search={{ cap: "test-cap", q: "first" }}
				navigate={navigate}
			/>,
		);

		rerender(
			<SearchPage
				search={{ cap: "test-cap", q: "second" }}
				navigate={navigate}
			/>,
		);

		expect(vi.mocked(useLiveQuery)).toHaveBeenLastCalledWith(
			expect.any(Function),
			["second", expect.any(Object)],
		);
	});
});
