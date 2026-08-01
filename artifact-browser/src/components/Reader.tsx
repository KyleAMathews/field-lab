import { useLiveQuery } from "@tanstack/react-db";
import { getContentCollection } from "../collections/content";
import { useRetainedValue } from "../hooks/useRetainedValue";
import type { FileRecord } from "../protocol/types";
import { selectRenderer } from "../renderers/registry";

export function Reader({
	file,
	capability,
	view,
	staticContents,
}: {
	file: FileRecord | undefined;
	capability: string;
	view: "rendered" | "source";
	staticContents?: Record<string, string>;
}) {
	if (!file) {
		return (
			<div className="empty-reader">
				<p>Select a file to read it.</p>
			</div>
		);
	}
	if (file.kind === "directory") {
		return (
			<div className="empty-reader">
				<p>{file.name} is a directory.</p>
			</div>
		);
	}

	return <LoadedReader {...{ file, capability, view, staticContents }} />;
}

function LoadedReader({
	file,
	capability,
	view,
	staticContents,
}: {
	file: FileRecord;
	capability: string;
	view: "rendered" | "source";
	staticContents?: Record<string, string>;
}) {
	const collection = getContentCollection(
		file.path,
		file.revision,
		capability,
		staticContents?.[file.path],
	);
	const { data = [], isLoading, isError } = useLiveQuery(collection);
	const content = useRetainedValue(file.path, data[0]);
	if (isLoading && !content)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading file"
			/>
		);
	if (isError)
		return <div className="reader-error">This file could not be read.</div>;
	if (!content)
		return (
			<div
				className="reader-skeleton"
				role="status"
				aria-label="Loading file"
			/>
		);
	const Renderer = selectRenderer(file);
	return (
		<Renderer
			file={file}
			content={content}
			view={view}
			capability={capability}
			staticContents={staticContents}
		/>
	);
}
