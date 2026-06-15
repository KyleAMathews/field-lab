# Boyd Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the dialectic skill's Boyd treatment (deeper multi-domain sea of anarchy, operational Heisenberg, three induction passes, genuine destruction, repair-loop reversibility) and harden synthesis against diversity-loss (loss audit + per-claim calibration).

**Architecture:** Surgical, in-place edits to `reference/phase4-determinate-negation.md` and `reference/phase5-sublation.md`, plus cross-reference updates in `SKILL.md`. No phase renumbering. One new subsection (`4.6.6`). Each task is a single anchored edit + a verification read/grep + a commit.

**Tech Stack:** Markdown instructional prose. "Tests" are `grep`/read-through assertions, not unit tests — these are skill docs, not code. Match the existing terse, citation-heavy voice in every edit.

**Spec:** `docs/superpowers/specs/2026-06-15-boyd-overhaul-design.md`

**Edit-collision note:** Tasks 1–6 all touch `phase4-determinate-negation.md` and are ordered **top-to-bottom by file position** so anchors don't move under each other. Execute in order. If a later task's `old_string` fails to match, re-read the section — an earlier task changed it.

---

### Task 1: Rework 4.5b into donor recruitment (#1)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (section `### 4.5b Random Domain Injection`, ~lines 94–111)

- [ ] **Step 1: Replace the 4.5b section**

Replace the entire current `### 4.5b Random Domain Injection` block (from the heading through the end of its `**Why this works:**` paragraph) with:

```markdown
### 4.5b Donor Recruitment for the Sea of Anarchy

Boyd's snowmobile is built from four shattered domains (skis, outboard motor, handlebars, treads), each chosen for the *operation* it contributes. Two monk-positions plus one skimmed article is too thin a sea. This step **recruits donor domains** that get decomposed alongside the monks in 4.6 at equal depth — not garnished on afterward. Recruit from two streams:

**Random donors (novelty / anti-habit).** The orchestrator picking a "random" domain filters through its own conceptual habits. Wikipedia's randomness is genuinely external. **Use curl (via bash)** — WebFetch/fetch tools return 403 on Wikipedia:

```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=50&format=json"
```

To get extracts for promising ones:
```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=ARTICLE_TITLE&prop=extracts&exintro=true&explaintext=true&format=json"
```

Scan titles, fetch extracts for the ones maximally distant from the dialectic's domain with enough conceptual density (not stubs). Typically 5–8 of 50 have substance.

**Functional donors (operation-targeted).** For each determinate-negation "missing thing" from 4.3, recruit one domain that takes that operation or capacity *seriously on its own terms*. If Monk A's failure reveals a missing capacity for "repair-in-place," recruit a domain where that is central (wound healing, software hot-patching, coral-reef recovery). This is the snowmobile logic — donors chosen for the function they contribute. (The old "epistemological diversity check" is one special case: recruiting a domain that takes a resists-analysis claim seriously.)

**Pool size:** the N monks **+ ~3–5 donors**, weighted toward functional donors with 1–2 random donors for anti-habit novelty. Each donor is a first-class domain entering 4.6's decomposition at the **same depth as the monk positions** — not a 2–3 paragraph isomorphism garnish. List the donors in the 4.6 domain manifest. The actual isomorphism-finding moves to 4.6 step 3, where donors are already decomposed as peers.

**Why this works:** Boyd's cross-domain step made mandatory *and* multi-domain. Domain distance correlates with novelty; functional targeting correlates with relevance — you want both. Within-domain recombination cannot produce new vocabulary; a deep, functionally-targeted sea can.
```

- [ ] **Step 2: Verify**

Run: `grep -n "Donor Recruitment\|Functional donors\|Pool size" reference/phase4-determinate-negation.md`
Expected: three matches. Then run `grep -n "force isomorphisms" reference/phase4-determinate-negation.md` — expected: NO match (the forcing moved to 4.6 step 3).

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "Rework 4.5b into multi-domain donor recruitment (Boyd #1)"
```

---

### Task 2: Add Heisenberg observer-perturbs check at 4.6 opening (#2a)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (top of `## 4.6 Boydian Decomposition`, ~line 121)

