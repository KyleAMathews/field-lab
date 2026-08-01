import { eq, ilike, useLiveQuery } from "@tanstack/react-db";
import { ChevronDown, ChevronRight, File, Folder, Search } from "lucide-react";
import type { ArtifactDatabase } from "../collections/stream-db";
import {
	type BrowserSearch,
	decodeExpanded,
	encodeExpanded,
} from "../protocol/search";

export function FileTree({
	db,
	search,
	navigate,
}: {
	db: ArtifactDatabase;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
}) {
	const { data: files = [] } = useLiveQuery(
		(query) => {
			let result = query.from({ file: db.collections.files });
			if (search.q) {
				result = result.where(({ file }) => ilike(file.path, `%${search.q}%`));
			}
			if (search.type) {
				result = result.where(({ file }) => eq(file.rendererId, search.type));
			}
			return result.orderBy(({ file }) => file.path, "asc");
		},
		[db, search.q, search.type],
	);
	const expanded = decodeExpanded(search.expanded);

	const isVisible = (path: string) => {
		if (path === ".") return true;
		const segments = path.split("/");
		for (let index = 1; index < segments.length; index += 1) {
			if (!expanded.has(segments.slice(0, index).join("/"))) return false;
		}
		return true;
	};

	const toggle = (path: string) => {
		const next = new Set(expanded);
		if (next.has(path)) next.delete(path);
		else next.add(path);
		navigate({ expanded: encodeExpanded(next) }, true);
	};

	return (
		<aside className="file-panel" aria-label="Workspace files">
			<div className="file-search">
				<Search size={14} aria-hidden="true" />
				<input
					aria-label="Search files"
					value={search.q ?? ""}
					placeholder="Find a file"
					onChange={(event) =>
						navigate({ q: event.target.value || undefined }, true)
					}
				/>
			</div>
			<nav className="file-tree">
				{files
					.filter((file) => isVisible(file.path))
					.map((file) => {
						const depth =
							file.path === "." ? 0 : file.path.split("/").length - 1;
						const selected = search.file === file.path;
						const directory = file.kind === "directory";
						return (
							<button
								type="button"
								className={`file-row${selected ? " is-selected" : ""}`}
								key={file.id}
								onClick={() =>
									directory
										? toggle(file.path)
										: navigate(
												{
													file: file.path,
													panel: undefined,
													page: undefined,
													entry: undefined,
													readout: undefined,
												},
												false,
											)
								}
							>
								<span className={`file-indent depth-${Math.min(depth, 8)}`} />
								{directory ? (
									expanded.has(file.path) ? (
										<ChevronDown size={13} />
									) : (
										<ChevronRight size={13} />
									)
								) : (
									<span className="file-caret" />
								)}
								{directory ? <Folder size={14} /> : <File size={14} />}
								<span className="file-name">{file.name}</span>
							</button>
						);
					})}
			</nav>
		</aside>
	);
}
