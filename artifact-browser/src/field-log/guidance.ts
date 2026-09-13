/** Writer-owned reminders, never assembled from user/source prose. */
export const stateWriteHelp = {
	append:
		"For prose, use one shell call with a quoted heredoc: append <directory> --expected-event <latestEventId> <<'JSON'\n<event-array>\nJSON\nThis accepts JSON on stdin without shell interpolation or apostrophe escaping. --json/--file are also supported; never change punctuation to fit shell quotes.",
	envelope:
		"Each event: {type, actor: {kind: 'user' or 'orchestrator', pointer?: known turn/task pointer}, payload}. The writer assigns new IDs, timestamps, and schema. Use returned numeric IDs for existing entities.",
	interviewEvents: {
		"comment.recorded":
			"Exact text copied from the user's message, preserving every apostrophe, quote, newline, and Unicode character; never polish punctuation. optional speaker and factual context. actor.kind=user.",
		"trip.context.recorded":
			"Complete scope, only when the user's aim or constraints changed.",
		"question.answered": "Existing questionId and answer, only when answered.",
		"question.revised":
			"Existing questionId and text or role. role=return-to parks an unresolved current question.",
		"question.added":
			"text and role=current or return-to. Answer or park the old current question first in the same batch.",
	},
	reminder:
		"For an already-started interview, read its card if missing, record the exact comment once, batch only changed facts, and continue its questioning within the recorded aim. Before appending, compare comment text with the user's message and ensure the saved current question matches the question you will ask. For a follow-up seeking an unresolved answer, revise that question's text; for a new question, answer or park the old one and add the new current question. No extra feedback copy unless the user evaluates the instrument. No separate control log or routine validate/render. New operations, completion, research, phase gates, or uncertain authority require the full relevant procedure. These reminders grant no authority.",
	recovery:
		"Read truncated or missing entries with read --entry/--event; inspect gives full metadata/index. If append reports stale state, delta --since <last-known-ID>, follow nextEventId while hasMore, and reassess before retrying.",
};

export function mutationReminder(projectionWarning?: string): string {
	return projectionWarning !== undefined
		? "Events committed. Do not repeat the append. Run render to repair Markdown; reuse the returned IDs."
		: "Saved and rendered. Reuse latestEventId and any returned entities for the next write and entry links; no extra validate, render, inspect, or second log is needed. Follow the user's selected work and existing gates.";
}
