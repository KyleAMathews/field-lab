# Staging Phase 4 and Phase 6 Reference Docs — Design

## Problem

An orchestrator running a live dialectic skipped reading the full `reference/phase4-determinate-negation.md` (273 lines), reporting it as "too long" and hitting file-read problems. Phase 6 (`phase6-validation.md`, 365 lines) is even longer and exposed to the same failure.

The deeper issue is not just file size — it is *when* the file is read. `SKILL.md` instructs the orchestrator to read the entire phase doc at the **start** of the phase. By the time it reaches the back-half steps (Boydian decomposition, donor primers, the per-candidate auditor prompts), the relevant instructions are far back in context and half-forgotten. Some agents now bail on the read entirely.

## Solution

Two-part fix:

1. **Just-in-time staged reads.** Split each oversized phase doc into a short **index** file plus several **stage** files. The orchestrator reads one stage, does that stage's work, then reads the next stage — instead of pulling the whole phase up front. Reads are small, and each stage's instructions land in context exactly when that stage executes.

2. **Per-stage write-out checkpoint.** Each stage file ends with an explicit instruction to write that stage's output to the round file *before* reading the next stage. This converts the existing "write as you go" guidance into a hard gate, and makes context safe to compact between stages because each stage's work is already persisted.

## Constraints

- **Verbatim text moves.** Existing section text is cut/pasted into stage files unchanged. The wording was tuned over multiple field-test runs; this effort restructures, it does not reword. The only *new* prose is the index framing wrappers and the per-stage write-out footers.
- **No renumbering.** Section numbers (4.0, 4.5b, 4.6.5, 6.2.S, …) stay stable so every internal cross-reference (e.g., 4.2.5's "see 4.6.5 for format") still resolves across files.
- **Inline execution.** This is documentation restructuring with no code and no tests, so it is executed inline rather than via subagent TDD loops.

## Phase 4 → index + 4 stages

`reference/phase4-determinate-negation.md` becomes the **index**: cross-cutting framing that applies throughout the phase (N-monk scaling block, context-management note, treat-monk-output-as-testimony, write-your-initial-guess-first), plus a stage map and the staging + write-out protocol.

| File | Sections | Cognitive move |
|---|---|---|
| `reference/phase4-stage-a-analysis.md` | 4.0–4.4 | Find the collision |
| `reference/phase4-stage-b-lateral.md` | 4.5a / 4.5b / 4.5c | Build the sea (donor pipeline) |
| `reference/phase4-stage-c-decomposition.md` | 4.6, 4.6.5, 4.6.6 | Shatter, recombine, instrument |
| `reference/phase4-stage-d-criteria.md` | 4.7, 4.9 | Sublation criteria + HARD STOP checkpoint |

## Phase 6 → index + 3 stages

Phase 6's setup steps (6.0 select candidates, 6.1 model selection) run once up front, so they live in the index rather than a stage of their own. The three working stages repeat per candidate under validation.

| File | Sections | Move |
|---|---|---|
| `reference/phase6-validation.md` (index) | header framing + 6.0 + 6.1 + stage map | Setup |
| `reference/phase6-stage-a-monk-validation.md` | 6.2 (S/J/G/F/U prompts) | Monks validate |
| `reference/phase6-stage-b-hostile-auditor.md` | 6.3 (S/J/G/F/U prompts) | Auditor attacks |
| `reference/phase6-stage-c-interpret-refine.md` | 6.4, 6.5, 6.6 | Interpret + refine |

## SKILL.md changes

The two lines:
- `**Read `reference/phase4-determinate-negation.md` before executing.**`
- `**Read `reference/phase6-validation.md` before executing.**`

each gain a clause noting the doc is **staged**: read the index first, then read each stage file just-in-time as you reach it (and write the stage's output before reading the next). The phase walkthrough prose is otherwise unchanged.

## Index file protocol (shared shape)

Each index ends with a short protocol block, roughly:

> **This phase is staged. Read one stage file at a time, in order — not all at once.** For each stage: read the stage file, do its work, **write that stage's output to `round_N_*.md`**, then read the next stage. The framing above applies to every stage. Section numbers are continuous across the stage files, so cross-references (e.g. "see 4.6.5") point to whichever stage holds that section.

## Out of scope

- Rewording or compressing any existing section text.
- Phases 1, 2, 3, 5, 7 (all comfortably sized).
- Changing the dialectic's logic, prompts, or section ordering.
