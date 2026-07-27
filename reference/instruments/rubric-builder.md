---
id: rubric-builder
name: "Rubric Builder"
summary: "A calibrated rubric that uses close, human-guided inspection of contrasted examples to expose hidden but observable criteria"
use_when: "A person can recognize good and bad examples more easily than they can state the observable criteria behind those judgments"
avoid_when: "Do not use when there are no concrete contrasting examples, the target judgment is unstable, or the setting gives no useful feedback."
access_target: "Hidden but observable criteria, gates, exceptions, and failure boundaries exposed through human-guided specimen inspection"
requires: "One bounded judgment, contrasting examples the person can inspect closely, and at least one example withheld from criterion construction"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "One design and calibration pass can be done here; save a versioned rubric only when the user wants reuse."
artifact_risk: "A small or biased example set can turn taste, prominence, or an easy proxy into a false general rule."
maturity: draft
documented_uses: 0
---

# Rubric Builder (`rubric-builder`)

- **Phenomenon sought:** Hidden but observable differences, exceptions, and failure boundaries that sit behind a person's easier judgments of concrete examples.
- **Why use it:** People often know “this one, not that one” before they can name why. The useful criteria may live in small physical, structural, temporal, or behavioral details that neither a broad values interview nor a generic scorecard will find. This instrument inspects concrete examples with the person, then uses the inspected contrasts to build and test a candidate evaluation rule they can correct and reuse.
- **Operating range:** Use for choices that recur, admit concrete examples, and receive feedback: search, curation, review, design, hiring, planning, or other bounded judgments. It can build a one-off filter or a reusable rubric. Do not use where examples are too few or too similar, the person has no grounds for the labels, the desired quality changes from case to case, or errors will not become visible. Do not use a rubric to hide a moral or political choice behind a score.
- **Input:** One sentence naming the judgment and intended use; at least two positive and two negative or disappointing examples that the person knows well enough to inspect; the setting in which each judgment held; and at least one contrasting example reserved before criteria are built. Three to five examples on each side are better when available. The person need not arrive with reasons already stated: eliciting the hidden grounds is part of the operation.
- **What changes:** The model converts example-level testimony into a candidate set of observable criteria. It introduces boundaries, levels, evidence rules, and perhaps aggregation. These are designed representations, not facts already present in the examples.
- **Procedure:**
  1. **Bound the judgment.** State what the rubric will help filter or compare, for whom, in what setting, and what it must not decide. Keep the person's wording. A one-off rubric is the default; discuss export only after calibration.
  2. **Collect one specimen.** Ask for one positive or negative example and let the person free-write about it if that is easier. Preserve their language and do not ask for several examples or judgments at once.
  3. **Inspect the specimen with the person.** Stay with that example. Ask one question at a time to recover the concrete scene, feature, sequence, physical tell, absence, or consequence that carried the judgment. Useful probes ask what they noticed first, what a superficially similar case lacks, what small change would flip the judgment, and what they would point to if they could not use an evaluative adjective. Do not run a fixed battery; choose the next question from the unresolved part of the prior answer.
  4. **Return an example card.** Separate the person's observations and testimony from their interpretation and the model's criterion hypotheses. Show the short card for correction before treating its hidden grounds as data. Repeat Steps 2–4 for one example at a time.
  5. **Freeze a holdout.** Before comparing across examples, reserve at least one positive/negative pair or one hard boundary case. Its label may define the test, but do not use its detailed explanation to build the rubric.
  6. **Extract discriminating observations.** Compare the inspected derivation examples. Prefer differences that recur across contrasts or explain a sharp boundary. Preserve contradictions and case-specific reasons instead of forcing them into one axis. Ask the person to confirm or correct each proposed hidden criterion in plain language; do not present a large menu for ranking.
  7. **Build the draft rubric.** Use four to seven criteria when the material supports them. For each, write:
     - the question the criterion asks;
     - observable positive and adverse signals;
     - three to five verbal anchors when graded levels help;
     - acceptable evidence and evidence scope;
     - `unknown` when evidence is missing;
     - exceptions or context conditions;
     - the examples that support the criterion.
     Add an eligibility gate, neutral metadata, weights, or an aggregation rule only when the intended decision needs them. Zero must mean observed failure, not missing evidence.
  8. **Audit proxies and suppression.** For each criterion, ask what easy proxy could imitate it and what good case it might hide. Check prominence, vocabulary or register, format, availability of evidence, and correlated criteria. Turn unsupported absence into `unknown`, not a penalty. Require positive evidence for exclusion.
  9. **Run the holdout.** Freeze the draft, apply it to the reserved case without changing criteria mid-score, then inspect the holdout with the person and compare the rubric's reading with the withheld judgment. When useful and available, let a fresh executor see only the frozen rubric and holdout evidence; otherwise mark the control as same-context and weaker.
  10. **Diagnose the miss.** If the rubric fails, identify whether the cause is a missed observable, bad anchor, wrong weight, evidence gap, context shift, retrieval gap, or a genuine exception. Make one traced revision. Do not patch a rule merely to force one example to pass.
  11. **Return the calibrated draft.** Give the rubric a version, state what it filters or compares, include the criteria, evidence rules, holdout result, known exceptions, and unresolved cases. If the user asks to reuse it, export the same tested rule as a skill or other stable artifact; do not silently expand it into a search or decision workflow.