- [ ] **Step 1: Insert the check**

Find the paragraph beginning `**Now shatter both positions — AND the lateral material from 4.5 — into their atomic parts.**` and insert immediately AFTER it (before the numbered list `1. **Identify the generic space**`):

```markdown
**Heisenberg check (observer perturbs observed).** The act of analysis bends the positions toward synthesis — you start reading each monk as already half-reconciled with the other. Before shattering, verify you are decomposing what each monk *actually committed to* (its testimony in the essay), not a pre-smoothed version your analysis has nudged toward the middle. This is Boyd's second pillar made operational: observation disturbs the observed.
```

- [ ] **Step 2: Verify**

Run: `grep -n "Heisenberg check (observer perturbs observed)" reference/phase4-determinate-negation.md`
Expected: one match, located between the "Now shatter" paragraph and "Identify the generic space".

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "Operationalize Heisenberg observer-perturbs check in 4.6 (Boyd #2a)"
```

---

### Task 3: Rewrite 4.6 step 2 — manifest + calibration + anti-tidiness (#1, #7, #4)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (`## 4.6` numbered step 2, ~line 125)

- [ ] **Step 1: Replace step 2**

Replace the current step `2. **List the atomic components** ...` (the single paragraph ending `This is Boyd's "sea of anarchy."`) with:

```markdown
2. **Construct the sea of anarchy.** First write a **domain manifest** — an explicit list of every domain in the pool as peers: `[Monk A, Monk B, (Monk C…), donor1, donor2, donor3…]` (donors recruited in 4.5b). Every entry on the manifest gets decomposed to the **same depth** — this is the guard against the monk-primary habit of shattering the essays thoroughly and skimming the donors. Then **list the atomic components** of every domain on the manifest — claims, mechanisms, evidence, assumptions, metaphors, principles, operations — stripped of which monk or donor said them.

   **Tag each part with a calibration estimate.** Independent of how confidently the monk asserted it: is this part well-supported (cite-backable, mechanistically sound) or a rhetorical reach? Mark each `[solid]` / `[plausible]` / `[reach]`. The monks argue at full conviction by design; calibration is *per-part*, and the synthesis weights by it (Phase 5), not by rhetorical force.

   **Anti-tidiness check (genuine destruction).** The result must be a genuinely *unstructured* collection — Boyd's "sea of anarchy." If your parts already sit in neat thematic groups, or are organized by which domain they came from, you have smuggled in a structure and the destructive step has failed. A clean taxonomy is itself an imported frame. Scramble it: provenance forgotten, no pre-categorization.
```

- [ ] **Step 2: Verify**

Run: `grep -n "domain manifest\|calibration estimate\|Anti-tidiness check" reference/phase4-determinate-negation.md`
Expected: three matches, all inside the 4.6 numbered list.

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "4.6 step 2: domain manifest + per-part calibration + anti-tidiness (Boyd #1/#7/#4)"
```

---

### Task 4: Split 4.6 step 3 into qualities/attributes/operations passes (#3)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (`## 4.6` numbered step 3, ~line 126)

- [ ] **Step 1: Replace step 3**

Replace the current step `3. **Find common qualities, attributes, or operations** (Boyd's exact phrase) among parts ...` with:

```markdown
3. **Find common qualities, attributes, *or operations* (Boyd's exact phrase) — as three explicit passes.** Boyd names three distinct search targets; run each, don't collapse them:
   - **Qualities** — shared static properties (both are fragile; both self-reinforce; both decay without input).
   - **Attributes** — shared relational or contextual features (both depend on a boundary; both presuppose an observer; both are scale-sensitive).
   - **Operations** — shared *functions* / dynamics / what the part *does* (both propagate; both gate flow; both convert one form into another). **This is the highest-yield pass and the one most often skipped** — the snowmobile is an operations recombination (gliding + propulsion + steering), not an appearance recombination. Run it explicitly even when qualities/attributes already produced hits.

   The highest-value connections are typically between donor material and monk material. This is where the isomorphism-forcing happens — the donors are already decomposed as peers (from 4.5b + the manifest), so you are connecting liberated parts, not bolting a domain on.
```

- [ ] **Step 2: Verify**

