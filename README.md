# Dialectic — a field lab for thinking with AI

_The Electric Monks are named after Douglas Adams' machines built to believe things for you._

Bring it any question. It may answer in one paragraph, pull a few instruments into the conversation, organize a systematic inquiry, or launch the full Electric Monk dialectic.

Every inquiry begins as a **Walk**. A direct answer is a complete and successful result when user-specific context is unlikely to change it. A nontrivial Walk begins by focusing with the user: the agent reflects what seems live, asks a few questions that could change the analysis, then alternates bounded instrument readings with user correction. A problem can be small yet context-bound: “keep this light” calls for fewer, sharper questions, not an instant canned fix. No files, mode menu, phase announcement, or setup are required.

If the inquiry later needs systematic collection or durable memory, it becomes a **Survey**. If a stubborn contradiction repays the cost of context-isolated committed agents, structural analysis, validation, and recursion, it becomes an **Expedition**. The existing seven-phase Electric Monk dialectic remains strict; it is no longer the price of entry.

## Why the field-lab shape

The original skill was one deep workflow. It produced useful results, but invoking it meant accepting the whole process. The field lab separates three things that had been tied together:

- **instrument access** — any inquiry may use the bench;
- **systematic method** — a Survey adds a collection plan and durable log;
- **full procedural safeguards** — an Expedition adds the seven-phase dialectic.

Instrument count does not set the state. A scientist may carry a camera, binoculars, recorder, and light meter on a walk. In the same way, a short conversation may use several probes and still remain a Walk. Survey and Expedition describe increasing systematicity, coordination, and memory—not access to better tools.

## Camera mode, not pure engine mode

The field lab has two independent axes:

- **Walk → Survey → Expedition** sets the scale of method, coordination, and memory.
- **Camera → engine** sets the tempo of feedback relative to conclusion and action.

The lab defaults to camera mode on open questions. It grows context through feedback before it commits a large conclusion. A lightweight Walk can still fail if the agent reads a brief, silently runs several interpretive probes, and returns a polished thesis without first finding out what the user sees in the specimen. A full Expedition can remain camera-like because interviews, framing checks, intermediate readouts, validation choices, and recursion keep adding error signals.

The usual loop is:

1. read the specimen before declaring a route;
2. reflect a provisional focus and ask 1–3 questions that could change the analysis; if an answer could change the recommendation, stop and wait;
3. say “I’m pulling in the [name] instrument ([brief explanation])” with its signal and what it may reveal, then run it;
4. show the provisional reading, what the probe may have induced, and what remains unclear;
5. ask what misregistered, then refocus; complete the caddy gate by suggesting up to two live next instruments and what each would expose, or say that stopping or acting is the best next move.

Instrument use is visible but light. The stable “I’m pulling in the [name] instrument…” lead-in makes the field-lab metaphor familiar through use. A cheap probe is announced and run in the same turn. A strong or costly perturbation includes its cost or artifact risk and waits for assent. The agent never hides an instrument inside fluent analysis, but it also does not dump the whole bench on the user. After every readout, it checks whether another instrument could materially reduce the residue. It closes with a named useful next instrument or an explicit no-next-instrument judgment. Conditional uncertainty still counts: “if this persists” must name the probe that would then help.

A long brief supplies content, not complete context. It rarely says why the question is live now, what the user already suspects, what feels wrong, or which result would change the next move. Stable facts, narrow transformations, and explicit one-shot requests may still go straight to an answer. A question that sounds factual may still need focus: “How many branches should this bush have?” depends on the intended training system and the plant in front of the user. The lab checks whether the answer is invariant before searching toward a default. It does not offer a “working range” in the same turn as a question that could overturn that range.

This follows Venkatesh Rao's [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii): camera-like agent loops let seeing outrun doing by using feedback to produce an information surplus; engine-like loops let doing outrun seeing.

## What counts as an instrument

Not every useful prompt is an instrument. An instrument must make something visible, separable, measurable, or testable that ordinary conversation leaves hidden or entangled. It must also name how it perturbs the specimen and what false reading it tends to produce.

That gives every instrument a counterfactual test:

> Without this operation, what would remain unseen?

A term scan separates meanings that fluent conversation lets slide together. Electric Monks expose consequences that cannot be reached while one reasoner hedges between incompatible beliefs. Blind possibility-space cartography compares a frozen source map with blind model replicates so expected model grooves and source-specific residue become visible. A prompt that merely produces more ideas or saves time may still be useful, but it is a tool rather than an instrument.

The lab keeps three roles distinct:

- a **tool** helps perform work;
- an **instrument** creates a specific access differential and returns a reading with known artifacts;
- an **apparatus** coordinates instruments, controls, people, and memory across a larger method.

## Who runs an instrument

Execution placement is part of the instrument when it changes what can be seen:

- **Orchestrator:** live interviewing, continuity, synthesis, and user-facing interpretation.
- **Fresh subagent:** blindness from the current analysis creates the reading.
- **Parallel subagents:** context-isolated belief, evidence, or framing tracks must remain separate until comparison.
- **Hybrid:** isolated agents collect or generate; the orchestrator integrates.
- **Either:** delegation changes cost or variety, not the instrument's epistemic claim.

Every card states its context boundary, placement rationale, fallback, and return path. If a required fresh context is unavailable, the agent downgrades or renames the result instead of pretending to be blind to what it already knows.

## The three states

### Walk

Ordinary conversation with optional instruments. A direct answer is valid when the question is already well focused. Otherwise, the first instrument is usually a lightweight focus interview: a provisional reflection plus a few responsive questions about aim, stakes, prior belief, missing context, or intended use.

Other common field-kit probes include:

- mapping what happens before explaining why;
- making feelings, priorities, constraints, and affected people explicit;
- scanning a loaded term such as “clean,” “fair,” “simple,” or “done”;
- stating the smallest live tension;
- checking for a missing third pole or ground condition;
- preparing, running, and interpreting a small, reversible real-world experiment.

Advanced instruments are also available on a Walk when their input can be satisfied in the session: short Electric Monks, exploratory 2×2s, blind structural reconnaissance, residue collection, hostile audit, or a quick possibility-space scout. A **taboo-parallax scout** can make a small hypothesis-only comparison on a Walk; its source-grounded three- or four-setting matrix normally becomes a Survey. A **blind-cartography scout** can compare one frozen source map with three fresh probes in the session; its larger 6–12-probe atlas normally becomes a Survey. Using several agents or sophisticated probes does not by itself create a Survey.

Readings stay in the chat. The Walk does not create an artifact tree. But it is still a feedback loop: after a strong reading, the agent returns it to the user before running a long cascade or declaring the final thesis. After any reading, `stop` is a valid result.

### Survey

A Survey begins only when observation becomes systematic: the inquiry needs an explicit coverage goal, repeated or comparative readings, coordination across several instruments, research tracks, agents, or sessions, or a durable record that can be resumed, searched, or audited.

Promotion creates one Survey log from the session so far. It does not restart the inquiry or make the user repeat an interview. A wiki remains optional until reuse, cross-links, recursion, several agents, or context loss make it useful.

### Expedition

The full Electric Monk apparatus. Two or more context-isolated agents fully believe distinct positions on the user's behalf. The orchestrator compares the structures, finds how each position fails from inside its own logic, brings in outside material, and produces a palette of possible landings rather than forcing every specimen into synthesis.

A request for a “dialectic,” hostile thesis test, strongest case on each side, determinate negation, or validation requires context-isolated positions at minimum. The lab may run short blind Monks within a Walk or recommend the full Expedition. It must not imitate separated opposition inside one orchestrator context merely because the user did not say “full.”

An Expedition inherits the Walk and Survey record, then coordinates the same instrument bench through seven strict completion-gated phases. The phase procedures define the full work; the instrument cards govern what each operation can reveal, who runs it, its controls, and how its reading is recorded:

1. interview and research;
2. committed Monk prompt construction;
3. context-isolated belief essays;
4. determinate negation, lateral intervention, decomposition, and refinement;
5. a candidate palette: synthesis, juxtaposition, ground condition, framing dissolution, and undecidable-centered readings where earned;
6. position-preservation checks and hostile audit;
7. recursive exploration of the next live contradiction.

Each phase gate cites an instrument-ledger entry. A phase cannot pass merely because it produced plausible prose: required blindness, context isolation, controls, access deltas, artifact risks, and traces must also be present. The gates remain strict; instrument contracts make their epistemic work visible rather than replacing them.

## Artifacts appear only when they earn their cost

| Inquiry state           | Default record                                                       |
| ----------------------- | -------------------------------------------------------------------- |
| Direct answer           | Chat session                                                         |
| Walk with any field kit | Chat session and any natural tool outputs                            |
| Survey                  | One curated Survey log; source and staging files only when needed    |
| Expedition              | Promoted control log, round files, wiki, queue, and validation trace |

Promotion distills the conversation so far. It does not rewrite an informal Walk as a scripted interview, and the user should not have to restate material already in the session.

