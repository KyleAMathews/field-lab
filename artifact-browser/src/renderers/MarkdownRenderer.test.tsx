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

[Entry](?file=../field-trips/trip/field_log.md&entry=entry-4&readout=2)

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
		expect(screen.getByRole("link", { name: "Entry" })).toHaveAttribute(
			"href",
			"?file=field-trips%2Ftrip%2Ffield_log.md&entry=entry-4&readout=2&cap=secret",
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

	it("highlights prose matches without changing code", () => {
		const { container } = render(
			<MarkdownRenderer
				file={file}
				content={content("Branch and BRANCH but `branch`")}
				view="rendered"
				capability="secret"
				highlight="branch"
			/>,
		);

		expect(container.querySelectorAll("mark.search-match")).toHaveLength(2);
		expect(container.querySelector("code")).toHaveTextContent("branch");
		expect(container.querySelector("code mark")).toBeNull();
	});

	it("links only indexed local paths outside links and code blocks", () => {
		const source = `Read ../probes/ledger.md, then \`../probes/ledger.md\`.

Missing paths/missing.md and \`../probes/missing.md\` stay plain.

Absolute \`/Users/example/ledger.md\` and escape \`../../secret.md\` stay plain.

[Existing \`../probes/ledger.md\`](../README.md)

\`\`\`
../probes/ledger.md
\`\`\`
`;
		const { container } = render(
			<MarkdownRenderer
				file={file}
				content={content(source)}
				view="rendered"
				capability="secret"
				knownPaths={new Set(["probes/ledger.md", "README.md"])}
			/>,
		);

		const autoLinks = screen.getAllByRole("link", {
			name: "../probes/ledger.md",
		});
		expect(autoLinks).toHaveLength(2);
		for (const link of autoLinks) {
			expect(link).toHaveAttribute(
				"href",
				"?file=probes%2Fledger.md&cap=secret",
			);
		}
		expect(screen.getByRole("link", { name: /Existing/ })).toHaveAttribute(
			"href",
			"?file=README.md&cap=secret",
		);
		expect(container.querySelectorAll("pre a")).toHaveLength(0);
		expect(screen.getByText("../probes/missing.md").closest("a")).toBeNull();
		expect(
			screen.getByText("/Users/example/ledger.md").closest("a"),
		).toBeNull();
		expect(screen.getByText("../../secret.md").closest("a")).toBeNull();
	});
});
