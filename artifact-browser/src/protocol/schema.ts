import { createStateSchema } from "@durable-streams/state/db";
import { z } from "zod";
import {
	artifactRoles,
	contacts,
	exposures,
	instrumentFamilies,
	renderingModes,
	representations,
} from "./types";

export const workspaceRecordSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	runId: z.string(),
	status: z.enum(["starting", "ready", "error"]),
	startedAt: z.number(),
	fileCount: z.number().int().nonnegative(),
	artifactCount: z.number().int().nonnegative(),
});

export const fileRecordSchema = z.object({
	id: z.string(),
	path: z.string(),
	parentPath: z.string().nullable(),
	name: z.string(),
	kind: z.enum(["file", "directory", "symlink"]),
	extension: z.string().nullable(),
	mimeType: z.string().nullable(),
	size: z.number().nullable(),
	modifiedAt: z.number().nullable(),
	revision: z.string(),
	rendererId: z.string(),
	readable: z.boolean(),
});

export const artifactRecordSchema = z.object({
	id: z.string(),
	fileId: z.string(),
	protocolVersion: z.string(),
	schemaId: z.string(),
	schemaVersion: z.string(),
	title: z.string(),
	instrumentId: z.string().nullable(),
	instrumentFamily: z.enum(instrumentFamilies).nullable(),
	contact: z.enum(contacts).nullable(),
	role: z.enum(artifactRoles),
	representation: z.enum(representations),
	renderingMode: z.enum(renderingModes),
	exposure: z.enum(exposures),
	valid: z.boolean(),
});

export const diagnosticRecordSchema = z.object({
	id: z.string(),
	fileId: z.string().nullable(),
	severity: z.enum(["info", "warning", "error"]),
	source: z.enum(["schema", "watch", "render", "publish"]),
	message: z.string(),
	location: z.string().nullable(),
});

export const artifactStateSchema = createStateSchema({
	workspace: {
		schema: workspaceRecordSchema,
		type: "workspace",
		primaryKey: "id",
	},
	files: {
		schema: fileRecordSchema,
		type: "file",
		primaryKey: "id",
	},
	artifacts: {
		schema: artifactRecordSchema,
		type: "artifact",
		primaryKey: "id",
	},
	diagnostics: {
		schema: diagnosticRecordSchema,
		type: "diagnostic",
		primaryKey: "id",
	},
});

export const artifactFrontmatterSchema = z.object({
	protocol: z.coerce.string().default("1"),
	schema: z.string().default("field-lab/document"),
	schemaVersion: z.coerce.string().default("1"),
	title: z.string(),
	role: z.enum(artifactRoles).default("reading"),
	representation: z.enum(representations).default("document"),
	renderingMode: z.enum(renderingModes).default("mechanical"),
	exposure: z.enum(exposures).default("internal"),
	instrument: z
		.object({
			id: z.string().optional(),
			family: z.enum(instrumentFamilies).optional(),
			contact: z.enum(contacts).optional(),
		})
		.optional(),
});
