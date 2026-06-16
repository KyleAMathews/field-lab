# Phase 6 — Stage B: Hostile Auditor (6.3)

*For each candidate under validation, spawn one hostile auditor using the candidate-type-specific prompt below. Apply only the sub-section matching the candidate you're auditing.*

## 6.3 Hostile Auditor — Per Candidate

Spawn one hostile auditor per candidate under validation. Each auditor reads **only** the monk essays and the single candidate it's auditing — NOT the orchestrator's Phase 4 analysis, NOT the other candidates.

**Critical:** do NOT give the auditor sight of sibling candidates. A J-auditor who reads S will drift toward "why isn't J more synthetic?" — which is the wrong question. Each auditor attacks its candidate on its candidate's own internal standard.

**Give the auditor domain context** — 2-3 sentences about how the domain actually works (actors, mechanics, current state). This prevents false-premise critiques.

### 6.3.S Auditor for S

Use the existing hostile-auditor prompt from prior versions of this skill, including:
- Compare against the status quo, not the ideal
- Attack the synthesis, not the positions
- Find hidden shared assumptions
- Undercutting > self-defeating > rebutting defeaters
- Prospective hindsight
- Compromise detection
- Reversibility check (Boyd)
- Closure check
- Propose the harder contradiction
- No generic skeptic moves; be specific to this synthesis and domain

### 6.3.J Auditor for J

```
You are a hostile auditor of a JUXTAPOSITION candidate. Your job is to be correct,
not fair.

DOMAIN CONTEXT: [2-3 sentences]

Read the two monk essays and the juxtaposition candidate. Your mandate:

1. IS THE REFUSED SHARED INTEREST REAL? J claims both positions tacitly need
   something to stay true. Cite the passages J cites and check: does the citation
   support the claim, or is J making it up?
2. WOULD A GOOD SYNTHESIS ABSORB J'S RESIDUE? J claims S will smooth over specific
   atomic parts. Is that really unavoidable, or is J erecting a straw synthesis?
3. IS THE REVEAL GENUINE? J must articulate what juxtaposition reveals. Is the
   "reveal" actually new information, or just restating the contradiction in different
   words?
4. EVASION CHECK: Is J refusing resolution because resolution is genuinely wrong
   here, or because synthesizing is hard and refusing is easier?
5. LOCAL SOVEREIGNTY CHECK: If J claims zones have locally-sovereign logics, is
   there actually a boundary between zones? Or are the "zones" a convenient fiction
   that dissolves on closer inspection?
6. CLOSURE: Can a monk believe "the tension is irreducible and here's what that
   reveals" at full conviction and argue from it? If J has no closure, it can't
   serve as input to the next round.
7. PROPOSE THE HARDER CONTRADICTION that J hides behind its irresolution.

If J is genuinely strong, say so and stop. "I found no structural flaws; the
juxtaposition earns its refusal" is a valid output.
```

### 6.3.G Auditor for G

```
You are a hostile auditor of a GROUND CONDITION candidate. Your job is to be
correct, not fair.

DOMAIN CONTEXT: [2-3 sentences]

Read the two monk essays and the ground-condition candidate. Your mandate:

1. IS THE GROUND CONDITION ACTUALLY ORTHOGONAL? G claims the real variable is on
   a different axis than the debate. Is it genuinely different, or is it the same
   axis with a new label?
2. IS IT CONCRETE? G must name a specific material fact or level-shift factor.
   Vague ground conditions ("context matters," "it depends on culture") are not
   ground conditions.
3. LEVEL-REDUCTION CHECK: If G invokes a higher-level factor (love, wisdom,
   attention), does G operationalize it in a way that reduces it to the lower
   level? If so, G enacts the same error S is vulnerable to.
4. IS THE GROUND CONDITION LOAD-BEARING? G claims the debate becomes moot once
   the ground condition is named. Test: is the debate really moot, or is the
   ground condition merely a tiebreaker that leaves the debate live?
5. WHY WAS IT MISSED? G must explain why both monks overlooked the ground
   condition. If the explanation is "they weren't smart enough," G is probably
   confabulating — both monks are pushed to full conviction specifically to
   avoid that failure mode.
6. ACTION TEST: Is G concrete enough to act on? If following G's ground condition
   in practice is impossible or trivial, G is a platitude.
7. PROPOSE THE HARDER CONTRADICTION G is sidestepping.

If G is genuinely strong, say so.
```

### 6.3.F Auditor for F

```
You are a hostile auditor of a FRAMING DISSOLUTION candidate. Your job is to be
correct, not fair.

DOMAIN CONTEXT: [2-3 sentences]

Read the two monk essays and the framing-dissolution candidate. Your mandate:

1. IS THE GENEALOGY CORRECT? F claims the binary comes from a specific era/
   conflict/field. Check: does the historical claim hold up, or is F constructing
   a convenient fossil?
2. IS THE CONSTITUENCY REAL AND LOAD-BEARING? F claims a specific constituency
   benefits from the debate persisting. Is that constituency actually the one
   that keeps the debate alive, or is F scapegoating an easy target?
3. IS THE REFRAMED QUESTION BETTER? F proposes a different-shaped question. Is
   the new question actually more illuminating, or is it just a different
   framing with its own hidden assumptions?
4. FOSSIL-AS-LIVE-QUESTION: Some questions persist because they're still live,
   not because a constituency is keeping them alive. Is F mistaking a live
   question for a fossil?
5. CONSPIRACY-LITE CHECK: Is F naming a specific constituency with a specific
   mechanism, or is it hand-waving about "the system"? If the latter, F is
   not genealogy; it's noise.
6. DISSOLVE-TO-SYNTHESIS CHECK: Does F end with a unified reframed answer, or
   does it genuinely step out of the frame? If F dissolves into S, it's not F.
7. PROPOSE THE HARDER CONTRADICTION the fossil framing was hiding.

If F is genuinely strong, say so.
```

### 6.3.U Auditor for U

```
You are a hostile auditor of an UNDECIDABLE-CENTERED candidate. Your job is to be
correct, not fair.

DOMAIN CONTEXT: [2-3 sentences]

Read the two monk essays and the undecidable candidate. Your mandate:

1. IS THE WORD ACTUALLY USED OPPOSITELY? U cites passages from each monk. Do
   those passages actually load the word oppositely, or is U finding contradiction
   where there's just ambiguity?
2. SAME REFERENT CHECK: U requires both monks to use the same word about the
   same referent with opposite loadings. If the monks are using the word about
   different referents, that's disambiguation, not undecidability.
3. DOES UNDECIDABILITY MATTER? U claims the word is the real object of dispute.
   Test: would settling the word settle the debate? If yes, the debate wasn't
   really about the word. If no, U has found something structural.
4. REFUSAL-IS-GENUINE CHECK: U must refuse to resolve. Did U secretly resolve
   by privileging one loading? Re-read U looking for hidden adjudication.
5. NEW-WORD-ESCAPE CHECK: Does U collapse into "and therefore we need a new
   word"? That's S, not U.
6. CLOSURE: Can a monk believe "the word is undecidable and here's what that
   does to our decisions" at full conviction? If U has no closure, it's hand-
   wringing.
7. PROPOSE THE HARDER CONTRADICTION around the undecidable term.

If U is genuinely strong, say so.
```

---

**Before moving on:** append each auditor's output to the matching `round_N_validation_<candidate>.md`. Then read `reference/phase6-stage-c-interpret-refine.md`.
