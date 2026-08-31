# Essay Stage 5: Design the Essay

```yaml
id: essay-design
aim: Let the user choose a source- and goal-fit outline family, then a concrete source-preserving design, before prose begins.
requires: One eligible candidate selected by the user, its complete validation trace, a source-topology reading, a reader goal, a bounded design brief, and any explicitly selected external writer-voice profile.
scheduled-instruments:
  required: [editorial-design, blind-cartography]
  conditional: [outcome-ablation when a component has a claimed load-bearing effect, framing-sensitivity when wording or order may change the candidate]
order-rationale: Candidate support and remainder must be frozen before presentation generation; design options precede component tests; public-facing packaging freezes before blind outline probes.
operations: Run editorial-design in separate family, outline, and packaging passes; pause for the user after each pass; save the selected outline and packaging under drafts; freeze the writer-voice selection after packaging; record each user choice and unresolved source material in the Field Log.
outputs: Unranked outline families, concrete outlines within the selected family, source trace and losses, packaging, writer-voice selection, component-test results, outline expectation overlay, and one user-approved design or a chosen return.
return-point: The user first sees outline families and their fit; then concrete outlines and losses; then packaging options; then the complete design, collapse risk, and research gaps before approval.
completion-gate: The user explicitly chose an outline family, one concrete outline, and its public packaging before approving the complete design; the general writing guide and either no external profile or one explicit profile pointer are frozen; its sections trace to evidence; theoretical gaps are returned rather than patched; every relevant conditional control is selected or declined; probe and selected-control traces are complete.
branches: [choose-outline-family, revise-outline-families, choose-outline, revise-outline, choose-packaging, revise-packaging, run-outcome-ablation, run-framing-sensitivity, approve-design, return-for-theory, broaden-research, return-to-validation, stop]
```

## Local order

Re-anchor the selected candidate from its Field Log readings: source signals,
source topology, prior-art remainder, mechanism, evidence, reader goal and
promise, expected basins, and known distortions.

Run [`editorial-design`](instruments/editorial-design.md) in its three declared
passes and preserve each pass as a separate instrument lifecycle and artifact:

1. Run the family pass, return its bounded result, record `workflow.paused`, and
   wait for an exact family choice, revision, combination, rejection, or stop.
2. Record `workflow.resumed` with that user pointer, freeze the chosen family,
   run the outline pass, return its bounded result, and pause for an exact
   outline choice. A family choice is not outline approval.
3. Resume with that pointer, freeze the chosen outline, run the packaging pass,
   return its bounded result, and pause for an exact packaging choice. An
   outline choice does not select its public frame.

Save every option and selected artifact under `drafts/`. Record each exact
choice, correction, loss, misfit, and artifact pointer in the Field Log. After
the packaging choice, resume with its user pointer and freeze that selection.

Freeze the drafting rules at the same checkpoint. Read the
[general writing guide](writing-guide.md) for every essay and the
[external writer-voice profile contract](writer-voice-profiles.md). If the user
explicitly selected a profile, record its path or repository URL and available
version, commit, or content hash. Otherwise record `no external profile` and do
not interrupt the workflow to solicit one. Do not copy personal profile content
into the Essay Field Log or this repository.

If an
analogy, term, hook, example, or section is claimed to cause a named result,
explain and offer
[`outcome-ablation`](instruments/outcome-ablation.md). If wording or order may
change a decision-relevant reading, offer
[`framing-sensitivity`](instruments/framing-sensitivity.md).

Treat these as a conditional-control checkpoint before the blind outline probe.
Name the trigger, proposed input, added work, and likely distortion; record
`workflow.paused`; and wait for the user to select or decline each relevant
control. Record `workflow.resumed` before a selected run. Return each bounded
readout without keeping or cutting a component or choosing a frame, then rejoin
Stage 5 before the blind outline checkpoint. Record a decline as a waiver and
preserve the unmeasured effect or sensitivity.

After the user provisionally chooses the packaging, freeze its title,
subtitle, and section headings. Run the outline checkpoint through
[`blind-cartography`](instruments/blind-cartography.md) with at least three fresh
probes that see only those public elements. Compare the result with the frozen
candidate remainder; do not infer that unfamiliarity means quality.

## Gate and return

At each internal return, show only what the user must choose next: families at
the first, concrete outlines at the second, and packaging at the third. At the
final return, show the
candidate anchor, chosen family, complete design, source and evidence by
section, known losses, residual misfits, writer-voice selection, component-test
results, outline overlay, and collapse risk. Pause. Stage 6 requires explicit
approval of the complete design; a request for revision, research, theory
return, revalidation, or stop selects a different branch.
