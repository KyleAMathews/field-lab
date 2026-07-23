# Phase 6 — Stage B: Hostile Auditor (6.3)

**Before starting:** Confirm that the prior phase or stage passed the [workflow completion gate](dialectic-workflow.md#completion-gate). If not, stop and run it.

_For each candidate under validation, spawn one hostile auditor using the candidate-type-specific prompt below. Apply only the sub-section matching the candidate you're auditing._

## Stage B instrument: `hostile-assay`

Announce `hostile-assay` before dispatch. Each fresh auditor sees the source positions, domain context, trace, and one candidate—but no sibling candidate, Phase 4 analysis, or orchestrator preference. If no fresh context is available, label the result author self-critique and do not claim the full hostile assay.

## 6.3 Hostile Auditor — Per Candidate

Spawn one hostile auditor per candidate under validation. Each auditor reads **only** the monk essays and the single candidate it's auditing — NOT the orchestrator's Phase 4 analysis, NOT the other candidates.

**Critical:** do NOT give the auditor sight of sibling candidates. A J-auditor who reads S will drift toward "why isn't J more synthetic?" — which is the wrong question. Each auditor attacks its candidate on its candidate's own internal standard.

**Give the auditor domain context** — 2-3 sentences about how the domain actually works (actors, mechanics, current state). This prevents false-premise critiques.

### 6.3.S Auditor for S

```
You are a hostile auditor of a SYNTHESIS candidate (a Hegelian Aufhebung). Your
job is to be correct, not fair.

DOMAIN CONTEXT: [2-3 sentences]

Read the two monk essays and the synthesis candidate. Your mandate:

1. COMPARE AGAINST THE STATUS QUO, NOT THE IDEAL. Is S actually better than what
   a competent practitioner does today — or only better than a strawman? Do not
   grade S against a perfect synthesis; grade it against the real alternative.

2. ATTACK THE SYNTHESIS, NOT THE POSITIONS. The monks are already defeated; that
   is not interesting. Find where S itself fails. Prefer, in order:
   UNDERCUTTING (S's own reasoning doesn't support S) > SELF-DEFEATING (S, applied
   to itself, refutes itself) > REBUTTING (an outside defeater). A generic outside
   objection is the weakest move — earn the stronger ones.

3. REVERSIBILITY CHECK (Boyd) — trace S's load-bearing claims back through THREE
   layers, not one:
   (a) the atomic part(s) each claim rests on;
   (b) the quality / attribute / OPERATION that connects those parts into the
       claim — name it; a claim with no nameable connection is a bare assertion
       wearing synthesis vocabulary;
   (c) the [fit:] tag on that connection. A claim whose parts are solid but whose
       connecting recombination is [fit: reach] FAILS reversibility — the spine is
       an elegant mapping that lands a referent without doing work. Flag every
       claim whose grip depends on a [fit: reach] connection.
   If you cannot reverse a major claim to all three layers, S doesn't hold together
   without contradiction at that claim. Say which claim and which layer breaks.

4. SAME-ARRANGEMENT TEST (Boyd). Is S structurally just ONE monk's architecture
   wearing the other's vocabulary? New words over an old skeleton is not emergent
   structure. If every organizing relationship in S traces to one monk's frame, S
   recombined, it did not create.

5. COMPROMISE / CAPTURE / LEVEL-REDUCTION DETECTION.
   - Compromise: is S "use A sometimes, B sometimes," "best of both," or "it
     depends"? That is division of labor or surrender, not sublation.
   - Analytical capture: does S adopt one monk's epistemology to reframe the
     other's claims (e.g. one monk says "love," S says "meta-cognitive empathetic
     attunement")? The orchestrator is systematically biased toward operationalizing
     — suspect it.
   - Level reduction: if a monk made a categorically different KIND of claim, does
     S translate it down a level? Would that monk say "you did exactly what I
     warned against"?

6. PRECISION-VS-GRIP (Boyd / Heisenberg). Does S feel suspiciously clean — every
   loose end tucked, no remainder? Over-tightening for completeness loses the match
   to messy reality. Cross-check the misfit register: the genuine residue should
   still be visible in or around S, not dissolved. A synthesis with no residue has
   usually squeezed past what the evidence supports.

7. FIND HIDDEN SHARED ASSUMPTIONS. What does S still take for granted that BOTH
   monks also took for granted? S may have transcended the surface debate while
   inheriting the frame underneath it.

8. PROSPECTIVE HINDSIGHT. Assume it is a year later and S failed in practice. What
   is the most likely story of why? Work backward from that failure to the flaw in
   S now.

9. CLOSURE CHECK. Could a monk believe S at full conviction and argue FROM it as a
   position in the next round? If S is too abstract, meta, or hedged to serve as
   input to recursion, it stalls the dialectic.

10. PROPOSE THE HARDER CONTRADICTION that S resolved too easily or hid behind.

No generic skeptic moves — every objection must be specific to THIS synthesis and
THIS domain. If S is genuinely strong, say so and stop: "I found no structural
flaws; the synthesis earns its resolution" is a valid output.
```

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

**Completion gate — enumerate and attest before Stage C.** Apply the [workflow completion gate](dialectic-workflow.md#completion-gate), mark each item ✅ or ❌ with evidence, and stop on any ❌ unless the user explicitly waives it:

- [ ] One hostile auditor spawned per candidate under validation, each reading **only** its own candidate + the monk essays + domain context (no sight of sibling candidates or the Phase 4 analysis)
- [ ] Each auditor used the candidate-type-specific prompt (S/J/G/F/U)
- [ ] Each auditor's output appended to the matching `round_N_validation_<candidate>.md`
- [ ] One `hostile-assay` raw readout per candidate records authorization, actual fresh context, fallback, failure claims, trace/control results, artifact risk, and unmeasured remainder; orchestrator disposition is recorded separately

Then read `reference/phase6-stage-c-interpret-refine.md`.
