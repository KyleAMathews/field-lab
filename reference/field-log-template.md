# Legacy Markdown Field Log

Do not use this file to create a new Field Trip.

New trips use the compound contract in [field-trip.md](field-trip.md) and
[field-log-events.md](field-log-events.md):

- `field_log.jsonl` is the canonical append-only record;
- the bundled writer validates transitions and assigns IDs and timestamps;
- `field_log.md` is regenerated from JSONL and must not be edited directly.

Artifact Browser still reads older Markdown-only Field Logs. Preserve such a
file as a legacy artifact until an explicit migration workflow exists; do not
silently rewrite it into invented events.
