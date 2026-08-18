import { readdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { searchExpedition } from "../expedition-log/operations";
import { type FieldLogSearchHit, searchFieldLog } from "../field-log/reader";

export interface WorkspaceSearchHit extends FieldLogSearchHit {
	file: string;
	tripId?: number;
	promotionId?: number;
}

async function findNamedFiles(root: string, name: string): Promise<string[]> {
	const found: string[] = [];
	async function visit(directory: string) {
		const entries = await readdir(directory, { withFileTypes: true }).catch(
			() => [],
		);
		for (const entry of entries) {
			if (
				entry.name === "node_modules" ||
				entry.name === ".git" ||
				entry.name.startsWith(".field_log") ||
				entry.name.startsWith(".expedition_log")
			)
				continue;
			const path = resolve(directory, entry.name);
			if (entry.isDirectory()) await visit(path);
			else if (entry.isFile() && entry.name === name) found.push(path);
		}
	}
	await visit(root);
	return found;
}

export async function findFieldLogDirectories(root: string): Promise<string[]> {
	return (await findNamedFiles(root, "field_log.jsonl")).map(dirname);
}

export async function searchWorkspace(
	root: string,
	query: string,
): Promise<{ query: string; hits: WorkspaceSearchHit[] }> {
	const canonicalRoot = resolve(root);
	const expeditionStreams = await findNamedFiles(
		canonicalRoot,
		"expedition_log.jsonl",
	);
	if (
		expeditionStreams.length === 1 &&
		dirname(expeditionStreams[0] ?? "") === canonicalRoot
	) {
		const result = await searchExpedition(canonicalRoot, query);
		const promotions: WorkspaceSearchHit[] = result.promotions.map((hit) => ({
			trip: canonicalRoot,
			tripTitle: "Expedition",
			kind: "entry",
			promotionId: hit.promotionId,
			tripId: hit.tripId,
			entryId: hit.entryId,
			runId: hit.runId,
			title: hit.title ?? `Promotion ${hit.promotionId}`,
			snippet: hit.snippet ?? "",
			file: `${hit.tripPath}/field_log.md`,
		}));
		const memberHits = result.hits.map((hit) => ({
			...hit,
			file: `${relative(canonicalRoot, hit.trip)}/field_log.md`,
		}));
		return { query, hits: [...promotions, ...memberHits] };
	}
	const streams = await findNamedFiles(canonicalRoot, "field_log.jsonl");
	const hits = (
		await Promise.all(
			streams.map(async (stream) => {
				const trip = dirname(stream);
				return (await searchFieldLog(trip, query)).map((hit) => ({
					...hit,
					file: `${relative(canonicalRoot, trip) || "."}/field_log.md`.replace(
						/^\.\//,
						"",
					),
				}));
			}),
		)
	).flat();
	return { query, hits };
}
