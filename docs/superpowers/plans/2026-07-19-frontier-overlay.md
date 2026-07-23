# Frontier Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a low-precision **diagnostic overlay** to the dialectic that reads each move as "groove" (precommodified/standard) vs. "frontier" (novel/hard), flags frontier→groove **collapses**, and surfaces the reading at the negation (companion block), the palette (per-candidate flag), and across passes (a control-log frontier-ledger) — without ever steering the dialectic.

**Architecture:** One new reference doc (`reference/frontier-overlay.md`) is the contract. A **blind-expectation probe** (ephemeral subagent, sees only working-question + poles) is the shear stroke; the belief-free orchestrator compares its expected resolution against the actual negation/palette. The maturity gate's three existing signals are re-labeled as the free layer. Edits to Phase 4 Stage D, Phase 5, the refinement-loop router, the wiki control-log schema, and SKILL.md wire it in and enforce it via the existing completion-gate machinery.

**Tech Stack:** Markdown skill-authoring. "Tests" are `grep`/`rg` structural verification checks, not unit tests. Working directly on `main`. Commits per task, prefixed `sleep 0.01 &&`, trailer `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

**Spec:** `docs/superpowers/specs/2026-07-19-frontier-overlay-precommodification-design.md`

---

## File Structure

- **Create** `reference/frontier-overlay.md` — the contract: oobleck intuition, the two layers, the blind-expectation probe (contract + copy-paste skeleton), the collapse detector, the three surfaces, the frontier-ledger schema, the five guardrails. Everything else points here.
- **Modify** `reference/dialectic-wiki.md` — add the `Frontier-ledger` row to the per-round control-log table; note the probe as orchestrator-facing/ephemeral (firewall).
- **Modify** `reference/phase4-stage-d-criteria.md` — at 4.9, before presenting: spawn the probe, write the companion block appended to the summary, write the frontier-ledger line; add gate items.
- **Modify** `reference/phase4-determinate-negation.md` — Stage D row + framing mention the overlay.
- **Modify** `reference/phase5-sublation.md` — one-line groove/frontier flag per candidate at 5.7; gate item.
- **Modify** `reference/refinement-loop.md` — router writes the frontier-ledger line each pass; recommendation may cite the reading/collapse as diagnostic evidence (never acts); drift-protocol re-read includes it; gate item.
- **Modify** `SKILL.md` — phase-map node, Phase 4 + Phase 5 summaries, Environment Mapping row, a short "descriptive not prescriptive / overlay not operator" framing.

---

### Task 1: Create the contract doc `reference/frontier-overlay.md`

**Files:**
- Create: `reference/frontier-overlay.md`

- [ ] **Step 1: Write the file** with exactly this content:

````markdown
# The Frontier Overlay (precommodification diagnostic)

A low-precision **diagnostic overlay**. It reads how far each move sits inside vs. outside the latent space — **groove** (precommodified / standard) vs. **frontier** (novel / hard) — and flags the moment a reaching, frontier-ish tension gets **redirected back to known territory**. It is a **map the user reads and steers from; it never steers the dialectic.** This doc is the contract; Phase 4 Stage D, Phase 5, and the refinement-loop router all point here.

Origin: Venkatesh Rao, "Zero Interest Rate Ideation" (precommodification) + "Can the Social Oobleck Dance?". The overlay instruments the "confirms-priors" tendency this skill already fights — now with a reading reported back to the user.

## The oobleck intuition (the mental model — read this first)

Oobleck (cornstarch + water) is **shear-thickening**: push it gently and it flows like water; hit it hard and sudden and it goes rigid. The precommodified semantic medium is oobleck. That gives the whole overlay one physical model:

- **The overlay is a rheometer, not a novelty-scorer.** It reports whether the medium *thickened or flowed* under this pass's forcing — not a quality grade.
- **Groove = flow.** The medium gives way; the move is fluent and expected; you're in the worn channel (Rao's "fluent elaboration = precommodified").
- **Frontier = thickening under shear.** The medium pushes back; the move resists the obvious; you've hit something real (Rao's "the model struggles to build on it").
- **The blind-expectation probe is the shear stroke.** It is a sudden hard hit — "here is the obvious expected answer, right now." Its purpose is not to predict correctly; it is to *strike and see if anything pushes back.*
- **Collapse = flowed back to liquid despite the shear.** The monks applied force (reached), but the negation let the medium relax back to water and drain into the groove. The dance failed.

Novelty lives in the *temporality* — the divergence→convergence rhythm — not in fresh data. That rhythm is the dialectic's existing engine (blind monk divergence → convergent negation → refine/re-split → repeat; wiki + tension-queue as the "resonant cavity"). The overlay just instruments it: per pass, did the forcing make the oobleck dance, or just stir water?

## What it reads — two layers

### Free layer (always on, ~zero cost)

Re-interpret the maturity gate's three existing signals (`reference/refinement-loop.md`) as a groove/frontier reading:

- Fast saturation / no new cross-edges / no new facts → **groove** (a deep, well-worn well).
- Persistent novelty (new `[fit:]` cross-edges still appearing, hidden question still moving) → **frontier** (underdetermined; the jagged edge).

The router already computes these; this layer only *re-labels* them. Per-tension granularity.

### Probe layer — the blind-expectation probe

An **ephemeral subagent that sees only the setup** — the current working question and the poles — and predicts the resolution(s) it would expect. Fired once per refinement pass (serves both the negation and the palette, since the setup is constant within a pass).

- **Input:** the working question + the two (or more) committed poles, verbatim.
- **Blind to:** monk essays, the determinate negation, donor research, the palette, the control log. (This blindness is the whole point — a probe that has seen the dialectic's work can't measure whether the work was expected.)
- **Task:** "Given this question and these committed positions, what resolution(s) would you expect a competent analysis to land on? Give the 1–3 most likely." Neutral; no access to the actual work.
- **Return:** the 1–3 expected resolutions, concise.
- **Comparison:** the belief-free **orchestrator** (which already holds the negation/palette and the probe's return in context — no extra judge agent) reads each actual negation move / palette candidate against the expected set. **Match → groove. Divergence → frontier.**

**Firewall.** The probe runs *after* the monks and its output goes **only to the orchestrator's frontier reading** — never into a monk brief. It is orchestrator-facing like `donor` / `tension` / `synthesis` material, and ephemeral (recorded in the reading + frontier-ledger, not a wiki page).

**Copy-paste skeleton** (instantiate one per pass, fill the brackets):

```
You are a blind-expectation probe for a dialectic. You will see ONLY a question and
two (or more) committed positions. You have NOT seen any analysis of them.

