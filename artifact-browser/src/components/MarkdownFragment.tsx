import type { FileContent } from "../collections/content";
import type { FileRecord } from "../protocol/types";
import { MarkdownRenderer } from "../renderers/MarkdownRenderer";

export function MarkdownFragment({
	source,
	path,
	capability,
	className,
	staticContents,
	highlight,
}: {
	source: string;
	path: string;
	capability: string;
	className?: string;
	staticContents?: Record<string, string>;
	highlight?: string;
}) {
	const name = path.split("/").at(-1) || "fragment.md";
	const file: FileRecord = {
		id: `markdown-fragment:${path}`,
		path,
		parentPath: path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : ".",
		name,
		kind: "file",
		extension: ".md",
		mimeType: "text/markdown",
		size: source.length,
		modifiedAt: null,
		revision: "fragment",
		rendererId: "markdown",
		readable: true,
	};
	const content: FileContent = {
		id: `${file.id}:${source}`,
		path,
		revision: "fragment",
		mimeType: "text/markdown",
		size: source.length,
		etag: "fragment",
		text: source,
		url: "",
		tooLarge: false,
	};

	return (
		<div className={`markdown-fragment${className ? ` ${className}` : ""}`}>
			<MarkdownRenderer
				file={file}
				content={content}
				view="rendered"
				capability={capability}
				staticContents={staticContents}
				highlight={highlight}
			/>
		</div>
	);
}
