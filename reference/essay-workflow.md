# Essay Workflow

## Identity and fit

The **Essay** workflow (`essay`) is a human-operated route for finding and
developing an essay from one or more completed Field Trips. It creates its own
Field Trip and treats every originating Field Log as a read-only source. Its
result is an evidence-traced editorial opportunity map and, when the user
chooses to continue, an approved essay draft.

Use it when the user wants to find the essay or essays latent in completed
inquiry material, test whether a proposed essay is worth writing, or develop a
source-grounded candidate into prose. Do not use the full route when the user
already supplied a fixed claim, sources, structure, and transformation; handle
that bounded drafting task directly. Do not use Essay to repair missing theory
or evidence while pretending to edit.

The minimum input is one existing Field Log with enough source trace to inspect.
The workflow always requires a new Field Log. Starting that record and selecting
the workflow are separate user permissions.

## Compact map

1. **Frame the search** — confirm why the essay might matter, possible readers,
   source boundaries, success standard, attention and validation policies, and
   research budget after an orienting full read of the source Field Logs.
   The user sees the frozen editorial brief before source interpretation begins.
2. **Survey the source** — inspect the source Field Logs for traceable editorial
   signals without generating essay candidates. The user sees the source seams,
   omissions, particulars, and unresolved gaps before generation begins.
3. **Map the essay space** — generate a varied, source-grounded candidate map,
   freeze it, and only then compare it with blind expectation samples. The user
   sees coverage and gaps, not candidate exhaust, unless they ask for it.
4. **Validate and select** — test candidates against reconstruction, prior art,
   source transfer, mechanism, evidence, reader value, hostile failure, and
   collision. Reconstruction reports expectedness and collapse risk but never
   ranks or eliminates. The user sees no more than the attention policy allows
   and chooses whether any candidate continues.
5. **Design the essay** — compare outline families that fit the source shape and
   reader goal, let the user choose one, then develop and test concrete
   source-preserving outlines and public packaging within it. The user chooses
   the organizing logic, detailed outline, and packaging before prose begins.
6. **Draft and validate** — transform the frozen evidence and approved design
   into prose, test reader response and semantic drift, then return the draft for
   approval. Publication remains a separate user-authorized action.

The workflow may complete after Stage 4 with a validated map or a no-essay
result. It may also complete after Stage 6 with an approved draft. Completion
does not close either the Essay Field Trip or its source inquiries.

## Stage contracts

Each stage file owns only its local inputs, scheduled instruments, order,
artifacts, return, and completion gate:

1. [Frame the Search](essay-stage-1-frame.md)
2. [Survey the Source](essay-stage-2-survey.md)
3. [Map the Essay Space](essay-stage-3-map.md)
4. [Validate and Select](essay-stage-4-validate.md)
5. [Design the Essay](essay-stage-5-design.md)
6. [Draft and Validate](essay-stage-6-draft.md)

The [instrument map](essay-instrument-map.md) is the sole schedule. Canonical
instrument cards own every substantive operation.

## Entry contract

1. Identify the source Field Log or Logs. Do not change them.
2. Give the compact map above and explain that the work creates a separate Essay
   Field Log, uses fresh agents for blind and reader tests, and pauses before
   each branch that changes the source boundary, research, method, or output.
3. Ask for permission to create the Essay Field Log. Stop. A request to use the
   workflow selects `essay`; it is not artifact consent.
4. After consent, read [field-trip.md](field-trip.md) and
   [field-log-events.md](field-log-events.md). Initialize a narrow Essay Field
   Trip through the bundled writer. Record the initiating comment and the
   workflow selection with their separate exact authorizations.
5. Register each source Field Log's canonical `field_log.jsonl` as a stable
   external source. Preserve its generated `field_log.md` path in provenance.
   Reading a source trip does not join it, resume its workflow, or authorize
   mutation.
