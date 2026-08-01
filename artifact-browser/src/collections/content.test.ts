import { describe, expect, it } from "vitest";
import {
	contentByteLimit,
	contentCollectionCacheSize,
	getContentCollection,
	isStructuredContent,
	isTextualContent,
} from "./content";

describe("content classification", () => {
	it("loads JSONL event streams as structured text", () => {
		expect(
			isStructuredContent("field_log.jsonl", "application/octet-stream"),
		).toBe(true);
		expect(
			isTextualContent("field_log.jsonl", "application/octet-stream"),
		).toBe(true);
	});

	it("does not stop rendering a Field Log at the structured-data ceiling", () => {
		expect(
			contentByteLimit("field_log.jsonl", "application/x-ndjson"),
		).toBeGreaterThan(2 * 1024 * 1024);
	});

	it("evicts an older content collection when a file revision changes", () => {
		const before = contentCollectionCacheSize();
		getContentCollection("field_log.md", "revision-1", "cache-test");
		expect(contentCollectionCacheSize()).toBe(before + 1);
		getContentCollection("field_log.md", "revision-2", "cache-test");
		expect(contentCollectionCacheSize()).toBe(before + 1);
	});

	it("loads source files as text despite ambiguous MIME types", () => {
		expect(isTextualContent("projection.ts", "video/mp2t")).toBe(true);
		expect(isTextualContent("component.tsx", "application/octet-stream")).toBe(
			true,
		);
	});
});
