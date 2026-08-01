import { describe, expect, it } from "vitest";
import { isStructuredContent, isTextualContent } from "./content";

describe("content classification", () => {
	it("loads JSONL event streams as structured text", () => {
		expect(
			isStructuredContent("field_log.jsonl", "application/octet-stream"),
		).toBe(true);
		expect(
			isTextualContent("field_log.jsonl", "application/octet-stream"),
		).toBe(true);
	});

	it("loads source files as text despite ambiguous MIME types", () => {
		expect(isTextualContent("projection.ts", "video/mp2t")).toBe(true);
		expect(isTextualContent("component.tsx", "application/octet-stream")).toBe(
			true,
		);
	});
});
