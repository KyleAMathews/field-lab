export const instrumentFamilies = [
	"elicit",
	"map",
	"reframe",
	"explore",
	"test",
	"audit",
	"retain",
] as const;

export const contacts = [
	"person",
	"artifact",
	"model",
	"field",
	"record",
] as const;
export const artifactRoles = [
	"reading",
	"map",
	"candidate",
	"design",
	"draft",
	"publication",
	"handoff",
] as const;
export const representations = [
	"document",
	"record-set",
	"sequence",
	"matrix",
	"graph",
	"series",
	"ledger",
] as const;
export const renderingModes = [
	"mechanical",
	"instrumented",
	"editorial",
] as const;
export const exposures = ["internal", "checkpoint", "public"] as const;

export type InstrumentFamily = (typeof instrumentFamilies)[number];
export type Contact = (typeof contacts)[number];
export type ArtifactRole = (typeof artifactRoles)[number];
export type Representation = (typeof representations)[number];
export type RenderingMode = (typeof renderingModes)[number];
export type Exposure = (typeof exposures)[number];

export interface WorkspaceRecord {
	id: string;
	displayName: string;
	runId: string;
	status: "starting" | "ready" | "error";
	startedAt: number;
	fileCount: number;
	artifactCount: number;
}

export interface FileRecord {
	id: string;
	path: string;
	parentPath: string | null;
	name: string;
	kind: "file" | "directory" | "symlink";
	extension: string | null;
	mimeType: string | null;
	size: number | null;
	modifiedAt: number | null;
	revision: string;
	rendererId: string;
	readable: boolean;
}

export interface ArtifactRecord {
	id: string;
	fileId: string;
	protocolVersion: string;
	schemaId: string;
	schemaVersion: string;
	title: string;
	instrumentId: string | null;
	instrumentFamily: InstrumentFamily | null;
	contact: Contact | null;
	role: ArtifactRole;
	representation: Representation;
	renderingMode: RenderingMode;
	exposure: Exposure;
	valid: boolean;
}

export interface DiagnosticRecord {
	id: string;
	fileId: string | null;
	severity: "info" | "warning" | "error";
	source: "schema" | "watch" | "render" | "publish";
	message: string;
	location: string | null;
}

export interface MetadataResult {
	file: FileRecord;
	artifact: ArtifactRecord | null;
	diagnostic: DiagnosticRecord | null;
}

export interface BootConfig {
	workspaceName: string;
	streamUrl: string;
	capability: string;
	initialPath: string | null;
}
