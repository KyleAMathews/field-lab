# Kit logging changes and tests

2026-09-13

Kit now records inquiry state in the Field Log alone. During an uninterrupted
interview it reuses known state and writer receipts; a new user message does
not trigger a log read. On recovery, the CLI returns compact state and the
recording contract together. Append receipts return IDs, links, and reminders.

## Changes

- Removed the separate dialectic control-log requirement across the skill,
  phase gates, instrument map, wiki, and refinement instructions. Unique round
  facts use `workflow.checkpoint.recorded`; ordinary comments, scope, sources,
  and instrument results remain in their existing events.
- Added `state`, paged `delta`, and `read --event`. Bounded state shows where
  content is truncated and gives IDs for full retrieval. Append receipts now
  return every event's entity IDs and entry links, including completions that
  are not last in a batch.
- Added optional `append --expected-event`, checked under the write lock.
  Stale writes fail before mutation. Kit reads intervening events and
  reassesses; it does not blindly retry.
- Added writer-owned `state.writeHelp` and mutation reminders. Continued
  interviews need no separate instruction-file read. New operations,
  completion, research, and phase gates still use their full procedure.

Existing control-log files remain historical sources. On a later return, Kit
imports only unique missing facts with provenance and stops updating the old
file. This change did not migrate or edit any live inquiry.

## Measured costs

The [baseline audit](kit-log-performance-audit.md) found real append commands
taking 41–78 ms inside 51–73 second interview turns. Repeated model-written
records and document reads were the larger opportunity. No replay cache,
persistent service, or alternative event-input language was added.

Final compact state, including CLI instructions:

| Existing log | Full inspection | Compact state | Reduction |
| --- | ---: | ---: | ---: |
| 99 events | 54,188 bytes | 10,612 bytes | 80.4% |
| 245 events | 264,750 bytes | 8,200 bytes | 96.9% |

These are response sizes, not turn-speed multipliers. Warm turns with known
state need neither response.

## Live experiments

The [harness](../scripts/benchmark-kit-logging.mjs) creates disposable matched
Field Trips and exports baseline instructions from Git. Each trial starts a
fresh CLI conversation, recovers a running Phase 1 interview, records a fixed
answer or scope correction, and asks one further question. The baseline has
a small round control log; the candidate has the same context in checkpoints.
The reader and gardener are treated as already running. No outside research
or live log is used.

Successful model runs used the same app-bundled Codex 0.153.3 and configured
model/settings for both variants. Updating the standalone CLI therefore does
not confound the comparison. Trials alternate baseline/candidate order.
Later correctness checks run the candidate alone and are not matched timing
comparisons. A separate saved-session test then measures one warm follow-up.

All completed trial summaries, including failures, are retained in
[the benchmark directory](benchmarks/kit-logging-2026-09-13). Each file records
its raw trace directory. Superseded pilots are not pooled with later versions:

- `failed-old-cli.json`: 12 failed launches on standalone Codex 0.144.4;
  the configured model required a newer CLI. No model turn ran.
- `checkpoint-pilot.json`: 10 completed trials before narrowing instruction
  loading. Removing the second log alone did not reliably reduce latency.
- `guide-pilot.json`: 3 completed trials of a short continuation file,
  superseded by the user's suggestion to put reminders in CLI output.
- `inline-reminder-pilot.json`: 3 matched ordinary-answer pairs. Median tool
  output fell from 232,293 to 70,777 bytes. Median time was 59.7 versus 55.4
  seconds, but two candidate runs changed straight apostrophes to smart
  apostrophes and added correction notes. The candidate also left the saved
  question unchanged. This version failed the recording acceptance criteria;
  its smaller output is not evidence of an accepted speed improvement.

The revised reminders explicitly require preserving punctuation and matching
the saved current question to the next prompt. Results from
[`revised-reminder-checks.json`](benchmarks/kit-logging-2026-09-13/revised-reminder-checks.json):

| Case | Trial | Seconds | Commands | Record check |
| --- | ---: | ---: | ---: | --- |
| Answer | 1 | 41.4 | 5 | Pass |
| Answer | 2 | 35.4 | 5 | Pass |
| Answer | 3 | 33.1 | 5 | Pass |
| Scope correction | 1 | 33.4 | 5 | Pass |
| Scope correction | 2 | 75.7 | 7 | Pass |
| Scope correction | 3 | 55.5 | 9 | Failed: punctuation changed, then an exact duplicate correction |

All six histories validate, and all saved questions match the next prompt.
The last correction nevertheless fails the one-exact-comment requirement.
Manual trace review caught this: the initial harness counted exact matches
without rejecting an additional inexact comment. The harness now checks both.
The CLI's final guidance recommends a quoted heredoc for prose, avoiding
apostrophe escaping while keeping one shell call. A [targeted correction check](benchmarks/kit-logging-2026-09-13/heredoc-correction.json)
then used the quoted heredoc, passed exact-comment and question checks, and
made one append among five recovery calls (50.5 seconds total).
This remains model-authored input; the writer cannot verify fidelity against a message it never receives.

The [saved-session follow-up](benchmarks/kit-logging-2026-09-13/warm-continuation.json)
used its own cold turn's context, then received a further user answer. It made
**one append call**, no file or instruction reads, and no second-log edit.
It saved exactly one verbatim comment, answered the old question, and added
the actual next question. The receipt returned 450 bytes. Total time was
22.9 seconds; the seed recovery turn took 43.9 seconds and six calls.
This verifies the one-call path in one trial, not a general latency guarantee
or a matched warm baseline comparison. The remaining delay lies outside the
measured writer runtime; these traces do not separate model inference from
scheduler and tool-dispatch costs.

The evidence supports fewer document reads and a working one-call warm path.
It does not yet establish a repeatable overall latency reduction or perfect
model transcription. No further writer optimization is justified by the
measured subsecond runtime.

A later [High-versus-Low reasoning comparison](kit-reasoning-effort-results.md)
tested three warm-turn pairs. Low's median was 24.7 seconds versus 26.4 at
High; all six made one append and passed the record checks. This is a small
measured saving, not evidence of a large turn-speed improvement.

## Code validation

- Final isolated review: 135 tests passed; 5 opt-in tests skipped across
  the full 35-file suite. The source snapshot includes only the logging change
  over HEAD and excludes the existing SQLite browser work and inquiry files.
- New cases cover exact Unicode and multiline comments, scope recovery,
  checkpoint history and references, immutable anchors, phase authority,
  entry links, stale and concurrent writes, truncated recovery, and corrupt
  old streams. Projection-failure receipts explicitly say not to append again.
- Production frontend and all CLI bundles build successfully. Formatting and
  `git diff --check` pass.
- Normal `pnpm typecheck` passes after the build generates the route tree.
  The review replaced the parser's existing `findLastIndex` call with an
  equivalent backwards scan compatible with the declared ES2022 target.
- Review also aligned the full event guide with the quoted-heredoc input
  guidance, and added complete workflow/original-question metadata to
  `inspect`, with a regression test for recovering omitted workflows and
  clipped titles from `state`.

Standalone Codex CLI was updated from 0.144.4 to 0.154.0. Version inspection
and an authenticated, read-only `codex exec` smoke test returned `PONG` and a
completed turn. No credential files or model settings were changed.
