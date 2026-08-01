import {
	mkdir,
	mkdtemp,
	readFile,
	realpath,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectPublication } from "./collect";

describe("publication collection", () => {
	it("includes embedded media but does not crawl ordinary links", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		await mkdir(join(root, "images"));
		await writeFile(
			join(root, "post.md"),
			"# Post\n\n![Figure](./images/figure.svg)\n\n[Private](./private.md)",
		);
		await writeFile(join(root, "images/figure.svg"), "<svg/>");
		await writeFile(join(root, "private.md"), "# Private");

		const plan = await collectPublication({ root, entries: ["post.md"] });
		expect(
			plan.files
				.filter((file) => file.kind === "file")
				.map((file) => file.path),
		).toEqual(["images/figure.svg", "post.md"]);
	});

	it("rejects escaping media", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "root");
		await mkdir(root);
		await writeFile(join(parent, "secret.png"), "secret");
		await writeFile(join(root, "post.md"), "![No](../secret.png)");
		await expect(
			collectPublication({ root, entries: ["post.md"] }),
		).rejects.toThrow();
	});

	it("publishes a Field Log with its canonical event stream", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "trip");
		await mkdir(join(root, "sources"), { recursive: true });
		const externalSource = join(parent, "transcript.txt");
		await writeFile(
			join(root, "field_log.md"),
			"---\ntype: field-log\nformat: field-log/v1\nevent-stream: ./field_log.jsonl\n---\n# Field Log",
		);
		await writeFile(
			join(root, "field_log.jsonl"),
			[
				'{"schema":"field-log/v1","eventId":1}',
				`{"schema":"field-log/v1","eventId":2,"type":"source.collected","payload":{"sourceId":1,"path":"${join(root, "sources", "paper.pdf")}"}}`,
				`{"schema":"field-log/v1","eventId":3,"type":"source.collected","payload":{"sourceId":2,"path":"${externalSource}"}}`,
				'{"schema":"field-log/v1","eventId":4,"type":"source.publication.authorized","authorization":{"kind":"user-request","pointer":"turn-4","verbatim":"Publish it."},"payload":{"sourceId":2}}',
			].join("\n"),
		);
		await writeFile(join(root, "sources", "paper.pdf"), "paper");
		await writeFile(externalSource, "transcript");
		const planWithoutConsent = await collectPublication({
			root,
			entries: ["field_log.md"],
		});
		expect(
			planWithoutConsent.files
				.filter((file) => file.kind === "file")
				.map((file) => file.path),
		).toEqual(["field_log.jsonl", "field_log.md", "sources/paper.pdf"]);
		expect(planWithoutConsent.externalSourcePaths).toEqual({});

		await writeFile(
			join(root, "field_log.jsonl"),
			[
				await readFile(join(root, "field_log.jsonl"), "utf8"),
				'{"schema":"field-log/v1","eventId":5,"type":"source.publication.authorized","authorization":{"kind":"publication-consent","pointer":"turn-5","verbatim":"Include the transcript in the published package."},"payload":{"sourceId":2}}',
			].join("\n"),
		);
		const planWithConsent = await collectPublication({
			root,
			entries: ["field_log.md"],
		});
		expect(planWithConsent.externalSourcePaths).toEqual({
			[externalSource]: await realpath(externalSource),
		});
	});
});
