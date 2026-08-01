import { createHash, randomUUID } from "node:crypto";
import {
	cp,
	mkdir,
	readFile,
	rename,
	rm,
	stat,
	writeFile,
} from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import type { PublicationPlan } from "./collect";
import { type PublishedManifest, validatePublishedManifest } from "./manifest";

async function exists(path: string): Promise<boolean> {
	return Boolean(await stat(path).catch(() => null));
}

export async function buildPublication(options: {
	plan: PublicationPlan;
	output: string;
	staticAppDir: string;
	force: boolean;
}): Promise<PublishedManifest> {
	const output = resolve(options.output);
	if ((await exists(output)) && !options.force) {
		throw new Error(`Output already exists: ${output}`);
	}
	const stage = join(
		dirname(output),
		`.${basename(output)}-${randomUUID()}.stage`,
	);
	const backup = join(
		dirname(output),
		`.${basename(output)}-${randomUUID()}.backup`,
	);
	await mkdir(stage, { recursive: false });

	try {
		await cp(options.staticAppDir, stage, { recursive: true });
		const indexPath = join(stage, "index.html");
		const indexHtml = await readFile(indexPath, "utf8");
		await writeFile(indexPath, indexHtml.replace(/(["'])\/\.\//g, "$1./"));
		const contents: Record<string, string> = {};
		const sources: Array<[path: string, absolute: string]> = [];
		for (const file of options.plan.files) {
			if (file.kind !== "file") continue;
			const absolute = options.plan.absolutePaths[file.path];
			if (!absolute) throw new Error(`Missing source for ${file.path}`);
			sources.push([file.path, absolute]);
		}
		sources.push(...Object.entries(options.plan.sourceIdentityPaths));
		if (sources.length)
			await mkdir(join(stage, "content"), { recursive: true });
		for (const [path, absolute] of sources) {
			const body = await readFile(absolute);
			const hash = createHash("sha256").update(body).digest("hex");
			const asset = `content/${hash}${extname(path).toLowerCase()}`;
			if (!(await exists(join(stage, asset))))
				await writeFile(join(stage, asset), body);
			contents[path] = asset;
		}

		const manifest = validatePublishedManifest({
			version: 1,
			workspaceName: options.plan.workspaceName,
			generatedAt: Date.now(),
			entries: options.plan.entries,
			files: options.plan.files,
			artifacts: options.plan.artifacts,
			diagnostics: options.plan.diagnostics,
			contents,
		});
		await writeFile(
			join(stage, "publication.json"),
			JSON.stringify(manifest, null, 2),
		);

		const hadOutput = await exists(output);
		if (hadOutput) await rename(output, backup);
		try {
			await rename(stage, output);
		} catch (error) {
			if (hadOutput && (await exists(backup))) await rename(backup, output);
			throw error;
		}
		if (hadOutput) await rm(backup, { recursive: true, force: true });
		return manifest;
	} catch (error) {
		await rm(stage, { recursive: true, force: true });
		if ((await exists(backup)) && !(await exists(output)))
			await rename(backup, output);
		throw error;
	}
}
