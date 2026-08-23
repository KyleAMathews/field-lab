---
id: wardley-landscape-map
name: "Wardley landscape map"
summary: "Map user-visible dependencies against evidence-bounded evolution from novel to industrialized"
use_when: "A user-confirmed landscape contains dependencies treated as if they were equally visible, certain, or evolved"
avoid_when: "Do not use before the user, need, date, perspective, scope, and current-versus-proposed state are confirmed"
access_target: "A dated user-anchored value chain, evolution placements, disputed positions, inertia, and missing components"
requires: "A confirmed user and need, date, perspective, scope, current or proposed state, dependency evidence, and market evidence or explicit dependency-only status"
execution_seat: orchestrator
fresh_context: none
effort: high
persistence: "Use a Field Log and retain the dependency-only baseline, evidence table, and dated map for later comparison"
artifact_risk: "A polished map with the wrong user or time state, false placement precision, provider needs substituted for user needs, and evolution confused with time or adoption"
maturity: draft
documented_uses: 0
---

# Wardley landscape map (`wardley-landscape-map`)

- **Phenomenon / range / input:** A context-specific, user-confirmed landscape of needs, dependencies, visibility, and movement from novel and uncertain toward industrialized and commonplace. It requires a date, perspective, bounded scope, and an explicit distinction between the observed present and a proposed future.
- **Why use it:** Architecture diagrams show dependency but not how components differ in uncertainty, ubiquity, or suitable treatment. Market matrices show maturity but lose the user-anchored chain. A Wardley map holds both relations in one challengeable artifact.
- **Procedure:**
-  0. Make a readiness record before mapping. Confirm the intended question, user, need, date, perspective, scope, source boundary, and whether the map describes the observed present or an explicitly proposed future. Ask the user to confirm the direction. Return **Ready for evolution**, **Dependency-only**, or **Not runnable**. Use Dependency-only when the chain can be supported but market evidence cannot place components. If no user anchor or dependency chain can be fixed, stop as Not runnable.
  1. Freeze the confirmed frame. State the user's need in outcome terms. Separate user needs from wants and from the provider's financial or organizational needs. If the user, need, date, perspective, scope, or time state changes materially after preparation, stop and ask whether the user wants a new run.
  2. Identify the top-level capabilities that manifest the need. For each capability, ask what activities, practices, data, or knowledge it requires. Recurse until the next layer falls outside scope.
  3. Create the **dependency-only baseline**. Place more user-visible components higher and their dependencies below; draw directed `needs` edges. Write each component once. Record missing or disputed dependencies. Challenge coverage with an alternative route to the same user outcome and any omitted user group, need, or component.
  4. For every component, define the act narrowly enough to assess. Split compound components when their parts have different characteristics. Mark proposed nodes and edges as hypotheses; do not present them as observed current structure.
  5. If readiness is Dependency-only, return the baseline, disputes, and market-evidence gaps without populating the evolution axis.
  6. Assess evolution from evidence of ubiquity and certainty, supported by characteristics such as market form, user perception, comparison basis, knowledge distribution, change rate, and production mode. Do not use elapsed time, internal implementation style, or adoption alone.
  7. Place each component as genesis, custom, product/rental, commodity/utility, a bounded range, or `unplaced`. Preserve the evidence and disagreement. Do not force stage precision.
  8. Add the evolution position to the dependency baseline without changing the original edges. Mark observed movement, inertia, constraints, or relevant flows only when evidence supports them; distinguish each relation visually and in the data table.
  9. Challenge the map with knowledgeable perspectives: missing user needs, missing components, wrong edges, compound nodes, stage evidence, and treatment mistaken for evolution. Preserve unresolved positions.
  10. Freeze a negative control: at least one component with inadequate or mixed evolution evidence. Confirm that it remains ranged or unplaced rather than being forced onto the axis.
  11. Return readiness, the dated map or dependency-only baseline, node/edge data, evidence table, disputes, and map-induced loss. Do not infer gameplay or select an action from position alone.
- **Readout / control:** A readiness record plus a visual landscape or dependency-only baseline and structured nodes (`id`, label, type, visibility, evolution stage or range, evidence, confidence) and edges (`dependent`, dependency, relation, evidence). Include current-versus-proposed labels, the unplaced-component control, coverage gaps, missing observations, and differences introduced by the evolution axis.
- **Common artifacts:** Starting from company capabilities instead of user needs; duplicating nodes; treating technical depth as invisibility; mapping how the organization treats a component instead of market evolution; using time or adoption as the x-axis; forcing consensus; adding climatic patterns or gameplay as facts; assuming the map recommends a move.
- **Escalate / stop:** Stop when readiness is Not runnable or the frame changes after preparation. Return the dependency-only baseline when stage evidence is mixed or absent; an incomplete map is a valid reading. Escalate to a flow-specific instrument only when money, information, risk, or another flow—not dependency—is the remaining question. Gameplay and strategy choice require a separate user request.
- **What it requires:** Collaborative correction, source-labeled market evidence, a durable map artifact, and enough time to decompose compound components. The first pass should favor a useful bounded map over completeness.
- **Execution placement:** **Orchestrator.** Live correction of user need, scope, visibility, and disputed placement creates the access. Fresh specialist evidence may inform a node only when authorized and source-labeled. If visual generation is unavailable, return the node table, edge list, and placement coordinates without claiming a completed map.
- **Donor basis:** Simon Wardley's map construction: user anchor and needs, value-chain dependency and visibility, then evolution from genesis through commodity. The transfer excludes doctrine, climatic patterns, and gameplay from the card's bounded result.
