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

Seed this append-only ledger with inherited entries at `selected` or later. Use one vertical record per meaningful lifecycle event; never put the common readout into a wide table.

### `<instrument-id>` — <selected / prepared / running / complete / stopped>

- **Recorded at:** <ISO 8601>
- **Observed at:** <ISO 8601 / unknown / not-applicable>
- **Authorization:** <basis and user pointer>
- **Execution:** <actual or planned seat>; <who saw or will see what>
- **Fallback / downgrade:** <none or named downgrade>
- **Trace:** <artifact or turn pointer>
- **Access delta:** <what became visible, or pending>
- **Bounded readings:**
  - **<kind>; <solid / plausible / reach>:** <reading> — **Support:** <pointer or citation>
- **Control / calibration:** <baseline, comparison, null, or limit>
- **Artifact risk:** <what the instrument may have induced or hidden>
- **Unmeasured:** <what remains outside the reading>
- **User feedback:** <pending / confirmed / correction with pointer>
- **Caddy:** <remaining current batch, queued next instrument, offered instruments, selected workflow handoff, or no next instrument>

Include instruments at `selected` or later. Keep mere offers in the collection plan; do not rewrite ordinary conversation as a formal run. A `prepared` experiment retains its frozen baseline, controls, and decision rule even before an observation returns. Only a `complete` entry may claim an empirical access delta or reading. Append another dated record when lifecycle or feedback changes; do not overwrite the earlier state.

## Key readings

### <short reading label>

- **Recorded at:** <ISO 8601>
- **Observed at:** <ISO 8601 / unknown / not-applicable>
- **Kind:** <observation / measurement / user-testimony / source-claim / elicited-response / generated-sample / controlled-comparison / test-result / inference / analogy / normative-judgment / hypothesis>
- **Reading:** <value>
- **Support:** <pointer or citation>
- **Confidence:** <solid / plausible / reach>
- **Artifact risk:** <distortion or none known>

## Loaded terms

- **Recorded at:** <ISO 8601> — **<term>:** <observed meanings and who uses them>

## Current tensions

- **Recorded at:** <ISO 8601> — <smallest unresolved contradiction, with conditions and evidence status>

## Open gaps, collection plan, and stop rules

### <short gap label>

- **Recorded at:** <ISO 8601>
- **Gap:** <what is unknown>
- **Requested measurement:** <what remains unseen>
- **Offered instrument or source:** `<instrument-id>` or <source>
- **Selection state:** <offered / user-selected—current batch / user-selected—queued next, with order>
- **Done when:** <coverage condition>

- **Recorded at:** <ISO 8601> — **Stop when:** <the agreed local condition for pausing or closing>
- **Recorded at:** <ISO 8601> — **Plan change:** <user-selected addition, removal, replacement, or reordering with pointer; preserve the remaining queue>

## Current working question

**Updated at:** <ISO 8601>

<Where the Field Trip has arrived. Keep this distinct from the original question.>

## Workflow ledger

### <workflow name> — <selected / running / paused / complete>

- **Recorded at:** <ISO 8601>
- **Authorization:** <user pointer>
- **Artifacts:** <paths>
- **Next gate:** <gate or none>

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
- Render prose-bearing ledger entries as vertical record blocks. Use tables only for compact comparisons with no more than four short columns.
- Record actual execution, authorization, lifecycle, context boundary, and fallback for every run.
- Keep raw readings separate from interpretation, synthesis, and action.
- Keep coverage and stop rules editable; record user-selected plan changes instead of silently expanding the trip.
- Keep artifact consent separate from instrument selection, workflow selection, user interpretation, and engine authorization.
- Treat the log as a current field map, not a transcript or polished report.
- Ask only for gaps; never make the user repeat material already in the session.
