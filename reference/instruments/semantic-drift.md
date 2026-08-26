---
id: semantic-drift
name: "Semantic Drift Assay"
summary: "Meaning changes between a frozen draft and its edited version"
use_when: "Cleanup or revision may have changed claims, confidence, causality, scope, attribution, or reader promise"
avoid_when: "Do not call spelling, formatting, or clearly mechanical corrections semantic changes."
access_target: "Substantive before-and-after changes and the edit that introduced each one"
requires: "A frozen pre-edit snapshot, edited version, and declared meaning invariants"
execution_seat: either
fresh_context: preferred
effort: medium
persistence: "One comparison per material edit pass; keep the snapshot and change ledger."
artifact_risk: "Surface similarity hides a changed claim, or a noisy diff makes harmless edits look substantive."
maturity: draft
documented_uses: 0
---

# Semantic Drift Assay (`semantic-drift`)

- **Phenomenon sought:** Changes in meaning introduced between a frozen artifact and an edited version, especially changes to claim, confidence, causal relation, scope, attribution, and reader promise.
- **Why use it:** Cleaner prose can become less exact. Line diffs expose changed words but do not classify what those changes did to the argument.
- **Operating range:** Use after cleanup, structural revision, or validation edits. It compares versions; it does not judge which meaning is preferable.
- **Input:** Frozen control, edited version, source ledger or approved design, and declared invariants.
- **What changes:** The assay aligns meaning-bearing units across versions and classifies substantive deltas separately from mechanics.

## Procedure

1. Freeze file hashes or immutable paths for control and edited versions.
2. Produce a mechanical diff and group edits into meaning-bearing units rather than isolated tokens.
3. Classify each non-mechanical delta: claim, confidence, causality, scope, attribution, evidence role, reader promise, structure, example function, or unresolved.
4. State before, after, triggering edit, source/design support, and whether the change was authorized.
5. Test reconstruction: can the edited version still reproduce the approved claim, evidence boundaries, and named uncertainty without consulting the control?
6. Record restored, accepted, flagged, and unresolved changes without applying a preferred repair.

- **Result:** Version pointers, mechanical diff, substantive change ledger, reconstruction result, unauthorized or unsupported changes, and unresolved comparisons.
- **Control:** Immutable pre-edit snapshot, declared invariants, and source or design trace. A fresh auditor can reduce author capture.
- **Common distortions:** Every paraphrase becomes drift; summary-level comparison misses local causality; later rationale rewrites the original intent; or the auditor silently restores its preferred prose.
- **Escalate / stop:** Return to design or validation when a load-bearing invariant changed. Ask the user about intentional changes. Stop when each substantive delta has a disposition.
- **What it requires:** Two stable versions and a bounded semantic comparison; no outside research unless a source attribution itself is disputed.
- **Execution placement:** **Either; fresh auditor preferred.** A fresh context sees both versions, invariants, and source trace but not the desired verdict. The orchestrator may run it when exact drafting history matters, while naming self-review risk. Return the ledger without editing either version.
