# Field Trip

A Field Trip is one bounded inquiry with a Field Log. It begins when the user
agrees to set up the log. The log changes what gets recorded, not who chooses
the work. It does not authorize an instrument, workflow, synthesis, conclusion,
decision, plan, or action.

## Entry

Enter only after `SKILL.md` routes the inquiry here and the user agrees to set
up a Field Log. Do not infer agreement from the inquiry's length, cost, or
importance. Preserve the original question and every answer already available;
ask only for missing facts that would change setup.

Before writing, read [field-log-events.md](field-log-events.md) in full.

## Runtime

Resolve `<skill-root>` as the directory containing `SKILL.md`. The skill ships
the reader and writer under `<skill-root>/artifact-browser`.

Use the built Node scripts directly:

```text
node <skill-root>/artifact-browser/dist/field-log-cli/index.js
node <skill-root>/artifact-browser/dist/expedition-log-cli/index.js
node <skill-root>/artifact-browser/dist/field-lab-cli/index.js
node <skill-root>/artifact-browser/dist/cli/index.js
```

If either script is missing, build once:

```bash
pnpm --dir <skill-root>/artifact-browser build
```

Do not install or globally link these CLIs.

## Start an Expedition member in one call

When the Expedition, scope, initiating comment, and inherited context are
already chosen, use the orchestration command instead of coordinating the two
writers by hand:

```text
node <skill-root>/artifact-browser/dist/field-lab-cli/index.js trip start \
  --expedition <expedition-directory> \
  --slug <trip-slug> \
  --input <start.json> \
  --reader
```

Use `--open` in place of `--reader` when the system browser should also open.
In Codex, prefer `--reader`, then open the returned URL in the integrated
browser. `--context` and `--file` are aliases for `--input`.

The input owns the choices the CLI must not make:

```json
{
  "operationId": "optional-stable-retry-id",
  "actor": {"kind": "orchestrator", "pointer": "current-task"},
  "authorization": {
    "kind": "artifact-consent",
    "pointer": "user-turn",
    "verbatim": "Add this inquiry to the Expedition."
  },
  "trip": {
    "title": "Reactive API design",
    "openingQuestion": "What should a reactive API expose?",
    "scope": "Inspect API shapes without choosing a product strategy."
  },
  "events": [
    {
      "type": "comment.recorded",
      "actor": {"kind": "user", "pointer": "user-turn"},
      "payload": {
        "speaker": "Kyle",
        "text": "Add this inquiry to the Expedition."
      }
    }
  ]
}
```

The first event must preserve the initiating user comment. Later events may
carry the selected scope, prior comments, questions, and plan. The command
validates the Expedition, creates the Field Log in its final member directory,
appends the prepared events, records membership in both streams, rebuilds both
Markdown projections, and validates both histories. With `--reader` or
`--open`, it starts or reuses the trip-named tmux reader against the Expedition
and selects the new Field Log.

The JSON result includes the trip ID, paths, warnings, reader URL when
requested, and `.field-lab-trip-start.json`. That file is a recovery receipt,
not canonical inquiry history. Retry the same command and input after a partial
failure. The operation resumes completed steps and never rolls history back.

## Set up the Field Log

Use a narrow standalone directory such as `field-trip-<topic>/`, or place the
trip at `<expedition>/field-trips/<trip>/`. The directory will contain:

- `field_log.jsonl`, the canonical append-only event stream;
- `field_log.md`, a generated portable diary;
- ordinary source and artifact files when the trip creates or copies them.

Initialize the directory with one `trip.created` event through the writer. Then
append the user's exact authorizing comment and any inherited context, current
question, sources, terms, tensions, or selected plan items. Use one inline JSON
array when several events belong to the same turn.

Every user-gated event must include the event's allowed authorization kind, a
pointer to the authorizing user turn, and the user's exact words in
`authorization.verbatim`. The quote is evidence of the authority boundary; do
not replace the full `comment.recorded` journal entry with it.

