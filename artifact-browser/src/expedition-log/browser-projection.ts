export interface BrowserExpeditionTrip {
	tripId: number;
	path: string;
}

export interface BrowserExpeditionPromotion {
	promotionId: number;
	tripId: number;
	entryId: number;
	runId?: number;
}

export interface BrowserExpeditionProjection {
	trips: BrowserExpeditionTrip[];
	promotions: BrowserExpeditionPromotion[];
}

interface ExpeditionEvent {
	type?: string;
	payload?: Record<string, unknown>;
}

function integer(value: unknown): number | undefined {
	return typeof value === "number" && Number.isInteger(value) && value > 0
		? value
		: undefined;
}

export function projectBrowserExpedition(
	jsonl: string,
): BrowserExpeditionProjection {
	const trips = new Map<number, BrowserExpeditionTrip>();
	const promotions = new Map<number, BrowserExpeditionPromotion>();
	const promotionOrder: number[] = [];

	for (const [index, line] of jsonl.split(/\r?\n/).entries()) {
		if (!line.trim()) continue;
		let event: ExpeditionEvent;
		try {
			event = JSON.parse(line) as ExpeditionEvent;
		} catch (error) {
			throw new Error(`Expedition event line ${index + 1} is not valid JSON.`, {
				cause: error,
			});
		}
		const payload = event.payload ?? {};

		if (event.type === "trip.joined") {
			const tripId = integer(payload.tripId);
			if (tripId && typeof payload.path === "string") {
				trips.set(tripId, { tripId, path: payload.path });
			}
		}

		if (event.type === "entry.promoted") {
			const promotionId = integer(payload.promotionId);
			const tripId = integer(payload.tripId);
			const entryId = integer(payload.entryId);
			if (!promotionId || !tripId || !entryId) continue;
			const replacesPromotionId = integer(payload.replacesPromotionId);
			promotions.set(promotionId, {
				promotionId,
				tripId,
				entryId,
				runId: integer(payload.runId),
			});
			if (replacesPromotionId) {
				const replacedIndex = promotionOrder.indexOf(replacesPromotionId);
				if (replacedIndex >= 0) {
					promotionOrder.splice(replacedIndex, 1, promotionId);
				} else {
					promotionOrder.push(promotionId);
				}
			} else {
				promotionOrder.push(promotionId);
			}
		}

		if (event.type === "entry.removed") {
			const promotionId = integer(payload.promotionId);
			if (!promotionId) continue;
			const removedIndex = promotionOrder.indexOf(promotionId);
			if (removedIndex >= 0) promotionOrder.splice(removedIndex, 1);
		}
	}

	return {
		trips: [...trips.values()],
		promotions: promotionOrder
			.map((promotionId) => promotions.get(promotionId))
			.filter(
				(promotion): promotion is BrowserExpeditionPromotion =>
					promotion != null,
			),
	};
}
