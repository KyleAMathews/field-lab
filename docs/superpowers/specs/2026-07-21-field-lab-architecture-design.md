# Field Lab Architecture — Design

**Date:** 2026-07-21
**Status:** Draft for review
**Skill:** Hegelian dialectic (`/Users/kylemathews/programs/hegelian-dialectic-skill`)

## Origin

The current skill began as a seven-phase dialectical workflow. Real use has pushed it toward something less linear: an iterative environment in which the user and orchestrator pull in different tools as the inquiry develops.

Two observations make that shift explicit:

1. Venkatesh Rao's ["The Crooked Timber of AI"](https://protocolized.summerofprotocols.com/p/the-crooked-timber-of-ai) frames AI inquiry as discovery rather than invention. Discovery needs expeditions, maps, instruments, and repeated local observation. It does not begin from a finished architectonic theory.
2. Small domestic uses, such as discussing how two people clean a kitchen, show that the skill can reveal feelings, constraints, priorities, and loaded terms—but the full dialectic is far too large for the problem. The useful work may take ten minutes; the current workflow tries to send the specimen through the whole laboratory.

The design response is to make the **field lab** the stable system and the current seven-phase dialectic one **expedition apparatus** assembled inside it.

## Problem

The current design is **phase-push**:

- Once a question enters the workflow, later phases are presumed to follow.
- Phase completion gates enforce thorough execution but cannot ask whether the next phase is needed.
- Lightweight tools such as a term scan, stakeholder map, or 2×2 are embedded inside the full process instead of being available on their own.
- The cost of using one useful operation is therefore the cost of entering the whole dialectic.
- The workflow can mistake its own induced phenomena for discoveries. Electric Monks deliberately polarize belief; 2×2s project a second axis; donor domains invite structural analogy. These interventions reveal things, but they can also manufacture them.

The result is a capable but oversized instrument. It fits high-stakes, stubborn contradictions. It is awkward for daily problems, early exploration, or a user who already knows which probe they need.

## Goal

Turn the project into an **expeditionary field lab for conceptual discovery**:

- Start with the smallest useful observation.
- Pull instruments as the specimen warrants them.
- Make each instrument's perturbation, readout, limits, and artifacts explicit.
- Let every readout stop the inquiry, suggest a small real-world experiment, call another instrument, or promote the inquiry to a larger apparatus.
- Preserve the current full dialectic as the **Expedition** apparatus rather than weakening it.
- Add light **Walk** and medium **Survey** apparatuses for smaller or less mature problems.
- Keep the user as the steering and stopping authority at every scale.

## Non-goals

- Do not reduce the rigor of the existing seven-phase dialectic.
- Do not turn mode selection into an automatic classifier that can silently escalate cost.
- Do not claim that conceptual inquiry becomes empirical science because it borrows laboratory language.
- Do not require every current phase to become a standalone file in the first implementation.
- Do not replace the research wiki, control log, refinement loop, or palette. They become shared lab infrastructure or Expedition instruments.
- Do not refactor all existing instructions in one change. The architecture should be introduced and tested in layers.

## Core Vocabulary

### Field lab

The stable environment shared by all inquiries. It provides:

- the specimen and goal record;
- an observation ledger;
- the instrument registry;
- routing and user checkpoints;
- provenance and artifact tracking;
- persistent maps, logs, and queues when the inquiry needs them.

The field lab does not prescribe a single sequence.

### Specimen

The situation under inquiry: a decision, contradiction, recurring conflict, concept, plan, body of evidence, or felt problem. A specimen includes the user's intended outcome and audience, not only the surface question.

### Instrument

A bounded operation designed to make one kind of conceptual phenomenon easier to observe. An instrument applies a known perturbation and emits a limited readout. Examples: belief stress, term loading, frame projection, donor transfer, residue detection, or frontier response.

### Apparatus

A configured sequence or graph of instruments for a class of inquiry. Walk, Survey, and Expedition are apparatuses. They provide defaults, not compulsory pipelines.

### Readout

The instrument's typed result: what it observed, what it inferred, what it may have induced, what remains unresolved, and what—if anything—could usefully happen next.

### Map

