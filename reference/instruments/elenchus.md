---
id: elenchus
name: "Stake and assumption mapper"
summary: "Answerable assumptions, commitments, testimony, and gaps"
use_when: "Hidden premises, stakes, history, or belief load need deeper elicitation"
avoid_when: "Avoid turning a fact lookup into an interview."
access_target: "Answerable assumptions, commitments, testimony, and gaps"
requires: "the user's account and room for questions"
execution_seat: orchestrator
fresh_context: none
effort: medium
persistence: "A longer conversation; can stay here or be recorded in a Field Log."
artifact_risk: "The interview follows the orchestrator's preferred frame; repeated questions create frustration or apparent depth."
maturity: practiced
documented_uses: 11
---

# Stake and assumption mapper (`elenchus`)

- **Phenomenon / range / input:** Hidden premises, stakes, history, and belief load in a live question; needs the user's account and room for questions. Avoid turning a fact lookup into an interview.
- **Why use it:** A volunteered account follows the user's current frame. Carefully chosen contrasts make tacit premises and incompatible commitments answerable one at a time.
- **Perturbation / procedure:** Socratic questions direct attention toward contradictions and omitted context. Conduct a responsive framing conversation, not a questionnaire. Ask at most one question at a time, but do not require the user's next move to be an answer: they may redirect the inquiry, supply a source, ask for a bounded comparison or generated possibilities, or challenge the emerging frame. Follow that move when it can expose assumptions, commitments, alternatives, or gaps, then reflect what it changed before continuing. Use questions to clarify the claimed aim, test a concrete case, expose the premise that links the case to the claim, ask what evidence or experience supports it, and test whether another stated commitment conflicts with it. Label generated possibilities as probes rather than user testimony, evidence, or conclusions. Stop when the user-confirmed assumptions, stakes, constraints, and highest-value gap are explicit.
- **Readout / control:** Assumptions, testimony, constraints, stakes, and gaps; distinguish what the user said from what the question wording elicited.
- **Common artifacts:** The interview follows the orchestrator's preferred frame; repeated questions create frustration or apparent depth.
- **Escalate / stop:** Escalate when a live contradiction needs committed belief or systematic research. Stop when the question or next observation is clear.
- **What it requires:** A longer exchange with room for the user to answer and correct the emerging map.
- **Execution placement:** **Orchestrator.** It conducts the live interview and sees the user's prior corrections; continuity is the reason for this seat. A subagent may draft questions from a bounded brief but may not interpret unconfirmed testimony. If live contact is unavailable, return gaps rather than a completed elenchus. The orchestrator returns the testimony, assumptions, and gaps for user correction without explaining them.
