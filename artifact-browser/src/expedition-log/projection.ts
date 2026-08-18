import { resolve } from "node:path";
import { readFieldLog } from "../field-log/reader";
import type { StoredExpeditionEvent } from "./writer";

export interface ExpeditionTrip {
	tripId: number;
	path: string;
	title?: string;
	openedAt?: string;
	updatedAt?: string;
	latestEventId?: number;
	scope?: string;
}

export interface ExpeditionPromotion {
	promotionId: number;
	tripId: number;
	entryId: number;
	runId?: number;
	rationale: string;
	replacesPromotionId?: number;
	title?: string;
	summary?: string;
	href?: string;
	instrumentId?: string;
}

export interface ExpeditionProjection {
	format: "expedition-log/v1";
	title: string;
	territory: string;
	openedAt?: string;
	updatedAt?: string;
	trips: ExpeditionTrip[];
	promotions: ExpeditionPromotion[];
}

function numberValue(value: unknown): number | undefined {
	return typeof value === "number" && Number.isInteger(value)
		? value
		: undefined;
}

function stringValue(value: unknown): string {
	return typeof value === "string" ? value : "";
}

export function projectExpeditionEvents(
	events: StoredExpeditionEvent[],
): ExpeditionProjection {
	const projection: ExpeditionProjection = {
		format: "expedition-log/v1",
		title: "Expedition",
		territory: "",
		trips: [],
		promotions: [],
	};
	const trips = new Map<number, ExpeditionTrip>();
	const promotions = new Map<number, ExpeditionPromotion>();
	const promotionOrder: number[] = [];

	for (const event of events) {
		projection.updatedAt = event.recordedAt;
		if (event.type === "expedition.created") {
			projection.title = stringValue(event.payload.title) || projection.title;
			projection.territory = stringValue(event.payload.territory);
			projection.openedAt =
				stringValue(event.payload.openedAt) || event.recordedAt;
		}
		if (event.type === "expedition.title.updated") {
			projection.title = stringValue(event.payload.title) || projection.title;
		}
		if (event.type === "trip.joined") {
			const tripId = numberValue(event.payload.tripId);
			if (tripId)
				trips.set(tripId, {
					tripId,
					path: stringValue(event.payload.path),
				});
		}
		if (event.type === "entry.promoted") {
			const promotionId = numberValue(event.payload.promotionId);
			const tripId = numberValue(event.payload.tripId);
			const entryId = numberValue(event.payload.entryId);
			if (!promotionId || !tripId || !entryId) continue;
			const replacesPromotionId = numberValue(
				event.payload.replacesPromotionId,
			);
			const promotion: ExpeditionPromotion = {
				promotionId,
				tripId,
				entryId,
				runId: numberValue(event.payload.runId),
				rationale: stringValue(event.payload.rationale),
				replacesPromotionId,
			};
			promotions.set(promotionId, promotion);
			if (replacesPromotionId) {
				const index = promotionOrder.indexOf(replacesPromotionId);
				if (index >= 0) promotionOrder.splice(index, 1, promotionId);
				else promotionOrder.push(promotionId);
			} else {
				promotionOrder.push(promotionId);
			}
		}
		if (event.type === "entry.removed") {
			const promotionId = numberValue(event.payload.promotionId);
			if (!promotionId) continue;
			const index = promotionOrder.indexOf(promotionId);
			if (index >= 0) promotionOrder.splice(index, 1);
		}
	}
	projection.trips = [...trips.values()];
	projection.promotions = promotionOrder
		.map((id) => promotions.get(id))
		.filter((item): item is ExpeditionPromotion => Boolean(item));
	return projection;
}

function compact(value: string, limit = 600): string {
	const clean = value.trim();
	if (clean.length <= limit) return clean;
	return `${clean.slice(0, limit).trimEnd()}…`;
}