WORKING QUESTION: [verbatim working question]
POLES:
- [pole A, one line]
- [pole B, one line]
- [pole C, if any]

TASK: Given this question and these positions, what resolution(s) would you expect a
competent, thoughtful analysis to land on? Give the 1-3 MOST LIKELY resolutions, each
in 1-2 sentences. Do not hedge into a long list — name the obvious expected landings.

RETURN: only the 1-3 expected resolutions. No preamble.
```

## The collapse detector (the highest-value output)

The redirect-to-known-territory has a signature:

- **Reach present:** the monks reached — hard-won / heavily-qualified / donor-dependent argumentation, or new `[fit:]` cross-edges appeared in the 4.6 decomposition — **AND**
- **Groove landing:** the determinate negation's result, or a palette candidate, matches the blind-expected resolution.

When both hold, flag it: **"⚠ reached on X — negation/candidate pulled back to the groove Y."**

"The monks reached" is a **qualitative orchestrator judgment** (was the argument fluent and complete, or did it strain and invent?), an honest flag, not a metric. On a standard run there is no reach, so no collapse flag appears — the overlay stays quiet.

## Where it surfaces

### 1. Negation — a companion block (primary)

When the orchestrator presents the determinate negation (Phase 4, 4.9), it appends a **short frontier-reading companion block** *after* the negation summary. Keep the negation text itself clean — do not re-tag it inline. 3–4 lines:

```
**Frontier reading** (diagnostic — descriptive, not a recommendation)
- Terrain: <groove | frontier | mixed> — <one clause, from the free layer>
- Expected (blind probe): <the 1-3 expected resolutions, compressed to one line>
- Actual landing: <where the negation actually went> → <matched = groove | diverged = frontier>
- Collapse: <none | ⚠ reached on X, negation pulled back to groove Y>
```

### 2. Palette — one-line flag per candidate (secondary)

At Phase 5 (5.7), each drafted S/J/G/F/U candidate gets a one-line groove/frontier flag from the same blind expectation, e.g. `[frontier — diverges from the expected "just balance A and B"]`. Lets the user scan which candidate is off the worn surface. (S often reads groove; U/F often frontier — the flag makes it visible per-run rather than assumed. Do not treat the flag as a ranking.)

### 3. Control log — a frontier-ledger (cross-pass tracker)

One line per refinement pass in `round_N_dialectic_log.md`, so redirect *over time* is visible. Schema:

```
frontier-ledger:
- pass N: reading=<groove|frontier|mixed>; expected=<blind expectation, one line>; actual=<where negation/candidate landed>; collapse=<none | "reached on X, pulled to groove Y">
```

## The five guardrails

1. **Descriptive, never prescriptive.** Report terrain; the user decides whether they meant to be on it. Never nag "this is precommodified, go harder." On a standard run, quietly confirm "groove — as expected" and add zero friction.
2. **An ambiguous flag, not a confident score.** Divergence can mean "frontier" *or* just "vague/underspecified"; a match can mean "precommodified" *or* just "clear and simple." Say *"look here,"* not *"this is novel."*
3. **An aid to a good detector.** This is coverage and attention-direction, not a replacement for the user's own judgment. Low precision and false positives are fine — the user filters them at a glance.
4. **Quiet on standard runs.** The collapse flag is silent when there's no frontier reach to collapse *from*.
5. **Overlay feeds recommendation, never action.** The reading may inform the router's *recommendation* to the user; nothing loops or proceeds on the reading alone. The user is the only steering authority.
````

- [ ] **Step 2: Verify structure.**

Run: `rg -n "oobleck|blind-expectation probe|collapse detector|frontier-ledger|Descriptive, never prescriptive" reference/frontier-overlay.md`
Expected: matches for the oobleck heading, the probe section, the collapse detector, the ledger schema, and guardrail 1.

Run: `rg -c "shear|rheometer|groove|frontier" reference/frontier-overlay.md`
Expected: a nonzero count (the oobleck vocabulary is present).

- [ ] **Step 3: Commit.**

```bash
sleep 0.01 && git add reference/frontier-overlay.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: add the contract doc (oobleck intuition, blind-expectation probe, collapse detector, three surfaces, guardrails)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Add the frontier-ledger to the control-log schema

