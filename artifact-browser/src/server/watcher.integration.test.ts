import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DurableStream } from "@durable-streams/client";
import { DurableStreamTestServer } from "@durable-streams/server";
import { createStreamDB } from "@durable-streams/state/db";
import { afterEach, describe, expect, it } from "vitest";
import { artifactStateSchema } from "../protocol/schema";
import { startMetadataWatcher } from "./watcher";

describe("metadata watcher", () => {
	const cleanups: Array<() => Promise<void>> = [];
	afterEach(async () => {
		for (const cleanup of cleanups.splice(0)) await cleanup();
	});

	it("publishes its initial walk before ready and streams later changes", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-watch-"));
		await writeFile(join(root, "README.md"), "# Initial");
		const server = new DurableStreamTestServer({ host: "127.0.0.1", port: 0 });
		await server.start();
		const streamUrl = `${server.url}/v1/stream/watcher`;
		const stream = await DurableStream.create({
			url: streamUrl,
			contentType: "application/json",
		});
		const watcher = startMetadataWatcher({
			root,
			stream,
			workspace: {
				id: "workspace",
				displayName: "fixture",
				runId: "test",
				status: "starting",
				startedAt: Date.now(),
				fileCount: 0,
				artifactCount: 0,
			},
		});
		cleanups.push(async () => {
			await watcher.close();
			await server.stop();
			await rm(root, { recursive: true, force: true });
		});

		await watcher.ready;
		const db = createStreamDB({
			state: artifactStateSchema,
			streamOptions: { url: streamUrl, contentType: "application/json" },
		});
		await db.preload();
		cleanups.unshift(async () => db.close());

		expect(db.collections.files.get("README.md")?.name).toBe("README.md");
		expect(db.collections.workspace.get("workspace")?.status).toBe("ready");

		await writeFile(join(root, "notes.txt"), "new");
		await expect
			.poll(() => db.collections.files.get("notes.txt")?.name, {
				timeout: 4_000,
			})
			.toBe("notes.txt");

		await rm(join(root, "notes.txt"));
		await expect
			.poll(() => db.collections.files.get("notes.txt"), { timeout: 4_000 })
			.toBeUndefined();
	});
});
