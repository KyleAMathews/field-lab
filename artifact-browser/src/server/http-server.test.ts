import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appendFieldLogEvents, initializeFieldLog } from "../field-log/writer";
import { startHttpServer } from "./http-server";

describe("artifact HTTP server", () => {
	it("protects boot and serves ranged workspace and external content", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-http-"));
		const external = await mkdtemp(join(tmpdir(), "artifact-external-http-"));
		const staticDir = join(root, "app");
		await mkdir(staticDir);
		await writeFile(join(staticDir, "index.html"), "<h1>Browser</h1>");
		await writeFile(join(root, "hello.txt"), "hello world");
		await writeFile(join(root, "empty.txt"), "");
		const externalPath = join(external, "source.md");
		const arbitraryPath = join(external, "secret.txt");
		await writeFile(externalPath, "# External source");
		await writeFile(arbitraryPath, "secret");
		await initializeFieldLog(root, {
			type: "trip.created",
			actor: { kind: "orchestrator" },
			authorization: {
				kind: "artifact-consent",
				pointer: "turn-1",
				verbatim: "Start a Field Log.",
			},
			payload: { title: "A trip", openingQuestion: "Why?" },
		});
		await appendFieldLogEvents(root, {
			type: "source.collected",
			actor: { kind: "orchestrator" },
			payload: { title: "External source", path: externalPath },
		});
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
			expect(
				(await fetch(`${server.origin}/api/content?cap=wrong&path=hello.txt`))
					.status,
			).toBe(401);
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
			const suffixRange = await fetch(contentUrl, {
				headers: { range: "bytes=-5" },
			});
			expect(suffixRange.status).toBe(206);
			expect(await suffixRange.text()).toBe("world");
			const openRange = await fetch(contentUrl, {
				headers: { range: "bytes=0-" },
			});
			expect(openRange.status).toBe(206);
			expect(await openRange.text()).toBe("hello world");
			expect(
				(
					await fetch(
						`${server.origin}/api/content?cap=${capability}&path=empty.txt`,
					)
				).status,
			).toBe(200);
			expect(
				(
					await fetch(
						`${server.origin}/api/content?cap=${capability}&path=..%2Foutside.txt`,
					)
				).status,
			).toBe(400);
			expect(
				(
					await fetch(
						`${server.origin}/api/metadata?cap=${capability}&path=${encodeURIComponent(arbitraryPath)}`,
					)
				).status,
			).toBe(404);
			const metadata = await fetch(
				`${server.origin}/api/metadata?cap=${capability}&path=${encodeURIComponent(externalPath)}`,
			);
			expect(metadata.status).toBe(404);
			const copiedPath = "sources/1-source.md";
			const copiedMetadata = await fetch(
				`${server.origin}/api/metadata?cap=${capability}&path=${encodeURIComponent(copiedPath)}`,
			);
			expect(copiedMetadata.status).toBe(200);
			const copiedFile = await copiedMetadata.json();
			expect(copiedFile).toMatchObject({
				path: copiedPath,
				name: "1-source.md",
				rendererId: "markdown",
			});
			expect(
				await (
					await fetch(
						`${server.origin}/api/content?cap=${capability}&path=${encodeURIComponent(copiedPath)}`,
					)
				).text(),
			).toBe("# External source");
			expect(
				(
					await fetch(
						`${server.origin}/api/content?cap=${capability}&path=${encodeURIComponent(arbitraryPath)}`,
					)
				).status,
			).toBe(400);
		} finally {
			await server.close();
		}
	});
});
