#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { startOrReuseTripReader } from "../field-lab/reader-session";
import { startTripInExpedition, TripStartError } from "../field-lab/trip-start";

function option(args: string[], ...names: string[]): string | undefined {
	for (const name of names) {
		const index = args.indexOf(name);
		if (index >= 0) return args[index + 1];
	}
	return undefined;
}

async function readStdin(): Promise<string> {
	const chunks: Buffer[] = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
	return Buffer.concat(chunks).toString("utf8");
}

async function jsonInput(args: string[]): Promise<unknown> {
	const inline = option(args, "--json");
	const file = option(args, "--input", "--context", "--file");
	const source =
		inline ?? (file ? await readFile(file, "utf8") : await readStdin());
	if (!source.trim())
		throw new Error("Supply start JSON with --input, --json, or stdin.");
	return JSON.parse(source);
}

const HELP = `Usage:
  field-lab trip start --expedition <directory> --slug <slug>
    --input <start.json> [--reader | --open]

--reader starts or reuses a persistent reader and returns its URL.
--open also opens that URL in the system browser.
--context and --file are aliases for --input.`;

async function main() {
	const args = process.argv.slice(2);
	if (args.includes("--help") || args.includes("-h")) {
		console.log(HELP);
		return;
	}
	if (args[0] !== "trip" || args[1] !== "start") throw new Error(HELP);
	const expedition = option(args, "--expedition");
	const slug = option(args, "--slug");
	if (!expedition || !slug)
		throw new Error("trip start requires --expedition and --slug.");
	const started = await startTripInExpedition(
		expedition,
		slug,
		await jsonInput(args),
	);
	const wantsReader = args.includes("--reader") || args.includes("--open");
	const reader = wantsReader
		? await startOrReuseTripReader({
				expeditionDirectory: started.receipt.expeditionDirectory,
				tripDirectory: started.receipt.tripDirectory,
				openBrowser: args.includes("--open"),
			})
		: undefined;
	console.log(
		JSON.stringify({
			ok: true,
			operationId: started.receipt.operationId,
			tripId: started.receipt.tripId,
			tripDirectory: started.receipt.tripDirectory,
			fieldLogPath: started.receipt.fieldLogPath,
			expeditionLogPath: started.receipt.expeditionLogPath,
			recoveryReceipt: started.recoveryReceipt,
			warnings: [
				...started.receipt.warnings,
				...(reader?.warning ? [reader.warning] : []),
			],
			reader,
		}),
	);
}

main().catch((error) => {
	console.error(
		JSON.stringify({
			ok: false,
			error: error instanceof Error ? error.message : String(error),
			...(error instanceof TripStartError
				? {
						recoveryReceipt: error.recoveryReceipt,
						operationId: error.operationId,
						stage: error.stage,
					}
				: {}),
		}),
	);
	process.exitCode = 1;
});
