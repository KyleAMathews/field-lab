import { access, mkdir, rename } from "node:fs/promises";
import { basename, isAbsolute, relative, resolve } from "node:path";
import { readFieldLogItem, searchFieldLog } from "../field-log/reader";
import { appendFieldLogEvents, validateFieldLog } from "../field-log/writer";
import {
	appendExpeditionEvents,
	type ExpeditionMutationReceipt,
	inspectExpeditionLog,
} from "./writer";

interface EventAuthority {
	actor: { kind: string; pointer?: string };
	authorization: {
		kind: "artifact-consent";
		pointer: string;
		verbatim: string;
	};
}

function inside(root: string, candidate: string): boolean {
	const path = relative(root, candidate);
	return (
		path === "" ||
		(path !== ".." && !path.startsWith("../") && !isAbsolute(path))
	);
}

export async function joinFieldTrip(
	expeditionDirectory: string,
	fieldTripDirectory: string,
	authority: EventAuthority,
): Promise<ExpeditionMutationReceipt & { path: string }> {
	const expeditionRoot = resolve(expeditionDirectory);
	const originalTrip = resolve(fieldTripDirectory);
	const expedition = await inspectExpeditionLog(expeditionRoot);
	const originalEvents = await validateFieldLog(originalTrip);
	const tripsRoot = resolve(expeditionRoot, "field-trips");
	await mkdir(tripsRoot, { recursive: true });
	const alreadyInside = inside(tripsRoot, originalTrip);
	const targetTrip = alreadyInside
		? originalTrip
		: resolve(tripsRoot, basename(originalTrip));
	if (!alreadyInside) {
		const exists = await access(targetTrip)
			.then(() => true)
			.catch(() => false);
		if (exists)
			throw new Error(`A Field Trip already exists at ${targetTrip}.`);
		await rename(originalTrip, targetTrip);
	}
	const tripPath = relative(expeditionRoot, targetTrip);
	const expeditionPath = relative(
		targetTrip,
		resolve(expeditionRoot, "expedition_log.md"),
	);
	const fieldMembership = originalEvents.find(
		(event) => event.type === "trip.expedition.joined",
	);
	if (
		fieldMembership &&
		String(fieldMembership.payload.path) !== expeditionPath
	) {
		throw new Error("This Field Trip already belongs to another Expedition.");
	}
	const expeditionMembership = expedition.trips.find(
		(trip) => trip.path === tripPath,
	);
	if (!fieldMembership) {
		await appendFieldLogEvents(targetTrip, {
			type: "trip.expedition.joined",
			actor: authority.actor,
			authorization: authority.authorization,
			payload: { path: expeditionPath },
		});
	}
	if (expeditionMembership) {
		return {
			eventIds: [],
			tripId: expeditionMembership.tripId,
			path: tripPath,
		};
	}
	const receipt = await appendExpeditionEvents(expeditionRoot, {
		type: "trip.joined",
		actor: authority.actor,
		authorization: authority.authorization,
		payload: { path: tripPath },
	});
	return { ...receipt, path: tripPath };
}

export async function promoteFieldLogEntry(
	expeditionDirectory: string,
	input: {
		tripId: number;
		entryId: number;
		runId?: number;
		rationale: string;
		replacesPromotionId?: number;
	},
) {
	const expedition = await inspectExpeditionLog(expeditionDirectory);
	const trip = expedition.trips.find(
		(candidate) => candidate.tripId === input.tripId,
	);
	if (!trip) throw new Error(`Field Trip ${input.tripId} is not a member.`);
	await readFieldLogItem(resolve(expeditionDirectory, trip.path), {
		entryId: input.entryId,
		runId: input.runId,
	});
	return appendExpeditionEvents(expeditionDirectory, {
		type: "entry.promoted",
		actor: { kind: "orchestrator", pointer: "expedition-log-cli" },
		payload: input,
	});
}

export async function removePromotion(
	expeditionDirectory: string,
	promotionId: number,
) {
	return appendExpeditionEvents(expeditionDirectory, {
		type: "entry.removed",
		actor: { kind: "orchestrator", pointer: "expedition-log-cli" },
		payload: { promotionId },
	});
}

export async function searchExpedition(
	expeditionDirectory: string,
	query: string,
) {
	if (!query.trim()) throw new Error("Search requires a non-empty query.");
	const expedition = await inspectExpeditionLog(expeditionDirectory);
	const promotionHits = expedition.promotions
		.filter((promotion) =>
			[promotion.title, promotion.summary, promotion.rationale]
				.filter(Boolean)
				.join(" ")
				.toLocaleLowerCase()
				.includes(query.toLocaleLowerCase()),
		)
		.map((promotion) => ({
			kind: "promotion" as const,
			promotionId: promotion.promotionId,
			tripId: promotion.tripId,
			tripPath: expedition.trips.find(
				(trip) => trip.tripId === promotion.tripId,
			)?.path,
			entryId: promotion.entryId,
			runId: promotion.runId,
			title: promotion.title,
			snippet: promotion.summary,
		}));
	const tripHits = (
		await Promise.all(
			expedition.trips.map(async (trip) =>
				(
					await searchFieldLog(resolve(expeditionDirectory, trip.path), query)
				).map((hit) => ({ ...hit, tripId: trip.tripId })),
			),
		)
	).flat();
	return { query, promotions: promotionHits, hits: tripHits };
}

export async function readExpeditionItem(
	expeditionDirectory: string,
	selector: {
		tripId: number;
		entryId?: number;
		runId?: number;
		sourceId?: number;
	},
) {
	if (
		selector.entryId == null &&
		selector.runId == null &&
		selector.sourceId == null
	)
		throw new Error("Read requires an entry, readout, or source ID.");
	const expedition = await inspectExpeditionLog(expeditionDirectory);
	const trip = expedition.trips.find(
		(candidate) => candidate.tripId === selector.tripId,
	);
	if (!trip) throw new Error(`Field Trip ${selector.tripId} is not a member.`);
	return readFieldLogItem(resolve(expeditionDirectory, trip.path), selector);
}