**Files:**
- Modify: `reference/dialectic-wiki.md` (the per-round control-log table, ~line 101–103)

- [ ] **Step 1: Add the `Frontier-ledger` row.** After the `Hidden-question ledger` row and before the `Loop ledger` row, insert:

```
| **Frontier-ledger** | append-only | One line per pass: the groove/frontier reading, the blind-expectation probe's expected resolution, where the negation/candidate actually landed, and any frontier→groove collapse. The precommodification overlay made legible over time. See `reference/frontier-overlay.md`. |
```

- [ ] **Step 2: Note the probe in the roles/firewall material.** In the `## The three roles` or `## The gardener` area (whichever names the orchestrator-facing page types), add one sentence:

```
The **blind-expectation probe** (`reference/frontier-overlay.md`) is orchestrator-facing and ephemeral like `donor`/`tension`/`synthesis`: it runs after the monks, feeds only the orchestrator's frontier reading, and is **never** placed in a monk brief. It is not a wiki page — its output lives in the frontier-ledger.
```

- [ ] **Step 3: Verify.**

Run: `rg -n "Frontier-ledger|blind-expectation probe" reference/dialectic-wiki.md`
Expected: the new table row and the firewall sentence both match.

- [ ] **Step 4: Commit.**

```bash
sleep 0.01 && git add reference/dialectic-wiki.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: add frontier-ledger to the control-log schema; note the probe as orchestrator-facing/ephemeral

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Wire the probe + companion block into Phase 4 Stage D

**Files:**
- Modify: `reference/phase4-stage-d-criteria.md` (the 4.9 section + the completion gate)

- [ ] **Step 1: Add the probe + companion-block instruction** to the 4.9 section, immediately before the `Then ask:` blockquote (i.e., after the donor on-ramp paragraph, so the frontier reading is prepared as part of the summary the user reads). Insert:

```
**Attach the frontier reading (the overlay).** Before presenting, run the Frontier Overlay for this pass (`reference/frontier-overlay.md`):
1. Spawn the **blind-expectation probe** — a fresh subagent that sees ONLY the working question and the poles (blind to the essays, this negation, the donors). Use the skeleton in `reference/frontier-overlay.md`. It returns the 1–3 resolutions it *expects*.
2. Compare its expected resolutions against where your determinate negation actually landed: match → groove, divergence → frontier. Add the free-layer reading (are the maturity signals saturating = groove, or still producing new cross-edges/facts = frontier).
3. Check for a **collapse**: did the monks *reach* (strained / donor-dependent argument, or new `[fit:]` cross-edges) but the negation land on the blind-expected groove? If so, flag it.
4. Append the **companion block** *after* your negation summary (do not re-tag the negation inline). It is diagnostic and descriptive — not a recommendation, and it must not tell the user what to do:

    **Frontier reading** (diagnostic — descriptive, not a recommendation)
    - Terrain: <groove | frontier | mixed> — <one clause>
    - Expected (blind probe): <expected resolutions, one line>
    - Actual landing: <where the negation went> → <matched = groove | diverged = frontier>
    - Collapse: <none | ⚠ reached on X, negation pulled back to groove Y>

