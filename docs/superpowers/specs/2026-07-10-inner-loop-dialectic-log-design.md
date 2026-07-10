# Inner Refinement Loop + Dialectic Log + Research Wiki — Design

**Date:** 2026-07-10
**Status:** Design approved, ready for implementation plan
**Skill:** Hegelian dialectic (`/Users/kylemathews/programs/hegelian-dialectic-skill`)

---

## Problem

Three coupled failure modes observed in real runs:

1. **Monks straw-man on the first run.** Phase 3 monk essays are written early, off an immature briefing. They fixate on trivial parts of the space and argue against the orchestrator's _predicted_ version of the opposing side rather than the real one.
2. **The waterfall synthesizes prematurely.** The skill flows Phase 1 → 7 expecting each phase to work in one pass. But the space often isn't explored well enough at Phase 5 to position a good synthesis — the tension hasn't matured.
3. **The orchestrator loses the scent.** Across a long working session (reading negations, pulling in resources, correcting monks), the original tension and the drifted working question become the same object, so drift is invisible and the synthesis can wander somewhere plausible-but-not-what-the-user-meant.

The user's actual working pattern: when reading the determinate negation, they frequently (a) realize they need more research, (b) correct monk assumptions, and (c) inject new resources — after which the original monks are "far in the past" and immature. The skill has no first-class way to loop back and mature the tension before synthesizing.

## Goal

Add a **maturity-gated inner refinement loop** that matures _this_ contradiction before Phase 5, grounded in a **persistent research wiki** and a **per-round control log** that keeps the original tension frozen and makes drift legible.

This is **additive**. It does not re-architect the skill's phase/round structure or its `round_N_*.md` file convention. (A more invasive "flatten everything into a typed wiki, dissolve rounds" reorganization was discussed and deliberately deferred — see _Deferred_.)

---

## Architecture Overview

Two loops, explicitly named:

- **Inner loop (new):** matures _this round's_ contradiction before Phase 5. Lives at the existing Phase 4 HARD STOP (4.9), turning that 2-way checkpoint into a 4-exit router.
- **Outer loop (Phase 7, existing, unchanged):** jumps to an adjacent contradiction _after_ a synthesis. **Boundary rule:** re-split stays on the same frozen anchor; Phase 7 moves to a queued _different_ contradiction.

Two-level knowledge layer beneath the loop:

- **Persistent research wiki** (dialectic-level, compounds across rounds) — the coverage substrate.
- **Per-round control log** (`round_N_dialectic_log.md`) — the drift-tracking + loop-control state, mostly pointers into the wiki.

Everything the loop needs to decide (proceed vs. loop, and which operator) is read off **artifacts the skill already produces** — the hidden question (4.4) and the Boydian `[fit:]` recombinations (4.6) — plus the wiki's fact accretion. The gate is skill-native, not a bolted-on `is_sufficient` heuristic.

---

## Component A: The 4.9 Router (the inner loop)

The Phase 4 HARD STOP (4.9) currently has two exits: _proceed to Phase 5_, or _user corrects and orchestrator folds it in_. It becomes a **four-exit router**. The orchestrator **diagnoses the gap, computes the signals, and recommends an exit with its reasoning — but the user chooses every pass.** Nothing loops or proceeds silently.

| Exit         | When                                                                             | What it does                                                              |
| ------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Proceed**  | Hidden question settled + signals quiet                                          | Continue to Phase 5                                                       |
| **Research** | Negation kept hitting "we don't actually know X"                                 | Targeted supplementary research → ingest into wiki → re-negate            |
| **Refine**   | Right axis, but monks were briefed poorly / fixated on trivia                    | Re-run _same_ monks with a per-pole sharper brief (see Component C)       |
| **Re-split** | The working question has become a _better contradiction_ than the original split | Re-pole monks on the new working question (if it passes the closure test) |

**Design rules:**

- Every exit is a **presented checkpoint**, same as every other user gate in the skill. The user is the final arbiter and the loop's only stopping authority ("you're the cap" — no hard iteration limit; the orchestrator surfaces a diminishing-returns read like "this is iteration 3, here's what each pass added" as part of its recommendation).
- **Research is first-class, not a fallback** — it is the most common loop-back when the user is reading the negation.
- The router recommendation must include: the three signal readings, the diagnosed gap, the recommended exit, and _how the next pass would be framed_.

## Component B: The Maturity Gate (three saturation signals)