- **Result:** Return the bounded judgment, corrected example cards, derivation/holdout split, candidate criteria with trace back to inspected observations, gates and neutral metadata, proxy-and-suppression audit, holdout result, revision trace, known exceptions, unresolved cases, and current version. Say whether it is fit only for a one-off use or ready for another trial. Do not call it validated from one pass.
- **Control:** The frozen holdout is the main control. Source trace shows which examples support each criterion. An explicit `unknown` state blocks missing-evidence collapse. The proxy-and-suppression audit tests whether prominence, vocabulary, format, or retrievability stands in for the desired quality. A nearby negative case tests overbreadth.
- **Common distortions:** The model may restate the positive examples as criteria, overfit a small set, launder taste into a universal standard, confuse labels with observables, assign false numeric precision, count correlated criteria twice, patch every holdout miss, or let easy-to-find evidence suppress quiet but good cases.
- **Escalate / stop:** Stop when no stable judgment survives across the examples, the person cannot supply grounds for the labels, or calibration requires inventing facts. Collect more examples when a criterion rests on one case. A real search, ranking, choice, or feedback loop requires a separately selected workflow or instrument.
- **What it requires:** A bounded but deep specimen interview plus one construction and calibration pass. Depth comes from following one example's details, not from asking many questions at once. Keep questions one at a time and avoid asking the person to choose among large criterion menus. Preserve the corrected example cards and rubric version if later experience will revise it.
- **Execution placement:** **Orchestrator.** Live contact helps preserve the person's language, context, and corrections. A fresh executor may apply the frozen rubric to the holdout without seeing its label, but returns only that bounded reading; the orchestrator owns construction, comparison, and revision. Without a fresh executor, run the same holdout and mark the weaker separation.
- **Composes with:** [`open-page`](open-page.md) can collect an uninterrupted account before the builder begins, but only when selected. [`framing-sensitivity`](framing-sensitivity.md) can test whether wording changes a rubric result. [`negative-transfer`](negative-transfer.md) can test a rubric moved to a nearby domain. [`real-world-check`](real-world-check.md) can supply later lived feedback. Popularity-neutral retrieval, application across a candidate set, shortlist rendering, and repeated revision belong to an explicit workflow, not to this instrument.
- **Distinctness:** Unlike [`design-grammar`](design-grammar.md), Rubric Builder derives an evaluation rule from labeled contrasts rather than a generative language from one artifact. Unlike [`frame-projector`](frame-projector.md), it does not search for an illuminating two-axis view. Unlike [`attribute-interpolation`](attribute-interpolation.md), it does not generate variants along one declared quality.
- **Provenance:** This Field Lab instrument draws on Kyle Mathews's [“Custom Rubrics for Agentic Search”](https://bricolage.io/custom-rubrics-for-agentic-search/), the calibration history and evidence controls in the Scratch Food Rubrics, and the wider practice of criterion-referenced rubric design. The named card and procedure are a Field Lab construction, not a standard method ported under an established name.
