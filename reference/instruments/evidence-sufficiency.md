---
id: evidence-sufficiency
name: "Evidence Sufficiency Assay"
summary: "Load-bearing claims matched to evidence, confidence, scale, and missing support"
use_when: "A candidate's claim may exceed the evidence available in its source inquiry"
avoid_when: "Do not turn absence of documentary evidence into evidence of absence or erase clearly labeled testimony."
access_target: "Claim-by-claim support, scale fit, adverse evidence, unknowns, and research gaps"
requires: "A frozen candidate and traceable source ledger"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "One claim ledger per candidate; preserve it through design and drafting."
artifact_risk: "Evidence volume substitutes for relevance, or easy-to-cite sources crowd out testimony and local knowledge."
maturity: draft
documented_uses: 0
---

# Evidence Sufficiency Assay (`evidence-sufficiency`)

- **Phenomenon sought:** Whether available evidence supports each load-bearing claim at the scope and confidence the candidate needs.
- **Why use it:** A sourced essay can still overreach when evidence supports only an example, lower scale, different population, or weaker confidence.
- **Operating range:** Use on any candidate whose reader promise depends on factual, interpretive, experiential, or causal support. Do not demand the same evidence kind from every essay form.
- **Input:** Candidate claims, source ledger with claim kinds, prior-art and mechanism results when present, intended scope, and research boundary.
- **What changes:** The assay decomposes the candidate into claims and aligns each with supporting, adverse, missing, and out-of-scope material.

## Procedure

1. List every load-bearing claim and the exact confidence and scale the draft would need.
2. Attach supporting evidence with source pointer, kind, coverage, and relevance.
3. Attach adverse or complicating evidence separately. User agreement and model fluency are not world evidence.
4. Mark evidence that is authentic but indirect, illustrative, at another scale, or dependent on disputed interpretation.
5. Record `unknown` when evidence is missing. Do not use zero, silence, or a proxy as failure.
6. State the largest honest claim the current ledger can support and the exact research that could change it.
7. Reconstruct the candidate using only supported claims; list what disappears.

- **Result:** Claim-evidence ledger, confidence and scale audit, adverse evidence, unknowns, largest honest claim, reconstruction loss, and bounded research gaps.
- **Control:** Source kinds and scope remain unchanged. Reconstruction from supported claims tests whether the candidate's spine survives without unsupported bridges.
- **Common distortions:** Citation count becomes strength; testimony becomes observation; missing data becomes a negative result; or the claim narrows only in footnotes.
- **Escalate / stop:** Hold for research when a named attainable source could close a load-bearing gap. Return for theory when evidence cannot supply a missing explanatory relation. Stop when the supported claim is clear.
- **What it requires:** Exact source trace and claim decomposition; fresh evidence retrieval is a separate authorized branch.
- **Execution placement:** **Orchestrator.** Continuity across source kinds, mechanism, scope, and user corrections is essential. A fresh agent may audit a bounded claim ledger. If source pointers are absent, stop with an untraceable-candidate result.