Persistent state built from readouts: the research wiki, control log, tension pages, frontier ledger, dialectic queue, and any future cross-run calibration record. A map is a record of prior observation, not the territory or a fixed ontology.

## Design Principles

1. **Start with a daily walk.** Default to the smallest apparatus that can make the problem more legible. Escalation must be earned by unresolved signal.
2. **Instrument-pull, not phase-push.** A readout names possible next instruments; it does not imply that any must run.
3. **The user steers and stops.** The orchestrator diagnoses and recommends. The user chooses whether to stop, act, probe again, or promote the inquiry.
4. **Separate observation from intervention.** Every instrument states what it perturbs. A phenomenon that appears only under belief stress or a chosen projection is marked as possibly induced.
5. **Use independent readouts where stakes rise.** High-cost conclusions should survive another framing, model, control, or evidentiary check.
6. **Treat theories as instruments.** Hegel, Boyd, Adorno, Foucault, Derrida, Schumacher, and Rao supply devices with operating ranges and artifacts. None is the lab's ontology.
7. **Preserve crookedness.** Residue, incompatible ends, and unresolved words are valid readouts. The apparatus need not straighten every specimen into synthesis.
8. **Scale to uncertainty, not topic prestige.** A domestic question may hide serious stakes; a grand philosophical question may need only a term scan. Begin small in both cases.
9. **Prefer a real-world experiment when it is cheaper than more interpretation.** For reversible practical questions, the best next step may be a one-week trial rather than another conceptual pass.

## The Instrument Contract

Every instrument is documented with the same card:

| Field | Requirement |
|---|---|
| **Name / ID** | Stable, plain-language name plus a short identifier |
| **Phenomenon sought** | The specific thing this instrument helps reveal |
| **Operating range** | When it is useful and when it should not be used |
| **Input requirements** | Minimum specimen state needed to run it |
| **Perturbation** | What the instrument deliberately changes, stresses, hides, projects, or injects |
| **Procedure** | The bounded operation |
| **Readout** | The structured result it returns |
| **Calibration / control** | Baseline, repetition, independent view, or falsification check required in proportion to risk |
| **Common artifacts** | Characteristic false positives and distortions |
| **Escalation signals** | Findings that may warrant another named instrument or larger apparatus |
| **Stop conditions** | Findings after which more conceptual work is unlikely to help |
| **Cost profile** | Rough user attention, time, research, and agent cost |
| **Persistence** | What, if anything, is written to the lab's maps |

An instrument that cannot name a unique phenomenon and characteristic artifact has not earned a separate place on the bench.

## Common Readout Contract

Each run returns a short readout packet:

```yaml
instrument: <id>
specimen-delta: <what became more legible or changed>
findings:
  - claim: <one finding>
    kind: <observation|user-testimony|source-claim|elicited-response|inference|analogy|normative-judgment|hypothesis>
    support: <citation, testimony pointer, or instrument trace>
    confidence: <solid|plausible|reach>
artifact-risk: <what the instrument may have induced or hidden>
residue: <what remains unclear, incompatible, or unmeasured>
next-options:
  - <stop|small-experiment|instrument-id|promote-to-survey|promote-to-expedition>
recommendation: <one option and why; user decides>
```

The `kind` field forms the **observation ledger**. It prevents a Monk inference, donor analogy, or synthesis hypothesis from silently becoming an observed fact.

## Apparatus Scales

### Walk — default

**Purpose:** Make an everyday or early-stage problem legible with minimal machinery.

**Typical use:** Household coordination, a small team disagreement, an unclear preference, a reversible decision, or the first pass over a larger question.

**Default instruments:**

1. **Substrate map** — what happens now, stated without causal explanation.
2. **Stake map** — feelings, needs, constraints, priorities, standards, and affected people.
3. **Term scan** — words used by several people with different loadings.
4. **Tension statement** — the smallest contradiction that explains the recurring friction.
5. **Small-experiment designer** — a bounded, reversible change that can produce new observation.

Walk begins with the smallest shared observation the specimen needs—usually substrate or stakes. The other instruments are pulled only when that observation emits their signal; the list is a kit, not a five-step miniature pipeline.

Walk produces a one-page readout at most. It creates no wiki or donor sea by default. It stops when the problem is legible enough for a conversation, choice, or small experiment.

