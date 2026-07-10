# The Refinement Loop (the 4.9 router)

**⛔ Re-entry check:** Did you just run the completion gate for the phase/stage you came from — enumerate its deliverables and attest each ✅/❌? If not, **stop immediately and do that before continuing** (see SKILL.md → The Completion Gate).

Phase 4 ends at the 4.9 HARD STOP. Historically that checkpoint had two exits — proceed to Phase 5, or take the user's corrections and fold them in. It is now a **four-exit router**. Its job is to answer one question: **has this contradiction matured enough to synthesize, or does it need another pass first?** Synthesizing an immature tension is the failure this loop exists to prevent — it is why the first monk run so often feels like a straw-man, and why the waterfall reaches Phase 5 before the space is actually explored.

**You diagnose and recommend; the user decides.** You compute the signals, name the gap you're seeing, and recommend an exit with your reasoning. Nothing loops and nothing proceeds silently — the router is a presented checkpoint like every other user gate in the skill, and the user is the loop's only stopping authority. There is no hard iteration cap; instead, surface a diminishing-returns read ("this is iteration 3; the last pass added only X") as part of your recommendation, and let the user call it.

## The four exits

| Exit | When | What it does |
|---|---|---|
| **Proceed** | Hidden question settled + signals quiet | Continue to Phase 5 (synthesis). |
| **Research** | The negation kept hitting "we don't actually know X" | Spawn targeted research subagents (`reference/research-subagent-prompt.md`) → gardener ingests into the wiki → re-run the negation. **First-class, not a fallback** — this is the most common loop-back when the user is reading the negation and realizes a gap. |
| **Refine** | Right axis, but the monks were briefed poorly / fixated on trivia | Re-run the *same* monks with a per-pole sharper brief (below). |
| **Re-split** | The working question has become a *better contradiction* than the original split | Re-pole the monks on the new working question — **only if it passes the closure test** (below). |

**Your recommendation to the user must include:** the three signal readings, the gap you diagnosed, the recommended exit, and *how the next pass would be framed*.

## The maturity gate (three signals)

The **hidden-question settledness check is the primary fork.** Read the hidden question from 4.4 (the mandatory hidden-question 2×2) and compare it against the previous pass, tracked in the control log's **hidden-question ledger** (`reference/dialectic-wiki.md` → control log).

1. **Hidden question** — did it move this pass, and on what axis?
   - *Settled* (no move, or only cosmetic) → toward **Proceed**.
   - *Moved to a different axis* (different poles) → **Re-split**.
   - *Same axis, positions immature* → **Refine**.
2. **New cross-edges** — did this pass produce new `[fit:]`-tagged recombinations in the 4.6 Boydian decomposition (the semi-lattice edges)? *Still appearing* → structure still forming, keep working. *None new* → structure saturating.
3. **New facts** — did this pass surface unknowns / gaps (the gardener's coverage state)? *Yes* → coverage gap → **Research**. *No* → coverage saturating.

**Proceed is recommended only when all three are quiet:** hidden question stable, no new cross-edges, no new facts. Then the user judges the stabilized hidden question against the round's **frozen anchor** — *"is this the tension I actually walked in feeling, or a deeper thing I now recognize as what I meant?"* That recognition is the go signal for Phase 5. Only the user can make that call; the signals quieting is necessary, not sufficient.

**Anti-over-iteration bias:** default to **Refine** (mature the current framing) over **Re-split** (re-cut). Re-cutting every pass means no framing ever matures enough to synthesize. Re-split only when the hidden question genuinely needs *different belief burdens* — same poles at a deeper phrasing means you're converging, so keep going; different poles means a real axis-shift worth the re-cut.

## Operators + the firewall

Re-running monks is where the skill's decorrelation apparatus (blind parallel spawn, separate sessions, bias-variance-diversity) is most at risk. The two operators get different treatment.

**Re-split (low risk).** Essentially a fresh Phase 2–3 with re-derived divergent belief burdens (possibly new monks). The monks *do* get re-poled on the new working question — **but only if it passes the closure test.** Blind spawn as usual.

**Refine (high risk — this is where decorrelation dies).** Do **not** hand both monks the same synthesis-enriched briefing; that correlates them and the determinate negation goes mushy. Refine is **per-pole and asymmetric**:
- Each monk gets only *its own* sharpened brief — new facts relevant to its pole, **plus the evidence it personally walked past last round**. (Ask the gardener to assemble it: "give me pole A's monk-safe brief plus the evidence A ignored." This per-pole ignored-evidence surfacing is aimed straight at the confirm-the-prior tendency.)
- Monks stay blind to each other and to all synthesis-leaning material.
- This *preserves* (or increases) decorrelation rather than eroding it.

**The firewall (a spawn-time rule).** The **gardener assembles every monk brief** — as wiki-owner it filters by page type, so enforcement lives in one place. A monk brief pulls **only the factual/positional layer** and **never** the analytical layer:
- **Allowed:** the round anchor, a closure-passing framing of the contradiction, and `concept` / `source` / `position` pages.
- **Never:** the determinate negation, the hidden-question ledger/analysis, `tension` pages, and any `synthesis` candidates or synthesis-leaning corrections.

**The closure test** governs whether the evolved working question may re-pole a monk: *can a monk still argue one side of it at full conviction?* A working question that sharpened into a better fight **passes** — safe to re-pole. A working question that has drifted toward where the synthesis is heading **fails** — it is "a synthesis wearing a question mark" — and stays orchestrator-only. The determinate negation and the syntheses always fail this test.

## Drift protocol (the scent fix)

At the top of **each** loop pass:
1. Read the control log + the last pass's negation + the user's corrections, and write the **delta** (what changed: working question, hidden-question ledger line, loop-ledger line, open gaps).
2. **Re-read the whole control log fresh** as grounding before continuing.

The second read is the actual scent-fix — re-injection at loop-top counteracts the context-window pressure that causes drift. Writing the log without re-reading it builds the anchor and then never looks at it.

---

**Completion gate — enumerate & attest before taking a router exit (see SKILL.md → The Completion Gate).** Mark each ✅/❌ with evidence; any ❌ stops you unless the user explicitly waives it:
- [ ] The three signals computed and **shown to the user** (hidden-question movement, new cross-edges, new facts)
- [ ] The gap diagnosed and an exit recommended, including how the next pass would be framed
- [ ] The **user chose the exit** — not the orchestrator (this user-decision item is not self-waivable)
- [ ] Control log updated this pass: hidden-question ledger line + loop-ledger line + open gaps (drift protocol run: delta written, then whole log re-read)
- [ ] On a Refine/Re-split exit: the monk brief was assembled by the gardener (firewall-clean; per-pole ignored-evidence for Refine); on Re-split, the working question passed the closure test
