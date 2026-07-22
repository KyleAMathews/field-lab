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

Append one record when a Field Trip joins the Expedition. Its field log remains authoritative.

### <Field Trip title> — <active / paused / complete>

- **Recorded at:** <ISO 8601>
- **Opened at:** <ISO 8601>
- **Field log:** <path>
- **Scope:** <bounded operation>

## Expedition entries

Append only changes, conclusions, or significant findings copied from a named Field Trip log. Preserve the source wording, claim kind, confidence, and downgrade. Do not create an Expedition-level interpretation or copy whole raw readouts.

### <change / conclusion / significant finding>

- **Recorded at:** <ISO 8601>
- **Observed or occurred at:** <ISO 8601 / unknown / not-applicable>
- **Copied entry:** <faithful copy or close marked paraphrase>
- **Source Field Trip:** <title>
- **Source log entry:** <path and entry pointer>
- **Claim status:** <kind, confidence, and downgrade>
```

## Integrity rules

- Keep the Expedition log sparse: opening metadata, what the Expedition is about, Field Trip entries, and copied Field Trip changes, conclusions, or significant findings.
- Keep each field log authoritative for its own readings, workflows, choices, and provenance.
- Preserve the exact opening date, time, timezone, user-authorization pointer, and session provenance.
- Give every appended record a `recorded-at` timestamp with timezone. Preserve `observed-at` or `occurred-at` from the source Field Trip when known; write `unknown` rather than inventing it.
- Use vertical record blocks for prose-bearing entries. Do not turn the Expedition log into a wide table.
- Update frontmatter `updated-at` and `status` when the Expedition changes; record that change as an Expedition entry copied from the responsible Field Trip.
- Preserve source pointers, claim kinds, confidence, disagreement, and every downgrade.
- Never authorize or record instrument execution, workflow execution, engine transitions, or independent analysis in the Expedition log.
