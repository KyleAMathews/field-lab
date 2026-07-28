import { eq, useLiveQuery } from "@tanstack/react-db";
import { Info, PanelLeft, TextQuote } from "lucide-react";
import type { BrowserData } from "../collections/stream-db";
import type { BrowserSearch } from "../protocol/search";
import { encodeExpanded } from "../protocol/search";
import { FileTree } from "./FileTree";
import { Inspector } from "./Inspector";
import { Reader } from "./Reader";
import { ThemePicker } from "./ThemePicker";

export function AppShell({
	data,
	search,
	navigate,
}: {
	data: BrowserData;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
}) {
	const selectedPath = search.file ?? data.boot.initialPath ?? undefined;
	const { data: selected = [] } = useLiveQuery(
		(query) =>
			selectedPath
				? query
						.from({ file: data.db.collections.files })
						.where(({ file }) => eq(file.path, selectedPath))
				: undefined,
		[data.db, selectedPath],
	);
	const { data: workspace = [] } = useLiveQuery((query) =>
		query.from({ workspace: data.db.collections.workspace }),
	);
	const file = selected[0];
	const view = search.view ?? "rendered";
	const defaultExpanded = new Set<string>(["."]);
	if (selectedPath) {
		const parts = selectedPath.split("/");
		for (let index = 1; index < parts.length; index += 1) {
			defaultExpanded.add(parts.slice(0, index).join("/"));
		}
	}
	const treeSearch = {
		...search,
		file: selectedPath,
		expanded: search.expanded ?? encodeExpanded(defaultExpanded),
	};

	return (
		<div className="app-shell">
			<header className="utility-header">
				<div className="brand">
					<TextQuote size={18} />
					<span>Artifact Browser</span>
				</div>
				<div className="workspace-status">
					<span
						className={`status-dot status-${workspace[0]?.status ?? "starting"}`}
					/>
					<span>{data.boot.workspaceName}</span>
					<span className="quiet-count">
						{workspace[0]?.fileCount ?? 0} items
					</span>
				</div>
				<div className="header-actions">
					<button
						className={`icon-button mobile-files${search.panel === "files" ? " is-active" : ""}`}
						type="button"
						aria-label="Show files"
						onClick={() =>
							navigate({
								panel: search.panel === "files" ? undefined : "files",
							})
						}
					>
						<PanelLeft size={16} />
					</button>
					<ThemePicker />
					<button
						className={`icon-button${search.inspector ? " is-active" : ""}`}
						type="button"
						aria-label="Toggle inspector"
						onClick={() =>
							navigate({ inspector: !search.inspector || undefined })
						}
					>
						<Info size={16} />
					</button>
				</div>
			</header>
			<div
				className={`browser-grid${search.inspector ? " has-inspector" : ""}${search.panel === "files" ? " mobile-files-open" : ""}`}
			>
				<FileTree db={data.db} search={treeSearch} navigate={navigate} />
				<main className="reader-panel">
					<div className="reader-toolbar">
						<div className="selected-file">
							<span>{file?.name ?? "Workspace"}</span>
							{file ? <span className="selected-path">{file.path}</span> : null}
						</div>
						{file && ["markdown", "structured"].includes(file.rendererId) ? (
							<div className="view-switcher">
								<button
									type="button"
									className={view === "rendered" ? "is-active" : ""}
									onClick={() => navigate({ view: "rendered" })}
								>
									Rendered
								</button>
								<button
									type="button"
									className={view === "source" ? "is-active" : ""}
									onClick={() => navigate({ view: "source" })}
								>
									Source
								</button>
							</div>
						) : null}
					</div>
					<div className="reader-scroll">
						<div className="reader-canvas">
							<Reader
								file={file}
								capability={search.cap}
								view={view}
								staticContents={data.staticContents}
							/>
						</div>
					</div>
				</main>
				{search.inspector ? <Inspector db={data.db} file={file} /> : null}
			</div>
		</div>
	);
}
