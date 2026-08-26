# Essay Stage 4: Validate and Select

```yaml
id: essay-validate
aim: Test every candidate in the frozen source-grounded map under the attention and validation policy, then return only eligible candidates within the user's attention limit—or none.
requires: A frozen source candidate map, completed expectation atlas, user-selected validation policy, and bounded research authorization.
scheduled-instruments:
  required: [blind-cartography, prior-art-subtraction, source-transfer-assay, mechanism-discriminator, evidence-sufficiency, reader-promise, hostile-assay, candidate-collision]
  conditional: [negative-transfer when a cross-domain mapping carries argumentative support, research-survey when the user selects expanded validation research for a broad evidence landscape]
order-rationale: Cartography records expectedness and collapse risk before research without ranking or eliminating candidates; prior art and source validity precede mechanism, evidence, reader value, hostility, and collision; motive applies only after evidence-bearing gates.
operations: Apply the user-selected attention policy without changing it; record one eligibility state and binding trace per candidate; relate but do not rank eligible candidates.
outputs: Candidate-specific gate traces, eligibility states, unranked eligible candidates, held and returned gaps, and a no-essay result when applicable.
return-point: The user sees zero to the selected maximum eligible candidates and chooses development, more research, theory return, full-map inspection, map-only completion, or stop.
completion-gate: Every surfaced candidate has completed every applicable card; every relevant negative-transfer offer is selected or declined; every hidden candidate has a preserved state and binding reason; no held or returned candidate is presented as eligible.
branches: [run-negative-transfer, develop-candidate, expand-validation-research, return-for-theory, inspect-internal-map, finish-with-map, stop]
```

## Local order

1. Use adaptive, candidate-border
   [`blind-cartography`](instruments/blind-cartography.md) on candidates whose
   initial overlay is unclear. A close expectedness reading needs at least three
   fresh probes with meaning-preserving prompts. Record expected basins,
   source-specific residuals, and collapse risk. Expected recurrence is not
   historical novelty, quality, or eligibility; this reading cannot rank,
   eliminate, clear, or fail a candidate.
2. For every candidate in the frozen source-grounded map, run
   [`prior-art-subtraction`](instruments/prior-art-subtraction.md),
   [`source-transfer-assay`](instruments/source-transfer-assay.md),
   [`mechanism-discriminator`](instruments/mechanism-discriminator.md),
   [`evidence-sufficiency`](instruments/evidence-sufficiency.md), and
   [`reader-promise`](instruments/reader-promise.md).
3. When transfer does argumentative work, offer
   [`negative-transfer`](instruments/negative-transfer.md) at the declared
   per-candidate transfer checkpoint. Name the mapping and proposed nearby
   negative case, record `workflow.paused`, and wait. If selected, record
   `workflow.resumed`, run the assay, and rejoin Stage 4 before assigning that
   candidate's state. If declined, preserve the waiver and keep the candidate
   held; declining the control does not count as a negative result.
4. Give each candidate separately to
   [`hostile-assay`](instruments/hostile-assay.md). Keep sibling candidates and
   preferred outcomes hidden.
5. Run
   [`candidate-collision`](instruments/candidate-collision.md) only across
   candidates that remain eligible. It maps relationships and cannot rescue a
   failed candidate.

At the Stage 4 return, a held candidate may call for
`expand-validation-research`. This calling signal authorizes only an offer. If
the user selects the branch, freeze the candidate, exact gap, research question,
intended downstream gate, expanded scope, depth, source boundary, budget, and
stop rule before work begins.

Use `research-survey` when the gap requires a broader, source-traced evidence
landscape. Save its portable record under `sources/validation/` and preserve its
coverage and conflict limits. When one existing gate merely had too narrow a
search, rerun that card's own research procedure within the new boundary instead
of forcing a survey. Rejoin Stage 4 by rerunning only the affected gates. Keep
the earlier readings; expanded research does not make the candidate eligible by
itself.

Record one state under the frozen policy:

- **eligible for user choice**;
- **held for named evidence or research**;
- **returned for theory or disputed interpretation**;
- **orientation only under this brief**; or
- **ineligible under a named gate**.

These are workflow states, not claims about timeless value. Do not delete a
candidate or present the state as the human's decision to abandon it.

## Apply the frozen validation policy

Before the first validation run, restate the Stage 1 policy as an explicit gate
table. For each required and selected conditional instrument, name the input
that makes it applicable, the result that can clear its gate, and the findings
that bind a candidate to `held`, `returned`, `orientation only`, or
`ineligible`. Freeze the table before reading any candidate result.

Unless the user selected a different policy in Stage 1, apply this default:

- Blind Cartography never binds eligibility. Its expectedness and collapse-risk
  reading may guide later questions, but only prior-art and evidence-bearing
  gates can establish a disqualifier;
- `eligible` requires complete traces for every applicable gate and no binding
  hold, return, orientation, or ineligibility result;
- a valid null result clears only a probe for a named failure; it does not
  supply the positive support required by an affirmative evidence, mechanism,
  source, or reader-value gate;
- `not applicable` is valid only when the card's triggering premise or minimum
  input is absent, with that absence and its effect on the candidate recorded;
- missing, stopped, downgraded beyond the card's allowed fallback, or
  inconclusive evidence-bearing work leaves the candidate `held`;
- unresolved source interpretation or a need for new theory leaves the
  candidate `returned`;
- conflicting decision-bearing readings remain `held` or `returned`, according
  to whether evidence or interpretation would resolve them. Agreement counts,
  averages, or model confidence may not break the tie; and
- a candidate becomes `ineligible` only through a disqualifier named in the
  frozen table. Record the exact reading and rule that bind the state.

Assign the single presentation state in this order: an established named
disqualifier makes the candidate `ineligible`; otherwise an unresolved theory
or interpretation makes it `returned`; otherwise incomplete or inconclusive
evidence work makes it `held`; otherwise a complete candidate that cannot carry
a standalone essay under this brief is `orientation only`; all remaining
candidates are `eligible`. Preserve every underlying result. Classification
does not erase or settle conflicts.

After collision mapping, apply the frozen overflow rule to eligible candidates.
The recommended rule is coverage-first: take one candidate from each distinct
collision group and candidate-map region in frozen map order, then continue in
stable candidate-ID order until the attention limit is reached. Do not use
novelty, promise, evidence strength, prose appeal, motive, or Kit's preference
to choose the surfaced set. Record the eligible count, surfaced IDs, overflow
IDs, sampling steps, and full-map inspection branch.

## Gate and return

For each surfaced candidate, return its public claim, remainder after prior-art
subtraction, mechanism and evidence, reader promise, why it remains eligible,
chief unresolved risk, and sampling reason. State how many eligible candidates
remain in overflow without implying that surfaced candidates are better.
Return relationships without ranking. If none remain, say so directly and
preserve the internal map. Pause for the user's branch choice.
