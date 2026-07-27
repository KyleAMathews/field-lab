# Instrument Card and Record Schema

Read this file only when creating or changing an instrument card or saved instrument record. `SKILL.md` owns the runtime rules for selection, explaining a chosen instrument, bounded results, requested-task boundaries, and follow-up offers.

## Contents

- [Card admission test](#card-admission-test)
- [Selection frontmatter](#selection-frontmatter)
- [Card schema](#card-schema)
- [Execution placement](#execution-placement)
- [Saved result schema](#saved-result-schema)
- [Readable logs](#readable-logs)

## Card admission test

Give an operation an instrument card only when it:

- seeks a distinct phenomenon;
- makes something visible, separable, measurable, or testable that unaided inquiry does not; and
- has a characteristic artifact or failure mode.

Ask: without this operation, what would remain unseen, entangled, unmeasured, or untested? A prompt that only produces more material or saves time remains a tool.

## Selection frontmatter

Give every canonical instrument file this YAML frontmatter:

```yaml
---
id: <stable identifier matching the filename>
name: <plain-language name>
summary: <short plain-language explanation suitable for an offer>
use_when: <strongest calling signal>
avoid_when: <main contraindication>
access_target: <what becomes visible or testable>
requires: <minimum specimen and access state>
execution_seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
fresh_context: <none|optional|preferred|required|timing-dependent|hybrid>
effort: <low|medium|high|variable>
persistence: <plain-language time and record needs; say “can be done here” or name the purpose of a Field Log>
artifact_risk: <chief way the operation may induce or hide structure>
maturity: <draft|trialed|practiced|established>
documented_uses: <conservative count of completed home-domain runs>
---
```

Keep every value short enough to scan beside several other cards. Keep the schema flat and each value on one line so `scripts/find-instruments.js` can parse it without a YAML dependency. Use the frontmatter to compare candidates before an offer. Do not put procedure, controls, fallbacks, or full operating-range detail there.

Treat the frontmatter as routing metadata and the body as the operating contract. The body may state a fuller version of a frontmatter field when the run needs its nuance; it must not contradict the metadata.

`maturity` reports Field Lab use, not the age or prestige of a donor method:

- `draft`: no documented completed run;
- `trialed`: one to nine documented completed runs;
- `practiced`: ten to twenty-four documented completed runs;
- `established`: at least twenty-five documented completed runs across at least five distinct inquiries.

Count a run only when an artifact or trace shows that the named card's operation completed. Exclude definitions, offers, plans, generic examples, and workflow mentions with no recoverable result. Use the conservative count when a record is ambiguous. A high count does not prove validity, and donor-field evidence does not raise the Field Lab maturity label.

## Card schema

Make every card self-contained. Do not delegate its core procedure to a workflow phase. A workflow may add sequence, artifacts, gates, and phase-specific interpretation, but it must call the same standalone procedure.

| Field                   | Requirement                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Name / ID**           | Stable plain-language name and short identifier                               |
| **Phenomenon sought**   | What the instrument helps reveal                                              |
| **Why use it**          | What ordinary inquiry misses and what the run makes available                 |
| **Operating range**     | When it helps and when it should not run                                      |
| **Input**               | Minimum specimen state                                                        |
| **What changes**        | What it changes, stresses, hides, projects, or injects                        |
| **Procedure**           | Complete bounded operation                                                    |
| **Result**              | Structured result and return path                                             |
| **Control**             | Baseline, repetition, independent view, or falsification check scaled to risk |
| **Common distortions**  | Likely false positives and distortions                                        |
| **Escalate / stop**     | Signals for another operation and conditions for stopping                     |
| **What it requires**    | Attention, time, research, agents, and records                                |
| **Execution placement** | Seat, context boundary, rationale, fallback, and return path                  |

Compact cards may combine adjacent fields when no requirement becomes ambiguous.

## Execution placement

Choose the seat for epistemic access, not convenience:

- **Orchestrator:** live user contact, accumulated context, or continuity creates access.
- **Fresh subagent:** blindness or separation from prior conclusions creates access.
- **Parallel subagents:** several context-isolated readings must stay separate until comparison.
- **Hybrid:** different stages need different seats and an explicit handoff.
- **Either:** placement changes cost, not the claimed phenomenon.

For every card, state:

```yaml
execution-seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
context-boundary: <what each executor may and may not see>
placement-rationale: <why this seat matters>
fallback: <honest downgrade or stop condition>
return-path: <who returns the bounded reading>
```

Context isolation is a separation control, not statistical independence. Name the separation that exists—fresh-context, sibling-blind, cross-model, cross-source, or external human/world—and state any material remaining correlation.

## Saved result schema

Use this logical schema when a Field Trip or workflow needs an auditable record. A Walk may keep the same content in concise prose.

```yaml
instrument: <id>
lifecycle: <selected|prepared|running|complete|stopped>
recorded-at: <YYYY-MM-DDTHH:MM:SS±HH:MM>
observed-at: <YYYY-MM-DDTHH:MM:SS±HH:MM, unknown, or not-applicable>
authorization:
  basis: <direct-request|user-choice|focus-response|field-trip-plan|workflow-schedule>
  pointer: <quote, turn, or agreed plan entry>
orientation-state: <observing|orienting|engine-authorized>
execution:
  seat: <orchestrator|fresh-subagent|parallel-subagents|hybrid|either>
  contexts: <who saw what>
  fallback: <none|named downgrade used>
access-delta: <what became observable because the run completed>
readings:
  - value: <one bounded reading>
    kind: <observation|measurement|user-testimony|source-claim|elicited-response|generated-sample|controlled-comparison|test-result|inference|analogy|normative-judgment|hypothesis>
    support: <citation, testimony pointer, or instrument trace>
    confidence: <solid|plausible|reach>
calibration: <control, baseline, null result, or confidence limit>
artifact-risk: <what the instrument may have induced or hidden>
unmeasured: <what remains outside this reading>
user-feedback: <pending|confirmed|correction with pointer>
```

- Record every saved entry at `selected` or later; keep mere offers in the collection plan.
- Leave `access-delta` and readings pending at `selected`, `prepared`, or `running`.
- Use `observed-at` for the event time; write `unknown` rather than substituting the record time.
- Preserve claim kinds through later transformations. Do not turn testimony into observation, analogy into evidence, a generated sample into discovery, or hypothesis into fact.
- Append a new dated block when lifecycle or user feedback changes. Do not overwrite earlier states.

## Readable logs

- Use one vertical record block per lifecycle event.
- Put each audit field on its own labeled line.
- Link long traces instead of embedding them.
- Use a table only for a compact comparison with no more than four short columns.
- Keep raw readings separate from later interpretation, synthesis, and action.
