import type { FieldLogSource } from "./projection";

function resolvePath(base: string[], value: string): string | undefined {
	const resolved = [...base];
	for (const part of value.replaceAll("\\", "/").split("/")) {
		if (!part || part === ".") continue;
		if (part === "..") {
			if (resolved.length && resolved.at(-1) !== "..") resolved.pop();
			else resolved.push("..");
		} else {
			resolved.push(part);
		}
	}
	return resolved.join("/") || undefined;
}

function knownPathSuffix(
	path: string,
	knownPaths: ReadonlySet<string>,
): string | undefined {
	const parts = path.replaceAll("\\", "/").split("/");
	for (let index = 0; index < parts.length; index += 1) {
		const suffix = parts.slice(index).join("/");
		if (knownPaths.has(suffix)) return suffix;
	}
	return undefined;
}

export function sourceLocalPath(
	source: FieldLogSource,
	fieldLogPath: string,
	knownPaths?: ReadonlySet<string>,
): string | undefined {
	if (source.path) {
		if (source.path.startsWith("/") || /^[a-z]+:/i.test(source.path)) {
			return source.path;
		}
		const resolved = resolvePath(
			fieldLogPath.split("/").slice(0, -1),
			source.path,
		);
		return resolved;
	}

	const legacyPath = /^local file:\s*(.+)$/i.exec(source.origin ?? "")?.[1];
	if (!legacyPath || legacyPath.startsWith("/")) return undefined;
	const resolved = resolvePath([], legacyPath);
	if (!resolved || !knownPaths) return resolved;
	return knownPathSuffix(resolved, knownPaths) ?? resolved;
}
