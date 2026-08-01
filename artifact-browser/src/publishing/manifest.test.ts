import { describe, expect, it } from "vitest";
import { validatePublishedManifest } from "./manifest";

describe("published manifest", () => {
	it("validates a versioned root-relative manifest", () => {
		expect(
			validatePublishedManifest({
				version: 1,
				workspaceName: "field-note",
				generatedAt: 1,
				entries: ["post.md"],
				files: [],
				artifacts: [],
				diagnostics: [],
				contents: {
					"post.md": "content/abc.md",
					"/original/transcript.txt": "content/def.txt",
				},
			}).version,
		).toBe(1);
	});

	it("rejects traversal", () => {
		expect(() =>
			validatePublishedManifest({
				version: 1,
				workspaceName: "field-note",
				generatedAt: 1,
				entries: ["../secret.md"],
				files: [],
				artifacts: [],
				diagnostics: [],
				contents: {},
			}),
		).toThrow();
	});
});
