---
id: outcome-ablation
name: "Outcome-Specific Ablation"
summary: "The observed effect of removing one component against a frozen control"
use_when: "An analogy, term, example, section, hook, or other component is claimed to cause a named reader outcome"
avoid_when: "Do not infer that a component is useless merely because one tested outcome survives its removal."
access_target: "Controlled difference in one named outcome after one component changes"
requires: "A control artifact, one removable component, a named outcome, and matched evaluator prompts"
execution_seat: parallel-subagents
fresh_context: required
effort: medium
persistence: "One control and variant per outcome; preserve exact texts, prompts, and responses."
artifact_risk: "The variant changes several things, the evaluator guesses the preferred result, or a weak test reports no effect."
maturity: draft
documented_uses: 0
---

# Outcome-Specific Ablation (`outcome-ablation`)

- **Phenomenon sought:** Whether changing or removing one editorial component changes one named reader outcome under a matched comparison.
- **Why use it:** Survival after removal does not show that a component is decorative; it may serve another function. Naming the outcome before the edit makes the causal claim testable.
- **Operating range:** Use for comprehension, transfer, recall, credibility, mechanism recognition, stakes, causal continuity, density, or reproducibility. Do not use to invent or repair theory.
- **Input:** Frozen control, one component, one outcome, matched variant, evaluator population or profile, and identical question.
- **What changes:** One component is removed or replaced while the target outcome and all other material remain fixed.

## Procedure

1. Name the claimed outcome and how the response will show it before editing.
2. Preserve the exact control artifact.
3. Produce one variant that changes only the selected component. Record unavoidable collateral changes.
4. Give control and variant to separate fresh evaluators with the same neutral question. Hide the preferred result and sibling response.
5. Compare observed answers against the named outcome, not general preference.
6. Record claimed-outcome decline, no detected change, alternate-outcome change, evaluator disagreement, and test sensitivity limits separately.
7. Do not decide to keep or cut the component inside the reading.

- **Result:** Control and variant pointers, named outcome, matched prompts, evaluator responses, controlled difference, collateral changes, alternate explanations, and sensitivity limits.
- **Control:** Frozen original, one-variable edit, matched question, sibling-hidden fresh evaluators, and exact trace. Fresh contexts remain model-correlated.
- **Common distortions:** Several edits travel together; placeholder removal damages readability; evaluator style preference replaces the outcome; or no detected difference becomes proof of redundancy.
- **Escalate / stop:** Repeat only when the first test lacked sensitivity or the user selects another outcome. Return a theory gap rather than editing around it. Stop after the selected outcome has a legible comparison.
- **What it requires:** At least two fresh contexts or external readers per comparison. Decision-bearing claims benefit from replicated pairs.
- **Execution placement:** **Parallel subagents required for an agent assay.** Each evaluator sees one version and the same question, never the sibling or desired answer. External human readers provide a stronger world-fit control when available. Without separated evaluators, downgrade to an author comparison and do not call it controlled ablation.
