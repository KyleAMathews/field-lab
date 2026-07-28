import type { Exposure } from "../protocol/types";

export type CliOptions =
	| {
			command: "browse";
			target: string;
			openBrowser: boolean;
	  }
	| {
			command: "publish";
			entries: string[];
			output: string;
			force: boolean;
			includeExposure: Exposure[];
	  };

export function parseCliOptions(
	argv: string[],
	cwd = process.cwd(),
): CliOptions {
	if (argv.includes("--help") || argv.includes("-h")) throw new Error("USAGE");

	if (argv[0] === "publish") {
		let output: string | undefined;
		let force = false;
		let includeValue = "public";
		const entries: string[] = [];
		for (let index = 1; index < argv.length; index += 1) {
			const value = argv[index];
			if (value === "--force") {
				force = true;
			} else if (value === "--out" || value === "--include-exposure") {
				const optionValue = argv[index + 1];
				if (!optionValue || optionValue.startsWith("-")) {
					throw new Error(`${value} requires a value.`);
				}
				if (value === "--out") output = optionValue;
				else includeValue = optionValue;
				index += 1;
			} else if (value?.startsWith("-")) {
				throw new Error(`Unknown option: ${value}`);
			} else if (value) {
				entries.push(value);
			}
		}
		if (!output) throw new Error("publish requires --out <directory>.");
		const includeExposure = includeValue.split(",") as Exposure[];
		if (
			includeExposure.some(
				(value) => !["public", "checkpoint", "internal"].includes(value),
			)
		) {
			throw new Error("Exposure must be public, checkpoint, or internal.");
		}
		if (entries.length === 0)
			throw new Error("publish requires at least one entry.");
		return {
			command: "publish",
			entries,
			output,
			force,
			includeExposure,
		};
	}

	const unknown = argv.filter(
		(value) => value.startsWith("-") && value !== "--no-open",
	);
	if (unknown.length > 0) throw new Error(`Unknown option: ${unknown[0]}`);
	const targets = argv.filter((value) => !value.startsWith("-"));
	if (targets.length > 1) throw new Error("Pass one file or directory.");
	return {
		command: "browse",
		target: targets[0] ?? cwd,
		openBrowser: !argv.includes("--no-open"),
	};
}

export const HELP = `Usage:
  artifact-browser [path] [--no-open]
  artifact-browser publish <entry...> --out <directory> [--force]
    [--include-exposure public,checkpoint,internal]

Browse any file or directory, or package explicit entries as a static site.`;
