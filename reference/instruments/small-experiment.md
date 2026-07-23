---
id: small-experiment
name: "Small experiment"
summary: "A frozen trial and, later, its observed contrast"
use_when: "One safe, cheap, reversible change can contact the world"
avoid_when: "Do not use for unsafe, irreversible, or high-cost trials."
access_target: "A frozen trial and, later, its observed contrast"
requires: "The decision, one uncertain mechanism, constraints, and a safe range."
execution_seat: hybrid
fresh_context: none
effort: variable
persistence: "Usually 1–2 planning turns plus real-world elapsed time; session only unless the observation will return in a later session."
artifact_risk: "The trial changes several things, lacks a review rule, or becomes permanent by inertia."
---
# Small experiment (`small-experiment`)

- **Phenomenon sought:** How a system responds to one cheap, controlled, real-world change.
- **Unaided limit / access differential:** Conversation can predict a response but cannot observe it. The bounded trial makes a before/after contrast visible; its plan alone creates no empirical access.
- **Operating range:** Practical, reversible choices with a short feedback loop. Do not use for unsafe, irreversible, or high-cost trials.
- **Input:** The decision, one uncertain mechanism, constraints, and a safe range.
- **Perturbation:** Changes one part of the system to expose its effect.
- **Procedure:** Prepare the instrument by specifying one change, duration, baseline, what stays fixed, who observes what, success and failure signals, stop rule, review point, and decision rule. Get the user's consent; the user runs the trial. When they return, compare the observation with the frozen baseline and rule. For a one-step diagnostic observation, use the compact form: uncertainty → observation → decision rule (“If A, do X; if B, do Y”).
- **Lifecycle:** `prepared` after the trial and decision rule are agreed; `running` while the user conducts it; `complete` only after an observation returns. If the user never runs or reports it, preserve that state and do not claim a reading.
- **Readout:** Prepared state: the bounded trial, baseline, controls, observations, and frozen decision rule. Complete state: the observed contrast, departures from control, missing observations, and which branch of the frozen rule the observation matches. Do not recommend the resulting action.
- **Control:** Prefer one changed variable; record a baseline when memory is likely to drift.
- **Common artifact:** The trial changes several things, lacks a review rule, or becomes permanent by inertia.
- **Escalate when:** Results conflict, stakes rise, or the mechanism remains hidden after repetition.
- **Stop when:** At preparation, stop conceptual work when the trial can begin safely and everyone knows when it ends. At completion, stop when the observed contrast resolves the named uncertainty or further repetition would not change the decision.
- **Cost / persistence:** Usually 1–2 planning turns plus real-world elapsed time; session only unless the observation will return in a later session.
- **Execution placement:** **Hybrid.** The orchestrator prepares the trial from the user's constraints, consent, and ability to observe; the user performs the real-world perturbation; the orchestrator compares the returned observation with the frozen baseline and decision rule. A subagent may research safe ranges, but it must not set or launch the experiment. If safety or reversibility cannot be established, stop and offer passive observation instead.
