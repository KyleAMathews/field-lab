---
id: frontier-rheometer
name: "Frontier Rheometer"
summary: "Compare a blind expected landing with an actual result and describe groove, frontier, or collapse."
use_when: "A result may follow an expected groove or collapse back into one"
avoid_when: "Do not use expectedness as a novelty, quality, truth, or action score."
access_target: "Blind expectation, actual landing, and descriptive divergence"
requires: "A working question, committed poles, a frozen actual landing, and a blind expectation probe that has not seen the landing."
execution_seat: hybrid
fresh_context: required
effort: low
persistence: "One blind probe per pass; can be done here or kept as a frontier-ledger entry in a workflow."
artifact_risk: "A fluent match may be mistaken for low value, while vague divergence may be mistaken for novelty."
maturity: trialed
documented_uses: 3
---

# Frontier Rheometer (`frontier-rheometer`)

A low-precision **diagnostic overlay**. It reads how far each move sits inside vs. outside the latent space — **groove** (precommodified / standard) vs. **frontier** (novel / hard) — and flags the moment a reaching, frontier-ish tension gets **redirected back to known territory**. It is a **map the user reads and steers from; it never steers the dialectic.** This doc is the contract; Phase 4 Stage D, Phase 5, and the refinement-loop router all point here.

Origin: Venkatesh Rao, "Zero Interest Rate Ideation" (precommodification) + "Can the Social Oobleck Dance?". The overlay instruments the "confirms-priors" tendency this skill already fights — now with a reading reported back to the user.

## The oobleck intuition (the mental model — read this first)

Oobleck (cornstarch + water) is **shear-thickening**: push it gently and it flows like water; hit it hard and sudden and it goes rigid. The precommodified semantic medium is oobleck. That gives the whole overlay one physical model:

- **The overlay is a rheometer, not a novelty-scorer.** It reports whether the medium _thickened or flowed_ under this pass's forcing — not a quality grade.
- **Groove = flow.** The medium gives way; the move is fluent and expected; you're in the worn channel (Rao's "fluent elaboration = precommodified").
- **Frontier = thickening under shear.** The medium pushes back; the move resists the obvious; you've hit something real (Rao's "the model struggles to build on it").
- **The blind-expectation probe is the shear stroke.** It is a sudden hard hit — "here is the obvious expected answer, right now." Its purpose is not to predict correctly; it is to _strike and see if anything pushes back._
- **Collapse = flowed back to liquid despite the shear.** The monks applied force (reached), but the negation let the medium relax back to water and drain into the groove. The dance failed.

Novelty lives in the _temporality_ — the divergence→convergence rhythm — not in fresh data. That rhythm is the dialectic's existing engine (blind monk divergence → convergent negation → refine/re-split → repeat; wiki + tension-queue as the "resonant cavity"). The overlay just instruments it: per pass, did the forcing make the oobleck dance, or just stir water?

## What it reads — two layers

### Free layer (always on, ~zero cost)

Re-interpret the maturity gate's three existing signals (`reference/refinement-loop.md`) as a groove/frontier reading:

- Fast saturation / no new cross-edges / no new facts → **groove** (a deep, well-worn well).
- Persistent novelty (new `[fit:]` cross-edges still appearing, hidden question still moving) → **frontier** (underdetermined; the jagged edge).

The router already computes these; this layer only _re-labels_ them. Per-tension granularity.

### Probe layer — the blind-expectation probe

An **ephemeral subagent that sees only the setup** — the current working question and the poles — and predicts the resolution(s) it would expect. Fired once per refinement pass (serves both the negation and the palette, since the setup is constant within a pass).

- **Input:** the working question + the two (or more) committed poles, verbatim.
- **Blind to:** monk essays, the determinate negation, donor research, the palette, the control log. (This blindness is the whole point — a probe that has seen the dialectic's work can't measure whether the work was expected.)
- **Task:** "Given this question and these committed positions, what resolution(s) would you expect a competent analysis to land on? Give the 1–3 most likely." Neutral; no access to the actual work.
- **Return:** the 1–3 expected resolutions, concise.
- **Comparison:** the belief-free **orchestrator** (which already holds the negation/palette and the probe's return in context — no extra judge agent) reads each actual negation move / palette candidate against the expected set. **Match → groove. Divergence → frontier.**

**Firewall.** The probe runs _after_ the monks and its output goes **only to the orchestrator's frontier reading** — never into a monk brief. It is orchestrator-facing like `donor` / `tension` / `synthesis` material, and ephemeral (recorded in the reading + frontier-ledger, not a wiki page).

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

When the orchestrator presents the determinate negation (Phase 4, 4.9), it appends a **short frontier-reading companion block** _after_ the negation summary. Keep the negation text itself clean — do not re-tag it inline. 3–4 lines:

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

One line per refinement pass in `round_N_dialectic_log.md`, so redirect _over time_ is visible. Schema:

```
frontier-ledger:
- recorded-at=<YYYY-MM-DDTHH:MM:SS±HH:MM>; pass=N; reading=<groove|frontier|mixed>; expected=<blind expectation, one line>; actual=<where negation/candidate landed>; collapse=<none | "reached on X, pulled to groove Y">
```

## The five guardrails

1. **Descriptive, never prescriptive.** Report terrain; the user decides whether they meant to be on it. Never nag "this is precommodified, go harder." On a standard run, quietly confirm "groove — as expected" and add zero friction.
2. **An ambiguous flag, not a confident score.** Divergence can mean "frontier" _or_ just "vague/underspecified"; a match can mean "precommodified" _or_ just "clear and simple." Say _"look here,"_ not _"this is novel."_
3. **An aid to a good detector.** This is coverage and attention-direction, not a replacement for the user's own judgment. Low precision and false positives are fine — the user filters them at a glance.
4. **Quiet on standard runs.** The collapse flag is silent when there's no frontier reach to collapse _from_.
5. **Overlay feeds recommendation, never action.** The reading may inform the router's _recommendation_ to the user; nothing loops or proceeds on the reading alone. The user is the only steering authority.
