# Instrument Contract

## Contents

- [Instrument card](#instrument-card)
- [Execution placement](#execution-placement)
- [Tool, instrument, and apparatus boundary](#tool-instrument-and-apparatus-boundary)
- [Instrument handshake](#instrument-handshake)
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
| **Return path**           | Who interprets, combines, and presents the reading                            |

Cards may point to existing phase procedures rather than copy them.

## Execution placement

Execution placement is part of the epistemic contract when it changes what the instrument can reveal. Use these seats:

- **Orchestrator:** The instrument depends on live user contact, accumulated context, or continuity across readings.
- **Fresh subagent:** Blindness or separation from the orchestrator's conclusions creates the access differential.
- **Parallel subagents:** Several isolated readings or belief positions must remain independent until comparison.
- **Hybrid:** Different stages require different seats; the card must assign each stage and the handoff.
- **Either:** Placement changes cost or convenience, not the claimed phenomenon. State the default.

Do not delegate merely because agents are available. Do not keep work in the orchestrator when prior knowledge defeats a required blind or independent view. If a required seat is unavailable, use the card's fallback and rename or downgrade the result; never claim the full instrument ran.

Every card's execution block must answer:

```yaml
execution-seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
context-boundary: <what each executor may and may not see>
placement-rationale: <why this seat matters>
fallback: <downgrade or stop condition>
return-path: <who interprets and presents the reading>
```

## Tool, instrument, and apparatus boundary

- A **tool** helps perform work. It may save time without changing what can be known.
- An **instrument** creates a specific access differential and returns a reading with a known artifact.
- An **apparatus** coordinates instruments, controls, people, and memory across a larger method.

One operation may play more than one role, but name the role that matters in the current run. A notebook is support until its longitudinal record makes drift observable. A small-experiment plan prepares an instrument; the instrument runs only when the real system is perturbed and completes only when an observation returns. Do not call every useful prompt an instrument merely because it sits in the field lab.

## Instrument handshake

Before every run, tell the user:

1. the instrument's name;
2. a short plain-language explanation in parentheses;
3. the specimen signal that called for it;
4. the access target—what it may make visible that is not yet available.

For an instrument whose real run happens later, use the same handshake before preparation but say that you are preparing it. Record the lifecycle state and get assent before the perturbation. Do not claim an access delta or empirical readout while it remains `prepared`.

For a cheap conversational probe, announce and run it in the same turn. For a costly, strong, or perspective-altering perturbation, also state the main cost or artifact risk and get assent first. After the run, report the access delta and artifact risk, then run the caddy gate: scan the residue against the registry; suggest one or at most two live instruments with a parenthetical explanation, calling signal, access target, and material cost; or say plainly that no further instrument would repay its cost. End with a named **useful next instrument** or **no next instrument** judgment. A conditional residue—“unless,” “if this persists,” or another later uncertainty—still requires its matching instrument to be named now. Do not run a suggested instrument merely because it was suggested.

Before sending, compare the proposed response with the registry. Structured elicitation, semantic substitution, sequence mapping, stake separation, tension compression, bounded experiments, and independent belief roles are instrument-shaped work. If the response contains one without a handshake, move the handshake before its readout. If a residue maps to another registered instrument, suggest it explicitly by name and access target.

## Common readout

```yaml
instrument: <id>
lifecycle: <prepared|running|complete|stopped>
execution:
  seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
  contexts: <who saw what>
  fallback: <none|named downgrade used>
specimen-delta: <what became clearer or changed>
access-delta: <what is observable now that was not observable before the run>
findings:
  - claim: <one finding>
    kind: <observation|user-testimony|source-claim|elicited-response|inference|analogy|normative-judgment|hypothesis>
    support: <citation, testimony pointer, or instrument trace>
    confidence: <solid|plausible|reach>
artifact-risk: <what the instrument may have induced or hidden>
residue: <what remains unclear, incompatible, or unmeasured>
user-feedback: <pending|confirmed|correction or surprise after the reading is returned>
specimen-update: <what changed after the user's error signal>
next-options:
  - <stop|small-experiment|instrument-id|promote-to-survey|promote-to-expedition>
recommendation: <one option and why; user decides>
```

This is a logical contract, not required user-facing YAML. On a Walk, use natural prose and include only what matters. At `prepared`, record the intended access target and leave `access-delta` pending; at `running`, preserve the frozen controls; only `complete` carries an empirical reading. State a material downgrade when the card's preferred seat was unavailable. Return strong readings to the user before filling `user-feedback` and `specimen-update`; do not invent confirmation. Do not fill `recommendation` while a focus question that could change it remains unanswered. In a Survey, preserve the full fields when a reading affects later work. In an Expedition, append every scheduled instrument's full lifecycle and readout to the round control log's instrument ledger; phase gates cite those entries.

## Observation ledger

The `kind` field must survive later transformations. A synthesis can reorganize a claim but cannot turn testimony into observation, analogy into evidence, or hypothesis into fact.

When several kinds support one finding, list them separately. When support is missing, lower confidence or mark the finding as a question.

## Control rule

Use controls in proportion to the cost of being wrong:

- **Low cost:** state the main artifact risk.
- **Moderate cost:** compare against a neutral baseline, reversed frame, renamed term, or nearby counterexample.
- **High cost:** add independent evidence or an agent blind to the first readout, then record what remained stable and what moved.

If a contradiction, axis, or conclusion appears only after a strong perturbation, mark it as possibly induced.

After a run, compare its access differential with its artifact risk. If the claimed finding was already visible before the perturbation, downgrade the run to confirmation or convenience. If the perturbation created the finding, report it as induced rather than discovered. Then complete the caddy gate. Compare the residue with the registry. When it maps to another instrument, suggest that instrument explicitly with its calling signal and access target; when none fits, say that stopping or acting is the best next move. Do not leave a named uncertainty beside an unnamed available probe.
