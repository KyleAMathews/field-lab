import { randomUUID } from "node:crypto";
import { relative, sep } from "node:path";
import {
	type DurableStream,
	IdempotentProducer,
} from "@durable-streams/client";
import chokidar from "chokidar";
import { artifactStateSchema } from "../protocol/schema";
import type { WorkspaceRecord } from "../protocol/types";
import { readFileMetadata } from "./metadata";

export interface MetadataWatcher {
	ready: Promise<void>;
	close(): Promise<void>;
}

const DEFAULT_IGNORES = [
	"**/.git/**",
	"**/.worktrees/**",
	"**/node_modules/**",
	"**/.DS_Store",
	"**/.field-lab-trip-start.json",
	"**/dist/**",
	"**/.output/**",
];

export function startMetadataWatcher(options: {
	root: string;
	stream: DurableStream;
	workspace: WorkspaceRecord;
	ignores?: string[];
}): MetadataWatcher {
	let revision = 0;
	let closed = false;
	let queue = Promise.resolve();
	const files = new Set<string>();
	const artifacts = new Set<string>();
	const diagnostics = new Set<string>();
	let producerError: Error | null = null;
	const producer = new IdempotentProducer(
		options.stream,
		`artifact-browser-${randomUUID()}`,
		{
			autoClaim: true,
			onError(error) {
				producerError = error;
			},
		},
	);

	const append = (event: unknown) => producer.append(JSON.stringify(event));
	const updateWorkspace = (status = options.workspace.status) => {
		append(
			artifactStateSchema.workspace.upsert({
				value: {
					...options.workspace,
					status,
					fileCount: files.size,
					artifactCount: artifacts.size,
				},
			}),
		);
	};

	append(artifactStateSchema.workspace.insert({ value: options.workspace }));

	const enqueue = (work: () => Promise<void>) => {
		const task = queue.then(work);
		queue = task.catch((error) => {
			const message =
				error instanceof Error ? error.message : "Unknown watcher error.";
			append(
				artifactStateSchema.diagnostics.upsert({
					value: {
						id: `watch:${randomUUID()}`,
						fileId: null,
						severity: "warning",
						source: "watch",
						message,
						location: null,
					},
				}),
			);
		});
		return task;
	};

	const upsert = (absolutePath: string) => {
		enqueue(async () => {
			const result = await readFileMetadata(
				options.root,
				absolutePath,
				++revision,
			);
			append(artifactStateSchema.files.upsert({ value: result.file }));
			files.add(result.file.id);

			if (result.artifact) {
				append(
					artifactStateSchema.artifacts.upsert({ value: result.artifact }),
				);
				artifacts.add(result.file.id);
			} else if (artifacts.delete(result.file.id)) {
				append(artifactStateSchema.artifacts.delete({ key: result.file.id }));
			}

			if (result.diagnostic) {
				append(
					artifactStateSchema.diagnostics.upsert({ value: result.diagnostic }),
				);
				diagnostics.add(result.diagnostic.id);
			} else {
				const diagnosticId = `schema:${result.file.id}`;
				if (diagnostics.delete(diagnosticId)) {
					append(artifactStateSchema.diagnostics.delete({ key: diagnosticId }));
				}
			}
			updateWorkspace();
		});
	};

	const remove = (absolutePath: string) => {
		enqueue(async () => {
			const path =
				relative(options.root, absolutePath).split(sep).join("/") || ".";
			append(artifactStateSchema.files.delete({ key: path }));
			files.delete(path);
			if (artifacts.delete(path))
				append(artifactStateSchema.artifacts.delete({ key: path }));
			const diagnosticId = `schema:${path}`;
			if (diagnostics.delete(diagnosticId)) {
				append(artifactStateSchema.diagnostics.delete({ key: diagnosticId }));
			}
			updateWorkspace();
		});
	};

	const watcher = chokidar.watch(options.root, {
		ignored: options.ignores ?? DEFAULT_IGNORES,
		ignoreInitial: false,
		persistent: true,
		followSymlinks: false,
	});

	watcher.on("add", upsert);
	watcher.on("addDir", upsert);
	watcher.on("change", upsert);
	watcher.on("unlink", remove);
	watcher.on("unlinkDir", remove);

	const ready = new Promise<void>((resolve, reject) => {
		watcher.once("error", reject);
		watcher.once("ready", () => {
			const task = enqueue(async () => {
				updateWorkspace("ready");
				await producer.flush();
				if (producerError) throw producerError;
			});
			task.then(resolve, reject);
		});
	});

	return {
		ready,
		async close() {
			if (closed) return;
			closed = true;
			await watcher.close();
			await queue;
			await producer.detach();
			if (producerError) throw producerError;
		},
	};
}
