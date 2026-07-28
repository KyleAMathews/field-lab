#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPublication } from "../publishing/build";
import { collectPublication } from "../publishing/collect";
import { startBrowserRuntime } from "../server/runtime";
import { type CliOptions, HELP, parseCliOptions } from "./options";

async function main() {
	let options: CliOptions;
	try {
		options = parseCliOptions(process.argv.slice(2));
	} catch (error) {
		if (error instanceof Error && error.message === "USAGE") {
			console.log(HELP);
			return;
		}
		console.error(error instanceof Error ? error.message : error);
		console.error(HELP);
		process.exitCode = 1;
		return;
	}

	if (options.command === "publish") {
		const root = process.cwd();
		const plan = await collectPublication({
			root,
			entries: options.entries,
			includeExposure: options.includeExposure,
		});
		const manifest = await buildPublication({
			plan,
			output: options.output,
			staticAppDir: fileURLToPath(
				new URL("../../dist/client", import.meta.url),
			),
			force: options.force,
		});
		console.log(
			`Published ${Object.keys(manifest.contents).length} source files to ${resolve(options.output)}`,
		);
		return;
	}

	const runtime = await startBrowserRuntime(options);
	console.log(runtime.url);

	let closing = false;
	const close = async () => {
		if (closing) return;
		closing = true;
		await runtime.close();
		process.exit();
	};
	process.once("SIGINT", close);
	process.once("SIGTERM", close);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
