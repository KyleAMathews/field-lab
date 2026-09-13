# Faster Kit logging

Status: implemented through step 3, including CLI reminders and a continuation route. Final isolated review passes 135 tests, the production build, and the normal type check. Live resumed-interview trials test behavior and document-read cost; one saved-session follow-up verified the one-call warm path. See [results](../kit-log-speed-results.md) for timings and transcription failures. Steps 4–5 remain deferred.

## Purpose

Reduce the delay before Kit returns the next useful conversational response while preserving exact user comments, current aim, authority, evidence, and dialectic state. See the [audit](../kit-log-performance-audit.md) for the measured baseline.

The Field Log is the inquiry's event history and human reading surface. Previously, the separate `dialectic/round_N_dialectic_log.md` was Kit's control record for one dialectic round. It preserved the original anchor, phase approvals, chosen tension, gaps, and refinement decisions so Kit can resume and detect drift. Only the full dialectic workflow used it.

Remove the separate control-log file. Preserve its unique facts through `workflow.checkpoint.recorded` events in the Field Log; existing control logs become historical sources.

## 1. Establish a repeatable turn test

Create small, disposable fixtures with existing Field Logs and round control logs. Exercise three cases:

1. An ordinary interview answer while an instrument remains running.
2. A correction that changes scope and the current question.
3. Instrument completion followed by another event in the same batch, then re-entry from disk.

Capture the baseline before changing instructions or code. Use the same fixed user messages, local source material, model, reasoning settings, and initial records in both variants. Run warm conversation continuation separately from cold re-entry. Exclude outside research and browser startup from these cases. Capture tool calls, generated command and patch bytes, available token counts, tool-output bytes, time to final response, and the resulting files.

Extend the existing conformance test infrastructure with a separate writable logging suite. The current `live-skill.test.ts` tells the model not to edit files and uses a read-only sandbox, so it cannot test this workflow as written. Give the new suite write access only to disposable test workspaces; do not point it at the user's live inquiry. Preserve raw results and use external wall-clock timestamps when the existing trace adapter lacks timing information.

Start with three baseline/candidate pairs per case, alternating order. Expand to five pairs per case if the initial result is promising or noisy. For warm continuation, establish and resume each variant's own setup conversation. Do not give only the candidate a compact artificial briefing. Use fresh fixtures for each pair.

## 2. Remove duplicate writing and unnecessary rereads

Change the instruction contract in `reference/dialectic-wiki.md`, `reference/dialectic-instrument-map.md`, `reference/dialectic-workflow.md`, and `reference/field-trip.md`. Audit phase and refinement references for conflicting requirements; the current instrument map explicitly says to satisfy the stricter requirement, so one isolated instruction edit will not suffice.

Ownership after the change:

| Fact | Authoritative record | Treatment |
| --- | --- | --- |
| Exact comment, current scope, sources, instrument status/readout, feedback | Field Log | Cite stable event/run IDs where needed |
| Frozen round anchor, phase gates, chosen tension and its history, hidden-question/frontier/loop decisions | Field Log workflow checkpoints | Preserve the unique round state once |
| Research pages and links | Gardener's wiki | Keep current ownership and handoff rules |

Write workflow checkpoints only when unique round state changes. An ordinary answer does not require another prose record of the comment, instrument status, or next interview question. At a phase gate, cite the run and event records that prove completion; do not reproduce their readings and limits. Leave full readouts intact in the Field Log.

Reuse known state and receipts during an uninterrupted exchange. Do not reinterpret every user message as re-entry. Remove the separate `validate` before `inspect`, since inspection already validates. Keep explicit recovery and the whole-record grounding required at actual refinement-loop boundaries.

The user chose complete removal, so test the instruction change together with checkpoint support; an instruction-only change would leave unique state without a supported writer contract. Existing control logs remain readable and retain their historical content; do not automatically delete or migrate them.

## 3. Add compact state and complete receipts

Extend the reader, writer, and CLI:

- Add an explicit compact state mode: latest event ID, current scope/question with IDs, active runs/workflows, and bounded recent entries. Return counts and continuation information when lists are truncated. Keep existing full inspection available.
- Return the small recording contract in `state.writeHelp` and next-step reminders in mutation receipts. An uninterrupted exchange reuses state and IDs already in context; it needs no separate reminder read.
- Add event-delta retrieval after a known event ID for another writer's changes. A current-state view alone must not hide intervening corrections or failures.
- Add a per-event entity mapping to append receipts: event type/ID and assigned comment, question, source, run, entry, and workflow IDs as applicable, plus links for every new entry. Preserve existing receipt fields for compatibility.
- Support an optional expected latest event ID, checked under the existing lock. Reject a stale write before mutation and return the actual version. Kit then reads the delta, reassesses its proposed changes, and retries. Do not blindly retry semantic changes against newer state.

