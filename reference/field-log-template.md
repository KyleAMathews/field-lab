# Field Log Template

Create one field log when the user agrees to begin a Field Trip. Distill the session so far; do not replay it.

Use `field-trip-<topic>/field_log.md` for a standalone trip or `<expedition>/field-trips/<trip>/field_log.md` inside an Expedition.

```markdown
---
type: field-log
title: <short Field Trip title>
opened-at: <YYYY-MM-DDTHH:MM:SS±HH:MM>
opened-by: <verbatim user request or turn pointer>
updated-at: <YYYY-MM-DDTHH:MM:SS±HH:MM>
status: <active|paused|complete>
session-provenance: <task/thread pointer and useful turn span, if available>
expedition: <path to expedition_log.md, or none>
---

# <Field Trip title>

The opening snapshot below inherits `opened-at`. Do not silently overwrite it: append later changes with `recorded-at`, and update frontmatter `updated-at`.

## Original question

<Verbatim or clearly marked close paraphrase of how the inquiry entered the session.>

## Trip scope and goal

<The bounded operation and what the user is trying to understand, observe, compare, make, or discuss.>

## Why the field log opened

<Why the session record alone no longer suffices.>

## Field lineage

<Prior session, Walk, supplied-chat, Field Trip, or Expedition pointers. Mark any inaccessible source as unavailable; preserve inherited limitations and downgrades. Later additions carry `recorded-at`.>

## Instrument ledger

Seed this append-only ledger with inherited entries at `selected` or later, then advance each entry under the same schema. Use the common readout fields in `reference/instrument-contract.md`; keep the compact table below when one row can preserve the state and reading without loss.

| Recorded at | Observed at | Instrument | Authorization | Lifecycle | Execution seat | Context boundary | Fallback / downgrade | Trace | Access delta | Bounded reading | Control | Artifact risk | Unmeasured | User feedback |
| ----------- | ----------- | ---------- | ------------- | --------- | -------------- | ---------------- | -------------------- | ----- | ------------ | --------------- | ------- | ------------- | ---------- | ------------- |
| <ISO 8601> | <ISO 8601 / unknown / N/A> | `<id>` | <user pointer> | <selected / prepared / running / complete / stopped> | <actual or planned seat> | <who saw or will see what> | <none or named downgrade> | <pointer> | <new access, or pending> | <reading, or pending> | <calibration> | <risk> | <remainder> | <pending / confirmed / correction> |

Include instruments at `selected` or later. Keep mere offers in the collection plan; do not rewrite ordinary conversation as a formal run. A `prepared` experiment retains its frozen baseline, controls, and decision rule even before an observation returns. Only a `complete` entry may claim an empirical access delta or reading. When an instrument produces several typed readings, append its full common readout below the table rather than creating another ledger.

## Key readings

| Recorded at | Observed at | Reading | Kind | Support | Confidence |
| ----------- | ----------- | ------- | ---- | ------- | ---------- |
| <ISO 8601> | <ISO 8601 / unknown / N/A> | <value> | <observation / measurement / user-testimony / source-claim / elicited-response / generated-sample / controlled-comparison / test-result / inference / analogy / normative-judgment / hypothesis> | <pointer or citation> | <solid / plausible / reach> |

## Loaded terms

- **Recorded at:** <ISO 8601> — **<term>:** <observed meanings and who uses them>

## Current tensions

- **Recorded at:** <ISO 8601> — <smallest unresolved contradiction, with conditions and evidence status>

## Open gaps, collection plan, and stop rules

| Recorded at | Gap | Requested measurement | Offered instrument or source | Selection state | Done when |
| ----------- | --- | --------------------- | ---------------------------- | --------------- | --------- |
| <ISO 8601> | <gap> | <what remains unseen> | `<instrument-id>` | <offered / user-selected> | <coverage condition> |

- **Recorded at:** <ISO 8601> — **Stop when:** <the agreed local condition for pausing or closing>
- **Recorded at:** <ISO 8601> — **Plan change:** <user-selected addition, removal, or reordering with pointer>

## Current working question

**Updated at:** <ISO 8601>

<Where the Field Trip has arrived. Keep this distinct from the original question.>

## Workflow ledger

| Recorded at | Workflow | Authorization | State | Artifacts | Next gate |
| ----------- | -------- | ------------- | ----- | --------- | --------- |
| <ISO 8601> | <name> | <user pointer> | <selected / running / paused / complete> | <paths> | <gate or none> |

## User orientation notes and choices

- **Recorded at:** <ISO 8601> — **What the user noticed:** <verbatim or close paraphrase>
- **Recorded at:** <ISO 8601> — **Selected next instrument, workflow, or Expedition:** <selection and pointer, if any>
- **Recorded at:** <ISO 8601> — **Explicit engine transition:** <conclude / synthesize / recommend / decide / plan / act, with pointer, or none>

## Trip status

- **Updated at:** <ISO 8601>
- **State:** <active / paused / complete>
- **Reason:** <scope met, paused by user, experiment pending, readings repeating, or other observed condition>
- **Open trails:** <questions worth retaining without forcing closure>
```

## Integrity rules

- Preserve the original question and current working question separately.
- Preserve the exact opening date, time, timezone, and user-authorization pointer.
- Give every appended entry a `recorded-at` timestamp with timezone. Use `observed-at` or `occurred-at` when the event time differs; write `unknown` rather than inventing it.
- Give every mutable section and frontmatter state an `updated-at` timestamp with timezone.
- Preserve the reason the log opened and all prior lineage.
- Keep claim kinds, support, and confidence visible.
- Keep one authoritative append-only instrument ledger; do not split inherited and new runs into separate schemas.
- Record actual execution, authorization, lifecycle, context boundary, and fallback for every run.
- Keep raw readings separate from interpretation, synthesis, and action.
- Keep coverage and stop rules editable; record user-selected plan changes instead of silently expanding the trip.
- Keep artifact consent separate from instrument selection, workflow selection, user interpretation, and engine authorization.
- Treat the log as a current field map, not a transcript or polished report.
- Ask only for gaps; never make the user repeat material already in the session.
