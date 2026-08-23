---
id: criterion-excavation
name: "Criterion Excavation"
summary: "Human-guided close inspection of contrasting examples that exposes candidate hidden but observable criteria"
use_when: "A person can recognize good and bad examples more easily than they can state the observable criteria behind those judgments"
avoid_when: "Do not use without concrete contrasting examples the person knows well enough to inspect."
access_target: "Candidate hidden but observable criteria and boundary conditions exposed through corrected example records"
requires: "One bounded judgment and at least two contrasting examples the person can inspect closely"
execution_seat: orchestrator
fresh_context: none
effort: medium
persistence: "One example at a time plus a cross-example comparison; keep the corrected example records when another operation will use them."
artifact_risk: "Leading probes or a small example set can turn the model's categories into apparent user criteria."
maturity: trialed
documented_uses: 2
---

# Criterion Excavation (`criterion-excavation`)

- **Phenomenon sought:** Hidden but observable differences and boundary conditions that sit behind a person's easier judgments of concrete examples.
- **Why use it:** People often know “this one, not that one” before they can name why. The useful distinction may live in small physical, structural, temporal, or behavioral details that a broad values interview will miss. Close inspection makes those possible criteria available without yet turning them into a scorecard.
- **Operating range:** Use for recurring judgments that admit concrete positive, negative, disappointing, surprising, or boundary examples. Do not use when examples are too remote to inspect, the person has no experience or evidence behind the label, or the examples share no meaningful comparison setting. Do not use it to decide which inferred criterion is important without the person's correction.
- **Input:** One bounded judgment and at least two contrasting examples that the person knows well enough to inspect. Three to five examples on each side give a stronger comparison, but do not collect them as a questionnaire. Existing records or artifacts may accompany an example; starting outside research belongs to a separately selected instrument or workflow stage.
- **What changes:** Questions direct attention within each example, and the later comparison proposes common distinctions. The instrument creates candidate criteria from testimony and supplied evidence; it does not discover objective properties or build a finished rubric.
- **Procedure:**
  1. **Freeze the judgment.** Preserve the person's current wording for what the examples are examples of, who is judging, and the setting in which the contrast matters. Do not improve the wording.
  2. **Collect one specimen.** Ask for one positive or negative example and let the person free-write about it if that is easier. Preserve their language and do not ask for several examples or judgments at once.
  3. **Inspect the specimen with the person.** Stay with that example. Ask one question at a time to recover the concrete scene, feature, sequence, physical tell, absence, or consequence that carried the judgment. Useful probes ask what they noticed first, what a superficially similar case lacks, what small change would flip the judgment, and what they would point to if they could not use an evaluative adjective. Do not run a fixed battery; choose the next question from the unresolved part of the prior answer.
  4. **Return an example card.** Separate the person's observations and testimony from their interpretation and the model's criterion hypotheses. Show the short card for correction before treating its hidden grounds as data. Repeat Steps 2–4 for one example at a time.
  5. **Compare corrected examples.** Preserve contradictions and case-specific reasons. Propose only distinctions that recur across contrasts or explain a sharp boundary. For each proposed criterion, trace it to the exact observations, testimony, and examples that induced it.
  6. **Test the wording with the person.** State each candidate criterion in plain language and ask for correction one at a time. Ask for a counterexample when a criterion appears broad. Do not ask the person to rank a large menu.
  7. **Return the excavation.** Keep confirmed, rejected, revised, example-specific, and unresolved candidate criteria separate. Do not add levels, weights, gates, evidence policies, scores, or recommendations.
- **Result:** Return the frozen judgment, corrected example cards, candidate criteria with trace to inspected details, counterexamples and boundary conditions, rejected hypotheses, contradictions, and unresolved questions. These are inputs to later construction, not a rubric.
- **Control:** Human correction of every example card and candidate criterion is the main control. Source trace exposes model-added categories. A counterexample tests overbreadth. Keeping example-specific details separate prevents one vivid case from becoming a general rule.
- **Common distortions:** The model may ask leading questions, mistake fluent explanation for observation, restate positive examples as criteria, overfit a small set, smooth contradictions, or make its own categories appear user-supplied.
- **Escalate / stop:** Stop when the person cannot inspect the examples further, no stable distinction survives correction, or the next question would merely repeat a theory. More examples, outside research, rubric construction, ranking, and testing need separate authority.
- **What it requires:** A deep but paced interview. Depth comes from following one example's details, not from asking many questions at once. Keep questions one at a time and preserve the corrected example records when another operation will use them.
- **Execution placement:** **Orchestrator.** Live contact and responsive correction create the access. A subagent may re-scan frozen example cards later, but cannot replace the interview. If the person cannot respond, stop with the supplied account and name the limitation.
- **Composes with:** [`open-page`](open-page.md) can collect one uninterrupted example account before excavation, but only when selected. [`term-scan`](term-scan.md) can separate a loaded evaluative word after examples expose competing meanings. [`stake-map`](stake-map.md) can examine conflicting values or affected people. The [Rubric Builder workflow](../rubric-builder-workflow.md) uses this instrument before research and rubric construction.
- **Distinctness:** Unlike [`focus-interview`](focus-interview.md), this instrument inspects the grounds of several concrete judgments after the aim is known. Unlike [`design-grammar`](design-grammar.md), it extracts evaluative distinctions rather than generative rules. Unlike [`attribute-interpolation`](attribute-interpolation.md), it does not generate variants or assume one declared axis.
- **Provenance:** This Field Lab instrument draws on contrastive elicitation, cognitive interviewing, and Kyle Mathews's [“Custom Rubrics for Agentic Search”](https://bricolage.io/custom-rubrics-for-agentic-search/). The named card and procedure are a Field Lab construction, not a standard method ported under an established name.
