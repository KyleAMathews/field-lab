# The Frontier Overlay — precommodification diagnostic

**Goal:** Give the dialectic a low-precision **diagnostic overlay** that reads how far each move sits inside vs. outside the latent space — "groove" (precommodified / standard) vs. "frontier" (novel / hard) — and flags the moment a reaching, frontier-ish tension gets _redirected back to known territory_. It is a map the user reads and steers from; it never steers the dialectic itself.

**Origin:** Venkatesh Rao, "Zero Interest Rate Ideation" (precommodification). Rao's detection heuristic — _fluent elaboration = precommodified; the model struggling to build on it = frontier_ — is the same phenomenon this skill already fights as the "confirms-priors" tendency, stated in a new vocabulary. The skill already implements Rao's _treatment_ (the blind donor sea is his "level-up via combination"; the wiki + tension-queue are his "Zettelkasten + periodic recombination"). What it lacks, and what this feature adds, is a _reading reported back to the user_.

**Non-goals / deferred:** No auto-steering (overlay only — decided with the user). No per-artifact heat-map over every monk claim (nag risk; the user is a strong detector and reads raw essays fine). No new wiki page type (over-engineering; the reading lives in the control log + inline presentations). A wiki-frontmatter `frontier` reading is a possible later extension, revisited only after watching this on real runs. This is the concrete first cut of the **open-endedness meter deferred in `reference/phase7-recursion.md`**.

---

## The oobleck intuition (the mental model — put this at the top of `reference/frontier-overlay.md`)

From Rao's companion essay, "Can the Social Oobleck Dance?" This is the physical picture behind every "groove / frontier / collapse" reading; carry it into the reference doc as the intuition pump so the orchestrator has a memorable handle, not just dry definitions.

Oobleck (cornstarch + water) is **shear-thickening**: push it gently and it flows like water; hit it hard and sudden and it goes rigid. The precommodified semantic medium is oobleck. That gives the whole overlay one physical model:

- **The overlay is a rheometer, not a novelty-scorer.** It reports whether the medium *thickened or flowed* under this pass's forcing — not a quality grade.
- **Groove = flow.** The medium gives way; the move is fluent and expected; you're in the worn channel (Rao's "fluent elaboration = precommodified").
- **Frontier = thickening under shear.** The medium pushes back; the move resists the obvious; you've hit something real (Rao's "the model struggles to build on it").
- **The blind-expectation probe is the shear stroke.** It is a sudden hard hit — "here is the obvious expected answer, right now." Its purpose is not to predict correctly; it is to *strike and see if anything pushes back*. Dialectic move resists/diverges → thickened → frontier. Move gives way/matches → flowed → groove.
- **Collapse = flowed back to liquid despite the shear.** The monks applied force (reached), but the negation let the medium relax back to water and drain into the groove. The dance failed.

The larger point this essay makes — that novelty lives in the *temporality* (the divergence→convergence rhythm), not in fresh data — is not new machinery to build; it *is* the dialectic's existing engine (blind monk divergence → convergent negation → refine/re-split → repeat; wiki + tension-queue as the "resonant cavity"). The overlay simply instruments that engine: per pass, did the forcing make the oobleck dance, or just stir water?

---

## Design principles (the guardrails — bake these into the wording)

1. **Descriptive, never prescriptive.** It reports terrain; the user decides whether they meant to be on it. It must never nag "this is precommodified, go harder." On a standard run (user just wants the standard answer) it quietly confirms "groove — as expected" and adds zero friction.
2. **An ambiguous flag, not a confident score.** Divergence from the expected resolution can mean "frontier" _or_ just "the idea was vague/underspecified." A match can mean "precommodified" _or_ just "clear and simple." The overlay says _"look here,"_ not _"this is novel."_ Overclaiming precision would make it worse than nothing.
3. **An aid to a good detector.** The user detects precommodification and sycophancy readily themselves — this is coverage and attention-direction (catch the collapse on hour three of a long run; let the palette be scanned faster), not a replacement. Low precision and false positives are acceptable because the user filters them at a glance.
4. **Quiet on standard runs.** The highest-value output — the collapse flag — is silent when there is no frontier reach to collapse _from_. Standard work produces only the cheap "groove" reading.
5. **Overlay feeds recommendation, never action.** The reading may inform the refinement-loop router's _recommendation_ to the user (which the router already makes), but nothing loops or proceeds on the reading alone. The user remains the only steering authority.

---

## What it reads — two layers

### Free layer (always on, ~zero cost)

Re-interpret the maturity gate's three existing signals (`reference/refinement-loop.md`) as a groove/frontier reading:

- Fast saturation / no new cross-edges / no new facts → **groove** (the space is a deep, well-worn well).
- Persistent novelty (new `[fit:]` cross-edges still appearing, hidden question still moving) → **frontier** (the space is underdetermined; you're on the jagged edge).

Already computed by the router; this layer only _re-labels_ it. Per-tension granularity.

### Probe layer (fired at the negation and the palette — one cheap blind agent per pass)

A **blind-expectation probe**: an ephemeral agent that sees **only the setup** — the current working question and the poles (the framing of the contradiction) — and nothing else. It predicts the resolution(s) it would _expect_ a thoughtful analysis to reach.

- **Input:** working question + the two (or more) committed poles, verbatim. **Blind to:** monk essays, the determinate negation, donor research, the palette, the control log.
- **Task:** "Given this question and these committed positions, what resolution(s) would you expect a competent analysis to land on? Give the 1–3 most likely." Neutral, no access to the dialectic's actual work.
- **Return:** the 1–3 expected resolutions, concise.
- **Comparison (done by the belief-free orchestrator, which already holds both in context — no extra judge agent):** each actual negation move / palette candidate is read against the expected set. **Match → groove. Divergence → frontier.**

One probe per refinement pass serves both surfaces, since the setup (question + poles) is constant within a pass.

**Decorrelation / firewall.** The blind-expectation probe runs _after_ the monks and its output goes **only to the orchestrator's frontier reading** — never into a monk brief. It is orchestrator-facing like `donor`/`tension`/`synthesis` material. It is ephemeral (recorded in the reading + ledger, not a wiki page).

---

## The collapse detector (the highest-value output)

The redirect-to-known-territory the user fears has a signature:

- **Reach present:** the monks reached (hard-won / heavily-qualified / donor-dependent argumentation, or new `[fit:]` cross-edges appeared in the 4.6 decomposition), **AND**
- **Groove landing:** the determinate negation's result — or a palette candidate — matches the blind-expected resolution.

When both hold, flag it: **"⚠ reached on X — negation/candidate pulled back to the groove Y."** Detecting "the monks reached" is a qualitative orchestrator judgment (was the argument fluent and complete, or did it strain and invent?) — an honest flag, not a metric. On a standard run there is no reach, so no collapse flag appears.

---

## Where it surfaces

### 1. Negation — a companion block (primary)

Where the user spends the most reading time, and the collapse _site_ (Aufhebung is exactly where a reaching tension is either elevated into something new or "resolved" into a groove). When the orchestrator presents the determinate negation, it appends a **short frontier-reading companion block** _after_ the negation (keeps the negation itself clean to read; puts the diagnostic in one scannable place the user can ignore at will). Contents:

- The groove/frontier reading (free layer) in one line.
- The blind-expected resolution(s) vs. where the negation actually landed.
- Any collapse flag(s).
- 3–4 lines total. Points at moves _by name_; does not re-tag the negation text inline.

### 2. Palette — one-line flag per candidate (secondary)

At the Phase 5 decision point, each S/J/G/F/U candidate gets a one-line groove/frontier flag (from the same blind expectation). Lets the user scan "which of these five is actually off the worn surface." Naturally, S (the fluent, obvious synthesis) will often read groove; U/F often read frontier — the flag makes that visible per-run rather than assumed.

### 3. Control log — a frontier-ledger (cross-pass tracker)

Reuses the hidden-question-ledger machinery. One line per refinement pass, so redirect _over time_ is visible (a snapshot can't see that a frontier idea from pass 1 was flattened by pass 3). Schema (added to the control-log section of `reference/dialectic-wiki.md`):

```
frontier-ledger:
- pass N: reading=<groove|frontier|mixed>; expected=<blind expectation, one line>; actual=<where negation/candidate landed>; collapse=<none | "reached on X, pulled to groove Y">
```

---

## Files touched

- **`reference/frontier-overlay.md` (NEW).** The central doc: the **oobleck intuition pump at the top**, then the blind-expectation probe contract (input/blindness/task/return), the orchestrator comparison, the free layer, the collapse detector, the companion-block format, the frontier-ledger schema, and the five guardrails. Everything else points here.
- **`reference/phase4-determinate-negation.md` + the relevant negation stage (`phase4-stage-c-decomposition.md` / `phase4-stage-d-criteria.md`).** After the determinate negation is produced and before it is presented: spawn the blind-expectation probe, write the companion block, add the frontier-ledger line. Add a completion-gate item ("frontier reading attached to the negation; blind-expectation probe was blind to monk/negation material").
- **`reference/phase5-sublation.md`.** Add the one-line groove/frontier flag per candidate; gate item.
- **`reference/refinement-loop.md`.** The router's control-log update writes the frontier-ledger line each pass; the router's _recommendation_ may cite the reading (esp. a collapse) as diagnostic evidence — without acting on it. Add gate item.
- **`reference/dialectic-wiki.md`.** Add the `frontier-ledger` schema to the per-round control-log section; note the blind-expectation probe as orchestrator-facing/ephemeral (firewall).
- **`SKILL.md`.** Brief mention: the Frontier Overlay, what it reads, where it surfaces, and the "descriptive not prescriptive / overlay not operator" framing. Add to the phase map / summaries where the negation and palette are described.

---

## Self-review notes

- **Placeholder scan:** none — probe contract, comparison owner, collapse logic, ledger schema, and companion-block contents are all concrete.
- **Consistency:** firewall treatment of the blind-expectation probe matches the existing `donor`/`tension`/`synthesis` orchestrator-facing rule; "overlay feeds recommendation not action" matches the router's existing "diagnose and recommend; user decides" contract; "no new page type" matches the deferred-extension stance.
- **Scope:** single, focused feature (a diagnostic overlay); one new reference doc + edits to five existing files. Fits one implementation plan.
- **Ambiguity:** "the monks reached" is deliberately a qualitative orchestrator judgment, consistent with guardrail 2 (flag, not metric) — called out rather than left implicit.