On a standard run this will read "groove — as expected" with no collapse; that is correct and should add no friction.
```

- [ ] **Step 2: Add the frontier-ledger write** to the routing paragraph. In the `After the user responds, route` paragraph, extend the sentence that writes the hidden-question ledger so it also writes the frontier-ledger:

Change `Write this pass's hidden question to the control log's **hidden-question ledger**, then read` to:

```
Write this pass's hidden question to the control log's **hidden-question ledger** and this pass's frontier reading to the **frontier-ledger** (`reference/frontier-overlay.md`), then read
```

- [ ] **Step 3: Add two completion-gate items.** In the Stage D completion gate list, after the `Hidden question written to the control log's hidden-question ledger this pass` item, add:

```
- [ ] Frontier Overlay run: blind-expectation probe spawned (blind to essays/negation/donors), companion block appended to the negation summary, collapse checked
- [ ] Frontier-ledger line written this pass (reading / expected / actual / collapse)
```

- [ ] **Step 4: Verify.**

Run: `rg -n "Frontier reading|blind-expectation probe|frontier-ledger|Collapse:" reference/phase4-stage-d-criteria.md`
Expected: matches in the 4.9 body, the routing paragraph, and both new gate items.

- [ ] **Step 5: Commit.**

```bash
sleep 0.01 && git add reference/phase4-stage-d-criteria.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: spawn the blind-expectation probe + append the companion block at 4.9; write the frontier-ledger; gate items

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Point Phase 4 index at the overlay

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (the stage table + framing)

- [ ] **Step 1: Extend the Stage D row.** In the stage table, change the Stage D "The move" cell from:

`Sublation criteria + HARD STOP + the four-exit refinement-loop router (`reference/refinement-loop.md`)`

to:

`Sublation criteria + HARD STOP + the frontier reading (`reference/frontier-overlay.md`) + the four-exit refinement-loop router (`reference/refinement-loop.md`)`

- [ ] **Step 2: Verify.**

Run: `rg -n "frontier-overlay" reference/phase4-determinate-negation.md`
Expected: one match in the Stage D row.

- [ ] **Step 3: Commit.**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: point the Phase 4 stage index at the frontier reading in Stage D

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Add per-candidate palette flags in Phase 5

**Files:**
- Modify: `reference/phase5-sublation.md` (5.7 present + completion gate)

- [ ] **Step 1: Add the flag instruction** to 5.7. In `## 5.7 Save and Present the Palette`, inside the "For each candidate that was drafted, give:" list, add a bullet after "The **new contradiction** the candidate generates":

