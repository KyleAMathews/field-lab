---
id: framing-sensitivity
name: "Framing-sensitivity scanner"
summary: "Stable and frame-sensitive components under controlled variants"
use_when: "A result may depend on wording, order, or model"
avoid_when: "Do not compare variants that change the task, or repeat a result whose framing sensitivity cannot affect confidence or action."
access_target: "Stable and frame-sensitive components under controlled variants"
requires: "a bounded probe and one result worth checking"
execution_seat: parallel-subagents
fresh_context: preferred
effort: medium
persistence: "Two or more repeats; a quick check can be done here, while accumulating comparisons may warrant a Field Log."
artifact_risk: "Variants change meaning, correlated models appear independent, or repeated probing launders a preferred answer."
maturity: draft
documented_uses: 0
---

# Framing-sensitivity scanner (`framing-sensitivity`)

- **Phenomenon / range / input:** Which findings survive changes in wording, order, or model; needs a bounded probe and one result worth checking.
- **Why use it:** One run mixes the source material with the wording and model used to examine it. Controlled variants separate stable from frame-sensitive parts.
- **Perturbation / procedure:** Reverse pole order, rename loaded terms, or repeat with another model while changing one variable at a time.
- **Readout / control:** Stable, frame-sensitive, and model-sensitive structure with exact inputs; do not pool adaptive repeats into one frequency claim.
- **Common artifacts:** Variants change meaning, correlated models appear independent, or repeated probing launders a preferred answer.
- **Escalate / stop:** Escalate when decision-critical structure moves. Stop when likely changes no longer alter the action or confidence.
- **What it requires:** Two or more controlled repeats; a quick check can be done here, while accumulating comparisons may warrant a Field Log.
- **Execution placement:** **Fresh subagents preferred.** Each context sees one controlled variant and no sibling outputs; the orchestrator compares them. Freshness is required for claims about framing or model sensitivity because the first result contaminates later judgment. If unavailable, run an orchestrator self-check labeled correlated, not a controlled repeat. Return stable and sensitive elements separately without choosing which framing is correct.
