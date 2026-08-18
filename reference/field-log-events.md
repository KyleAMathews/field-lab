# Field Log writer and events

Read this file before creating or mutating a compound Field Log.

## Contents

1. [Commands](#commands)
2. [Submitted event envelope](#submitted-event-envelope)
3. [IDs, batching, and receipts](#ids-batching-and-receipts)
4. [Event transitions](#event-transitions)
5. [Payloads the reader projects](#payloads-the-reader-projects)
6. [Instrument completion](#instrument-completion)
7. [Custom instrument validation](#custom-instrument-validation)

## Commands

Resolve `<skill-root>` as the directory containing `SKILL.md`.

```text
node <skill-root>/artifact-browser/dist/field-log-cli/index.js init <trip-directory> --json '<event>'
node <skill-root>/artifact-browser/dist/field-log-cli/index.js append <trip-directory> --json '<event-or-array>'
node <skill-root>/artifact-browser/dist/field-log-cli/index.js validate <trip-directory>
node <skill-root>/artifact-browser/dist/field-log-cli/index.js render <trip-directory>
node <skill-root>/artifact-browser/dist/field-log-cli/index.js link <trip-directory> --entry <entry-id> [--readout <run-id>]
node <skill-root>/artifact-browser/dist/field-log-cli/index.js inspect <trip-directory>
node <skill-root>/artifact-browser/dist/field-log-cli/index.js search <trip-directory> --query '<text>'
node <skill-root>/artifact-browser/dist/field-log-cli/index.js read <trip-directory> (--entry <ID> | --readout <ID> | --source <ID>)
node <skill-root>/artifact-browser/dist/field-log-cli/index.js rename <trip-directory> '<new title>'
```

`inspect` returns current metadata, questions, sources, runs, and compact
journal entries; it omits full readouts. `search` returns structured hits from
all events, full readouts, and collected source files. Source hits distinguish
`collected` from `examined`. `read` returns one selected entry, readout, or
source in full.

Use `--json` for normal writes, including long Markdown serialized as a JSON
string. `--file` and stdin are available only when shell quoting or an unusually
large event makes inline JSON unsafe.

The CLI prints one JSON receipt on success and one JSON error on failure.
Validation and staging errors happen before the canonical append: correct the
input and call it again. A receipt may include `projectionWarning` when JSONL
committed but the generated Markdown could not be replaced. Do not repeat that
append; run `field-log render` to repair the reading copy.

## Submitted event envelope

Submit this shape:

```json
{
  "type": "question.added",
  "actor": {
    "kind": "orchestrator",
    "pointer": "current-task"
  },
  "authorization": {
    "kind": "user-selection",
    "pointer": "user-turn",
    "verbatim": "Keep that as the current question."
  },
  "payload": {
    "text": "What evidence would distinguish these accounts?",
    "role": "current"
  }
}
```

Required:

- `type`
- `actor.kind`
- `payload`, even when empty

Use `actor.pointer` when a task, agent, source, or turn pointer is available.
Use `authorization` when the event records a user-gated operation. It must
include the user's exact authorizing words in `verbatim`; a summary or agent
paraphrase is invalid. Keep the matching `comment.recorded` event as well when
the comment is substantive—the authorization quote is an audit field, not a
replacement for the journal.

Never submit `schema`, `eventId`, `recordedAt`, generated entity IDs, or
`entry.entryId`. The writer assigns them.

Authorization is mechanically required with these exact kinds:

- `trip.created`: `artifact-consent`
- `instrument.run.selected`: `user-selection`
- `source.publication.authorized`: `publication-consent`
- `workflow.selected`: `user-selection`
- `synthesis.recorded`: `user-request`
- `plan.item.removed`: `user-request`

Artifact consent, instrument selection, workflow selection, and synthesis or
action authority are different permissions. Point to the one that supports the
event.

For every gated event, `authorization.pointer` must point to the user turn and
`authorization.verbatim` must quote the exact text that granted that specific
authority. Workflow progress, instrument completion, or general permission to
keep a Field Log is not enough.

## IDs, batching, and receipts

The writer assigns one-based sequential `eventId`, `commentId`, `sourceId`,
`runId`, `entryId`, `questionId`, `termId`, `tensionId`, `planItemId`, and
`workflowId` values.

Within one submitted array, an event that creates an entity may be followed by
events for that entity without an explicit ID. The writer infers the most
recent ID of that kind:

```json
[
  {
    "type": "instrument.run.selected",
    "actor": {"kind": "orchestrator"},
    "authorization": {
      "kind": "user-selection",
      "pointer": "user-turn",
      "verbatim": "Run the term scan."
    },
    "payload": {"instrumentId": "term-scan"}
  },
  {
    "type": "instrument.run.completed",
    "actor": {"kind": "orchestrator"},
    "payload": {
      "instrumentId": "term-scan",
      "entry": {
        "summary": "The word changes standards midway through the argument.",
        "markdown": "## Bounded reading\n\nThe word **open** names..."
      }
    }
  }
]
```

For a later call, use the ID returned by the earlier receipt. A completion
receipt may contain:

```json
{
  "eventIds": [8],
  "runId": 2,
  "entryId": 3,
  "relativeHref": "?file=field_log.md&entry=entry-3&readout=2"
}
```

The writer validates the old stream plus the whole proposed batch before
appending. Batch related facts when they must succeed or fail together.

## Event transitions

`trip.created` opens the stream once. After it, the trip stream accepts
`trip.context.recorded`, `trip.title.updated`, `trip.expedition.joined`,
`comment.recorded`, `note.recorded`,
`synthesis.recorded`, and legacy `engine.result.recorded` events.

Sources:

```text
source.collected → source.examined
```

A source may be examined more than once.

Instrument runs:

```text
instrument.run.selected
  → instrument.run.prepared
  → instrument.run.started
  → instrument.run.completed | instrument.run.failed | instrument.run.stopped
```

`prepared` and `started` are optional. A selected run may complete, fail, or
stop directly. `instrument.feedback.recorded` is valid before or after any
terminal outcome and does not change run state.

Questions:

```text
question.added
  → question.revised*
  → question.answered
  → question.reopened
```

An open or answered question may be removed. Removed questions do not reopen.

Terms:

```text
term.added → term.revised* → term.removed
```

Tensions:

```text
tension.added → tension.revised* → tension.resolved → tension.reopened
```

A live or resolved tension may be removed.

Plan items:

```text
plan.item.added → plan.item.moved* → plan.item.completed
```

Open or completed items may move or be removed.

Workflows:

```text
workflow.selected → workflow.started → workflow.paused → workflow.resumed
workflow.started → workflow.completed | workflow.failed
```

Selected workflows may fail before starting. Completed and failed workflows are
terminal.

There is no Field Trip completion state. A valid log remains open to later
evidence and events.

## Payloads the reader projects

Unknown payload keys remain in JSONL but do not appear in the generic reader.
Use these keys for the shared dashboard and journal.

### Trip, comments, notes, and synthesis

- `trip.created`: `title`, `openingQuestion`, `scope`, `reason`; migration may
  preserve an old log's exact ISO 8601 timestamp in `openedAt`
- `trip.title.updated`: `title`; use `field-log rename` rather than rewriting
  the opening event
- `trip.expedition.joined`: relative `path` to the Expedition's generated log
- `trip.context.recorded`: optional `title` plus `text` or `context`; use
  `scope` (or `aim`) to replace the dashboard's current overall aim
- `comment.recorded`: `speaker`, exact `text`; optional `context`, `role`, and
  related IDs
- `note.recorded`: optional `title`; required `markdown`; optional related IDs
- `synthesis.recorded`: optional `title`; required `markdown`; direct
  user-request authorization

Use `note.recorded` when the user asks Kit to save an explanation, orientation,
observation, or other standalone prose that is not an instrument reading and
does not combine the trip's findings. It creates a chronological journal entry
and never changes the Synthesis dashboard.

```json
{
  "type": "note.recorded",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "payload": {
    "title": "How to read the Design Grammar",
    "markdown": "Begin with the **frozen baseline**, then test the primitives..."
  }
}
```

Use `synthesis.recorded` only after the user explicitly requests synthesis:

```json
{
  "type": "synthesis.recorded",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "authorization": {
    "kind": "user-request",
    "pointer": "user-turn",
    "verbatim": "Synthesize these readings."
  },
  "payload": {
    "title": "Synthesis",
    "markdown": "Across the selected readings..."
  }
}
```

The writer assigns `entryId` to both events and returns a journal link.

When the user sharpens or redirects the trip, batch their exact comment with a
`trip.context.recorded` event. Its `scope` must be a full standalone statement
of the current aim, not a delta or process note:

```json
[
  {
    "type": "comment.recorded",
    "actor": {"kind": "user", "pointer": "user-turn"},
    "payload": {
      "speaker": "Kyle",
      "text": "Interesting flours first."
    }
  },
  {
    "type": "trip.context.recorded",
    "actor": {"kind": "orchestrator", "pointer": "current-task"},
    "payload": {
      "title": "Flour-first direction",
      "scope": "Find unusual, obtainable flours and match each to yeast breads worth practicing.",
      "text": "The user chose to begin with interesting flours."
    }
  }
]
```

This updates the overview without changing the opening question or inventing a
synthesis. A later correction may replace the aim again.

Use `context` when the exact words would not make sense to a later reader on
their own. State the question, choice, claim, or draft passage the user was
responding to. Keep it short and factual:

```json
{
  "type": "comment.recorded",
  "actor": {"kind": "user", "pointer": "user-turn"},
  "payload": {
    "speaker": "Kyle",
    "text": "Yes, but only for source documents.",
    "context": "In response to whether every collected file should appear in the source shelf."
  }
}
```

`text` is always the user's verbatim wording. `context` is agent-written
framing, never part of the quotation. Do not paraphrase, polish, or silently
expand the user's words.

Append the exact initiating user comment immediately after `trip.created`.

### Sources

- `source.collected`: `title`; `url` and/or `path`; `origin`; optional author,
  publisher, media type, provenance, limits, and related IDs
- `source.examined`: `sourceId`, `coverage`; optional method and limits
- `source.publication.authorized`: `sourceId`; `publication-consent`
  authorization with the user's exact words

Use an absolute path for a local source outside the trip directory. The writer
copies files from Desktop, Downloads, and the operating system's temporary
directory into `sources/<sourceId>-<filename>`. It stores that relative path in
`path` and preserves the submitted location in `originalPath` and `origin`.
Stable external files remain absolute references.

Collection means the source entered scope, not that anyone read it or agreed to
publish its bytes. Sources created inside the Field Trip directory ship with
its static package. Files copied from a transient location still require a
matching `source.publication.authorized` event because moving the bytes does not
grant publication rights. Without that event, the package keeps only the source
metadata already present in JSONL. Stable external files follow the same rule.

The JSONL keeps every collection and examination event. The generic journal
groups consecutive source activity and the Source shelf shows only the three
most recent records; the Artifacts view exposes the complete source index.

### Questions

- `question.added`: `text`, `role` (`current` or `return-to`)
- `question.revised`: `questionId`; optional `text` and `role`
- `question.answered`: `questionId`, `answer` or `reason`
- `question.reopened`: `questionId`, `reason`
- `question.removed`: `questionId`, optional `reason`

Exactly zero or one open question may have `role: "current"`; the writer
rejects any event that would create two. Before adding a new current question,
revise the old one to `role: "return-to"`, answer it, or remove it. Put that
handoff before the new question in the same batch so every event leaves a valid
state.

### Terms, tensions, and plan

- `term.added` or `term.revised`: `term` or `title`; `definition` or `detail`
- `term.removed`: `termId`
- `tension.added` or `tension.revised`: `title` or `description`; `detail`
- `tension.resolved`, `tension.reopened`, or `tension.removed`: `tensionId`;
  include the bounded reason or evidence
- `plan.item.added`: `title`, `detail`, optional `status`
- `plan.item.moved`: `planItemId`, optional one-based `position`, `reason`
- `plan.item.completed`: `planItemId`, `result`
- `plan.item.removed`: `planItemId`, `reason`, authorization

### Workflow and legacy engine events

- `workflow.selected`: `name` or `title`; optional workflow card and scope
- later workflow events: `workflowId`; include stage, gate, result, or failure
  fields that matter to the named workflow
- `engine.result.recorded`: legacy `title`, `markdown` event retained so
  existing Field Logs validate and render

Do not emit new `engine.result.recorded` events. Use `synthesis.recorded` for
explicitly requested synthesis and `note.recorded` for standalone saved prose.
Other requested-task results need their own explicit event contract rather than
using synthesis as a fallback.

## Instrument completion

Selection:

```json
{
  "type": "instrument.run.selected",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "authorization": {
    "kind": "user-selection",
    "pointer": "user-turn",
    "verbatim": "Run the substrate map."
  },
  "payload": {
    "instrumentId": "substrate-map"
  }
}
```

Completion:

```json
{
  "type": "instrument.run.completed",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "payload": {
    "runId": 1,
    "instrumentId": "substrate-map",
    "accessDelta": "The handoff split into a write path and a read path.",
    "readings": [
      {
        "kind": "observation",
        "confidence": "solid",
        "text": "The writer appends JSONL before replacing Markdown.",
        "support": "source-2, writer transaction"
      }
    ],
    "control": "Static code does not establish the runtime delivery order.",
    "artifactRisk": "The map may make sequential code look like observed timing.",
    "unmeasured": "Watcher-to-browser delivery order was not traced.",
    "entry": {
      "title": "One append crosses two handoff chains",
      "summary": "The stored record separates mutation from browser projection.",
      "markdown": "# One append crosses two handoff chains\n\nThe exact writer path..."
    }
  }
}
```

The writer supplies `observedAt` when completion records an immediate
observation. Provide a known historical `observedAt` only when a source gives
it.

`entry.summary` is the compact chronological diary entry. `entry.markdown` is
the complete human-readable readout shown in the drawer. The structured payload
preserves typed readings, support, control, artifact risk, and unmeasured
remainder. Do not make the summary stand in for the readout.

For failure or an intentional stop, use `reason`, `error`, or `residue` and
optional `markdown`. Do not claim `accessDelta` or readings.

Feedback:

```json
{
  "type": "instrument.feedback.recorded",
  "actor": {"kind": "user", "pointer": "user-turn"},
  "payload": {
    "runId": 1,
    "kind": "user-fit",
    "text": "The second handoff is the part I care about."
  }
}
```

## Custom instrument validation

An instrument card may define inline JSON Schema in its frontmatter:

```yaml
event_schemas:
  instrument.run.completed:
    payload_path: readings
    schema:
      type: array
      minItems: 1
      items:
        type: object
        required: [kind, confidence, text]
```

Set `payload.instrumentCard` to a path relative to the trip directory when the
card is local. For a built-in instrument, `instrumentId` resolves its canonical
card under `<skill-root>/reference/instruments/` when present.

Custom validation supplements the common envelope and XState transitions. It
does not permit a new top-level event type.
