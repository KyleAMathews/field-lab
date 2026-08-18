import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, readdir, readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { z } from "zod";
import { joinFieldTrip } from "../expedition-log/operations";
import {
	inspectExpeditionLog,
	renderExpeditionLog,
	validateExpeditionLog,
} from "../expedition-log/writer";
import {
	appendFieldLogEvents,
	initializeFieldLog,
	renderFieldLog,
	type StoredEvent,
	validateFieldLog,
} from "../field-log/writer";
import { stageTextReplacement } from "../log/filesystem";

const actorSchema = z.object({
	kind: z.string().min(1),
	pointer: z.string().min(1).optional(),
});

const authorizationSchema = z.object({
	kind: z.literal("artifact-consent"),
	pointer: z.string().min(1),
	verbatim: z.string().trim().min(1),
});

const eventSchema = z
	.object({
		type: z.string().min(1),
		actor: actorSchema,
		authorization: z
			.object({
				kind: z.enum([
					"artifact-consent",
					"publication-consent",
					"user-selection",
					"user-request",
				]),
				pointer: z.string().min(1),
				verbatim: z.string().trim().min(1),
			})
			.optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.strict();

const startInputSchema = z
	.object({
		operationId: z.string().min(1).optional(),
		actor: actorSchema.optional(),
		authorization: authorizationSchema,
		trip: z
			.object({
				title: z.string().trim().min(1),
				openingQuestion: z.string().trim().min(1),
				scope: z.string().trim().min(1).optional(),
				reason: z.string().trim().min(1).optional(),
			})
			.strict(),
		events: z.array(eventSchema).min(1),
	})
	.strict()
	.superRefine((input, context) => {
		if (input.events[0]?.type !== "comment.recorded") {
			context.addIssue({
				code: "custom",
				path: ["events", 0, "type"],
				message:
					"The first inherited event must record the initiating user comment.",
			});
		}
		for (const [index, event] of input.events.entries()) {
			if (
				event.type === "trip.created" ||
				event.type === "trip.expedition.joined"
			) {
				context.addIssue({
					code: "custom",
					path: ["events", index, "type"],
					message: `${event.type} is owned by trip start.`,
				});
			}
		}
	});

export type TripStartInput = z.infer<typeof startInputSchema>;

type TripStartStage =
	| "prepared"
	| "field-log-initialized"
	| "context-appended"
	| "membership-recorded"
	| "validated";

export interface TripStartReceipt {
	schema: "field-lab-trip-start/v1";
	operationId: string;
	requestHash: string;
	status: "running" | "recoverable" | "complete";
	stage: TripStartStage;
	expeditionDirectory: string;
	tripDirectory: string;
	fieldLogPath: string;
	expeditionLogPath: string;
	tripId?: number;
	fieldEventIds?: number[];
	expeditionEventIds?: number[];
	warnings: string[];
	lastError?: string;
}

export class TripStartError extends Error {
	constructor(
		message: string,
		readonly recoveryReceipt: string,
		readonly operationId: string,
		readonly stage: TripStartStage,
	) {
		super(message);
		this.name = "TripStartError";
	}
}

function hashInput(input: TripStartInput): string {
	return createHash("sha256")
		.update(
			JSON.stringify({
				actor: input.actor,
				authorization: input.authorization,
				trip: input.trip,
				events: input.events,
			}),
		)
		.digest("hex");
}

function isInside(root: string, candidate: string): boolean {
	const path = relative(root, candidate);
	return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

function isSubset(expected: unknown, actual: unknown): boolean {
	if (Array.isArray(expected)) {
		return (
			Array.isArray(actual) &&
			expected.length === actual.length &&
			expected.every((value, index) => isSubset(value, actual[index]))
		);
	}
	if (expected && typeof expected === "object") {
		if (!actual || typeof actual !== "object") return false;
		return Object.entries(expected).every(([key, value]) => {
			const actualRecord = actual as Record<string, unknown>;
			if (
				key === "path" &&
				typeof value === "string" &&
				actualRecord.originalPath === value
			)
				return true;
			return isSubset(value, actualRecord[key]);
		});
	}
	return Object.is(expected, actual);
}

function submittedEventsMatch(
	stored: StoredEvent[],
	submitted: TripStartInput["events"],
): boolean {
	if (stored.length < submitted.length + 1) return false;
	return submitted.every((event, index) => {
		const actual = stored[index + 1];
		return (
			actual?.type === event.type &&
			isSubset(event.actor, actual.actor) &&
			isSubset(event.authorization, actual.authorization) &&
			isSubset(event.payload, actual.payload)
		);
	});
}

async function exists(path: string): Promise<boolean> {
	return access(path)
		.then(() => true)
		.catch(() => false);
}

async function readReceipt(path: string): Promise<TripStartReceipt | null> {
	return readFile(path, "utf8")
		.then((source) => JSON.parse(source) as TripStartReceipt)
		.catch((error) => {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
			throw error;
		});
}

async function writeReceipt(
	path: string,
	receipt: TripStartReceipt,
): Promise<void> {
	await (
		await stageTextReplacement(path, `${JSON.stringify(receipt, null, 2)}\n`)
	)();
}

function creationEvent(input: TripStartInput, operationId: string) {
	return {
		type: "trip.created",
		actor: input.actor ?? {
			kind: "orchestrator",
			pointer: `field-lab-trip-start:${operationId}`,
		},
		authorization: input.authorization,
		payload: {
			title: input.trip.title,
			openingQuestion: input.trip.openingQuestion,
			...(input.trip.scope ? { scope: input.trip.scope } : {}),
			...(input.trip.reason ? { reason: input.trip.reason } : {}),
		},
	};
}

function creationMatches(
	events: StoredEvent[],
	input: TripStartInput,
	operationId: string,
): boolean {
	const actual = events[0];
	const expected = creationEvent(input, operationId);
	return (
		actual?.type === expected.type &&
		isSubset(expected.actor, actual.actor) &&
		isSubset(expected.authorization, actual.authorization) &&
		isSubset(expected.payload, actual.payload)
	);
}

export async function startTripInExpedition(
	expeditionDirectory: string,
	slug: string,
	rawInput: unknown,
): Promise<{ receipt: TripStartReceipt; recoveryReceipt: string }> {
	if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug))
		throw new Error(
			"Trip slug must use lowercase letters, numbers, and hyphens.",
		);
	const input = startInputSchema.parse(rawInput);
	const expeditionRoot = resolve(expeditionDirectory);
	await validateExpeditionLog(expeditionRoot);
	const tripsRoot = resolve(expeditionRoot, "field-trips");
	const tripDirectory = resolve(tripsRoot, slug);
	if (!isInside(tripsRoot, tripDirectory))
		throw new Error("Trip directory escapes the Expedition.");
	const fieldLogPath = resolve(tripDirectory, "field_log.md");
	const expeditionLogPath = resolve(expeditionRoot, "expedition_log.md");
	const recoveryReceipt = resolve(tripDirectory, ".field-lab-trip-start.json");
	const requestHash = hashInput(input);
	await mkdir(tripDirectory, { recursive: true });
	const prior = await readReceipt(recoveryReceipt);
	if (prior && prior.requestHash !== requestHash) {
		throw new Error(
			`Trip start receipt belongs to a different request: ${recoveryReceipt}`,
		);
	}
	const operationId = input.operationId ?? prior?.operationId ?? randomUUID();
	if (
		input.operationId &&
		prior?.operationId &&
		input.operationId !== prior.operationId
	) {
		throw new Error(
			`Trip start receipt belongs to operation ${prior.operationId}.`,
		);
	}
	let receipt: TripStartReceipt = prior ?? {
		schema: "field-lab-trip-start/v1",
		operationId,
		requestHash,
		status: "running",
		stage: "prepared",
		expeditionDirectory: expeditionRoot,
		tripDirectory,
		fieldLogPath,
		expeditionLogPath,
		warnings: [],
	};
	await writeReceipt(recoveryReceipt, receipt);

	try {
		const eventPath = resolve(tripDirectory, "field_log.jsonl");
		let fieldEvents: StoredEvent[];
		if (!(await exists(eventPath))) {
			const files = (await readdir(tripDirectory)).filter(
				(file) => file !== ".field-lab-trip-start.json",
			);
			if (files.length)
				throw new Error(`Trip directory is not empty: ${tripDirectory}`);
			const initialized = await initializeFieldLog(
				tripDirectory,
				creationEvent(input, operationId),
			);
			receipt = {
				...receipt,
				stage: "field-log-initialized",
				fieldEventIds: initialized.eventIds,
				warnings: initialized.projectionWarning
					? [...receipt.warnings, initialized.projectionWarning]
					: receipt.warnings,
			};
			await writeReceipt(recoveryReceipt, receipt);
			fieldEvents = await validateFieldLog(tripDirectory);
		} else {
			fieldEvents = await validateFieldLog(tripDirectory);
			if (!creationMatches(fieldEvents, input, operationId))
				throw new Error(
					"Existing Field Log does not match this trip start request.",
				);
			if (receipt.stage === "prepared") {
				receipt = { ...receipt, stage: "field-log-initialized" };
				await writeReceipt(recoveryReceipt, receipt);
			}
		}

		if (!submittedEventsMatch(fieldEvents, input.events)) {
			if (fieldEvents.length > 1)
				throw new Error(
					"Existing Field Log context differs from the prepared event batch.",
				);
			const appended = await appendFieldLogEvents(tripDirectory, input.events);
			receipt = {
				...receipt,
				stage: "context-appended",
				fieldEventIds: [...(receipt.fieldEventIds ?? []), ...appended.eventIds],
				warnings: appended.projectionWarning
					? [...receipt.warnings, appended.projectionWarning]
					: receipt.warnings,
			};
			await writeReceipt(recoveryReceipt, receipt);
		} else if (
			receipt.stage === "prepared" ||
			receipt.stage === "field-log-initialized"
		) {
			receipt = { ...receipt, stage: "context-appended" };
			await writeReceipt(recoveryReceipt, receipt);
		}

		const joined = await joinFieldTrip(expeditionRoot, tripDirectory, {
			actor: input.actor ?? {
				kind: "orchestrator",
				pointer: `field-lab-trip-start:${operationId}`,
			},
			authorization: input.authorization,
		});
		receipt = {
			...receipt,
			stage: "membership-recorded",
			tripId: joined.tripId,
			expeditionEventIds: joined.eventIds,
			warnings: joined.projectionWarning
				? [...receipt.warnings, joined.projectionWarning]
				: receipt.warnings,
		};
		await writeReceipt(recoveryReceipt, receipt);

		await renderFieldLog(tripDirectory);
		await renderExpeditionLog(expeditionRoot);
		await validateFieldLog(tripDirectory);
		await validateExpeditionLog(expeditionRoot);
		const expedition = await inspectExpeditionLog(expeditionRoot);
		const tripPath = relative(expeditionRoot, tripDirectory);
		const tripId = expedition.trips.find(
			(trip) => trip.path === tripPath,
		)?.tripId;
		if (!tripId) throw new Error("Expedition membership did not validate.");
		receipt = {
			...receipt,
			status: "complete",
			stage: "validated",
			tripId,
			lastError: undefined,
		};
		await writeReceipt(recoveryReceipt, receipt);
		return { receipt, recoveryReceipt };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		receipt = { ...receipt, status: "recoverable", lastError: message };
		await writeReceipt(recoveryReceipt, receipt).catch(() => undefined);
		throw new TripStartError(
			message,
			recoveryReceipt,
			operationId,
			receipt.stage,
		);
	}
}