6. Read [essay-instrument-map.md](essay-instrument-map.md) and
   [essay-stage-1-frame.md](essay-stage-1-frame.md). Present the Stage 1 opening
   card and stop before examining the source Field Logs. Once the user starts
   Stage 1, read those logs in full as the Focus Interview specimen under the
   read-only source boundary.

If the source belongs to an Expedition, the Essay Field Trip may join that
Expedition only after separate user consent. Expedition membership is useful
navigation, not inherited evidence or permission.

## Record and artifact contract

The Essay Field Log replaces `essay_space.md`, per-essay logs, candidate logs,
and hand-written decision ledgers. Record in it:

- the editorial brief and source boundary;
- source collection and examination coverage;
- every instrument lifecycle and bounded reading;
- candidate IDs, typed source support, validation results, and unresolved gaps;
- the selected attention and validation policies and every later branch choice;
- user corrections, design choices, draft-generated questions, and approval;
- workflow pauses, resumptions, completion gates, failures, and downgrades.

Keep only ordinary working artifacts beside the log:

```text
probes/                 raw context-isolated samples and exact prompts
drafts/                 outlines, drafts, and pre-edit snapshots
sources/                copied transient sources when the writer requires them
essay.md                the approved essay, when one is produced
```

Link long traces from instrument readouts. Do not create another special essay
log or silently make a Markdown artifact authoritative over `field_log.jsonl`.

## Source boundary and return work

The source Field Logs are read-only evidence trails. Record exact examination
coverage in the Essay Field Log. Preserve each imported item's original claim
kind and source pointer; promotion into an essay candidate does not upgrade it.

When survey, design, or drafting exposes missing theory, disputed source
interpretation, or evidence outside the selected research boundary:

1. record the gap as a `return-to` question in the Essay Field Log;
2. state which candidate or passage depends on it and what the essay must not
   assume;
3. pause Essay at the exact stage and artifact;
4. let the user choose whether to start another Field Trip, resume an existing
   source trip, narrow the essay, keep the uncertainty visible, or abandon the
   candidate; and
5. if new work returns, register that Field Log as another read-only source and
   resume only after the user chooses the branch.

Essay never writes a return into the originating Field Log by side effect.

## Authority and lifecycle

Workflow selection schedules the declared route. It does not create the Essay
Field Log, start a stage, widen a source or research boundary, select a
conditional instrument, cross a return point, choose a candidate, approve a
draft, or authorize publication.

### Stage-opening and completion cadence

Before every stage:

1. Say `We are at Stage N of 6` and state the stage's bounded aim.
2. Name the scheduled instruments in ordinary language, the source boundary,
   any research or fresh-agent work, and the artifacts that will be created.
3. State what the user will see at the next return point.
4. Ask whether to start and stop.
5. After agreement, record `workflow.started` for Stage 1 or
   `workflow.resumed` for a later stage, including the stage, promised return,
   and exact user pointer.

At every return point, append the promised readings, run the stage completion
gate, and record `workflow.paused` before asking the user to choose a branch.
The next stage does not start merely because the prior gate passed.

For each gate:

1. enumerate the stage's required instruments, operations, outputs, and return;
2. cite each actual lifecycle, context boundary, control, downgrade, trace, and
   bounded reading;
3. mark each observable condition complete or missing;
4. preserve failures, residue, and unmeasured material; and
5. proceed only after the human selects the next declared branch.

## Attention and validation policy

Stage 1 asks the user to select an attention policy before candidates exist.
The recommended policy is: keep unvalidated candidate exhaust in instrument
readouts, apply the declared validation stack to every candidate that reaches
it, and show no more than three candidates that remain eligible under the
selected brief—or report that none remain.

Stage 1 also freezes how gate readings become workflow states. The recommended
validation policy requires complete applicable gates for eligibility, treats a
null result as support only for the named absence it tested, permits
`not applicable` only when a card's triggering premise or minimum input is
absent, holds incomplete or inconclusive evidence work, returns unresolved
theory or interpretation, and does not resolve conflicting decision-bearing
readings by vote or model confidence. Stage 4 records the exact result and
predeclared rule that bind every state.

