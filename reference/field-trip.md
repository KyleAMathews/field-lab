# Field Trip

A Field Trip is one bounded inquiry with a field log. It begins when the user agrees to **set up the field log**. It uses the same instruments and camera loop as a Walk; the log keeps its sources, findings, open questions, comparisons, and decisions together.

Setting up a log changes what gets recorded, not who decides what to do. It does not authorize an instrument, workflow, conclusion, decision, or action.

## Entry

Enter only after `SKILL.md` routes the inquiry here and the user agrees to set up a field log. Record that authorization. Do not infer it from the number, strength, or cost of instruments.

## Set up the field log

1. Read [field-log-template.md](field-log-template.md).
2. Record the exact user-authorization pointer and an ISO 8601 opening timestamp with timezone, then distill the Walk, supplied prior chats, and linked records into one field log; do not replay them as transcripts. If a prior chat is not available in context, ask the user to attach it or supply a short summary rather than pretending to have read it.
3. Preserve the original question, goal, current working question, claim kinds, loaded terms, tensions, gaps, session lineage, and user corrections. Keep artifact consent separate from later instrument, workflow, and engine authorization.
4. Record every instrument at `selected` or later: `selected`, `prepared`, `running`, `complete`, or `stopped`. Keep mere offers in the collection plan and ordinary discussion outside the ledger. Only `complete` entries carry empirical readings.
5. Preserve every inherited entry's lifecycle, actual execution seat, context boundary, fallback or downgrade, access delta, control, artifact risk, trace, and user-feedback state. Leave access deltas and readings pending when the lifecycle has not produced them. Never replace history with the card's preferred contract.
6. Ask only for missing facts or corrections. Do not restart with a formal interview.

Use a narrow standalone directory such as `field-trip-<topic>/field_log.md`, or place the trip under an existing Expedition at `<expedition>/field-trips/<trip>/field_log.md`.

## Run the trip

Keep the canonical router, selected instrument queue, and camera/engine boundary from `SKILL.md`: agree on a bounded batch, preserve any user-selected order, run only the selected plan, return bounded readings, register corrections, and update the open gaps. Completing one batch does not cancel the next queued instrument or authorize a fresh menu. Do not execute an entire research program from the first framing without an intermediate error signal.

A simple Field Trip may have only a scope and log. When it needs a collection plan, let the user select, trim, or reorder it. For each gap, record:

- what signal is missing and why it could change the inquiry;
- the smallest fitting instrument or source;
- what counts as enough coverage;
- the main artifact and a proportionate control;
- whether the operation is merely offered or user-selected;
- for a selected sequence, which instruments form the current batch and which are queued next, in user-selected order.

Record coverage and stop rules as editable working controls, not promises to complete a fixed program. Agreement authorizes only the listed instruments and sources. A later calling signal requires a proposed plan change and fresh agreement. Instrument cards still determine execution placement, controls, lifecycle, downgrade, and bounded readout.

## Workflows

A Field Trip may use no named workflow or one or more user-selected workflows. Selecting the trip does not select a workflow. Selecting a workflow authorizes only the operations and artifacts declared by that workflow; extra instruments and unrelated engine work still need separate permission.

Read [dialectic-workflow.md](dialectic-workflow.md) when the user selects the full Electric Monk dialectic.

## Expedition membership

A Field Trip may stand alone or belong to an Expedition. Joining an Expedition adds a pointer in both logs and preserves the trip's original lineage. Do not flatten the Field Trip into the Expedition index or silently rewrite its readings.

## Graph-memory threshold

The field log is usually enough. Add an atlas or wiki only when reusable research, cross-links, several agents, recursion, drift, or context loss makes graph memory useful. Keep the field log as the trip's entry and lineage record.

## Exit

Pause or close the Field Trip when:

- its bounded scope or coverage goal is met;
- one framing is usable for the user's present purpose;
- a real-world observation or experiment is the best next move;
- further probes repeat existing readings;
- the user has enough material even though open questions remain.

Keep the current state in frontmatter and the field log's single Current status section. Update both in place. Append a Status changes line only when the state actually changes among `active`, `paused`, and `complete`; routine continuation, new readings, and new questions to return to do not create status entries. Completeness does not require synthesis. If related Field Trips now need a shared purpose, lineage, or cross-trip index, offer an [Expedition](expedition.md).