Run: `grep -n "three explicit passes\|highest-yield pass" reference/phase4-determinate-negation.md`
Expected: two matches.

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "4.6 step 3: split induction into qualities/attributes/operations passes (Boyd #3)"
```

---

### Task 5: Fold donor concept into 4.6 steps 4–5 (#1)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (`## 4.6` numbered steps 4 and 5, ~lines 127–128)

- [ ] **Step 1: Replace step 4**

Replace the current step `4. **Ask: what material from adjacent domains** might connect ...` with:

```markdown
4. **Recombine — not in the same arrangement.** Build connections among the liberated parts. Boyd is explicit: the result must NOT use the parts in the same arrangement as any original domain — if you've merely reassembled one monk's structure with different vocabulary, you haven't created anything. (Donors are recruited up front in 4.5b; if the decomposition reveals a *missing* operation that no donor on the manifest covers, recruit one more functional donor now and decompose it to equal depth before proceeding.)
```

- [ ] **Step 2: Replace step 5**

Replace the current step `5. **Epistemological diversity check:** ...` with:

```markdown
5. **Epistemological diversity verification.** If a monk claims something *resists* analytical/propositional treatment (love, wisdom, quality of attention, aesthetic judgment, faith, embodied knowledge), confirm the manifest includes at least one functional donor that takes that claim seriously *on its own terms* — virtue ethics, contemplative traditions, care ethics, aesthetic philosophy, phenomenology. If every donor is itself analytical, the synthesis will dissolve the higher-order claim into lower-order terms (the level-reduction failure). If missing, recruit one now and decompose it.
```

- [ ] **Step 3: Verify**

Run: `grep -n "Recombine — not in the same arrangement\|Epistemological diversity verification" reference/phase4-determinate-negation.md`
Expected: two matches.

- [ ] **Step 4: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "4.6 steps 4-5: fold adjacent-domain/epistemic-diversity into donor concept (Boyd #1)"
```

---

### Task 6: Add 4.6.6 loss audit + surface it at the 4.9 checkpoint (#6)

**Files:**
- Modify: `reference/phase4-determinate-negation.md` (insert new `## 4.6.6` after `## 4.6.5` ends and before `## 4.7 Sublation Criteria`; edit `## 4.9` presentation block)

- [ ] **Step 1: Insert the 4.6.6 section**

Immediately BEFORE the line `## 4.7 Sublation Criteria`, insert:

```markdown
## 4.6.6 Loss Audit — Single-Monk High-Value Ideas

The misfit register (4.6.5) captures frame-level *friction* the synthesis will leave un-resolved. This pass captures the opposite failure: high-value *content* the synthesis will smooth away. Empirically, blending multiple model outputs drops most good ideas that appeared in only *one* output — the "hidden profile" problem (Stasser & Titus): groups over-sample shared information and lose what only one member held. The palette (Phase 5) is a partial guard; this pass makes it explicit.

**Procedure:**
1. **Extract single-monk ideas.** Scan the atomic parts list (4.6 step 2) for high-value ideas — mechanisms, observations, failure modes, reframes — appearing in **only one** monk. These "spiky" ideas are most at risk of being smoothed away.
2. **Score provenance-blind.** Rate each for "useful, non-obvious, worth keeping" *without* reference to which monk produced it. Default: dispatch 2–3 fresh blind-judge subagents (no position, no sight of any synthesis) to score the stripped ideas — this removes the single-informed-seat bias. Minimum fallback: the orchestrator scores with provenance stripped. Use the 4.6-step-2 calibration tags as a second axis: **value × calibration.**
3. **Coverage requirement.** Each high-value idea must be either (a) carried into a Phase 5 candidate, or (b) **consciously dropped with a one-line reason** logged to `misfit_register.md`. Silent dropping is the failure this pass exists to prevent. A high-value + low-calibration idea is carried as a *flagged hypothesis* that must earn evidence (the Phase 5 reversibility-repair path), not asserted.

**Boundary with the misfit register — do not conflate:**
- Loss-audit items are *absorbable high-value content* — smoothing them away is the bug, so **recover** them. Test: "would carrying this in make the synthesis *better*?"
- Misfit-register items are *frame-level friction* — forcing them to fit falsifies the synthesis, so **preserve** them un-resolved. Test: "would absorbing this *falsify* the synthesis?"

**Write the output** to `round_N_loss_audit.md`: each single-monk idea, its value × calibration score, and its disposition (carried-to-S / carried-to-J / dropped + reason).

```

