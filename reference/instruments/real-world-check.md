---
id: real-world-check
name: "Real-world check"
summary: "Try one safe, reversible change and compare what happens with what was expected"
use_when: "A practical uncertainty could be answered by trying one safe, reversible change"
avoid_when: "Do not offer for personal conflict, health or safety questions, choices that are expensive or hard to undo, or anything that affects others without their agreement. Prefer passive observation when it can answer the question."
access_target: "What actually changes after one controlled action"
requires: "A concrete uncertainty, one safe reversible action, an observable signal, agreement from anyone affected, and a review point."
execution_seat: hybrid
fresh_context: optional
effort: variable
persistence: "Brief planning plus time to try the change; offer a Field Log if the observation will return later."
artifact_risk: "The check changes several things, pressures another person, lacks a review rule, or becomes permanent by inertia."
maturity: draft
documented_uses: 0
---

# Real-world check (`real-world-check`)

- **Phenomenon sought:** What actually happens after one small, practical, reversible change.
- **Why use it:** Conversation can predict a response but cannot observe it. A carefully bounded check creates a before-and-after comparison; planning one does not count as evidence.
- **Operating range:** Practical choices with a short feedback loop. Do not use for personal conflict, health or safety questions, expensive or hard-to-reverse choices, or anything that affects another person without their agreement. Prefer passive observation when it can answer the question.
- **Input:** One live uncertainty, the present state, a safe action, an observable signal, agreement from anyone affected, and a review point.
- **What changes:** Change one controllable thing for a named period.
- **Procedure:** Specify one change, duration, starting point, what stays fixed, who will observe what, stop rule, and review point. The user decides whether to try it and performs any real-world action. When they return, compare what happened with the starting point and the expectation fixed in advance. For a one-step observation, use: uncertainty → observation → what each possible result would tell us.
- **Lifecycle:** `prepared` after the check and comparison rule are agreed; `running` while the user tries it; `complete` only after an observation returns. If the user never tries or reports it, do not claim a result.
- **Result:** Before the action: the planned check, starting point, what stays fixed, observation, and stop rule. Afterward: what changed, what else may have changed, what was not observed, and how the result compares with the prior expectation. Do not turn the result into a recommendation unless the user asks.
- **Control:** Change one thing; agree on the period, observer, signal, stop rule, and review point before acting.
- **Common distortion:** Several things change at once, another person feels experimented on, the review rule shifts, or the check becomes permanent by inertia.
- **Stop when:** The observation answers the narrow uncertainty, safety or reversibility fails, someone affected withdraws agreement, or the review point arrives. Do not turn the check into a standing policy without a new decision.
- **Fallback:** If no safe intervention is available, use a passive observation or diary instead and label it observational.
- **What it requires:** Brief planning plus time to try the change; offer a Field Log if the observation will return later.
- **Execution placement:** **Hybrid.** The orchestrator helps define the check from the user's constraints, consent, and ability to observe; the user decides whether to perform the real-world action; the orchestrator compares the returned observation with the starting point and prior expectation. A subagent may research safe ranges, but it must not set or launch the check. If safety, agreement, or reversibility cannot be established, stop and offer passive observation instead.
