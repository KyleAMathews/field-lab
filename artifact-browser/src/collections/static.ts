import { createCollection, localOnlyCollectionOptions } from "@tanstack/db";
import {
	artifactRecordSchema,
	diagnosticRecordSchema,
	fileRecordSchema,
	workspaceRecordSchema,
} from "../protocol/schema";
import { validatePublishedManifest } from "../publishing/manifest";
import type { BrowserData } from "./stream-db";

export async function loadStaticBrowserData(
	manifestUrl = "./publication.json",
): Promise<BrowserData> {
	const response = await fetch(manifestUrl, { cache: "no-store" });
	if (!response.ok)
		throw new Error("This page is not a live or published artifact browser.");
	const manifest = validatePublishedManifest(await response.json());
	const workspace = createCollection(
		localOnlyCollectionOptions({
			id: `published-workspace:${manifest.generatedAt}`,
			schema: workspaceRecordSchema,
			getKey: (item) => item.id,
			initialData: [
				{
					id: "workspace",
					displayName: manifest.workspaceName,
					runId: `published-${manifest.generatedAt}`,
					status: "ready",
					startedAt: manifest.generatedAt,
					fileCount: manifest.files.length,
					artifactCount: manifest.artifacts.length,
				},
			],
		}),
	);
	const files = createCollection(
		localOnlyCollectionOptions({
			id: `published-files:${manifest.generatedAt}`,
			schema: fileRecordSchema,
			getKey: (item) => item.id,
			initialData: manifest.files,
		}),
	);
	const artifacts = createCollection(
		localOnlyCollectionOptions({
			id: `published-artifacts:${manifest.generatedAt}`,
			schema: artifactRecordSchema,
			getKey: (item) => item.id,
			initialData: manifest.artifacts,
		}),
	);
	const diagnostics = createCollection(
		localOnlyCollectionOptions({
			id: `published-diagnostics:${manifest.generatedAt}`,
			schema: diagnosticRecordSchema,
			getKey: (item) => item.id,
			initialData: manifest.diagnostics,
		}),
	);
	return {
		boot: {
			workspaceName: manifest.workspaceName,
			streamUrl: "",
			capability: "",
			initialPath: manifest.entries[0] ?? null,
		},
		db: { collections: { workspace, files, artifacts, diagnostics } },
		staticContents: manifest.contents,
		close() {},
	};
}
