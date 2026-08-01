import { lstat, open } from "node:fs/promises";
import { basename, dirname, extname, relative, sep } from "node:path";
import matter from "gray-matter";
import mime from "mime";
import YAML from "yaml";
import {
	isSourceCodePath,
	sourceCodeMimeType,
} from "../protocol/content-types";
import { artifactFrontmatterSchema } from "../protocol/schema";
import type {
	ArtifactRecord,
	DiagnosticRecord,
	FileRecord,
	MetadataResult,
} from "../protocol/types";

const MAX_METADATA_BYTES = 128 * 1024;
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx", ".markdown"]);
const STRUCTURED_EXTENSIONS = new Set([".json", ".yaml", ".yml"]);

function normalizePath(root: string, absolutePath: string): string {
	const value = relative(root, absolutePath).split(sep).join("/");
	return value || ".";
}

export function selectRenderer(
	path: string,
	mimeType: string | null,
	directory = false,
): string {
	if (directory) return "directory";
	const extension = extname(path).toLowerCase();
	if (MARKDOWN_EXTENSIONS.has(extension)) return "markdown";
	if (STRUCTURED_EXTENSIONS.has(extension)) return "structured";
	if (extension === ".csv" || extension === ".tsv") return "table";
	if (isSourceCodePath(path)) return "text";
	if (mimeType?.startsWith("image/")) return "image";
	if (mimeType?.startsWith("audio/")) return "audio";
	if (mimeType?.startsWith("video/")) return "video";
	if (mimeType === "application/pdf") return "pdf";
	if (mimeType === "text/html") return "html";
	if (mimeType?.startsWith("text/")) return "text";
	return "unknown";
}

async function readBoundedText(path: string): Promise<string> {
	const handle = await open(path, "r");
	try {
		const buffer = Buffer.alloc(MAX_METADATA_BYTES);
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		return buffer.subarray(0, bytesRead).toString("utf8");
	} finally {
		await handle.close();
	}
}

function diagnostic(fileId: string, message: string): DiagnosticRecord {
	return {
		id: `schema:${fileId}`,
		fileId,
		severity: "warning",
		source: "schema",
		message,
		location: fileId,
	};
}

function artifactFromValue(fileId: string, value: unknown): ArtifactRecord {
	const parsed = artifactFrontmatterSchema.parse(value);
	return {
		id: fileId,
		fileId,
		protocolVersion: parsed.protocol,
		schemaId: parsed.schema,
		schemaVersion: parsed.schemaVersion,
		title: parsed.title,
		instrumentId: parsed.instrument?.id ?? null,
		instrumentFamily: parsed.instrument?.family ?? null,
		contact: parsed.instrument?.contact ?? null,
		role: parsed.role,
		representation: parsed.representation,
		renderingMode: parsed.renderingMode,
		exposure: parsed.exposure,
		valid: true,
	};
}

async function inspectArtifact(
	path: string,
	fileId: string,
): Promise<{
	artifact: ArtifactRecord | null;
	diagnostic: DiagnosticRecord | null;
}> {
	const extension = extname(path).toLowerCase();
	if (
		!MARKDOWN_EXTENSIONS.has(extension) &&
		!STRUCTURED_EXTENSIONS.has(extension)
	) {
		return { artifact: null, diagnostic: null };
	}

	try {
		const source = await readBoundedText(path);
		let value: unknown;
		if (MARKDOWN_EXTENSIONS.has(extension)) {
			value = matter(source).data.artifact;
		} else {
			const document =
				extension === ".json" ? JSON.parse(source) : YAML.parse(source);
			value =
				document &&
				typeof document === "object" &&
				"$schema" in document &&
				"artifact" in document
					? document.artifact
					: undefined;
		}

		if (value === undefined) return { artifact: null, diagnostic: null };
		return { artifact: artifactFromValue(fileId, value), diagnostic: null };
	} catch (error) {
		return {
			artifact: null,
			diagnostic: diagnostic(
				fileId,
				error instanceof Error ? error.message : "Invalid artifact metadata.",
			),
		};
	}
}

export async function readFileMetadata(
	root: string,
	absolutePath: string,
	revision: number,
): Promise<MetadataResult> {
	const stats = await lstat(absolutePath);
	const path = normalizePath(root, absolutePath);
	const isDirectory = stats.isDirectory();
	const kind = stats.isSymbolicLink()
		? "symlink"
		: isDirectory
			? "directory"
			: "file";
	const extension =
		!isDirectory && extname(path) ? extname(path).slice(1).toLowerCase() : null;
	const mimeType = isDirectory
		? null
		: (sourceCodeMimeType(path) ??
			mime.getType(path) ??
			"application/octet-stream");
	const file: FileRecord = {
		id: path,
		path,
		parentPath:
			path === "." ? null : dirname(path) === "." ? "." : dirname(path),
		name: path === "." ? basename(root) : basename(path),
		kind,
		extension,
		mimeType,
		size: isDirectory ? null : stats.size,
		modifiedAt: stats.mtimeMs,
		revision: `${stats.mtimeMs.toString(36)}-${stats.size.toString(36)}-${revision.toString(36)}`,
		rendererId: selectRenderer(path, mimeType, isDirectory),
		readable: kind !== "symlink",
	};

	if (kind !== "file") return { file, artifact: null, diagnostic: null };
	const artifact = await inspectArtifact(absolutePath, path);
	return { file, ...artifact };
}

export async function readExternalFileMetadata(
	absolutePath: string,
): Promise<FileRecord> {
	const stats = await lstat(absolutePath);
	if (!stats.isFile()) throw new Error("External source must be a file.");
	const extension = extname(absolutePath)
		? extname(absolutePath).slice(1).toLowerCase()
		: null;
	const mimeType =
		sourceCodeMimeType(absolutePath) ??
		mime.getType(absolutePath) ??
		"application/octet-stream";
	return {
		id: `external:${absolutePath}`,
		path: absolutePath,
		parentPath: null,
		name: basename(absolutePath),
		kind: "file",
		extension,
		mimeType,
		size: stats.size,
		modifiedAt: stats.mtimeMs,
		revision: `${stats.mtimeMs.toString(36)}-${stats.size.toString(36)}`,
		rendererId: selectRenderer(absolutePath, mimeType),
		readable: true,
	};
}
