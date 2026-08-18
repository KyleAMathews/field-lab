import { useLiveQuery } from "@tanstack/react-db";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileTree } from "./FileTree";

vi.mock("@tanstack/react-db", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-db")>(
			"@tanstack/react-db",
		);
	return { ...actual, useLiveQuery: vi.fn() };
});

describe("FileTree search", () => {
	beforeEach(() => {
		vi.mocked(useLiveQuery).mockReturnValue({ data: [] } as never);
	});

	it("opens workspace search as the user types", () => {
		const navigate = vi.fn();
		const { rerender } = render(
			<FileTree
				db={{ collections: {} } as never}
				search={{ cap: "test-cap" }}
				navigate={navigate}
			/>,
		);

		const input = screen.getByRole("textbox", { name: "Search files" });
		fireEvent.change(input, { target: { value: "branch" } });
		expect(navigate).toHaveBeenCalledWith(
			{ q: "branch", page: "search" },
			true,
		);

		rerender(
			<FileTree
				db={{ collections: {} } as never}
				search={{ cap: "test-cap", q: "branch", page: "search" }}
				navigate={navigate}
			/>,
		);
		fireEvent.change(input, { target: { value: "" } });
		expect(navigate).toHaveBeenLastCalledWith(
			{ q: undefined, page: undefined },
			true,
		);
	});
});
