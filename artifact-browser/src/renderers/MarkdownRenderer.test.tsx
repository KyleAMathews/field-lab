import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FileContent } from "../collections/content";
import type { FileRecord } from "../protocol/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

const file: FileRecord = {
	id: "notes/post.md",
	path: "notes/post.md",
	parentPath: "notes",
	name: "post.md",
	kind: "file",
	extension: "md",
	mimeType: "text/markdown",
	size: 100,
	modifiedAt: 1,
	revision: "1",
	rendererId: "markdown",
	readable: true,
};

function content(text: string): FileContent {
	return {
		id: "notes/post.md@1",
		path: file.path,
		revision: "1",
		mimeType: "text/markdown",
		size: text.length,
		etag: "1",
		text,
		url: "",
		tooLarge: false,
	};
}

describe("MarkdownRenderer", () => {
	it("renders GFM, local media, code, and Mermaid safely", () => {
		const source = `# A field note

- [x] checked

| Claim | State |
| --- | --- |
| One | open |

![Plot](./plot.png)

[Next](../README.md)

<script>window.bad = true</script>

\`\`\`ts
const answer: number = 42
\`\`\`

\`\`\`mermaid
flowchart LR
  A --> B
\`\`\`
`;
		const { container } = render(
			<MarkdownRenderer
				file={file}
				content={content(source)}
				view="rendered"
				capability="secret"
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "A field note" }),
		).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).toBeChecked();
		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("img")).toHaveAttribute(
			"src",
			"/api/content?cap=secret&path=notes%2Fplot.png",
		);
		expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
			"href",
			"?file=README.md&cap=secret",
		);
		expect(container.querySelector("script")).toBeNull();
		expect(container.querySelector(".th-code--ts")).toBeInTheDocument();
		expect(container.querySelector(".th-keyword")).toHaveTextContent("const");
		expect(screen.getByText(/flowchart LR/)).toBeInTheDocument();
	});

	it("shows the original source on request", () => {
		render(
			<MarkdownRenderer
				file={file}
				content={content("# Source")}
				view="source"
				capability="secret"
			/>,
		);
		expect(screen.getByText("# Source")).toBeInTheDocument();
	});
});
