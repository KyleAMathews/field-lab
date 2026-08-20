# Workflow Contract

Read this file when creating or changing a Field Lab workflow. An instrument
card owns one bounded operation. A workflow coordinates several canonical
instruments and declared stages for a repeatable use case.

## Boundary

A workflow is a **human-operated route**, not an autonomous procedure.

- The human owns the aim, working question, branch choices, exceptions, and
  decision to stop or continue.
- Kit explains the route, runs the selected instruments, keeps the declared
  records, and returns at each checkpoint.
- A workflow may name conditions that make one branch a better fit. Kit uses
  those conditions to explain the available branches; it does not choose one.
- Completing a workflow means its declared route and returns ran. It does not
  close the inquiry, prove a conclusion, or prevent later evidence from
  reopening the work.

Do not add an `automationReady` flag or similar field. Autonomous branching,
triggers, retry policy, delegated budgets, and unattended failure handling
belong to a separate Field Station protocol. See
[field-station-protocol.md](field-station-protocol.md).

Keep these forms distinct:

| Form | Owns | Does not own |
| --- | --- | --- |
| Instrument card | One operation, control, bounded result, and stop rule | Inquiry direction or a multi-step route |
| Workflow | Repeatable order, stages, checkpoints, declared branches, and workflow artifacts | Autonomous branch choice or the inquiry's meaning |
| Field Trip | One inquiry's current state and record | Method |
| Expedition | Navigation across related Field Trips | Method or authority |
| Field Station protocol | A future, explicitly delegated autonomous procedure | Open-ended human judgment outside its bounds |

## Ordering rule

Order instruments by **epistemic dependency and risk of contaminating later
observations**, not by taxonomy.

1. Confirm the aim and the uncertainty that matters before choosing a route.
2. Collect or freeze material that later operations could alter.
3. Establish baselines and context boundaries before strong probes.
4. Run prerequisite instruments before operations that depend on their
   readings.
5. Prefer observation, elicitation, and distinction before generation,
   interpretation, or synthesis.
6. Use fresh or separated contexts before one result can anchor later readers.
7. Place controls and hostile checks close enough to the claim they test that
   the comparison stays traceable.
8. Return to the human before a branch changes the question, specimen, method,
   stakes, or kind of result.

Contamination cannot be eliminated. Reduce avoidable order effects, preserve
what each executor saw, and name the remaining correlation. Do not turn the
control burden into a reason to stall a useful inquiry. Large, difficult
questions may need several Field Trips approaching the material from different
directions.

## Route scale

Match the proposed route to how well the inquiry is formed:

- For a clear aim and known use case, Kit may offer one whole workflow or a
  proposed route with its important branches and checkpoints.
- For an open-ended inquiry, Kit should offer one instrument or a short
  sequence. Do not disguise a speculative full research program as a plan.
- When a few next instruments remain plausible, filter the bench using the
  current inquiry state. Recommend the best fit and at most one route that
  examines a different uncertainty.
- Use the Focus interview and instruments that expose competing assumptions or
  internal failures early when the user's model may be inconsistent.

A route is an offer until the user selects it. Preserve any selected queue in
the Field Log rather than silently recomputing it after every reading.

## Card and inquiry-state separation

Keep reusable method in cards and changing case state in the Field Log.

Instrument cards hold:

- operating range and minimum input;
- full procedure and execution placement;
- controls, fallback, result, distortion, and stop rule; and
- stable composition notes.

The workflow holds:

- why the operations are ordered;
- stage entry and completion gates;
- scheduled and conditional instruments;
- user checkpoints and declared branch options;
- workflow-only artifacts and handoffs; and
- what counts as completing the route.

The Field Log holds:

- current aim, questions, sources, terms, tensions, and plan;
- the selected queue and current workflow state;
- actual instrument lifecycles and bounded readings;
- user comments and corrections;
- branch choices and their user-turn pointers; and
- unresolved gaps and later returns.

