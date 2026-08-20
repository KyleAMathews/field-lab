# Field Stations and Protocols

This is a deferred design note, not an active runtime contract. Read it when
designing autonomous or scheduled Field Lab work. Do not apply it to an
ordinary human-operated workflow.

## Working vocabulary

- A **workflow** is a repeatable route for a human-operated Field Trip. The
  human chooses branches and handles exceptions.
- A **Field Station protocol** is a versioned executable procedure that gives
  Kit bounded authority to choose declared branches without a human present.
- A **Field Station** is a deployed protocol plus its trigger, sources, stored
  state, budgets, permissions, logs, and Kit operator—the little robot manning
  the station.
- One activation may later need a name such as a run, watch, or shift. Leave
  that term open until the runtime model makes the useful boundary clear.

A protocol is not a workflow with an automation flag. A human-operated
workflow can rely on tacit repair: the person notices an odd case, changes the
question, supplies context, rejects a weak branch, or stops. A protocol must
make each allowed judgment, fallback, and escalation explicit. That gulf is
the reason for a separate contract.

## Possible uses

A station might:

- wake weekly to rerun named instruments against new evidence;
- watch a source or dataset and open a new branch when a declared change
  appears;
- revisit an unresolved question when a required source becomes available;
- maintain a recurring comparison while preserving each observation's date and
  source version; or
- prepare bounded readings for the human without synthesizing or deciding what
  they mean.

The station remains part of the Field Lab. It operates instruments and keeps a
scientific log. It does not acquire a general mandate to research, synthesize,
recommend, decide, publish, or act.

## Protocol contract candidates

A future protocol contract will likely need the following.

### Purpose and authority

- A narrow aim, specimen class, and success envelope.
- Exact operations and branches Kit may run unattended.
- Explicitly forbidden operations and authority that always returns to the
  human.
- A named owner, review path, and expiry or review date for the delegation.

### Inputs and triggers

- Scheduled, event, threshold, or manual triggers.
- Source identities, accepted versions or freshness windows, and access rules.
- Validation for missing, duplicate, malformed, stale, or conflicting input.
- Debounce and deduplication rules so one change does not create several runs.

### Executable state and branches

- A reconstructable state machine derived from the canonical event log.
- Named states, accepted events, guards, effects, terminal failures, and human
  escalation states.
- Branch guards based on observable fields, not prose intuition such as
  “interesting,” “good enough,” or “the issue is resolved.”
- An abstain path whenever no guard is safe.
- Version-pinned instruments, schemas, models, prompts, and source adapters.

### Limits and recovery

- Time, cost, source, instrument-run, retry, and recursion budgets.
- Idempotent writes, crash recovery, leases or locks, and duplicate-run policy.
- Retry rules split from semantic branches: a transient network failure is not
  evidence about the inquiry.
- Explicit failed, stopped, quarantined, and needs-human states.
- No silent repair of invalid input or failed validation.

### Epistemic controls

- Ordering by dependency and contamination risk.
- Frozen baselines and source snapshots when later probes could alter them.
- Context boundaries for fresh or sibling-blind agents.
- Claim kinds, calibration, unmeasured remainder, and downgrade preserved in
  every reading.
- Rules for conflicting readings and evidence drift that escalate rather than
  force convergence.

### Returns and observability

- A vivid chronological Field Log suitable for inspection and sharing.
- Links from each short journal return to full readouts, sources, code, and the
  protocol version.
- Current station state, last successful observation, next trigger, open
  exceptions, spent budget, and pending human choices.
- Notifications that link to the new entry rather than retelling the work in
  chat.
- Standing behavior specs for the small set of recurring choices important
  enough to judge across every station trajectory. Keep these specs distinct
  from the runtime prompt and grade each applicable behavior from visible trace
  evidence.

### Closure boundary

A protocol may finish one activation or exhaust a declared route. It may not
declare the inquiry closed. No evidence definitively ends a line of inquiry,
and only the human decides whether to retire, revise, or continue the station.

## Protocol Commissioning workflow

Build and test a protocol through a future human-operated **Protocol
Commissioning workflow**. The workflow itself is not autonomous; its purpose is
to replace tacit human routing with tested, bounded rules.