When eligible candidates exceed the attention limit, use a predeclared
non-ranking sample. The recommended rule covers distinct collision groups and
candidate-map regions in frozen map order, then uses stable candidate IDs. Keep
the complete eligible set and sampling trace in the Field Log. Surface order is
not a judgment of worth, novelty, or evidence strength.

This policy protects attention without giving Kit authority to abandon an
inquiry. A candidate may be recorded as ineligible under the selected gates,
held for evidence, returned for theory, useful only as orientation, or eligible
for user choice. The user may inspect the full map, change the policy for a
later pass, revive a candidate, or stop. Never change the frozen policy during
validation to preserve a favored candidate.

## Branch contract

| Branch | Observable condition | What it examines or changes | Added work and likely distortion | Rejoin or exit | Human checkpoint |
| --- | --- | --- | --- | --- | --- |
| Revise the brief | The user corrects audience, source boundary, success standard, attention policy, or validation policy | Whether the route is solving the intended editorial problem | Re-run only affected framing; early wording may anchor later work | Stage 1 | Stage 1 return |
| Select candidate bodies (`select-candidate-bodies`) | A completed dialectic contains candidate artifacts not already authorized as sources | Which named bodies enter Stage 2 examination coverage | Reading polished candidates may anchor the survey to prior synthesis | Stage 2 survey | Stage 2 source-inclusion checkpoint before body reading |
| Run a loss audit (`run-loss-audit`) | A frozen reduction may have erased useful material carried by one source | Which sourced items vanished and which reduction rule dropped them | Separate source scans add work and may rescue material merely because it was omitted | Stage 2 return | Stage 2 conditional-instrument offer |
| Collect residue (`run-residue-collect`) | A named frame may have dropped sourced material it cannot absorb | What sourced remainder the frame leaves and why | A remainder pass may mistake interest or missing input for residue | Stage 2 return | Stage 2 conditional-instrument offer |
| Expand the source survey | A named source region remains unexamined and could change coverage | Whether omitted source material contains a distinct signal | More source reading may reward volume or salience | Stage 2 | Stage 2 return |
| Expand the candidate map | A named source, reader, form, or intervention region is empty | Whether the map missed a candidate family | More generation may create cosmetic variety | Stage 3 | Stage 3 return |
| Run negative transfer (`run-negative-transfer`) | A candidate uses a cross-domain mapping as argumentative support | Whether the same mapping discriminates on a preselected nearby negative case | Control selection may be self-serving or the negative case may be too distant | Stage 4 before candidate classification | Per-candidate transfer checkpoint |
| Expand validation research (`expand-validation-research`) | A candidate is held because the bounded prior-art or evidence pass is incomplete | Whether a user-bounded Research Survey or a wider rerun of the affected gate changes its result | Search availability may privilege documented fields; a broad survey may look conclusive | Stage 4, rerunning only affected gates | Stage 4 return |
| Return for theory or evidence | A candidate depends on a new mechanism, interpretation, synthesis, or out-of-scope fact | The load-bearing gap | Another Field Trip may widen the inquiry or delay the essay | Pause; register returned Field Log as a new source | Any stage return |
| Develop a candidate | At least one candidate is eligible under the selected policy | How a chosen candidate can become an essay without losing its support | Presentation work can smooth away source-specific value | Stage 5 | Stage 4 return |
| Choose or revise the outline family | Stage 5 has returned distinct source- and goal-fit organizing logics | Which kind of structure the detailed outlines should use | Family labels may still anchor the user or disguise hybrids | Stage 5 family pass | First Stage 5 return |
| Choose or revise the outline | The selected family has yielded concrete source-traced outlines | Which section sequence and function should govern the draft | Repeated outlining can polish away resistant material | Stage 5 outline pass | Second Stage 5 return |
| Choose or revise the packaging | The selected outline has yielded source-checked titles, subtitles, and descriptions | Which public frame should enter the blind outline checkpoint | Packaging may overpromise or steer the apparent argument | Stage 5 packaging pass | Third Stage 5 return |
| Run outcome ablation (`run-outcome-ablation`) | A design or draft component is claimed to cause one named reader outcome | Whether changing that component changes the named outcome under a matched control | The variant may change several features or miss another useful effect | Stage 5 before the outline probe or Stage 6 final gate | Conditional-control checkpoint in the active stage |
| Run framing sensitivity (`run-framing-sensitivity`) | Wording, order, or model may change a decision-relevant design or draft reading | Which findings remain stable under controlled variants | Variants may change meaning or correlated models may look independent | Stage 5 before the outline probe or Stage 6 final gate | Conditional-control checkpoint in the active stage |
| Revise the design | The user rejects or corrects the selected outline's frame, structure, or packaging | Whether another design better preserves the candidate | Repeated packaging can optimize for familiarity | Stage 5 | Final Stage 5 return |
| Draft the essay | The user approves one evidence-traced design | Whether the approved design works as prose | Drafting may generate unsupported theory or semantic drift | Stage 6 | Stage 5 return |
| Run draft cartography (`run-draft-cartography`) | The draft materially changes its introduction or public packaging | Expected basins, source-specific residuals, and collapse risk in the changed public frame | Model recurrence may look like public opinion, novelty, or quality | Stage 6 cleanup | Draft-prediction checkpoint before cleanup |
| Finish with the map | The user wants no draft, or no candidate remains eligible | Preserve the editorial search without forcing prose | None beyond final trace audit | Complete workflow at Stage 4 | Stage 4 return |
| Approve the draft | The user has read the draft, accepts it, and no load-bearing unsupported marker remains | Final filename and working-note cleanup | Approval is user-fit, not proof of truth | Complete workflow at Stage 6 | Stage 6 return |
| Publish or share | An approved essay exists | External distribution | Irreversible exposure and publication rights | Separate action outside workflow completion | Post-completion request |

