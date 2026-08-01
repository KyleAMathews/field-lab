import type { FieldLogEntry } from "./projection";

export interface FieldLogSourceActivity {
	id: string;
	title: string;
	summary: string;
	recordedAt: string | null;
}

export type FieldLogJournalItem =
	| { type: "entry"; entry: FieldLogEntry }
	| {
			type: "source-group";
			id: string;
			recordedAt: string | null;
			events: FieldLogEntry[];
			sources: FieldLogSourceActivity[];
	  };

export function groupFieldLogEntries(
	entries: FieldLogEntry[],
): FieldLogJournalItem[] {
	const items: FieldLogJournalItem[] = [];

	for (let index = 0; index < entries.length; ) {
		const entry = entries[index];
		if (entry?.kind !== "source") {
			if (entry) items.push({ type: "entry", entry });
			index += 1;
			continue;
		}

		const events: FieldLogEntry[] = [];
		while (entries[index]?.kind === "source") {
			events.push(entries[index] as FieldLogEntry);
			index += 1;
		}

		const sources = new Map<string, FieldLogSourceActivity>();
		for (const sourceEvent of events) {
			const id = sourceEvent.sourceId ?? sourceEvent.title;
			const prior = sources.get(id);
			sources.set(id, {
				id,
				title: sourceEvent.title,
				summary:
					sourceEvent.summary === "Collected for examination." && prior
						? prior.summary
						: sourceEvent.summary,
				recordedAt: sourceEvent.recordedAt ?? prior?.recordedAt ?? null,
			});
		}

		items.push({
			type: "source-group",
			id: `source-group-${events[0]?.id ?? items.length + 1}`,
			recordedAt: events.at(-1)?.recordedAt ?? null,
			events,
			sources: [...sources.values()],
		});
	}

	return items;
}
