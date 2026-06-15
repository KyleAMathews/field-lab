# Boyd Overhaul — Design Spec

**Date:** 2026-06-15
**Scope:** Strengthen the dialectic skill's treatment of Boyd's *Destruction and Creation* (1976), and harden the synthesis against diversity-loss / groupthink, grounded in two external sources.
**Approach:** Surgical, in-place edits to existing sections (4.5, 4.6, 4.6.5, 4.7 in `reference/phase4-determinate-negation.md`; the reversibility check in `reference/phase5-sublation.md`). No new top-level phases, no renumbering of existing phases. The careful lateral-before-decomposition ordering is preserved.

## Motivation

Three sources triangulate on the same lesson — *the enemy is conformity / diversity loss*:

1. **Boyd, *Destruction and Creation* (1976).** The skill's creative engine. Audit found five fidelity gaps between the doc and the actual essay.
2. **rohit, "LLM councils show groupthink" (strangeloopcanon, 2026).** Empirical: councils keep only ~24% of good single-model ("spiky") ideas; peer-review rounds become consensus detectors (shared ideas survive ~33% vs ~24% single). Mechanism = Stasser & Titus's *biased sampling of shared information* → the *hidden-profile problem*. Fix = a "loss-audited council" that explicitly extracts, **stores, ranks, and assesses** each solution's best ideas separately *before* writing the final answer. Magnitudes are soft (N=16, LLM-mediated judging) but the direction matches 40 years of human group research.
3. **Zhu et al., "Demystifying Multi-Agent Debate" (Cambridge/Sheffield, arXiv 2601.19921).** Vanilla debate is a *martingale* — preserves expected correctness, doesn't systematically improve, loses to majority vote at higher cost. Two fixes: **diversity-aware initialization** (greedily maximize distinct candidates; Pass@5 ~74–79% → ~90%; +1–3% alone) and **calibrated confidence** communication (Theorem 1: turns the martingale into a strict *submartingale* → systematic drift toward correctness; combined +2.4% GSM8K). Without diversity injection, debates "collapse to initial majority." Caveat: closed-form benchmarks with a ground-truth answer; small effects; confidence trained via RL/LoRA. Only the prompt-level *intuition* transfers, not the proof.

The dialectic skill is already architected against both failure modes — full-conviction **opposed** monks = maximal diversity-init; the orchestrator analyzing *above* the debate (monks never revise toward each other) = no martingale to collapse; the palette (S/J/G/F/U) = no smoothing into one normie answer; the misfit register = a partial loss audit. These edits close the remaining gaps and make the implicit defenses explicit and operational.

## The seven changes

