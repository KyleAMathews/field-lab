# The Refinement Loop (the 4.9 router)

**Before starting:** Confirm that the prior phase or stage passed the [workflow completion gate](dialectic-workflow.md#completion-gate). If not, stop and run it.

Phase 4 ends at the 4.9 HARD STOP. Historically that checkpoint had two exits — proceed to Phase 5, or take the user's corrections and fold them in. It is now a **five-exit router**. Its job is to ask both: **is this still the live contradiction, and has it matured enough to synthesize?** Synthesizing an immature tension and keeping a thin one alive because work has already been spent are the failures this loop exists to prevent.

**You diagnose and recommend; the user decides.** You compute the signals, name the gap you're seeing, and recommend an exit with your reasoning. Nothing loops and nothing proceeds silently — the router is a presented checkpoint like every other user gate in the skill, and the user is the loop's only stopping authority. There is no hard iteration cap; instead, surface a diminishing-returns read ("this is iteration 3; the last pass added only X") as part of your recommendation, and let the user call it.

## The five exits

| Exit         | When                                                                             | What it does                                                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proceed**  | Hidden question settled + signals quiet                                          | Continue to Phase 5 (synthesis).                                                                                                                                                                                                                                  |
| **Research** | The negation kept hitting "we don't actually know X"                             | Spawn targeted research subagents (`reference/research-subagent-prompt.md`); read their drafts and re-run the negation while the gardener ingests the same paths in the background. Synchronize only at a gardener-dependent view or the completion gate. **First-class, not a fallback** — this is the most common loop-back when the user is reading the negation and realizes a gap. |
| **Refine**   | Right axis, but the monks were briefed poorly / fixated on trivia                | Re-run the _same_ monks with a per-pole sharper brief (below).                                                                                                                                                                                                    |
| **Re-split** | The working question has become a _better contradiction_ than the original split | Re-pole the monks on the new working question — **only if it passes the closure test** (below).                                                                                                                                                                   |
| **Redirect** | The current tension is thin or dissolved, or a materially different live direction now serves the inquiry better | Preserve this round without forcing synthesis; let the user choose from the tension trail or a refreshed menu; open a new round and return to Phase 1. |

**Your recommendation to the user must include:** the whole-inquiry tension status, the three maturity signals, the gap you diagnosed, the recommended exit, and _how the next pass or redirect would be framed_.

Include the pass's **frontier reading** (`reference/instruments/frontier-rheometer.md`) as diagnostic evidence — especially a **collapse** (the monks reached but the negation drained to a groove), which is a strong signal that the tension is _not_ ready to synthesize even if the other signals are quiet. This informs your recommendation only; it never decides the exit — the user does. (A frontier reading of "groove" is not by itself a reason to keep looping: the user may want the standard answer.)

## The viability and maturity gate

First run `tension-statement` in recheck mode. Reread the original question, Goals & context, full interview, accumulated evidence, Monk specimen and outputs, current working question, and tension trail. A fresh donor, article, analogy, or striking Monk claim stays a side trail unless it clears the whole-inquiry movement threshold.

0. **Current tension** — is it still viable?
   - `live` or `sharpened` → continue to the maturity signals.
   - `moved` but still the same underlying contradiction with new belief burdens → candidate **Re-split**.
   - `moved` to a materially different direction, `thin`, or `dissolved` → candidate **Redirect** or stop.
1. **Hidden question** — did it move this pass, and on what axis?
   - _Settled_ (no move, or only cosmetic) → toward **Proceed**.
   - _Moved to a different axis_ (different poles) → **Re-split**.
   - _Same axis, positions immature_ → **Refine**.
2. **New cross-edges** — did this pass produce new `[fit:]`-tagged recombinations in the 4.6 Boydian decomposition (the semi-lattice edges)? _Still appearing_ → structure still forming, keep working. _None new_ → structure saturating.
3. **New facts** — did this pass surface unknowns / gaps (the gardener's coverage state)? _Yes_ → coverage gap → **Research**. _No_ → coverage saturating.

**Proceed is recommended only when the tension is `live` or `sharpened` and all three maturity signals are quiet:** hidden question stable, no new cross-edges, no new facts. Then the user judges the stabilized hidden question against the round's **frozen anchor** and Goals & context. The Anchor helps name movement; it does not oblige the user to stay. Only the user can make the call.

**Read the gate as _exploration exhausted_, not _tension resolved_ (anti-convergence).** The three signals mean you have stopped _learning_ about this tension — not that it has settled into a comfortable answer. Guard against the convergence trap the open-endedness literature warns of (Lehman & Stanley, _Why Greatness Cannot Be Planned_): a gate that rewards "settled" quietly selects for _resolvable, prior-confirming_ tensions and discards the strange, unsettled, high-novelty ones that are the productive stepping stones — the most likely mechanical cause of a dialectic drifting back to the user's prior. A stable hidden question means you have _located the real axis_, which is as true of an irreducible aporia as of a tidy resolution — synthesizing from an unsettling axis is valid and often higher-value. So the readiness question is not "has it settled?" but **"have I explored this enough that synthesizing it will open something genuinely new?"** If the candidate synthesis merely restates the tension or lands back on the prior, the tension is _not_ ready no matter how quiet the signals.

**Anti-over-iteration bias:** default to **Refine** over **Re-split** when the current tension remains viable; re-cutting on every fresh idea prevents any framing from maturing. This bias never keeps a `thin` or `dissolved` tension alive. Use **Redirect** when the whole inquiry, not one vivid item, supports a different contradiction.

## Operators + the firewall

Re-running monks is where the skill's decorrelation apparatus (blind parallel spawn, separate sessions, bias-variance-diversity) is most at risk. The two operators get different treatment.

The loop does not bypass instrument contracts:

- **Research** is a tool operation. Type its findings in the observation ledger, update the `atlas`, and rerun only the instruments whose inputs changed.
- **Refine** prepares and reruns `belief-stress` through Phases 2–3 with per-pole isolated briefs, then repeats the Phase 4 instrument sequence. Refresh `neutral-control` when the specimen or framing changed materially.
- **Re-split** first runs `tension-statement` on the proposed working question. Rerun only after the user selects or rewrites a live split. A supported none-found result or rejection of the whole menu returns to the router without new Monks. Otherwise prepare and rerun `belief-stress` through Phases 2–3 with the selected poles, followed by the Phase 4 instrument sequence. Refresh `neutral-control` before the new Monks run.
- **Redirect** records the current tension as `thin`, `dissolved`, or `redirected`, preserves its artifacts and side trails, and presents still-supported parked options plus any movement-threshold-clearing new direction. After the user chooses, open a new round control log with a lineage pointer and return to Phase 1. Reuse valid readings; do not jump straight to Monk preparation.
- **Proceed** carries the completed Phase 4 instrument ledger into `candidate-spectrograph`; it does not invent a new reading.

Append new lifecycle entries rather than overwriting the prior pass. This preserves whether a later result came from new evidence, new belief burdens, or repeated exposure.

**Re-split (low risk).** Essentially a fresh Phase 2–3 with re-derived divergent belief burdens (possibly new monks). The monks _do_ get re-poled on the new working question — **but only if it passes the closure test.** Blind spawn as usual.

**Redirect (course change, not synthesis).** Use this when the current contradiction no longer earns more work or the user selects a different live direction. It ends the current round without declaring it resolved. The new round starts at Phase 1 because its grounding, third-pole check, briefing, and Monk specimen may differ. Keep the same Field Trip and wiki so prior research and the abandoned trail remain available.

**Refine (high risk — this is where decorrelation dies).** Do **not** hand both monks the same synthesis-enriched briefing; that correlates them and the determinate negation goes mushy. Refine is **per-pole and asymmetric**:

- Each monk gets only _its own_ sharpened brief — new facts relevant to its pole, **plus the evidence it personally walked past last round**. (Ask the gardener to assemble it: "give me pole A's monk-safe brief plus the evidence A ignored." This per-pole ignored-evidence surfacing is aimed straight at the confirm-the-prior tendency.)
- Monks stay blind to each other and to all synthesis-leaning material.
- This _preserves_ (or increases) decorrelation rather than eroding it.

**The firewall (a spawn-time rule).** The **gardener assembles every monk brief** — as wiki-owner it filters by the frontmatter `type` field (deterministically — this is a decorrelation boundary, so filter on the parsed field, not on scanning prose), so enforcement lives in one place. A monk brief pulls **only the factual substrate** and **never** positions or the analytical layer:

- **Allowed:** the round anchor, a closure-passing framing of the contradiction, and `concept` / `source` pages.
- **Never:** `position` pages (a monk must not see another monk's stance — that collapses decorrelation; monks argue fresh from the factual substrate, not from prior essays), `donor` pages (cross-domain material introduced after the monks — feeding it to them homogenizes the monks; the only monk-facing donor channel is the controlled Phase 1e.1 enrichment), the determinate negation, the hidden-question ledger/analysis, `tension` pages, and any `synthesis` candidates or synthesis-leaning corrections.

**The closure test** governs whether the evolved working question may re-pole a monk: _can a monk still argue one side of it at full conviction?_ A working question that sharpened into a better fight **passes** — safe to re-pole. A working question that has drifted toward where the synthesis is heading **fails** — it is "a synthesis wearing a question mark" — and stays orchestrator-only. The determinate negation and the syntheses always fail this test.

## Drift protocol (the scent fix)

At the top of **each** loop pass:

1. Read the control log + the last pass's negation + the user's corrections, and write the **delta** (what changed: working question, hidden-question ledger line, frontier-ledger line, loop-ledger line, open gaps).
2. **Re-read the whole control log fresh** as grounding before continuing.

The second read is the actual scent-fix — re-injection at loop-top counteracts the context-window pressure that causes drift. Writing the log without re-reading it builds the anchor and then never looks at it.

---

**Completion gate — enumerate and attest before taking a router exit.** Apply the [workflow completion gate](dialectic-workflow.md#completion-gate), mark each item ✅ or ❌ with evidence, and stop on any ❌ unless the user explicitly waives it:

- [ ] Whole-inquiry `tension-statement` recheck completed and shown: current status, new-item dispositions, movement-threshold result, and user correction
- [ ] The three maturity signals computed and **shown to the user** (hidden-question movement, new cross-edges, new facts)
- [ ] The gap diagnosed and an exit recommended, including how the next pass would be framed
- [ ] The **user chose the exit** — not the orchestrator (this user-decision item is not self-waivable)
- [ ] Control log updated this pass: hidden-question ledger line + frontier-ledger line + loop-ledger line + open gaps (drift protocol run: delta written, then whole log re-read)
- [ ] On a Refine/Re-split exit: the monk brief was assembled by the gardener (firewall-clean; per-pole ignored-evidence for Refine); on Re-split, the working question passed the closure test
- [ ] On a Redirect exit: the old round status, new user choice, lineage, and Phase 1 return are recorded
- [ ] Instrument ledger updated for the chosen exit: Research names affected reruns; Refine/Re-split records fresh `neutral-control` when needed plus prepared/completed `belief-stress` and repeated Phase 4 readings; Redirect records the recheck and preserves prior traces; Proceed points to the completed Phase 4 entries
