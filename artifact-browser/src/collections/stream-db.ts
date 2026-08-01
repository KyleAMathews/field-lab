import { createStreamDB, type StreamDB } from "@durable-streams/state/db";
import { artifactStateSchema } from "../protocol/schema";
import type { BootConfig } from "../protocol/types";

export type ArtifactStreamDB = StreamDB<typeof artifactStateSchema>;
export type ArtifactCollections = ArtifactStreamDB["collections"];
export interface ArtifactDatabase {
	collections: ArtifactCollections;
}

export interface BrowserData {
	boot: BootConfig;
	db: ArtifactDatabase;
	staticContents?: Record<string, string>;
	close(): void;
}

const sessions = new Map<string, Promise<BrowserData>>();

export function loadBrowserData(capability: string): Promise<BrowserData> {
	const existing = sessions.get(capability);
	if (existing) return existing;

	const loading = (async () => {
		const response = await fetch(
			`/api/boot?cap=${encodeURIComponent(capability)}`,
			{
				cache: "no-store",
			},
		);
		if (!response.ok)
			throw new Error(`Could not open workspace (${response.status}).`);
		const boot = (await response.json()) as BootConfig;
		const db = createStreamDB({
			state: artifactStateSchema,
			streamOptions: {
				contentType: "application/json",
				url: boot.streamUrl,
			},
		});
		await db.preload();
		return {
			boot,
			db,
			close() {
				db.close();
				sessions.delete(capability);
			},
		};
	})();
	sessions.set(capability, loading);
	loading.catch(() => sessions.delete(capability));
	return loading;
}
