import { createReadStream } from "node:fs";
import { readFile, realpath, stat } from "node:fs/promises";
import {
	createServer,
	type IncomingMessage,
	type Server,
	type ServerResponse,
} from "node:http";
import {
	extname,
	isAbsolute,
	join,
	normalize,
	relative,
	resolve,
	sep,
} from "node:path";
import mime from "mime";
import { validateFieldLog } from "../field-log/writer";
import {
	findFieldLogDirectories,
	searchWorkspace,
} from "../log/workspace-search";
import { sourceCodeMimeType } from "../protocol/content-types";
import type { BootConfig } from "../protocol/types";
import { readExternalFileMetadata, readFileMetadata } from "./metadata";
import { resolveContentPath, resolveExternalFilePath } from "./path-policy";

export interface ArtifactHttpServer {
	origin: string;
	close(): Promise<void>;
}

interface HttpServerOptions {
	root: string;
	capability: string;
	boot: BootConfig;
	staticDir: string;
	launchDirectory?: string;
	host?: string;
	port?: number;
}

function isWithin(root: string, candidate: string): boolean {
	const rel = relative(root, candidate);
	return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`));
}

async function allowedSourcePaths(root: string): Promise<Set<string>> {
	const paths = new Set<string>();
	const directories = new Set([root, ...(await findFieldLogDirectories(root))]);
	for (const directory of directories) {
		const events = await validateFieldLog(directory).catch(() => []);
		for (const event of events) {
			if (event.type !== "source.collected") continue;
			const path = event.payload.path;
			if (typeof path !== "string" || !isAbsolute(path)) continue;
			const canonical = await resolveExternalFilePath(root, root, path).catch(
				() => null,
			);
			if (canonical) paths.add(canonical);
		}
	}
	return paths;
}

function securityHeaders(streamUrl: string): Record<string, string> {
	const streamOrigin = new URL(streamUrl).origin;
	return {
		"content-security-policy": [
			"default-src 'self'",
			"img-src 'self' data: blob:",
			"media-src 'self' blob:",
			"style-src 'self' 'unsafe-inline'",
			"script-src 'self' 'unsafe-inline'",
			`connect-src 'self' ${streamOrigin}`,
			"frame-src 'self' blob:",
			"object-src 'none'",
			"base-uri 'none'",
		].join("; "),
		"referrer-policy": "no-referrer",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY",
	};
}

function send(
	response: ServerResponse,
	status: number,
	body: string,
	headers: Record<string, string> = {},
) {
	response.writeHead(status, {
		"content-type": "text/plain; charset=utf-8",
		"content-length": Buffer.byteLength(body).toString(),
		...headers,
	});
	response.end(body);
}

function hasCapability(requestUrl: URL, capability: string): boolean {
	return requestUrl.searchParams.get("cap") === capability;
}

function validOrigin(
	request: IncomingMessage,
	expectedOrigin: string,
): boolean {
	const origin = request.headers.origin;
	return origin === undefined || origin === expectedOrigin;
}

function parseRange(
	value: string | undefined,
	size: number,
): [number, number] | null {
	if (!value) return null;
	const match = /^bytes=(\d*)-(\d*)$/.exec(value);
	if (!match) return null;
	let start = match[1] ? Number(match[1]) : 0;
	let end = match[2] ? Number(match[2]) : size - 1;
	if (!match[1] && match[2]) {
		const suffix = Number(match[2]);
		start = Math.max(0, size - suffix);
		end = size - 1;
	}
	if (
		!Number.isSafeInteger(start) ||
		!Number.isSafeInteger(end) ||
		start > end ||
		start >= size
	) {
		return null;
	}
	return [start, Math.min(end, size - 1)];
}

function safeStaticPath(staticDir: string, pathname: string): string {
	const decoded = decodeURIComponent(pathname);
	const candidate = resolve(staticDir, `.${normalize(decoded)}`);
	const rel = relative(staticDir, candidate);
	if (rel.startsWith("..") || rel === "..")
		throw new Error("Invalid static path.");
	return candidate;
}

async function serveContent(
	request: IncomingMessage,
	response: ServerResponse,
	requestUrl: URL,
	options: HttpServerOptions,
	download: boolean,
) {
	const path = requestUrl.searchParams.get("path");
	if (!path) return send(response, 400, "A relative path is required.");

	let absolutePath: string;
	try {
		if (isAbsolute(path)) {
			absolutePath = await resolveExternalFilePath(
				options.root,
				options.launchDirectory ?? process.cwd(),
				path,
			);
			if (!(await allowedSourcePaths(options.root)).has(absolutePath))
				throw new Error("Absolute path is not a collected source.");
		} else {
			absolutePath = await resolveContentPath(options.root, path);
		}
	} catch {
		return send(response, 400, "Invalid content path.");
	}

	const file = await stat(absolutePath).catch(() => null);
	if (!file?.isFile()) return send(response, 404, "File not found.");

	const etag = `"${file.size.toString(36)}-${file.mtimeMs.toString(36)}"`;
	const contentType =
		sourceCodeMimeType(absolutePath) ??
		mime.getType(absolutePath) ??
		"application/octet-stream";
	const headers: Record<string, string> = {
		"accept-ranges": "bytes",
		"cache-control": "private, no-cache",
		etag,
		"content-type": contentType,
	};
	if (download) {
		headers["content-disposition"] =
			`attachment; filename*=UTF-8''${encodeURIComponent(
				path.split("/").at(-1) ?? "download",
			)}`;
	}
	if (request.headers["if-none-match"] === etag) {
		response.writeHead(304, headers);
		return response.end();
	}

	const range = parseRange(request.headers.range, file.size);
	if (request.headers.range && !range) {
		response.writeHead(416, {
			...headers,
			"content-range": `bytes */${file.size}`,
		});
		return response.end();
	}
	const [start, end] = range ?? [0, Math.max(0, file.size - 1)];
	const length = file.size === 0 ? 0 : end - start + 1;
	if (range) headers["content-range"] = `bytes ${start}-${end}/${file.size}`;
	headers["content-length"] = length.toString();
	response.writeHead(range ? 206 : 200, headers);
	if (request.method === "HEAD" || file.size === 0) return response.end();
	createReadStream(absolutePath, { start, end }).pipe(response);
}

export async function startHttpServer(
	options: HttpServerOptions,
): Promise<ArtifactHttpServer> {
	let origin = "";
	const canonicalRoot = await realpath(options.root);
	const headers = securityHeaders(options.boot.streamUrl);
	const server: Server = createServer(async (request, response) => {
		for (const [name, value] of Object.entries(headers)) {
			response.setHeader(name, value);
		}
		try {
			const requestUrl = new URL(request.url ?? "/", origin);
			if (requestUrl.pathname.startsWith("/api/")) {
				if (!hasCapability(requestUrl, options.capability)) {
					return send(response, 401, "Missing or invalid capability.");
				}
				if (!validOrigin(request, origin))
					return send(response, 403, "Unexpected origin.");
			}

			if (requestUrl.pathname === "/api/boot") {
				const body = JSON.stringify(options.boot);
				response.writeHead(200, {
					"cache-control": "no-store",
					"content-type": "application/json; charset=utf-8",
					"content-length": Buffer.byteLength(body).toString(),
				});
				return response.end(body);
			}
			if (requestUrl.pathname === "/api/metadata") {
				if (request.method !== "GET") {
					return send(response, 405, "Method not allowed.", { allow: "GET" });
				}
				const path = requestUrl.searchParams.get("path");
				if (!path) return send(response, 400, "A file path is required.");
				const absolutePath = await resolveExternalFilePath(
					options.root,
					options.launchDirectory ?? process.cwd(),
					path,
				).catch(() => null);
				if (!absolutePath) return send(response, 404, "File not found.");
				if (
					!isWithin(canonicalRoot, absolutePath) &&
					!(await allowedSourcePaths(options.root)).has(absolutePath)
				)
					return send(response, 404, "File not found.");
				const metadata = isWithin(canonicalRoot, absolutePath)
					? (await readFileMetadata(canonicalRoot, absolutePath, 1)).file
					: await readExternalFileMetadata(absolutePath);
				const body = JSON.stringify(metadata);
				response.writeHead(200, {
					"cache-control": "private, no-cache",
					"content-type": "application/json; charset=utf-8",
					"content-length": Buffer.byteLength(body).toString(),
				});
				return response.end(body);
			}
			if (requestUrl.pathname === "/api/search") {
				if (request.method !== "GET")
					return send(response, 405, "Method not allowed.", { allow: "GET" });
				const query = requestUrl.searchParams.get("q")?.trim();
				if (!query) return send(response, 400, "A search query is required.");
				const body = JSON.stringify(
					await searchWorkspace(canonicalRoot, query),
				);
				response.writeHead(200, {
					"cache-control": "private, no-cache",
					"content-type": "application/json; charset=utf-8",
					"content-length": Buffer.byteLength(body).toString(),
				});
				return response.end(body);
			}
			if (
				requestUrl.pathname === "/api/content" ||
				requestUrl.pathname === "/api/download"
			) {
				if (request.method !== "GET" && request.method !== "HEAD") {
					return send(response, 405, "Method not allowed.", {
						allow: "GET, HEAD",
					});
				}
				return await serveContent(
					request,
					response,
					requestUrl,
					options,
					requestUrl.pathname === "/api/download",
				);
			}
			if (requestUrl.pathname.startsWith("/api/"))
				return send(response, 404, "Not found.");

			let staticPath = safeStaticPath(options.staticDir, requestUrl.pathname);
			let staticStat = await stat(staticPath).catch(() => null);
			if (staticStat?.isDirectory()) {
				staticPath = join(staticPath, "index.html");
				staticStat = await stat(staticPath).catch(() => null);
			}
			if (!staticStat?.isFile()) {
				staticPath = join(options.staticDir, "index.html");
				staticStat = await stat(staticPath).catch(() => null);
			}
			if (!staticStat?.isFile())
				return send(response, 503, "Build the browser UI first.");

			const body = await readFile(staticPath);
			response.writeHead(200, {
				"cache-control":
					extname(staticPath) === ".html"
						? "no-cache"
						: "public, max-age=31536000",
				"content-type": mime.getType(staticPath) ?? "application/octet-stream",
				"content-length": body.byteLength.toString(),
			});
			response.end(request.method === "HEAD" ? undefined : body);
		} catch {
			send(response, 500, "Internal server error.");
		}
	});

	await new Promise<void>((resolvePromise, reject) => {
		server.once("error", reject);
		server.listen(
			options.port ?? 0,
			options.host ?? "127.0.0.1",
			resolvePromise,
		);
	});
	const address = server.address();
	if (!address || typeof address === "string")
		throw new Error("Could not read server port.");
	origin = `http://${options.host ?? "127.0.0.1"}:${address.port}`;

	return {
		origin,
		close: () =>
			new Promise<void>((resolvePromise, reject) =>
				server.close((error) => (error ? reject(error) : resolvePromise())),
			),
	};
}
