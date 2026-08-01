# Dialectic Workflow Instrument Map

## Contents

- [Authority and precedence](#authority-and-precedence)
- [Instrument lifecycle](#instrument-lifecycle)
- [Phase map](#phase-map)
- [Controls](#controls)
- [Instrument attestation](#instrument-attestation)

The Electric Monk dialectic is a fixed workflow that coordinates instruments. Requesting the full workflow selects the scheduled map below, but it does not start a phase or an instrument run and does not select extra ad hoc instruments. Creating a Field Trip or Expedition does not select this map. The seven phase files remain the detailed procedures; the instrument cards make their access claims, execution seats, controls, artifacts, and bounded readouts explicit.

## Authority and precedence

For every dialectic-workflow operation:

1. The **dialectic workflow** defines phase-opening and completion gates.
2. The **phase or stage file** defines its local procedure, required artifacts, order, and checklist.
3. The **instrument card** defines the phenomenon sought, why the operation helps, complete standalone procedure, execution seat, context boundary, fallback, control, likely distortions, and return path.
4. **`SKILL.md`** defines instrument selection, how to explain a chosen instrument, the bounded-result boundary, follow-up offers, and requested-task authority.

Read the workflow, current phase procedure, and named card before running a scheduled instrument. If their requirements differ, satisfy the stricter requirement. A user waiver may release a named phase deliverable, but it cannot upgrade a downgraded instrument reading or manufacture blindness, independence, support, or confidence.

## Instrument lifecycle

Track every scheduled instrument in the round control log:

1. **Schedule:** cite the user's full-dialectic request or later choice for an optional instrument. This reserves the operation but does not start it.
2. **Start phase:** cite the phase-opening card and the user's later phase-start go-ahead.
3. **Call:** apply the handshake in `SKILL.md`.
4. **Prepare:** freeze inputs, baseline, prompts, context boundaries, and execution seats before exposure.
5. **Run:** follow the phase procedure under the card's execution contract.
6. **Read:** append the durable result through the writer contract in
   [field-log-events.md](field-log-events.md), including any known
   `observedAt`, authorization, actual seat, contexts, fallback, access delta,
   typed readings, calibration, artifact risk, unmeasured remainder, and trace
   paths.
7. **Return:** show the bounded reading to the user at the phase's next checkpoint and record their correction. Do not mix it with the phase's later analysis.
8. **Caddy:** apply the caddy gate in `SKILL.md` at the promised checkpoint. Do not use it to skip the remaining phase gate.
9. **Gate:** attest the instrument's required lifecycle state and concrete trace before advancing.

Some instruments span phases. `belief-stress` is prepared in Phase 2 and read in Phase 3. `neutral-control` is frozen before belief stress and compared after it. Do not claim completion at preparation time.

## Phase map

| Apparatus point      | Required instruments                                                                                                                                          | What the gate must prove                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entry and throughout | `atlas`                                                                                                                                                       | Gardener or orchestrator keeper assigned; field lineage, instrument ledger, typed observation ledger, paths, and gaps remain current.                                                                                                                                                                                                               |
| Phase 1              | `focus-interview` when no confirmed focus is inherited; `elenchus`; initial and post-grounding `tension-statement`; `third-pole`; conditional `frame-projector`; `home-frame-leak`; prepare `neutral-control` | Focus and deeper stakes confirmed; either a supported no-tension result stops the workflow, or the full tension burst, provenance traces, unranked menu, and provisional user selection are recorded; the post-grounding recheck uses the whole inquiry and leaves a `live` or `sharpened` current direction before the Monk snapshot; third-pole result recorded even when none is found; frame-projector shows its complete trace or specific contraindication; blind reconnaissance passed its leak check or carries its named downgrade; neutral pre-belief baseline frozen. |
| Phase 2              | prepare `belief-stress`                                                                                                                                       | One grounded, full-conviction prompt per pole; each prompt and context boundary recorded; no Monk sees sibling positions or analytical material.                                                                                                                                                                                                    |
| Phase 3              | complete `belief-stress`; compare `neutral-control`; recheck `tension-statement`                                                                               | Context-isolated committed positions returned; hedging, structural decorrelation, and remaining same-model correlation checked; probe-induced additions separated from the neutral baseline; essays and readout traces persisted; after user correction and any selected claim check, the whole-inquiry tension status and user direction are recorded before Phase 4.                                                                                                                   |
| Phase 4A             | `fracture-scan`; `residue-collect`; conditional `frame-projector`                                                                                             | One immanent fracture per position; shared assumptions and protected interests preserved as residue; hidden-question projection preserves its typed phenomenology, candidate clusters, tested separators, label workshop, and complete ASCII/box-drawing diagram with relevant examples, or records the specific contraindication.                                                                                                        |
| Phase 4B             | `defamiliarize`; `donor-perturb`                                                                                                                              | Compressed conflicts and metaphors produced distinct structure; blind recruiter and donor researchers obeyed their context boundaries; donor manifest, research, and downgrades recorded.                                                                                                                                                           |
| Phase 4C             | `structural-recombine`; `residue-collect`; `loss-audit`; `negative-transfer` for every donor mapping proposed as load-bearing                                 | Parts and operations recombined with traceable fit; residue remains unabsorbed; single-source signal received a disposition; load-bearing transfers discriminate against a nearby failure case.                                                                                                                                                     |
| Phase 4D             | `frontier-rheometer`; recheck `tension-statement` at the router                                                                                                | Blind expectation remained blind; expected and actual landings compared without turning difference into merit; collapse and fallback recorded; current tension status checked against the whole inquiry before Proceed, Research, Refine, Re-split, or Redirect.                                                                                                                                                                                                      |
| Phase 5              | `candidate-spectrograph`                                                                                                                                      | Candidate bands were earned by prior readings; S retained orchestrator continuity; other bands used isolated writers; sibling drafts stayed hidden; no ranking entered the readout.                                                                                                                                                                 |
| Phase 6A             | `position-preservation`                                                                                                                                       | Each selected candidate was judged separately by every committed position; actual sessions, candidate isolation, preservation, defeat, and repair requests recorded.                                                                                                                                                                                |
| Phase 6B             | `hostile-assay`                                                                                                                                               | One fresh auditor per selected candidate saw only allowed material; candidate-specific failure claims and dispositions recorded.                                                                                                                                                                                                                    |
| Phase 6C             | `framing-sensitivity` when a decision-relevant result may depend on wording, pole order, or model                                                             | Controlled variants changed one framing variable; stable and sensitive findings separated. When not called, record why no decision-relevant framing dependency remains.                                                                                                                                                                             |
| Phase 7              | `tension-statement`; `third-pole`                                                                                                                             | Each proposed direction is a concrete two-sided contradiction; the burst was checked for an orthogonal direction or a recorded “none found”; user choice and queue lineage recorded.                                                                                                                                                                |

Unscheduled instruments remain available at every workflow point. Offer `term-scan`, `stake-map`, `substrate-map`, `ground-condition`, or `real-world-check` whenever its calling signal appears, but run it only after user selection. Their use does not alter the phase number; their raw results enter the same instrument ledger and completion gate. A prepared or running check is not a completed result; advance only on the observation state the phase actually requires.

The scheduled `tension-statement` rechecks are checkpoint operations, not reactions to every new item. A user statement that the tension moved or a decisive defeater may trigger an earlier recheck. An article, analogy, or fresh thought by itself enters the tension trail as a side trail until the whole-inquiry movement threshold is met.

## Controls

- Freeze `neutral-control` before the first Monk output is read. If this is missed, use a fresh baseline agent that sees only the original specimen or state that attribution is unavailable.
- Run `negative-transfer` on each donor mapping that will carry a candidate's spine. A `[fit: reach]` tag does not replace a negative case.
- Run `framing-sensitivity` before accepting a decision-relevant result whose validity may turn on a loaded term, pole order, prompt form, or model family.
- Cap `home-frame-leak` at one re-strip and retry. If both blind analysts identify the home field, record that the specimen is not blindable, discard their structural readings, and use the named downgrade or carry the gap.
- Keep claim kinds unchanged through every instrument and phase. Monk testimony does not become evidence; an analogy does not become a fact; user correction does not rewrite the frozen trace.

## Instrument attestation

Every phase or stage completion gate must include an **instrument attestation** with:

- the phase-opening card, promised checkpoint, and user phase-start pointer;
- each scheduled instrument and lifecycle state;
- `recorded-at` and any known `observed-at`;
- actual execution seat and context boundary;
- fallback or downgrade, including `none`;
- authorization, access delta, and typed readings;
- control result;
- artifact risk and unmeasured remainder;
- trace paths and user-feedback state.

An instrument is not complete merely because the phase produced prose resembling its readout. Missing handshakes, context separation, controls, or traces remain missing gate items. Only the user may waive a named deliverable. A waiver never changes the epistemic label of the resulting reading. Apply the phase-opening, checkpoint, and completion cadence from [dialectic-workflow.md](dialectic-workflow.md).
