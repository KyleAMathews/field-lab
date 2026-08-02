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
import { validateFieldLog } from "../field-log/writer";
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
	sourceIdentityPaths: Record<string, string>;
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
	requiresAuthorization: boolean;
	authorized: boolean;
}

async function fieldLogEventDependencies(
	path: string,
): Promise<PublicationDependency[]> {
	if (basename(path) !== "field_log.jsonl") return [];
	const events = await validateFieldLog(dirname(path));
	const fieldLogRoot = await realpath(dirname(path));
	const collected = new Map<number, string>();
	const dependencies = new Map<
		string,
		{ requiresAuthorization: boolean; authorized: boolean }
	>();
	for (const event of events) {
		if (event.type === "source.collected") {
			const sourceId = Number(event.payload.sourceId);
			const sourcePath = event.payload.path;
			if (Number.isInteger(sourceId) && typeof sourcePath === "string") {
				const canonicalSource = isAbsolute(sourcePath)
					? await realpath(sourcePath).catch(() => sourcePath)
					: null;
				const sourceRelative = canonicalSource
					? relative(fieldLogRoot, canonicalSource)
					: "";
				const isExternal =
					sourceRelative === ".." ||
					sourceRelative.startsWith(`..${sep}`) ||
					isAbsolute(sourceRelative);
				collected.set(sourceId, sourcePath);
				dependencies.set(sourcePath, {
					requiresAuthorization:
						isExternal || typeof event.payload.originalPath === "string",
					authorized: false,
				});
			}
			continue;
		}
		if (event.type === "source.publication.authorized") {
			const sourcePath = collected.get(Number(event.payload.sourceId));
			if (!sourcePath)
				throw new Error(
					"Publication consent must follow the matching source collection.",
				);
			const dependency = dependencies.get(sourcePath);
			if (dependency)
				dependencies.set(sourcePath, { ...dependency, authorized: true });
		}
	}
	return [...dependencies].map(([dependencyPath, authorization]) => ({
		path: dependencyPath,
		...authorization,
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
	const sourceIdentityPaths: Record<string, string> = {};
	const diagnostics: DiagnosticRecord[] = [];

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
				requiresAuthorization: false,
				authorized: true,
			})),
			...(await structuredDependencies(absolute)).map((dependencyPath) => ({
				path: dependencyPath,
				requiresAuthorization: false,
				authorized: true,
			})),
			...(await fieldLogEventDependencies(absolute)),
		];
		for (const dependency of dependencies) {
			const clean = dependency.path.split(/[?#]/, 1)[0];
			if (!clean) continue;
			if (dependency.requiresAuthorization && !dependency.authorized) {
				diagnostics.push({
					id: `publish:external-source:${diagnostics.length + 1}`,
					fileId: path,
					severity: "warning",
					source: "publish",
					message: `External source omitted because no publication consent was recorded: ${clean}`,
					location: clean,
				});
				continue;
			}
			if (isAbsolute(clean)) {
				const dependencyAbsolute = await realpath(clean);
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
					sourceIdentityPaths[clean] = dependencyAbsolute;
				} else if (dependency.authorized) {
					const dependencyStat = await stat(dependencyAbsolute);
					if (!dependencyStat.isFile())
						throw new Error(`Missing publication asset: ${dependency.path}`);
					sourceIdentityPaths[clean] = dependencyAbsolute;
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
		sourceIdentityPaths,
	};
}
