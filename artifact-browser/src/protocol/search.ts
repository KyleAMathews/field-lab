export interface BrowserSearch {
	cap: string;
	file?: string;
	q?: string;
	type?: string;
	page?: "artifacts" | "search";
	aq?: string;
	kind?: string;
	instrument?: string;
	entry?: string;
	promotion?: string;
	readout?: string;
	source?: string;
	inspector?: boolean;
	view?: "rendered" | "source";
	expanded?: string;
	panel?: "files";
}

export function parseBrowserSearch(
	value: Record<string, unknown>,
): BrowserSearch {
	const string = (key: string) =>
		typeof value[key] === "string" ? value[key] : undefined;
	const numericId = (key: string) => {
		const raw = value[key];
		return typeof raw === "number" && Number.isInteger(raw) && raw > 0
			? String(raw)
			: string(key);
	};
	return {
		cap: string("cap") ?? "",
		file: string("file"),
		q: string("q"),
		type: string("type"),
		page:
			value.page === "artifacts" || value.page === "search"
				? value.page
				: undefined,
		aq: string("aq"),
		kind: string("kind"),
		instrument: string("instrument"),
		entry: string("entry"),
		promotion: numericId("promotion"),
		readout: numericId("readout"),
		source: string("source"),
		inspector:
			value.inspector === true || value.inspector === "true" || undefined,
		view:
			value.view === "source"
				? "source"
				: value.view === "rendered"
					? "rendered"
					: undefined,
		expanded: string("expanded"),
		panel: value.panel === "files" ? "files" : undefined,
	};
}

export function decodeExpanded(value?: string): Set<string> {
	return new Set(value ? value.split("|").filter(Boolean) : ["."]);
}

export function encodeExpanded(paths: Set<string>): string | undefined {
	const value = [...paths].sort().join("|");
	return value || undefined;
}
