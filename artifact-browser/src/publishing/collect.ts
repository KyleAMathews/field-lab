import { readdir, readFile, realpath, stat } from "node:fs/promises";
import {
	basename,
	dirname,
	extname,
	isAbsolute,
	join,
	relative,
	resolve,
	sep,
} from "node:path";
import matter from "gray-matter";
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
	externalSourcePaths: Record<string, string>;
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
	if (source) {
		const data = matter(source).data as Record<string, unknown>;
		const eventStream = data["event-stream"];
		if (
			data.type === "field-log" &&
			typeof eventStream === "string" &&
			eventStream.trim()
		) {
			dependencies.add(eventStream);
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

interface PublicationDependency {
	path: string;
	allowExternal: boolean;
}

async function fieldLogEventDependencies(
	path: string,
): Promise<PublicationDependency[]> {
	if (extname(path).toLowerCase() !== ".jsonl") return [];
	const source = await readFile(path, "utf8");
	const events: Array<Record<string, unknown>> = [];
	for (const [index, line] of source.split(/\r?\n/).entries()) {
		if (!line.trim()) continue;
		let event: unknown;
		try {
			event = JSON.parse(line);
		} catch {
			throw new Error(`Invalid JSONL at ${path}:${index + 1}`);
		}
		if (event && typeof event === "object")
			events.push(event as Record<string, unknown>);
	}

	const authorizedSourceIds = new Set<number>();
	for (const event of events) {
		if (event.type !== "source.publication.authorized") continue;
		const payload = event.payload as Record<string, unknown> | undefined;
		const authorization = event.authorization as
			| Record<string, unknown>
			| undefined;
		if (
			Number.isInteger(payload?.sourceId) &&
			authorization?.kind === "publication-consent" &&
			typeof authorization.pointer === "string" &&
			authorization.pointer.trim() &&
			typeof authorization.verbatim === "string" &&
			authorization.verbatim.trim()
		) {
			authorizedSourceIds.add(Number(payload?.sourceId));
		}
	}

	const dependencies = new Map<string, boolean>();
	for (const event of events) {
		if (event.type !== "source.collected") continue;
		const payload = event.payload as Record<string, unknown> | undefined;
		if (typeof payload?.path !== "string" || !payload.path.trim()) continue;
		const sourceId = payload.sourceId;
		dependencies.set(
			payload.path,
			Number.isInteger(sourceId) && authorizedSourceIds.has(Number(sourceId)),
		);
	}
	return [...dependencies].map(([dependencyPath, allowExternal]) => ({
		path: dependencyPath,
		allowExternal,
	}));
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
	const externalSourcePaths: Record<string, string> = {};

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
		const dependencies: PublicationDependency[] = [
			...markdownDependencies(source).map((dependencyPath) => ({
				path: dependencyPath,
				allowExternal: false,
			})),
			...(await structuredDependencies(absolute)).map((dependencyPath) => ({
				path: dependencyPath,
				allowExternal: false,
			})),
			...(await fieldLogEventDependencies(absolute)),
		];
		for (const dependency of dependencies) {
			const clean = dependency.path.split(/[?#]/, 1)[0];
			if (!clean) continue;
			if (isAbsolute(clean)) {
				const dependencyAbsolute = await realpath(clean).catch((error) => {
					if (!dependency.allowExternal) return null;
					throw error;
				});
				if (!dependencyAbsolute) continue;
				const relativePath = rootRelative(root, dependencyAbsolute);
				if (relativePath !== ".." && !relativePath.startsWith("../")) {
					const dependencyStat = await stat(dependencyAbsolute);
					if (!dependencyStat.isFile())
						throw new Error(`Missing publication asset: ${dependency.path}`);
					if (!selected.has(relativePath)) {
						selected.add(relativePath);
						queue.push(relativePath);
					}
				} else if (dependency.allowExternal) {
					const dependencyStat = await stat(dependencyAbsolute);
					if (!dependencyStat.isFile())
						throw new Error(`Missing publication asset: ${dependency.path}`);
					externalSourcePaths[clean] = dependencyAbsolute;
				}
				continue;
			}
			const dependencyAbsolute = await resolveContentPath(
				root,
				rootRelative(root, resolve(dirname(absolute), clean)),
			);
			const dependencyPath = rootRelative(root, dependencyAbsolute);
			const dependencyStat = await stat(dependencyAbsolute);
			if (!dependencyStat.isFile())
				throw new Error(`Missing publication asset: ${dependency.path}`);
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
		externalSourcePaths,
	};
}
