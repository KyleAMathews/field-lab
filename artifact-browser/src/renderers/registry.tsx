import type { ComponentType } from "react";
import type { FileContent } from "../collections/content";
import type { FileRecord } from "../protocol/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { MediaRenderer } from "./MediaRenderer";
import { StructuredRenderer } from "./StructuredRenderer";
import { TextRenderer } from "./TextRenderer";

export interface RendererProps {
	file: FileRecord;
	content: FileContent;
	view: "rendered" | "source";
	capability: string;
	staticContents?: Record<string, string>;
}

const registry: Record<string, ComponentType<RendererProps>> = {
	markdown: MarkdownRenderer,
	structured: StructuredRenderer,
	text: TextRenderer,
	table: MediaRenderer,
	image: MediaRenderer,
	audio: MediaRenderer,
	video: MediaRenderer,
	pdf: MediaRenderer,
	html: MediaRenderer,
	unknown: MediaRenderer,
};

export function selectRenderer(file: FileRecord): ComponentType<RendererProps> {
	return registry[file.rendererId] ?? MediaRenderer;
}
