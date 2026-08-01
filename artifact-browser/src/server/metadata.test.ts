import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { readExternalFileMetadata, readFileMetadata } from "./metadata";

describe("metadata", () => {
	it("extracts file and artifact metadata without the body", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-meta-"));
		const file = join(root, "reading.md");
		await writeFile(
			file,
			`---
artifact:
  title: Candidate validation
  schema: field-lab/ledger
  role: reading
  representation: ledger
  renderingMode: instrumented
  exposure: checkpoint
  instrument:
    id: hostile-assay
    family: test
    contact: artifact
---
# Body
`,
		);

		const result = await readFileMetadata(root, file, 2);
		expect(result.file).toMatchObject({
			id: "reading.md",
			parentPath: ".",
			rendererId: "markdown",
			mimeType: "text/markdown",
		});
		expect(result.artifact).toMatchObject({
			fileId: "reading.md",
			title: "Candidate validation",
			schemaId: "field-lab/ledger",
			representation: "ledger",
			instrumentFamily: "test",
		});
		expect(result.file).not.toHaveProperty("body");
	});

	it("keeps malformed artifact files browsable", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-meta-"));
		const file = join(root, "bad.md");
		await writeFile(
			file,
			"---\nartifact:\n  role: nonsense\n---\nStill readable",
		);
		const result = await readFileMetadata(root, file, 1);
		expect(result.file.rendererId).toBe("markdown");
		expect(result.artifact).toBeNull();
		expect(result.diagnostic?.source).toBe("schema");
	});

	it("treats TypeScript as source text rather than MPEG video", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-meta-"));
		const file = join(root, "projection.ts");
		await writeFile(file, "export const projection = true;\n");

		const result = await readFileMetadata(root, file, 1);
		expect(result.file).toMatchObject({
			extension: "ts",
			mimeType: "text/typescript",
			rendererId: "text",
		});

		const external = await readExternalFileMetadata(file);
		expect(external).toMatchObject({
			mimeType: "text/typescript",
			rendererId: "text",
		});
	});
});
