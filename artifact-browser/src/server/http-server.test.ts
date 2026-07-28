import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { startHttpServer } from "./http-server";

describe("artifact HTTP server", () => {
	it("protects boot and serves confined ranged content", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-http-"));
		const staticDir = join(root, "app");
		await mkdir(staticDir);
		await writeFile(join(staticDir, "index.html"), "<h1>Browser</h1>");
		await writeFile(join(root, "hello.txt"), "hello world");
		const capability = "secret";
		const server = await startHttpServer({
			root,
			staticDir,
			capability,
			boot: {
				workspaceName: "fixture",
				streamUrl: "http://127.0.0.1:41234/v1/stream/random",
				capability,
				initialPath: null,
			},
		});

		try {
			expect(new URL(server.origin).port).not.toBe("0");
			expect((await fetch(server.origin)).status).toBe(200);
			expect((await fetch(`${server.origin}/api/boot`)).status).toBe(401);
			const boot = await fetch(`${server.origin}/api/boot?cap=${capability}`);
			expect(boot.status).toBe(200);
			expect(await boot.text()).not.toContain(root);
			expect(
				(
					await fetch(`${server.origin}/api/boot?cap=${capability}`, {
						headers: { origin: "https://example.com" },
					})
				).status,
			).toBe(403);

			const contentUrl = `${server.origin}/api/content?cap=${capability}&path=hello.txt`;
			const head = await fetch(contentUrl, { method: "HEAD" });
			expect(head.status).toBe(200);
			expect(await head.text()).toBe("");
			const etag = head.headers.get("etag") ?? "";
			expect(
				(await fetch(contentUrl, { headers: { "if-none-match": etag } }))
					.status,
			).toBe(304);
			const range = await fetch(contentUrl, {
				headers: { range: "bytes=0-4" },
			});
			expect(range.status).toBe(206);
			expect(await range.text()).toBe("hello");
			expect(
				(
					await fetch(
						`${server.origin}/api/content?cap=${capability}&path=..%2Foutside.txt`,
					)
				).status,
			).toBe(400);
		} finally {
			await server.close();
		}
	});
});
