---
id: home-frame-leak
name: "Home-frame leak detector"
summary: "Structure a fresh reader can see without the home frame"
use_when: "Home vocabulary may hide assumptions"
avoid_when: "Do not claim a blind reading when field clues cannot be stripped or no fresh context is available."
access_target: "Structure a fresh reader can see without the home frame"
requires: "a structural sketch that can be stripped of field clues"
execution_seat: fresh-subagent
fresh_context: required
effort: medium
persistence: "One fresh agent plus analysis; session on a Walk, preserve prompt and output in a Field Trip."
artifact_risk: "Abstraction erases the field's epistemic or moral register; generic structural patterns look profound."
---
# Home-frame leak detector (`home-frame-leak`)

- **Phenomenon / range / input:** Assumptions visible only after home vocabulary is removed; needs a structural sketch that can be stripped of field clues.
- **Unaided limit / access differential:** Home expertise reproduces home categories. Blind abstraction exposes presuppositions and axes that do not depend on recognizing the field.
- **Perturbation / procedure:** Strip field names, proper nouns, home jargon, verdict cues, and desired outcomes from the specimen while preserving actors, relations, constraints, sequence, and stakes. Give only that structural sketch to a fresh agent. Ask it for presuppositions, deep axes, omitted positions, and failure conditions, then ask it to guess the source domain. If it identifies the domain, re-strip once and rerun with a new agent. Return only readings that survive the leak check.
- **Readout / control:** Leak check, assumptions, axes, and third-pole candidates. If the first agent identifies the home domain, re-strip and retry once. If the second agent still identifies it, stop: record the specimen as not blindable at this abstraction, discard both structural readings, and use only the named sighted-assumption fallback or carry the gap. Do not keep dispatching until an agent happens not to guess.
- **Common artifacts:** Abstraction erases the field's epistemic or moral register; generic structural patterns look profound.
- **Escalate / stop:** Escalate when a candidate axis survives return to the specimen. Stop when it only renames known structure.
- **Cost / persistence:** One fresh agent plus analysis; session on a Walk, preserve prompt and output in a Field Trip.
- **Execution placement:** **Fresh subagent required.** It sees only the stripped structural sketch and must not see the home domain, user history, intended answer, or other agents' readings. Blindness creates the access differential. If no fresh context is available—or two leak checks show that the specimen cannot be stripped far enough—downgrade to a sighted assumption scan and do not call it `home-frame-leak`. The orchestrator performs the leak check and returns the surviving raw outputs without explaining their significance.
