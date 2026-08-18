# Expedition Log projection

The writer generates `expedition_log.md` from `expedition_log.jsonl`. Do not
copy this template by hand or edit the result.

Its shape is:

```markdown
---
type: expedition-log
format: expedition-log/v1
event-stream: ./expedition_log.jsonl
generated-through: <event ID>
title: <Expedition title>
opened-at: <ISO 8601 timestamp>
updated-at: <ISO 8601 timestamp>
---

# <Expedition title>

<territory>

## Field Trips

### <current Field Trip title>

- **Opened at:** <Field Log opening timestamp>
- **Latest event:** <latest Field Log event ID and timestamp>
- **Field Log:** <relative link>
- **Scope:** <current Field Log scope>

## Promoted entries

<a id="promotion-<ID>"></a>
### <current source-entry title>

<compact summary resolved from the Field Log>

- **Read:** <link that opens the full entry or readout in the Expedition reader>
- **Why promoted:** <promotion rationale>
- **Source:** <separate link to the authoritative Field Log entry or readout>
```

The projection shows only current promotions. Replacement inherits the old
item's position. Removal hides the item. The JSONL stream keeps the events that
produced that projection.
