import { describe, expect, it, vi } from "vitest";
import { loadStaticBrowserData } from "./static";

describe("static browser data", () => {
	it("loads manifest records into TanStack DB collections", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						version: 1,
						workspaceName: "published",
						generatedAt: 1,
						entries: ["post.md"],
						files: [
							{
								id: "post.md",
								path: "post.md",
								parentPath: ".",
								name: "post.md",
								kind: "file",
								extension: "md",
								mimeType: "text/markdown",
								size: 10,
								modifiedAt: 1,
								revision: "1",
								rendererId: "markdown",
								readable: true,
							},
						],
						artifacts: [],
						diagnostics: [],
						contents: { "post.md": "content/hash.md" },
					}),
				),
			),
		);
		const data = await loadStaticBrowserData();
		expect(data.db.collections.files.get("post.md")?.name).toBe("post.md");
		expect(data.staticContents?.["post.md"]).toBe("content/hash.md");
	});
});
