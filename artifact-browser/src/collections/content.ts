import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { QueryClient } from "@tanstack/react-query";

const MAX_TEXT_BYTES = 8 * 1024 * 1024;
const MAX_STRUCTURED_BYTES = 2 * 1024 * 1024;

export interface FileContent {
	id: string;
	path: string;
	revision: string;
	mimeType: string;
	size: number;
	etag: string;
	text: string | null;
	url: string;
	tooLarge: boolean;
}

const queryClient = new QueryClient();
const contentCollections = new Map<
	string,
	ReturnType<typeof createContentCollection>
>();

function createContentCollection(
	path: string,
	revision: string,
	capability: string,
	urlOverride?: string,
) {
	const id = `${path}@${revision}`;
	return createCollection(
		queryCollectionOptions({
			id: `content:${id}`,
			queryClient,
			queryKey: ["content", id],
			getKey: (item: FileContent) => item.id,
			queryFn: async (): Promise<FileContent[]> => {
				const url =
					urlOverride ??
					`/api/content?cap=${encodeURIComponent(capability)}&path=${encodeURIComponent(path)}`;
				const response = await fetch(url);
				if (!response.ok)
					throw new Error(`Could not read ${path} (${response.status}).`);
				const mimeType =
					response.headers.get("content-type") ?? "application/octet-stream";
				const size = Number(response.headers.get("content-length") ?? "0");
				const structured =
					mimeType.includes("json") ||
					mimeType.includes("yaml") ||
					/\.(?:json|ya?ml|csv|tsv)$/i.test(path);
				const limit = structured ? MAX_STRUCTURED_BYTES : MAX_TEXT_BYTES;
				const textual =
					mimeType.startsWith("text/") ||
					mimeType.includes("json") ||
					mimeType.includes("yaml") ||
					/\.(?:md|mdx|json|ya?ml|csv|tsv|txt)$/i.test(path);
				const tooLarge = textual && size > limit;
				return [
					{
						id,
						path,
						revision,
						mimeType,
						size,
						etag: response.headers.get("etag") ?? revision,
						text: textual && !tooLarge ? await response.text() : null,
						url,
						tooLarge,
					},
				];
			},
		}),
	);
}

export function getContentCollection(
	path: string,
	revision: string,
	capability: string,
	urlOverride?: string,
) {
	const key = `${capability}:${path}@${revision}:${urlOverride ?? ""}`;
	let collection = contentCollections.get(key);
	if (!collection) {
		collection = createContentCollection(
			path,
			revision,
			capability,
			urlOverride,
		);
		contentCollections.set(key, collection);
	}
	return collection;
}

export function contentUrl(
	path: string,
	capability: string,
	download = false,
): string {
	return `/api/${download ? "download" : "content"}?cap=${encodeURIComponent(
		capability,
	)}&path=${encodeURIComponent(path)}`;
}