- [ ] **Step 2: Add a loss-audit line to the 4.9 checkpoint**

In `## 4.9`, find the bullet `> - **Do the flagged misfits look right,** or am I missing a bigger one?` and insert immediately after it:

```markdown
> - **Are the recovered high-value ideas right,** and do the conscious drops look correct — or did I smooth away something that should be carried?
```

- [ ] **Step 3: Verify**

Run: `grep -n "## 4.6.6\|Loss Audit\|recovered high-value ideas" reference/phase4-determinate-negation.md`
Expected: three matches. Confirm `## 4.6.6` appears before `## 4.7`: `grep -n "## 4.6.6\|## 4.7" reference/phase4-determinate-negation.md` (4.6.6 line number < 4.7 line number).

- [ ] **Step 4: Commit**

```bash
sleep 0.01 && git add reference/phase4-determinate-negation.md && sleep 0.01 && git commit -m "Add 4.6.6 loss audit for single-monk high-value ideas (rohit hidden-profile #6)"
```

---

### Task 7: Phase 5 reversibility check → repair loop (#5)

**Files:**
- Modify: `reference/phase5-sublation.md:72` (`**Reversibility check (Boyd).**` paragraph)

- [ ] **Step 1: Replace the reversibility paragraph**

Replace the paragraph beginning `**Reversibility check (Boyd).** Trace each major claim ...` (the whole line 72 paragraph) with:

```markdown
**Reversibility check (Boyd) — repair, don't reject.** Trace each major claim back to specific atomic parts from the decomposition. When a claim doesn't trace back, do NOT discard the whole synthesis — Boyd's instruction is to repair: keep the parts that cohere, add new material (recruit a new donor domain or do fresh research), and re-derive. Loop up to 3 times. After that, the untraceable claim either earns its own evidence as a genuine new insight (kept, explicitly flagged as net-new) or is cut. Also run the "not the same arrangement" test: structurally, is S just one monk's architecture wearing the other's vocabulary? That fails.
```

- [ ] **Step 2: Verify**

Run: `grep -n "repair, don't reject\|Loop up to 3 times" reference/phase5-sublation.md`
Expected: two matches.

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase5-sublation.md && sleep 0.01 && git commit -m "Phase 5 reversibility: repair loop instead of pass/fail (Boyd #5)"
```

---

### Task 8: Phase 5 — add precision-vs-grip + calibration-weighting standards (#2b, #7)

**Files:**
- Modify: `reference/phase5-sublation.md` (`### S internal standards`, insert after the reversibility paragraph edited in Task 7, before `**Closure property.**`)

- [ ] **Step 1: Insert two new standards**

Immediately AFTER the reversibility paragraph (now ending `That fails.`) and BEFORE `**Closure property.**`, insert:

```markdown
**Precision-vs-grip check (Boyd / Heisenberg).** Over-tightening S for precision and completeness loses its match to the messy reality it describes. A synthesis that feels suspiciously clean — every loose end tucked, no remainder — has usually squeezed past the resolution the evidence supports. Boyd's third pillar operationalized: if S has no residue, suspect it. Cross-check the misfit register (4.6.5) — the genuine residue should still be visible, not dissolved.

**Calibration weighting.** Weight S's load-bearing claims by the per-part calibration tags from 4.6 step 2, not by how forcefully a monk asserted them. A `[reach]`-tagged part may be rhetorically central to a monk and still a weak foundation; build S's spine from `[solid]` parts and treat `[reach]` parts as flagged hypotheses, not load-bearers. This is the prompt-level analog of confidence-modulated debate — drift toward what is well-supported, not what is loudly claimed.
```

- [ ] **Step 2: Verify**

Run: `grep -n "Precision-vs-grip check\|Calibration weighting" reference/phase5-sublation.md`
Expected: two matches, both between the reversibility paragraph and `**Closure property.**`.

