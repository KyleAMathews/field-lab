# Field Lab Architecture — Design

**Date:** 2026-07-21
**Status:** Draft for review
**Skill:** Hegelian dialectic (`/Users/kylemathews/programs/hegelian-dialectic-skill`)

## Origin

The current skill began as a seven-phase dialectical workflow. Real use has pushed it toward something less linear: an iterative environment in which the user and orchestrator pull in different tools as the inquiry develops.

Two observations make that shift explicit:

1. Venkatesh Rao's ["The Crooked Timber of AI"](https://protocolized.summerofprotocols.com/p/the-crooked-timber-of-ai) frames AI inquiry as discovery rather than invention. Discovery needs expeditions, maps, instruments, and repeated local observation. It does not begin from a finished architectonic theory.
2. Small domestic uses, such as discussing how two people clean a kitchen, show that the skill can reveal feelings, constraints, priorities, and loaded terms—but the full dialectic is far too large for the problem. The useful work may take ten minutes; the current workflow tries to send the specimen through the whole laboratory.

A first test of the field-lab refactor exposed a third observation. Given a long thesis brief and a request for a hostile dialectic, the revised skill skipped interviewing, ran several probes in one context, and returned a polished thesis/antithesis/negation package. The artifact tax was gone, but so was the feedback loop. The refactor had confused **lighter apparatus** with **less elicitation**.

The design response is to make the **field lab** the stable system and the current seven-phase dialectic one **expedition apparatus** assembled inside it.

## Problem

The current design is **phase-push**:

- Once a question enters the workflow, later phases are presumed to follow.
- Phase completion gates enforce thorough execution but cannot ask whether the next phase is needed.
- Lightweight tools such as a term scan, stakeholder map, or 2×2 are embedded inside the full process instead of being available on their own.
- The cost of using one useful operation is therefore the cost of entering the whole dialectic.
- The workflow can mistake its own induced phenomena for discoveries. Electric Monks deliberately polarize belief; 2×2s project a second axis; donor domains invite structural analogy. These interventions reveal things, but they can also manufacture them.
- The first field-lab shell can fail in the opposite direction: a rich Walk may become a one-shot analytical engine. The orchestrator reads a specimen, batches several probes, and commits an answer before the user can correct its focus. A long brief supplies content but not the error signals that reveal why the question is live, what the user already suspects, or what has been misread.

The result is a capable but oversized instrument. It fits high-stakes, stubborn contradictions. It is awkward for daily problems, early exploration, or a user who already knows which probe they need.

## Goal

Turn the project into an **expeditionary field lab for conceptual discovery**:

- Start with the smallest useful observation.
- Pull instruments as the specimen warrants them.
- Make each instrument's perturbation, readout, limits, and artifacts explicit.
- Let every readout stop the inquiry, suggest a small real-world experiment, call another instrument, or promote the inquiry to a larger apparatus.
- Preserve the current full dialectic as the **Expedition** apparatus rather than weakening it.
- Make the field lab the default container for questions: a canned response is a valid zero-instrument result, while any promising walk can deepen without restarting.
- Make instruments available throughout the Walk; let **Survey** begin only when observation becomes systematic and needs a curated, durable record.
- Keep the lab in **camera mode** on open questions: use lightweight interviewing and intermediate readouts so feedback grows context faster than the orchestrator commits conclusions.
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

### Field kit

The instruments available during a Walk, selected and changed according to the phenomena being studied. A field kit is not a fixed sequence. Like a scientist carrying a camera, binoculars, audio recorder, and light meter, the field lab may use several instruments opportunistically without turning the Walk into a Survey.

### Apparatus

A configured sequence or graph of instruments for a class of inquiry. Survey can grow into a lightweight apparatus around an explicit collection plan; Expedition is the full named apparatus. A Walk is not an apparatus—it is the field lab's ordinary conversational state.

### Camera and engine tempo

An axis independent of apparatus size, adapted from Venkatesh Rao's [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii). In **camera mode**, feedback expands context faster than the lab commits conclusions or actions. In **engine mode**, action or conclusion outruns sensing. A Walk, Survey, or Expedition can operate at either tempo; open inquiry should default to camera mode.

### Focus interview

The first camera-mode instrument for a nontrivial inquiry. After reading the specimen, the orchestrator reflects a provisional focus and asks a few questions whose answers could change the analysis. It is responsive elicitation, not a fixed intake form and not Expedition Phase 1 bureaucracy.

