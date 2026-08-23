---
id: ground-condition
name: "Ground-condition probe"
summary: "Material conditions, boundary sensitivity, and their evidence status"
use_when: "A material condition may change the debate, or an explanation may work in the ordinary case but fail at a boundary"
avoid_when: "Do not use to dismiss a real value conflict as logistics."
access_target: "Candidate ground conditions, the model's supported range or boundary break, and their evidence status"
requires: "The live tension or claimed pattern, its ordinary case, and known material conditions."
execution_seat: orchestrator
fresh_context: optional
effort: low
persistence: "A brief pass; can be completed here."
artifact_risk: "A convenient fact dissolves the conflict, or a dramatic edge case is mistaken for an in-range boundary condition."
maturity: practiced
documented_uses: 13
---

# Ground-condition probe (`ground-condition`)

- **Phenomenon sought:** A concrete fact, resource condition, authority relation, level shift, or boundary condition that changes a debate or reveals the supported range of an explanation.
- **Why use it:** A principle-level argument can hide the conditions that produce or constrain it. An explanation built from ordinary cases can also look general because it simplifies the case-specific facts at the system's edges. The probe separates those conditions and exposes a fact, control point, or boundary break that can be checked.
- **Operating range:** Abstract conflicts that may depend on capacity, timing, ownership, incentives, or who decides; explanations whose fit may change with an initial state, interface, raw value, or limiting case. Do not use to dismiss a real value conflict as logistics or to hunt for colorful outliers outside the declared domain.
- **Input:** The live tension or claimed pattern, its ordinary case, and known material conditions.
- **What changes:** Move from stated principles or a middle-case explanation to the conditions that produce, constrain, or delimit it.
- **Procedure:**
  1. Freeze the conflict or claimed pattern, its ordinary-case baseline, and the explanation currently offered for it.
  2. Ask what must be true for the conflict or pattern to exist, who controls each condition, what would happen if it changed, and what evidence could settle it.
  3. When the explanation may hide edge dependence, sort the known material into **dynamics** (the pattern of change being explained), **constraints** (limits, controls, and what can break at extremes), and **boundary conditions** (case-specific facts, starting states, interfaces, or raw values that must be observed rather than inferred).
  4. Select one sourced marginal case or vary one boundary condition while keeping the claimed dynamics and other conditions fixed where possible. Mark the comparison as observed, sourced, user testimony, or hypothetical.
  5. Compare it with the ordinary baseline. State whether the condition changes only the outcome's degree, changes the causal path, or forces a different explanatory model.
  6. Return the model's supported range or boundary break and the missing facts needed to distinguish them. Do not infer generality from the middle or failure from one poorly matched edge case.
  7. Reinsert the original value claims after the level shift and record what remains.
- **Readout:** Candidate ground conditions, controllers, evidence status, source pointers, and conditional question variants. When the boundary pass runs, also return the dynamics–constraints–boundaries map, ordinary baseline, matched boundary case, boundary sensitivity, supported range or boundary break, and unexplained remainder. Do not use a candidate condition to dissolve the original conflict.
- **Control:** Pair every boundary case with the ordinary baseline; reject dramatic cases outside the original domain; keep generated variations separate from evidence; then reinsert the original value claims and note what remains.
- **Common artifacts:** A convenient fact makes the normative conflict vanish; a vivid outlier is mislabeled as a boundary condition; several conditions change at once; or a hypothetical variation masquerades as observed model failure.
- **Escalate when:** A missing fact needs research, or the ground condition has its own contradiction.
- **Stop when:** Checking one fact or changing one condition is the best next step.
- **What it requires:** A brief pass plus any records needed to check the conditions.
- **Execution placement:** **Orchestrator.** It connects the live tension to candidate material conditions. Research subagents may gather a named fact after the probe identifies it; they do not choose the ground condition from the full hidden context. The orchestrator returns conditions, evidence status, and conditional variants without selecting the decisive one.
- **Distinctness:** Unlike [`design-grammar`](design-grammar.md), this probe makes material conditions and boundary sensitivity its main result; it does not extract reusable primitives or generate adjacent forms. A Design Grammar run may hand off a range claim here when the matched case needs separate evidence or a fuller boundary comparison.
- **Provenance:** The boundary pass adapts Venkatesh Rao's [“Boundary Condition Thinking”](https://ribbonfarm.com/2011/01/19/boundary-condition-thinking/). Rao separates dynamics, constraints, and boundary conditions, and argues that theories built from the middle can gain an illusion of understanding when they simplify the raw facts at the periphery. The card turns that heuristic into a bounded comparison with an ordinary-case baseline, evidence labels, and a domain check.
