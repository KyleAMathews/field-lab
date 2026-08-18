import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";
import type { WorkspaceSearchHit } from "../log/workspace-search";

const queryClient = new QueryClient();
const collections = new Map<
	string,
	ReturnType<typeof createSearchCollection>
>();

function createSearchCollection(query: string, capability: string) {
	return createCollection(
		queryCollectionOptions({
			id: `workspace-search:${capability}:${query}`,
			queryClient,
			queryKey: ["workspace-search", capability, query],
			getKey: (item: WorkspaceSearchHit) =>
				`${item.file}:${item.eventId ?? item.promotionId ?? item.sourceId ?? `${item.kind}:${item.title}`}`,
			queryFn: async (): Promise<WorkspaceSearchHit[]> => {
				if (!query.trim()) return [];
				const response = await fetch(
					`/api/search?cap=${encodeURIComponent(capability)}&q=${encodeURIComponent(query)}`,
				);
				if (!response.ok)
					throw new Error(`Search failed (${response.status}).`);
				return ((await response.json()) as { hits: WorkspaceSearchHit[] }).hits;
			},
		}),
	);
}

export function getSearchCollection(query: string, capability: string) {
	const key = `${capability}:${query}`;
	let collection = collections.get(key);
	if (!collection) {
		collection = createSearchCollection(query, capability);
		collections.set(key, collection);
	}
	return collection;
}
