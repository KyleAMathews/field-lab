import { describe, expect, it } from "vitest";
import {
	adaptCodexJsonl,
	commandTrace,
	finalAgentMessage,
} from "./codex-adapter";

describe("Codex raw trajectory adapter", () => {
	it("preserves visible completed items and stable IDs", () => {
		const trajectory = adaptCodexJsonl(
			[
				JSON.stringify({ type: "thread.started", thread_id: "thread-1" }),
				JSON.stringify({
					type: "item.completed",
					item: {
						id: "item-1",
						type: "command_execution",
						command: "cat SKILL.md",
						aggregated_output: "omitted by default",
						exit_code: 0,
						status: "completed",
					},
				}),
				JSON.stringify({
					type: "item.completed",
					item: { id: "item-2", type: "agent_message", text: "Paris." },
				}),
				JSON.stringify({ type: "turn.completed", usage: {} }),
			].join("\n"),
			{ id: "live-run", userPrompt: "Capital of France?" },
		);
		expect(trajectory.complete).toBe(true);
		expect(trajectory.events.map((event) => event.id)).toEqual([
			"user-1",
			"item-1",
			"item-2",
		]);
		expect(commandTrace(trajectory)).toEqual(["cat SKILL.md"]);
		expect(finalAgentMessage(trajectory)).toBe("Paris.");
		expect(trajectory.events[1]?.metadata).not.toHaveProperty("output");
	});

	it("does not mark a truncated stream complete", () => {
		const trajectory = adaptCodexJsonl(
			JSON.stringify({
				type: "item.completed",
				item: { id: "item-1", type: "agent_message", text: "Working." },
			}),
			{ id: "truncated", userPrompt: "Run it." },
		);
		expect(trajectory.complete).toBe(false);
	});
});