### Survey — selective probing

**Purpose:** Map several plausible frames or test a genuine contradiction without launching the full dialectic.

**Typical use:** The Walk surfaced incompatible priorities, disputed causality, a missing perspective, or a frame that changes under inspection.

**Available instruments:**

- lightweight belief-stress rig (short Monks, no independent research by default);
- third-pole probe;
- exploratory or hidden-question 2×2;
- blind structural reconnaissance;
- ground-condition probe;
- framing-genealogy scan;
- misfit/residue collector;
- targeted factual research;
- framing-sensitivity control.

Survey stops when one framing becomes usable, a real-world experiment is available, or the remaining contradiction clearly warrants Expedition.

### Expedition — current full dialectic

**Purpose:** Explore a high-stakes, costly, poorly understood, or stubborn contradiction whose structure cannot be made legible by a few local probes.

The existing seven phases remain the default Expedition apparatus:

1. elenctic interview and research;
2. Monk prompt construction;
3. committed belief essays;
4. determinate negation, lateral intervention, and decomposition;
5. candidate palette;
6. validation and hostile audit;
7. recursive exploration.

Its completion gates remain strict **inside the apparatus**. The new field-lab router governs entry, exit, and optional instrument calls around it. Expedition is not weakened; it is placed inside a larger system with a sensible default scale.

### Bench — direct instrument access

An experienced user may request an instrument directly: “run a term scan,” “stress these two positions,” “check for a ground condition,” or “apply the frontier rheometer.” The lab records the specimen and runs that instrument without forcing a Walk or Expedition.

If the requested instrument lacks required input, the orchestrator asks only for the missing substrate or recommends the smallest preparatory instrument.

## Router

The router operates after every readout. It has four exits:

| Exit | Meaning |
|---|---|
| **Stop / act** | The specimen is legible enough; answer, decide, discuss, or run a small real-world experiment |
| **Probe** | One bounded uncertainty maps to a named instrument |
| **Promote** | Several linked uncertainties or high stakes warrant Survey or Expedition |
| **Reframe specimen** | The inquiry has revealed a different problem; update the specimen with the user before continuing |

The recommendation reports:

- what new signal appeared;
- what remains unresolved;
- which instrument could observe it;
- that instrument's likely cost and artifact;
- why stopping now is or is not reasonable.

No instrument or mode transition runs silently.

### Escalation heuristics

| Signal | Candidate next instrument |
|---|---|
| Feelings, priorities, or constraints remain implicit | Stake map |
| A repeated word appears to carry the dispute | Term scan / undecidable detector |
| Two positions cannot be inhabited together | Belief-stress rig |
| The binary may omit an independent constituency or axis | Third-pole probe / 2×2 |
| The frame itself appears inherited or interested | Framing-genealogy scan |
| A concrete fact may make the debate moot | Ground-condition probe |
| Claims depend on facts not yet known | Targeted research |
| Home vocabulary is exhausted | Donor perturbation rig |
| An elegant synthesis may have smoothed the specimen | Residue collector / loss audit |
| A reaching inquiry landed on an expected answer | Frontier rheometer / framing-sensitivity control |
| Several structurally valid landings remain | Candidate spectrograph (S/J/G/F/U palette) |
| A high-stakes candidate will guide action | Validation and hostile assay |

### Stop heuristics

Recommend stopping or acting when:

- the user can state the tension and each person's stakes without caricature;
- the remaining question is empirical and a cheap observation can answer it;
- a reversible real-world experiment will teach more than another conceptual pass;
- the inquiry is repeating the same readout with no new facts, axes, cross-edges, or residue;
- the user has enough clarity for the actual deliverable, even if the larger contradiction remains open.

## Existing Instruments: First Registry

The current workflow already contains most of the first bench:

