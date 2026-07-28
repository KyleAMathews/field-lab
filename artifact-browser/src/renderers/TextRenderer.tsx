import type { RendererProps } from "./registry";

export function TextRenderer({ content }: RendererProps) {
	return content.tooLarge ? (
		<p>This text file is too large to render in the browser.</p>
	) : (
		<pre className="source-view">{content.text}</pre>
	);
}
