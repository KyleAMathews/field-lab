import {
	mkdir,
	mkdtemp,
	readFile,
	realpath,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appendFieldLogEvents, initializeFieldLog } from "../field-log/writer";
import { collectPublication } from "./collect";

const actor = { kind: "orchestrator", pointer: "test-task" };
const artifactConsent = {
	kind: "artifact-consent" as const,
	pointer: "turn-1",
	verbatim: "Start a Field Log for this inquiry.",
};

describe("publication collection", () => {
	it("includes embedded media but does not crawl ordinary links", async () => {
		const root = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		await mkdir(join(root, "images"));
		await writeFile(
			join(root, "post.md"),
			"# Post\n\n![Figure](./images/figure.svg)\n\n[Private](./private.md)",
		);
		await writeFile(join(root, "images/figure.svg"), "<svg/>");
		await writeFile(join(root, "private.md"), "# Private");

		const plan = await collectPublication({ root, entries: ["post.md"] });
		expect(
			plan.files
				.filter((file) => file.kind === "file")
				.map((file) => file.path),
		).toEqual(["images/figure.svg", "post.md"]);
	});

	it("rejects escaping media", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "root");
		await mkdir(root);
		await writeFile(join(parent, "secret.png"), "secret");
		await writeFile(join(root, "post.md"), "![No](../secret.png)");
		await expect(
			collectPublication({ root, entries: ["post.md"] }),
		).rejects.toThrow();
	});

	it("publishes a Field Log with its canonical event stream", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "trip");
		await mkdir(join(root, "sources"), { recursive: true });
		const externalSource = join(parent, "transcript.txt");
		await writeFile(
			join(root, "field_log.md"),
			"---\ntype: field-log\nformat: field-log/v1\nevent-stream: ./field_log.jsonl\n---\n# Field Log",
		);
		await writeFile(
			join(root, "field_log.jsonl"),
			[
				'{"schema":"field-log/v1","eventId":1,"type":"trip.created","recordedAt":"2026-07-30T12:00:00.000Z","actor":{"kind":"orchestrator"},"authorization":{"kind":"artifact-consent","pointer":"turn-1","verbatim":"Start a Field Log."},"payload":{"title":"A trip","openingQuestion":"Why?"}}',
				`{"schema":"field-log/v1","eventId":2,"type":"source.collected","recordedAt":"2026-07-30T12:01:00.000Z","actor":{"kind":"orchestrator"},"payload":{"sourceId":1,"title":"Paper","path":${JSON.stringify(join(root, "sources", "paper.pdf"))}}}`,
				`{"schema":"field-log/v1","eventId":3,"type":"source.collected","recordedAt":"2026-07-30T12:02:00.000Z","actor":{"kind":"orchestrator"},"payload":{"sourceId":2,"title":"Transcript","path":${JSON.stringify(externalSource)}}}`,
			].join("\n"),
		);
		await writeFile(join(root, "sources", "paper.pdf"), "paper");
		await writeFile(externalSource, "transcript");
		const planWithoutConsent = await collectPublication({
			root,
			entries: ["field_log.md"],
		});
		expect(
			planWithoutConsent.files
				.filter((file) => file.kind === "file")
				.map((file) => file.path),
		).toEqual(["field_log.jsonl", "field_log.md", "sources/paper.pdf"]);
		expect(planWithoutConsent.sourceIdentityPaths).toEqual({
			[join(root, "sources", "paper.pdf")]: await realpath(
				join(root, "sources", "paper.pdf"),
			),
		});

		await writeFile(
			join(root, "field_log.jsonl"),
			[
				await readFile(join(root, "field_log.jsonl"), "utf8"),
				'{"schema":"field-log/v1","eventId":4,"type":"source.publication.authorized","recordedAt":"2026-07-30T12:03:00.000Z","actor":{"kind":"orchestrator"},"authorization":{"kind":"publication-consent","pointer":"turn-5","verbatim":"Include the transcript in the published package."},"payload":{"sourceId":2}}',
			].join("\n"),
		);
		const planWithConsent = await collectPublication({
			root,
			entries: ["field_log.md"],
		});
		expect(planWithConsent.sourceIdentityPaths).toEqual({
			[join(root, "sources", "paper.pdf")]: await realpath(
				join(root, "sources", "paper.pdf"),
			),
			[externalSource]: await realpath(externalSource),
		});
	});

	it("rejects malformed history and consent recorded before collection", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "trip");
		await mkdir(root);
		const externalSource = join(parent, "transcript.txt");
		await writeFile(externalSource, "transcript");
		await writeFile(
			join(root, "field_log.md"),
			"---\ntype: field-log\nformat: field-log/v1\nevent-stream: ./field_log.jsonl\n---\n# Field Log",
		);
		await writeFile(
			join(root, "field_log.jsonl"),
			[
				'{"schema":"field-log/v1","eventId":1}',
				'{"schema":"field-log/v1","eventId":2,"type":"source.publication.authorized","recordedAt":"2026-07-30T12:00:00.000Z","actor":{"kind":"orchestrator"},"authorization":{"kind":"publication-consent","pointer":"turn-2","verbatim":"Include it."},"payload":{"sourceId":1}}',
				`{"schema":"field-log/v1","eventId":3,"type":"source.collected","recordedAt":"2026-07-30T12:01:00.000Z","actor":{"kind":"orchestrator"},"payload":{"sourceId":1,"title":"Transcript","path":${JSON.stringify(externalSource)}}}`,
			].join("\n"),
		);
		await expect(
			collectPublication({ root, entries: ["field_log.md"] }),
		).rejects.toThrow();
	});

	it("reports an external source omitted for lack of publication consent", async () => {
		const parent = await mkdtemp(join(tmpdir(), "artifact-publish-"));
		const root = join(parent, "trip");
		await mkdir(root);
		const externalSource = join(parent, "transcript.txt");
		await writeFile(externalSource, "transcript");
		await writeFile(
			join(root, "field_log.md"),
			"---\ntype: field-log\nformat: field-log/v1\nevent-stream: ./field_log.jsonl\n---\n# Field Log",
		);
		await writeFile(
			join(root, "field_log.jsonl"),
			[
				'{"schema":"field-log/v1","eventId":1,"type":"trip.created","recordedAt":"2026-07-30T12:00:00.000Z","actor":{"kind":"orchestrator"},"authorization":{"kind":"artifact-consent","pointer":"turn-1","verbatim":"Start a log."},"payload":{"title":"A trip","openingQuestion":"Why?"}}',
				`{"schema":"field-log/v1","eventId":2,"type":"source.collected","recordedAt":"2026-07-30T12:01:00.000Z","actor":{"kind":"orchestrator"},"payload":{"sourceId":1,"title":"Transcript","path":${JSON.stringify(externalSource)}}}`,
			].join("\n"),
		);
		const plan = await collectPublication({ root, entries: ["field_log.md"] });
		expect(plan.diagnostics).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					severity: "warning",
					message: expect.stringContaining("publication consent"),
				}),
			]),
		);
	});

	it("keeps a copied transient source private until publication is authorized", async () => {
		const directory = await mkdtemp(join(tmpdir(), "artifact-publish-trip-"));
		const downloads = await mkdtemp(join(tmpdir(), "artifact-download-"));
		const original = join(downloads, "transcript.txt");
		await writeFile(original, "private transcript");
		await initializeFieldLog(directory, {
			type: "trip.created",
			actor,
			authorization: artifactConsent,
			payload: { title: "A trip", openingQuestion: "Why?" },
		});
		await appendFieldLogEvents(directory, {
			type: "source.collected",
			actor,
			payload: { title: "Transcript", path: original },
		});

		const withoutConsent = await collectPublication({
			root: directory,
			entries: ["field_log.md"],
		});
		expect(withoutConsent.files.map((file) => file.path)).not.toContain(
			"sources/1-transcript.txt",
		);
		expect(withoutConsent.diagnostics).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					message: expect.stringContaining("publication consent"),
				}),
			]),
		);

		await appendFieldLogEvents(directory, {
			type: "source.publication.authorized",
			actor,
			authorization: {
				kind: "publication-consent",
				pointer: "turn-2",
				verbatim: "Include the transcript in the published package.",
			},
			payload: { sourceId: 1 },
		});
		const withConsent = await collectPublication({
			root: directory,
			entries: ["field_log.md"],
		});
		expect(withConsent.files.map((file) => file.path)).toContain(
			"sources/1-transcript.txt",
		);
	});
});
