# Expedition Log Template

Create this when the user starts an Expedition: a directory that holds several related Field Trips and their field logs.

```markdown
---
type: expedition-log
title: <short Expedition title>
opened-at: <YYYY-MM-DDTHH:MM:SS±HH:MM>
opened-by: <verbatim user request or turn pointer>
updated-at: <YYYY-MM-DDTHH:MM:SS±HH:MM>
status: <active|paused|complete>
session-provenance: <task/thread pointer and useful turn span, if available>
---

# <Expedition title>

## About

<The broader question, place, system, or line of discovery that connects the Field Trips.>

## Field Trips

Append one row when a Field Trip joins the Expedition. Its field log remains authoritative.

| Recorded at | Field Trip | Field log | Opened at | Scope | Status |
| ----------- | ---------- | --------- | --------- | ----- | ------ |
| <ISO 8601> | <title> | <path> | <ISO 8601> | <bounded operation> | <active / paused / complete> |

## Expedition entries

Append only changes, conclusions, or significant findings copied from a named Field Trip log. Preserve the source wording, claim kind, confidence, and downgrade. Do not create an Expedition-level interpretation or copy whole raw readouts.

| Recorded at | Observed or occurred at | Kind | Copied entry | Source Field Trip | Source log entry | Claim status |
| ----------- | ----------------------- | ---- | ------------ | ----------------- | ---------------- | ------------ |
| <ISO 8601> | <ISO 8601 / unknown / N/A> | <change / conclusion / significant-finding> | <faithful copy or close marked paraphrase> | <title> | <path and entry pointer> | <kind, confidence, and downgrade> |
```

## Integrity rules

- Keep the Expedition log sparse: opening metadata, what the Expedition is about, Field Trip entries, and copied Field Trip changes, conclusions, or significant findings.
- Keep each field log authoritative for its own readings, workflows, choices, and provenance.
- Preserve the exact opening date, time, timezone, user-authorization pointer, and session provenance.
- Give every appended row a `recorded-at` timestamp with timezone. Preserve `observed-at` or `occurred-at` from the source Field Trip when known; write `unknown` rather than inventing it.
- Update frontmatter `updated-at` and `status` when the Expedition changes; record that change as an Expedition entry copied from the responsible Field Trip.
- Preserve source pointers, claim kinds, confidence, disagreement, and every downgrade.
- Never authorize or record instrument execution, workflow execution, engine transitions, or independent analysis in the Expedition log.