```
- A one-line **frontier flag** (`reference/frontier-overlay.md`): read this candidate against the pass's blind-expectation probe — `[groove — matches the expected "…"]` or `[frontier — diverges from the expected "…"]`. This is a descriptive scan aid, **not a ranking** — do not order or recommend candidates by it. (Reuse the same blind expectation from 4.9; the setup is unchanged within a pass. If the working question changed since 4.9, re-run the probe.)
```

- [ ] **Step 2: Add a completion-gate item.** In the 5.7 completion gate, after the `Candidates ingested by the gardener as `synthesis` pages` item, add:

```
- [ ] Each candidate carries a one-line frontier flag (groove/frontier vs. the blind-expected resolution); flags are descriptive, not a ranking
```

- [ ] **Step 3: Verify.**

Run: `rg -n "frontier flag|frontier-overlay|not a ranking" reference/phase5-sublation.md`
Expected: matches in the 5.7 presentation list and the gate item.

- [ ] **Step 4: Commit.**

```bash
sleep 0.01 && git add reference/phase5-sublation.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: one-line groove/frontier flag per palette candidate (descriptive, not a ranking)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Wire the frontier-ledger + reading into the refinement-loop router

**Files:**
- Modify: `reference/refinement-loop.md` (drift protocol, router recommendation, completion gate)

- [ ] **Step 1: Add the reading to the router's recommendation.** In `## The four exits`, after the paragraph "**Your recommendation to the user must include:** …", add a sentence:

```
Include the pass's **frontier reading** (`reference/frontier-overlay.md`) as diagnostic evidence — especially a **collapse** (the monks reached but the negation drained to a groove), which is a strong signal that the tension is *not* ready to synthesize even if the other signals are quiet. This informs your recommendation only; it never decides the exit — the user does. (A frontier reading of "groove" is not by itself a reason to keep looping: the user may want the standard answer.)
```

- [ ] **Step 2: Add the frontier-ledger to the drift protocol.** In `## Drift protocol`, step 1, change `write the **delta** (what changed: working question, hidden-question ledger line, loop-ledger line, open gaps)` to:

```
write the **delta** (what changed: working question, hidden-question ledger line, frontier-ledger line, loop-ledger line, open gaps)
```

- [ ] **Step 3: Add a completion-gate item.** In the router completion gate, in the "Control log updated this pass" item, change it to also name the frontier-ledger:

Change `Control log updated this pass: hidden-question ledger line + loop-ledger line + open gaps` to:

```
Control log updated this pass: hidden-question ledger line + frontier-ledger line + loop-ledger line + open gaps
```

- [ ] **Step 4: Verify.**

Run: `rg -n "frontier reading|frontier-ledger|frontier-overlay|collapse" reference/refinement-loop.md`
Expected: matches in the recommendation paragraph, the drift protocol, and the gate item.

- [ ] **Step 5: Commit.**