### #1 — Deeper sea of anarchy (multi-domain pool, unified sourcing)
**Where:** `4.5b` (rework) + fold in `4.6` steps 4–5.
**Why:** Boyd's canonical example builds a snowmobile by shattering *four* domains (skis, outboard motor, handlebars, treads) and recombining across all. The current sea is two monk-positions + 1–2 skimmed Wikipedia articles — too shallow.
**Change:**
- Rework 4.5b from "inject a domain, force isomorphisms in 2–3 paragraphs" into **donor recruitment for the sea**, with two streams:
  - *Random donors* — Wikipedia random-article API, as now (novelty / anti-habit; escapes the orchestrator's conceptual filters).
  - *Functional donors* — for each determinate-negation "missing thing" from 4.3, recruit one domain that takes that **operation** seriously (the snowmobile's donors were chosen for the function each contributes).
- Target **N monks + ~3–5 donors**, and require **each donor decomposed to the same depth as the monk positions** — full domains entering the sea, not garnish.
- Unify the three currently-scattered domain sources — 4.5b (random), 4.6-step-4 ("adjacent domains"), 4.6-step-5 ("epistemological diversity") — into the single donor concept. The epistemological-diversity rule (recruit domains that take a resists-analysis claim seriously) becomes a *special case* of functional-donor recruitment.
- **Domain manifest (enforcement artifact):** the first instruction of `4.6` step 2 writes a manifest listing every domain in the pool — `[Monk A, Monk B, …, donor1, donor2, …]` — as **peers**, each to be decomposed to equal depth. This makes "which domains are in the sea, all decomposed equally" an explicit checklist rather than a prose hope, guarding against the monk-primary habit (thoroughly shatter the essays, skim the donors). **No renumber:** the manifest lives inside the existing 4.6 step 2; section numbers and cross-references are untouched.
**Notes:** the random/functional split was the first design fork, resolved as "both, unified." The pool-structure fork (manifest vs. full restructure vs. pure prose) resolved as "manifest, no renumber."

### #2 — Operationalize Heisenberg (the dead pillar)
**Where:** `4.6` opening + `reference/phase5-sublation.md` (synthesis).
**Why:** Gödel is operational (go outside → reversibility + new research in recursion); the Second Law is operational (Phase 7 entropy diagnostic); Heisenberg has theory text and *no operational check anywhere*.
**Change:** two named checks, framed so all three pillars now have an operational home:
- *Observer-perturbs-observed* (4.6 open): the act of analysis bends positions toward synthesis — verify you are decomposing what the monk **actually committed to**, not a pre-smoothed version. Ties to the existing "treat monk output as testimony, not evidence."
- *Precision-vs-grip* (Phase 5): over-tightening the synthesis for precision loses its match to reality. A suspiciously clean / complete synthesis signals you have squeezed past the resolution the evidence supports. Ties to Adorno (a completed synthesis is suspect) and the Phase 7 entropy diagnostic.

### #3 — Qualities / attributes / operations as three passes
**Where:** `4.6` step 3.
**Why:** Boyd names three distinct search targets; the doc cites the phrase but runs it as one "find connections" move. *Operations* (function/dynamics) is the highest-yield target and the one LLMs skip in favor of static qualities — the snowmobile is an operations recombination.
**Change:** split step 3 into three explicit passes — *qualities* (static properties), *attributes* (relational/contextual), *operations* (function / what the part does). Flag operations as highest-yield; require it actually runs rather than collapsing into qualities.

### #4 — Genuine destruction (anti-tidiness check)
**Where:** `4.6` step 2.
**Why:** Boyd insists on a "sea of anarchy" — a disordered field with provenance forgotten. The LLM's strong bias is a tidy categorized list, which is itself an imported structure = a *failed* destructive step.
**Change:** add a check — the atomic list must be provenance-forgotten and **not pre-categorized** by theme / position / domain. Test: "if my parts already sit in neat groups, I've smuggled in a structure — scramble it."

### #5 — Reversibility as a repair loop
**Where:** `reference/phase5-sublation.md:72` (reversibility check).
**Why:** Boyd's actual instruction on partial reversibility failure is to *repair*, not reject: keep the parts that cohere, add new material, retry. The doc currently only flags untraceable claims.
**Change:** convert flag → bounded repair loop. An untraceable claim does not kill the synthesis: keep coherent parts, add new material (a new donor domain or new research), retry. After K attempts the claim either earns its own evidence as a genuine new insight or is cut.

### #6 — Loss-audit / spiky-idea coverage
**Where:** new `4.6.6`, placed before `4.7` (sublation criteria).
**Why:** rohit's hidden-profile finding. The misfit register stores and cites dropped material but does **not rank or score it by value**, and it targets *un-resolved frame friction*, not *high-value content* the synthesis would smooth away. There is also no blind, multi-judge scoring step — the orchestrator decomposes and synthesizes from a single fully-informed seat, the configuration most prone to hidden-profile loss.
**Change:**
- Extract every high-value idea appearing in **only one** monk (the single-monk "spiky" ideas).
- **Score provenance-blind** — ideally a few fresh blind-judge subagents rating each idea for "useful, non-obvious, worth keeping" without knowing which monk produced it or whether the synthesis will keep it (mirrors rohit's two-blind-judge method; fixes the single-seat problem). Orchestrator-only scoring with provenance stripped is the minimum fallback.
- **Coverage requirement:** each high-value spiky idea is either carried into S / a palette candidate, **or** consciously dropped with a one-line reason logged to the misfit register.

**Boundary with the misfit register (4.6.5) — keeps #6 from contradicting it:**

| | Loss-audit (#6) | Misfit register (4.6.5) |
|---|---|---|
| Object | high-value *content* (mechanism, observation, failure mode) | frame-level *friction* |
| Failure mode | smoothing it away → **recover** it | forcing it to fit → **preserve** un-resolved |
| Test | "would carrying this in make S *better*?" | "would absorbing this *falsify* S?" |

### #7 — Per-claim calibration + confidence-weighted synthesis
**Where:** `4.6` (decomposition tagging) + `reference/phase5-sublation.md` (weighting); second scoring axis in `4.6.6`.
**Why:** Zhu et al.'s submartingale mechanism. The monks stay at uniform full conviction (the Electric Monk premise — they carry belief so the orchestrator is belief-free; unchanged). But conviction is *global*; calibration is *per-claim*. A fully-committed monk still mixes rock-solid claims with rhetorical reaches.
**Change:**
- When shattering positions into atomic parts (4.6), **tag each part with an independent calibration estimate** — how well-supported it is, regardless of how confidently the monk asserted it.
- **Weight the synthesis by calibration, not rhetorical force.** This imports the submartingale mechanism into the *orchestrator's* seat without touching the monks.
- Composes with #6 as a second scoring axis: high-value + well-calibrated → carry hard; high-value + low-calibration → carry as a *flagged hypothesis* that must earn evidence (the #5 repair path).

## Cost / caveats
- #1 (donors decomposed to depth) and #6 (blind-judge subagents) make Phase 4 heavier — rohit's own "slower and heavier" caveat. Lean on the existing Phase 4 context-management guidance (summarize essences, write full output to file) to absorb it.
- The Cambridge proof (submartingale → correctness) assumes a ground-truth answer; the dialectic is open-ended, so only the *intuition* of #7 transfers, not the theorem. Stated as such in the doc.
- These are markdown/instruction edits to a mature, battle-tested skill. Risk is wording that misfires at runtime, not code regressions. Validation is a careful read-through + ideally one live dialectic run comparing before/after on the determinate-negation and synthesis artifacts.

## Out of scope
- No restructure into a separately-numbered "Sea of Anarchy" construction phase with a renumber cascade (considered; rejected as too much blast radius for the gain — the enforcement it would provide is captured by the in-place domain manifest in #1).
- No RL/training-based confidence calibration (not applicable to a prompt-level orchestration skill).
- No changes to the README beyond reflecting the above once the reference docs land.
