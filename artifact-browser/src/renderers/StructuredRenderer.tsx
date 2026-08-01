import YAML from "yaml";
import type { RendererProps } from "./registry";

export function StructuredRenderer({ file, content, view }: RendererProps) {
	if (!content.text)
		return <p>This file is too large for the structured view.</p>;
	if (view === "source")
		return <pre className="source-view">{content.text}</pre>;
	try {
		const value =
			file.extension === "json"
				? JSON.parse(content.text)
				: YAML.parse(content.text);
		return (
			<pre className="structured-view">{JSON.stringify(value, null, 2)}</pre>
		);
	} catch {
		return <pre className="source-view">{content.text}</pre>;
	}
}
