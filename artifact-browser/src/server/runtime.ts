import { randomUUID } from "node:crypto";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DurableStream } from "@durable-streams/client";
import { DurableStreamTestServer } from "@durable-streams/server";
import open from "open";
import type { BootConfig, WorkspaceRecord } from "../protocol/types";
import { startHttpServer } from "./http-server";
import { resolveRootTarget } from "./path-policy";
import { startMetadataWatcher } from "./watcher";

export interface BrowserRuntime {
	url: string;
	close(): Promise<void>;
}

export async function startBrowserRuntime(options: {
	target: string;
	openBrowser: boolean;
	staticDir?: string;
}): Promise<BrowserRuntime> {
	const target = await resolveRootTarget(options.target);
	const runId = randomUUID();
	const capability = randomUUID();
	const streams = new DurableStreamTestServer({ host: "127.0.0.1", port: 0 });
	await streams.start();
	const streamUrl = `${streams.url}/v1/stream/artifacts-${runId}`;
	const stream = await DurableStream.create({
		url: streamUrl,
		contentType: "application/json",
	});
	const workspace: WorkspaceRecord = {
		id: "workspace",
		displayName: basename(target.root),
		runId,
		status: "starting",
		startedAt: Date.now(),
		fileCount: 0,
		artifactCount: 0,
	};
	const boot: BootConfig = {
		workspaceName: workspace.displayName,
		streamUrl,
		capability,
		initialPath: target.initialPath,
	};
	const defaultStaticDir = resolve(
		fileURLToPath(new URL("../../dist/client", import.meta.url)),
	);
	const http = await startHttpServer({
		root: target.root,
		capability,
		boot,
		staticDir: options.staticDir ?? defaultStaticDir,
		launchDirectory: process.cwd(),
	});
	const watcher = startMetadataWatcher({
		root: target.root,
		stream,
		workspace,
	});

	try {
		await watcher.ready;
	} catch (error) {
		await http.close();
		await streams.stop();
		throw error;
	}

	const search = new URLSearchParams({ cap: capability });
	if (target.initialPath) search.set("file", target.initialPath);
	const url = `${http.origin}/?${search}`;
	if (options.openBrowser) await open(url);

	let closed = false;
	return {
		url,
		async close() {
			if (closed) return;
			closed = true;
			await watcher.close();
			await http.close();
			await streams.stop();
		},
	};
}