Kit may explain why a branch fits the returned evidence. Kit never chooses a
conditional branch, changes the attention or validation policy, abandons a
candidate, or publishes by inference.

A conditional calling signal authorizes only an offer. At the named checkpoint,
record `workflow.paused` and the proposed branch. A selected branch records the
exact user pointer and `workflow.resumed` before work begins. A decline records
a waiver and the unmeasured remainder; it never becomes a null result. After a
selected operation returns its bounded reading, rejoin only at the table's
declared point.

## Re-entry

On a later session, validate and inspect the Essay Field Log before reading
working artifacts. Recover the active workflow ID, lifecycle, stage, promised
return, selected attention and validation policies, source list and examination
coverage, instrument states, branch history, open questions, and artifact
paths. Validate source Field Logs before reading them, but do not resume or
modify their workflows. Ask only for state that the Essay log does not contain.

## Completion and trace

The workflow completes only when one declared completion branch has run and the
Field Log contains every scheduled instrument trace, checkpoint, branch choice,
waiver, unresolved gap, and artifact pointer required by that branch.

## Admission and test

Treat this prototype as a draft workflow. Before raising its status:

1. run it on one real Essay Field Trip with human branch choices;
2. compare the written route with what happened;
3. replay it on a contrasting source Field Trip without repairing the route in
   flight; and
4. preserve both traces, including a no-essay result or other failure shape;
5. judge the complete trajectories against every standing behavior in
   `.agents/behaviors/`, including a positive Stage 5 packaging choice and a
   negative case where Kit takes that branch without the user's selection; and
6. repair the owning workflow, runtime, trace, fixture, or judge layer rather
   than treating a conforming trajectory as evidence of epistemic validity.
