import { Dialog } from "@radix-ui/themes";
import { eq, useLiveQuery } from "@tanstack/react-db";
import {
	ArrowLeft,
	BookOpen,
	ChevronRight,
	CircleAlert,
	Combine,
	ExternalLink,
	FlaskConical,
	NotebookPen,
	Quote,
	X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { type FileContent, getContentCollection } from "../collections/content";
import { getExternalFileCollection } from "../collections/external-file";
import type { ArtifactDatabase } from "../collections/stream-db";
import {
	type FieldLogSourceActivity,
	groupFieldLogEntries,
} from "../field-log/journal";
import { type FieldLogEntry, projectFieldLog } from "../field-log/projection";
import { sourceLocalPath } from "../field-log/source-target";
import { useRetainedValue } from "../hooks/useRetainedValue";
import type { BrowserSearch } from "../protocol/search";
import type { FileRecord } from "../protocol/types";
import { MarkdownRenderer } from "../renderers/MarkdownRenderer";
import { ArtifactIndex } from "./ArtifactIndex";
import { Reader } from "./Reader";

const MARKDOWN_PREVIEW_CHARACTER_LIMIT = 600;

interface MarkdownContext {
	file: FileRecord;
	content: FileContent;
	capability: string;
	staticContents?: Record<string, string>;
}

function MarkdownPreview({
	source,
	contentId,
	context,
	className,
	openLabel,
	onOpen,
}: {
	source: string;
	contentId: string;
	context: MarkdownContext;
	className?: string;
	openLabel: string;
	onOpen?: () => void;
}) {
	const frameRef = useRef<HTMLDivElement>(null);
	const [isTruncated, setIsTruncated] = useState(
		source.length > MARKDOWN_PREVIEW_CHARACTER_LIMIT,
	);

	useEffect(() => {
		const frame = frameRef.current;
		if (!frame) return;
		const measure = () =>
			setIsTruncated(
				source.length > MARKDOWN_PREVIEW_CHARACTER_LIMIT ||
					frame.scrollHeight > frame.clientHeight + 1,
			);
		measure();
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(frame);
		const rendered = frame.firstElementChild;
		if (rendered) observer.observe(rendered);
		return () => observer.disconnect();
	}, [source]);

	return (
		<div
			className={`markdown-preview${isTruncated ? " is-truncated" : ""}${className ? ` ${className}` : ""}`}
		>
			<div className="markdown-preview-frame" ref={frameRef}>
				<MarkdownRenderer
					file={context.file}
					content={{
						...context.content,
						id: contentId,
						text: source,
					}}
					view="rendered"
					capability={context.capability}
					staticContents={context.staticContents}
				/>
			</div>
			{isTruncated && onOpen ? (
				<button
					type="button"
					className="markdown-preview-open"
					onClick={onOpen}
				>
					{openLabel}
					<ChevronRight size={14} aria-hidden="true" />
				</button>
			) : null}
		</div>
	);
}

function formatDate(value: string | null | undefined): string {
	if (!value) return "Time not recorded";
	const date = new Date(value);
	if (Number.isNaN(date.valueOf())) return value;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

function eventStreamPath(
	markdown: string,
	markdownPath: string,
): string | null {
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
		markdown,
	)?.[1];
	const raw = /^event-stream:\s*(.+?)\s*$/m
		.exec(frontmatter ?? "")?.[1]
		?.replace(/^(['"])(.*)\1$/, "$2");
	if (!raw || raw.startsWith("/") || /^[a-z]+:/i.test(raw)) return null;

	const parts = [...markdownPath.split("/").slice(0, -1), ...raw.split("/")];
	const resolved: string[] = [];
	for (const part of parts) {
		if (!part || part === ".") continue;
		if (part === "..") {
			if (!resolved.length) return null;
			resolved.pop();
		} else {
			resolved.push(part);
		}
	}
	return resolved.join("/");
}

function SourceFilePreview({
	path,
	capability,
	staticContents,
}: {
	path: string;
	capability: string;
	staticContents?: Record<string, string>;
}) {
	const staticContent = staticContents?.[path];
	if (staticContents && staticContent !== undefined)
		return (
			<StaticSourceFilePreview
				path={path}
				staticContent={staticContent}
				staticContents={staticContents}
			/>
		);
	return <LiveSourceFilePreview path={path} capability={capability} />;
}

function sourceFileRecord(path: string, revision: string): FileRecord {
	const name = path.split(/[\\/]/).at(-1) ?? path;
	const dot = name.lastIndexOf(".");
	const extension = dot > 0 ? name.slice(dot).toLowerCase() : null;
	const [mimeType, rendererId] =
		extension === ".pdf"
			? ["application/pdf", "pdf"]
			: [".md", ".mdx", ".markdown"].includes(extension ?? "")
				? ["text/markdown", "markdown"]
				: [".json", ".yaml", ".yml"].includes(extension ?? "")
					? ["application/json", "structured"]
					: extension === ".csv" || extension === ".tsv"
						? ["text/plain", "table"]
						: [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(
									extension ?? "",
								)
							? [
									extension === ".svg"
										? "image/svg+xml"
										: `image/${extension?.slice(1) === "jpg" ? "jpeg" : extension?.slice(1)}`,
									"image",
								]
							: ["text/plain", "text"];
	return {
		id: `published-source:${path}`,
		path,
		parentPath: null,
		name,
		kind: "file",
		extension,
		mimeType,
		size: null,
		modifiedAt: null,
		revision,
		rendererId,
		readable: true,
	};
}

function StaticSourceFilePreview({
	path,
	staticContent,
	staticContents,
}: {
	path: string;
	staticContent: string;
	staticContents: Record<string, string>;
}) {
	const file = sourceFileRecord(path, staticContent);
	const preview = (
		<Reader
			file={file}
			capability=""
			view="rendered"
			staticContents={staticContents}
		/>
	);
	return file.rendererId === "markdown" ? (
		<div className="reader-canvas source-preview-canvas">{preview}</div>
	) : (
		preview
	);
}

function LiveSourceFilePreview({
	path,
	capability,
}: {
	path: string;
	capability: string;
}) {
	const collection = getExternalFileCollection(path, capability);
	const { data = [], isLoading, isError } = useLiveQuery(collection);
	if (isLoading)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading source"
			/>
		);
	if (isError)
		return (
			<div className="source-missing">
				This source file could not be found on this computer.
			</div>
		);
	const preview = (
		<Reader file={data[0]} capability={capability} view="rendered" />
	);
	return data[0]?.rendererId === "markdown" ? (
		<div className="reader-canvas source-preview-canvas">{preview}</div>
	) : (
		preview
	);
}

function FieldLogDashboard({
	projection,
	db,
	search,
	navigate,
	file,
	content,
	capability,
	staticContents,
}: {
	projection: ReturnType<typeof projectFieldLog>;
	db: ArtifactDatabase;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
	file: FileRecord;
	content: FileContent;
	capability: string;
	staticContents?: Record<string, string>;
}) {
	const selectedReadout = projection.entries.find(
		(entry) =>
			entry.runId != null && String(entry.runId) === String(search.readout),
	);
	const selectedEntry = projection.entries.find(
		(entry) => entry.id === search.entry,
	);
	const selectedStandaloneEntry =
		!search.readout && selectedEntry && !selectedEntry.readoutMarkdown
			? selectedEntry
			: undefined;
	const selectedDashboardSynthesis =
		search.entry === "dashboard-synthesis" && projection.synthesis
			? projection.synthesis
			: undefined;
	const selectedDrawerEntry = selectedReadout ?? selectedStandaloneEntry;
	const selectedRun = projection.runs.find(
		(run) => String(run.runId) === String(search.readout),
	);
	const selectedSource = projection.sources.find(
		(source) => source.id === search.source,
	);
	const { data: workspaceFiles = [] } = useLiveQuery((query) =>
		query.from({ file: db.collections.files }),
	);
	const knownPaths = useMemo(
		() => new Set(workspaceFiles.map((workspaceFile) => workspaceFile.path)),
		[workspaceFiles],
	);
	const selectedSourcePath = selectedSource
		? sourceLocalPath(selectedSource, file.path, knownPaths)
		: undefined;
	const activeRuns = projection.runs.filter(
		(run) => !["completed", "failed", "stopped"].includes(run.status),
	);
	const latestSources = projection.sources.slice(-3).reverse();
	const journalItems = useMemo(
		() => groupFieldLogEntries(projection.entries),
		[projection.entries],
	);
	const synthesisEntry = [...projection.entries]
		.reverse()
		.find(
			(entry) =>
				(entry.kind === "synthesis" || entry.kind === "engine") &&
				entry.summary === projection.synthesis,
		);
	const markdownContext = { file, content, capability, staticContents };

	useEffect(() => {
		if (!search.entry) return;
		const suffix = search.readout ? `-readout-${search.readout}` : "";
		document
			.getElementById(`field-log-${search.entry}${suffix}`)
			?.scrollIntoView({ block: "center" });
	}, [search.entry, search.readout]);

	return (
		<>
			<article className="field-log">
				<header className="field-log-heading">
					<span className="eyebrow">Field Trip</span>
					<h1>{projection.title}</h1>
					<p>{projection.scope || projection.openingQuestion}</p>
				</header>

				<section className="field-log-lead" aria-label="Current state">
					<div>
						<span className="eyebrow">Current working question</span>
						<h2>
							{projection.currentQuestion || "No current question is selected."}
						</h2>
					</div>
					<div>
						<span className="eyebrow">Synthesis</span>
						{projection.synthesis ? (
							<MarkdownPreview
								source={projection.synthesis}
								contentId={`${content.id}:synthesis`}
								context={markdownContext}
								className="field-log-synthesis"
								openLabel="Read full synthesis"
								onOpen={() =>
									navigate({
										entry: synthesisEntry?.id ?? "dashboard-synthesis",
										readout: undefined,
										source: undefined,
									})
								}
							/>
						) : (
							<p className="quiet">
								No synthesis has been requested or recorded.
							</p>
						)}
					</div>
					<div>
						<span className="eyebrow">Selected next work</span>
						<p>
							{activeRuns.length
								? activeRuns
										.map((run) => `${run.instrumentId} · ${run.status}`)
										.join(", ")
								: (projection.plan.find(
										(item) => !/complete|removed/i.test(item.status ?? ""),
									)?.title ?? "No instrument is selected.")}
						</p>
					</div>
				</section>

				<div className="field-log-dashboard">
					<section>
						<h2>Open Questions</h2>
						{projection.questions.length ? (
							projection.questions.map((item) => (
								<div className="dashboard-item" key={item.id}>
									<h3>{item.title}</h3>
									{item.detail ? <p>{item.detail}</p> : null}
								</div>
							))
						) : (
							<p className="empty-state">No return-to questions.</p>
						)}
					</section>

					<section>
						<h2>Source shelf</h2>
						{latestSources.map((source) => {
							return (
								<div className="dashboard-item source-item" key={source.id}>
									<BookOpen size={15} />
									<div>
										<button
											type="button"
											className="source-link"
											onClick={() => navigate({ source: source.id })}
										>
											{source.title}
										</button>
										<p>
											{source.origin ?? "source"} ·{" "}
											{source.coverage ?? "coverage unknown"}
										</p>
									</div>
								</div>
							);
						})}
						{projection.sources.length ? (
							<button
								type="button"
								className="dashboard-more"
								onClick={() =>
									navigate({
										page: "artifacts",
										kind: "source",
										source: undefined,
										entry: undefined,
										readout: undefined,
									})
								}
							>
								View all {projection.sources.length} sources
								<ChevronRight size={14} />
							</button>
						) : (
							<p className="empty-state">No sources recorded.</p>
						)}
					</section>

					<section>
						<h2>Key Terms</h2>
						{projection.terms.map((item) => (
							<div className="dashboard-item" key={item.id}>
								<h3>{item.title}</h3>
								{item.detail ? <p>{item.detail}</p> : null}
							</div>
						))}
					</section>

					<section>
						<h2>Live tensions</h2>
						{projection.tensions.map((item) => (
							<div className="dashboard-item" key={item.id}>
								<p>{item.detail || item.title}</p>
							</div>
						))}
					</section>

					<section>
						<h2>Plan and open gaps</h2>
						{projection.plan.map((item) => (
							<div className="dashboard-item" key={item.id}>
								<h3>{item.title}</h3>
								{item.detail ? <p>{item.detail}</p> : null}
								{item.status ? <small>{item.status}</small> : null}
							</div>
						))}
					</section>

					<section>
						<h2>Method</h2>
						{projection.workflow.length ? (
							projection.workflow.map((item) => (
								<div className="dashboard-item" key={item.id}>
									<h3>{item.title}</h3>
									{item.detail ? <p>{item.detail}</p> : null}
									{item.status ? <small>{item.status}</small> : null}
								</div>
							))
						) : (
							<div className="dashboard-item">
								<h3>Ad hoc instruments</h3>
								<p>
									No named workflow is active. Each instrument is selected
									separately.
								</p>
							</div>
						)}
					</section>
				</div>

				<section className="field-log-journal" aria-label="Chronological log">
					<header>
						<span className="eyebrow">Durable history</span>
						<h2>Chronological log</h2>
						<p>
							Run summaries and exact comments, with source activity folded away
							until needed.
						</p>
					</header>
					<div className="journal-timeline">
						{journalItems.map((item) =>
							item.type === "source-group" ? (
								<JournalSourceGroup
									key={item.id}
									recordedAt={item.recordedAt}
									sources={item.sources}
									openSource={(sourceId) =>
										navigate({
											source: sourceId,
											entry: undefined,
											readout: undefined,
										})
									}
								/>
							) : (
								<JournalEntry
									key={`${item.entry.id}:${item.entry.runId ?? "event"}`}
									entry={item.entry}
									markdownContext={{
										file,
										content,
										capability,
										staticContents,
									}}
									selected={
										search.entry === item.entry.id &&
										(search.readout == null ||
											String(item.entry.runId) === search.readout)
									}
									openReadout={() =>
										navigate({
											entry: item.entry.id,
											readout:
												item.entry.runId == null
													? undefined
													: String(item.entry.runId),
										})
									}
								/>
							),
						)}
					</div>
				</section>
			</article>

			<Dialog.Root
				open={selectedDrawerEntry != null || selectedDashboardSynthesis != null}
				onOpenChange={(open) => {
					if (!open) {
						navigate({
							readout: undefined,
							entry: selectedReadout ? search.entry : undefined,
						});
					}
				}}
			>
				{selectedDrawerEntry || selectedDashboardSynthesis ? (
					<Dialog.Content
						className="readout-drawer"
						aria-describedby={undefined}
						size="1"
					>
						<header>
							<Dialog.Close>
								<button type="button" className="readout-back">
									<ArrowLeft size={15} />
									Back to Field Log
								</button>
							</Dialog.Close>
							<div>
								<span className="eyebrow">
									{selectedReadout
										? `${selectedReadout.instrumentId} · ${selectedReadout.status}`
										: selectedDrawerEntry?.kind === "comment"
											? "User comment"
											: selectedDrawerEntry?.kind === "note"
												? "Field note"
												: "Synthesis"}
								</span>
								<Dialog.Title>
									{selectedDrawerEntry?.title ?? "Synthesis"}
								</Dialog.Title>
								{selectedRun?.feedback ? (
									<p className="quiet">
										{selectedRun.feedbackStatus
											? `${selectedRun.feedbackStatus}: `
											: ""}
										{selectedRun.feedback}
									</p>
								) : null}
							</div>
							<Dialog.Close>
								<button
									type="button"
									className="icon-button"
									aria-label="Close readout"
								>
									<X size={17} />
								</button>
							</Dialog.Close>
						</header>
						<div className="readout-scroll">
							<MarkdownRenderer
								file={file}
								content={{
									...content,
									id: `${content.id}:drawer:${selectedDrawerEntry?.id ?? "synthesis"}`,
									text:
										selectedReadout?.readoutMarkdown ??
										selectedDrawerEntry?.summary ??
										selectedDashboardSynthesis ??
										"",
								}}
								view="rendered"
								capability={capability}
								staticContents={staticContents}
							/>
						</div>
					</Dialog.Content>
				) : null}
			</Dialog.Root>

			<Dialog.Root
				open={selectedSource != null}
				onOpenChange={(open) => {
					if (!open) navigate({ source: undefined });
				}}
			>
				{selectedSource ? (
					<Dialog.Content
						className="readout-drawer source-drawer"
						aria-describedby={undefined}
						size="1"
					>
						<header>
							<Dialog.Close>
								<button type="button" className="readout-back">
									<ArrowLeft size={15} />
									Back to Field Log
								</button>
							</Dialog.Close>
							<div>
								<span className="eyebrow">Source record</span>
								<Dialog.Title>{selectedSource.title}</Dialog.Title>
							</div>
							<Dialog.Close>
								<button
									type="button"
									className="icon-button"
									aria-label="Close source"
								>
									<X size={17} />
								</button>
							</Dialog.Close>
						</header>
						<div className="readout-scroll source-scroll">
							<dl className="source-record">
								<div>
									<dt>Origin</dt>
									<dd>{selectedSource.origin ?? "Not recorded"}</dd>
								</div>
								<div>
									<dt>Coverage</dt>
									<dd>{selectedSource.coverage ?? "Not recorded"}</dd>
								</div>
							</dl>
							{selectedSource.url ? (
								<a
									className="source-open"
									href={selectedSource.url}
									target="_blank"
									rel="noreferrer"
								>
									Open original source
									<ExternalLink size={14} />
								</a>
							) : null}
							{selectedSourcePath ? (
								<SourceFilePreview
									path={selectedSourcePath}
									capability={capability}
									staticContents={staticContents}
								/>
							) : !selectedSource.url ? (
								<p className="source-missing">
									This source record has no file path or URL.
								</p>
							) : null}
						</div>
					</Dialog.Content>
				) : null}
			</Dialog.Root>
		</>
	);
}

function JournalSourceGroup({
	recordedAt,
	sources,
	openSource,
}: {
	recordedAt: string | null;
	sources: FieldLogSourceActivity[];
	openSource: (sourceId: string) => void;
}) {
	return (
		<details className="journal-source-group">
			<summary>
				<span className="journal-marker">
					<BookOpen size={14} />
				</span>
				<span className="journal-source-summary">
					<span className="journal-meta">{formatDate(recordedAt)}</span>
					<strong>
						{sources.length} {sources.length === 1 ? "source" : "sources"}{" "}
						examined
					</strong>
					<span>Open the source trail</span>
				</span>
				<ChevronRight className="journal-source-chevron" size={16} />
			</summary>
			<div className="journal-source-list">
				{sources.map((source) => (
					<button
						type="button"
						key={source.id}
						onClick={() => openSource(source.id)}
					>
						<strong>{source.title}</strong>
						<span>{source.summary}</span>
					</button>
				))}
			</div>
		</details>
	);
}

export function JournalEntry({
	entry,
	selected,
	openReadout,
	markdownContext,
}: {
	entry: FieldLogEntry;
	selected: boolean;
	openReadout: () => void;
	markdownContext: MarkdownContext;
}) {
	const isCompact = entry.kind === "source" || entry.kind === "context";
	const icon =
		entry.kind === "comment" ? (
			<Quote size={14} />
		) : entry.kind === "note" ? (
			<NotebookPen size={14} />
		) : entry.kind === "synthesis" ? (
			<Combine size={14} />
		) : entry.kind === "source" ? (
			<BookOpen size={14} />
		) : entry.status === "failed" || entry.status === "stopped" ? (
			<CircleAlert size={14} />
		) : (
			<FlaskConical size={14} />
		);
	return (
		<article
			id={`field-log-${entry.id}${entry.runId != null ? `-readout-${entry.runId}` : ""}`}
			className={`journal-entry journal-${entry.kind}${isCompact ? " is-compact" : ""}${selected ? " is-selected" : ""}`}
		>
			<div className="journal-marker">{icon}</div>
			<div className="journal-copy">
				<span className="journal-meta">
					{formatDate(entry.recordedAt)}
					{entry.instrumentId ? ` · ${entry.instrumentId}` : ""}
				</span>
				{entry.kind === "comment" ? (
					<>
						{entry.context ? (
							<p className="journal-comment-context">{entry.context}</p>
						) : null}
						<blockquote>
							<span>{entry.speaker ?? "User"}</span>
							<MarkdownPreview
								source={entry.summary}
								contentId={`${markdownContext.content.id}:comment:${entry.id}`}
								context={markdownContext}
								openLabel="Read full comment"
								onOpen={openReadout}
							/>
						</blockquote>
					</>
				) : isCompact ? (
					<div className="journal-compact">
						<strong>{entry.title}</strong>
						{entry.summary ? (
							<MarkdownPreview
								source={entry.summary}
								contentId={`${markdownContext.content.id}:summary:${entry.id}`}
								context={markdownContext}
								openLabel="Read full entry"
								onOpen={openReadout}
							/>
						) : null}
					</div>
				) : (
					<>
						<h3>{entry.title}</h3>
						{entry.summary ? (
							<MarkdownPreview
								source={entry.summary}
								contentId={`${markdownContext.content.id}:summary:${entry.id}`}
								context={markdownContext}
								className="journal-summary"
								openLabel="Read full entry"
								onOpen={entry.readoutMarkdown ? undefined : openReadout}
							/>
						) : null}
						{entry.readoutMarkdown ? (
							<button type="button" onClick={openReadout}>
								Open full readout
							</button>
						) : null}
					</>
				)}
			</div>
		</article>
	);
}

export function FieldLogReader({
	db,
	file,
	capability,
	staticContents,
	search,
	navigate,
}: {
	db: ArtifactDatabase;
	file: FileRecord;
	capability: string;
	staticContents?: Record<string, string>;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
}) {
	const markdownCollection = getContentCollection(
		file.path,
		file.revision,
		capability,
		staticContents?.[file.path],
	);
	const { data: markdownContent = [], isLoading } =
		useLiveQuery(markdownCollection);
	const retainedMarkdown = useRetainedValue(file.path, markdownContent[0]);
	if ((isLoading && !retainedMarkdown) || !retainedMarkdown)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading Field Log"
			/>
		);
	const jsonlPath = eventStreamPath(retainedMarkdown.text ?? "", file.path);
	return jsonlPath ? (
		<FieldLogWithEvents
			{...{
				db,
				file,
				capability,
				staticContents,
				search,
				navigate,
				jsonlPath,
				markdownContent: retainedMarkdown,
			}}
		/>
	) : (
		<LoadedFieldLog
			{...{
				db,
				file,
				capability,
				staticContents,
				search,
				navigate,
				markdownContent: retainedMarkdown,
			}}
		/>
	);
}

function FieldLogWithEvents({
	jsonlPath,
	...props
}: Omit<Parameters<typeof LoadedFieldLog>[0], "jsonlContent"> & {
	jsonlPath: string;
}) {
	const { data: jsonlFiles = [] } = useLiveQuery(
		(query) =>
			query
				.from({ file: props.db.collections.files })
				.where(({ file }) => eq(file.path, jsonlPath)),
		[props.db, jsonlPath],
	);
	const jsonlRevision = jsonlFiles[0]?.revision;
	if (!jsonlRevision)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading Field Log event metadata"
			/>
		);
	return (
		<LoadedFieldLogEvents
			{...props}
			jsonlPath={jsonlPath}
			jsonlRevision={jsonlRevision}
		/>
	);
}

function LoadedFieldLogEvents({
	jsonlPath,
	jsonlRevision,
	...props
}: Omit<Parameters<typeof LoadedFieldLog>[0], "jsonlContent"> & {
	jsonlPath: string;
	jsonlRevision: string;
}) {
	const collection = getContentCollection(
		jsonlPath,
		jsonlRevision,
		props.capability,
		props.staticContents?.[jsonlPath],
	);
	const { data = [], isLoading } = useLiveQuery(collection);
	const jsonlContent = useRetainedValue(jsonlPath, data[0]);
	if ((isLoading && !jsonlContent) || !jsonlContent)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading Field Log events"
			/>
		);
	return <LoadedFieldLog {...props} jsonlContent={jsonlContent} />;
}

function LoadedFieldLog({
	db,
	file,
	capability,
	staticContents,
	search,
	navigate,
	markdownContent,
	jsonlContent,
}: {
	db: ArtifactDatabase;
	file: FileRecord;
	capability: string;
	staticContents?: Record<string, string>;
	search: BrowserSearch;
	navigate: (next: Partial<BrowserSearch>, replace?: boolean) => void;
	markdownContent: FileContent;
	jsonlContent?: FileContent;
}) {
	const projection = useMemo(
		() =>
			projectFieldLog(markdownContent.text ?? "", jsonlContent?.text ?? null),
		[markdownContent.text, jsonlContent?.text],
	);
	if (search.page === "artifacts")
		return (
			<ArtifactIndex
				db={db}
				search={search}
				navigate={navigate}
				fieldLog={projection}
				fieldLogPath={file.path}
			/>
		);
	return (
		<FieldLogDashboard
			{...{
				projection,
				db,
				search,
				navigate,
				file,
				content: markdownContent,
				capability,
				staticContents,
			}}
		/>
	);
}
