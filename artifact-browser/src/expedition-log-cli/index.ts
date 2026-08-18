#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
	joinFieldTrip,
	promoteFieldLogEntry,
	readExpeditionItem,
	removePromotion,
	searchExpedition,
} from "../expedition-log/operations";
import {
	appendExpeditionEvents,
	expeditionLogLink,
	initializeExpeditionLog,
	inspectExpeditionLog,
	renderExpeditionLog,
	validateExpeditionLog,
} from "../expedition-log/writer";

function option(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : undefined;
}

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
	return Buffer.concat(chunks).toString("utf8");
}

async function jsonInput(args: string[]): Promise<unknown> {
	const inline = option(args, "--json");
	const file = option(args, "--file");
	const source =
		inline ?? (file ? await readFile(file, "utf8") : await readStdin());
	if (!source.trim())
		throw new Error("Supply JSON with --json, --file, or stdin.");
	return JSON.parse(source);
}

function positiveOption(args: string[], name: string): number | undefined {
	const value = option(args, name);
	if (value == null) return undefined;
	const number = Number(value);
	if (!Number.isInteger(number) || number < 1)
		throw new Error(`${name} requires a positive integer.`);
	return number;
}

async function main() {
	const [, , command, directory, ...args] = process.argv;
	if (!command || !directory)
		throw new Error(
			"Usage: expedition-log <init|append|join|promote|replace|remove|validate|render|link|inspect|search|read> <expedition-directory> [options]",
		);
	if (command === "init") {
		console.log(
			JSON.stringify(
				await initializeExpeditionLog(directory, await jsonInput(args)),
			),
		);
		return;
	}
	if (command === "append") {
		console.log(
			JSON.stringify(
				await appendExpeditionEvents(directory, await jsonInput(args)),
			),
		);
		return;
	}
	if (command === "join") {
		const tripDirectory = args[0];
		if (!tripDirectory || tripDirectory.startsWith("--"))
			throw new Error("join requires a Field Trip directory.");
		console.log(
			JSON.stringify(
				await joinFieldTrip(
					directory,
					tripDirectory,
					(await jsonInput(args.slice(1))) as Parameters<
						typeof joinFieldTrip
					>[2],
				),
			),
		);
		return;
	}
	if (command === "promote" || command === "replace") {
		const tripId = positiveOption(args, "--trip");
		const entryId = positiveOption(args, "--entry");
		const rationale = option(args, "--rationale");
		if (!tripId || !entryId || !rationale)
			throw new Error(`${command} requires --trip, --entry, and --rationale.`);
		const replacesPromotionId =
			positiveOption(args, "--replace") ??
			(command === "replace" ? positiveOption(args, "--promotion") : undefined);
		if (command === "replace" && !replacesPromotionId)
			throw new Error("replace requires --promotion.");
		console.log(
			JSON.stringify(
				await promoteFieldLogEntry(directory, {
					tripId,
					entryId,
					runId: positiveOption(args, "--readout"),
					rationale,
					replacesPromotionId,
				}),
			),
		);
		return;
	}
	if (command === "remove") {
		const promotionId = positiveOption(args, "--promotion");
		if (!promotionId) throw new Error("remove requires --promotion.");
		console.log(JSON.stringify(await removePromotion(directory, promotionId)));
		return;
	}
	if (command === "validate") {
		const events = await validateExpeditionLog(directory);
		console.log(JSON.stringify({ valid: true, events: events.length }));
		return;
	}
	if (command === "render") {
		await renderExpeditionLog(directory);
		console.log(JSON.stringify({ rendered: true }));
		return;
	}
	if (command === "link") {
		console.log(expeditionLogLink(positiveOption(args, "--promotion")));
		return;
	}
	if (command === "inspect" || command === "manifest") {
		console.log(JSON.stringify(await inspectExpeditionLog(directory)));
		return;
	}
	if (command === "search") {
		const query =
			option(args, "--query") ??
			args.filter((arg) => !arg.startsWith("--")).join(" ");
		console.log(JSON.stringify(await searchExpedition(directory, query)));
		return;
	}
	if (command === "read") {
		const tripId = positiveOption(args, "--trip");
		if (!tripId) throw new Error("read requires --trip.");
		console.log(
			JSON.stringify(
				await readExpeditionItem(directory, {
					tripId,
					entryId: positiveOption(args, "--entry"),
					runId:
						positiveOption(args, "--readout") ?? positiveOption(args, "--run"),
					sourceId: positiveOption(args, "--source"),
				}),
			),
		);
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
