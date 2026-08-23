# Prototype test-session protocol

Use one real case per session. Ask Codex to run exactly one local card and record the run in this Field Trip.

Example:

> Run the Crux sieve from `instruments/crux-sieve.md` on the material below. Record the selected run, complete reading, controls, limits, and my feedback in this Field Trip.

## Before the run

Record:

- the local card path in `payload.instrumentCard`;
- the user's exact selection;
- the user's confirmed question or direction;
- the specimen, source boundary, and material omissions;
- any prospective baseline, negative control, or evidence prediction the card requires.

Run the card's readiness gate before preparation. Record its named status and
the evidence for that status. If a card has no named readiness states, use:

- **Ready:** the direction, boundary, minimum evidence, and control are present;
- **Provisional:** the direction is fixed, but the corpus supports only a
  hypothesis record and evidence gaps;
- **Not runnable:** a result-changing boundary, input, or control cannot be
  fixed.

A Provisional run may return only the bounded output the card permits at that
status. It may not produce the card's firm classification, ranking, or leverage
claim. A Not runnable run stops with the missing framing or evidence.

If the case, aim, user, outcome, time state, rival set, or other material
boundary changes after preparation, stop the run and record the residue. Ask
whether the user wants to select a new run under the corrected boundary. Never
continue one run across materially different cases.

Do not select adjacent instruments. Do not treat permission to record as permission to research, synthesize, recommend, or act.

## Required completion record

Every completed run should state:

- **Access delta:** What became visible, separable, measurable, or testable only because this card ran?
- **Readings:** Typed and source-linked claims with `solid`, `plausible`, or `reach` confidence.
- **Control:** Did the baseline or negative case behave as the card predicted?
- **Artifact risk:** What structure might the card have induced, hidden, or overstated?
- **Unmeasured:** What remains outside the reading?

## User feedback

After reading the result, record the user's exact response as one of:

- **User-fit:** The card captured or missed the user's aim, meanings, stakes, or constraints.
- **World-fit:** A source, measurement, observation, or counterexample agrees or conflicts with the reading.
- **Action-fit:** A later trial behaves as predicted or differently.

Agreement alone is user-fit, not evidence that the reading is true.

## Prototype pass conditions

A test supports further development only when the card:

1. exposes a distinct phenomenon not already supplied by ordinary discussion;
2. returns a bounded, inspectable result rather than advice or a general essay;
3. preserves observations, source claims, inferences, and judgments as different kinds;
4. makes its control and refusal case work in practice;
5. states what it induced or could not measure;
6. stops without deciding, recommending, researching, or invoking another instrument unless the user requested that task.

A fluent or useful-looking answer is not enough. Record failures, null results, and off-range refusals; those are the evidence needed to revise or reject a prototype.
