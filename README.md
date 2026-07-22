# Field Lab — thinking with AI

_The Electric Monks are named after Douglas Adams' machines built to believe things for you._

Bring it any question. It may answer in one paragraph, pull a few instruments into the conversation, organize a systematic inquiry, or launch the full Electric Monk dialectic.

Every inquiry begins as a **Walk**. A direct answer is a complete and successful result when user-specific context is unlikely to change it. A nontrivial Walk begins by focusing with the user: the agent reflects what seems important and unresolved, asks a few questions that could change the analysis, then alternates bounded instrument readings with user correction. A problem can be small yet context-bound: “keep this light” calls for fewer, sharper questions, not an instant canned fix. No files, mode menu, phase announcement, or setup are required.

## Install

Install the whole repository with the [`skills` CLI](https://github.com/vercel-labs/skills) so the skill and its reference files stay together. It supports Claude Code, Codex, and other agents:

```bash
npx skills add KyleAMathews/field-lab
```

Add `-g` for a global install. Then invoke the skill in an ordinary question:

```text
/field-lab Why do I keep putting off this small migration?
```

## First time? Take the tutorial

Before bringing a difficult question, try a guided, low-stakes tour of the bench:

```text
/field-lab I want to test the instruments in this field lab. Briefly explain how it works, then give me a few easy, low-stakes exercises for instruments that produce different kinds of readings. Let me choose what to try and guide me through one at a time.
```

The tutorial should explain the lab briefly, offer contrasting exercises, and then follow the same rules as ordinary use: you select each instrument; the agent announces it; the instrument returns a bounded reading; and you decide what the readings mean together.

## Quick examples

- **Off-the-cuff question:** `/field-lab Why do moths fly toward porch lights?` → direct answer, no visible method.
- **Fact-shaped practical Walk:** `/field-lab How many branches should this fruit bush have?` → clarify the desired form, then search or advise; no files.
- **Instrument-rich Walk:** `/field-lab My wife and I mean different things by a clean kitchen.` → optional term scan, stake map, and small experiment; no files.
- **Hostile thesis Walk:** `/field-lab Test this thesis against its strongest opposition.` → focus interview, short context-isolated Monks, and user correction.
- **Field Trip:** `/field-lab Compare four family calendar systems over three weeks and let us resume later.` → an agreed collection plan and durable field log.
- **Expedition:** `/field-lab Create a home for several field trips about how our team deploys software.` → a directory, shared purpose, lineage, and trip index.
- **Dialectic workflow:** `/field-lab Run the full dialectic on whether our framework should own deployment.` → committed positions, decomposition, candidate palette, audit, and recursion inside a logged Field Trip.

You do not need to choose a field-work form up front. Ask for a named instrument directly if you want one: “run a term scan,” “check for a ground condition,” “map this possibility space,” or “stress these positions with Electric Monks.”

If the inquiry later needs durable memory, ask to **open a field log**. That starts a bounded **Field Trip** without restarting the conversation. Several related Field Trips may share an **Expedition** directory and index. A stubborn contradiction may call for the seven-phase **Electric Monk dialectic workflow**. These choices are independent: an Expedition is a container, not a method.

## Why the field-lab shape

The field lab separates things that are easy to confuse:

- **instrument access** — any inquiry may use the bench;
- **durable field work** — a Field Trip adds one field log and a bounded collection plan;
- **cross-trip memory** — an Expedition gives related Field Trips a shared home and index;
- **method** — a selected workflow coordinates steps, instruments, controls, artifacts, and gates.

Instrument count does not set the form. A scientist may carry a camera, binoculars, recorder, and light meter on a walk. In the same way, a short conversation may use several probes and still remain a Walk. Opening a field log adds memory; starting an Expedition adds cross-trip navigation; choosing a workflow adds method. None grants access to a better class of instrument.

## Camera mode, not pure engine mode

The field lab keeps three dimensions separate:

- **Walk → Field Trip; several Field Trips → Expedition** sets the scope of memory.
- **Ad hoc probes → named workflow** sets the degree of procedural coordination.
- **Camera → engine** sets the tempo of feedback relative to conclusion and action.

The lab defaults to camera mode on open questions. It grows context through feedback before it commits a large conclusion. A lightweight Walk can still fail if the agent reads a brief, silently runs several interpretive probes, and returns a polished thesis without first finding out what the user sees in the specimen. A long Expedition can remain camera-like when its Field Trips keep returning bounded readings for correction.

The OODA loop supplies the brake. During camera mode, the human owns **Observe and Orient**, including which instruments to use and what their readings mean together. The agent asks for missing substrate, offers instruments, and returns bounded readings without turning them into a complete explanation. Synthesis, ranking, substantive recommendations, action plans, and action wait for an explicit request. A full-dialectic request still authorizes its named phase outputs, including synthesis where earned.

The usual loop is:

1. read the specimen before declaring a route;
2. reflect a provisional focus and ask 1–3 questions that could change the analysis; if an answer could change the recommendation, stop and wait;
3. offer three distinct instruments, what each measures, and why its reading may help; wait for the user to choose;
4. say “I’m pulling in the [name] instrument ([brief explanation])”, then run only the selected instrument;
5. return its bounded reading, calibration, artifact risk, and unmeasured remainder without explaining the whole specimen;
6. ask what the user notices, then offer the next three instrument choices or say that no next instrument is warranted.

Instrument use is visible but light. The stable “I’m pulling in the [name] instrument…” lead-in makes the field-lab metaphor familiar through use. It follows selection rather than replacing it. The agent never hides an instrument inside fluent analysis, auto-runs a cheap probe, or dumps the whole bench on the user. After every readout, it checks which instruments could measure the unexamined remainder and normally offers three distinct choices. It offers fewer when fewer honestly fit, does not rank them unless asked, and never treats a suggestion or calling signal as permission to run one.

A long brief supplies content, not complete context. It rarely says why the question matters now, what the user already suspects, what feels wrong, or which result would change the next move. Stable facts, narrow transformations, and explicit one-shot requests may still go straight to an answer. A question that sounds factual may still need focus: “How many branches should this bush have?” depends on the intended training system and the plant in front of the user. The lab checks whether the answer is invariant before searching toward a default. It does not offer a “working range” in the same turn as a question that could overturn that range.

This follows Venkatesh Rao's [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii): camera-like agent loops let seeing outrun doing by using feedback to produce an information surplus; engine-like loops let doing outrun seeing.

## What counts as an instrument

Not every useful prompt is an instrument. An instrument must make something visible, separable, measurable, or testable that ordinary conversation leaves hidden or entangled. It must also name how it perturbs the specimen and what false reading it tends to produce.

That gives every instrument a counterfactual test:

> Without this operation, what would remain unseen?

A term scan separates meanings that fluent conversation lets slide together. Electric Monks expose consequences that cannot be reached while one reasoner hedges between incompatible beliefs. Blind possibility-space cartography compares a frozen source map with fresh model probes run across pre-frozen, meaning-preserving prompt variants, so expected model grooves and source-specific residue become visible without trusting temperature alone. A prompt that merely produces more ideas or saves time may still be useful, but it is a tool rather than an instrument.

The lab keeps three roles distinct:

- a **tool** helps perform work;
- an **instrument** creates a specific access differential and returns a reading with known artifacts;
- an **apparatus** coordinates instruments, controls, people, and memory across a larger method.

## Who runs an instrument

Execution placement is part of the instrument when it changes what can be seen:

- **Orchestrator:** responsive interviewing, continuity, synthesis, and user-facing interpretation.
- **Fresh subagent:** blindness from the current analysis creates the reading.
- **Parallel subagents:** context-isolated belief, evidence, or framing tracks must remain separate until comparison.
- **Hybrid:** isolated agents collect or generate; the orchestrator integrates.
- **Either:** delegation changes cost or variety, not the instrument's epistemic claim.

Every card states its context boundary, placement rationale, fallback, and return path. If a required fresh context is unavailable, the agent downgrades or renames the result instead of pretending to be blind to what it already knows.

## Field work and workflows

### Walk

Ordinary conversation with optional instruments. A direct answer is valid when the question is already well focused. Otherwise, the first instrument is usually a lightweight focus interview: a provisional reflection plus a few responsive questions about aim, stakes, prior belief, missing context, or intended use.

Other common field-kit probes include:

- mapping what happens before explaining why;
- making feelings, priorities, constraints, and affected people explicit;
- scanning a loaded term such as “clean,” “fair,” “simple,” or “done”;
- stating the smallest unresolved tension;
- checking for a missing third pole or ground condition;
- preparing, running, and interpreting a small, reversible real-world experiment.

Advanced instruments are also available on a Walk when their input can be satisfied in the session: short Electric Monks, exploratory 2×2s, blind structural reconnaissance, residue collection, hostile audit, or a quick possibility-space scout. A **taboo-parallax scout** can make a small hypothesis-only comparison on a Walk; its source-grounded three- or four-setting matrix normally calls for a Field Trip. A **blind-cartography scout** can compare one frozen source map with three fresh probes in the session; its larger 6–12-probe atlas normally calls for a Field Trip. Using several agents or sophisticated probes does not by itself open a field log.

Readings stay in the chat. The Walk does not create an artifact tree. But it is still a feedback loop: after a strong reading, the agent returns it to the user before running a long cascade or declaring the final thesis. After any reading, `stop` is a valid result.

### Field Trip

A Field Trip begins when the user agrees to open a field log for one bounded discovery operation. It may need an explicit coverage goal, repeated or comparative readings, coordination across instruments, research tracks, agents, or sessions, or simply a durable record that can be resumed, searched, or audited.

The new field log inherits the Walk from the session so far. It does not restart the inquiry or make the user repeat an interview. It keeps the original and current questions, claim types, instrument traces, coverage and stop rules, corrections, and open trails. A wiki remains optional until reuse, cross-links, recursion, several agents, or context loss make it useful.

### Expedition

An Expedition is a directory and sparse chronological index for several related Field Trips. It records when the Expedition began, what it is about, each Field Trip that joins, and selected changes, conclusions, or significant findings copied from authoritative Field Trip logs. Instruments, workflows, sources, raw readings, and detailed state stay in those field logs.

An Expedition is not a workflow. Starting one authorizes no instruments, analyses, or conclusions. It may contain ad hoc Field Trips, repeated observations, several workflows, or no named workflow at all.

### Electric Monk dialectic workflow

The full dialectic is one workflow that may run in a standalone Field Trip or inside an Expedition. Two or more context-isolated agents fully believe distinct positions on the user's behalf. The orchestrator compares the structures, finds how each position fails from inside its own logic, brings in outside material, and produces a palette of possible landings rather than forcing every specimen into synthesis.

A request for a “dialectic,” hostile thesis test, strongest case on each side, determinate negation, or validation requires context-isolated positions at minimum. The lab may run short blind Monks within a Walk or recommend the full dialectic workflow. It must not imitate separated opposition inside one orchestrator context merely because the user did not say “full.”

The workflow inherits the Walk, Field Trip, and Expedition record, then coordinates the same instrument bench through seven strict completion-gated phases. The phase procedures define the full work; the instrument cards govern what each operation can reveal, who runs it, its controls, and how its reading is recorded:

1. interview and research;
2. committed Monk prompt construction;
3. context-isolated belief essays;
4. determinate negation, lateral intervention, decomposition, and refinement;
5. a candidate palette: synthesis, juxtaposition, ground condition, framing dissolution, and undecidable-centered readings where earned;
6. position-preservation checks and hostile audit;
7. recursive exploration of the next unresolved contradiction.

Each phase gate cites an instrument-ledger entry. A phase cannot pass merely because it produced plausible prose: authorization, required blindness, context isolation, typed raw readings, calibration or controls, access deltas, artifact risks, unmeasured remainders, and traces must also be present. The gate also checks that phase interpretation is separate from the instrument readout. The gates remain strict; instrument contracts make their epistemic work visible rather than replacing them.

## Artifacts appear only when they earn their cost

| Field work              | Default record                                                               |
| ----------------------- | ---------------------------------------------------------------------------- |
| Direct answer           | Chat session                                                                 |
| Walk with any field kit | Chat session and any natural tool outputs                                    |
| Field Trip              | One curated field log; source, staging, and workflow files only when needed  |
| Expedition              | Expedition log/index plus the authoritative logs of its related Field Trips  |

Opening a field log distills the conversation so far. It does not rewrite an informal Walk as a scripted interview, and the user should not have to restate material already in the session. A workflow may add its declared artifacts inside the Field Trip. The full dialectic adds control logs, round files, a wiki, a queue, and a validation trace.

## What the dialectic workflow is for

Use the full apparatus when:

- you have locked onto a vision and cannot inhabit a real alternative;
- several sound commitments cannot all hold;
- you can argue every side but cannot find the structure that would let you act;
- a proven system may be optimizing the wrong goal;
- an inherited frame has become hard to see;
- the decision is costly enough that context-isolated positions and hostile validation can change it.

The Monks are an **artificial belief system**. Their job is not to think instead of the user. Their job is to carry incompatible beliefs at full strength so the user can inspect the contradiction without defending either side.

The dialectic workflow uses three main ideas:

- **Rao:** outsource belief load so the user can switch frames without belief inertia.
- **Hegel:** find each position's specific internal failure; preserve its real insight while changing the frame.
- **Boyd:** break closed conceptual systems apart, bring in outside material, and test whether new links can be traced back to their parts and fit.

It also keeps residue visible. Sometimes the sound result is not synthesis but a conflict that must stay open, a concrete ground condition, a fossil frame, or a word whose incompatible uses cannot be merged without loss.

## Repository map

- [`SKILL.md`](SKILL.md) — concise entry, router, field-work boundaries, and workflow gate
- [`reference/field-lab.md`](reference/field-lab.md) — field-work forms, router, stop and escalation rules
- [`reference/camera-loop.md`](reference/camera-loop.md) — feedback cadence and lightweight interviewing
- [`reference/instruments/index.md`](reference/instruments/index.md) — phenomenon-to-instrument registry
- [`reference/instruments/walk-kit.md`](reference/instruments/walk-kit.md) — lightweight instrument cards
- [`reference/instruments/advanced-bench.md`](reference/instruments/advanced-bench.md) — standalone contracts for advanced instruments
- [`reference/instruments/blind-cartography.md`](reference/instruments/blind-cartography.md) — blind possibility-space cartography
- [`reference/instruments/taboo-parallax.md`](reference/instruments/taboo-parallax.md) — cross-society sayability comparison with truth and stereotype controls
- [`reference/instrument-contract.md`](reference/instrument-contract.md) — access differential, execution placement, readout, provenance, and control rules
- [`reference/field-trip.md`](reference/field-trip.md) — one bounded logged discovery operation
- [`reference/field-log-template.md`](reference/field-log-template.md) — durable Field Trip record
- [`reference/expedition.md`](reference/expedition.md) — container and index contract for related Field Trips
- [`reference/expedition-log-template.md`](reference/expedition-log-template.md) — Expedition log/index schema
- [`reference/dialectic-workflow.md`](reference/dialectic-workflow.md) — full Electric Monk workflow contract
- [`reference/dialectic-instrument-map.md`](reference/dialectic-instrument-map.md) — authoritative phase-to-instrument lifecycle and gate map
- [`reference/dialectic-wiki.md`](reference/dialectic-wiki.md) — dialectic memory, firewall, and control log

## License

MIT
