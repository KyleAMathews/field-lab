import { readdir, readFile, stat } from "node:fs/promises";
import {
	basename,
	dirname,
	extname,
	join,
	relative,
	resolve,
	sep,
} from "node:path";
import type {
	ArtifactRecord,
	DiagnosticRecord,
	Exposure,
	FileRecord,
} from "../protocol/types";
import { readFileMetadata } from "../server/metadata";
import { resolveContentPath } from "../server/path-policy";

export interface PublicationPlan {
	root: string;
	workspaceName: string;
	entries: string[];
	files: FileRecord[];
	artifacts: ArtifactRecord[];
	diagnostics: DiagnosticRecord[];
	absolutePaths: Record<string, string>;
}

function rootRelative(root: string, path: string): string {
	return relative(root, path).split(sep).join("/");
}

async function walk(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const paths: string[] = [];
	for (const entry of entries) {
		if ([".git", "node_modules", "dist", ".output"].includes(entry.name))
			continue;
		const path = join(directory, entry.name);
		if (entry.isDirectory()) paths.push(...(await walk(path)));
		else if (entry.isFile()) paths.push(path);
	}
	return paths;
}

function markdownDependencies(source: string): string[] {
	const dependencies = new Set<string>();
	const imagePattern = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
	const htmlMediaPattern =
		/<(?:img|audio|video|source)\b[^>]*\bsrc=["']([^"']+)["']/gi;
	for (const pattern of [imagePattern, htmlMediaPattern]) {
		for (const match of source.matchAll(pattern)) {
			const target = match[1];
			if (target && !/^(?:https?:|data:|#)/i.test(target))
				dependencies.add(target);
		}
	}
	return [...dependencies];
}

async function structuredDependencies(path: string): Promise<string[]> {
	if (!/\.(?:json|ya?ml)$/i.test(path)) return [];
	try {
		const source = await readFile(path, "utf8");
		const value =
			extname(path).toLowerCase() === ".json"
				? JSON.parse(source)
				: (await import("yaml")).default.parse(source);
		return Array.isArray(value?.references)
			? value.references.filter(
					(item: unknown): item is string => typeof item === "string",
				)
			: [];
	} catch {
		return [];
	}
}

export async function collectPublication(options: {
	root: string;
	entries: string[];
	includeExposure?: Exposure[];
}): Promise<PublicationPlan> {
	const root = await resolveContentPath(options.root, "");
	const includeExposure = new Set(options.includeExposure ?? ["public"]);
	const selected = new Set<string>();
	const entryPaths: string[] = [];

	for (const input of options.entries) {
		const absolute = await resolveContentPath(root, input);
		const inputStat = await stat(absolute);
		if (inputStat.isFile()) {
			const path = rootRelative(root, absolute);
			selected.add(path);
			entryPaths.push(path);
			continue;
		}
		if (!inputStat.isDirectory())
			throw new Error(`${input} is not a file or directory.`);
		for (const path of await walk(absolute)) {
			const metadata = await readFileMetadata(root, path, 1);
			if (
				metadata.artifact &&
				includeExposure.has(metadata.artifact.exposure)
			) {
				const relativePath = rootRelative(root, path);
				selected.add(relativePath);
				entryPaths.push(relativePath);
			}
		}
	}

	const queue = [...selected];
	for (let index = 0; index < queue.length; index += 1) {
		const path = queue[index];
		if (!path) continue;
		const absolute = await resolveContentPath(root, path);
		const source = /\.(?:md|mdx|markdown)$/i.test(path)
			? await readFile(absolute, "utf8")
			: "";
		const dependencies = [
			...markdownDependencies(source),
			...(await structuredDependencies(absolute)),
		];
		for (const dependency of dependencies) {
			const clean = dependency.split(/[?#]/, 1)[0];
			if (!clean) continue;
			const dependencyAbsolute = await resolveContentPath(
				root,
				rootRelative(root, resolve(dirname(absolute), clean)),
			);
			const dependencyPath = rootRelative(root, dependencyAbsolute);
			const dependencyStat = await stat(dependencyAbsolute);
			if (!dependencyStat.isFile())
				throw new Error(`Missing publication asset: ${dependency}`);
			if (!selected.has(dependencyPath)) {
				selected.add(dependencyPath);
				queue.push(dependencyPath);
			}
		}
	}

	const files: FileRecord[] = [];
	const artifacts: ArtifactRecord[] = [];
	const diagnostics: DiagnosticRecord[] = [];
	const absolutePaths: Record<string, string> = {};
	const visiblePaths = new Set(selected);
	visiblePaths.add(".");
	for (const path of selected) {
		let parent = dirname(path);
		while (parent !== ".") {
			visiblePaths.add(parent);
			parent = dirname(parent);
		}
	}
	let revision = 0;
	for (const path of [...visiblePaths].sort()) {
		const absolute = await resolveContentPath(root, path);
		const metadata = await readFileMetadata(root, absolute, ++revision);
		files.push(metadata.file);
		if (metadata.artifact) artifacts.push(metadata.artifact);
		if (metadata.diagnostic) diagnostics.push(metadata.diagnostic);
		absolutePaths[path] = absolute;
	}

	return {
		root,
		workspaceName: basename(root),
		entries: [...new Set(entryPaths)],
		files,
		artifacts,
		diagnostics,
		absolutePaths,
	};
}
