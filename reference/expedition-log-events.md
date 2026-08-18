# Expedition Log writer and events

Read this file before creating or mutating a compound Expedition Log.

## Commands

Resolve `<skill-root>` as the directory containing `SKILL.md`.

```text
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js init <expedition> --json '<event>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js append <expedition> --json '<event-or-array>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js join <expedition> <trip> --json '<authority>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js promote <expedition> --trip <ID> --entry <ID> [--readout <ID>] --rationale '<text>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js replace <expedition> --promotion <ID> --trip <ID> --entry <ID> [--readout <ID>] --rationale '<text>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js remove <expedition> --promotion <ID>
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js validate <expedition>
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js render <expedition>
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js link <expedition> [--promotion <ID>]
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js inspect <expedition>
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js search <expedition> --query '<text>'
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js read <expedition> --trip <ID> (--entry <ID> | --readout <ID> | --source <ID>)
```

`manifest` is an alias for `inspect`. It is a reader, not an evidence audit. It
reports explicit log state and makes no coverage judgment.

Use `--json` for normal writes. `--file` and stdin are available when shell
quoting makes inline JSON unsafe. The writer assigns event, trip, and promotion
IDs and all timestamps. A receipt may include `projectionWarning` when JSONL
committed but Markdown replacement failed. Do not repeat the append; run
`expedition-log render`.

## Event envelope

Generic `init` and `append` events use:

```json
{
  "type": "entry.promoted",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "authorization": {
    "kind": "artifact-consent",
    "pointer": "user-turn",
    "verbatim": "Create the shared Expedition."
  },
  "payload": {}
}
```

`type`, `actor.kind`, and `payload` are required. Never submit `schema`,
`eventId`, `recordedAt`, `tripId` on `trip.joined`, or `promotionId` on
`entry.promoted`; the writer assigns them.

Artifact consent is required for `expedition.created` and `trip.joined`.
Promoting, replacing, and removing entries follow the ordinary Field Lab
authority rules; they add no new approval gate.

## Events

### `expedition.created`

Must be the first and only creation event.

```json
{
  "type": "expedition.created",
  "actor": {"kind": "orchestrator"},
  "authorization": {
    "kind": "artifact-consent",
    "pointer": "user-turn",
    "verbatim": "Give these Field Trips a shared Expedition."
  },
  "payload": {
    "title": "Postgres systems",
    "territory": "How the systems differ and what transfers between them.",
    "openedAt": "2026-07-30T12:19:15-06:00"
  }
}
```

Omit `openedAt` for a new Expedition. During a legacy migration, an agent may
copy the old index's exact ISO 8601 opening timestamp into `payload.openedAt`.
The event's own `recordedAt` remains writer-assigned and records the migration.

### `expedition.title.updated`

Requires `payload.title`. It changes the current projection without rewriting
the opening event.

### `trip.joined`

Use the `join` command rather than appending this event yourself. It moves a
standalone trip under `field-trips/`, validates both logs, records the relative
member path in the Expedition, and records `trip.expedition.joined` in the
Field Log. Joining is intentionally a small two-log operation, not a database
transaction. The command is safe to retry when either side already contains
the matching membership pointer. It rejects a Field Log that points to another
Expedition.

### `entry.promoted`

Use `promote` or `replace`. The source entry must already exist in the named
member Field Log. Required payload fields are `tripId`, `entryId`, and
`rationale`. `runId` and `replacesPromotionId` are optional. The CLI assigns
`promotionId`.

A replacement may target only a current promotion. It keeps the target's
display position and makes the old promotion absent from current projections.

### `entry.removed`

Use `remove`. It requires the ID of a current promotion. The event stays in
JSONL while the promotion disappears from the Markdown, inspection output, and
promotion search.

## Integrity

The writer validates the whole stream before each append. Member paths and trip
IDs are unique. Promotions must point to member trips and existing Field Log
entries. Replacements and removals must point to current promotions. The
renderer always reads titles, scopes, timestamps, and promoted text from the
authoritative Field Logs.
