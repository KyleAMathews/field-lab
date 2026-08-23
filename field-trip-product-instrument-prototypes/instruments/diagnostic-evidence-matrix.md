---
id: diagnostic-evidence-matrix
name: "Diagnostic evidence matrix"
summary: "Test whether within-case evidence merely fits an explanation or actually separates it from live rivals"
use_when: "Several causal explanations compete and accessible source evidence may have different confirming or disconfirming force"
avoid_when: "Do not use before the case, outcome, rival set, source boundary, and distinguishable expected traces are confirmed"
access_target: "Expected traces, source quality, certainty, uniqueness, dependence, and bounded hypothesis updates"
requires: "A confirmed case and outcome, at least two live explanations, distinguishable expected traces, accessible records, and source-preserved observations"
execution_seat: orchestrator
fresh_context: preferred
effort: high
persistence: "Use a Field Log so predictions, sources, evidence dependence, and later revisions remain auditable"
artifact_risk: "Post-hoc smoking guns, favored-hypothesis bias, dependent evidence inflation, and absence inferred from an inaccessible record"
maturity: draft
documented_uses: 0
---

# Diagnostic evidence matrix (`diagnostic-evidence-matrix`)

- **Phenomenon / range / input:** The discriminatory force of within-case evidence among explicit causal explanations. It requires a bounded outcome, a credible sequence of events, live rivals, source-preserved observations, and a chance to state expected traces before evaluating them.
- **Why use it:** Evidence can be consistent with an explanation yet tell us little because every rival predicts it too. This operation separates fit from discrimination and presence from observable absence.
- **Procedure:**
-  0. Classify readiness before evaluating target evidence. Confirm the user's causal question, case boundary, outcome, time range, rival set, source boundary, accessible records, and at least one trace that could discriminate among live explanations. Ask the user to confirm the direction. Return **Prospective** when expectations can be frozen before target evidence, **Post hoc** when the evidence is already known, or **Not runnable** when no live rival, accessible record, or distinguishable trace exists. If the case, outcome, or rival set changes materially after preparation, stop and ask whether the user wants a new run.
  1. Freeze the confirmed case boundary, outcome, time range, and the sequence that is directly supported. Treat chronology as substrate, not causal proof.
  2. State the focal hypothesis, live rivals, combinations where explanations may coexist, and an `other or none` remainder. Record whether rivals are exclusive, coincident, congruent, or inclusive. Challenge the set with the strongest omitted account before scoring evidence.
  3. Before examining the target evidence where possible, state for each hypothesis: the trace expected if it is true; where that trace should appear; whether the record is accessible; which rivals also predict it; and what finding or not finding it would imply. Keep Post hoc expectations labeled and seek fresh evidence for confirmation.
  4. Collect and authenticate observations. Assess source access, authenticity, competence, incentives, bias, measurement accuracy, preservation, and alternative interpretations. `Not found` becomes `absent` only when the trace should exist and the relevant record was accessible.
  5. For each evidence item, assess **certainty**: how strongly the hypothesis expected the trace. Assess **uniqueness**: how poorly live rivals expected it. Use graded reasons, not unexplained scores.
  6. Give the item a provisional diagnostic type: low certainty/low uniqueness (`straw`), high certainty/low uniqueness (`hoop`), low certainty/high uniqueness (`smoking gun`), or high certainty/high uniqueness (`doubly decisive`). Treat these as orientation labels, not proof categories.
  7. Update every affected hypothesis. A finding strengthens one account only to the degree that rivals predicted it less well. A missing high-certainty trace weakens an account only when record access was adequate.
  8. Group evidence by originating witness, document chain, organizational information stream, measurement process, or copied source. Discount dependent repetitions; do not count volume as independence.
  9. Freeze a negative control: one item predicted about equally by every live hypothesis. Confirm that it produces little or no update even if vivid or well sourced.
  10. Return readiness, the matrix, and unresolved discriminating searches. A Post hoc matrix is a downgraded orientation, not prospective confirmation. Do not generalize beyond the case or claim that the rival set is exhaustive.
- **Readout / control:** A readiness status plus a matrix with hypothesis, expected trace, observation, source assessment, record accessibility, certainty, uniqueness, diagnostic type, dependence group, and bounded update. Include the equal-likelihood control, contrary evidence, omitted or untested rivals, and the prospective or post-hoc status of each test. Preserve observation, source claim, and inference as different kinds.
- **Common artifacts:** Selecting rivals after seeing the evidence; treating consistency as diagnosticity; reusing discovery evidence as confirmation; treating inaccessible traces as failed hoops; counting copied reports as independent; calling graded evidence decisive; omitting complementary explanations; moving from one case to a population claim.
- **Escalate / stop:** Stop when readiness is Not runnable, the case or rival set changes after preparation, no plausible trace could discriminate among the remaining accounts, the accessible record is exhausted, or further evidence is merely more of the same dependent kind. Escalate to a substrate map when the event sequence is unreliable or a real-world check when a safe intervention can discriminate. Do not run either without selection.
- **What it requires:** A Field Log, careful source handling, explicit rivals, evidence predictions, and enough time to examine provenance. Fresh research is often useful but requires separate authority.
- **Execution placement:** **Orchestrator, with fresh-context preparation preferred.** Freeze hypotheses and expected traces before exposing a fresh researcher to target evidence when practical. The orchestrator may integrate the source assessments but must preserve which expectations were prospective, post hoc, or generated by the same evidence. Without separation, return a downgraded post-hoc matrix.
- **Donor basis:** David Collier's process-tracing test typology, later Bayesian refinements, and controls for rival relationships and dependent evidence. The transfer keeps case-level limits and graded diagnostic force.
