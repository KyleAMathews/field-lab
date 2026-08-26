---
id: candidate-collision
name: "Candidate Collision Test"
summary: "Whether essay candidates are distinct, nested, sequential, or duplicates"
use_when: "Several validated candidates may be alternate phrasings or sections of one essay"
avoid_when: "Do not use collision to rescue candidates that failed evidence-bearing gates."
access_target: "Candidate identity under evidence, reader, intervention, and form exchange"
requires: "At least two frozen candidates with source, mechanism, evidence, and reader-promise traces"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "One pairwise comparison pass; preserve relationship results with candidate IDs."
artifact_risk: "A neat portfolio fragments one argument, or related essays are collapsed merely because they share evidence."
maturity: draft
documented_uses: 0
---

# Candidate Collision Test (`candidate-collision`)

- **Phenomenon sought:** Whether two essay candidates retain distinct editorial spines when their evidence, readers, interventions, forms, and promised effects are exchanged.
- **Why use it:** Titles and audiences can make one argument look like several. Shared sources can also make genuinely different interventions look redundant.
- **Operating range:** Use only after candidates pass their own applicable validation. Do not merge, rank, or select inside the result.
- **Input:** Candidate cards, source traces, prior-art remainders, mechanisms, evidence ledgers, reader promises, and form hypotheses.
- **What changes:** Controlled exchange removes surface identity cues and tests which relations are load-bearing.

## Procedure

1. Freeze each candidate's claim, causal or narrative spine, evidence, reader promise, intervention, and form.
2. Exchange evidence. Record whether each candidate still works and what breaks.
3. Exchange readers and promises. Record whether the intervention remains distinct or becomes translation.
4. Exchange form and scale. Record whether one candidate becomes a section, example, or short version of the other.
5. Test whether one shared spine can honestly carry both without losing a validated remainder.
6. Classify the relationship as likely duplicate, nested section/application, sequence, shared-evidence distinct essay, incompatible framing, or unresolved.
7. State what evidence or user choice would resolve an unresolved relationship.

- **Result:** Pairwise exchange trace, broken and preserved spines, relationship classifications, combination losses, and unresolved distinctions.
- **Control:** Use the frozen pre-exchange candidates as baselines. A fresh reader may repeat a close pair without titles, but the orchestrator retains provenance.
- **Common distortions:** Shared evidence is mistaken for one argument; packaging differences are inflated; a sequence is created for portfolio neatness; or combining hides incompatible readers.
- **Escalate / stop:** Escalate to user selection for portfolio or form. Stop when every relevant pair has one traced relationship or the set has fewer than two candidates.
- **What it requires:** Pairwise comparison after hard gates; cost grows with candidate count, so apply only to eligible candidates.
- **Execution placement:** **Orchestrator.** It needs every candidate's complete validation trace and must preserve IDs through exchanges. A fresh subagent can audit one close pair. Return relationships without merging or selecting.
