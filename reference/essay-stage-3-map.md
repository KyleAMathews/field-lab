# Essay Stage 3: Map the Essay Space

```yaml
id: essay-map
aim: Produce a varied source-grounded candidate map and compare it with a separately sampled expectation map without ranking candidates.
requires: A user-corrected source survey, frozen source boundary, selected attention policy, and probe budget.
scheduled-instruments:
  required: [editorial-candidate-map, blind-cartography]
  conditional: []
order-rationale: The candidate source track must freeze before any expectation output reaches the orchestrator; otherwise the baseline steers the map it is meant to measure.
operations: Create raw probe files with exact visible inputs; record candidate-map freeze and probe-atlas coverage in the Field Log.
outputs: Source-grounded candidate cards, blind expectation basins, overlay labels, coverage holes, and atlas-induced residuals.
return-point: The user sees the instruments, biases, coverage, empty regions, and candidate count without candidate pitches unless requested.
completion-gate: Both tracks satisfy their cards; the freeze predates probe exposure; raw traces exist; no candidate ranking or validation verdict appears.
branches: [expand-candidate-map, inspect-internal-map, start-validation, revise-brief, stop]
```

## Local order

1. Prepare [`blind-cartography`](instruments/blind-cartography.md): freeze the
   neutral prompt family, editorial coordinates, contexts, and raw-file paths.
   Do not dispatch or read expectation probes yet.
2. Run
   [`editorial-candidate-map`](instruments/editorial-candidate-map.md) from the
   corrected source survey and frozen brief. Record its complete generated
   samples in the Field Log readout.
3. Freeze the candidate map with its candidate IDs, source kinds, support,
   injected choices, and unmeasured regions.
4. Dispatch and complete Blind Cartography. Expectation probes see only their
   assigned sparse prompt and coordinate. They never see source Field Logs,
   candidate cards, desired novelty, or sibling outputs.
5. Store every raw probe under `probes/` and return the card's bounded overlay.

## Gate and return

Report the number of source-grounded candidates, axes covered, source regions
that yielded samples, expected basins, and holes. Keep titles and pitches out of
the default return. Pause for the user's branch choice. A request to fill a
named hole selects another Candidate Map run; do not silently keep generating.