- [ ] **Step 3: Commit**

```bash
sleep 0.01 && git add reference/phase5-sublation.md && sleep 0.01 && git commit -m "Phase 5 S standards: precision-vs-grip + calibration weighting (Boyd #2b, MAD #7)"
```

---

### Task 9: SKILL.md — update Phase 4 walkthrough + tree diagram (cross-ref)

**Files:**
- Modify: `SKILL.md:69` (tree diagram 4.5/4.6 lines), `SKILL.md:117` (Phase 4 walkthrough paragraph)

- [ ] **Step 1: Update the tree diagram**

Replace the line:
```
│   ├── 4.5: Lateral creativity — compressed conflicts, random domain, metaphors
```
with:
```
│   ├── 4.5: Lateral creativity — compressed conflicts, donor recruitment (random + functional), metaphors
```

And replace the line:
```
│   ├── 4.6: Boydian decomposition (destructive deduction) — shatter into "sea of anarchy," find cross-domain connections (creative induction)
```
with:
```
│   ├── 4.6: Boydian decomposition — domain manifest, shatter into "sea of anarchy," qualities/attributes/operations passes, calibration tags
│   ├── 4.6.6: Loss audit — recover high-value single-monk ideas (hidden-profile guard)
```

- [ ] **Step 2: Update the Phase 4 walkthrough paragraph (line 117)**

In the paragraph starting `You perform this yourself (not a subagent).`, replace the sentence:
```
Lateral creativity interventions: compressed conflict generation (oxymorons), random domain injection via Wikipedia's random article API, non-propositional pause (three metaphors).
```
with:
```
Lateral creativity interventions: compressed conflict generation (oxymorons), donor recruitment for a multi-domain sea (random Wikipedia donors + functional donors targeted at each "missing thing," decomposed to equal depth via a domain manifest), non-propositional pause (three metaphors). The Boydian decomposition tags each atomic part with a calibration estimate and runs qualities/attributes/operations as three passes. A **loss audit (4.6.6)** recovers high-value ideas held by only one monk before the synthesis can smooth them away.
```

- [ ] **Step 3: Verify**

Run: `grep -n "donor recruitment\|4.6.6: Loss audit\|loss audit (4.6.6)" SKILL.md`
Expected: at least three matches.

- [ ] **Step 4: Commit**

```bash
sleep 0.01 && git add SKILL.md && sleep 0.01 && git commit -m "SKILL.md: reflect donor recruitment, manifest, QAO passes, loss audit in Phase 4 summary"
```

---

### Task 10: SKILL.md — mark all three Boyd pillars as operationalized (#2 closure)

**Files:**
- Modify: `SKILL.md:310` (Heisenberg pillar), `SKILL.md:319` (where Boyd is operationally present)

- [ ] **Step 1: Append an operational note to the Heisenberg pillar**

Replace the line 310 bullet:
```
2. **Heisenberg's Uncertainty:** When the observer's precision approaches the phenomenon's precision, uncertainty swamps the measurement. Applied: the deeper you refine a concept, the more the concept shapes what you observe — a feedback loop that generates confusion, not clarity.
```
with:
```
2. **Heisenberg's Uncertainty:** When the observer's precision approaches the phenomenon's precision, uncertainty swamps the measurement. Applied: the deeper you refine a concept, the more the concept shapes what you observe — a feedback loop that generates confusion, not clarity. *Operationalized as two checks:* the observer-perturbs-observed check at the top of 4.6 (decompose what the monk committed to, not a pre-smoothed version) and the precision-vs-grip check in Phase 5 (a synthesis with no residue has been over-refined past the evidence).
```

- [ ] **Step 2: Update "Where Boyd is operationally present" (line 319)**

