# Inner Loop + Dialectic Log + Research Wiki + Gardener — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a maturity-gated inner refinement loop, a per-round control log, and a persistent Karpathy-style research wiki (maintained by a gardener subagent) to the Hegelian dialectic skill, so the tension matures before Phase 5 and the orchestrator never loses the scent.

**Architecture:** Additive markdown skill-authoring. Two new phase/convention reference docs plus a research-contract doc; edits threaded through `SKILL.md` and six phase reference docs. No change to the existing phase/round file convention. Three agent roles: orchestrator (coordinates), gardener (owns the wiki), research subagents (draft to staging).

**Tech Stack:** Markdown. The skill is a set of `.md` files under the repo root (`SKILL.md`) and `reference/`. "Tests" are `grep`/read structural-verification checks. No build, no runtime.

**Source of truth:** `docs/superpowers/specs/2026-07-10-inner-loop-dialectic-log-design.md`. Every task cites the spec component it implements; consult the spec for the substance behind each required element.

---

## Conventions for every task

- **Working directory:** repo root `/Users/kylemathews/programs/hegelian-dialectic-skill`. All paths are relative to it.
- **Editing existing docs:** locate the edit by the quoted **anchor text** (a Markdown heading or an exact existing line), not by line number — line numbers drift. Read the target file first if the anchor is ambiguous.
- **Git:** work directly on `main` (established constraint for this repo). Prefix every git command with `sleep 0.01 &&` (avoids this repo's lock issue). Commit trailer on every commit:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
- **Verification** replaces tests: after each edit, run the given `grep`/`rg` command and confirm the expected output before committing.

**Standard boilerplate (used in Task 6).** The re-entry guard, verbatim:

```
**⛔ Re-entry check:** Did you just run the completion gate for the phase/stage you came from — enumerate its deliverables and attest each ✅/❌? If not, **stop immediately and do that before continuing** (see SKILL.md → The Completion Gate).
```

The completion-gate footer skeleton, verbatim shape:

```
**Completion gate — enumerate & attest before [NEXT STEP] (see SKILL.md → The Completion Gate).** Mark each ✅/❌ with evidence; any ❌ stops you unless the user explicitly waives it:
- [ ] ...
```

---

## File Structure (decomposition)

**New files:**

| File | Responsibility |
|---|---|
| `reference/dialectic-wiki.md` | Wiki + control-log conventions: page types, special files (`index.md`/`log.md`), the gardener role + orchestrator↔gardener protocol, ingest + lint operations, staging directory, the firewall page-type rule, and the per-round control-log schema. |
| `reference/research-subagent-prompt.md` | The standard research-subagent output contract (target, gap-tag, page format, draft-to-staging + return-paths, stance guardrail, decorrelation). |
| `reference/phase4.5-refinement-loop.md` | The inner loop at the 4.9 checkpoint: the four-exit router, the maturity gate (three signals), refine/re-split operators, the firewall spawn-rule, the closure test, the drift protocol, per-pole ignored-evidence. Read just-in-time at 4.9. Carries a re-entry guard + completion gate. |

**Modified files:**

| File | Change |
|---|---|
| `SKILL.md` | Three-role model; gardener in Environment Mapping; file-org conventions (wiki/staging/log); phase-map diagram (insert inner loop); inner-vs-outer naming; Boyd section → maturity gate; misfit→tension in Phase 4 summary + Boyd refs; link the new docs. |
| `reference/phase1-elenctic-interview.md` | Research becomes wiki ingest (via gardener + research-subagent contract); write the frozen anchor to the control log; completion-gate items. |
| `reference/phase4-determinate-negation.md` | Index points to the 4.9 router / `phase4.5` doc; note the hidden-question ledger. |
| `reference/phase4-stage-c-decomposition.md` | Misfit register (4.6.5) writes `tension` pages instead of `misfit_register.md`. |
| `reference/phase4-stage-d-criteria.md` | The 4.9 HARD STOP becomes the four-exit router; write the hidden-question ledger each pass; completion gate updated. |
| `reference/phase5-sublation.md` | Entry condition: Phase 5 begins only on the router's Proceed exit. |
| `reference/phase7-recursion.md` | Inner-vs-outer boundary; wiki compounds across rounds; new round writes a control log with a lineage pointer; preserve the "first pass is calibration" pedagogy. |
| `reference/misfit-patterns-watchlist.md` | Cross-round pattern memory becomes cross-links among `tension` pages. |

---

## PART 1 — Knowledge substrate (wiki + gardener + research contract)

### Task 1: Write `reference/dialectic-wiki.md`

**Implements:** spec Components D (control log), E (wiki), G (gardener + protocol).

**Files:**
- Create: `reference/dialectic-wiki.md`

- [ ] **Step 1: Write the doc.** It must contain these sections, with the substance drawn from spec Components E, D, and G:

  1. `# The Dialectic Wiki` — one-paragraph framing: a persistent, compounding, cross-linked (NOT hierarchical) Karpathy-style LLM Wiki that is the research/knowledge substrate; written only by the gardener; compounds across rounds.
  2. `## Page types` — a list of the five types with their monk-safety, copied faithfully from spec Component E: `concept` (monk-safe), `source`/`entity` (monk-safe), `position` (monk-safe; prior monk essays kept as immutable snapshots), `tension` (orchestrator-only; holds the contradiction + hidden question + negation pointer + cross-links to what it sits between; **replaces `misfit_register.md`**; is the recursion navigation graph), `synthesis` (orchestrator-only).
  3. `## Special files` — `index.md` (catalog + current-focus pointer) and `log.md` (chronological ops record for the whole dialectic; the per-round control log is its per-contradiction specialization).
  4. `## The three roles` — orchestrator (coordinates, passes paths not content), gardener (persistent single writer), research subagents (ephemeral, draft to staging, return paths). Copy the three-role bullets from spec Component G.
  5. `## The gardener` — the design notes from spec Component G: "persistent is an optimization, re-grounds from disk"; staging directory (`<dialectic-dir>/staging/`, cleared after ingest); firewall enforcement (assembles monk-safe briefs by page type); two-level contradiction-spotting (gardener seeds, orchestrator deepens); signal division (gardener owns coverage/"new facts"); honest cost note.
  6. `## Operations` — **Ingest** (gardener reads staged drafts → cleans, places/updates pages, cross-links, seeds `tension` pages, updates `index.md`, appends `log.md`) and **Lint** (fix broken links, merge duplicate pages, prune stale ones). Tag each page with its gap/question + provenance.
  7. `## Orchestrator ↔ gardener protocol` — the request/response messages: (a) "ingest these draft paths" → returns pages created/updated + candidate tensions; (b) "assemble pole A's monk-safe brief + the evidence A walked past" → returns a firewall-clean brief; (c) "record this tension / synthesis / loop-ledger entry"; (d) "report coverage state / open gaps."
  8. `## The per-round control log` — the `round_N_dialectic_log.md` schema table from spec Component D (Anchor / Working question / Hidden-question ledger / Loop ledger / Open gaps) plus the **drift protocol** (write-delta-then-re-read-whole-log-fresh at each loop-pass top).

  This is a convention/reference doc (like `reference/quadrant-diagrams.md`), NOT a phase doc — it does **not** get a re-entry guard or completion gate.

- [ ] **Step 2: Verify structure.**
  Run: `rg -n "^## (Page types|Special files|The three roles|The gardener|Operations|Orchestrator|The per-round control log)" reference/dialectic-wiki.md`
  Expected: 7 heading matches (all sections present).

- [ ] **Step 3: Verify key rules landed.**
  Run: `rg -c "orchestrator-only|monk-safe|staging|re-grounds|current-focus" reference/dialectic-wiki.md`
  Expected: a count ≥ 6 (the load-bearing terms are present).

- [ ] **Step 4: Commit.**
  ```bash
  sleep 0.01 && git add reference/dialectic-wiki.md && git commit -m "Add dialectic-wiki reference: page types, gardener, control log"
  ```

### Task 2: Write `reference/research-subagent-prompt.md`

**Implements:** spec Component G (research-subagent contract).

**Files:**
- Create: `reference/research-subagent-prompt.md`

- [ ] **Step 1: Write the doc.** A `# Research Subagent Prompt Contract` header, a one-line statement that the gardener consumes drafts in this exact format so the contract IS the orchestrator↔research-agent interface, then the six numbered slots from spec Component G verbatim in intent:
  1. **Target** (specific search directive, not "research this topic").
  2. **Gap tag** (the open question this closes, verbatim; stamped on every drafted page).
  3. **Output contract** (write 1–N page-draft files to the staging directory; return only their paths; no prose report, no inline page content).
  4. **Page format** — frontmatter (`title`, `type: concept|source`, `provenance`, `gap-tag`, `date`) + body (one-line summary; key claims each with a citation; a `relates-to` list of candidate cross-links phrased "connects to «X» because …"; an `observed-tensions` list of contradictions noticed but NOT resolved).
  5. **Stance guardrail** (flag contradictions, don't smooth them; don't editorialize toward a synthesis).
  6. **Decorrelation** (blind to each other if parallel; targetable per-pole or per-domain).
  Include a short **copy-paste prompt skeleton** with the six slots as fill-in fields, so the orchestrator can instantiate it directly.

- [ ] **Step 2: Verify.**
  Run: `rg -n "Target|Gap tag|Output contract|Page format|Stance guardrail|Decorrelation" reference/research-subagent-prompt.md`
  Expected: all six slot labels present.
  Run: `rg -c "staging|return only their paths|observed-tensions" reference/research-subagent-prompt.md`
  Expected: ≥ 3.

- [ ] **Step 3: Commit.**
  ```bash
  sleep 0.01 && git add reference/research-subagent-prompt.md && git commit -m "Add research-subagent prompt contract (draft-to-staging)"
  ```

### Task 3: Wire the three-role model + new docs into `SKILL.md`

**Implements:** spec Component G + File Footprint (SKILL.md non-loop parts).

**Files:**
- Modify: `SKILL.md` — the "How It Works: Overview" area, the "File organization" paragraph, and the "Environment Mapping: Claude Code / Task Tool" table.

- [ ] **Step 1: Add the three-role model.** Anchor on the line `You are the **orchestrator**.` (start of the Overview section). Immediately after that paragraph, add a short paragraph naming the three roles and pointing to the new docs:
  > The skill now runs three agent roles: **you (orchestrator)** coordinate and reason; a persistent **gardener** owns the research wiki (see `reference/dialectic-wiki.md`) — you never write the wiki directly, you pass it draft paths and request views; **research subagents** do targeted research and write page drafts to a staging directory (see `reference/research-subagent-prompt.md`). This protects your context: the substantive research material lives in the wiki, not in your window.

- [ ] **Step 2: Add wiki/staging/log to the file-organization section.** Anchor on the heading/line beginning `**File organization:**`. Append a sentence: the dialectic also maintains a persistent research **wiki** (interlinked typed pages + `index.md` + `log.md`, gardener-owned, compounding across rounds), a **staging** directory for research drafts (`<dialectic-dir>/staging/`), and a per-round **control log** (`round_N_dialectic_log.md`) — see `reference/dialectic-wiki.md`. These sit **alongside** the existing `round_N_*.md` files, which are unchanged.

- [ ] **Step 3: Add the gardener to the Environment Mapping table.** Anchor on the table row starting `| Session resumption (Phase 6) |`. Add a new row beneath it:
  ```
  | Persistent gardener | Resume same `claude -p` session across the dialectic | Resumable agent via `resume` + `agentId`; **always able to re-ground from the wiki on disk** if the session is lost or context compacts |
  ```

- [ ] **Step 4: Verify.**
  Run: `rg -n "gardener|research-subagent-prompt.md|dialectic-wiki.md" SKILL.md`
  Expected: ≥ 4 matches spanning the three edits.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add SKILL.md && git commit -m "SKILL.md: introduce three-role model (orchestrator/gardener/research)"
  ```

### Task 4: Phase 1 research → wiki ingest + write the frozen anchor

**Implements:** spec File Footprint (phase1) + Components D (anchor), E (ingest).

**Files:**
- Modify: `reference/phase1-elenctic-interview.md` — sections `1d`, `1e`, `1f`, and the completion gate.

- [ ] **Step 1: Route research through the wiki.** In section `## 1d. Ground the Monks (Domain-Adaptive)`, anchor on the sentence about running "2-3 parallel research subagents". Add a paragraph: research subagents now follow the **research-subagent contract** (`reference/research-subagent-prompt.md`) — they write page drafts to `<dialectic-dir>/staging/` and return paths; the orchestrator hands the paths to the **gardener**, which ingests them into the wiki (`reference/dialectic-wiki.md`). The briefing (1e) is then assembled from wiki pages, not from raw agent prose.

- [ ] **Step 2: Write the frozen anchor.** In section `## 1f. Confirm with the User`, anchor on the line `Get the user's confirmation or correction.` Add: once framing is confirmed, **write the frozen Anchor** to `round_1_dialectic_log.md` — the original felt tension in the user's own words, verbatim, never overwritten (see `reference/dialectic-wiki.md` → control log). This is the fixed point drift is later measured against.

- [ ] **Step 3: Update the completion gate.** In the Phase 1 completion-gate checklist (anchor on `- [ ] Context briefing written to`), add two items:
  ```
  - [ ] Research ingested into the wiki via the gardener (drafts staged, paths handed off, pages created) — or research consciously skipped for a well-known domain (state which)
  - [ ] Frozen Anchor written to `round_1_dialectic_log.md` (original felt tension, verbatim)
  ```

- [ ] **Step 4: Verify.**
  Run: `rg -n "gardener|staging|frozen Anchor|dialectic-wiki.md|research-subagent-prompt.md" reference/phase1-elenctic-interview.md`
  Expected: matches across 1d, 1f, and the completion gate.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add reference/phase1-elenctic-interview.md && git commit -m "Phase 1: research ingests to wiki; write frozen anchor"
  ```

### Task 5: Migrate the misfit register to `tension` pages

**Implements:** spec File Footprint (misfit→tension migration).

**Files:**
- Modify: `reference/phase4-stage-c-decomposition.md` (the 4.6.5 misfit register), `SKILL.md` (Phase 4 summary + Boyd references to the misfit register), `reference/misfit-patterns-watchlist.md`.

- [ ] **Step 1: Redirect the 4.6.5 misfit register.** In `reference/phase4-stage-c-decomposition.md`, find every instruction to write to the per-round misfit file and the persistent `misfit_register.md` (anchor on `misfit_register.md` and on `misfit register`). Replace them so each misfit is written as a `tension` page in the wiki (via the gardener), linked to the `concept`/`position`/`source` pages it sits between, per `reference/dialectic-wiki.md`. Keep the four lenses (briefing residue / synthesis residue / framing genealogy / undecidables) — only the storage target changes.

- [ ] **Step 2: Update SKILL.md references.** In `SKILL.md`, anchor on each `misfit_register.md` mention (Phase 4 summary paragraph and the Boyd "Where Boyd is operationally present" paragraph) and change "writes to a per-round file plus a persistent `misfit_register.md`" to "writes `tension` pages in the wiki (which replace `misfit_register.md`)".

- [ ] **Step 3: Update the watchlist.** In `reference/misfit-patterns-watchlist.md`, add a note at the top that cross-round pattern memory now lives as cross-links among `tension` pages in the wiki (the file remains a curated watchlist of named patterns to check, but the per-dialectic instances are tension pages).

- [ ] **Step 4: Verify no stale writes remain.**
  Run: `rg -n "misfit_register\.md" SKILL.md reference/`
  Expected: remaining mentions are only in the form "replace `misfit_register.md`" / historical references — NO surviving instruction to *write* to it. Read each hit to confirm.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add SKILL.md reference/phase4-stage-c-decomposition.md reference/misfit-patterns-watchlist.md && git commit -m "Migrate misfit register to wiki tension pages"
  ```

---

## PART 2 — The inner loop

### Task 6: Write `reference/phase4.5-refinement-loop.md`

**Implements:** spec Components A (router), B (maturity gate), C (operators + firewall).

**Files:**
- Create: `reference/phase4.5-refinement-loop.md`

- [ ] **Step 1: Write the doc.** Structure:
  1. `# Phase 4.5: The Refinement Loop (the 4.9 router)` heading.
  2. Immediately after the H1, the **re-entry guard** verbatim (see Conventions).
  3. `## The four exits` — the router table from spec Component A (Proceed / Research / Refine / Re-split), plus the design rules: orchestrator diagnoses + recommends, **user decides every pass**; nothing loops or proceeds silently; Research is first-class; the recommendation must include the three signal readings, the diagnosed gap, the recommended exit, and how the next pass would be framed; the user is the only stopping authority (no hard cap; surface a diminishing-returns read).
  4. `## The maturity gate` — spec Component B: hidden-question settledness is the primary fork (read from 4.4, tracked in the control log's hidden-question ledger); the three signals (hidden question / new cross-edges from 4.6 `[fit:]` recombinations / new facts); Proceed only when all three quiet; the anti-over-iteration bias (default Refine over Re-split).
  5. `## Operators + firewall` — spec Component C: Re-split (low risk; re-pole on the new working question **only if it passes the closure test**); Refine (high risk; per-pole asymmetric briefs incl. the evidence each monk walked past; blind); the firewall spawn-rule (gardener assembles the brief; allowed = anchor + closure-passing framing + concept/source/position pages; never = negation / hidden-question ledger / tension / synthesis); the closure test ("can a monk still argue one side at full conviction?").
  6. `## Drift protocol` — write-delta-then-re-read-whole-log-fresh at the top of each pass.
  7. At the end, the **completion gate** footer (see Conventions), before-next-step = "before taking a router exit", with items: signals computed and shown; gap diagnosed; exit recommended with framing; user chose the exit (not the orchestrator — not self-waivable); control log updated (hidden-question + loop ledgers).

- [ ] **Step 2: Verify the guard + gate are present.**
  Run: `rg -c "Re-entry check" reference/phase4.5-refinement-loop.md` → Expected: 1
  Run: `rg -c "Completion gate" reference/phase4.5-refinement-loop.md` → Expected: 1

- [ ] **Step 3: Verify the four exits + firewall.**
  Run: `rg -n "Proceed|Research|Refine|Re-split|closure test|firewall" reference/phase4.5-refinement-loop.md`
  Expected: all four exit names, plus the closure test and firewall.

- [ ] **Step 4: Commit.**
  ```bash
  sleep 0.01 && git add reference/phase4.5-refinement-loop.md && git commit -m "Add Phase 4.5 refinement-loop reference (the 4.9 router)"
  ```

### Task 7: Turn the 4.9 HARD STOP into the router

**Implements:** spec Component A + File Footprint (phase4 index + stage-d).

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (index) and `reference/phase4-stage-d-criteria.md` (the 4.9 checkpoint).

- [ ] **Step 1: Point the index at the router.** In `reference/phase4-determinate-negation.md`, in the stage table row for Stage D (anchor on `phase4-stage-d-criteria.md`), add that Stage D ends by reading `reference/phase4.5-refinement-loop.md` and running the four-exit router rather than proceeding straight to Phase 5.

- [ ] **Step 2: Rewrite the 4.9 exit.** In `reference/phase4-stage-d-criteria.md`, find the 4.9 HARD STOP section (anchor on `HARD STOP`). Change its exit language: after presenting the summary to the user, the orchestrator writes the hidden question to the control log's hidden-question ledger, then **reads `reference/phase4.5-refinement-loop.md` and runs the four-exit router** — Phase 5 happens only on the Proceed exit. Keep the existing "highest-leverage correction point" framing.

- [ ] **Step 3: Update the Stage D completion gate.** Anchor on the Stage D completion-gate checklist. Add:
  ```
  - [ ] Hidden question written to the control log's hidden-question ledger this pass
  - [ ] `reference/phase4.5-refinement-loop.md` read and the four-exit router run (Phase 5 only on the Proceed exit)
  ```

- [ ] **Step 4: Verify.**
  Run: `rg -n "phase4.5-refinement-loop.md|four-exit router|hidden-question ledger" reference/phase4-stage-d-criteria.md reference/phase4-determinate-negation.md`
  Expected: matches in both files.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add reference/phase4-determinate-negation.md reference/phase4-stage-d-criteria.md && git commit -m "Phase 4: 4.9 HARD STOP becomes the four-exit router"
  ```

### Task 8: Gate Phase 5 entry on the Proceed exit

**Implements:** spec File Footprint (phase5).

**Files:**
- Modify: `reference/phase5-sublation.md` — the top of the doc.

- [ ] **Step 1: Add the entry condition.** After the H1 and the existing re-entry guard (anchor on the `Re-entry check` line already in the file), add a sentence: **Entry condition** — Phase 5 begins only when the Phase 4.5 router returned the **Proceed** exit (hidden question settled, no new cross-edges, no new facts). If you arrived here by any other path, stop and run the router (`reference/phase4.5-refinement-loop.md`).

- [ ] **Step 2: Verify.**
  Run: `rg -n "Entry condition|Proceed exit|phase4.5-refinement-loop.md" reference/phase5-sublation.md`
  Expected: the entry-condition sentence present.

- [ ] **Step 3: Commit.**
  ```bash
  sleep 0.01 && git add reference/phase5-sublation.md && git commit -m "Phase 5: gate entry on the router's Proceed exit"
  ```

### Task 9: Distinguish inner vs. outer loop in Phase 7

**Implements:** spec Component F + File Footprint (phase7).

**Files:**
- Modify: `reference/phase7-recursion.md`.

- [ ] **Step 1: Add the inner-vs-outer boundary.** After the H1 + re-entry guard (anchor on the existing `Re-entry check` line), add a short block: the **inner loop** (Phase 4.5) matures *this* contradiction on its frozen anchor before the first synthesis (operators: Research / Refine / Re-split); **Phase 7 (outer loop)** jumps *after* a synthesis to a queued *different* contradiction. Discriminator: **re-split stays on the same frozen anchor; Phase 7 moves to a different queued contradiction.**

- [ ] **Step 2: Wiki compounds + lineage.** Anchor on the `## Running Recursive Rounds` section. Add: the research wiki **compounds across rounds** (it does not reset — Round 2 builds on Round 1's pages); a new round writes a **new control log** (`round_N_dialectic_log.md`) whose Anchor is the chosen contradiction, carrying a **lineage pointer** back to the synthesis it launched from.

- [ ] **Step 3: Preserve the pedagogy.** Confirm the existing "the first round is calibration / each round gets sharper" framing is intact and, where it references rounds, add the parenthetical that the walk deepens as the wiki compounds. (No deletion — additive.)

- [ ] **Step 4: Verify.**
  Run: `rg -n "inner loop|frozen anchor|lineage pointer|compounds across rounds" reference/phase7-recursion.md`
  Expected: the boundary block + wiki/lineage additions present.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add reference/phase7-recursion.md && git commit -m "Phase 7: name inner vs outer loop; wiki compounds; lineage pointer"
  ```

### Task 10: Insert the inner loop into the SKILL.md phase map + Boyd section

**Implements:** spec Components A, B, F + File Footprint (SKILL.md loop parts).

**Files:**
- Modify: `SKILL.md` — the ASCII phase-map diagram, and the Boyd "Theoretical Foundations" reversibility/positioned-to-synthesize text.

- [ ] **Step 1: Insert the loop in the phase map.** In the `How It Works: Overview` ASCII tree, anchor on the `├── Phase 4: Determinate Negation` block and the `├── Phase 5: Palette of Candidates` line. Between them, add a node:
  ```
  ├── Phase 4.5: Refinement Loop (the 4.9 router — you + user)
  │   ├── Maturity gate: hidden-question settledness + new cross-edges + new facts
  │   ├── Four exits: Proceed / Research / Refine / Re-split (orchestrator recommends, user decides)
  │   └── Firewall on monk re-spawn (gardener assembles per-pole briefs)
  ```

- [ ] **Step 2: Name the two loops near the map.** Anchor on the sentence after the ASCII tree (`The user can intervene at any point`). Add a sentence: two loops run — the **inner loop** (Phase 4.5) matures the current contradiction before synthesis; the **outer loop** (Phase 7) recurses to a new contradiction after one. Re-split stays on the anchor; Phase 7 moves to a new contradiction.

- [ ] **Step 3: Point Boyd at the maturity gate.** In the Boyd `### Boyd: Destruction and Creation` foundations text, anchor on the reversibility-check paragraph. Add one sentence: the operational home of "positioned to synthesize" is the Phase 4.5 maturity gate — when the hidden question stops moving and the decomposition stops yielding new cross-edges, the reversibility material has stabilized enough to synthesize.

- [ ] **Step 4: Verify.**
  Run: `rg -n "Phase 4.5|Refinement Loop|inner loop|maturity gate" SKILL.md`
  Expected: matches in the phase map, the two-loops sentence, and the Boyd section.

- [ ] **Step 5: Commit.**
  ```bash
  sleep 0.01 && git add SKILL.md && git commit -m "SKILL.md: insert Phase 4.5 in phase map; name inner/outer loops"
  ```

---

## PART 3 — Final verification

### Task 11: Cross-reference + consistency sweep

**Files:** read-only across `SKILL.md` and `reference/`.

- [ ] **Step 1: All new-doc references resolve.**
  Run: `rg -no "reference/[a-z0-9.-]+\.md" SKILL.md reference/ | sort -u`
  For each referenced path, confirm the file exists (`ls reference/`). Expected: `dialectic-wiki.md`, `research-subagent-prompt.md`, `phase4.5-refinement-loop.md` all exist and are referenced.

- [ ] **Step 2: The router doc has its guard + gate.**
  Run: `rg -c "Re-entry check" reference/phase4.5-refinement-loop.md` → Expected: 1
  Run: `rg -c "Completion gate" reference/phase4.5-refinement-loop.md` → Expected: 1

- [ ] **Step 3: No orphaned misfit-register writes.**
  Run: `rg -n "write.*misfit_register|misfit_register\.md" SKILL.md reference/`
  Read each hit; confirm none still *instruct writing* to `misfit_register.md` (only "replaces" / historical mentions remain).

- [ ] **Step 4: Firewall page-type invariant is stated wherever monks are re-spawned.**
  Run: `rg -n "firewall|monk-safe|concept.*source.*position" reference/phase4.5-refinement-loop.md reference/dialectic-wiki.md`
  Expected: the allowed/never page-type rule appears in both.

- [ ] **Step 5: Final commit (if the sweep changed anything).**
  ```bash
  sleep 0.01 && git add -A && git commit -m "Cross-reference + consistency sweep for inner-loop feature"
  ```
  (If nothing changed, skip.)

---

## Self-Review (author's check against the spec)

- **Spec coverage:** Component A → Tasks 6,7,10. Component B → Tasks 6,7. Component C → Tasks 6,7. Component D → Tasks 1,4,7. Component E → Tasks 1,4. Component F → Tasks 9,10. Component G → Tasks 1,2,3,4. Misfit→tension migration → Task 5. File-footprint entries all mapped. No uncovered spec section.
- **Placeholder scan:** no "TBD"/"handle edge cases"/"similar to Task N"; each task cites its spec component and gives exact anchors + verification commands. The new-doc tasks specify required sections rather than reproducing full prose (the substance lives in the cited spec components — appropriate for prose authoring).
- **Consistency:** doc names are stable across tasks (`dialectic-wiki.md`, `research-subagent-prompt.md`, `phase4.5-refinement-loop.md`); "four exits" (Proceed/Research/Refine/Re-split), "three signals" (hidden question/new cross-edges/new facts), and "firewall page-type rule" are named identically everywhere.
