import { useLiveQuery } from "@tanstack/react-db";
import { Search } from "lucide-react";
import { getSearchCollection } from "../collections/search-results";
import type { WorkspaceSearchHit } from "../log/workspace-search";
import type { BrowserSearch } from "../protocol/search";
import { MarkdownFragment } from "./MarkdownFragment";

function HighlightText({ text, query }: { text: string; query: string }) {
	const needle = query.trim();
	if (!needle) return text;
	const lowerText = text.toLocaleLowerCase();
	const lowerNeedle = needle.toLocaleLowerCase();
	const parts = [];
	let offset = 0;
	while (offset < text.length) {
		const match = lowerText.indexOf(lowerNeedle, offset);
		if (match < 0) {
			parts.push(text.slice(offset));
			break;
		}
		if (match > offset) parts.push(text.slice(offset, match));
		parts.push(
			<mark className="search-match" key={match}>
				{text.slice(match, match + needle.length)}
			</mark>,
		);
		offset = match + needle.length;
	}
	return parts;
}

function SearchResultTitle({
	target,
	title,
	query,
	navigate,
}: {
	target?: Partial<BrowserSearch>;
	title: string;
	query: string;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
}) {
	const label = <HighlightText text={title} query={query} />;
	if (!target) {
		return <div className="search-result-open is-static">{label}</div>;
	}
	return (
		<button
			type="button"
			className="search-result-open"
			onClick={() => navigate(target)}
		>
			{label}
		</button>
	);
}

function searchTarget(
	hit: WorkspaceSearchHit,
): Partial<BrowserSearch> | undefined {
	const entry = hit.entry ?? (hit.entryId ? `entry-${hit.entryId}` : undefined);
	const promotion = hit.promotionId
		? `promotion-${hit.promotionId}`
		: undefined;
	const readout = hit.runId ? String(hit.runId) : undefined;
	const source = hit.sourceId ? `source-${hit.sourceId}` : undefined;
	if (!entry && !promotion && !readout && !source) return undefined;
	return {
		page: undefined,
		file: hit.file,
		entry,
		promotion,
		readout,
		source,
	};
}

export function SearchPage({
	search,
	navigate,
}: {
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
}) {
	const query = search.q ?? "";
	const collection = getSearchCollection(query, search.cap);
	const { data: hits = [], isLoading } = useLiveQuery(
		(builder) => (query.trim() ? builder.from({ hit: collection }) : undefined),
		[query, collection],
	);
	return (
		<div className="workspace-search-page">
			<header>
				<div>
					<p className="eyebrow">Workspace corpus</p>
					<h1>Search Field Logs</h1>
				</div>
				<label className="workspace-search-input">
					<Search size={17} />
					<input
						value={query}
						onChange={(event) =>
							navigate({ q: event.target.value || undefined }, true)
						}
						placeholder="Search notes, readouts, and sources"
					/>
				</label>
			</header>
			<div className="workspace-search-results">
				{isLoading ? <p className="quiet">Searching…</p> : null}
				{!isLoading && query && !hits.length ? (
					<p className="quiet">No matching Field Log content.</p>
				) : null}
				{hits.map((hit) => {
					const target = searchTarget(hit);
					return (
						<article
							className={`workspace-search-result${target ? " is-openable" : ""}`}
							key={`${hit.file}:${hit.eventId ?? hit.promotionId ?? hit.sourceId}`}
							onKeyDown={
								target
									? (event) => {
											if (event.key !== "Enter" && event.key !== " ") return;
											event.preventDefault();
											navigate(target);
										}
									: undefined
							}
							onClick={
								target
									? (event) => {
											if (
												event.target instanceof Element &&
												event.target.closest("a, button")
											)
												return;
											navigate(target);
										}
									: undefined
							}
							role={target ? "link" : undefined}
							tabIndex={target ? 0 : undefined}
						>
							<span className="search-result-kind">{hit.kind}</span>
							<div className="search-result-copy">
								<SearchResultTitle
									target={target}
									title={hit.title}
									query={query}
									navigate={navigate}
								/>
								<MarkdownFragment
									source={hit.snippet}
									path={hit.file}
									capability={search.cap}
									className="search-result-snippet"
									highlight={query}
								/>
							</div>
							<small>
								{hit.tripTitle} · {hit.coverage ?? hit.file}
							</small>
						</article>
					);
				})}
			</div>
		</div>
	);
}
