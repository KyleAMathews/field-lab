import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@durable-streams/client", () => ({
	IdempotentProducer: class {
		append() {}
		flush() {
			return Promise.reject(new Error("initial flush failed"));
		}
		detach() {
			return Promise.resolve();
		}
	},
}));

import { startMetadataWatcher } from "./watcher";

describe("metadata watcher failures", () => {
	const roots: string[] = [];
	afterEach(async () => {
		for (const root of roots.splice(0))
			await rm(root, { recursive: true, force: true });
	});

	it("rejects ready when the initial producer flush fails", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-watch-failure-"));
		roots.push(root);
		await writeFile(join(root, "README.md"), "# Initial");
		const watcher = startMetadataWatcher({
			root,
			stream: {} as never,
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
		await expect(watcher.ready).rejects.toThrow("initial flush failed");
		await watcher.close();
	}, 2_000);
});
