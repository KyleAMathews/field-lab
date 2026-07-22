# Expedition Instrument Map

## Contents

- [Authority and precedence](#authority-and-precedence)
- [Instrument lifecycle](#instrument-lifecycle)
- [Phase map](#phase-map)
- [Controls](#controls)
- [Gate rule](#gate-rule)
- [User cadence](#user-cadence)

The Expedition is a fixed apparatus that coordinates instruments. Requesting it selects the scheduled map below, but not extra ad hoc instruments. The seven phase files remain the detailed procedures; the instrument cards make their access claims, execution seats, controls, artifacts, and bounded readouts explicit.

## Authority and precedence

For every Expedition operation:

1. The **phase or stage file** defines the full procedure, required artifacts, order, and completion gate.
2. The **instrument card** defines the phenomenon sought, access differential, execution seat, context boundary, fallback, control, artifact risk, and return path.
3. The **instrument contract** defines the handshake, typed readout, caddy gate, and evidence rules.

Read both the phase procedure and the named card before running an instrument. If their requirements differ, satisfy the stricter requirement. A user waiver may release a named phase deliverable, but it cannot upgrade a downgraded instrument reading or manufacture blindness, independence, support, or confidence.

## Instrument lifecycle

Track every scheduled instrument in the round control log:

1. **Call:** announce the name, brief parenthetical explanation, calling signal, access target, and material cost or artifact risk.
2. **Select:** cite the user's Expedition request or later choice for an optional instrument.
3. **Prepare:** freeze inputs, baseline, prompts, context boundaries, and execution seats before exposure.
4. **Run:** follow the phase procedure under the card's execution contract.
5. **Read:** append the common raw-readout fields from `instrument-contract.md`, including authorization, actual seat, contexts, fallback, access delta, typed readings, calibration, artifact risk, unmeasured remainder, and trace paths.
6. **Return:** show the bounded reading to the user at the phase's next checkpoint and record their correction. Do not mix it with the phase's later analysis.
7. **Caddy:** offer three optional instruments when they could measure something outside the scheduled map. Do not run one until the user selects it, and do not use the caddy to skip the remaining phase gate.
8. **Gate:** attest the instrument's required lifecycle state and concrete trace before advancing.

Some instruments span phases. `belief-stress` is prepared in Phase 2 and read in Phase 3. `neutral-control` is frozen before belief stress and compared after it. Do not claim completion at preparation time.

## Phase map

| Apparatus point      | Required instruments                                                                                                                                          | What the gate must prove                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry and throughout | `atlas`                                                                                                                                                       | Gardener or orchestrator keeper assigned; field lineage, instrument ledger, typed observation ledger, paths, and gaps remain current.                                                                                                                                                                                                               |
| Phase 1              | `focus-interview` when no confirmed focus is inherited; `elenchus`; `third-pole`; conditional `frame-projector`; `home-frame-leak`; prepare `neutral-control` | Focus and deeper stakes confirmed; third-pole result recorded even when none is found; several honest frame projections compared, or the instrument is recorded as not called because a one-dimensional specimen contraindicated it; blind reconnaissance passed its leak check or carries its named downgrade; neutral pre-belief baseline frozen. |
| Phase 2              | prepare `belief-stress`                                                                                                                                       | One grounded, full-conviction prompt per pole; each prompt and context boundary recorded; no Monk sees sibling positions or analytical material.                                                                                                                                                                                                    |
| Phase 3              | complete `belief-stress`; compare `neutral-control`                                                                                                           | Context-isolated committed positions returned; hedging, structural decorrelation, and remaining same-model correlation checked; probe-induced additions separated from the neutral baseline; essays and readout traces persisted.                                                                                                                   |
| Phase 4A             | `fracture-scan`; `residue-collect`; conditional `frame-projector`                                                                                             | One immanent fracture per position; shared assumptions and protected interests preserved as residue; hidden-question projection is honest, or the projector is recorded as not called because a one-dimensional specimen contraindicated it.                                                                                                        |
| Phase 4B             | `defamiliarize`; `donor-perturb`                                                                                                                              | Compressed conflicts and metaphors produced distinct structure; blind recruiter and donor researchers obeyed their context boundaries; donor manifest, research, and downgrades recorded.                                                                                                                                                           |
| Phase 4C             | `structural-recombine`; `residue-collect`; `loss-audit`; `negative-transfer` for every donor mapping proposed as load-bearing                                 | Parts and operations recombined with traceable fit; residue remains unabsorbed; single-source signal received a disposition; load-bearing transfers discriminate against a nearby failure case.                                                                                                                                                     |
| Phase 4D             | `frontier-rheometer`                                                                                                                                          | Blind expectation remained blind; expected and actual landings compared without turning difference into merit; collapse and fallback recorded.                                                                                                                                                                                                      |
| Phase 5              | `candidate-spectrograph`                                                                                                                                      | Candidate bands were earned by prior readings; S retained orchestrator continuity; other bands used isolated writers; sibling drafts stayed hidden; no ranking entered the readout.                                                                                                                                                                 |
| Phase 6A             | `position-preservation`                                                                                                                                       | Each selected candidate was judged separately by every committed position; actual sessions, candidate isolation, preservation, defeat, and repair requests recorded.                                                                                                                                                                                |
| Phase 6B             | `hostile-assay`                                                                                                                                               | One fresh auditor per selected candidate saw only allowed material; candidate-specific failure claims and dispositions recorded.                                                                                                                                                                                                                    |
| Phase 6C             | `framing-sensitivity` when a decision-relevant result may depend on wording, pole order, or model                                                             | Controlled variants changed one framing variable; stable and sensitive findings separated. When not called, record why no decision-relevant framing dependency remains.                                                                                                                                                                             |
| Phase 7              | `tension-statement`; `third-pole`                                                                                                                             | Each proposed direction is a concrete two-sided contradiction; the burst was checked for an orthogonal direction or a recorded “none found”; user choice and queue lineage recorded.                                                                                                                                                                |

Walk instruments remain available at every apparatus point. Offer `term-scan`, `stake-map`, `substrate-map`, `ground-condition`, or `small-experiment` whenever its calling signal appears, but run it only after user selection. Their use does not alter the phase number; their raw readouts enter the same instrument ledger and completion gate. A prepared or running experiment is not a completed reading; advance only on the observation state the phase actually requires.

## Controls

- Freeze `neutral-control` before the first Monk output is read. If this is missed, use a fresh baseline agent that sees only the original specimen or state that attribution is unavailable.
- Run `negative-transfer` on each donor mapping that will carry a candidate's spine. A `[fit: reach]` tag does not replace a negative case.
- Run `framing-sensitivity` before accepting a decision-relevant result whose validity may turn on a loaded term, pole order, prompt form, or model family.
- Cap `home-frame-leak` at one re-strip and retry. If both blind analysts identify the home field, record that the specimen is not blindable, discard their structural readings, and use the named downgrade or carry the gap.
- Keep claim kinds unchanged through every instrument and phase. Monk testimony does not become evidence; an analogy does not become a fact; user correction does not rewrite the frozen trace.

## Gate rule

Every phase or stage completion gate must include an **instrument attestation** with:

- each scheduled instrument and lifecycle state;
- actual execution seat and context boundary;
- fallback or downgrade, including `none`;
- authorization, access delta, and typed readings;
- control result;
- artifact risk and unmeasured remainder;
- trace paths and user-feedback state.

An instrument is not complete merely because the phase produced prose resembling its readout. Missing handshakes, context separation, controls, or traces remain missing gate items. Only the user may waive a named deliverable. A waiver never changes the epistemic label of the resulting reading.

## User cadence

Do not announce the whole instrument map at Expedition entry. The user's Expedition request selects the scheduled map; still announce each instrument or tightly coupled cluster just before it runs with the stable **“I’m pulling in the [name] instrument…”** handshake. Return bounded readings at the existing checkpoints. Keep the phase's interpretation and synthesis visibly separate, and preserve full raw readouts in the control log rather than dumping apparatus telemetry into the conversation.
