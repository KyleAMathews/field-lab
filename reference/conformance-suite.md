# Field Lab conformance suite

The suite checks a few recurring Field Lab behaviors across whole agent
trajectories. It does not judge whether an instrument or workflow is true,
useful, or complete. It checks whether Kit stayed inside the user's authority,
preserved the selected route, returned bounded readings, and left branch choices
to the human.

The behavior specs in `.agents/behaviors/` are the source of truth. They are
review standards, not runtime instructions injected into Kit.

## Layers

### Raw trajectory

The trace-neutral envelope records:

```ts
interface AgentTrajectory {
  id: string
  description?: string
  complete: boolean
  events: Array<{
    id: string
    actor: "user" | "agent" | "tool" | "system" | "subagent"
    action: string
    content: string
    metadata?: Record<string, unknown>
  }>
}
```

Raw event IDs are the only valid citation surface. Expected fixture labels never
enter the evaluated trajectory or judge prompt.

### Semantic extraction

The deterministic kernel accepts explicit semantic events such as a selected
instrument, a completed run, or an unauthorized synthesis. The adapter may map
an exact tool event or state-machine transition. It must not infer authority,
selection, completion, or a claim kind from plausible prose.

The canonical Field Log adapter maps validated JSONL events. A Field Log is a
partial projection of the surrounding agent session, so the adapter marks it
incomplete by default. Incomplete traces may prove a visible failure, but they
cannot turn an otherwise clean partial path into a pass.

Vendor-specific Codex and Claude adapters belong at this boundary. Add one only
from a real recorded fixture. Do not guess a vendor's private event shape.

### Deterministic model

The XState model reconstructs grants, selected queues, active runs, terminal
results, and branch choices. It emits `true`, `false`, or `na` for each standing
behavior and points every finding back to raw trace events.

A completed instrument must return typed readings and their support,
calibration, possible artifact, and unmeasured remainder. A failed or stopped
run is also a valid terminal return when it records both the reason and the
inspectable residue.

### Behavior judge

Some behavior is visible only in messages and tool results. The judge contract
therefore passes one behavior spec and one raw trajectory to an evaluator. The
parser rejects invented citations and requires a false verdict to quote the
violated behavior clause verbatim.

The judge follows these rules:

- judge visible attempts and process, not lucky outcomes;
- use `false` when a complete trace shows the trigger but omits required work;
- use `na` only for an unfired trigger, incomplete evidence, or an unjudgeable
  behavior; and
- fold repeated occurrences in code: any false makes the behavior false, all
  `na` makes it `na`, otherwise it is true.

This repository builds and validates the judge messages and responses. It does
not make a model request during local tests.

## Calibration set

Keep at least these trajectories for each behavior:

- a clear positive;
- a clear negative;
- a lucky-correct negative whose result is useful but whose process failed;
- an outside-scope case that should be `na`; and
- an allowed boundary case close to the rule but still compliant.

When a result is wrong, identify the owning layer before changing anything:
behavior wording, trace completeness, semantic adapter, calibration fixture,
deterministic model, or judge.

## Run

From `artifact-browser/`:

```bash
pnpm test:conformance
pnpm typecheck
```

These commands test the specs, adapters, calibration fixtures, and deterministic
kernel without making model requests. To forward-test the actual `SKILL.md`
through a fresh Codex process:

```bash
pnpm test:skill-live
```

The live suite reads host authentication, makes real model requests, and is not
part of the default test run. Limit a calibration pass to one case when needed:

```bash
FIELD_LAB_LIVE_CASE=selected-queue pnpm test:skill-live
```