### Readout

The instrument's typed result: what it observed, what it inferred, what it may have induced, what remains unresolved, and what—if anything—could usefully happen next.

### Map

Persistent state built from readouts: the research wiki, control log, tension pages, frontier ledger, dialectic queue, and any future cross-run calibration record. A map is a record of prior observation, not the territory or a fixed ontology.

## Design Principles

1. **Every inquiry starts as a daily walk.** The skill should be no more costly than ordinary chat when a canned answer or conversation is enough.
2. **Instruments belong on the Walk.** Pull any fitting instruments without imposing an artifact or workflow tax. Survey and Expedition describe increasing systematicity and coordination, not access to better tools.
3. **Default to camera mode.** For open questions, read before routing, focus with the user, return provisional exposures, and treat correction as new information. Context should grow faster than commitment.
4. **Demand an access differential.** An instrument must make something visible, separable, measurable, or testable that unaided inquiry leaves hidden or entangled. A useful prompt that only produces more material or saves time is still a tool, not yet an instrument.
5. **The user steers and stops.** The orchestrator diagnoses and recommends. The user chooses whether to stop, act, probe again, or promote the inquiry.
6. **Separate observation from intervention.** Every instrument states what it perturbs. A phenomenon that appears only under belief stress or a chosen projection is marked as possibly induced.
7. **Use independent readouts where stakes rise.** High-cost conclusions should survive another framing, model, control, or evidentiary check.
8. **Treat theories as instruments.** Hegel, Boyd, Adorno, Foucault, Derrida, Schumacher, and Rao supply devices with operating ranges and artifacts. None is the lab's ontology.
9. **Preserve crookedness.** Residue, incompatible ends, and unresolved words are valid readouts. The apparatus need not straighten every specimen into synthesis.
10. **Scale to uncertainty, not topic prestige.** A domestic question may hide serious stakes; a grand philosophical question may need only a term scan. Begin small in both cases.
11. **Prefer a real-world experiment when it is cheaper than more interpretation.** For reversible practical questions, the best next step may be a one-week trial rather than another conceptual pass.
12. **Materialize artifacts lazily.** The session record is enough for a Walk. Create logs, files, and knowledge structures only when persistence or coordination becomes useful.

## The Instrument Contract

Every instrument is documented with the same card:

| Field                     | Requirement                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **Name / ID**             | Stable, plain-language name plus a short identifier                                           |
| **Phenomenon sought**     | The specific thing this instrument helps reveal                                               |
| **Unaided limit**         | What ordinary inspection or conversation leaves hidden, entangled, unmeasured, or untested    |
| **Access differential**   | What becomes observable, separable, measurable, or testable because the operation ran         |
| **Operating range**       | When it is useful and when it should not be used                                              |
| **Input requirements**    | Minimum specimen state needed to run it                                                       |
| **Perturbation**          | What the instrument deliberately changes, stresses, hides, projects, or injects               |
| **Procedure**             | The bounded operation                                                                         |
| **Readout**               | The structured result it returns                                                              |
| **Calibration / control** | Baseline, repetition, independent view, or falsification check required in proportion to risk |
| **Common artifacts**      | Characteristic false positives and distortions                                                |
| **Escalation signals**    | Findings that may warrant another named instrument or larger apparatus                        |
| **Stop conditions**       | Findings after which more conceptual work is unlikely to help                                 |
| **Cost profile**          | Rough user attention, time, research, and agent cost                                          |
| **Persistence**           | What, if anything, is written to the lab's maps                                               |
| **Execution seat**        | Orchestrator, fresh subagent, parallel subagents, hybrid, or either                           |
| **Context boundary**      | What each executor may and may not see                                                        |
| **Placement rationale**   | Why continuity, blindness, independence, or parallelism matters                               |
| **Fallback**              | Honest downgrade when the required seat is unavailable                                        |
| **Return path**           | Who interprets, combines, and presents the reading                                            |

An instrument that cannot name a unique phenomenon and characteristic artifact has not earned a separate place on the bench.

## Common Readout Contract

Each run returns a short readout packet:

```yaml
instrument: <id>
execution:
  seat: <actual execution seat>
  contexts: <who saw what>
  fallback: <none|named downgrade used>
specimen-delta: <what became more legible or changed>
access-delta: <what is observable or testable now that was not before the run>
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

The `kind` field forms the **observation ledger**. It prevents a Monk inference, donor analogy, or synthesis hypothesis from silently becoming an observed fact.

This is a logical contract, not mandatory user-facing YAML. During a Walk, express only the useful parts in natural prose. Materialize the full structure when the inquiry becomes a Survey.

## Field Work States

Every question enters the field lab. There is no up-front mode menu and no process announcement. Instruments are available from the first turn; the inquiry changes state only when its method and memory needs change. Feedback tempo is orthogonal: every state defaults to camera mode unless the task is highly playable or the user explicitly requests a one-shot result.

### Zero-instrument response

If user-specific context is unlikely to change the answer, answer directly and stop. This is a successful field-lab outcome, not a failure to invoke the method. The skill should add no visible ceremony, files, or routing language. Do not confuse a small personal or household problem with a context-free one: “keep this light” asks for a short focus interview, not a canned fix. Do not confuse fact-shaped practical advice with a stable fact either. Test whether the answer changes with the user's aim, named method, specimen state, constraints, or planned intervention before searching for the canonical answer.

### Walk — opportunistic instrumented observation

Ordinary conversation inside the field lab. The user may be exploring household coordination, a technical hunch, an unclear preference, a reversible decision, or the first edge of a much larger question.

On a nontrivial Walk, read the specimen, then run a brief **focus interview** before substantive analysis. Reflect a provisional account and ask 1–3 questions that could change the result. A long supplied artifact is not a waiver: it contains selected material, not the user's full aim, prior, stakes, felt uncertainty, or response to the first reading.

The Walk is not uninstrumented. The field lab carries a dynamic field kit and may pull one or many fitting instruments as the conversation produces signals:

- **Substrate map** — what happens now, stated without causal explanation.
- **Focus interview** — the user's aim, stakes, prior, felt uncertainty, and correction of the provisional frame.
- **Stake map** — feelings, needs, constraints, priorities, standards, and affected people.
- **Term scan** — words used by several people with different loadings.
- **Tension statement** — the smallest contradiction that explains recurring friction.
- **Third-pole or ground-condition probe** — an omitted axis, constituency, or concrete fact.
- **Small-experiment designer** — a bounded, reversible change that can produce new observation.

An instrument reports what it revealed and may have induced, then returns the provisional reading to the user. Strong readings do not silently trigger a cascade: the user's correction is the next error signal. Raw readings live in the session record. Some tools may naturally produce an image, recording, search result, or agent output, but the Walk creates no additional artifact bureaucracy and triggers no follow-on phase.

### Survey — the first materialized working state

Survey is not selected at entry and no number or kind of instruments forces promotion. An inquiry becomes a Survey when observation turns systematic: it needs an explicit collection plan, a coverage goal, repeated or comparative readings, coordination across agents or sessions, or an organized record that can be searched and audited.

Promotion materializes a **Survey log** from the session-so-far. It does not restart the inquiry or repeat the Walk as a formal interview. Survey uses the same instrument bench as the Walk, but it records readings systematically and may coordinate combinations such as:

- lightweight belief-stress rigs;
- exploratory or hidden-question 2×2s;
- blind structural reconnaissance;
- framing-genealogy scans;
- misfit/residue collection;
- targeted factual research;
- control runs and framing-sensitivity checks.

Survey stops when one framing becomes usable, a real-world experiment is available, or the remaining contradiction clearly warrants Expedition.

### Expedition — current full dialectic

Expedition begins when a high-stakes, costly, poorly understood, or stubborn contradiction warrants the full procedural guarantees. It promotes the Survey log into the existing control log rather than starting over.

The current seven phases remain the Expedition apparatus:

1. elenctic interview and research, using the prior Walk and Survey as substrate;
2. Monk prompt construction;
3. committed belief essays;
4. determinate negation, lateral intervention, and decomposition;
5. candidate palette;
6. validation and hostile audit;
7. recursive exploration.

Its completion gates remain strict **inside the apparatus**. Expedition is not weakened; it is reached progressively and inherits the inquiry's full lineage.

### Direct instrument access

The user may request an instrument at any point: “run a term scan,” “stress these positions,” “check for a ground condition,” or “apply the frontier rheometer.” If the instrument lacks required input, the orchestrator asks only for the missing substrate or recommends the smallest preparatory probe.

A request for a dialectic, strongest opposing cases, hostile thesis testing, determinate negation, or validation requires independently held positions at minimum. Short blind Monks may run as a Walk instrument; the full Expedition remains a separate promotion. The orchestrator must not produce Expedition-shaped opposition from one correlated context because the user omitted the word “full.”

## Router

The router is an orchestration rule, not a ceremony shown after every turn. It keeps four exits available after each answer or readout:

| Exit                 | Meaning                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Stop / act**       | The specimen is legible enough; answer, decide, discuss, or run a small real-world experiment     |
| **Probe**            | One bounded uncertainty maps to a named instrument                                                |
| **Promote**          | The next useful move needs Survey persistence or the full Expedition apparatus                    |
| **Reframe specimen** | The inquiry has revealed a different problem; update the specimen with the user before continuing |

For a non-obvious next step, the recommendation reports the new signal, unresolved residue, candidate instrument, likely cost, and artifact risk. Lightweight probes may run inline when they are the natural response, but they name themselves in the readout. Promotion to durable artifacts, research, multiple agents, or Expedition is explicit; it never happens silently.

### Escalation heuristics

| Signal                                                  | Candidate next instrument                        |
| ------------------------------------------------------- | ------------------------------------------------ |
| Feelings, priorities, or constraints remain implicit    | Stake map                                        |
| A repeated word appears to carry the dispute            | Term scan / undecidable detector                 |
| Two positions cannot be inhabited together              | Belief-stress rig                                |
| The binary may omit an independent constituency or axis | Third-pole probe / 2×2                           |
| The frame itself appears inherited or interested        | Framing-genealogy scan                           |
| A concrete fact may make the debate moot                | Ground-condition probe                           |
| Claims depend on facts not yet known                    | Targeted research                                |
| Home vocabulary is exhausted                            | Donor perturbation rig                           |
| An elegant synthesis may have smoothed the specimen     | Residue collector / loss audit                   |
| A reaching inquiry landed on an expected answer         | Frontier rheometer / framing-sensitivity control |
| Several structurally valid landings remain              | Candidate spectrograph (S/J/G/F/U palette)       |
| A high-stakes candidate will guide action               | Validation and hostile assay                     |

### Stop heuristics

Recommend stopping or acting when:

- the user can state the tension and each person's stakes without caricature;
- the remaining question is empirical and a cheap observation can answer it;
- a reversible real-world experiment will teach more than another conceptual pass;
- the inquiry is repeating the same readout with no new facts, axes, cross-edges, or residue;
- the user has enough clarity for the actual deliverable, even if the larger contradiction remains open.

## Existing Instruments: First Registry

The current workflow already contains most of the first bench:

| Existing operation                  | Instrument identity           | Characteristic artifact                                             |
| ----------------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| Elenctic interview                  | Stake and assumption mapper   | Interview frame follows the orchestrator's questions                |
| Third-pole probe                    | Missing-perspective detector  | Confabulated “third way” with no constituency                       |
| 2×2 diagrams                        | Frame projector               | False orthogonality and tidy quadrants                              |
| Blind structural reconnaissance     | Home-frame leak detector      | Abstraction strips the epistemological register                     |
| Electric Monks                      | Belief-stress rig             | Forced polarization creates a contradiction                         |
| Determinate negation                | Fracture scanner              | Every failure is read as self-sublating                             |
| Compressed conflicts and metaphors  | Defamiliarization probes      | Resonance mistaken for structure                                    |
| Donor recruitment                   | Cross-domain perturbation rig | Elegant false isomorphism                                           |
| Boydian decomposition               | Structural recombinator       | Analyst invents “atomic” parts or imports a hidden taxonomy         |
| Misfit register                     | Residue collector             | Orchestrator decides what counts as residue                         |
| Loss audit                          | Hidden-signal recovery assay  | “Interesting” substitutes for useful and supported                  |
| Cross-society sayability comparison | Taboo parallax                | Countries become stereotypes and taboo becomes a truth signal       |
| Blind possibility-space cartography | Model-expectation atlas       | Reconstructibility mistaken for probability, prevalence, or novelty |
| Frontier overlay                    | Semantic rheometer            | Divergence mistaken for novelty or value                            |
| S/J/G/F/U palette                   | Candidate spectrograph        | Preset bands bound the visible spectrum                             |
| Monk validation                     | Position-preservation assay   | A Monk protects its original rhetoric rather than its insight       |
| Hostile auditor                     | Failure-stress assay          | Criticism is generated without consequence or empirical contact     |
| Wiki, log, and queue                | Atlas and field notebook      | Recorded categories harden into assumed ontology                    |

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

**Possible instruments pulled during the Walk:**

1. Substrate map: who notices, initiates, performs, and declares the kitchen done; when; under what energy and schedule constraints.
2. Stake map: cleanliness, rest, fairness, hospitality, care, control, cognitive load, and the feeling of being left with unfinished work.
3. Term scan: “clean,” “done,” “help,” “fair,” and “later.”
4. Tension statement: name the one or two conflicts that best explain the friction without resolving them.
5. Small experiment: change one ownership rule, definition of done, or timing convention for one week; specify what both people will observe.

**Stop:** Do not recruit donors, run Boydian decomposition, create a five-candidate palette, or recurse unless the Walk—or repeated small experiments—shows a deeper contradiction that the local instruments cannot make legible.

## State and Persistence

Artifacts are **lazy materializations** of the session, created when their memory or coordination value exceeds their overhead. They are not proof that an inquiry is serious.

| Inquiry state           | Durable artifact                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Canned answer           | Session record only                                                                           |
| Walk with any field kit | Raw instrument readings remain in the session; no additional organized workspace              |
| Survey promotion        | Survey log curates the session-so-far into a durable working collection                       |
| Research during Survey  | Source/staging files; wiki only when reuse, cross-links, or context risk justify it           |
| Expedition promotion    | Survey log promoted into the full control log, round files, wiki, queue, and validation trace |

### Survey log

The first durable working artifact records:

```yaml
original-question: <the question as it entered the session>
goal: <what the user is trying to understand, decide, or produce>
promotion-trigger: <why chat history is no longer enough>
instruments-already-used: <instrument IDs + pointers to inline readouts>
key-observations: <typed by provenance>
loaded-terms: <if any>
current-tensions: <if any>
open-gaps: <facts, perspectives, or tests still missing>
current-working-question: <where the walk has arrived>
session-provenance: <thread/task pointer and relevant turn span>
```

**No retrospective fiction.** The log distinguishes ordinary session-derived observations from formal instrument readouts. It does not rewrite the Walk as though the user completed a scripted interview.

**No repeated interview.** The Survey log is the substrate for later work. On promotion, Expedition adopts it as the beginning of Phase 1 rather than asking the user to restate the inquiry.

### Wiki threshold

A Survey log does not automatically create a wiki. Start the wiki when research, reusable cross-links, recursion, multiple agents, or context-compaction risk make a durable knowledge graph useful.

### Expedition

Promote the Survey log into the existing round files, wiki, staging directory, control log, tension pages, and dialectic queue. Preserve the session and Survey lineage. Add instrument IDs and observation kinds gradually so the full trace can be read as a sequence of calibrated readouts.

### Cross-run calibration

Deferred until several instrument cards have been used in practice. The eventual calibration atlas should track which findings survive reframing, which instruments generate recurring artifacts, and which donor classes produce weak transfers. Do not create a scoring system before enough runs exist to ground it.

## Proposed File Footprint

```text
reference/
├── camera-loop.md                # feedback tempo, focus interview, engine-mode failure signs
├── field-lab.md                  # lab vocabulary, principles, router, scale selection
├── instrument-contract.md        # card + common readout contracts
├── instruments/
│   ├── index.md                  # registry: phenomenon → instrument → source procedure
│   └── <instrument-id>.md        # one card per extracted or new instrument
├── survey-log-template.md         # lazy materialization contract at Survey promotion
├── apparatus-survey.md            # selective-probe defaults and promotion rules
└── apparatus-expedition.md       # entry/map only; points to existing phase docs
```

The cards do not duplicate long procedures already defined in phase docs. They name the instrument contract and point to the existing source procedure. A procedure is extracted only when it must run independently during a Walk or Survey.

## Migration Strategy

### Stage 1 — Make the field lab the default shell

- Create `reference/field-lab.md`: vocabulary, principles, field-work states, and the quiet router.
- Create `reference/instrument-contract.md`: the card and readout schemas.
- Create `reference/instruments/index.md`: the first registry, linking existing operations to their current source procedures.
- Update the skill description and top-level instructions so any question may enter the field lab, a canned answer remains cheap, and Expedition is one apparatus.
- Keep every existing phase instruction intact.

### Stage 2 — Equip the Walk with a field kit

- Specify the focus-interview card and camera-loop cadence before other Walk instruments.
- Specify standalone cards for the substrate map, stake map, term scan, tension statement, third-pole/ground-condition probes, and small-experiment designer.
- Make all existing instruments eligible for Walk use when their input requirements can be satisfied inside the session; instrument cards, not state names, define operating limits.
- Test it on domestic coordination, small team friction, and reversible decisions.
- The main test: is the skill no more cumbersome than ordinary chat when no instrument is needed, and can several instruments enter without starting a workflow or artifact tree?

### Stage 3 — Materialize Survey from existing instruments

- Create `reference/survey-log-template.md` with the lineage and provenance rules.
- Create `reference/apparatus-survey.md`.
- Extract lightweight contracts for the third-pole probe, 2×2, blind reconnaissance, short Monks, ground condition, genealogy, and residue scan.
- Add the control run and framing-sensitivity scanner.
- Test that promotion snapshots the Walk without a repeated interview or retrospective formalization.

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

1. The user treats the field-lab skill as a normal surface for off-the-cuff questions because a zero-instrument answer is no more costly than ordinary chat.
2. The user brings substantially more spontaneous questions to the skill while retaining regular Expedition use for deep contradictions.
3. A Walk can pull whatever instruments fit the phenomena without becoming a Survey merely because the bench is in use.
4. A nontrivial Walk focuses with the user before substantive analysis and returns intermediate readings for correction; a long brief does not license a one-shot instrument cascade. When a focus answer could change the recommendation, the agent asks and stops rather than attaching a provisional solution.
5. A promising Walk can become a Survey without restarting, rebriefing, or losing its conversational history.
6. No organized workspace is required before Survey; raw readings remain in the session, and Survey promotion creates the first curated log by distilling the session-so-far.
7. Every instrument names its phenomenon, perturbation, readout, control, characteristic artifact, execution seat, context boundary, placement rationale, fallback, and return path.
8. Every instrument is announced before use with its name, a brief parenthetical explanation, calling signal, and access target; every readout ends with the caddy gate, which offers at most two live next instruments or says that stopping or acting is the best next move.
9. Every readout can legitimately end with `stop`.
10. The user sees the cost and reason before promotion to systematic Survey work or Expedition.
11. A request for dialectical opposition uses independently held positions even when it remains a Walk.
12. A fact-shaped practical question asks quick clarifying questions before research when its answer varies by aim, method, specimen, or constraints; contrary specimen evidence is reflected rather than normalized away.
13. A low-probability exception appears only with a specimen signal, a material base-rate reason, or a high cost of omission; its condition and evidence status are explicit.
14. The full current dialectic remains available and no less rigorous.
15. Later outputs preserve the distinction among fact, testimony, elicited response, analogy, judgment, and hypothesis.
16. Findings that appear only under a strong instrument are marked as possibly induced.
17. A practical inquiry can choose a reversible experiment instead of more analysis.
18. New instruments are added because they reveal a missing phenomenon, not because they fit the laboratory metaphor.
19. The Expedition itself coordinates named instruments: every phase gate cites their actual execution traces, controls, access deltas, artifacts, and readouts rather than treating phase prose as proof that the instruments ran.

## Resolved architecture decisions

- Keep the existing completion gates as strict Expedition apparatus safeguards. Instrument extraction makes phase operations reusable outside the Expedition; it does not remove, replace, or weaken the gates inside it.

## Open Questions

1. Should `dialectic` remain the skill name while the field lab is its architecture, or should a future top-level `field-lab` skill call the dialectic apparatus? Default for the first implementation: keep the current skill name and avoid a packaging migration.
2. How should the skill description remain broad enough to be the user's normal question surface without triggering on conversations where its instrument awareness adds no value?
3. How short can lightweight Monks be while still functioning as belief stress rather than ordinary pro/con generation? This needs empirical testing.

## Model Update

- **Before:** The project is an artificial belief system implemented as a rigorous seven-phase dialectical workflow.
- **After:** The project is an always-available, camera-mode field lab for conceptual discovery. Ordinary conversation is a feedback-rich instrumented Walk; Survey begins when observation becomes systematic and is the first curated working state; artificial belief is one instrument; and the seven-phase dialectic is its Expedition apparatus.
- **Because:** Real use shows that the value lies in carrying a field kit from the first casual question while deferring artifact bureaucracy until systematic collection is useful. But light apparatus must not mean weak sensing: on open questions, a focus interview and intermediate user corrections keep context growing ahead of conclusions.