| Existing operation | Instrument identity | Characteristic artifact |
|---|---|---|
| Elenctic interview | Stake and assumption mapper | Interview frame follows the orchestrator's questions |
| Third-pole probe | Missing-perspective detector | Confabulated “third way” with no constituency |
| 2×2 diagrams | Frame projector | False orthogonality and tidy quadrants |
| Blind structural reconnaissance | Home-frame leak detector | Abstraction strips the epistemological register |
| Electric Monks | Belief-stress rig | Forced polarization creates a contradiction |
| Determinate negation | Fracture scanner | Every failure is read as self-sublating |
| Compressed conflicts and metaphors | Defamiliarization probes | Resonance mistaken for structure |
| Donor recruitment | Cross-domain perturbation rig | Elegant false isomorphism |
| Boydian decomposition | Structural recombinator | Analyst invents “atomic” parts or imports a hidden taxonomy |
| Misfit register | Residue collector | Orchestrator decides what counts as residue |
| Loss audit | Hidden-signal recovery assay | “Interesting” substitutes for useful and supported |
| Frontier overlay | Semantic rheometer | Divergence mistaken for novelty or value |
| S/J/G/F/U palette | Candidate spectrograph | Preset bands bound the visible spectrum |
| Monk validation | Position-preservation assay | A Monk protects its original rhetoric rather than its insight |
| Hostile auditor | Failure-stress assay | Criticism is generated without consequence or empirical contact |
| Wiki, log, and queue | Atlas and field notebook | Recorded categories harden into assumed ontology |

Each instrument receives a full card during implementation. The table is an inventory, not yet the contract implementation.

## Missing Instruments to Build First

### 1. Control run / artifact detector

Produce a neutral phenomenological reading before or beside a strong perturbation. Compare it with the stressed readout. If a contradiction, axis, or conclusion appears only under the instrument, mark it as possibly induced.

### 2. Framing-sensitivity scanner

Repeat a bounded probe with pole order reversed, key terms renamed, or a different model family. Return stable structure, frame-sensitive structure, and model-sensitive structure. Use in proportion to stakes, not on every Walk.

### 3. Negative-control transfer assay

For a donor mapping, name a nearby case where the same proposed structural transfer should work but does not. The existing `[fit:]` and analogy-break checks remain; the negative control tests whether the mapping discriminates anything.

### 4. Observation ledger

Implement the `kind` field in the common readout and preserve it through later instruments. Syntheses may transform claims, but they may not erase whether a constituent began as testimony, source fact, elicited response, analogy, or hypothesis.

### 5. Small-experiment designer

For practical and reversible problems, propose one bounded change, observation period, success signal, and review point. It is not a policy recommendation appended to synthesis; it is an alternative to further conceptual work.

## Example: Kitchen Cleaning as a Walk

**Specimen:** Two people repeatedly experience friction over cleaning the kitchen.

**Goal:** Reach a workable shared practice and understand enough of the stakes to avoid treating the problem as a mere task allocation dispute.

**Walk apparatus:**

1. Substrate map: who notices, initiates, performs, and declares the kitchen done; when; under what energy and schedule constraints.
2. Stake map: cleanliness, rest, fairness, hospitality, care, control, cognitive load, and the feeling of being left with unfinished work.
3. Term scan: “clean,” “done,” “help,” “fair,” and “later.”
4. Tension statement: name the one or two conflicts that best explain the friction without resolving them.
5. Small experiment: change one ownership rule, definition of done, or timing convention for one week; specify what both people will observe.

**Stop:** Do not recruit donors, run Boydian decomposition, create a five-candidate palette, or recurse unless the Walk—or repeated small experiments—shows a deeper contradiction that the local instruments cannot make legible.

## State and Persistence

### Walk

Default artifact: one concise `walk_readout.md` only when the user wants a file. No persistent wiki required.

### Survey

Default artifact: a specimen record plus instrument readouts. Promote to a control log if more than one pass occurs. A wiki is optional and begins only when research or reusable cross-links justify it.

### Expedition

Keep the existing round files, wiki, staging directory, control log, tension pages, and dialectic queue. Add instrument IDs and observation kinds gradually so the full trace can be read as a sequence of calibrated readouts.

### Cross-run calibration

Deferred until several instrument cards have been used in practice. The eventual calibration atlas should track which findings survive reframing, which instruments generate recurring artifacts, and which donor classes produce weak transfers. Do not create a scoring system before enough runs exist to ground it.

## Proposed File Footprint

