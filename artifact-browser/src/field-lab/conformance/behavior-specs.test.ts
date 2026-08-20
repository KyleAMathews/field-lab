import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const behaviorRoot = resolve(process.cwd(), "../.agents/behaviors");
const expectedBehaviors = [
	"bounded-instrument-return",
	"exact-authority",
	"human-branch-control",
	"selected-route-integrity",
];

interface Frontmatter {
	name?: unknown;
	description?: unknown;
	metadata?: unknown;
}

function splitBehaviorFile(source: string): {
	frontmatter: Frontmatter;
	body: string;
} {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
	if (!match) throw new Error("BEHAVIOR.md requires YAML frontmatter.");
	return { frontmatter: parse(match[1] ?? ""), body: match[2] ?? "" };
}

describe("Agent Behavior specs", () => {
	it("uses the standard discovery layout and valid frontmatter", async () => {
		const directories = (await readdir(behaviorRoot, { withFileTypes: true }))
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort();
		expect(directories).toEqual(expect.arrayContaining(expectedBehaviors));

		for (const directory of directories) {
			const source = await readFile(
				resolve(behaviorRoot, directory, "BEHAVIOR.md"),
				"utf8",
			);
			const { frontmatter, body } = splitBehaviorFile(source);
			expect(frontmatter.name).toBe(directory);
			expect(directory).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
			expect(directory.length).toBeLessThanOrEqual(64);
			expect(typeof frontmatter.description).toBe("string");
			expect(String(frontmatter.description).length).toBeGreaterThan(0);
			expect(String(frontmatter.description).length).toBeLessThanOrEqual(1024);
			if (frontmatter.metadata !== undefined)
				expect(frontmatter.metadata).toBeTypeOf("object");
			expect(body.trim().length).toBeGreaterThan(0);
			for (const dimension of [
				"**Intent:**",
				"**Evidence:**",
				"**Decision:**",
				"**Execution:**",
				"**Recovery:**",
				"**Failure modes:**",
			])
				expect(body).toContain(dimension);
		}
	});
});
