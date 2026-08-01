import { z } from "zod";
import {
	artifactRecordSchema,
	diagnosticRecordSchema,
	fileRecordSchema,
} from "../protocol/schema";

const relativePathSchema = z
	.string()
	.min(1)
	.refine(
		(value) =>
			!value.startsWith("/") &&
			value !== ".." &&
			!value.startsWith("../") &&
			!value.includes("\0"),
		"Expected a root-relative path.",
	);

const contentKeySchema = z
	.string()
	.min(1)
	.refine((value) => !value.includes("\0"));

export const publishedManifestSchema = z.object({
	version: z.literal(1),
	workspaceName: z.string(),
	generatedAt: z.number(),
	entries: z.array(relativePathSchema),
	files: z.array(fileRecordSchema),
	artifacts: z.array(artifactRecordSchema),
	diagnostics: z.array(diagnosticRecordSchema),
	contents: z.record(contentKeySchema, relativePathSchema),
});

export type PublishedManifest = z.infer<typeof publishedManifestSchema>;

export function validatePublishedManifest(value: unknown): PublishedManifest {
	return publishedManifestSchema.parse(value);
}
