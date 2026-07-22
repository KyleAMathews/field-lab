# The Dialectic Wiki

The wiki is the field lab's persistent, compounding research memory. A Walk never creates it. A Survey creates it only when reusable research, cross-links, several agents, recursion, or context risk make graph memory worth its cost. An Expedition crosses that threshold and uses it.

It is a Karpathy-style ["LLM Wiki"](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): interlinked markdown pages, each a typed unit, cross-linked to the others. It is a **graph, not a hierarchy** — the cross-links between pages _are_ the semi-lattice the skill is trying to build ("A City is Not a Tree"), and a graph can hold contradictions a tree cannot. The wiki is written by **one agent only — the gardener** — and it **compounds across rounds**: Round 2 builds on Round 1's pages, it does not reset. It lives in the dialectic's output directory alongside the existing `round_N_*.md` files.

This doc defines the wiki's page types, its special files, the three agent roles, the gardener's operations, the orchestrator↔gardener protocol, and the per-round control log.

## Page types

Every wiki page declares a `type` in its frontmatter. The type sets whether the page is **monk-safe** (may appear in a monk's briefing) or **orchestrator-only** (must never reach a monk — see the firewall in `reference/refinement-loop.md`).

- **`concept`** — an idea, mechanism, framework, or pattern. _Monk-safe._
- **`source` / `entity`** — a thinker, article, company, dataset, or piece of evidence. _Monk-safe._
- **`donor`** — a blind-recruited cross-domain field (Phase 4.5b) with its own technical vocabulary and mechanisms, tagged with meta-domain + epistemological register + `[fit:]` calibration. _Orchestrator-side_ — feeds the decomposition and synthesis; **not placed in monk briefs** (donors are introduced _after_ the monks, and feeding them raw would homogenize the monks; the only monk-facing donor channel is the deliberate, controlled Phase 1e.1 enrichment). Reusable across rounds — a later round can re-shatter a donor without re-recruiting it.
- **`position`** — a committed stance (what a monk believes). Prior monk essays are kept as **immutable snapshots** so drift across re-runs stays visible. _Orchestrator-facing (drift-tracking) — **never placed in a monk brief**: a monk must not see another monk's position, and monks argue fresh from the factual substrate, not from prior essays._
- **`tension`** — a **contradiction**: the home for a misfit. A tension page holds (a) the contradiction itself — two-or-more things in the space that won't reconcile, i.e. what the skill elsewhere calls a _misfit_; (b) the **hidden question** underneath it (from 4.4); (c) a **pointer to the determinate negation** that worked it; and (d) **cross-links** to the `concept`/`position`/`source` pages the tension sits _between_ — those links are the semi-lattice edges. Tension pages **replace `misfit_register.md`** (a flat register loses the links to what each tension sits between). They serve two structural roles: they are orchestrator-only (a monk must never see the collision it is meant to walk into blind), and their cross-links form the **navigation graph for recursion** — picking the next contradiction to work is following a link to an adjacent tension page. The tension pages _are_ the dialectic queue / idea maze. _Orchestrator-only._
- **`synthesis`** — a candidate resolution (S/J/G/F/U from Phase 5). _Orchestrator-only._

**Every page begins with valid YAML frontmatter** — this is the machine-readable layer the firewall and re-grounding queries depend on, so it is **required and must be real YAML** (a `---` block), not bold-prose headers like `**Type:**`. Prose goes in the body below the closing `---`. Canonical schema:

```yaml
---
type: concept # concept | source | position | tension | synthesis | donor
title: Goodhart's Law
gap: "what makes rubrics effective for agent-guided evaluation?" # intent tag — the question that surfaced this page
provenance: staging/research_agent_evaluation_guidance.md # agent / round / source that produced it
date: 2026-07-10
# type-specific fields:
#   donor:                       meta_domain, register, fit   (e.g. meta_domain: law, register: normative, fit: reach)
#   concept (from 4.6 decomp):   fit                          (the [fit:] calibration on the recombination)
#   position:                    monk, round
---
```

**`type` and `gap` are mandatory on every page** — `type` drives the firewall, `gap` is the intent tag that makes the wiki queryable. Cross-links between pages stay as **inline body links** (`[goodharts-law](goodharts-law.md)`) — the edge's _reasoning_ ("connects to X because Y") belongs in prose. (A flat `relates_to:` frontmatter list could be added later for graph traversal, but isn't required — YAGNI.)

## Special files

- **`index.md`** — the catalog of pages, plus a **current-focus pointer**: which tension is being worked right now. (This is the one thing "rounds" gave for free — a sense of "where am I" — made explicit.)
- **`log.md`** — a chronological operations record for the whole dialectic: every ingest, lint, monk spawn, negation, synthesis, and loop decision, in order. The per-round control log (below) is `log.md` specialized to a single contradiction.

## The three roles

The wiki is durable, organized background memory: it lets the orchestrator offload wiki bookkeeping to the gardener and re-ground from disk after context loss, and it feeds the monks and future research runs. Three roles, strictly separated:

