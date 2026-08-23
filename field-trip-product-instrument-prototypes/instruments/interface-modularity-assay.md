---
id: interface-modularity-assay
name: "Interface modularity assay"
summary: "Test whether a specific interface is specifiable, verifiable, predictable, and substitutable at a defined performance level"
use_when: "A confirmed architecture claim treats an API, component boundary, vendor split, or outsourced function as modular or necessarily integrated"
avoid_when: "Do not use for broad architecture taste, make-or-buy choice, or a system with no fixed interface, performance target, date, and change evidence"
access_target: "Per-interface modularity, interdependence, coordination burden, performance context, and unresolved coupling"
requires: "A confirmed user outcome, performance tier, system boundary, components, interface, current or proposed state, change evidence, and a documented-but-coupled control"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "Can be done here for one interface; use a Field Log when testing several interfaces, versions, incidents, or substitutions over time"
artifact_risk: "Diagram-induced certainty, equating an API or outsourcing with modularity, and hiding unpredictable cross-effects behind nominal ownership boundaries"
maturity: draft
documented_uses: 0
---

# Interface modularity assay (`interface-modularity-assay`)

- **Phenomenon / range / input:** Whether one interface allows components to be designed or changed independently while the system meets a defined performance requirement. Modularity is relative to an interface, performance tier, date, and expected change; a whole product or firm is not simply modular or interdependent.
- **Why use it:** Architecture diagrams, APIs, vendor contracts, and team boundaries can make a system look modular while conforming changes still cause unpredictable cross-effects or demand repeated bilateral redesign. The reverse also occurs: integrated ownership can contain a genuinely modular interface.
- **Procedure:**
  0. Make a readiness record before classifying the interface. Confirm the question, user outcome, performance requirement, performance tier, system boundary, components, exact interface, owners, assessment date, current or proposed state, representative changes, verification evidence, known failures, and a documented-but-coupled control. Ask the user to confirm the direction. Return **Ready**, **Provisional**, or **Not runnable**. A Provisional run may return a coupling hypothesis and test gaps but no supported modularity status. If the interface or performance target cannot be fixed, stop as Not runnable.
  1. Freeze the interface and performance context. Separate architecture from ownership, outsourcing, team design, and governance. If the components, interface, target tier, date, or current-versus-proposed state changes materially after preparation, stop and ask whether the user wants a new run.
  2. Map the minimum component and responsibility boundary. State what crosses the interface—data, control, semantics, timing, errors, capacity, state, money, or another obligation—and which facts remain implicit or jointly owned.
  3. Establish whether performance is **not good enough**, **good enough**, or mixed for the target users and tier. Use observed outcomes and constraints. This does not decide modularity, but it bounds when tighter integration may offer a performance advantage and when standard interfaces may preserve adequate performance.
  4. Test **specifiability**: can the parties state complete design rules before independent work begins, including semantics, timing, failure behavior, versions, and nonfunctional limits? A document that leaves recurrent negotiation outside the interface is incomplete.
  5. Test **verifiability**: can each side determine conformance through independent tests, measurements, or acceptance criteria? Record manual judgment, hidden environments, shared fixtures, and cases that only end-to-end operation can reveal.
  6. Test **predictability**: when each component conforms, do representative changes produce expected system behavior without unknown cross-effects? Use incidents, change records, compatibility results, and exceptions rather than interface documentation alone.
  7. Test **substitutability** as an observed stress case: can a component implementation be replaced while preserving the interface and target performance without bilateral redesign? Record migration work that belongs inside the interface and coordination that exposes residual interdependence.
  8. Measure coordination burden: joint planning, synchronized releases, exception handling, shared debugging, negotiation, bespoke adapters, and repeated changes on both sides. Distinguish temporary migration cost from stable coupling.
  9. Freeze the negative control: a documented API or outsourced component that requires continuing bilateral redesign or produces unpredictable downstream effects. Confirm that it returns `interdependent`, `mixed`, or `unresolved`, not modular by declaration.
  10. Return readiness and a per-interface status: `modularity supported`, `interdependence supported`, `mixed`, or `indeterminate`. Give separate findings for specifiability, verifiability, predictability, substitutability, performance context, and coordination burden. Do not infer make-or-buy, firm scope, team topology, or an architecture decision.
- **Readout / control:** A frozen interface definition, performance record, crossing-obligations map, four-test matrix, change and incident evidence, coordination ledger, and bounded status. Include the documented-but-coupled control, current-versus-proposed labels, disputed requirements, and the first test that fails.
- **Common artifacts:** Treating microservices, APIs, standards, vendors, or outsourcing as proof; classifying a whole system instead of an interface; ignoring semantics and failure behavior; using design intent as runtime evidence; overlooking synchronized release and shared-debugging work; treating ownership as architecture; and forgetting that modularity depends on performance context and time.
- **Escalate / stop:** Stop when the interface, performance target, components, or assessment state cannot be fixed, when readiness is Not runnable, or when the boundary changes after preparation. Return Provisional when only diagrams or proposed specifications exist. The assay does not choose integration, outsourcing, or organizational structure.
- **What it requires:** Interface and performance evidence, representative changes, conformance tests or incidents, and access to coordination work that formal diagrams omit. One interface should be tested at a time.
- **Execution placement:** **Orchestrator.** Live correction helps expose obligations and coordination that documents omit. A fresh technical reviewer may test the specification or negative case when authorized, but must receive the frozen interface and target performance without the desired status. The orchestrator returns the bounded matrix.
- **Donor basis:** Clayton Christensen, Carliss Baldwin, and Kim Clark's interdependence/modularity theory as developed with Michael Raynor: modular interfaces are specifiable, verifiable, and predictable, while interdependent architectures retain an advantage where performance is not yet good enough.
