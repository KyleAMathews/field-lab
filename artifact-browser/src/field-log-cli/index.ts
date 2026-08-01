#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
	appendFieldLogEvents,
	fieldLogLink,
	initializeFieldLog,
	renderFieldLog,
	validateFieldLog,
} from "../field-log/writer";

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
	return Buffer.concat(chunks).toString("utf8");
}

function option(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : undefined;
}

async function input(args: string[]): Promise<unknown> {
	const inline = option(args, "--json");
	const file = option(args, "--file");
	const source =
		inline ?? (file ? await readFile(file, "utf8") : await readStdin());
	if (!source.trim())
		throw new Error("Supply event JSON with --json, --file, or stdin.");
	return JSON.parse(source);
}

async function main() {
	const [, , command, directory, ...args] = process.argv;
	if (!command || !directory) {
		throw new Error(
			"Usage: field-log <init|append|validate|render|link> <trip-directory> [options]",
		);
	}
	if (command === "init") {
		console.log(
			JSON.stringify(await initializeFieldLog(directory, await input(args))),
		);
		return;
	}
	if (command === "append") {
		console.log(
			JSON.stringify(await appendFieldLogEvents(directory, await input(args))),
		);
		return;
	}
	if (command === "validate") {
		const events = await validateFieldLog(directory);
		console.log(JSON.stringify({ valid: true, events: events.length }));
		return;
	}
	if (command === "render") {
		await renderFieldLog(directory);
		console.log(JSON.stringify({ rendered: true }));
		return;
	}
	if (command === "link") {
		const entry = Number(option(args, "--entry"));
		const runValue = option(args, "--readout");
		console.log(fieldLogLink(entry, runValue ? Number(runValue) : undefined));
		return;
	}
	throw new Error(`Unknown command: ${command}.`);
}

main().catch((error) => {
	console.error(
		JSON.stringify({
			ok: false,
			error: error instanceof Error ? error.message : String(error),
		}),
	);
	process.exitCode = 1;
});