- **Research subagents** (ephemeral, parallel, blind to each other) — do targeted research and **write page-shaped draft files to a staging directory, returning their paths**. The orchestrator reads those files for the live conversation; the gardener ingests them into the wiki. (Drafting to files, not inline prose, keeps them durable and gardener-ingestible.) They never touch the wiki. Their output contract is `reference/research-subagent-prompt.md`.
- **Gardener** (persistent, single writer) — **reads the draft files from staging** and ingests them into the wiki; resolves cross-links; seeds `tension` pages; maintains `index.md` and `log.md`; and periodically lints. Single writer ⇒ parallel research agents never clobber each other or the index.
- **Orchestrator** (you) — coordinates: reads the research (needed for the live conversation), hands the draft paths to the gardener for ingestion, and requests views from it (a monk brief, or a re-grounding summary after context loss). It doesn't do the wiki bookkeeping itself — the gardener does, so the orchestrator doesn't burn context on librarian work. Spawn the gardener at the very start, before any research.

## The gardener

- **"Persistent" is an optimization, not a correctness requirement.** The gardener's real state is the wiki _on disk_. A compacted or freshly-spawned gardener re-grounds by reading the wiki. Resume the same agent when the environment allows (it remembers in-flight cross-links), but correctness never depends on its conversation memory. This keeps it robust on long dialectics. (See SKILL.md → Environment Mapping for how to resume it.)
- **Staging directory.** Research drafts land in `<dialectic-dir>/staging/` — transient handoff space, not the wiki. The orchestrator moves only paths through its context; the gardener reads and ingests, then clears (or archives) the staged drafts so staging never masquerades as the wiki.
- **The gardener enforces the firewall.** Because it owns page types, it is the natural place to assemble monk briefs: on request it returns `concept`/`source` pages only — never `position` (decorrelation: a monk must not see another monk's stance), `donor`, `tension`, or `synthesis`. It **filters on the frontmatter `type` field deterministically** (the firewall is a decorrelation boundary — don't rely on scanning prose; a mistagged or bold-header page can leak). Firewall enforcement lives in one place (see `reference/refinement-loop.md`).
- **Two levels of contradiction-spotting.** The gardener flags _surface_ contradictions from research ("source X ⊥ source Y") as candidate `tension` pages — seeds. The orchestrator does the _deep_ determinate negation (Phase 4). Gardener seeds, orchestrator deepens.
- **The blind-expectation probe is orchestrator-facing and ephemeral** (`reference/frontier-overlay.md`), like `donor`/`tension`/`synthesis`: it runs after the monks, feeds only the orchestrator's frontier reading, and is **never** placed in a monk brief. It is not a wiki page — its output lives in the frontier-ledger.
- **Signal division.** The gardener maintains the _coverage_ state (did this ingest add new pages? what is still flagged unknown?) → this feeds the "new facts" signal of the maturity gate. The orchestrator keeps the hidden-question ledger. Cross-edges are shared.
- **Cost, honestly.** The gardener is a second long-running agent on an already token-heavy skill. The trade — clean orchestrator context over tokens — is deliberate, not free.

## Operations

**Ingest** (on Phase 1 research and every Research-exit loop-back): the gardener reads the staged draft paths, then — cleans each draft, writes or updates the corresponding page, resolves cross-links across the whole wiki (adding `relates-to` edges), seeds `tension` pages from contradictions it spots, updates `index.md`, and appends an entry to `log.md`. One research source typically touches several pages. Each page carries its gap tag and provenance.

The gardener ingests not only research but **the dialectic's own outputs**, which are just as information-rich:

