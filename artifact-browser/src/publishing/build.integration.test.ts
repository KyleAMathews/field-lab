import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildPublication } from "./build";
import { collectPublication } from "./collect";

describe("publication build", () => {
	it("copies the reader and content-addresses source files", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-build-"));
		const app = join(root, "app");
		const output = join(root, "site");
		await mkdir(app);
		await writeFile(
			join(app, "index.html"),
			'<script src="/./assets/reader.js"></script><main>reader bundle</main>',
		);
		await mkdir(join(app, "assets"));
		await writeFile(join(app, "assets/reader.js"), "export {}");
		await writeFile(join(root, "post.md"), "# Published");
		const externalSource = join(root, "transcript.txt");
		await writeFile(externalSource, "Transcript");
		const plan = await collectPublication({ root, entries: ["post.md"] });
		plan.sourceIdentityPaths["/original/transcript.txt"] = externalSource;
		const manifest = await buildPublication({
			plan,
			output,
			staticAppDir: app,
			force: false,
		});

		const indexHtml = await readFile(join(output, "index.html"), "utf8");
		expect(indexHtml).toContain("reader bundle");
		expect(indexHtml).toContain('src="./assets/reader.js"');
		expect(
			await stat(join(output, manifest.contents["post.md"] ?? "")),
		).toBeTruthy();
		expect(
			await stat(
				join(output, manifest.contents["/original/transcript.txt"] ?? ""),
			),
		).toBeTruthy();
		expect(
			JSON.parse(await readFile(join(output, "publication.json"), "utf8")),
		).toEqual(manifest);
	});
});