Never copy an instrument's core procedure into a workflow. Link the canonical
card and add only sequence, stage-local inputs, artifacts, and gates. Never put
the current inquiry's answer, preferred branch, or source-specific result in a
reusable workflow.

## Required workflow sections

Give every workflow these sections.

### Identity and fit

- Stable name and identifier.
- Concrete use case and result.
- Strong entry signal and main contraindication.
- Minimum input and any required record.
- Explicit statement that the workflow is human-operated.

### Compact map

List the stages in plain language. For each stage, say what Kit will do, what it
should make visible, and where the human next sees the work.

### Stage contract

For each stage, define:

```yaml
id: <stable stage id>
aim: <bounded purpose>
requires: <state that must already exist>
scheduled-instruments:
  required: [<canonical instrument ids>]
  conditional: [<instrument id plus calling condition>]
order-rationale: <dependency or contamination reason>
operations: <declared mechanical handoffs or record transforms, if any>
outputs: <bounded readings and workflow artifacts>
return-point: <what the human sees before more work runs>
completion-gate: <observable conditions, not prose plausibility>
branches: [<human choices available after the return>]
```

Keep substantive epistemic work inside canonical instruments. Name any
non-instrument operation plainly and limit it to mechanical coordination,
validation, handoff, or record transformation. If a stage needs a new way to
interpret, compare, generate, or test material, create or select an instrument
rather than hiding the method in workflow prose. Synthesis, ranking,
recommendation, decision, action, publication, and real-world intervention
still need the specific authority required by the Field Lab and Field Log
contracts.

### Branch contract

For every branch, state:

- the observable condition that makes it relevant;
- what uncertainty the branch examines;
- the added instruments, work, records, and likely distortion;
- where it rejoins, loops, redirects, pauses, or exits the workflow; and
- the human checkpoint that selects it.

Do not encode “best,” “enough,” “resolved,” or “no longer interesting” as an
agent-owned condition. Evidence can weaken a branch or satisfy a workflow gate;
only the human ends or abandons a line of inquiry.

### Authority and lifecycle

Selecting a workflow selects its declared route and schedules its named
instruments. It does not:

- start the first stage unless the workflow's entry contract says it does;
- cross a declared human checkpoint;
- choose a conditional branch;
- add an unscheduled instrument;
- widen research or sources beyond the stage;
- authorize a synthesis, decision, recommendation, publication, or action; or
- turn workflow completion into inquiry completion.

Use the Field Log workflow lifecycle for what actually ran. Keep `selected`,
`started`, `paused`, `resumed`, `completed`, and `failed` distinct. A pause is
normal when the next move belongs to the human. Record a failure when the route
cannot meet its own gate; do not force a plausible-looking output.

### Completion and trace

Define completion through inspectable events and artifacts. Require:

- each scheduled instrument's actual lifecycle, seat, input boundary, control,
  bounded reading, downgrade, and trace;
- every branch choice and waiver with its exact user authorization;
- each promised checkpoint returned; and
- unresolved questions, failures, residue, and unmeasured material preserved.

## Admission and test

Admit a workflow only when the sequence itself adds value: it preserves a
dependency, avoids a known order effect, coordinates several roles, or supports
a repeatable use case better than an ad hoc queue.

Before treating it as reusable:

1. Run the route on at least one real Field Trip with a human making branches.
2. Compare the written schedule with what actually happened.
3. Mark hidden judgment calls, missing branches, unnecessary stages, and order
   effects.
4. Replay it on a contrasting case without repairing the contract in flight.
5. Record the failure shape and revise the workflow as a new version.
6. Keep the older trace so later success does not erase the first miss.

Judge each calibration trajectory against the standing behavior specs in
`.agents/behaviors/`. A behavior failure may belong to the workflow, runtime
instructions, trace instrumentation, fixture, or judge; repair the owning layer.
A conforming trajectory shows that the route preserved the Field Lab's conduct
rules. It does not prove that an instrument or workflow is epistemically valid.

Do not call a workflow a protocol merely because several runs succeeded.
Autonomous use needs a separate commissioning process and stricter contract.
