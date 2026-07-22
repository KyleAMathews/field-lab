# Instrument Contract

## Contents

- [Instrument card](#instrument-card)
- [Execution placement](#execution-placement)
- [Tool, instrument, and apparatus boundary](#tool-instrument-and-apparatus-boundary)
- [Selection and authorization](#selection-and-authorization)
- [Instrument handshake](#instrument-handshake)
- [Raw-readout boundary](#raw-readout-boundary)
- [Common readout](#common-readout)
- [Observation ledger](#observation-ledger)
- [Control rule](#control-rule)

An instrument earns a place on the bench only if it makes something visible, separable, measurable, or testable that unaided inquiry does not; seeks a distinct phenomenon; and has a characteristic failure mode.

The test is counterfactual: without this operation, what would remain unseen, entangled, unmeasured, or untested? A prompt that merely produces more material, restates the specimen, or makes routine work faster may be useful, but it is not yet an instrument.

## Instrument card

Every instrument card states:

| Field                     | Requirement                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Name / ID**             | Stable plain-language name and short identifier                               |
| **Phenomenon sought**     | What the instrument helps reveal                                              |
| **Unaided limit**         | What ordinary inspection or conversation leaves hidden                        |
| **Access differential**   | What becomes observable, separable, measurable, or testable because it ran    |
| **Operating range**       | When it helps and when it should not run                                      |
| **Input requirements**    | Minimum specimen state                                                        |
| **Perturbation**          | What it changes, stresses, hides, projects, or injects                        |
| **Procedure**             | The bounded operation                                                         |
| **Readout**               | The structured result                                                         |
| **Calibration / control** | Baseline, repetition, independent view, or falsification check scaled to risk |
| **Common artifacts**      | Likely false positives and distortions                                        |
| **Escalation signals**    | Findings that may warrant another instrument or apparatus                     |
| **Stop conditions**       | Findings after which more conceptual work is unlikely to help                 |
| **Cost profile**          | Rough attention, time, research, and agent cost                               |
| **Persistence**           | What gets written, if anything                                                |
| **Execution seat**        | Orchestrator, fresh subagent, parallel subagents, hybrid, or either           |
| **Context boundary**      | What each executor may and may not see                                        |
| **Placement rationale**   | Why continuity, blindness, independence, or parallelism matters               |
| **Fallback**              | Honest downgrade when the required execution seat is unavailable              |
| **Return path**           | Who returns the bounded reading and keeps later interpretation separate       |

Cards may point to existing phase procedures rather than copy them.

## Execution placement

Execution placement is part of the epistemic contract when it changes what the instrument can reveal. Use these seats:

- **Orchestrator:** The instrument depends on live user contact, accumulated context, or continuity across readings.
- **Fresh subagent:** Blindness or separation from the orchestrator's conclusions creates the access differential.
- **Parallel subagents:** Several context-isolated readings or belief positions must remain separate until comparison.
- **Hybrid:** Different stages require different seats; the card must assign each stage and the handoff.
- **Either:** Placement changes cost or convenience, not the claimed phenomenon. State the default.

Do not delegate merely because agents are available. Do not keep work in the orchestrator when prior knowledge defeats a required blind or independent view. If a required seat is unavailable, use the card's fallback and rename or downgrade the result; never claim the full instrument ran.

Context isolation is a separation control; it does not imply statistical independence. Same-model agents can share training priors, prompt habits, tool limits, and systematic errors even when they cannot see one another. Name the separation that actually exists—such as fresh-context, sibling-blind, cross-model, cross-source, or external human/world—and state the main remaining correlation risk when it matters to the claim.

Every card's execution block must answer:

```yaml
execution-seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
context-boundary: <what each executor may and may not see>
placement-rationale: <why this seat matters>
fallback: <downgrade or stop condition>
return-path: <who returns the bounded reading; where any later interpretation occurs>
```

## Tool, instrument, and apparatus boundary

- A **tool** helps perform work. It may save time without changing what can be known.
- An **instrument** creates a specific access differential and returns a reading with a known artifact.
- An **apparatus** coordinates instruments, controls, people, and memory across a larger method.

One operation may play more than one role, but name the role that matters in the current run. A notebook is support until its longitudinal record makes drift observable. A small-experiment plan prepares an instrument; the instrument runs only when the real system is perturbed and completes only when an observation returns. Do not call every useful prompt an instrument merely because it sits in the field lab.

## Selection and authorization

An instrument may be **offered** when its calling signal appears. It may be **selected** only by the user. Do not run it because it is cheap, obvious, newly relevant, or already mentioned in a caddy. The handshake identifies a selected run; it does not create permission.

Selection may come from:

- a direct request for a named instrument;
- the user's choice from offered instruments;
- an agreed Survey plan that names the instrument;
- a request for an Expedition, which authorizes its scheduled instrument map.

An apparatus selection does not authorize extra ad hoc instruments outside its agreed plan. Offer those separately. The focus interview is the sole automatic entry: asking its questions creates no reading, and the user authorizes completion by answering. If the user declines, stop it.

## Instrument handshake

After selection and before every run, tell the user:

1. the instrument's name;
2. a short plain-language explanation in parentheses;
3. the specimen signal that called for it;
4. the access target—what it may make visible that is not yet available.

Use this stable lead-in: **“I’m pulling in the [name] instrument ([brief explanation]) because…”** Keeping the word **instrument** beside the name is part of the interface: repeated use teaches the field-lab metaphor. For a tightly coupled cluster, use **“I’m pulling in the [name] and [name] instruments…”** You may vary the rest of the sentence, not this identification.

For an instrument whose real run happens later, use the same handshake before preparation but say that you are preparing it. Record the lifecycle state and get assent before the perturbation. Do not claim an access delta or empirical readout while it remains `prepared`.

After the run, return the bounded reading and its artifact limits, then run the caddy gate: scan the unmeasured remainder against the registry; normally suggest three materially distinct live instruments, each with a parenthetical explanation, what it measures, why that reading may help, and any material cost; or say plainly that no further instrument would repay its cost. If fewer than three honestly fit, offer fewer and say why rather than padding the set. Do not rank or run them unless the user selects one.

Before sending, compare the proposed response with the registry. Structured elicitation, semantic substitution, sequence mapping, stake separation, tension compression, bounded experiments, and context-isolated belief roles are instrument-shaped work. If the response contains one without a handshake, move the handshake before its readout. If a residue maps to another registered instrument, suggest it explicitly by name and access target.

## Raw-readout boundary

An instrument returns the closest practical equivalent of raw data for its operation. “Raw” does not mean unprocessed: a thermometer converts a physical signal into a calibrated number. It means that the instrument stops at the reading it is designed to produce.

A reading may contain:

- observations, measurements, user testimony, source claims, generated samples, controlled comparisons, or test traces;
- provenance and claim kind;
- calibration, confidence, null results, and missing data;
- the perturbation and known artifact risks;
- what the instrument did not measure.

An instrument readout must not:

- explain the whole specimen or declare its underlying cause;
- decide which reading matters most;
- synthesize across instruments or build a general model;
- recommend a belief, decision, or action;
- turn generated material, analogy, testimony, or model output into evidence.

Ask the user what they notice. Interpretation and synthesis belong to the human in camera mode. When the user explicitly requests an engine task or a full-dialectic phase calls for interpretation, keep that later work visibly separate from the instrument ledger and cite the readings it uses.

## Common readout

```yaml
instrument: <id>
lifecycle: <offered|selected|prepared|running|complete|stopped>
authorization:
  basis: <direct-request|user-choice|focus-response|survey-plan|expedition-schedule>
  pointer: <quote, turn, or agreed plan entry>
orientation-state: <observing|orienting|engine-authorized>
execution:
  seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
  contexts: <who saw what>
  fallback: <none|named downgrade used>
access-delta: <what is observable now that was not observable before the run>
readings:
  - value: <one bounded reading>
    kind: <observation|measurement|user-testimony|source-claim|elicited-response|generated-sample|controlled-comparison|test-result|inference|analogy|normative-judgment|hypothesis>
    support: <citation, testimony pointer, or instrument trace>
    confidence: <solid|plausible|reach>
calibration: <control, baseline, null result, or confidence limit>
artifact-risk: <what the instrument may have induced or hidden>
unmeasured: <what remains outside this instrument's reading>
user-feedback: <pending|confirmed|correction after the reading is returned>
```

This is a logical contract, not required user-facing YAML. On a Walk, use natural prose and include only what matters. `Offered` is not `selected`. At `prepared`, record the intended access target and leave `access-delta` pending; at `running`, preserve the frozen controls; only `complete` carries an empirical reading. State a material downgrade when the card's preferred seat was unavailable. Return readings to the user before filling `user-feedback`; do not invent confirmation or interpretation. In a Survey, preserve the full fields when a reading affects later work. In an Expedition, append every scheduled instrument's raw readout to the round control log; keep the phase's later analysis in its separate artifact.

## Observation ledger

The `kind` field must survive later transformations. A synthesis can reorganize a reading but cannot turn testimony into observation, analogy into evidence, a generated sample into discovery, or hypothesis into fact.

When several kinds support one finding, list them separately. When support is missing, lower confidence or mark the finding as a question.

## Control rule

Use controls in proportion to the cost of being wrong:

- **Low cost:** state the main artifact risk.
- **Moderate cost:** compare against a neutral baseline, reversed frame, renamed term, or nearby counterexample.
- **High cost:** add independent evidence or an agent blind to the first readout, then record what remained stable and what moved.

If a contradiction, axis, or conclusion appears only after a strong perturbation, mark it as possibly induced.

After a run, compare its access differential with its artifact risk. If the reading was already visible before the perturbation, label the run confirmation or convenience. If the perturbation created the output, label it induced or generated rather than discovered. Then complete the caddy gate. Compare the unmeasured remainder with the registry and normally offer three distinct instruments, explaining what each measures and why that reading may help. Offer fewer when fewer honestly fit. When none fits, say that no next instrument is warranted. Never rank or run the choices without user selection, or cross from a bounded reading into explanation, synthesis, recommendation, or action.
