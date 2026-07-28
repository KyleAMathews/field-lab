import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
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
});