### 1. Bound the station

Confirm the recurring question, intended readers, source surface, trigger,
useful return, prohibited work, and authority that must stay with the human.
Reject a target that still depends on open-ended judgment throughout.

### 2. Collect real routes

Use completed Field Trips and live human-operated workflow runs as specimens.
Map the actual sequence, branch choices, corrections, exceptions, and missing
observations. Do not infer a clean procedure from the workflow document alone.

Likely instruments:

- [`substrate-map`](instruments/substrate-map.md) for the observable route and
  handoffs;
- [`formation-section`](instruments/formation-section.md) when several runs
  accumulated different branches and repairs; and
- [`design-grammar`](instruments/design-grammar.md) for reusable states,
  operations, invariants, and combination rules.

### 3. Expose tacit routing

For every human branch, record what the person saw, what choices were live,
what they rejected, and what would have made them abstain. Separate observable
guards from taste, interpretation, or later hindsight. Any branch that still
needs open judgment becomes a human checkpoint.

Likely instruments:

- [`criterion-excavation`](instruments/criterion-excavation.md) for branch
  criteria the operator can recognize but has not stated;
- [`term-scan`](instruments/term-scan.md) for loaded guard terms; and
- [`fracture-scan`](instruments/fracture-scan.md) for rules that fail by their
  own standard.

### 4. Write the executable draft

Define versioned states, events, guards, effects, budgets, retries, abstention,
escalation, and stop conditions. Pin instrument and schema versions. Distinguish
inquiry branches from runtime recovery. Make every effect auditable and safe to
repeat.

### 5. Replay frozen trips

Replay the protocol against archived inputs without revealing the historical
human branch choices to the executor. Compare its states, readings, abstentions,
and escalations with the frozen trace. Treat divergence as data, not an error to
patch during the run.

Judge the replay against the station's behavior specs as well as its state
transitions. Include positive, negative, lucky-correct negative, outside-scope,
and allowed-boundary trajectories. Keep expected labels out of the judge's
evidence and require verdicts to cite visible trace events.

Likely controls:

- [`neutral-control`](instruments/neutral-control.md) to freeze the baseline;
- [`loss-audit`](instruments/loss-audit.md) to recover case material the
  protocol drops; and
- [`hostile-assay`](instruments/hostile-assay.md) to find concrete failure
  scenes and repair conditions.

### 6. Run in shadow mode

Let the protocol receive live triggers and propose each effect or branch while
the human still chooses. Record agreements, overrides, missed abstentions,
excess escalations, cost, delay, and the exact context that changed the choice.
The shadow run must not act merely because its proposal matched past choices.

Use [`framing-sensitivity`](instruments/framing-sensitivity.md) when guard
outcomes may depend on wording, order, or model. Use
[`negative-transfer`](instruments/negative-transfer.md) when the protocol is
claimed to cover a nearby case class.

### 7. Supervise bounded live runs

Delegate the smallest safe branch set. Keep low budgets, prompt notification,
and a human kill path. Test retries, duplicate triggers, missing sources,
partial writes, contradictory evidence, version changes, and budget exhaustion
as well as the happy path.

Use [`real-world-check`](instruments/real-world-check.md) for a safe,
reversible live trial and its observed result.

### 8. Commission or return to design

Commission only the branch set that passed replay, shadow, failure-injection,
and supervised-live checks. Publish the protocol version, delegated authority,
known blind spots, budgets, rollback path, and review date. Leave unsupported
branches as human checkpoints. A successful commissioning run does not make
future revisions safe by inheritance.

## Open design questions

- What event and state-machine format should be canonical for protocols?
- Which guard forms are deterministic, LLM-evaluated, or external-world
  observations, and how should each be validated?
- How should protocol versions relate to instrument-card and model versions?
- What is the smallest useful unit for replay and comparison?
- When should one station append to an existing Field Trip versus open a new
  dated Field Trip under an Expedition?
- How should a human suspend, inspect, patch, and resume a station without
  corrupting its historical trace?
- Which permissions may be delegated for a fixed period, and which must be
  granted for each activation?

Leave these questions open until real workflow traces supply constraints. Do
not burden ordinary workflows with speculative fields intended to answer them.