```text
reference/
├── field-lab.md                  # lab vocabulary, principles, router, scale selection
├── instrument-contract.md        # card + common readout contracts
├── instruments/
│   ├── index.md                  # registry: phenomenon → instrument → source procedure
│   └── <instrument-id>.md        # one card per extracted or new instrument
├── apparatus-walk.md             # light defaults and stop conditions
├── apparatus-survey.md           # selective-probe defaults and promotion rules
└── apparatus-expedition.md       # entry/map only; points to existing phase docs
```

The cards do not duplicate long procedures already defined in phase docs. They name the instrument contract and point to the existing source procedure. A procedure is extracted only when Walk, Survey, or Bench must run it independently.

## Migration Strategy

### Stage 1 — Add the lab shell without changing Expedition

- Create `reference/field-lab.md`: vocabulary, principles, router, and mode selection.
- Create `reference/instrument-contract.md`: the card and readout schemas.
- Create `reference/instruments/index.md`: the first registry, linking existing operations to their current source procedures.
- Add a short top-level section to `SKILL.md` that identifies the field lab and makes Expedition one apparatus.
- Keep every existing phase instruction intact.

### Stage 2 — Build Walk

- Create `reference/apparatus-walk.md`.
- Specify the substrate map, stake map, term scan, tension statement, and small-experiment designer.
- Test it on domestic coordination, small team friction, and reversible decisions.
- The main test: does Walk stop cleanly without feeling like an abbreviated failed dialectic?

### Stage 3 — Build Survey from existing instruments

- Create `reference/apparatus-survey.md`.
- Extract lightweight contracts for the third-pole probe, 2×2, blind reconnaissance, short Monks, ground condition, genealogy, and residue scan.
- Add the control run and framing-sensitivity scanner.
- Test promotion and stopping decisions against the same specimens run at Walk scale.

### Stage 4 — Wrap the existing workflow as Expedition

- Create `reference/apparatus-expedition.md` as the entry contract and map to the existing phase docs; do not duplicate them.
- Add instrument IDs and readout packets at natural phase boundaries.
- Change phase transitions only where the field-lab router now permits a clean stop or a targeted instrument call.

### Stage 5 — Calibrate on prior and new runs

- Re-read several completed dialectics as instrument traces.
- Identify which findings were stable, induced, frame-sensitive, or unsupported transfers.
- Refine instrument cards from observed failures rather than from metaphor alone.
- Only then consider a larger reorganization of files or typed wiki state.

## Acceptance Criteria

The architecture is working when:

1. A user can bring a small practical tension and receive useful clarity without entering Expedition.
2. Every instrument names its phenomenon, perturbation, readout, control, and characteristic artifact.
3. Every readout can legitimately end with `stop`.
4. The user sees the cost and reason before promotion to Survey or Expedition.
5. The full current dialectic remains available and no less rigorous.
6. Later outputs preserve the distinction among fact, testimony, elicited response, analogy, judgment, and hypothesis.
7. Findings that appear only under a strong instrument are marked as possibly induced.
8. A practical inquiry can choose a reversible experiment instead of more analysis.
9. New instruments are added because they reveal a missing phenomenon, not because they fit the laboratory metaphor.

## Open Questions

1. Should `dialectic` remain the skill name while the field lab is its architecture, or should a future top-level `field-lab` skill call the dialectic apparatus? Default for the first implementation: keep the current skill name and avoid a packaging migration.
2. Should Walk write a file by default? Default: no; persist only on request or when the inquiry promotes.
3. Should the observation ledger live in one session file or inside every readout? Default: inside each readout, with aggregation only for multi-pass Survey and Expedition runs.
4. How short can lightweight Monks be while still functioning as belief stress rather than ordinary pro/con generation? This needs empirical testing.
5. Which current completion gates belong to instruments, which belong to the Expedition apparatus, and which are workflow bureaucracy with no unique readout? Answer during instrument-card extraction, not in advance.

## Model Update

- **Before:** The project is an artificial belief system implemented as a rigorous seven-phase dialectical workflow.
- **After:** The project is a field lab for conceptual discovery. Artificial belief is one instrument; the seven-phase dialectic is its Expedition apparatus; Walk and Survey provide smaller configurations.
- **Because:** Real use shows that different specimens need different perturbations and scales. A stable lab with explicit instrument contracts preserves the full dialectic's depth while making ordinary inquiry lighter, more honest about artifacts, and easier to extend.
