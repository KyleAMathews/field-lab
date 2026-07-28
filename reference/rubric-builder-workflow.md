# Rubric Builder Workflow

Use this workflow when the user wants to turn tacit judgments into a tested one-off or reusable rubric. It coordinates a paced interview, close example inspection, source research, rubric construction, calibration, and optional deployment. A request to “build a rubric,” “design a custom rubric,” or “use the Rubric Builder workflow” selects it when examples and calibration matter.

Selecting the workflow schedules its required instruments and declared operations. It authorizes the named research, construction, and calibration work only after their stage opens. It does not authorize an unrelated search, ranking, decision, export, or real-world action.

## Contents

- [Compact map](#compact-map)
- [Pace and checkpoints](#pace-and-checkpoints)
- [Stage 1 — Frame and split the examples](#stage-1--frame-and-split-the-examples)
- [Stage 2 — Excavate criteria](#stage-2--excavate-criteria)
- [Stage 3 — Freeze and research](#stage-3--freeze-and-research)
- [Stage 4 — Construct the rubric](#stage-4--construct-the-rubric)
- [Stage 5 — Calibrate and challenge](#stage-5--calibrate-and-challenge)
- [Stage 6 — Deployment choice](#stage-6--deployment-choice)
- [Test separation](#test-separation)
- [Completion](#completion)

## Compact map

1. **Frame the judgment** — confirm the recurring choice, intended user, stakes, setting, and limits.
2. **Inspect contrasting examples** — examine one example at a time with the person and preserve corrected example records.
3. **Freeze and research** — preserve the person-derived baseline, then investigate the examples and observable signals without scoring them.
4. **Construct the rubric** — turn confirmed criteria into evidence rules, anchors, gates, exceptions, unknown states, and only the aggregation the intended use needs.
5. **Calibrate and challenge** — apply the frozen draft to holdouts, recover dropped details, and run a fresh failure test before one traced revision.
6. **Choose deployment** — let the user choose a one-off application, reusable export, later field trial, another calibration pass, or stop.

Keep a Field Log only when the user agrees. A Walk may keep the example records and candidate rubric in the conversation. A long research pass, several agents, or feedback returning later is a good reason to offer a log, not permission to create one.

## Pace and checkpoints

- Ask one question at a time throughout human collection.
- Follow the prior answer instead of completing a fixed questionnaire.
- Let the person use an uninterrupted **Open Page** for one example when they choose that mode.
- Show and correct each example record before asking for another.
- Do not present a criterion menu until the example records are corrected.
- Pause before outside research, before a fresh-agent validation batch, and before deployment.
- A stage completion selects the next scheduled stage but does not silently start a new research batch, agent batch, export, search, or real-world action.

## Stage 1 — Frame and split the examples

### Scheduled instrument

- [`focus-interview`](instruments/focus-interview.md)

### Procedure

1. Confirm what recurring judgment the rubric should support, who will use it, and what it must not decide. Reuse answers already in the conversation.
2. Ask for positive, negative or disappointing, and boundary examples one at a time. Three to five on each side is a useful target, not a quota.
3. Record only the example identity, label, setting, and whether the person knows it well enough to inspect.
4. Before deep inspection, reserve at least one positive/negative pair or one hard boundary example as a holdout. Record its label and identity, but do not elicit or research its detailed grounds yet.
5. Present the target statement, example slate, derivation set, holdout set, and missing coverage for correction.

When the user asks you to infer answers from supplied records instead of
answering live, preserve direct testimony, source claim, and conservative
inference separately. Label the result as reconstructed intake. Do not imply
that the person inspected and corrected each example card unless they did.

### Gate

Do not continue unless the person recognizes the target and example split, and at least two contrasting derivation examples can be inspected. Do not use a target rubric, generic best-practice list, or outside research to choose examples.

## Stage 2 — Excavate criteria

### Required instrument

- [`criterion-excavation`](instruments/criterion-excavation.md)

### Conditional instruments

- [`open-page`](instruments/open-page.md) when uninterrupted expression will fit the person better than interviewer-led collection.
- [`term-scan`](instruments/term-scan.md) when one evaluative word carries competing standards that alter evidence.
- [`stake-map`](instruments/stake-map.md) when different users, values, or constraints explain divergent judgments.

### Procedure and checkpoint

Run Criterion Excavation only on the derivation examples. Return each corrected example record before continuing to the next. Complete the cross-example comparison only after the person has corrected the records. Preserve confirmed, rejected, example-specific, and unresolved criteria separately.

Stop at the excavation result. Do not add weights, scores, gates, or evidence rules in this stage.

## Stage 3 — Freeze and research

### Required instrument

- [`neutral-control`](instruments/neutral-control.md)

### Authorized workflow research

1. Freeze the corrected example records and confirmed criterion candidates as the person-derived baseline.
2. Turn unresolved observability questions into a bounded research plan. Name the examples, candidate signals, possible adverse signals, and nearby counterexamples to inspect.
3. Research literal, attributable evidence. Separate current observation, user testimony, source claim, and analyst inference. Research workers retrieve evidence and scope; they do not score, select criteria, or see a target rubric.
4. Prefer observable physical, structural, temporal, behavioral, or consequential signals over self-description. Record when vocabulary, prominence, format, or source availability may suppress a good case.
5. Recompare the research result with the frozen baseline. Mark support, contradiction, missing evidence, and research-induced additions. The outside material may challenge a criterion but cannot silently replace the person's judgment.

### Gate

Do not continue until every retained research claim has a source and scope, unresolved evidence remains `unknown`, and the before/after delta is visible. If outside research cannot observe the desired quality, preserve that limit rather than inventing a proxy.

## Stage 4 — Construct the rubric

This is workflow-authorized synthesis, not an instrument reading.

1. Freeze the intended use and unit of application. Define what one rubric
   reading evaluates before writing criteria. Use four to seven criteria when
   the material supports them.
2. For each criterion, write:
   - the question it asks;
   - observable positive and adverse signals;
   - acceptable evidence and its scope;
   - three to five verbal anchors only when graded levels help;
   - `unknown` for missing evidence;
   - exceptions and context conditions;
   - trace to example records and research.
3. Make decision-driving states mutually exclusive. State what evidence is
   sufficient, how conflicts remain unresolved, and when old evidence must be
   reopened when those choices can change the result.
4. Add eligibility gates, neutral metadata, weights, or an aggregation rule only when the intended decision needs them. Zero means observed failure, not missing evidence. Exclusion requires positive adverse evidence.
5. Audit correlated criteria, easy proxies, register dependence, prominence, format prejudice, and retrieval bias.
6. Return a frozen version-zero rubric with its source trace, known exceptions, and unresolved questions. Do not patch it during holdout scoring.

Use [`attribute-interpolation`](instruments/attribute-interpolation.md) only when the user selects it to inspect one vague graded boundary. It is never a default stage operation.

## Stage 5 — Calibrate and challenge

### Required operations and instruments

1. **Holdout application:** Research only the evidence needed to apply the frozen rubric to the reserved examples. Keep their labels and detailed user grounds hidden from the applicator until the rubric produces its reading. When target or preference leakage is plausible, use a target-blind evidence worker first, freeze its literal ledger, then give only that ledger and the frozen rubric to a separate applicator. Record false positive, false negative, ranking, unknown, and evidence-coverage errors separately.
2. [`loss-audit`](instruments/loss-audit.md): compare the version-zero rubric with each corrected derivation example record and recover supported details lost in compression. Recovery is not automatic restoration.
3. [`hostile-assay`](instruments/hostile-assay.md): give a fresh auditor the frozen rubric, source trace, and success standard but not the preferred repair. Require concrete failure cases and repair conditions.

### Conditional controls

- [`framing-sensitivity`](instruments/framing-sensitivity.md) before an LLM-operated export when wording, order, or model may change application.
- [`negative-transfer`](instruments/negative-transfer.md) when adapting the rubric to an adjacent domain.

### Revision rule

Classify each miss as a missed observable, bad anchor, wrong weight, evidence gap, context shift, retrieval gap, correlated criterion, or genuine exception. Make one traced revision after all scheduled checks return. Do not patch a rule merely to force one holdout to pass. Reapply version one to the same frozen holdout evidence, then state whether the improvement follows a general repair or depends on example-specific testimony. Return version one, the calibration record, unresolved failures, and the difference from version zero.

## Stage 6 — Deployment choice

The user chooses one:

- apply the rubric once to a supplied or separately retrieved candidate set;
- export the tested rule as a reusable skill or artifact;
- prepare a [`real-world-check`](instruments/real-world-check.md) for later lived feedback;
- gather more examples and run another versioned calibration pass; or
- stop with the tested rubric.

Popularity-neutral candidate retrieval, exhaustive search, candidate ranking, publication, export, and real-world action are not automatic consequences of workflow completion. Define their scope and permissions before running them. When model-default candidate generation may hide parts of an open field, offer [`blind-cartography`](instruments/blind-cartography.md); do not schedule it for every rubric.

## Test separation

When testing whether this workflow can reconstruct an existing rubric:

- keep the target rubric and benchmark with an evaluator that does not conduct the interview, research examples, construct criteria, or repair the candidate;
- keep interview, research, and construction executors blind to the target rubric and benchmark;
- before dispatch, identify installed skills, local files, prompt text, or inherited context that could reveal the target. A worker required to load target-bearing material must stop before substantive work; discard any contaminated result;
- when ordinary skill triggering could expose the target, split holdout work into fixed-entity evidence retrieval with no rubric or labels, then bounded no-browse application with the candidate rubric and frozen ledger but no labels;
- give the evaluator only the frozen candidate and its calibration record;
- report exact overlaps, partial recoveries, misses, and invented structure;
- do not revise the workflow or candidate until the first comparison is frozen. If version one is compared later, report its score separately so calibration gains are not mistaken for blind recovery.

Fresh contexts reduce leakage but do not make outputs statistically independent. If the orchestrator has seen the target rubric, it may relay exact user answers and executor questions but must not write the candidate, suggest criteria, or choose research findings during the reconstruction pass.

## Completion

The workflow completes when version one, its source trace, holdout result, loss audit, hostile assay, unresolved failures, and deployment choice have been returned. Record each instrument with its actual execution seat and any downgrade. A planned or running real-world check does not count as a completed observation.
