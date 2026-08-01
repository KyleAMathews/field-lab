import { useLiveQuery } from "@tanstack/react-db";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BrowserData } from "../collections/stream-db";
import type { FileRecord } from "../protocol/types";
import { AppShell } from "./AppShell";

vi.mock("@tanstack/react-db", async () => {
	const actual =
		await vi.importActual<typeof import("@tanstack/react-db")>(
			"@tanstack/react-db",
		);
	return { ...actual, useLiveQuery: vi.fn() };
});

vi.mock("./ArtifactIndex", () => ({
	ArtifactIndex: () => <div>Standalone artifact index</div>,
}));
vi.mock("./FieldLogReader", () => ({
	FieldLogReader: () => <div>Projection-aware Field Log reader</div>,
}));
vi.mock("./FileTree", () => ({ FileTree: () => <aside>Files</aside> }));
vi.mock("./Inspector", () => ({ Inspector: () => <aside>Inspector</aside> }));
vi.mock("./Reader", () => ({ Reader: () => <div>Generic reader</div> }));
vi.mock("./ThemePicker", () => ({ ThemePicker: () => null }));

const fieldLog: FileRecord = {
	id: "field_log.md",
	path: "field_log.md",
	parentPath: ".",
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

const data = {
	boot: {
		workspaceName: "trip",
		initialPath: "field_log.md",
	},
	db: { collections: {} },
} as unknown as BrowserData;

describe("AppShell Field Log routing", () => {
	beforeEach(() => {
		vi.mocked(useLiveQuery).mockReset();
		vi.mocked(useLiveQuery)
			.mockReturnValueOnce({ data: [fieldLog] } as never)
			.mockReturnValueOnce({
				data: [{ status: "ready", fileCount: 2 }],
			} as never);
	});

	it("keeps the artifact route inside the projection-aware Field Log reader", () => {
		render(
			<AppShell
				data={data}
				search={{ cap: "test", file: "field_log.md", page: "artifacts" }}
				navigate={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Projection-aware Field Log reader"),
		).toBeInTheDocument();
		expect(screen.queryByText("Standalone artifact index")).toBeNull();
	});
});
