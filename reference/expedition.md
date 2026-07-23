# Expedition

An Expedition is a directory and sparse shared index for several related Field Trips. It records when the Expedition began, what it is about, which Field Trips belong to it, and selected changes, conclusions, or significant findings copied from those Field Trip logs.

An Expedition is not a workflow and does not authorize instruments, conclusions, or actions. It may contain ad hoc Field Trips, repeated observations, several different workflows, or no named workflow at all.

## Entry

Enter only after `SKILL.md` routes the inquiry here and the user agrees to create the shared directory and index. Record that authorization. Do not infer it from one difficult Field Trip or a large workflow.

## Directory

Use a narrow descriptive directory:

```text
<expedition>/
├── expedition_log.md
└── field-trips/
    └── <trip>/
        └── field_log.md
```

Read [expedition-log-template.md](expedition-log-template.md) before creating `expedition_log.md`. Record the exact user-authorization pointer, an ISO 8601 opening timestamp with timezone, and session provenance. Keep this artifact consent separate from Field Trip, instrument, workflow, and engine authorization.

An existing standalone Field Trip may join by link or careful adoption. Preserve its original path and session lineage; do not duplicate readings in a way that hides which record is authoritative.

## Expedition log

The Expedition log tracks only:

- its opening timestamp, authorization, and broad territory;
- every Field Trip, its opening timestamp, field-log path, bounded scope, and status;
- changes, conclusions, or significant findings copied from a named Field Trip log, with timestamp and source pointer.

Add a Field Trip row when a trip joins. Add an Expedition entry only when a Field Trip records a change, conclusion, or significant finding worth surfacing across the Expedition. Copy faithfully or mark a close paraphrase; preserve claim kind, confidence, disagreement, and downgrade. The Expedition log performs no independent analysis or synthesis.

## Authority and plans

Creating or joining an Expedition authorizes only the directory and sparse index described above. Each Field Trip still needs its own opening consent and instrument plan. Instruments, workflows, engine transitions, sources, raw readings, and detailed status history remain in the authoritative Field Trip logs.

Controls scale with uncertainty and consequence, not with the number of trips. Several light trips may need no special apparatus; one costly claim may need independent evidence or hostile testing.

## Other artifacts

Keep sources, atlases, wikis, workflow files, and detailed logs under their owning Field Trip. The Expedition root contains only the Expedition log and its Field Trip directories. The Expedition log may point to a significant Field Trip entry but must not become a second instrument ledger, workflow log, or wiki.

## Exit

An Expedition may remain active, pause, or close without reconciling its Field Trips. Update its timestamped status and retain the Field Trip index and copied entries as the complete record.