This lets a warm turn perform one batched append without inspecting the entire journal to recover IDs. Re-entry gets a compact validated briefing, then deeper reads only for material needed by the inquiry. Checkpoint references remain resolvable through the read APIs.

Tests: a completion followed by a question still returns its entry link; all generated entity IDs match canonical events; compact output stays bounded as history grows; omitted material remains retrievable; stale writes do not change either log file; same-version concurrent writers cannot both commit.

## 4. Shorten the submitted turn format

Only after measuring steps 2–3, add a turn-oriented input command if event construction remains substantial. It should expand deterministically to the existing canonical events and use the existing append transaction.

Supply the exact user comment and common actor/turn pointer once. Allow events to explicitly reference that comment for feedback or authorization text; expansion copies the exact text into the canonical fields that require it. Keep authorization kind and the authorized operation explicit. Support explicit local references for entities created earlier in the batch. Never infer that a normal answer authorizes a new instrument, synthesis, or phase.

Keep semantic choices with Kit: whether scope changed, how a question was answered, which run completed, and what the next question is. Do not create a template that emits all possible events on every turn. A file containing the same verbose JSON is not an optimization by itself.

Tests: compare expanded canonical events with a manually specified expected batch, ignoring only assigned IDs/timestamps; preserve apostrophes, quotes, newlines, Unicode, and long readouts exactly; reject missing/wrong authorization and invalid references before writing; retain all-or-nothing validation and projection-warning behavior.

## 5. Optimize writer internals only if still material

Run the existing-log and large-history benchmarks again. If writer runtime has become a meaningful fraction of turn latency, reuse validated history state within one append instead of replaying it twice; skip transient-source path setup when no eligible source exists; cache instrument-card/schema work within a command.

Keep JSONL sync, locking, complete explicit validation, and Markdown recovery. Persistent services, replay caches, generated control-log files, and a storage-engine migration are outside this first experiment. They add complexity without evidence that they address the current delay.

Test any replay change against valid and invalid histories, current-question uniqueness, illegal lifecycle transitions, and corrupt old records. Do not add persistent caching without a separate design for detecting external changes.

## Acceptance criteria

Correctness is required in every case:

- User comments survive exactly and remain distinct from Kit's inference.
- The current scope, question, run status, and next user-facing step are correct.
- Required authority, source coverage, structured readings, and full readouts remain intact.
- A fresh Kit can recover the anchor, phase, chosen tension, open gaps, and next allowed action from disk.
- References resolve; failed writes do not lose records or falsely report completion.

Operational targets for an ordinary warm interview answer: one batched append, no separate control-log edit, and no routine full-log read. For the complete candidate, aim for at least 40% less generated bookkeeping text and 25% lower median turn latency. These are experiment targets, not forecasts. Report every trial and latency spread; do not claim a latency win from reduced bytes alone.

Run the relevant writer, reader, projection, and conformance tests after each code stage. Compare the live variants after the instruction change, after the compact-state/receipt change, and after the optional turn-input change. Retain only stages with a demonstrated benefit and no loss of record completeness. Do not microbenchmark every unrelated UI change or run the entire research workflow to test a short interview turn.

Current slice: test fixtures/harness, complete control-log removal, checkpoint events, compact state/deltas, and complete append receipts. The shorter turn-input format and writer replay optimizations remain conditional on measured need.

## Experiment-driven adjustment

The initial resumed-interview comparison loaded roughly 200–300 KB of tool output per turn, largely setup references. Removing the second log did not consistently reduce latency in the small fixtures. Add a narrow route from `SKILL.md`: reuse known state or recover it with `state`, read the active card if absent, and record an answer/correction. At the user’s suggestion, the CLI returns the recording contract directly; no separate continuation guide is read. Return to full procedures for completion, new operations, research, phase gates, or missing authority. This preserves the full contracts at the boundaries where they matter and avoids reopening setup for a continuing question. Retest the ordinary-answer case with matched baseline/candidate trials before claiming a speed improvement.

The first inline-reminder pilot exposed smart-apostrophe substitution and an ambiguous instruction to leave an unresolved question unchanged. Tighten exact-text guidance and require the saved question to match the actual next prompt. Validate those behaviors in targeted live runs. Report pilot failures alongside timings; do not treat faster but incomplete records as successful optimization.
