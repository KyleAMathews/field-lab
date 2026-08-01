import { lstat, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export interface ResolvedTarget {
	root: string;
	initialPath: string | null;
}

function isWithin(root: string, candidate: string): boolean {
	const rel = relative(root, candidate);
	return (
		rel === "" ||
		(!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel))
	);
}

export async function resolveRootTarget(
	target: string,
): Promise<ResolvedTarget> {
	const canonicalTarget = await realpath(resolve(target));
	const stats = await lstat(canonicalTarget);

	if (stats.isDirectory()) {
		return { root: canonicalTarget, initialPath: null };
	}

	if (!stats.isFile()) {
		throw new Error("The target must be a file or directory.");
	}

	return {
		root: await realpath(dirname(canonicalTarget)),
		initialPath: canonicalTarget.slice(dirname(canonicalTarget).length + 1),
	};
}

export async function resolveContentPath(
	root: string,
	relativePath: string,
): Promise<string> {
	if (relativePath.includes("\0")) throw new Error("Invalid content path.");
	if (isAbsolute(relativePath)) return realpath(relativePath);
	if (
		relativePath === ".." ||
		relativePath.startsWith("../") ||
		relativePath.startsWith(`..${sep}`)
	) {
		throw new Error("Invalid content path.");
	}

	const canonicalRoot = await realpath(root);
	const candidate = resolve(canonicalRoot, relativePath || ".");
	if (!isWithin(canonicalRoot, candidate)) {
		throw new Error("Content path escapes the workspace.");
	}

	const canonicalCandidate = await realpath(candidate);
	if (!isWithin(canonicalRoot, canonicalCandidate)) {
		throw new Error("Content path escapes the workspace.");
	}

	return canonicalCandidate;
}

export async function resolveExternalFilePath(
	root: string,
	launchDirectory: string,
	path: string,
): Promise<string> {
	if (!path || path.includes("\0")) throw new Error("Invalid file path.");
	const candidates = isAbsolute(path)
		? [path]
		: [
				resolve(root, path),
				resolve(launchDirectory, path),
				resolve(dirname(launchDirectory), path),
			];
	for (const candidate of new Set(candidates)) {
		const canonical = await realpath(candidate).catch(() => null);
		if (!canonical) continue;
		const stats = await lstat(canonical).catch(() => null);
		if (stats?.isFile()) return canonical;
	}
	throw new Error("File not found.");
}
