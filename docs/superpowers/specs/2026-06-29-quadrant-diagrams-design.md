# 2×2 Quadrant Diagrams in the Dialectic — Design

## Problem / opportunity

A 2×2's best use (per ribbonfarm "How to draw and judge quadrant diagrams" + Rao's *Art of Gig*) is **conflict de-escalation**: when two people argue over a single spectrum, adding a second, orthogonal axis often reveals they're in different *quadrants*, not opposing positions on one line. That is structurally the same move the dialectic already makes — find the hidden axis that dissolves a false binary (4.4 hidden question, 1c.1 third-pole probe, 1d.5 recon, the F/G palette candidates).

Kyle found that having agents generate 2×2s during free exploration was very useful. This design weaves 2×2 generation into the dialectic as a **mandatory** tool at three moments, backed by a shared primer.

## Principle: mandatory means "always test for a second axis"

Mandatory does NOT mean "always draw a clean four-box diagram." Forcing a 2×2 where the axes don't earn it imports false structure — exactly the failure the skill already guards against (4.6 anti-tidiness, Adorno non-identity, and the documented pull toward too-elegant resolutions). So the rule is: at each touchpoint you must **attempt** a 2×2, and a legitimate, honest result is *"no second axis earns its place here — these positions genuinely sit on one line,"* which is itself a finding (it feeds the undecidable lens / misfit register). The diagram is a hypothesis to test, not a truth to assert.

## Component 1: shared primer — `reference/quadrant-diagrams.md`

A single reference doc the three touchpoints link to (DRY). Contents:

- **What kind of claim are you making?** Three axis-derivations: *statistical* (data-derived, e.g. BCG growth-share), *conceptual* (model-grounded, e.g. GTD perspective/control), *artistic/scenario* (chosen for insight, e.g. Microsoft globalization/labor futures). In a dialectic the axes are almost always conceptual or artistic, never statistical — so the load-bearing warning is **don't dress an artistic axis up as data / a measured fact.**
- **Start from the tension, not the dimensions.** Build the 2×2 from the argument it needs to resolve; the second axis is the one that turns "opposing positions on one line" into "different quadrants." Do not start by hunting for "the two most important dimensions."
- **How to draw it** (in a dialectic): axis 1 = the live tension / surface debate; axis 2 = an orthogonal dimension that must be genuinely independent of axis 1; label all four quadrants; place the actors/positions; read the empty or under-occupied quadrant.
- **Judging tests:** (a) orthogonality — are the axes actually independent, or secretly correlated (a diagonal in disguise)? (b) all-four-meaningful — does each quadrant name a real, distinct thing? (c) the telling empty quadrant — usually where the insight or the missing pole lives; (d) does it resolve the argument it was built for?
- **Anti-tidiness / honesty guard** (cross-link to 4.6): a clean four-box partition is a smuggled frame. Refuse to force. The honest output of a mandatory 2×2 can be "these are genuinely on one axis; a second would be forced" — record that rather than draw a misleading diagram.
- **ASCII rendering convention** so diagrams display inline in the terminal/markdown output and in the round files.

## Component 2: three mandatory touchpoints

### Phase 1 — `1c.2 Exploratory 2×2s` (new sub-step after 1c.1) — DIVERGENT
Phase 1 is open-ended exploration, so generate **multiple candidate 2×2s** (typically 2–4), each choosing a *different* pair of axes, to map the space of possible tensions and explore — *with the user* — where to point the monks. Different second axes surface different fault lines; the agent and user range over them together. Each candidate doubles as a comprehension check (the user corrects axes/placements) and a third-pole generator (each second axis is a candidate orthogonal pole — ties directly to 1c.1). The exploration feeds the fault-line / monk-count decision locked at 1f. Mandatory: produce a *spread* of candidate framings, not one; a framing with no honest second axis is a finding too (that tension may be genuinely 1-D). This is the divergent touchpoint — Phase 4 and Phase 5 are convergent (a single targeted diagram).

### Phase 4 — at `4.4` (Phase 4 stage A), tied to `4.3`
Draw the 2×2 with axis 1 = the surface debate (4.0) and axis 2 = the hidden question's axis (4.4). Place each monk. **The quadrant a monk ignores is its determinate negation (4.3) made visual; the under-occupied quadrant is a synthesis / third-pole candidate.** Mandatory. If no honest second axis exists, the monks really are on one line — record that (it feeds the undecidable lens / misfit register). This is the highest-value use.

### Phase 5 — palette construction (`reference/phase5-sublation.md`)
Use a 2×2 to construct/express candidates, especially **G** (ground condition — the second axis often *is* the ground-condition variable) and **F** (framing dissolution — the old binary becomes one axis, the dissolving reframe the other). The empty quadrant is often the **S** synthesis candidate. Mandatory: attempt; a forced 2×2 here would manufacture a false G/F, so the honesty guard is especially load-bearing.

## Component 3: SKILL.md walkthrough

Add a short clause to the Phase 1, Phase 4, and Phase 5 walkthrough paragraphs noting the mandatory 2×2 and pointing at the primer.

## Files
- Create: `reference/quadrant-diagrams.md`
- Modify: `reference/phase1-elenctic-interview.md` (1c.2), `reference/phase4-stage-a-analysis.md` (4.4), `reference/phase5-sublation.md` (palette), `SKILL.md` (three walkthrough clauses)

## Out of scope
- A standalone 2×2 skill usable outside the dialectic (could be factored out later; the primer is written so it *could* be lifted, but this design only wires it into the dialectic).
- Image rendering — diagrams are ASCII/markdown only.
