import type { AgentTrajectory, TraceActor, TraceEvent } from "./trajectory";

interface CodexAdapterOptions {
	id: string;
	userPrompt: string;
	includeCommandOutput?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function actorForItem(type: string): TraceActor {
	if (type === "tool_result") return "tool";
	return "agent";
}

function itemContent(item: Record<string, unknown>): string {
	return (
		stringValue(item.text) ??
		stringValue(item.command) ??
		stringValue(item.content) ??
		JSON.stringify(item)
	);
}

/** Adapts the public `codex exec --json` stream captured from a real run. */
export function adaptCodexJsonl(
	jsonl: string,
	options: CodexAdapterOptions,
): AgentTrajectory {
	const traceEvents: TraceEvent[] = [
		{
			id: "user-1",
			actor: "user",
			action: "message",
			content: options.userPrompt,
		},
	];
	let complete = false;
	for (const [lineIndex, line] of jsonl.split(/\r?\n/).entries()) {
		if (!line.trim()) continue;
		let record: unknown;
		try {
			record = JSON.parse(line);
		} catch (error) {
			throw new Error(`Invalid Codex JSONL at line ${lineIndex + 1}.`, {
				cause: error,
			});
		}
		if (!isRecord(record) || typeof record.type !== "string") continue;
		if (record.type === "turn.completed") {
			complete = true;
			continue;
		}
		if (record.type !== "item.completed" || !isRecord(record.item)) continue;
		const item = record.item;
		const itemType = stringValue(item.type) ?? "unknown";
		const metadata: Record<string, unknown> = {
			status: item.status,
			exitCode: item.exit_code,
		};
		if (
			options.includeCommandOutput &&
			typeof item.aggregated_output === "string"
		)
			metadata.output = item.aggregated_output;
		traceEvents.push({
			id: stringValue(item.id) ?? `item-${lineIndex + 1}`,
			actor: actorForItem(itemType),
			action: itemType,
			content: itemContent(item),
			metadata,
		});
	}
	return { id: options.id, complete, events: traceEvents };
}

export function commandTrace(trajectory: AgentTrajectory): string[] {
	return trajectory.events
		.filter((event) => event.action === "command_execution")
		.map((event) => event.content);
}

export function finalAgentMessage(
	trajectory: AgentTrajectory,
): string | undefined {
	return trajectory.events
		.filter(
			(event) => event.actor === "agent" && event.action === "agent_message",
		)
		.at(-1)?.content;
}