export async function resolveExpeditionProjection(
	root: string,
	events: StoredExpeditionEvent[],
): Promise<ExpeditionProjection> {
	const projection = projectExpeditionEvents(events);
	const models = new Map<number, Awaited<ReturnType<typeof readFieldLog>>>();
	for (const trip of projection.trips) {
		const model = await readFieldLog(resolve(root, trip.path));
		models.set(trip.tripId, model);
		trip.title = model.projection.title;
		trip.openedAt = model.projection.openedAt;
		trip.updatedAt = model.projection.updatedAt;
		trip.latestEventId = model.events.at(-1)?.eventId;
		trip.scope = model.projection.scope;
	}
	for (const promotion of projection.promotions) {
		const model = models.get(promotion.tripId);
		if (!model)
			throw new Error(
				`Promotion ${promotion.promotionId} refers to an unknown trip.`,
			);
		const entry = model.projection.entries.find(
			(candidate) =>
				candidate.id === `entry-${promotion.entryId}` &&
				(promotion.runId == null ||
					Number(candidate.runId) === promotion.runId),
		);
		if (!entry)
			throw new Error(
				`Promotion ${promotion.promotionId} refers to missing entry ${promotion.entryId}.`,
			);
		promotion.title = entry.title;
		promotion.summary = compact(entry.summary);
		promotion.instrumentId = entry.instrumentId;
		promotion.href = `?file=${encodeURIComponent(`${projection.trips.find((trip) => trip.tripId === promotion.tripId)?.path}/field_log.md`)}&entry=entry-${promotion.entryId}${promotion.runId ? `&readout=${promotion.runId}` : ""}`;
	}
	return projection;
}

function yaml(value: string): string {
	return JSON.stringify(value);
}

export function renderExpeditionProjection(
	projection: ExpeditionProjection,
	generatedThrough: number,
): string {
	const lines = [
		"---",
		"type: expedition-log",
		"format: expedition-log/v1",
		"event-stream: ./expedition_log.jsonl",
		`generated-through: ${generatedThrough}`,
		`title: ${yaml(projection.title)}`,
		projection.openedAt ? `opened-at: ${projection.openedAt}` : "",
		projection.updatedAt ? `updated-at: ${projection.updatedAt}` : "",
		"---",
		"",
		`# ${projection.title}`,
		"",
		projection.territory || "_No territory recorded._",
		"",
		"## Field Trips",
		"",
		...(projection.trips.length
			? projection.trips.flatMap((trip) => [
					`### ${trip.title || `Field Trip ${trip.tripId}`}`,
					"",
					`- **Opened at:** ${trip.openedAt ?? "unknown"}`,
					`- **Latest event:** ${trip.latestEventId ?? "unknown"} at ${trip.updatedAt ?? "unknown"}`,
					`- **Field Log:** [${trip.path}/field_log.md](${trip.path}/field_log.md)`,
					`- **Scope:** ${trip.scope || "Not recorded."}`,
					"",
				])
			: ["_No Field Trips have joined._", ""]),
		"## Promoted entries",
		"",
		...(projection.promotions.length
			? projection.promotions.flatMap((promotion) => {
					const directLabel = promotion.runId
						? "Open full readout"
						: "Open full entry";
					const sourceLabel = promotion.runId
						? "See readout in Field Log"
						: "See entry in Field Log";
					return [
						`<a id="promotion-${promotion.promotionId}"></a>`,
						`### ${promotion.title || `Promotion ${promotion.promotionId}`}`,
						"",
						promotion.summary || "_No summary recorded._",
						"",
						`- **Read:** [${directLabel}](?file=./expedition_log.md&promotion=promotion-${promotion.promotionId})`,
						`- **Why promoted:** ${promotion.rationale}`,
						`- **Source:** [${sourceLabel}](${promotion.href})`,
						"",
					];
				})
			: ["_No entries have been promoted._", ""]),
	];
	return `${lines.join("\n").trim()}\n`;
}
