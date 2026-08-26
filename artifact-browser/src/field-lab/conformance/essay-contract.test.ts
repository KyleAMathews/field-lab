import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const skillRoot = resolve(process.cwd(), "..");
const instrumentMapPath = resolve(
	skillRoot,
	"reference/essay-instrument-map.md",
);
const workflowPath = resolve(skillRoot, "reference/essay-workflow.md");
const stagePaths = [
	"reference/essay-stage-1-frame.md",
	"reference/essay-stage-2-survey.md",
	"reference/essay-stage-3-map.md",
	"reference/essay-stage-4-validate.md",
	"reference/essay-stage-5-design.md",
	"reference/essay-stage-6-draft.md",
];

const conditionalBranches: Record<number, Record<string, string>> = {
	2: {
		"loss-audit": "run-loss-audit",
		"residue-collect": "run-residue-collect",
	},
	4: {
		"negative-transfer": "run-negative-transfer",
		"research-survey": "expand-validation-research",
	},
	5: {
		"outcome-ablation": "run-outcome-ablation",
		"framing-sensitivity": "run-framing-sensitivity",
	},
	6: {
		"blind-cartography": "run-draft-cartography",
		"outcome-ablation": "run-outcome-ablation",
		"framing-sensitivity": "run-framing-sensitivity",
	},
};

function parseStageList(source: string, key: string): string[] {
	const match = new RegExp(`^  ${key}: \\[([^\\]]*)\\]$`, "m").exec(source);
	if (!match?.[1]) return [];
	return match[1]
		.split(",")
		.map((entry) => /^([a-z0-9-]+)/.exec(entry.trim())?.[1])
		.filter((id): id is string => Boolean(id));
}

function parseStageBranches(source: string): string[] {
	const match = /^branches: \[([^\]]*)\]$/m.exec(source);
	if (!match?.[1]) throw new Error("Essay stage is missing its branches list.");
	return match[1].split(",").map((branch) => branch.trim());
}

function parseMapSchedule(
	mapSource: string,
	stageNumber: number,
): { required: string[]; conditional: string[] } {
	const row = mapSource
		.split("\n")
		.find((line) => line.startsWith(`| ${stageNumber}. `));
	if (!row) throw new Error(`Instrument map is missing Stage ${stageNumber}.`);
	const cells = row
		.split("|")
		.slice(1, -1)
		.map((cell) => cell.trim());
	const ids = (cell: string | undefined) =>
		[...(cell ?? "").matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]);
	return { required: ids(cells[1]), conditional: ids(cells[2]) };
}

describe("Essay workflow contract", () => {
	it("keeps every stage schedule aligned with the central instrument map", async () => {
		const [mapSource, ...stageSources] = await Promise.all([
			readFile(instrumentMapPath, "utf8"),
			...stagePaths.map((path) => readFile(resolve(skillRoot, path), "utf8")),
		]);

		for (const [index, stageSource] of stageSources.entries()) {
			const stageNumber = index + 1;
			const mapSchedule = parseMapSchedule(mapSource, stageNumber);
			expect(new Set(parseStageList(stageSource, "required"))).toEqual(
				new Set(mapSchedule.required),
			);
			expect(new Set(parseStageList(stageSource, "conditional"))).toEqual(
				new Set(mapSchedule.conditional),
			);
		}
	});

	it("resolves every scheduled instrument to a canonical card", async () => {
		const sources = await Promise.all(
			stagePaths.map((path) => readFile(resolve(skillRoot, path), "utf8")),
		);
		const instrumentIds = new Set(
			sources.flatMap((source) => [
				...parseStageList(source, "required"),
				...parseStageList(source, "conditional"),
			]),
		);
		const missing: string[] = [];
		for (const instrumentId of instrumentIds) {
			try {
				await access(
					resolve(skillRoot, `reference/instruments/${instrumentId}.md`),
				);
			} catch {
				missing.push(instrumentId);
			}
		}
		expect(missing.sort()).toEqual([]);
	});

	it("declares every conditional instrument branch in its stage and workflow", async () => {
		const [workflowSource, ...stageSources] = await Promise.all([
			readFile(workflowPath, "utf8"),
			...stagePaths.map((path) => readFile(resolve(skillRoot, path), "utf8")),
		]);

		for (const [stageIndex, branchMap] of Object.entries(conditionalBranches)) {
			const stageNumber = Number(stageIndex);
			const stageSource = stageSources[stageNumber - 1];
			if (!stageSource) throw new Error(`Missing Stage ${stageNumber} source.`);
			const scheduled = parseStageList(stageSource, "conditional");
			const stageBranches = parseStageBranches(stageSource);
			expect(new Set(Object.keys(branchMap))).toEqual(new Set(scheduled));
			for (const branchId of Object.values(branchMap)) {
				expect(stageBranches).toContain(branchId);
				expect(workflowSource).toContain(`\`${branchId}\``);
			}
		}

		const stageTwoBranches = parseStageBranches(stageSources[1] ?? "");
		expect(stageTwoBranches).toContain("select-candidate-bodies");
		expect(workflowSource).toContain("`select-candidate-bodies`");
	});
});
