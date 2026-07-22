# The Refinement Loop (the 4.9 router)

**⛔ Re-entry check:** Did you just run the completion gate for the phase/stage you came from — enumerate its deliverables and attest each ✅/❌? If not, **stop immediately and do that before continuing** (see SKILL.md → The Completion Gate).

Phase 4 ends at the 4.9 HARD STOP. Historically that checkpoint had two exits — proceed to Phase 5, or take the user's corrections and fold them in. It is now a **four-exit router**. Its job is to answer one question: **has this contradiction matured enough to synthesize, or does it need another pass first?** Synthesizing an immature tension is the failure this loop exists to prevent — it is why the first monk run so often feels like a straw-man, and why the waterfall reaches Phase 5 before the space is actually explored.

**You diagnose and recommend; the user decides.** You compute the signals, name the gap you're seeing, and recommend an exit with your reasoning. Nothing loops and nothing proceeds silently — the router is a presented checkpoint like every other user gate in the skill, and the user is the loop's only stopping authority. There is no hard iteration cap; instead, surface a diminishing-returns read ("this is iteration 3; the last pass added only X") as part of your recommendation, and let the user call it.

## The four exits

| Exit         | When                                                                             | What it does                                                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proceed**  | Hidden question settled + signals quiet                                          | Continue to Phase 5 (synthesis).                                                                                                                                                                                                                                  |
| **Research** | The negation kept hitting "we don't actually know X"                             | Spawn targeted research subagents (`reference/research-subagent-prompt.md`); read their drafts and re-run the negation while the gardener ingests the same paths in the background. Synchronize only at a gardener-dependent view or the completion gate. **First-class, not a fallback** — this is the most common loop-back when the user is reading the negation and realizes a gap. |
| **Refine**   | Right axis, but the monks were briefed poorly / fixated on trivia                | Re-run the _same_ monks with a per-pole sharper brief (below).                                                                                                                                                                                                    |
| **Re-split** | The working question has become a _better contradiction_ than the original split | Re-pole the monks on the new working question — **only if it passes the closure test** (below).                                                                                                                                                                   |

**Your recommendation to the user must include:** the three signal readings, the gap you diagnosed, the recommended exit, and _how the next pass would be framed_.

Include the pass's **frontier reading** (`reference/frontier-overlay.md`) as diagnostic evidence — especially a **collapse** (the monks reached but the negation drained to a groove), which is a strong signal that the tension is _not_ ready to synthesize even if the other signals are quiet. This informs your recommendation only; it never decides the exit — the user does. (A frontier reading of "groove" is not by itself a reason to keep looping: the user may want the standard answer.)

## The maturity gate (three signals)

The **hidden-question settledness check is the primary fork.** Read the hidden question from 4.4 (the conditional hidden-question 2×2, or its one-dimensional contraindication record) and compare it against the previous pass, tracked in the control log's **hidden-question ledger** (`reference/dialectic-wiki.md` → control log).

1. **Hidden question** — did it move this pass, and on what axis?
   - _Settled_ (no move, or only cosmetic) → toward **Proceed**.
   - _Moved to a different axis_ (different poles) → **Re-split**.
   - _Same axis, positions immature_ → **Refine**.
2. **New cross-edges** — did this pass produce new `[fit:]`-tagged recombinations in the 4.6 Boydian decomposition (the semi-lattice edges)? _Still appearing_ → structure still forming, keep working. _None new_ → structure saturating.
3. **New facts** — did this pass surface unknowns / gaps (the gardener's coverage state)? _Yes_ → coverage gap → **Research**. _No_ → coverage saturating.

**Proceed is recommended only when all three are quiet:** hidden question stable, no new cross-edges, no new facts. Then the user judges the stabilized hidden question against the round's **frozen anchor** — _"is this the tension I actually walked in feeling, or a deeper thing I now recognize as what I meant?"_ That recognition is the go signal for Phase 5. The user also weighs it against the **Goals & context** in the control log — a synthesis that's structurally sound but won't serve the actual deliverable/audience isn't "positioned" yet. Only the user can make that call; the signals quieting is necessary, not sufficient.

**Read the gate as _exploration exhausted_, not _tension resolved_ (anti-convergence).** The three signals mean you have stopped _learning_ about this tension — not that it has settled into a comfortable answer. Guard against the convergence trap the open-endedness literature warns of (Lehman & Stanley, _Why Greatness Cannot Be Planned_): a gate that rewards "settled" quietly selects for _resolvable, prior-confirming_ tensions and discards the strange, unsettled, high-novelty ones that are the productive stepping stones — the most likely mechanical cause of a dialectic drifting back to the user's prior. A stable hidden question means you have _located the real axis_, which is as true of an irreducible aporia as of a tidy resolution — synthesizing from an unsettling axis is valid and often higher-value. So the readiness question is not "has it settled?" but **"have I explored this enough that synthesizing it will open something genuinely new?"** If the candidate synthesis merely restates the tension or lands back on the prior, the tension is _not_ ready no matter how quiet the signals.

**Anti-over-iteration bias:** default to **Refine** (mature the current framing) over **Re-split** (re-cut). Re-cutting every pass means no framing ever matures enough to synthesize. Re-split only when the hidden question genuinely needs _different belief burdens_ — same poles at a deeper phrasing means you're converging, so keep going; different poles means a real axis-shift worth the re-cut.

## Operators + the firewall

Re-running monks is where the skill's decorrelation apparatus (blind parallel spawn, separate sessions, bias-variance-diversity) is most at risk. The two operators get different treatment.

The loop does not bypass instrument contracts:

- **Research** is a tool operation. Type its findings in the observation ledger, update the `atlas`, and rerun only the instruments whose inputs changed.
- **Refine** prepares and reruns `belief-stress` through Phases 2–3 with per-pole isolated briefs, then repeats the Phase 4 instrument sequence. Refresh `neutral-control` when the specimen or framing changed materially.
- **Re-split** first runs `tension-statement` on the proposed working question, then prepares and reruns `belief-stress` through Phases 2–3 with new poles, followed by the Phase 4 instrument sequence. Refresh `neutral-control` before the new Monks run.
- **Proceed** carries the completed Phase 4 instrument ledger into `candidate-spectrograph`; it does not invent a new reading.

Append new lifecycle entries rather than overwriting the prior pass. This preserves whether a later result came from new evidence, new belief burdens, or repeated exposure.

**Re-split (low risk).** Essentially a fresh Phase 2–3 with re-derived divergent belief burdens (possibly new monks). The monks _do_ get re-poled on the new working question — **but only if it passes the closure test.** Blind spawn as usual.

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

**Completion gate — enumerate & attest before taking a router exit (see SKILL.md → The Completion Gate).** Mark each ✅/❌ with evidence; any ❌ stops you unless the user explicitly waives it:

- [ ] The three signals computed and **shown to the user** (hidden-question movement, new cross-edges, new facts)
- [ ] The gap diagnosed and an exit recommended, including how the next pass would be framed
- [ ] The **user chose the exit** — not the orchestrator (this user-decision item is not self-waivable)
- [ ] Control log updated this pass: hidden-question ledger line + frontier-ledger line + loop-ledger line + open gaps (drift protocol run: delta written, then whole log re-read)
- [ ] On a Refine/Re-split exit: the monk brief was assembled by the gardener (firewall-clean; per-pole ignored-evidence for Refine); on Re-split, the working question passed the closure test
- [ ] Instrument ledger updated for the chosen exit: Research names affected reruns; Refine/Re-split records fresh `neutral-control` when needed plus prepared/completed `belief-stress` and repeated Phase 4 readings; Proceed points to the completed Phase 4 entries
