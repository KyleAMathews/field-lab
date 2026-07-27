---
id: design-grammar
name: "Design grammar extractor"
summary: "Candidate primitives, invariants, combination rules, adjacent forms, and decomposition loss"
use_when: "A fixed artifact or system may hide a reusable language of possible forms"
avoid_when: "Do not use when the whole's key properties cannot survive decomposition or when mere variation is mistaken for evidence."
access_target: "Primitives, invariants, combination rules, adjacent forms, and certainties lost"
requires: "One grounded artifact or system with enough source detail to trace its parts and rules"
execution_seat: orchestrator
fresh_context: optional
effort: high
persistence: "One bounded extraction and reconstruction pass; use a Field Log when the source or variants must remain traceable."
artifact_risk: "False primitives, invented rules, combinatorial junk, and erasure of properties that belong to the whole."
maturity: trialed
documented_uses: 1
---

# Design grammar extractor (`design-grammar`)

- **Phenomenon:** A fixed artifact or system may contain a reusable design language: smaller parts, stable constraints, and rules that can reconstruct the source and generate nearby forms.
- **Why use it:** A finished form hides which features are essential, which can vary, and which combinations remain members of the same family. A candidate grammar makes those claims visible and testable.
- **Range / input:** Use one grounded artifact or system with enough source detail to trace its parts, relations, constraints, and behavior. Do not begin with several donor systems.
- **What changes:** The instrument turns one fixed arrangement into a candidate set of primitives, invariants, combination rules, and bounded adjacent forms. It marks every inferred rule and every property lost in decomposition.
- **Procedure:**
  1. **Freeze the source.** Name the artifact or system, record its current arrangement, attach source pointers, and list properties that must survive any account of it.
  2. **Separate observation from inference.** Record observed parts, relations, operations, and constraints. Mark inferred functions or boundaries.
  3. **Propose candidate primitives.** Identify smaller reusable units with source links. Call them candidates, not atoms or fundamental parts.
  4. **Extract invariants and rules.** State what must remain fixed, what can vary, which units can combine, and which transitions are allowed. Mark each rule that the analyst adds rather than finds. When candidate rules conflict, record the conflict. Record a priority only when the source supports it; otherwise mark the priority unresolved and preserve both branches.
  5. **Run the reconstruction control.** Use only the proposed primitives and rules to rebuild the source arrangement. Revise or stop if the grammar cannot account for it.
  6. **Test the boundary.** Name one nearby artifact or state that the grammar should not generate. If it does, the grammar is too broad.
  7. **Generate a small sample.** Produce three to five structurally distinct adjacent forms. For each, name the changed variables, preserved invariants, source support, new structure, and loss. When a form depends on an unresolved rule conflict, show the alternative branches or omit the form; never choose a priority silently. Do not rank the forms unless asked.
- **Result:** Return the frozen baseline, candidate primitives, invariants, combination rules, rule conflicts, source-backed priorities or unresolved priorities, reconstruction result, negative case, adjacent forms, injected rules, lost whole-properties, and unresolved questions. Treat generated forms as samples, not discoveries, predictions, or recommendations.
- **Control:** Reconstruction is the main control. The negative case tests overbreadth. The rule-conflict register prevents the grammar from supplying a missing synthesis. Source pointers, explicit inference labels, and the preservation list expose unsupported structure and decomposition loss.
- **Characteristic distortions:** The analyst may rename current components and call them primitives, invent a neat grammar or a missing priority rule, produce cosmetic variants, confuse combinatorial possibility with desirability, or erase properties that arise only from the whole.
- **Escalate / stop:** Escalate when one generated form needs comparison, testing, or evaluation by another instrument. Stop when the source cannot be reconstructed, rules lack source trace, variants differ only in style, or a key whole-property disappears without a stated loss.
- **Effort and burden:** High model effort; low source-person burden when the source is settled. Ask for missing source facts one at a time. Do not make the user judge each primitive or variant during extraction.
- **Execution placement:** **Orchestrator.** The operation needs the complete source baseline, preservation list, candidate grammar, and controls in one view. A fresh agent may challenge one bounded rule set, but the orchestrator owns source trace and reconstruction.
- **Distinctness:** Unlike [`structural-recombine`](structural-recombine.md), this instrument extracts a reusable language from one system rather than joining parts from several sources into a new arrangement. Unlike [`frame-projector`](frame-projector.md), it does not impose a two-axis projection. Unlike a focal-length or attribute sweep, it generates several structural combinations instead of varying one declared dimension.
- **Provenance:** This card is a Field Lab adaptation of Venkatesh Rao's account of **oozification**, especially the move from specific technological “texts” to design grammars and then languages. Rao did not publish this card or a named method with this procedure. See [“Oozy Intelligence in Slow Time”](https://contraptions.venkateshrao.com/p/oozy-intelligence-in-slow-time) and [“Fear of Oozification”](https://contraptions.venkateshrao.com/p/fear-of-oozification).