- **Monk essays → `position` pages** (Phase 3) — each monk's committed stance as an immutable per-round snapshot, cross-linked to the `concept`/`source` pages it draws on.
- **Blind donor research → `donor` pages** (Phase 4.5b) — the field-accurate vocabulary and mechanisms of each recruited cross-domain donor; some of the most novel material the skill produces.
- **The determinate negation → cross-edges + `tension` pages** (Phase 4) — the `[fit:]`-tagged recombinations become `relates-to` links among `concept`/`position` pages (these cross-edges _are_ the semi-lattice — the skill's core structural output, and what later rounds build on); the misfits become `tension` pages.
- **Phase 5 candidates → `synthesis` pages.**

In every case the gardener **distills and links** — the full text stays in the `round_N_*.md` files; the wiki holds the cross-linked, reusable version with pointers back. That is what makes the wiki compound into real memory rather than a pile of dumps.

**Lint** (periodically, or on orchestrator request): fix broken cross-links, merge duplicate pages, prune stale ones, and reconcile pages that have drifted out of sync. This is the maintenance pass that keeps a compounding wiki navigable rather than accreting cruft.

## Ingest cadence

Hand each phase's output to the gardener **as it is produced** — each is enforced by that phase's completion gate, so a phase cannot close until its output is ingested:

- **Phase 1** — research → `concept`/`source` pages
- **Phase 3** — monk essays → `position` pages
- **Phase 4.5b** — blind donor research → `donor` pages
- **Phase 4.6** — the decomposition's `[fit:]` recombinations → cross-edges; notable atomic parts → `concept` pages
- **Phase 5** — palette candidates → `synthesis` pages

## Orchestrator ↔ gardener protocol

The orchestrator coordinates with the gardener through a small set of requests. It never writes the wiki; it asks the gardener to.

- **Ingest** — "here are these staged draft paths; ingest them." → gardener returns a short summary of pages created/updated and any **candidate tensions** it spotted (for the orchestrator to confirm and deepen).
- **Re-ground the orchestrator** — "summarize the current wiki state" or "give me the pages on «topic»." → gardener returns an organized summary so the orchestrator can page context back in after compaction, without re-reading everything. Durable memory the orchestrator can reload is one of the wiki's main jobs.
- **Assemble a monk brief** — "give me pole A's monk-safe brief, plus the evidence pole A walked past last round." → gardener returns a firewall-clean brief (`concept`/`source` pages only — never `position`/`donor`/`tension`/`synthesis`; per-pole ignored-evidence surfaced).
- **Record** — "record this as a `tension` / `synthesis` page" or "append this loop-ledger entry." → gardener writes it and updates `log.md`.
- **Report coverage** — "what's the current open-gaps / coverage state?" → gardener reports what's still flagged unknown (feeds the "new facts" signal).

## The per-round control log

`round_N_dialectic_log.md` — the loop-control state for one contradiction. Mostly **pointers into the wiki**; it is `log.md` specialized to the round's contradiction.

| Section                    | Lifecycle                                         | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Field lineage**          | frozen; imported at promotion                     | The session/task pointer, original question, Survey-log path if any, promotion trigger, and every inherited instrument's actual execution seat, context boundary, fallback or downgrade, access delta, control, artifact risk, and trace pointer. Preserve what ran rather than the card's preferred seat. This prevents the Expedition from inventing a clean start, repeating prior work, or laundering a correlated fallback into independent evidence.                                                 |
| **Goals & context**        | **dialectic-level**; frozen, user updates         | _Why_ the user is running this dialectic — the broader purpose beyond the specific tension: intended **deliverables** (a skill, a blog post, a decision, a mental model), **audience**, and what a useful outcome looks like. Written once at the start and **carried into every round's log**. Frames what "positioned to synthesize" and "useful output" mean — a synthesis that resolves the tension but doesn't serve these goals has missed the point. Re-read it (with the Anchor) at each loop-top. |
| **Anchor**                 | frozen, never overwritten                         | The round's starting contradiction, verbatim. Round 1 = the original felt tension in the user's own words; later rounds = the Phase-7 contradiction it launched from. Plus a one-line **lineage pointer** ("launched from Round 2's synthesis").                                                                                                                                                                                                                                                           |
| **Observation ledger**     | append-only                                       | Readings carried from Walk, Survey, research, and instruments with their kinds (`observation`, `measurement`, `user-testimony`, `source-claim`, `elicited-response`, `generated-sample`, `controlled-comparison`, `test-result`, `inference`, `analogy`, `normative-judgment`, `hypothesis`), support, confidence, and artifact risk. Later analysis may transform claims but not erase provenance.                                                                                                                 |
| **Instrument ledger**      | append-only; lifecycle state may advance          | One entry per offered, selected, prepared, or completed instrument: authorization, lifecycle state, actual execution seat and contexts, fallback, access delta, typed raw readings, calibration or control, artifact risk, unmeasured remainder, trace paths, user-feedback state, and caddy result. Keep phase interpretation outside this ledger. Preparation never masquerades as a completed reading. The phase gate cites these entries.                                                                    |
| **Working question**       | living; revisions are **diffs the user ratifies** | The current evolved framing. The orchestrator never silently rewrites it (anti-sycophancy / no laundered goal-drift). Carries the closure flag: "still a live two-sided contradiction? Y/N".                                                                                                                                                                                                                                                                                                               |
| **Hidden-question ledger** | append-only                                       | One line per pass: what the hidden question was (from 4.4), whether it moved vs. last pass, on which axis. The settledness signal made legible.                                                                                                                                                                                                                                                                                                                                                            |
| **Frontier-ledger**        | append-only                                       | One line per pass: the groove/frontier reading, the blind-expectation probe's expected resolution, where the negation/candidate actually landed, and any frontier→groove collapse. The precommodification overlay made legible over time. See `reference/frontier-overlay.md`.                                                                                                                                                                                                                             |
| **Loop ledger**            | append-only                                       | One line per inner-loop pass: operator used (Research / Refine / Re-split), what it added, iteration count. Feeds the diminishing-returns read.                                                                                                                                                                                                                                                                                                                                                            |
| **Open gaps**              | living                                            | Current reading of the three signals: what's unknown (coverage), what cross-edges are still forming (structure), whether the hidden question is still moving (framing). Distinct from the cross-round Phase-7 queue.                                                                                                                                                                                                                                                                                       |

**Drift protocol (the scent fix).** At the top of each loop pass the orchestrator (1) reads the control log + the last pass's negation + the user's corrections and writes the **delta**, then (2) **re-reads the whole control log fresh** as grounding before continuing. The second read is the actual scent-fix — re-injection at loop-top counteracts the context-window pressure that caused drift in the first place. Writing without re-reading builds the anchor and then never looks at it.