## Example paths

- **Off-the-cuff question:** “Why do moths fly toward porch lights?” → direct answer, no visible method.
- **Fact-shaped practical Walk:** “How many branches should this fruit bush have?” → reflect the specimen, clarify the desired form, then search or advise; no files.
- **Instrument-rich Walk:** “My wife and I mean different things by a clean kitchen.” → term scan, stake map, and a one-week experiment; no files.
- **Hostile thesis Walk:** “Test this thesis against its strongest opposition.” → focus interview, short context-isolated Monks, intermediate reading, then user correction; still no files if persistence is unnecessary.
- **Survey:** “Compare four family calendar systems over three weeks and let us resume later.” → shared collection plan and durable Survey log.
- **Expedition:** “Should our open-source framework launch first-party cloud hosting?” → inherited field record, context-isolated committed positions, decomposition, candidate palette, audit, and recursion.

## Installation

The skill needs its reference files, so install the whole repository with the [`skills` CLI](https://github.com/vercel-labs/skills). It supports Claude Code, Codex, and other agents:

```bash
npx skills add KyleAMathews/hegelian-dialectic-skill
```

Add `-g` for a global install. Then invoke the `dialectic` skill in an ordinary question:

```text
/dialectic Why do I keep putting off this small migration?
```

```text
/dialectic Help us work out what “clean” means when we say the kitchen is done.
```

```text
/dialectic I want the full Expedition on whether our framework should own deployment.
```

You do not need to choose Walk or Survey up front. Ask for a named instrument directly if you want one: “run a term scan,” “check for a ground condition,” “map this possibility space,” or “stress these positions with Electric Monks.”

## What the Expedition is for

Use the full apparatus when:

- you have locked onto a vision and cannot inhabit a real alternative;
- several sound commitments cannot all hold;
- you can argue every side but cannot find the structure that would let you act;
- a proven system may be optimizing the wrong goal;
- an inherited frame has become hard to see;
- the decision is costly enough that context-isolated positions and hostile validation can change it.

The Monks are an **artificial belief system**. Their job is not to think instead of the user. Their job is to carry incompatible beliefs at full strength so the user can inspect the contradiction without defending either side.

The Expedition uses three main ideas:

- **Rao:** outsource belief load so the user can switch frames without belief inertia.
- **Hegel:** find each position's specific internal failure; preserve its real insight while changing the frame.
- **Boyd:** break closed conceptual systems apart, bring in outside material, and test whether new links can be traced back to their parts and fit.

It also keeps residue visible. Sometimes the sound result is not synthesis but a conflict that must stay open, a concrete ground condition, a fossil frame, or a word whose incompatible uses cannot be merged without loss.

## Repository map

- [`SKILL.md`](SKILL.md) — concise entry, router, state boundaries, and Expedition gate
- [`reference/field-lab.md`](reference/field-lab.md) — field states, router, stop and escalation rules
- [`reference/camera-loop.md`](reference/camera-loop.md) — feedback cadence and lightweight interviewing
- [`reference/instruments/index.md`](reference/instruments/index.md) — phenomenon-to-instrument registry
- [`reference/instruments/walk-kit.md`](reference/instruments/walk-kit.md) — lightweight instrument cards
- [`reference/instruments/advanced-bench.md`](reference/instruments/advanced-bench.md) — standalone contracts for advanced instruments
- [`reference/instruments/blind-cartography.md`](reference/instruments/blind-cartography.md) — blind possibility-space cartography
- [`reference/instruments/taboo-parallax.md`](reference/instruments/taboo-parallax.md) — cross-society sayability comparison with truth and stereotype controls
- [`reference/instrument-contract.md`](reference/instrument-contract.md) — access differential, execution placement, readout, provenance, and control rules
- [`reference/apparatus-survey.md`](reference/apparatus-survey.md) — Survey entry and operation
- [`reference/survey-log-template.md`](reference/survey-log-template.md) — first durable inquiry record
- [`reference/apparatus-expedition.md`](reference/apparatus-expedition.md) — full apparatus map and promotion contract
- [`reference/expedition-instrument-map.md`](reference/expedition-instrument-map.md) — authoritative phase-to-instrument lifecycle and gate map
- [`reference/dialectic-wiki.md`](reference/dialectic-wiki.md) — Expedition memory, firewall, and control log
- [`docs/superpowers/specs/2026-07-21-field-lab-architecture-design.md`](docs/superpowers/specs/2026-07-21-field-lab-architecture-design.md) — design rationale

## License

MIT