```bash
sleep 0.01 && git add reference/refinement-loop.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: router cites the frontier reading/collapse as diagnostic evidence; frontier-ledger in drift protocol + gate

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Surface the overlay in SKILL.md

**Files:**
- Modify: `SKILL.md` (phase map ~line 82; Phase 4 summary ~line 144; Phase 5 summary ~line 149; Environment Mapping table ~line 260)

- [ ] **Step 1: Add a phase-map node.** In the ASCII phase map, on the `Refinement Loop — the 4.9 router` line's block, add a child line under the negation/router area:

```
│   └── Frontier reading — groove/frontier + collapse flag (diagnostic overlay, descriptive not prescriptive)
```

(Place it adjacent to the 4.9 router node so it reads as part of that checkpoint. Match the surrounding box-drawing characters exactly.)

- [ ] **Step 2: Add a sentence to the Phase 4 summary.** At the end of the Phase 4 paragraph (line ~144), after the HARD STOP sentences, add:

```
The **Frontier Overlay** (`reference/frontier-overlay.md`) attaches a short *frontier reading* to the negation — a blind-expectation probe (sees only the question + poles) predicts the expected resolution, and the orchestrator marks the negation groove (flowed to the expected answer) or frontier (thickened / resisted it), flagging any frontier→groove **collapse**. It is a diagnostic map the user reads, never a steer.
```

- [ ] **Step 3: Add a clause to the Phase 5 summary.** At the end of the Phase 5 paragraph (line ~149), add:

```
Each candidate also carries a one-line **frontier flag** (groove vs. frontier against the blind-expected resolution) — a scan aid, not a ranking.
```

- [ ] **Step 4: Add an Environment Mapping row.** In the Environment Mapping table, add a row for the probe (match the table's column shape):

```
| Blind-expectation probe | Ephemeral subagent, sees only working-question + poles; returns the expected resolution for the frontier reading (`reference/frontier-overlay.md`). Blind to essays/negation/donors; orchestrator-facing. |
```

- [ ] **Step 5: Verify.**

Run: `rg -n "Frontier Overlay|frontier reading|frontier flag|Blind-expectation probe" SKILL.md`
Expected: matches in the phase map, Phase 4 summary, Phase 5 summary, and the Environment Mapping row.

Run: `rg -n "frontier-overlay" SKILL.md reference/*.md`
Expected: cross-references present in SKILL.md, phase4-determinate-negation.md, phase4-stage-d-criteria.md, phase5-sublation.md, refinement-loop.md, dialectic-wiki.md (all pointing at the contract doc).

- [ ] **Step 6: Commit.**

```bash
sleep 0.01 && git add SKILL.md && git commit -m "$(cat <<'EOF'
Frontier Overlay: surface in SKILL.md — phase map, Phase 4/5 summaries, Environment Mapping row

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

- **Spec coverage:** oobleck intuition (Task 1) ✓; two layers / probe contract (Task 1) ✓; collapse detector (Tasks 1, 3) ✓; negation companion block (Task 3) ✓; palette flags (Task 5) ✓; frontier-ledger schema + control log (Tasks 1, 2) ✓; router recommendation-not-action (Task 6) ✓; firewall (Tasks 1, 2) ✓; five guardrails (Task 1) ✓; SKILL.md surfacing (Task 7) ✓; Phase 4 index pointer (Task 4) ✓. No new wiki page type (correctly absent). Every spec "Files touched" entry has a task.
- **Placeholder scan:** none — the new doc's full content, every insertion string, and every verification command are concrete.
- **Consistency:** "descriptive not prescriptive / not a ranking / recommendation-not-action" wording is repeated verbatim across the probe doc, Phase 5 flag, and the router (guardrails 1 and 5). The probe's firewall treatment ("orchestrator-facing like donor/tension/synthesis, never in a monk brief, ephemeral") is stated identically in Task 1 and Task 2. The frontier-ledger schema in Task 1 matches the control-log row in Task 2 and the writes in Tasks 3 and 6. One blind expectation per pass is reused across 4.9 (Task 3) and the palette (Task 5), consistent with the spec.
- **Ambiguity:** "the monks reached" is explicitly a qualitative orchestrator judgment in Task 1, consistent with guardrail 2 — not left implicit.
