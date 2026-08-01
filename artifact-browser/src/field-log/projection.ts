import YAML from "yaml";

export type FieldLogEntryKind =
	| "comment"
	| "instrument"
	| "source"
	| "note"
	| "synthesis"
	| "engine"
	| "context";

export interface FieldLogEntry {
	id: string;
	kind: FieldLogEntryKind;
	recordedAt: string | null;
	title: string;
	summary: string;
	speaker?: string;
	context?: string;
	sourceId?: string;
	instrumentId?: string;
	runId?: number | string;
	status?: string;
	readoutMarkdown?: string;
}

export interface FieldLogSource {
	id: string;
	title: string;
	url?: string;
	path?: string;
	origin?: string;
	coverage?: string;
	recordedAt?: string;
}

export interface FieldLogItem {
	id: string;
	title: string;
	detail?: string;
	status?: string;
}

export interface FieldLogRun {
	id: string;
	runId: number | string;
	instrumentId: string;
	status: string;
	updatedAt: string | null;
	feedback?: string;
	feedbackStatus?: string;
}

export interface FieldLogProjection {
	format: "legacy-markdown" | "field-log/v1";
	title: string;
	openedAt?: string;
	updatedAt?: string;
	openingQuestion: string;
	scope: string;
	reason: string;
	currentQuestion: string;
	synthesis: string | null;
	questions: FieldLogItem[];
	terms: FieldLogItem[];
	tensions: FieldLogItem[];
	plan: FieldLogItem[];
	sources: FieldLogSource[];
	lineage: FieldLogItem[];
	workflow: FieldLogItem[];
	runs: FieldLogRun[];
	entries: FieldLogEntry[];
}

interface EventEnvelope {
	schema?: string;
	eventId?: number;
	type?: string;
	recordedAt?: string;
	actor?: { kind?: string; pointer?: string };
	payload?: Record<string, unknown>;
}

interface MarkdownDocument {
	content: string;
	data: Record<string, unknown>;
}

const SECTION_HEADING = /^## (.+)$/gm;
const SUBSECTION_HEADING = /^### (.+)$/gm;

function parseMarkdownDocument(markdown: string): MarkdownDocument {
	if (!markdown.startsWith("---\n") && !markdown.startsWith("---\r\n")) {
		return { content: markdown, data: {} };
	}

	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
	if (!match) return { content: markdown, data: {} };

	const parsed = YAML.parse(match[1] ?? "");
	return {
		content: markdown.slice(match[0].length),
		data:
			parsed && typeof parsed === "object" && !Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: {},
	};
}

function section(source: string, name: string): string {
	const headings = [...source.matchAll(SECTION_HEADING)];
	const heading = headings.find((match) => match[1]?.trim() === name);
	if (!heading?.index) return "";
	const start = heading.index + heading[0].length;
	const next = headings.find((match) => (match.index ?? 0) > start);
	return source.slice(start, next?.index ?? source.length).trim();
}

function subsections(source: string) {
	const headings = [...source.matchAll(SUBSECTION_HEADING)];
	return headings.map((heading, index) => {
		const start = (heading.index ?? 0) + heading[0].length;
		return {
			title: heading[1]?.trim() ?? "",
			body: source
				.slice(start, headings[index + 1]?.index ?? source.length)
				.trim(),
			offset: heading.index ?? 0,
		};
	});
}

