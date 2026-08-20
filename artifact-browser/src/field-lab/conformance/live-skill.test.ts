import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	adaptCodexJsonl,
	commandTrace,
	finalAgentMessage,
} from "./codex-adapter";

const liveEnabled = process.env.FIELD_LAB_LIVE === "1";
const selectedCase = process.env.FIELD_LAB_LIVE_CASE;
const skillRoot = resolve(process.cwd(), "..");

interface LiveCase {
	id: string;
	request: string;
	assertTrace: (commands: string[], finalMessage: string) => void;
}

const liveCases: LiveCase[] = [
	{
		id: "direct-fact",
		request: "What is the capital of France?",
		assertTrace(commands, finalMessage) {
			expect(commands.some((command) => command.includes("SKILL.md"))).toBe(
				true,
			);
			expect(
				commands.some((command) => command.includes("reference/instruments/")),
			).toBe(false);
			expect(finalMessage).toMatch(/\bParis\b/);
		},
	},
	{
		id: "open-explanation",
		request:
			"Help me understand this claim: Remote work makes teams less creative because casual hallway conversations disappear.",
		assertTrace(commands, finalMessage) {
			expect(commands.some((command) => command.includes("SKILL.md"))).toBe(
				true,
			);
			expect(
				commands.some((command) => command.includes("reference/instruments/")),
			).toBe(false);
			expect(finalMessage).toMatch(/Term scan/i);
			expect(finalMessage).toMatch(/want me to run|want to try|shall I run/i);
		},
	},
	{
		id: "selected-term-scan",
		request:
			"Use a Term scan on this statement: The proposal is fair because everyone gets the same budget, though teams with more customers must absorb more support work.",
		assertTrace(commands, finalMessage) {
			expect(commands.some((command) => command.includes("SKILL.md"))).toBe(
				true,
			);
			expect(commands.some((command) => command.includes("term-scan.md"))).toBe(
				true,
			);
			expect(finalMessage).toMatch(/Quick term scan:/i);
			expect(finalMessage).toMatch(/control|replace|remove/i);
			expect(finalMessage).toMatch(
				/\b(?:may|can|could)\b.{0,40}\b(?:add|select|flatten|hide|induce)|introduce[ds]?|risk|distort|artifact/is,
			);
		},
	},
	{
		id: "selected-queue",
		request:
			"Run a Term scan and then a Fracture scan, in that order, on this claim: A transparent hiring process is fair because every applicant sees the same rubric, so the best candidate will always win.",
		assertTrace(commands, finalMessage) {
			const termIndex = commands.findIndex((command) =>
				command.includes("term-scan.md"),
			);
			const fractureIndex = commands.findIndex((command) =>
				command.includes("fracture-scan.md"),
			);
			expect(termIndex).toBeGreaterThanOrEqual(0);
			expect(fractureIndex).toBeGreaterThan(termIndex);
			expect(finalMessage).toMatch(/Quick term scan:/i);
			expect(finalMessage).toMatch(/Fracture scan:/i);
		},
	},
];

function runCodex(request: string): Promise<string> {
	const prompt = `Use the Field Lab skill in ./SKILL.md to respond to this user request. Read the full skill and every selected instrument card. Do not inspect .agents/behaviors or conformance tests. Do not edit files. User request: ${request}`;
	return new Promise((resolvePromise, reject) => {
		const child = spawn(
			"codex",
			[
				"exec",
				"--ephemeral",
				"--json",
				"--sandbox",
				"read-only",
				"-C",
				skillRoot,
				prompt,
			],
			{ cwd: skillRoot, stdio: ["ignore", "pipe", "pipe"] },
		);
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (chunk) => {
			stdout += String(chunk);
		});
		child.stderr.on("data", (chunk) => {
			stderr += String(chunk);
		});
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) resolvePromise(stdout);
			else
				reject(new Error(`codex exec exited ${code}: ${stderr.slice(-2_000)}`));
		});
	});
}

describe.skipIf(!liveEnabled).sequential("live Field Lab skill", () => {
	for (const testCase of liveCases) {
		it.skipIf(Boolean(selectedCase && selectedCase !== testCase.id))(
			testCase.id,
			async () => {
				const jsonl = await runCodex(testCase.request);
				const trajectory = adaptCodexJsonl(jsonl, {
					id: testCase.id,
					userPrompt: testCase.request,
				});
				expect(trajectory.complete).toBe(true);
				const finalMessage = finalAgentMessage(trajectory);
				expect(finalMessage).toBeTruthy();
				testCase.assertTrace(commandTrace(trajectory), finalMessage ?? "");
			},
			300_000,
		);
	}
});