The CLI assigns timestamps and every sequential event, entity, run, and entry
ID. Do not supply them. It validates the whole proposed history before writing,
appends JSONL while holding the trip lock, and regenerates Markdown. A rejected
command changes neither file; correct the event and run it again. If a success
receipt includes `projectionWarning`, the events committed. Do not repeat them;
run the render command to repair Markdown from canonical history.

Never write either Field Log file by hand. `field_log.md` owns no state and may
be overwritten during every successful append or recovery.

## Open the live reader

After initialization, derive the reader session name from the Field Trip
directory basename:

```text
artifact-browser-<field-trip-name>
```

Replace characters outside letters, numbers, underscores, and hyphens with
hyphens. This name must follow the Field Trip name so a later session can find
and reuse the right reader.

Check whether `tmux` is installed. When it is, start the reader in a detached
tmux session against the trip directory:

```bash
tmux new-session -d -s artifact-browser-<field-trip-name> \
  "node <skill-root>/artifact-browser/dist/cli/index.js <trip-directory> --no-open"
tmux capture-pane -p -t artifact-browser-<field-trip-name>
```

If the named tmux session already exists, do not start a duplicate. Capture its
pane to recover the live URL and confirm that its reader still runs. Tell the
user that tmux keeps the reader alive when the Codex terminal closes or the
computer sleeps, but not across a reboot.

When `tmux` is not installed, start the reader in the foreground:

```bash
node <skill-root>/artifact-browser/dist/cli/index.js <trip-directory> --no-open
```

Tell the user that this foreground reader must be relaunched whenever its
terminal ends. Recommend tmux and offer to install or set it up for them. On
native Windows, explain that tmux requires WSL before offering that setup.

The server chooses open loopback ports and prints a capability-bearing URL.
In Codex, open the printed URL in the integrated browser when available;
otherwise give the URL to the user. Never store its port or capability in the
Field Log.

The orchestrator owns the live URL. When a writer receipt returns `entryId`,
`runId`, or `relativeHref`, preserve the printed URL's `cap` parameter and link
the user to:

```text
<live-url>&entry=entry-<entryId>&readout=<runId>
```

Omit `readout` when the entry has none. Do not replace the live URL's whole
query string with `relativeHref`, because that would discard the capability.

## Run the trip

Keep the canonical router, selected queue, and authority boundary from
`SKILL.md`.

- Record every substantive user comment, correction, choice, observation, or
  reaction exactly. When it causes a state change, append the comment and
  related domain event in one batch.
- Keep at most one open question with `role: "current"`. When the focus changes,
  demote the old question to `return-to`, answer it, or remove it before adding
  the new current question in the same batch.
- When a comment sharpens or redirects the inquiry, append
  `trip.context.recorded` with `scope` set to a complete, current statement of
  the aim. Write the whole aim, not only the latest change. Batch it with the
  exact comment that supports it. Refresh a provisional opening scope as soon
  as the user's purpose and constraints become clear.
- When the exact comment depends on the question, choice, claim, or passage it
  answers, add a short factual `context` field. Keep the user's exact words in
  `text`; never fold agent-written framing into the quotation.
- Register a source when it enters scope. Record examination separately and
  state the exact pages, sections, spans, query, or other coverage. Collection
  never implies reading. These events form the source record; the reader folds
  consecutive source activity into one quiet journal item. Give local sources
  their absolute path. The writer makes a durable trip-local copy when that
  path is under Desktop, Downloads, or the operating system's temporary
  directory; do not copy those files by hand.
- When the user supplies a source during an authorized operation, register it,
  inspect the relevant supplied material before the next substantive question,
  and record the examination coverage. Let that reading guide later questions
  inside the operation. A supplied source authorizes reading that source, not
  wider research. If access fails, state the limit before continuing.
- Record every selected instrument run. Add `prepared` or `started` events only
  when they preserve a meaningful baseline, control, execution boundary, or
  handoff.
