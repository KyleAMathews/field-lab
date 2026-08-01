import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";
import { fileRecordSchema } from "../protocol/schema";

const queryClient = new QueryClient();
const collections = new Map<
	string,
	ReturnType<typeof createExternalFileCollection>
>();

function createExternalFileCollection(path: string, capability: string) {
	return createCollection(
		queryCollectionOptions({
			id: `external-file:${path}`,
			queryClient,
			queryKey: ["external-file", capability, path],
			getKey: (item) => item.id,
			queryFn: async () => {
				const response = await fetch(
					`/api/metadata?cap=${encodeURIComponent(capability)}&path=${encodeURIComponent(path)}`,
				);
				if (!response.ok)
					throw new Error(`Could not open ${path} (${response.status}).`);
				return [fileRecordSchema.parse(await response.json())];
			},
		}),
	);
}

export function getExternalFileCollection(path: string, capability: string) {
	const key = `${capability}:${path}`;
	let collection = collections.get(key);
	if (!collection) {
		collection = createExternalFileCollection(path, capability);
		collections.set(key, collection);
	}
	return collection;
}
