# Expedition

An Expedition is a directory and a small shared briefing for related Field
Trips. It records the Expedition's territory, its member trips, and a few
Field Log entries that a trip chose to promote for later trips.

An Expedition is not a workflow. It does not authorize instruments,
synthesis, conclusions, plans, or actions.

## Entry

Create an Expedition only after `SKILL.md` routes the inquiry here and the user
agrees to the shared directory and log. Record that artifact consent. Keep it
separate from Field Trip, instrument, workflow, and synthesis authority.

Before writing, read [expedition-log-events.md](expedition-log-events.md) in
full.

## Directory and files

```text
<expedition>/
├── expedition_log.jsonl
├── expedition_log.md
└── field-trips/
    └── <trip>/
        ├── field_log.jsonl
        └── field_log.md
```

`expedition_log.jsonl` is the canonical append-only event stream.
`expedition_log.md` is its generated current projection. Use the bundled
`expedition-log` CLI for every write. Never edit either file by hand.

Joining moves a standalone Field Trip under `field-trips/`, then records the
membership in both logs. The Expedition points to the trip; the Field Trip
points back to `expedition_log.md`. The Field Log stays authoritative for all
of its entries and sources.

## First read in a member trip

At the start of every new Field Trip inside an Expedition, make reading
`expedition_log.md` the first tool call. This is a skill rule, not a writer
event or a runtime gate. Use the briefing to find prior trips and promoted
entries, then inspect, search, or read their Field Logs when more depth helps.

## Promotion

A member trip may promote one of its existing Field Log entries. A promotion
stores:

- its stable promotion ID;
- the member trip, entry, and optional readout pointer;
- a short note saying why the entry matters to later trips.

The Expedition stores no second copy of the entry text. Its Markdown renderer
resolves the pointer and shows the Field Log's current title and compact
summary. The Expedition reader opens the full note or readout in place and
keeps a separate link to the authoritative Field Log entry. Long notes and
readouts follow the normal Field Log drawer rule.

A later promotion may replace an earlier promotion by ID. It takes the old
promotion's place in display order. A trip may also remove a promotion by ID.
Replacement and removal append events to canonical history, but the generated
Markdown, inspection output, manifest, and promotion search show current
promotions only.

The Expedition performs no automatic synthesis and never auto-promotes a
finding. A Field Trip makes each promotion, replacement, or removal explicitly.

## Reading

Both `field-log` and `expedition-log` use the same read verbs:

- `inspect` returns a compact structured overview. Full readouts are omitted.
- `search` searches entries, readouts, and collected source files and returns
  structured hits. Source hits say whether the source was only collected or
  also examined.
- `read` returns one selected entry, readout, or source in full.

`expedition-log inspect` includes the member trips and current promotions.
`expedition-log search` searches the current promotion projection and every
member Field Log. `expedition-log read` addresses an item through its member
trip ID.

## Existing Markdown Expeditions

Migration is an agent task, not a CLI command. Read the old Markdown, initialize
the compound Expedition Log, append events that reconstruct its members and
current promoted items, render it, and compare the generated briefing with the
old file. Keep the old file until the comparison is complete.

## Scope

Keep sources, instruments, workflow state, raw readings, and detailed history
in their Field Trips. Expedition-to-Expedition references are ordinary links
inside a note. There is no Expedition status, member status, formal nested
Expedition relation, or `leave` operation.