- Record a completed run with its bounded structured readings and full
  long-form Markdown readout. Give its diary entry a short summary that stands
  on its own and links the detailed readout in the UI. Name the source trail
  only at the useful level: what was examined, what it made visible, and the
  main limit. Do not restate every source event in the prose summary.
- When the user asks Kit to save an explanation or other standalone prose that
  is neither an instrument reading nor a synthesis, use `note.recorded`.
- Record failed execution as `instrument.run.failed` and an intentional halt or
  satisfied stop rule as `instrument.run.stopped`. Neither is a reading.
- Record user-fit, world-fit, or action-fit feedback without treating agreement
  as world evidence.
- Let any orchestrator or subagent call the writer, but require all of them to
  use the same CLI. The lock serializes concurrent calls; no agent may bypass it
  with direct file writes.
- After a successful append that creates a diary entry, post its live link in
  chat rather than repeating the entry or full readout. Once the trip is on
  disk, the browser is the normal human reading surface.

Agreement to create the log authorizes recording only. Run instruments,
research, workflows, and engine work only when the user has selected or
explicitly requested them under `SKILL.md`.

## Write as a field caddy

Imagine keeping a scientific notebook for fellow researchers back home. A new
reader may encounter it years later or quote it in a journal article, history,
or memoir.

Use Alexander von Humboldt as the exemplar: join exact observation to vivid
accounts of movement, encounter, and discovery without imitating his period
style. Write as a present, observant companion, not as a build system or audit
log. Each diary entry should:

- identify the concrete specimen, passage, event, failure, or change examined;
- state what the bounded operation made visible;
- say why it bears on the current question;
- preserve the main uncertainty or open question;
- separate observation, supplied evidence, inference, and user testimony;
- contain enough exact detail for a distant reader to recognize the same
  phenomenon elsewhere.

Never invent a scene, sensation, emotion, surprise, or drama. Keep lifecycle
names, schemas, and validation detail in the structured readout unless the
reader needs them to understand what happened.

This narrative frame grants no synthesis authority. Place one run in the known
sequence, but do not combine findings, declare the trip's meaning, rank results,
or produce a conclusion unless the user explicitly requests that task. Only an
authorized `synthesis.recorded` event may update the Field Log's synthesis, and
its authorization must point to and quote the explicit user request.

## Plans and workflows

A simple Field Trip may have only a scope and log. When it needs a collection
plan, let the user select, trim, or reorder it. Record selected work and its
coverage condition; keep mere offers in conversation.

A Field Trip may use no named workflow or one or more user-selected workflows.
Selecting the trip does not select a workflow. Read
[dialectic-workflow.md](dialectic-workflow.md) when the user selects the full
Electric Monk dialectic.

## Re-entry and recovery

A Field Trip has no terminal status. The user may return whenever new evidence,
questions, or purposes arise.

On re-entry, read `field_log.jsonl` through the writer's validation command to
reconstruct every state machine:

```bash
node <skill-root>/artifact-browser/dist/field-log-cli/index.js validate <trip-directory>
```

If the JSONL stream is valid but the Markdown projection is missing or stale,
overwrite it from canonical history:

```bash
node <skill-root>/artifact-browser/dist/field-log-cli/index.js render <trip-directory>
```

Then launch a fresh reader session. Historical browser ports and capabilities
do not matter.

## Expedition membership

A Field Trip may stand alone or belong to an Expedition. Use `expedition-log
join` to move a standalone trip under the Expedition and write lineage pointers
to both logs. Do not move it or edit either projection by hand.

When this is a new trip inside an Expedition, read `expedition_log.md` as the
first tool call. Its promoted entries are orientation, not inherited truth.
Use `inspect`, `search`, and `read` to open member Field Logs and sources at the
depth the inquiry needs.

Promote only an entry that already exists in this Field Log. Give every
promotion a short rationale. A later trip may replace or remove a promotion;
that changes the current Expedition projection without erasing canonical event
history.
