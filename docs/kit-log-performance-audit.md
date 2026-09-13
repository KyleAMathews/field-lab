# Kit log performance audit

2026-09-13

Baseline audit, before implementation. The user subsequently chose complete
control-log removal. See [implementation and tests](kit-log-speed-results.md)
for the final changes; the recommendations below preserve the initial analysis.

The strongest opportunity is to reduce the bookkeeping Kit generates and rereads between tool calls. The writer has redundant work, but its runtime does not explain the long interview turns sampled here.

## Evidence from actual turns

Inspected the four available turns in task `01a09b0a-0244-7603-a815-19111804ca38`, focusing on the last two ordinary interview exchanges after setup. The installed skill path resolves to this repository.

| Measure | Earlier interview turn | Latest interview turn |
| --- | ---: | ---: |
| Whole turn | 73.314 s | 50.709 s |
| Reported append command duration | 41 ms | 78 ms |
| Events in its one append | 8 | 6 |
| Append command text, including shell wrapper/escaping | 5,512 characters | 3,012 characters |
| Separate control-log patch | 2,437 characters | 1,667 characters |

Both turns already batch their events. Neither append failed. The latest turn first inspected the Field Log (4,418 output characters), then read the separate control log (6,748 characters), then appended the events, then patched the control log, before returning a short question. The earlier turn also ran `validate` before `inspect` and contacted the gardener.

The records repeat the user's comment, current aim, interpretation, limitations, instrument status, and next question across the event batch and control-log prose. The latest batch itself repeats the exact user comment in both `comment.recorded` and `instrument.feedback.recorded`.

Command durations come from the task's command records. They do not measure model generation, reasoning, scheduling, tool dispatch, or all file-change costs. We cannot assign the remaining seconds precisely or promise a turn-speed multiplier. We can establish that the append process is a very small part of these turns, and that substantial redundant reading and writing occurs on the critical path.

## Local measurements

Benchmarked copies in a fresh temporary directory; no live log was changed. Used Node v22.13.1, the shipped CLI for subprocess timings, and the source writer through `node --import tsx` for in-process timings. The latter excludes module startup. Existing-log results are medians of ten samples after two warmups; batch comparisons and synthetic results use five samples. Appends add a short note, with the same filesystem locking, JSONL sync, and Markdown regeneration as normal writes. The test does not cover large source copies, custom schemas, lock contention, or browser delivery latency.

| Starting log | Parse + validate | Project into memory | Append in process | Append via CLI | Inspect via CLI |
| --- | ---: | ---: | ---: | ---: | ---: |
| 99 events / 78 KB | 1.17 ms | 0.13 ms | 11.56 ms | 135.63 ms | 128.45 ms |
| 245 events / 503 KB | 2.42 ms | 0.18 ms | 13.62 ms | 132.23 ms | 131.22 ms |

Six separate CLI appends took 733–779 ms; one six-event batch took 122–137 ms. Batching helps, but it is already in use in both sampled turns.

Synthetic histories of roughly 1 KB notes took 133 ms at 1,000 events, 191 ms at 5,000, and 275 ms at 10,000 for a CLI append. These synthetic logs do not represent source-heavy or question-heavy workloads. Full replay does grow with history, but there was no multi-second writer delay in these tests.

## Recommended changes, in order

### 1. Record common facts once; make the control log cite them

The original control-log contract, now replaced by [Field Log round state](../reference/dialectic-wiki.md#round-state-in-the-field-log), asked for observation and instrument ledgers that overlapped the Field Log's records. Although it described the control log as mostly pointers, its detailed field list encouraged another full account. The sampled turns manually maintained both.

Make Field Log events and readouts the authoritative source for comments, scope, lifecycle, readings, and limits. Have control-log sections cite event/run IDs and retain only dialectic-specific state: phase gates, tension choices, loop decisions, and their interpretation. Generate overlapping sections where a standalone reading copy is needed. Preserve unique content before replacing manual sections.

This removes model-written duplication and a separate file-edit step from ordinary interview turns. Keep substantive readouts; the target is repeated records of the same fact.

### 2. Give ordinary turns a small state view and useful receipts

[`inspectFieldLog`](../artifact-browser/src/field-log/reader.ts) returns every journal entry, source, and run. It omits full readouts but has no history limit or delta cursor. The re-entry instructions also ask for a standalone `validate`, even though `inspect` calls `validateFieldLog` itself. The sampled earlier turn used both.

Add a compact state command or inspection mode with current scope, open question IDs, active runs, latest event ID, and a bounded recent history. Add a `since-event` option for re-entry after another writer. Return a mapping of all assigned entity IDs from each append, not just the last event's run/entry IDs. A batch ending in a question currently loses the convenient receipt link for an earlier completion in that same batch.

Tell Kits to reuse successful receipts during an uninterrupted exchange and inspect after context loss, an external write, or uncertainty. Distinguish re-entry from every new user message. Keep the deliberate whole-control-log grounding at actual dialectic loop boundaries; it is not needed on every interview response.

### 3. Reduce event boilerplate without weakening validation

Both example writes require several thousand characters of shell-escaped JSON for a brief user response. Repeated actors, pointers, quotations, question transitions, and scope prose create work beyond the substantive interview.

Introduce a structured turn input that supplies common actor/turn context once and deterministically expands into existing canonical events. Keep user authorization explicit for each gated operation. Support referencing the recorded comment for feedback rather than making the model reproduce the quote. Do not force a scope rewrite when the aim has not changed, or add lifecycle events that carry no new execution boundary.

Prefer a typed tool interface when available, or a structured CLI input with an easy stdin/file path. Merely moving the same verbose JSON into a temporary file adds a call without removing its generation cost. The current `--json` preference is not itself a runtime problem; the issue is how much repetitive text the agent must author.

### 4. Trim writer replay after the workflow changes

[`appendFieldLogEvents`](../artifact-browser/src/field-log/writer.ts) reads and validates existing events, then calls history validation again over existing plus assigned events. Transition validation creates XState actors, checks transitions, sends events, and stops the actors on each pass. Every append also scans history for counters and projects the entire diary.

Reuse validated transition state within an append and validate only the newly assigned transitions on top of it. Retain complete-history validation for explicit validation/recovery. More ambitious persistent checkpoints need a way to detect changed or corrupt historical data; do not silently trust a stale snapshot.

Additional small improvements: skip transient-source path resolution when no eligible source is submitted; cache instrument-card parsing and schema compilation within an operation. `validate`/`inspect` validate historical instrument events, rereading the same card for each; custom-schema events construct a fresh Ajv instance each time. Normal append applies card validation only to new events, so this is chiefly a read/re-entry or custom-batch concern.

At the measured sizes these save milliseconds. A persistent writer service or different storage engine is not the first investment supported by this evidence.

## Scope and validation of a follow-up

This audit changed no writer code or skill rules. Existing unrelated working-tree changes were left intact. It inspected the browser watcher but did not time watcher-to-browser delivery; that is a separate question if the visible page lags after a successful receipt.

Start with the shared-record contract, compact inspection/receipts, and a shorter turn-input format. Then compare representative interview turns using the same task shape and model settings: total latency, generated bookkeeping characters/tokens, tool-call count, and preservation of exact comments, authorization, scope, active runs, and next questions. The desired outcome is a complete record with less work before the next conversational response.
