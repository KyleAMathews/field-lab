import { Dialog } from "@radix-ui/themes";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { useMemo } from "react";
import { type FileContent, getContentCollection } from "../collections/content";
import type { ArtifactDatabase } from "../collections/stream-db";
import {
	type BrowserExpeditionPromotion,
	projectBrowserExpedition,
} from "../expedition-log/browser-projection";
import { projectFieldLog } from "../field-log/projection";
import { useRetainedValue } from "../hooks/useRetainedValue";
import type { BrowserSearch } from "../protocol/search";
import type { FileRecord } from "../protocol/types";
import { MarkdownRenderer } from "../renderers/MarkdownRenderer";

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
	return resolveWorkspacePath(markdownPath, raw);
}

function resolveWorkspacePath(fromFile: string, target: string): string | null {
	const parts = [...fromFile.split("/").slice(0, -1), ...target.split("/")];
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

function fieldLogHref(
	path: string,
	promotion: BrowserExpeditionPromotion,
	capability: string,
): string {
	const search = new URLSearchParams({
		file: path,
		entry: `entry-${promotion.entryId}`,
	});
	if (promotion.runId) search.set("readout", String(promotion.runId));
	if (capability) search.set("cap", capability);
	return `?${search}`;
}

function Loading({ label }: { label: string }) {
	return <div className="reader-skeleton" role="status" aria-label={label} />;
}

export function ExpeditionLogReader({
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
		return <Loading label="Loading Expedition Log" />;

	const jsonlPath = eventStreamPath(retainedMarkdown.text ?? "", file.path);
	if (!jsonlPath) {
		return (
			<MarkdownRenderer
				file={file}
				content={retainedMarkdown}
				view="rendered"
				capability={capability}
				staticContents={staticContents}
			/>
		);
	}
	return (
		<ExpeditionLogWithEvents
			{...{
				db,
				file,
				capability,
				staticContents,
				search,
				navigate,
				markdownContent: retainedMarkdown,
				jsonlPath,
			}}
		/>
	);
}

function ExpeditionLogWithEvents({
	db,
	jsonlPath,
	...props
}: Omit<Parameters<typeof LoadedExpeditionLog>[0], "jsonlContent"> & {
	db: ArtifactDatabase;
	jsonlPath: string;
}) {
	const { data: jsonlFiles = [] } = useLiveQuery(
		(query) =>
			query
				.from({ file: db.collections.files })
				.where(({ file }) => eq(file.path, jsonlPath)),
		[db, jsonlPath],
	);
	const jsonlFile = jsonlFiles[0];
	if (!jsonlFile)
		return <Loading label="Loading Expedition Log event metadata" />;
	return (
		<LoadedExpeditionEvents
			{...props}
			db={db}
			jsonlPath={jsonlPath}
			jsonlFile={jsonlFile}
		/>
	);
}

function LoadedExpeditionEvents({
	jsonlPath,
	jsonlFile,
	...props
}: Omit<Parameters<typeof LoadedExpeditionLog>[0], "jsonlContent"> & {
	jsonlPath: string;
	jsonlFile: FileRecord;
}) {
	const collection = getContentCollection(
		jsonlPath,
		jsonlFile.revision,
		props.capability,
		props.staticContents?.[jsonlPath],
	);
	const { data = [], isLoading } = useLiveQuery(collection);
	const jsonlContent = useRetainedValue(jsonlPath, data[0]);
	if ((isLoading && !jsonlContent) || !jsonlContent)
		return <Loading label="Loading Expedition Log events" />;
	return <LoadedExpeditionLog {...props} jsonlContent={jsonlContent} />;
}

function LoadedExpeditionLog({
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
	jsonlContent: FileContent;
}) {
	const projection = useMemo(
		() => projectBrowserExpedition(jsonlContent.text ?? ""),
		[jsonlContent.text],
	);
	const selectedPromotionId = search.promotion?.replace(/^promotion-/, "");
	const promotion = projection.promotions.find(
		(item) => String(item.promotionId) === selectedPromotionId,
	);
	const trip = promotion
		? projection.trips.find((item) => item.tripId === promotion.tripId)
		: undefined;
	const fieldLogPath = trip
		? resolveWorkspacePath(file.path, `${trip.path}/field_log.md`)
		: null;

	return (
		<>
			<MarkdownRenderer
				file={file}
				content={markdownContent}
				view="rendered"
				capability={capability}
				staticContents={staticContents}
			/>
			<Dialog.Root open={promotion != null && fieldLogPath != null}>
				{promotion && fieldLogPath ? (
					<Dialog.Content
						className="readout-drawer expedition-readout-drawer"
						aria-describedby={undefined}
						size="1"
						onEscapeKeyDown={() => navigate({ promotion: undefined })}
					>
						<PromotionFromFieldLog
							{...{
								db,
								fieldLogPath,
								promotion,
								capability,
								staticContents,
								onClose: () => navigate({ promotion: undefined }),
							}}
						/>
					</Dialog.Content>
				) : null}
			</Dialog.Root>
		</>
	);
}

interface PromotionLoadProps {
	db: ArtifactDatabase;
	fieldLogPath: string;
	promotion: BrowserExpeditionPromotion;
	capability: string;
	staticContents?: Record<string, string>;
	onClose: () => void;
}

function PromotionFromFieldLog(props: PromotionLoadProps) {
	const { data: files = [] } = useLiveQuery(
		(query) =>
			query
				.from({ file: props.db.collections.files })
				.where(({ file }) => eq(file.path, props.fieldLogPath)),
		[props.db, props.fieldLogPath],
	);
	const fieldLogFile = files[0];
	if (!fieldLogFile)
		return (
			<PromotionLoadError
				message="The source Field Log is unavailable."
				onClose={props.onClose}
			/>
		);
	return <PromotionFromMarkdown {...props} fieldLogFile={fieldLogFile} />;
}

function PromotionFromMarkdown({
	fieldLogFile,
	...props
}: PromotionLoadProps & { fieldLogFile: FileRecord }) {
	const collection = getContentCollection(
		fieldLogFile.path,
		fieldLogFile.revision,
		props.capability,
		props.staticContents?.[fieldLogFile.path],
	);
	const { data = [], isLoading } = useLiveQuery(collection);
	const markdownContent = useRetainedValue(fieldLogFile.path, data[0]);
	if ((isLoading && !markdownContent) || !markdownContent)
		return <Loading label="Loading promoted entry" />;
	const jsonlPath = eventStreamPath(
		markdownContent.text ?? "",
		fieldLogFile.path,
	);
	if (!jsonlPath) {
		return (
			<ResolvedPromotion
				{...props}
				fieldLogFile={fieldLogFile}
				markdownContent={markdownContent}
			/>
		);
	}
	return (
		<PromotionWithEvents
			{...props}
			fieldLogFile={fieldLogFile}
			markdownContent={markdownContent}
			jsonlPath={jsonlPath}
		/>
	);
}

function PromotionWithEvents({
	jsonlPath,
	...props
}: PromotionLoadProps & {
	fieldLogFile: FileRecord;
	markdownContent: FileContent;
	jsonlPath: string;
}) {
	const { data: files = [] } = useLiveQuery(
		(query) =>
			query
				.from({ file: props.db.collections.files })
				.where(({ file }) => eq(file.path, jsonlPath)),
		[props.db, jsonlPath],
	);
	const jsonlFile = files[0];
	if (!jsonlFile)
		return (
			<PromotionLoadError
				message="The source event stream is unavailable."
				onClose={props.onClose}
			/>
		);
	return (
		<PromotionFromEvents
			{...props}
			jsonlPath={jsonlPath}
			jsonlFile={jsonlFile}
		/>
	);
}

function PromotionFromEvents({
	jsonlPath,
	jsonlFile,
	...props
}: PromotionLoadProps & {
	fieldLogFile: FileRecord;
	markdownContent: FileContent;
	jsonlPath: string;
	jsonlFile: FileRecord;
}) {
	const collection = getContentCollection(
		jsonlPath,
		jsonlFile.revision,
		props.capability,
		props.staticContents?.[jsonlPath],
	);
	const { data = [], isLoading } = useLiveQuery(collection);
	const jsonlContent = useRetainedValue(jsonlPath, data[0]);
	if ((isLoading && !jsonlContent) || !jsonlContent)
		return <Loading label="Loading promoted readout" />;
	return <ResolvedPromotion {...props} jsonlContent={jsonlContent} />;
}

function PromotionLoadError({
	message,
	onClose,
}: {
	message: string;
	onClose: () => void;
}) {
	return (
		<>
			<PromotionDrawerHeader title="Promoted entry" onClose={onClose} />
			<div className="readout-scroll">
				<p className="source-missing">{message}</p>
			</div>
		</>
	);
}

function PromotionDrawerHeader({
	title,
	eyebrow = "Expedition promotion",
	sourceHref,
	sourceLabel,
	onClose,
}: {
	title: string;
	eyebrow?: string;
	sourceHref?: string;
	sourceLabel?: string;
	onClose: () => void;
}) {
	return (
		<header>
			<button type="button" className="readout-back" onClick={onClose}>
				<ArrowLeft size={15} />
				Back to Expedition
			</button>
			<div>
				<span className="eyebrow">{eyebrow}</span>
				<Dialog.Title>{title}</Dialog.Title>
				{sourceHref ? (
					<a className="expedition-source-link" href={sourceHref}>
						{sourceLabel}
						<ExternalLink size={13} />
					</a>
				) : null}
			</div>
			<button
				type="button"
				className="icon-button"
				aria-label="Close readout"
				onClick={onClose}
			>
				<X size={17} />
			</button>
		</header>
	);
}

function ResolvedPromotion({
	fieldLogFile,
	markdownContent,
	jsonlContent,
	promotion,
	fieldLogPath,
	capability,
	staticContents,
	onClose,
}: Omit<PromotionLoadProps, "db"> & {
	fieldLogFile: FileRecord;
	markdownContent: FileContent;
	jsonlContent?: FileContent;
}) {
	const projection = useMemo(
		() =>
			projectFieldLog(markdownContent.text ?? "", jsonlContent?.text ?? null),
		[markdownContent.text, jsonlContent?.text],
	);
	const entry = projection.entries.find(
		(item) =>
			item.id === `entry-${promotion.entryId}` &&
			(promotion.runId == null ||
				String(item.runId) === String(promotion.runId)),
	);
	if (!entry)
		return (
			<PromotionLoadError
				message="The promoted entry could not be resolved."
				onClose={onClose}
			/>
		);

	const sourceLabel = promotion.runId
		? "See readout in Field Log"
		: "See entry in Field Log";
	return (
		<>
			<PromotionDrawerHeader
				title={entry.title}
				eyebrow={
					entry.instrumentId
						? `${entry.instrumentId} · ${entry.status ?? "complete"}`
						: "Expedition promotion"
				}
				sourceHref={fieldLogHref(fieldLogPath, promotion, capability)}
				sourceLabel={sourceLabel}
				onClose={onClose}
			/>
			<div className="readout-scroll">
				<MarkdownRenderer
					file={fieldLogFile}
					content={{
						...markdownContent,
						id: `${markdownContent.id}:promotion:${promotion.promotionId}`,
						text: entry.readoutMarkdown ?? entry.summary,
					}}
					view="rendered"
					capability={capability}
					staticContents={staticContents}
				/>
			</div>
		</>
	);
}
