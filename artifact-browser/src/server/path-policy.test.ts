import { mkdir, mkdtemp, realpath, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	resolveContentPath,
	resolveExternalFilePath,
	resolveRootTarget,
} from "./path-policy";

describe("path policy", () => {
	it("resolves directory and file targets", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-path-"));
		await writeFile(join(root, "note.md"), "hello");
		const canonicalRoot = await realpath(root);
		expect(await resolveRootTarget(root)).toEqual({
			root: canonicalRoot,
			initialPath: null,
		});
		expect(await resolveRootTarget(join(root, "note.md"))).toEqual({
			root: canonicalRoot,
			initialPath: "note.md",
		});
	});

	it("confines relative content while allowing explicit absolute files", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-path-"));
		const root = join(parent, "root");
		await mkdir(root);
		await writeFile(join(root, "safe.txt"), "safe");
		await writeFile(join(parent, "secret.txt"), "secret");
		await symlink(join(root, "safe.txt"), join(root, "safe-link"));
		await symlink(join(parent, "secret.txt"), join(root, "escape-link"));

		const safeFile = await realpath(join(root, "safe.txt"));
		expect(await resolveContentPath(root, "safe.txt")).toBe(safeFile);
		expect(await resolveContentPath(root, "safe-link")).toBe(safeFile);
		await expect(resolveContentPath(root, "../secret.txt")).rejects.toThrow();
		expect(await resolveContentPath(root, join(parent, "secret.txt"))).toBe(
			await realpath(join(parent, "secret.txt")),
		);
		await expect(resolveContentPath(root, "bad\0path")).rejects.toThrow();
		await expect(resolveContentPath(root, "escape-link")).rejects.toThrow();
	});

	it("resolves external source files from absolute and launch-relative paths", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-external-"));
		const root = join(parent, "workspace");
		const launch = join(parent, "project", "app");
		await mkdir(root);
		await mkdir(launch, { recursive: true });
		await writeFile(join(parent, "project", "source.md"), "source");
		const source = await realpath(join(parent, "project", "source.md"));

		expect(await resolveExternalFilePath(root, launch, source)).toBe(source);
		expect(await resolveExternalFilePath(root, launch, "source.md")).toBe(
			source,
		);
	});
});
