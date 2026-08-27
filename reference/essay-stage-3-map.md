# Essay Stage 3: Map the Essay Space

```yaml
id: essay-map
aim: Produce a varied source-grounded candidate map and compare it with a separately sampled expectation map without ranking candidates.
requires: A user-corrected source survey, every completed Stage 2 control ledger, recorded Stage 2 waivers, frozen source boundary, selected map-review policy, and probe budget.
scheduled-instruments:
  required: [editorial-candidate-map, blind-cartography]
  conditional: []
handoff:
  completed-stage-2: [editorial-source-survey, loss-audit, residue-collect]
order-rationale: The candidate source track must freeze before any expectation output reaches the orchestrator; otherwise the baseline steers the map it is meant to measure.
operations: Create raw probe files with exact visible inputs; assemble and type the complete Stage 2 handoff; record candidate-map freeze, upstream-input coverage, and probe-atlas coverage in the Field Log.
outputs: A typed Stage 2 input ledger, source-grounded candidate cards, blind expectation basins, overlay labels, coverage holes, and atlas-induced residuals.
return-point: The user sees coverage, gaps, and a compact source-traced sketch of every frozen candidate, then chooses which candidate IDs merit validation.
completion-gate: Every completed Stage 2 control ledger was read and its item statuses were preserved; both tracks satisfy their cards; the freeze predates probe exposure; raw traces and upstream-input coverage exist; every candidate received a compact sketch; no candidate ranking or validation verdict appears.
branches: [select-validation-set, expand-candidate-map, inspect-internal-map, revise-brief, stop]
```

## Local order

1. Prepare [`blind-cartography`](instruments/blind-cartography.md): freeze the
   neutral prompt family, editorial coordinates, contexts, and raw-file paths.
   Do not dispatch or read expectation probes yet.
2. Assemble the complete Stage 2 input ledger before generation. Read the
   corrected Editorial Source Survey and every completed `loss-audit` and
   `residue-collect` readout in full. Record declined controls as waivers, not
   null results. Keep the control ledgers distinct rather than merging their
   findings back into the survey.
3. Preserve every input item's type and status according to the
   [`editorial-candidate-map`](instruments/editorial-candidate-map.md) card.
   Record rejected, excluded, or out-of-bound material as unavailable unless
   the user changes its source status or boundary.
   Do not impose a candidate quota per ledger or treat appearance in a control
   as evidence of usefulness.
4. Run
   [`editorial-candidate-map`](instruments/editorial-candidate-map.md) from the
   complete typed Stage 2 input ledger and frozen brief. Give every generator
   the same handoff ledger with statuses intact, plus only its own coordinate
   assignment. Record its complete generated samples and upstream input IDs in
   the Field Log readout.
5. Freeze the candidate map with its candidate IDs, source kinds, support,
   upstream input IDs, injected choices, and unmeasured regions. Record for
   every Stage 2 ledger item whether generation used it, treated it as a
   constraint or gap, or left it unused; this is coverage, not restoration or
   ranking.
6. Dispatch and complete Blind Cartography. Expectation probes see only their
   assigned sparse prompt and coordinate. They never see source Field Logs,
   candidate cards, desired novelty, or sibling outputs.
7. Store every raw probe under `probes/` and return the card's bounded overlay.

## Gate and return

Report the number of source-grounded candidates, axes covered, Stage 2 input
ledgers read, upstream items used or constrained or left unused, source regions
that yielded samples, expected basins, and holes. Then show one compact sketch
per candidate: stable ID, public question or claim, source anchor, proposed
reader change, form and scale, and chief known gap. Preserve the frozen map
order and do not rank, recommend, validate, or hide candidates. Pause while the
user chooses the validation set, asks to inspect full cards, expands a named
hole, revises the brief, or stops. Record selected IDs and leave every other
candidate preserved as unvalidated.
