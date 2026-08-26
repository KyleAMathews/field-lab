---
id: mechanism-discriminator
name: "Mechanism Discriminator"
summary: "The candidate's explanatory sequence and the observation that separates it from nearby accounts"
use_when: "An essay candidate claims to explain why or how something happens"
avoid_when: "Do not force causal machinery onto documentary, literary, personal, or purely interpretive work."
access_target: "Explanatory sequence, nearest alternative, distinguishing evidence, scale match, and weakening observation"
requires: "One frozen candidate, its claimed explanatory scope, and available evidence"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "One analytical pass; preserve with the candidate's validation trace."
artifact_risk: "A plausible story is mistaken for a mechanism, or causal standards dismiss a candidate with another honest function."
maturity: draft
documented_uses: 0
---

# Mechanism Discriminator (`mechanism-discriminator`)

- **Phenomenon sought:** Whether a candidate supplies an explanatory sequence that available evidence can distinguish from its nearest credible alternative.
- **Why use it:** Stakes, correlations, and fluent narratives often look explanatory. A discriminator makes the links, scale, and possible defeater explicit.
- **Operating range:** Use only when the reader promise includes explanation, causation, or prediction. For other essay functions, return `not applicable` with the declared function.
- **Input:** Candidate claim, source support, intended scale, nearest known alternative, and evidence boundary.
- **What changes:** The operation converts a whole claim into ordered links and forces a comparison with a competing account.

## Procedure

1. State the phenomenon and explanatory scope without rhetorical stakes.
2. Write the proposed sequence as actors or parts, conditions, operations, intermediate changes, and outcome.
3. Give every link a source pointer and claim kind. Mark unsupported links.
4. State the nearest credible alternative at equal strength and scale.
5. Identify evidence both accounts predict, evidence that discriminates, and evidence at the wrong scale.
6. Name one observation or counterexample that would weaken the candidate and one that would weaken the alternative.
7. Return a mechanism result only when the distinguishing path is supported; otherwise return description, hypothesis, or unresolved competition.

- **Result:** Proposed sequence, support by link, nearest alternative, shared and distinguishing evidence, scale audit, weakening observations, and result kind.
- **Control:** Equal-strength alternative and link-level source trace. A fresh skeptic may challenge the selected alternative, but later judgment remains separate.
- **Common distortions:** Sequence is inferred from chronology; one vivid case carries a population claim; alternatives are made weak; or missing links are smoothed by prose.
- **Escalate / stop:** Escalate to research for a named distinguishing observation or return for theory when the central link must be invented. Stop when the candidate's function is not explanatory.
- **What it requires:** One careful analytical pass and enough source detail to trace links.
- **Execution placement:** **Orchestrator.** It must hold candidate scope, source kinds, prior-art result, and user-corrected function together. A fresh agent may audit one link or alternative. Without a credible alternative or link support, return the gap rather than a mechanism verdict.