Replace line 319:
```
**Where Boyd is operationally present:** Phase 4.6 (Boydian Decomposition — the destructive deduction), Phase 5 (Sublation — the creative induction, including the reversibility check), Phase 6 (the auditor's reversibility check), and Phase 7 (Recursion — each cycle is Boyd's full Structure → Unstructure → Restructure, which is why recursive rounds often need new research from outside the original domains).
```
with:
```
**Where Boyd is operationally present:** Phase 4.5b (donor recruitment — the multi-domain sea), Phase 4.6 (Boydian Decomposition — destructive deduction via domain manifest, anti-tidiness, qualities/attributes/operations passes, per-part calibration; plus the Heisenberg observer-perturbs check), Phase 4.6.6 (loss audit — hidden-profile guard), Phase 5 (creative induction — the reversibility *repair* loop, the precision-vs-grip check, and calibration weighting), Phase 6 (the auditor's reversibility check), and Phase 7 (Recursion — each cycle is Boyd's full Structure → Unstructure → Restructure). All three pillars now have an operational home: Gödel → reversibility + new research; Heisenberg → observer-perturbs + precision-vs-grip; Second Law → the Phase 7 entropy diagnostic.
```

- [ ] **Step 3: Verify**

Run: `grep -n "Operationalized as two checks\|All three pillars now have an operational home" SKILL.md`
Expected: two matches.

- [ ] **Step 4: Commit**

```bash
sleep 0.01 && git add SKILL.md && sleep 0.01 && git commit -m "SKILL.md: note all three Boyd pillars now operationalized (Heisenberg closure #2)"
```

---

### Task 11: Final coherence pass

**Files:**
- Read-only verification across `reference/phase4-determinate-negation.md`, `reference/phase5-sublation.md`, `SKILL.md`

- [ ] **Step 1: Check for dangling references**

Run: `grep -rn "4.6 step 5\|epistemological diversity check\|adjacent domains\|Random Domain Injection" reference/ SKILL.md README.md`
Expected: no stale references to the *old* names. "Epistemological diversity verification" (new) is fine; the old "check" should be gone. If README.md still says "random Wikipedia domain injection," update that phrase to "multi-domain donor recruitment (random + functional)" to match.

- [ ] **Step 2: Verify calibration tag vocabulary is consistent**

Run: `grep -rn "\[solid\]\|\[plausible\]\|\[reach\]\|calibration" reference/`
Expected: the tag names `[solid]`/`[plausible]`/`[reach]` appear in 4.6 step 2 (definition), 4.6.6 (value × calibration), and Phase 5 (calibration weighting) — same three tokens everywhere, no drift (e.g. not `[strong]` in one place and `[solid]` in another).

- [ ] **Step 3: Read-through**

Read `reference/phase4-determinate-negation.md` sections 4.5 through 4.9 end-to-end. Confirm: 4.5b recruits donors → 4.6 manifest decomposes them as peers → step 3 finds connections → 4.6.5 misfit register → 4.6.6 loss audit → 4.7 criteria → 4.9 checkpoint surfaces both misfits and recovered ideas. The flow should read as one continuous instruction with no orphaned cross-reference.

- [ ] **Step 4: Commit any fixes**

```bash
sleep 0.01 && git add -A && sleep 0.01 && git commit -m "Boyd overhaul: final coherence fixes" || echo "no fixes needed"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- #1 deeper sea / unified donors → Tasks 1, 3 (manifest), 5. ✓
- #2 Heisenberg (observer-perturbs + precision-vs-grip) → Tasks 2, 8, 10. ✓
- #3 qualities/attributes/operations → Task 4. ✓
- #4 anti-tidiness → Task 3. ✓
- #5 reversibility repair → Task 7. ✓
- #6 loss audit → Task 6. ✓
- #7 calibration tagging + weighting → Tasks 3 (tag), 8 (weight), 6 (second axis). ✓
- Domain manifest, no renumber → Task 3 (in-place), no task renumbers sections. ✓
- SKILL.md cross-refs → Tasks 9, 10; README → Task 11 step 1. ✓

**Placeholder scan:** No "TBD"/"handle appropriately". The repair-loop bound `K` from the spec is pinned to **3** in Task 7. Calibration tag vocabulary pinned to `[solid]`/`[plausible]`/`[reach]` and checked for drift in Task 11.

**Type/term consistency:** "domain manifest," "donor," "[solid]/[plausible]/[reach]," "loss audit / 4.6.6," "value × calibration" used identically across Tasks 1, 3, 4, 6, 8, 9. Section numbers unchanged (surgical). ✓