function cleanInline(value: string): string {
	return value
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_`]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function prose(source: string): string {
	return cleanInline(
		source
			.split(/\r?\n/)
			.filter((line) => line.trim() && !line.trim().startsWith("- "))
			.join(" "),
	);
}

function listItems(source: string): string[] {
	return source
		.split(/\r?\n/)
		.filter((line) => /^-\s+/.test(line))
		.map((line) =>
			cleanInline(line.replace(/^-\s+/, "").replace(/^Recorded at:\s*/, "")),
		)
		.filter(Boolean);
}

function labelled(block: string, label: string): string {
	const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = new RegExp(`^- \\*\\*${escaped}:\\*\\*\\s*(.+)$`, "m").exec(
		block,
	);
	return cleanInline(match?.[1] ?? "");
}

function quoted(value: string): string[] {
	return [...value.matchAll(/[“"]([^”"\n]{2,})[”"]/g)]
		.map((match) => match[1]?.trim() ?? "")
		.filter(Boolean);
}

function authorizationComments(value: string): string[] {
	const comments: string[] = [];
	const pattern =
		/(?:the\s+)?user\s+(?:selected(?:\s+it)?(?:\s+in)?|resumed[\s\S]*?\s+with)\s+[“"]([^”"\n]{2,})[”"]/gi;
	for (const match of value.matchAll(pattern)) {
		if (match[1]) comments.push(match[1].trim());
	}
	return comments;
}

function titleCaseInstrument(value: string): string {
	return value
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function timestamp(value: string | undefined): number {
	const parsed = value ? Date.parse(value) : Number.NaN;
	return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function frontmatterDate(value: unknown): string | undefined {
	if (typeof value === "string") return value;
	if (value instanceof Date && !Number.isNaN(value.valueOf()))
		return value.toISOString();
	return undefined;
}

function legacyItems(source: string, prefix: string): FieldLogItem[] {
	return listItems(source).map((value, index) => {
		const split = value.split(/:\s+/, 2);
		return {
			id: `${prefix}-${index + 1}`,
			title: split.length > 1 ? split[0] : value,
			detail: split.length > 1 ? value.slice(split[0].length + 1).trim() : "",
		};
	});
}

function legacyPlan(source: string): FieldLogItem[] {
	return subsections(source).map((item, index) => ({
		id: `plan-${index + 1}`,
		title: cleanInline(item.title),
		detail: labelled(item.body, "Gap") || prose(item.body),
		status: labelled(item.body, "Selection state"),
	}));
}

function legacySources(source: string): FieldLogSource[] {
	return listItems(source).map((value, index) => {
		const url = /https?:\/\/\S+/.exec(value)?.[0]?.replace(/[),.;]+$/, "");
		const description = value
			.replace(/^.*?—\s*/, "")
			.replace(url ?? "", "")
			.trim();
		return {
			id: `source-${index + 1}`,
			title: description || url || `Source ${index + 1}`,
			url,
			origin: description.includes("user") ? "user-supplied" : "field lineage",
			coverage: description.includes("added") ? "collected" : "recorded",
		};
	});
}

function parseLegacyEntries(
	source: string,
	openedAt: string | undefined,
	openedBy: string | undefined,
): FieldLogEntry[] {
	const ledger = section(source, "Instrument ledger");
	const readings = subsections(section(source, "Key readings")).map((item) => ({
		title: cleanInline(item.title),
		recordedAt: labelled(item.body, "Recorded at"),
		summary: labelled(item.body, "Reading"),
	}));
	const entries: Array<FieldLogEntry & { sequence: number }> = [];
	const commentKeys = new Set<string>();
	let completedIndex = 0;

	for (const [index, item] of subsections(ledger).entries()) {
		const heading = /^`([^`]+)`\s+—\s+(.+)$/.exec(item.title);
		if (!heading) continue;
		const instrumentId = heading[1] ?? "instrument";
		const status = cleanInline(heading[2] ?? "");
		const recordedAt = labelled(item.body, "Recorded at") || null;
		const accessDelta = labelled(item.body, "Access delta");
		const reading =
			status === "complete" ? readings[completedIndex++] : undefined;
		const sequence = index * 10;
		const title =
			reading?.title ??
			(accessDelta && !/^(pending|none)\.?$/i.test(accessDelta)
				? accessDelta.split(/(?<=[.!?])\s/)[0]
				: `${titleCaseInstrument(instrumentId)} ${status}`);

		const authorization = labelled(item.body, "Authorization");
		for (const text of authorizationComments(authorization)) {
			const key = `${recordedAt}:${text}`;
			if (commentKeys.has(key)) continue;
			commentKeys.add(key);
			entries.push({
				id: `legacy-comment-${entries.length + 1}`,
				kind: "comment",
				recordedAt,
				title: "Kyle",
				summary: text,
				speaker: "Kyle",
				sequence: sequence - 1,
			});
		}

		entries.push({
			id: `legacy-run-${index + 1}`,
			kind: "instrument",
			recordedAt,
			title,
			summary:
				reading?.summary ||
				accessDelta ||
				labelled(item.body, "Fallback / downgrade") ||
				"No summary was recorded.",
			instrumentId,
			runId: index + 1,
			status,
			readoutMarkdown: `### ${item.title}\n\n${item.body}`,
			sequence,
		});

		const feedback = labelled(item.body, "User feedback");
		for (const text of quoted(feedback)) {
			const key = `${recordedAt}:${text}`;
			if (commentKeys.has(key)) continue;
			commentKeys.add(key);
			entries.push({
				id: `legacy-comment-${entries.length + 1}`,
				kind: "comment",
				recordedAt,
				title: "Kyle",
				summary: text,
				speaker: "Kyle",
				sequence: sequence + 1,
			});
		}
	}

	if (openedBy) {
		const key = `${openedAt}:${openedBy}`;
		if (!commentKeys.has(key)) {
			entries.push({
				id: `legacy-comment-opened`,
				kind: "comment",
				recordedAt: openedAt ?? null,
				title: "Kyle",
				summary: openedBy,
				speaker: "Kyle",
				sequence: 25,
			});
		}
	}

	return entries
		.sort(
			(a, b) =>
				timestamp(a.recordedAt ?? undefined) -
					timestamp(b.recordedAt ?? undefined) || a.sequence - b.sequence,
		)
		.map(({ sequence: _, ...entry }) => entry);
}

export function parseLegacyFieldLog(markdown: string): FieldLogProjection {
	const document = parseMarkdownDocument(markdown);
	const body = document.content;
	const data = document.data;
	const title =
		(typeof data.title === "string" && data.title) ||
		/^# (.+)$/m.exec(body)?.[1] ||
		"Field Log";
	const openedAt = frontmatterDate(data["opened-at"]);
	const updatedAt = frontmatterDate(data["updated-at"]);
	const openedBy =
		typeof data["opened-by"] === "string" ? data["opened-by"] : undefined;
	const workflowText = prose(section(body, "Workflow ledger"));
	const entries = parseLegacyEntries(body, openedAt, openedBy);

	return {
		format: "legacy-markdown",
		title,
		openedAt,
		updatedAt,
		openingQuestion: prose(section(body, "Original question")),
		scope: prose(section(body, "Trip scope and goal")),
		reason: prose(section(body, "Why the field log opened")),
		currentQuestion:
			prose(section(body, "Current working question")) ||
			prose(section(body, "Original question")),
		synthesis: null,
		questions: legacyItems(
			section(body, "Open Questions") ||
				section(body, "Questions to return to"),
			"question",
		),
		terms: legacyItems(
			section(body, "Key Terms") || section(body, "Loaded terms"),
			"term",
		),
		tensions: legacyItems(section(body, "Current tensions"), "tension"),
		plan: legacyPlan(
			section(body, "Open gaps, collection plan, and stop rules"),
		),
		sources: legacySources(section(body, "Field lineage")),
		lineage: legacyItems(section(body, "Field lineage"), "lineage"),
		workflow:
			workflowText && !/^no named workflow/i.test(workflowText)
				? [{ id: "workflow-1", title: workflowText }]
				: [],
		runs: entries
			.filter(
				(
					entry,
				): entry is FieldLogEntry & {
					runId: number | string;
					instrumentId: string;
				} => entry.runId != null && Boolean(entry.instrumentId),
			)
			.map((entry) => ({
				id: `run-${entry.runId}`,
				runId: entry.runId,
				instrumentId: entry.instrumentId,
				status: entry.status ?? "complete",
				updatedAt: entry.recordedAt,
			})),
		entries,
	};
}

function payloadString(
	payload: Record<string, unknown>,
	...keys: string[]
): string {
	for (const key of keys) {
		const value = payload[key];
		if (typeof value === "string") return value;
	}
	return "";
}

function payloadNumber(
	payload: Record<string, unknown>,
	...keys: string[]
): number | undefined {
	for (const key of keys) {
		const value = payload[key];
		if (typeof value === "number") return value;
	}
	return undefined;
}

export function parseEventStream(
	jsonl: string,
	options: { allowIncompleteTrailingLine?: boolean } = {
		allowIncompleteTrailingLine: true,
	},
): EventEnvelope[] {
	const lines = jsonl.split(/\r?\n/);
	const lastNonempty = lines.findLastIndex((line) => line.trim());
	const events: EventEnvelope[] = [];
	for (const [index, line] of lines.entries()) {
		if (!line.trim()) continue;
		let parsed: EventEnvelope;
		try {
			parsed = JSON.parse(line) as EventEnvelope;
		} catch (error) {
			if (
				options.allowIncompleteTrailingLine !== false &&
				index === lastNonempty &&
				!jsonl.endsWith("\n")
			) {
				break;
			}
			throw new Error(`Line ${index + 1} is not valid JSON.`, { cause: error });
		}
		if (!parsed || typeof parsed !== "object")
			throw new Error(`Line ${index + 1} is not an event object.`);
		events.push(parsed);
	}
	return events;
}

export function projectFieldLogEvents(
	events: EventEnvelope[],
): FieldLogProjection {
	const projection: FieldLogProjection = {
		format: "field-log/v1",
		title: "Field Log",
		openingQuestion: "",
		scope: "",
		reason: "",
		currentQuestion: "",
		synthesis: null,
		questions: [],
		terms: [],
		tensions: [],
		plan: [],
		sources: [],
		lineage: [],
		workflow: [],
		runs: [],
		entries: [],
	};
	const questions = new Map<number, FieldLogItem & { role?: string }>();
	const terms = new Map<number, FieldLogItem>();
	const tensions = new Map<number, FieldLogItem>();
	const plan = new Map<number, FieldLogItem>();
	const planOrder: number[] = [];
	const sources = new Map<number, FieldLogSource>();
	const runs = new Map<number, FieldLogRun>();
	const workflows = new Map<number, FieldLogItem>();

	for (const event of events) {
		const payload = event.payload ?? {};
		const type = event.type ?? "";
		if (event.recordedAt) projection.updatedAt = event.recordedAt;

		if (type === "trip.created") {
			projection.title = payloadString(payload, "title") || projection.title;
			projection.openingQuestion = payloadString(
				payload,
				"openingQuestion",
				"question",
			);
			projection.currentQuestion = projection.openingQuestion;
			projection.scope = payloadString(payload, "scope");
			projection.reason = payloadString(payload, "reason", "whyOpened");
			projection.openedAt = event.recordedAt;
		}

		if (type === "trip.context.recorded") {
			const revisedScope = payloadString(payload, "scope", "aim");
			if (revisedScope) projection.scope = revisedScope;
			const note = payloadString(payload, "text", "context");
			if (note) {
				projection.lineage.push({
					id: `lineage-${event.eventId ?? projection.lineage.length + 1}`,
					title: payloadString(payload, "title") || "Context note",
					detail: note,
				});
			}
		}

		if (type === "comment.recorded") {
			projection.entries.push({
				id: `comment-${payloadNumber(payload, "commentId") ?? event.eventId}`,
				kind: "comment",
				recordedAt: event.recordedAt ?? null,
				title: payloadString(payload, "speaker") || "User",
				summary: payloadString(payload, "text", "exactText", "markdown"),
				speaker: payloadString(payload, "speaker") || "User",
				context:
					payloadString(payload, "context", "respondingTo", "prompt") ||
					undefined,
			});
		}

		if (type === "note.recorded") {
			projection.entries.push({
				id: `entry-${payloadNumber(payload, "entryId") ?? event.eventId}`,
				kind: "note",
				recordedAt: event.recordedAt ?? null,
				title: payloadString(payload, "title") || "Field note",
				summary: payloadString(payload, "markdown"),
			});
		}

		if (type === "synthesis.recorded") {
			const markdown = payloadString(payload, "markdown");
			projection.synthesis = markdown;
			projection.entries.push({
				id: `entry-${payloadNumber(payload, "entryId") ?? event.eventId}`,
				kind: "synthesis",
				recordedAt: event.recordedAt ?? null,
				title: payloadString(payload, "title") || "Synthesis",
				summary: markdown,
			});
		}

		if (type === "source.collected") {
			const sourceId = payloadNumber(payload, "sourceId") ?? sources.size + 1;
			sources.set(sourceId, {
				id: `source-${sourceId}`,
				title: payloadString(payload, "title") || `Source ${sourceId}`,
				url: payloadString(payload, "url") || undefined,
				path: payloadString(payload, "path", "artifactPath") || undefined,
				origin: payloadString(payload, "origin") || undefined,
				coverage: "collected",
				recordedAt: event.recordedAt,
			});
			projection.entries.push({
				id: `source-collected-${event.eventId}`,
				kind: "source",
				recordedAt: event.recordedAt ?? null,
				title: payloadString(payload, "title") || `Source ${sourceId}`,
				summary: "Collected for examination.",
				sourceId: `source-${sourceId}`,
			});
		}

		if (type === "source.examined") {
			const sourceId = payloadNumber(payload, "sourceId");
			const source = sourceId ? sources.get(sourceId) : undefined;
			const coverage = payloadString(payload, "coverage") || "examined";
			if (source) source.coverage = coverage;
			projection.entries.push({
				id: `source-examined-${event.eventId}`,
				kind: "source",
				recordedAt: event.recordedAt ?? null,
				title: source?.title ?? `Source ${sourceId ?? ""}`.trim(),
				summary: coverage,
				sourceId: sourceId ? `source-${sourceId}` : undefined,
			});
		}

		if (type.startsWith("workflow.")) {
			const workflowId = payloadNumber(payload, "workflowId");
			if (workflowId) {
				const prior = workflows.get(workflowId);
				const status = type.slice("workflow.".length);
				workflows.set(workflowId, {
					id: `workflow-${workflowId}`,
					title:
						payloadString(payload, "name", "title") ||
						prior?.title ||
						`Workflow ${workflowId}`,
					detail:
						payloadString(payload, "stage", "result", "failure") ||
						prior?.detail,
					status,
				});
			}
		}

		if (type === "question.added" || type === "question.revised") {
			const id = payloadNumber(payload, "questionId") ?? questions.size + 1;
			const prior = questions.get(id);
			questions.set(id, {
				id: `question-${id}`,
				title:
					payloadString(payload, "text", "question") ||
					prior?.title ||
					`Question ${id}`,
				detail: prior?.detail,
				status: payloadString(payload, "status") || prior?.status || "open",
				role: payloadString(payload, "role") || prior?.role || "return-to",
			});
		}
		if (type === "question.answered" || type === "question.removed") {
			const id = payloadNumber(payload, "questionId");
			const item = id ? questions.get(id) : undefined;
			if (item) {
				item.status = type.endsWith("answered") ? "answered" : "removed";
				if (type.endsWith("answered")) {
					item.detail = payloadString(payload, "answer", "reason");
					projection.entries.push({
						id: `question-answered-${event.eventId}`,
						kind: "context",
						recordedAt: event.recordedAt ?? null,
						title: `Question answered: ${item.title}`,
						summary: item.detail,
					});
				}
			}
		}
		if (type === "question.reopened") {
			const id = payloadNumber(payload, "questionId");
			const item = id ? questions.get(id) : undefined;
			if (item) {
				item.status = "open";
				item.detail = payloadString(payload, "reason");
				projection.entries.push({
					id: `question-reopened-${event.eventId}`,
					kind: "context",
					recordedAt: event.recordedAt ?? null,
					title: `Question reopened: ${item.title}`,
					summary: item.detail,
				});
			}
		}

		for (const [prefix, collection] of [
			["term", terms],
			["tension", tensions],
			["plan.item", plan],
		] as const) {
			if (!type.startsWith(`${prefix}.`)) continue;
			const idKey = prefix === "plan.item" ? "planItemId" : `${prefix}Id`;
			const id = payloadNumber(payload, idKey) ?? collection.size + 1;
			if (type.endsWith(".added") || type.endsWith(".revised")) {
				collection.set(id, {
					id: `${prefix.replace(".", "-")}-${id}`,
					title: payloadString(
						payload,
						"title",
						"text",
						prefix === "term" ? "term" : "description",
					),
					detail: payloadString(payload, "definition", "detail"),
					status: payloadString(payload, "status"),
				});
				if (prefix === "plan.item" && !planOrder.includes(id))
					planOrder.push(id);
			} else {
				const item = collection.get(id);
				if (!item) continue;
				if (prefix === "plan.item" && type.endsWith(".moved")) {
					const position = payloadNumber(payload, "position");
					const priorIndex = planOrder.indexOf(id);
					if (priorIndex >= 0) planOrder.splice(priorIndex, 1);
					planOrder.splice(
						position
							? Math.min(position - 1, planOrder.length)
							: planOrder.length,
						0,
						id,
					);
					projection.entries.push({
						id: `plan-moved-${event.eventId}`,
						kind: "context",
						recordedAt: event.recordedAt ?? null,
						title: `Plan moved: ${item.title}`,
						summary:
							payloadString(payload, "reason") ||
							(position
								? `Moved to position ${position}.`
								: "Plan order changed."),
					});
				} else {
					item.status = type.split(".").at(-1);
					if (prefix === "plan.item" && type.endsWith(".completed")) {
						item.detail = payloadString(payload, "result") || item.detail;
						projection.entries.push({
							id: `plan-completed-${event.eventId}`,
							kind: "context",
							recordedAt: event.recordedAt ?? null,
							title: `Plan completed: ${item.title}`,
							summary: item.detail ?? "Completed.",
						});
					}
				}
			}
		}

		if (
			/^instrument\.run\.(selected|prepared|started|completed|failed|stopped)$/.test(
				type,
			)
		) {
			const runId = payloadNumber(payload, "runId");
			if (runId) {
				const status =
					type === "instrument.run.started"
						? "running"
						: type.slice("instrument.run.".length);
				const prior = runs.get(runId);
				runs.set(runId, {
					id: `run-${runId}`,
					runId,
					instrumentId:
						payloadString(payload, "instrumentId") ||
						prior?.instrumentId ||
						"instrument",
					status,
					updatedAt: event.recordedAt ?? null,
				});
			}
		}

		if (type === "instrument.run.completed") {
			const runId = payloadNumber(payload, "runId") ?? event.eventId;
			const entry =
				payload.entry && typeof payload.entry === "object"
					? (payload.entry as Record<string, unknown>)
					: {};
			const readings = Array.isArray(payload.readings)
				? (payload.readings as Array<Record<string, unknown>>)
				: [];
			const authoredReadout = payloadString(entry, "markdown");
			const accessDelta = payloadString(payload, "accessDelta");
			projection.entries.push({
				id: `entry-${payloadNumber(entry, "entryId") ?? event.eventId}`,
				kind: "instrument",
				recordedAt: event.recordedAt ?? null,
				title:
					payloadString(entry, "title") ||
					payloadString(payload, "instrumentId") ||
					`Instrument run ${runId}`,
				instrumentId: payloadString(payload, "instrumentId"),
				runId,
				status: "completed",
				summary:
					payloadString(entry, "summary") ||
					accessDelta ||
					readings.map((reading) => payloadString(reading, "text")).join(" "),
				readoutMarkdown:
					authoredReadout ||
					[
						`# ${payloadString(entry, "title") || payloadString(payload, "instrumentId")}`,
						accessDelta,
						...readings.map((reading) => payloadString(reading, "text")),
						payloadString(payload, "control"),
						payloadString(payload, "artifactRisk"),
						payloadString(payload, "unmeasured"),
					]
						.filter(Boolean)
						.join("\n\n"),
			});
		}

		if (type === "instrument.feedback.recorded") {
			const runId = payloadNumber(payload, "runId");
			const run = runId ? runs.get(runId) : undefined;
			if (run) {
				run.feedback = payloadString(payload, "text", "feedback");
				run.feedbackStatus = payloadString(payload, "status", "kind");
				run.updatedAt = event.recordedAt ?? run.updatedAt;
			}
		}

		if (type === "instrument.run.failed" || type === "instrument.run.stopped") {
			const status = type.endsWith("failed") ? "failed" : "stopped";
			projection.entries.push({
				id: `run-${payloadNumber(payload, "runId") ?? event.eventId}`,
				kind: "instrument",
				recordedAt: event.recordedAt ?? null,
				title:
					payloadString(payload, "title", "instrumentId") ||
					`Instrument ${status}`,
				summary: payloadString(payload, "reason", "error", "residue"),
				instrumentId: payloadString(payload, "instrumentId"),
				runId: payloadNumber(payload, "runId"),
				status,
				readoutMarkdown: payloadString(payload, "markdown", "residue"),
			});
		}

		if (type === "engine.result.recorded") {
			const summary = payloadString(payload, "markdown", "text", "result");
			projection.synthesis = summary;
			projection.entries.push({
				id: `engine-${event.eventId}`,
				kind: "engine",
				recordedAt: event.recordedAt ?? null,
				title: payloadString(payload, "title") || "Synthesis",
				summary,
			});
		}
	}

	projection.questions = [...questions.values()].filter(
		(item) => item.status === "open" && item.role !== "current",
	);
	const current = [...questions.values()].find(
		(item) => item.role === "current" && item.status === "open",
	);
	const hasCurrentQuestionRecord = [...questions.values()].some(
		(item) => item.role === "current",
	);
	projection.currentQuestion = hasCurrentQuestionRecord
		? (current?.title ?? "")
		: projection.openingQuestion;
	projection.terms = [...terms.values()].filter(
		(item) => item.status !== "removed",
	);
	projection.tensions = [...tensions.values()].filter(
		(item) => item.status !== "removed",
	);
	projection.plan = planOrder
		.map((id) => plan.get(id))
		.filter(
			(item): item is FieldLogItem =>
				Boolean(item) && item?.status !== "removed",
		);
	projection.sources = [...sources.values()];
	projection.runs = [...runs.values()];
	projection.workflow = [...workflows.values()];
	projection.entries.sort(
		(a, b) =>
			timestamp(a.recordedAt ?? undefined) -
			timestamp(b.recordedAt ?? undefined),
	);
	return projection;
}

export function projectFieldLog(
	markdown: string,
	jsonl?: string | null,
): FieldLogProjection {
	if (jsonl?.trim()) return projectFieldLogEvents(parseEventStream(jsonl));
	return parseLegacyFieldLog(markdown);
}
