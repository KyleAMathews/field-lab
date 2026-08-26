# Essay Stage 2: Survey the Source

```yaml
id: essay-survey
aim: Expose traceable editorial signals, omissions, particulars, and gaps without generating essay candidates.
requires: A confirmed Stage 1 brief and validated read-only source Field Logs.
scheduled-instruments:
  required: [editorial-source-survey]
  conditional: [loss-audit when a frozen reduction may have erased single-source material, residue-collect when a named frame may have dropped sourced material]
order-rationale: Source observation must freeze before candidate generation or blind expectation samples can narrow attention.
operations: Record exact source examination coverage and link long source artifacts from the completed readout.
outputs: A typed source-signal register, source coverage map, descriptive source topology, theoretical gaps, evidence gaps, and unmeasured regions.
return-point: The user sees the bounded source survey and chooses whether any named source region needs more examination.
completion-gate: Every signal has source support and claim kind; candidate-body scope and every relevant conditional offer are recorded as selected or declined; no essay candidate, title, pitch, ranking, or portfolio has been produced.
branches: [select-candidate-bodies, run-loss-audit, run-residue-collect, expand-source-survey, start-map, revise-brief, stop]
```

## Local procedure

Read source Field Logs through their validation, inspect, search, and read
commands. Record each examined entry, readout, source, or artifact by exact
coverage. Run
[`editorial-source-survey`](instruments/editorial-source-survey.md) on that
frozen corpus.

When the source includes a completed dialectic, inspect determinate negation
before candidate essays or polished conclusions. List candidate artifacts by
identity and user-recorded status before reading their bodies. Read only the
candidate bodies the user already accepted for source use or selects at the
Stage 2 source-inclusion checkpoint. Return the inventory, explain that polished
candidate bodies may anchor the survey, record `workflow.paused`, and wait for
the exact body IDs the user selects. Record `workflow.resumed` before reading
them. Declined and unselected bodies remain outside examination coverage.

At the return point, explain any calling signal for
[`loss-audit`](instruments/loss-audit.md) or
[`residue-collect`](instruments/residue-collect.md). The user chooses those
branches. Record the offer and `workflow.paused`; run only the selected assay,
then record `workflow.resumed` and rejoin the Stage 2 return with its bounded
readout kept separate from the source survey. A decline is a recorded waiver,
not evidence that no hidden signal or residue exists. Do not run either assay
because omission merely looks interesting.

## Gate and return

Return source coverage, typed signals, their support, source topology and its
breakpoints, gaps, and the main survey distortions. Do not turn the topology
into an outline or call one signal the best essay. Pause and let the user expand
the survey, correct it, start Stage 3, revise the brief, or stop.