The **hidden-question-settledness check is the primary fork.** It is read from section 4.4 (the mandatory hidden-question 2×2), tracked across passes in the control log's hidden-question ledger.

1. **Hidden question** — did it move this pass, and on what axis? _Settled_ (no move, or cosmetic only) → toward Proceed. _Moved on a new axis_ → Re-split. _Same axis, positions immature_ → Refine.
2. **New cross-edges** — did this pass produce new `[fit:]`-tagged recombinations in the 4.6 Boydian decomposition (the semi-lattice edges)? _Still appearing_ → structure still forming → keep working. _None new_ → structure saturating.
3. **New facts** — did this pass surface unknowns / gaps? _Yes_ → coverage gap → Research. _No_ → coverage saturating.

**Proceed is recommended only when all three quiet:** hidden question stable, no new cross-edges, no new facts. The user judges the stabilized hidden question against the round's frozen anchor — "is this the tension I actually walked in feeling, or a deeper thing I now recognize as what I meant?" That recognition is the go signal for Phase 5.

**Anti-over-iteration bias:** default to Refine (mature the current framing) over Re-split (re-cut). Only Re-split when the hidden question genuinely needs _different belief burdens_ — same poles, deeper phrasing = converging, keep going; different poles = real axis-shift worth the re-cut.

## Component C: Refine / Re-split Operators + Firewall

Re-running monks is where the skill's decorrelation apparatus (blind parallel spawn, separate sessions, bias-variance-diversity) is most threatened. The two operators sit at different risk levels and get different treatment.

**Re-split (low risk).** Essentially a fresh Phase 2–3 with re-derived divergent belief burdens (possibly new monks). The monks _do_ get re-poled on the new working question — **but only if it passes the closure test** (see Firewall). Blind spawn as usual.

**Refine (high risk — this is where decorrelation dies).** Do **not** feed both monks the same synthesis-enriched briefing; that correlates them and the determinate negation goes mushy. Instead, refine is **per-pole and asymmetric**:

- Each monk gets only _its own_ sharpened brief — new facts relevant to its pole, **plus the evidence it personally walked past last round** (the ignored-evidence surfacing, adapted from Co-STORM's moderator but done per-pole rather than against a single topic centroid — see _Research Notes_).
- Monks stay blind to each other and to all synthesis-leaning material.
- This _preserves_ (or increases) decorrelation and directly targets the observed confirm-the-prior tendency.

**The Firewall (a spawn-time rule, not a log column).** When Refine/Re-split builds a monk brief, the **gardener** assembles it (as wiki-owner it filters by page type, so firewall enforcement lives in one place — the orchestrator asks for "pole A's brief + the evidence A walked past" and receives a firewall-clean brief). It pulls **only the factual/positional layer** and **never** the analytical layer:

- **Allowed in a monk brief:** the round anchor, a closure-passing framing of the contradiction, and `concept` / `source` / `position` wiki pages.
- **Never in a monk brief:** the determinate negation, the hidden-question ledger/analysis, the misfit/`tension` pages, and any `synthesis` candidates or synthesis-leaning corrections.

**The closure test** governs whether the evolved working question may re-pole a monk: _can a monk still argue one side of it at full conviction?_ A working question that sharpened into a better fight passes (safe to re-pole). A working question that has drifted toward where the synthesis is heading fails — it is "a synthesis wearing a question mark" — and stays orchestrator-only. The negation and syntheses always fail this test.

## Component D: The Per-Round Control Log

`round_N_dialectic_log.md` — mostly pointers into the wiki. Karpathy's `log.md` specialized to one round's contradiction.

| Section                    | Lifecycle                                         | Purpose                                                                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Anchor**                 | frozen, never overwritten                         | The round's starting contradiction, verbatim. Round 1 = the original felt tension in the user's own words; later rounds = the Phase-7 contradiction it launched from. Plus a one-line **lineage pointer** ("launched from Round 2's synthesis"). |
| **Working question**       | living; revisions are **diffs the user ratifies** | The current evolved framing. The orchestrator never silently rewrites it (anti-sycophancy / no laundered goal-drift). Carries the closure flag: "still a live two-sided contradiction? Y/N".                                                     |
| **Hidden-question ledger** | append-only                                       | One line per pass: what the hidden question was (from 4.4), whether it moved vs. last pass, on which axis. The settledness signal made legible.                                                                                                  |
| **Loop ledger**            | append-only                                       | One line per inner-loop pass: operator used (Research / Refine / Re-split), what it added, iteration count. Feeds the diminishing-returns read.                                                                                                  |
| **Open gaps**              | living                                            | Current reading of the three signals: what's unknown (coverage), what cross-edges are still forming (structure), whether the hidden question is still moving (framing). Distinct from the cross-round Phase-7 queue.                             |

**Drift protocol (the scent fix):** at the top of each loop pass the orchestrator (1) reads the log + the last pass's negation + the user's corrections and writes the delta, then (2) **re-reads the whole log fresh** as grounding before continuing. The second read is the actual scent-fix — re-injection at loop-top counteracts the context-window pressure that caused drift. Writing without re-reading builds the anchor and then never looks at it.

## Component E: The Research Wiki

A persistent, compounding, Karpathy-style ["LLM Wiki"](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): interlinked markdown pages a persistent **gardener** subagent maintains as research accretes (see Component G — the orchestrator never writes the wiki directly). **Compounds across rounds** (rounds explore one interconnected space; Round 2's research builds on Round 1's, it does not reset). It is a **graph of cross-linked pages, not a hierarchy** — which is the semi-lattice the skill is trying to build, and which dodges Co-STORM's tree-reorg trap (see _Research Notes_).

**Page types:**

- `concept` — an idea, mechanism, framework. _Monk-safe._
- `source` / `entity` — a thinker, article, company, piece of evidence. _Monk-safe._
- `position` — a committed stance (what a monk believes). Prior monk essays kept as **immutable snapshots** so drift stays visible. _Monk-safe._
- `tension` — a **contradiction**: the home for a misfit, as opposed to a fact (`concept`), a source (`source`), or a stance (`position`). A tension page holds (a) the contradiction itself — two-or-more things in the space that won't reconcile, i.e. exactly what the skill already calls a _misfit_; (b) the **hidden question** underneath it (from 4.4); (c) a **pointer to the determinate negation** that worked it; and (d) **cross-links** to the `concept`/`position`/`source` pages the tension sits _between_ — those links _are_ the semi-lattice edges. They serve two structural roles: they are **orchestrator-only** (a monk must never see the collision it is meant to walk into blind — page-type makes that filter trivial), and their cross-links form the **navigation graph for recursion** (picking the next contradiction to work = following a link to an adjacent tension page; the tension pages _are_ the dialectic queue / idea maze). **These replace `misfit_register.md`.** _Orchestrator-only._
- `synthesis` — a candidate resolution. _Orchestrator-only._

**Special files:**

- `index.md` — catalog of pages + a **current-focus pointer** (which tension is being worked now — the one thing "rounds" gave for free).
- `log.md` — chronological operations record for the whole dialectic (the global dialectic log; the per-round control log is its per-contradiction specialization).

**Ingest operation** (on Phase 1 research and every Research-exit loop-back) is performed by the **gardener** (Component G), not the orchestrator: research subagents write page-shaped drafts to a staging directory and return their paths; the orchestrator passes the paths to the gardener, which reads them and cleans them, writes/updates pages, cross-links across the whole wiki, seeds `tension` pages from contradictions, updates `index.md`, and appends to `log.md`. Each page is tagged with the **gap/question that triggered it** and its **provenance**. The orchestrator coordinates (hands off drafts, requests views) but does not touch the wiki — this protects the context it needs for the dialectic.

**Relationship to existing artifacts:** the persistent `misfit_register.md` is **replaced** by the wiki's `tension` pages (decided — a flat register file is strictly worse than interlinked tension pages, which preserve the links to what each tension sits between). The per-round misfit register section similarly becomes tension-page writes. The `round_N_*.md` phase outputs (monk essays, negation) stay as they are; whether they are also mirrored into the wiki as pages is left open and **not required** for this build.

## Component F: Inner vs. Outer Loop Boundary

Written into both `SKILL.md` and `phase7-recursion.md`:

- **Inner loop** matures _this_ contradiction before its first synthesis. Operators: Research / Refine / Re-split. Stays on the round's frozen anchor.
- **Outer loop (Phase 7)** jumps _after_ a synthesis to a queued _different_ contradiction (a new round, new anchor, lineage pointer back).

The crisp discriminator: **re-split stays on the same frozen anchor; Phase 7 moves to a different queued contradiction.**

## Component G: The Gardener + Research-Subagent Contract

The wiki is written by a single **persistent gardener subagent** — never by the orchestrator (which would clobber the context it needs for the dialectic) and never by the parallel research subagents (which would clobber each other). Three roles:

- **Research subagents** (ephemeral, parallel, blind to each other) — do targeted research, **write page-shaped draft files to a staging directory, and return only the paths** (never the content — that keeps the orchestrator's context clean). They never touch the wiki.
- **Gardener** (persistent, single writer) — **reads the draft files from staging** and ingests them: cleans them, places/updates pages, resolves cross-links across the whole wiki, seeds `tension` pages from surface contradictions, updates `index.md`, appends to `log.md`, and periodically **lints** (fix broken links, merge duplicate pages, prune stale ones — Karpathy's maintenance op).
- **Orchestrator** — coordinates: **collects the draft paths and hands them to the gardener**, requests views (e.g. a monk-safe brief), keeps its own context on the dialectic. It passes paths, never draft content.

**Gardener design notes:**

- **"Persistent" is an optimization, not a correctness requirement.** The gardener's real state is the wiki _on disk_; a compacted or freshly-spawned gardener re-grounds by reading it. Resume the same agent when the environment allows (it remembers in-flight cross-links), but correctness never depends on its conversation memory. This keeps it robust on long dialectics.
- **Staging directory.** Draft files land in a staging directory (e.g. `<dialectic-dir>/staging/`) — transient handoff space, not the wiki. The orchestrator moves only paths through its context; the gardener reads and ingests, then clears (or archives) the staged drafts so staging never masquerades as the wiki.
- **The gardener enforces the firewall** by assembling monk briefs on request — it owns page types, so it filters to `concept`/`source`/`position` and excludes `tension`/`synthesis`. Firewall enforcement lives in one place (Component C).
- **Two levels of contradiction-spotting:** the gardener flags _surface_ contradictions from research ("source X ⊥ source Y") as candidate `tension` pages (seeds); the orchestrator does the _deep_ determinate negation (Phase 4). Gardener seeds, orchestrator deepens.
- **Signal division:** the gardener maintains the _coverage_ state (did this ingest add new pages? what is flagged unknown?) → feeds the "new facts" signal; the orchestrator keeps the hidden-question ledger. Cross-edges are shared.
- **Cost, honestly:** a second long-running agent on an already token-heavy skill. The trade — clean orchestrator context over tokens — is deliberate, not free.

**Research-subagent prompt contract** (standard slots; template in `reference/research-subagent-prompt.md`). The gardener consumes drafts in this exact format, so the contract _is_ the interface between the two agent roles:

1. **Target** — the specific search directive ("search for X's argument about Y, the part about Z" — not "research this topic").
2. **Gap tag** — the open question this research is meant to close, verbatim; stamped on every page the agent drafts (the Co-STORM intent-tag).
3. **Output contract** — **write 1–N page-draft files to the staging directory and return only their paths** — nothing else. No prose report, no inline page content in the return message (this is what keeps raw drafts out of the orchestrator's context).
4. **Page format** — frontmatter (`title`, `type: concept|source`, `provenance`, `gap-tag`, `date`) + body: a one-line summary; key claims each with a citation; a **relates-to** list of _candidate_ cross-links stated as "connects to «X» because …"; and an **observed-tensions** list — contradictions it noticed but was told **not to resolve**.
5. **Stance guardrail** — flag contradictions, don't smooth them; don't editorialize toward a synthesis; you are feeding a dialectic, not writing a conclusion.
6. **Decorrelation** — if spawned in parallel, blind to each other; targetable per-pole or per-domain, matching the existing Phase 1d research split.

---

## File Footprint

**New reference docs:**

- `reference/phase4.5-refinement-loop.md` (or similarly named) — the 4.9 router, four exits, maturity gate, operators, firewall, drift protocol. Read just-in-time at the 4.9 checkpoint. Gets the standard re-entry guard + completion gate.
- `reference/dialectic-wiki.md` — the wiki + control-log conventions: page types, the **gardener** role and orchestrator↔gardener coordination protocol, the ingest + lint operations, `index.md`/`log.md`, the firewall page-type rule.
- `reference/research-subagent-prompt.md` — the standard research-subagent output contract (target, gap-tag, page format, stance guardrail, decorrelation) that the gardener consumes.

**Modified:**

- `SKILL.md` — phase-map diagram (insert the inner loop between Phase 4 and Phase 5); name inner vs. outer loops; file-organization section (add wiki + control-log conventions alongside the round files); introduce the three-agent-role model (orchestrator / gardener / research subagents) and add the **gardener** to the "Environment Mapping" table as a persistent/resumable agent that re-grounds from disk; Boyd/theory sections may reference the maturity gate as the operational home of "positioned to synthesize."
- `reference/phase1-elenctic-interview.md` — 1d/1e research becomes wiki ingest; write the frozen anchor to `round_1_dialectic_log.md`; the completion gate gains the anchor + wiki items.
- `reference/phase4-determinate-negation.md` (index) + `reference/phase4-stage-d-criteria.md` — the 4.9 HARD STOP becomes the four-exit router; the hidden-question ledger is written here each pass; completion gate updated.
- `reference/phase5-sublation.md` — entry condition: Phase 5 begins only when the router's Proceed exit was taken (hidden question settled).
- `reference/phase7-recursion.md` — inner-vs-outer boundary; the wiki compounds across rounds; a new round writes a new control log with a lineage pointer; preserve the "first pass is calibration, the walk deepens as the wiki compounds" pedagogy in the new framing.
- **Misfit-register → tension-page migration** (threads through several docs): `reference/phase4-stage-c-decomposition.md` (the 4.6.5 misfit register + the per-round + persistent `misfit_register.md` writes), `SKILL.md` (the Phase 4 summary + Boyd section references to the misfit register), and `reference/misfit-patterns-watchlist.md` (cross-round pattern memory — becomes cross-links among tension pages). Everywhere the skill currently writes/reads `misfit_register.md`, it now writes/reads `tension` pages.

**Recommended implementation sequence:** build the **wiki capture** first (it improves Phase 1 research even without the loop), then the **control log**, then the **inner loop** on top.

---

## What We're NOT Doing (anti-goals)

- **No Co-STORM-style hierarchical mind-map / tree reorganization.** Their `reorganize()` clusters by similarity and _scatters disagreements / merges away dissent_ — the opposite of the semi-lattice goal. We take their intent-tagged fact store and interlinked-page idea, not their topology or their reorg.
- **No automated looping.** The loop never advances or repeats without the user. No `is_sufficient` model deciding for the user; the orchestrator recommends, the user decides.
- **No hard iteration cap.** The user is the stopping authority; the orchestrator surfaces diminishing returns.
- **No shared synthesis-enriched briefing on Refine.** Per-pole asymmetric briefs only, to protect decorrelation.

## Deferred / Future Direction

**Flatten the entire skill state model into a typed wiki.** Dissolve "rounds" as an organizing unit (they impose a clean sequence on what is really a random walk through idea space); make the phases _operations on the wiki_ rather than a file-emitting sequence; reframe Phase 7 recursion as _navigation to a linked tension page_ with no renumbering. Under this model everything — including monk essays and negations — is a typed wiki page, the frozen anchor becomes a frozen root `tension` page with per-page origin links, and drift-tracking is per-tension. This is more honest to the process but is an invasive re-architecture of `SKILL.md`'s file organization and every phase doc's "write to file" instructions. **Deferred by decision** — for now it does not matter whether `round_` files are "properly part of" the wiki.

## Research Notes (grounding)

- **Co-STORM** (Stanford OVAL, EMNLP 2024) — its knowledge base and mind map are one object; every fact carries `meta["question"]` (the question that surfaced it), deduped by hash. Its saturation trigger is a _pure counter_ (L consecutive answer-type turns → moderator; L=2 in paper, 3 in shipped code) — coverage-drift, not argument-maturity, and explicitly cannot "distinguish productively deepening the disagreement from looping." Its map is a strict parent-child tree with **no lateral edges**, so it _cannot represent a contradiction_; `reorganize()` scatters disagreements. **Takeaways for us:** steal the intent-tagged fact store and the observe/inject steering; build our own semantic maturity gate (they have none — termination is user-driven + turn cap); keep contradiction first-class via interlinked pages, never a tree.
- **The single-centroid relevance-ranking observation** — Co-STORM ranks "unused" evidence against one topic centroid, which "will systematically favor whichever pole's framing dominates the embedding space." This is a candidate _mechanical_ explanation for the skill's observed "stacked sea confirms priors" tendency, and the reason Refine's ignored-evidence surfacing is **per-pole**, not centroid-based.
