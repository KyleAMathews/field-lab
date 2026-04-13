# Phase 6: Validation of the Palette

Phase 6 validates the palette from Phase 5. The user selects which candidate(s) to validate — typically one or two, not all. Each selected candidate is validated **on its own terms** against its own internal standard, by the monks and by a hostile auditor.

**No tournament, no winner, no Borda count.** The user judges which candidate fits their situation. The monks and auditor produce structural critiques per candidate, not rankings across candidates.

**Critical ABS insight (still applies to S):** The monks don't *stop believing* after validation. A defeated monk has dropped its belief load — belief fell on the floor rather than being sublated. A properly elevated monk *believes more*. For non-S candidates (J/G/F/U), "elevation" means something different — see each candidate's validation prompt below.

## 6.0 Select Candidates to Validate

The user picks which candidate(s) from the palette go into validation. Common patterns:
- **One candidate** the user finds most promising — validate it alone.
- **Two candidates** that feel like real alternatives — validate both and see which survives more intact.
- **All candidates** if the user wants maximum friction before deciding (expensive; rarely needed).

If the user defers the choice, validate S plus the non-S candidate that fired on the strongest lens signal (usually J if position-protection fired, otherwise whichever lens had the highest-signal finding).

## 6.1 Model Selection

Use the strongest available model with extended thinking for all validation agents. Validation is subtle — the monks must reason about whether their core insight was genuinely preserved or quietly destroyed; the auditor's value comes from catching what everyone else missed. Cost is low (reading short-to-medium essays), leverage is high.

## 6.2 Monk Validation — Per Candidate

For each candidate under validation, send to **both monks** (each in their own session, if session resumption is available). The monk validation prompt is candidate-type-specific.

### 6.2.S Validating Candidate S (Synthesis)

Classical Aufhebung validation. Send to each monk:

```
You argued passionately for [POSITION]. [Resume session OR: here is a summary
of your argument: ...]

A dialectician analyzed the structural contradiction between your position and
your opponent's, and proposed a SYNTHESIS candidate:

[CONDENSED SUMMARY OF S — what's cancelled, preserved, elevated, the concrete proposal]

Evaluate honestly from your committed position:

1. Does this synthesis PRESERVE your core insight? What specifically does it get right?
2. Does it reveal a genuine limitation in your position? What were you missing?
3. Do you feel ELEVATED or DEFEATED? "Elevated" = "my position is a partial truth
   within a larger truth I couldn't have reached alone." "Defeated" = "my position
   was dismissed or diluted." Be honest.
4. What's wrong with this synthesis? Where is it weak, evasive, or compromise?
5. DEFEASIBILITY: What single piece of evidence or argument, if true, would force
   you to abandon even your ELEVATED position?

Do NOT be agreeable. If the synthesis is compromise dressed up, say so.
```

### 6.2.J Validating Candidate J (Juxtaposition)

The monks are *not* supposed to feel elevated here — J's whole move is refusing the unification that would elevate them. Validation checks whether the juxtaposition actually reveals something.

```
You argued passionately for [POSITION]. [Resume session OR: summary...]

A dialectician proposed a JUXTAPOSITION candidate — NOT a synthesis. It refuses
to resolve the contradiction between your position and your opponent's. Instead,
it claims that holding both open reveals something neither of you could see alone,
and that synthesizing would smooth over something important.

[CONDENSED SUMMARY OF J — the refused shared interest, what the juxtaposition
reveals, the atomic parts S would drop]

Evaluate honestly:

1. Does the juxtaposition name a genuine shared interest both of us were protecting?
   Or is the "shared interest" claim overreach?
2. What the juxtaposition claims gets LOST in synthesis — does it really get lost?
   Or could a good synthesis preserve it?
3. Does holding both positions open reveal what the juxtaposition claims it reveals?
   Or is the "reveal" just restating the contradiction?
4. Is this juxtaposition PRODUCTIVE or EVASIVE? "Productive" = refusing resolution
   makes something visible that would otherwise be hidden. "Evasive" = refusing
   resolution is just intellectual cowardice dressed up as Adorno.
5. What's the cost if the user takes the juxtaposition seriously and doesn't resolve?
   What decisions does it delay or obscure?
```

### 6.2.G Validating Candidate G (Ground Condition)

```
You argued passionately for [POSITION]. [Resume session OR: summary...]

A dialectician proposed a GROUND CONDITION candidate — NOT a synthesis. It claims
your debate is operating on the wrong axis entirely. The real load-bearing variable
lives at a different level than either of your positions engage.

[CONDENSED SUMMARY OF G — the named ground condition, why the debate misses it]

Evaluate honestly:

1. Does the ground condition G names actually dissolve the debate, or does it just
   reframe one side's advantage?
2. Is the ground condition on a GENUINELY DIFFERENT axis, or is it a meta-level
   version of one of our positions?
3. If the ground condition is real, why were we both missing it? What does that say
   about the frame we were operating in?
4. Does G operationalize something you were claiming resists operationalization?
   If it does, G has done the reductive move you were warning against.
5. What would it look like for someone to act on G's ground condition? Is that
   concrete enough to try, or is it a platitude?
```

### 6.2.F Validating Candidate F (Framing Dissolution)

```
You argued passionately for [POSITION]. [Resume session OR: summary...]

A dialectician proposed a FRAMING DISSOLUTION candidate — NOT a synthesis. It
claims the binary you and your opponent were debating is a fossil of an earlier
conflict, serving a specific constituency that isn't the actual decision-maker.

[CONDENSED SUMMARY OF F — the fossil origin, the constituency served, the
reframed question]

Evaluate honestly:

1. Is the genealogy F claims actually correct? Does this binary really come from
   the era/conflict F names?
2. Is the constituency F names actually the one served? Or is F scapegoating an
   easy target?
3. Does the reframed question F proposes illuminate the actual decision, or does
   it replace one fossil with another?
4. Even if the framing is a fossil, does the question it encodes still matter?
   Some fossils are fossils because the question IS still live.
5. What's the risk of accepting F's dissolution? What gets lost if we stop asking
   the binary question entirely?
```

### 6.2.U Validating Candidate U (Undecidable)

```
You argued passionately for [POSITION]. [Resume session OR: summary...]

A dialectician proposed an UNDECIDABLE-CENTERED candidate — NOT a synthesis. It
claims the real object of dispute is a single word you and your opponent both use
with opposite meanings.

[CONDENSED SUMMARY OF U — the named word, both loadings, cited passages]

Evaluate honestly:

1. Do you recognize the loading U attributes to you? Is that what you meant by
   the word?
2. Is your opponent's loading opposite in the way U claims, or is it just
   different in some other axis?
3. Does the undecidability U names explain something about why our debate felt
   harder than it should have — OR is it noise?
4. Would resolving the word's meaning resolve the debate? Or would it just move
   the contradiction to a different term?
5. Is U refusing resolution because resolution is genuinely impossible here, or
   because the dialectician didn't try hard enough?
```

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

## 6.4 Interpreting the Results — Per Candidate

Each candidate's validation is interpreted on its own terms. Do NOT cross-rank candidates.

### S interpretation
- **Both monks feel elevated:** S is valid. Belief was transformed, not defeated.
- **One monk feels defeated:** S is biased toward the other side. Revise S or drop it from the palette.
- **Both monks feel defeated:** S killed both beliefs without replacing. Probably compromise. Drop S or reopen Phase 4 for this candidate.
- **Auditor flags compromise-as-transcendence:** Revise S.
- **Auditor proposes harder contradiction:** This is a high-value Phase 7 recursion target.

### J interpretation
- **Both monks say the juxtaposition is PRODUCTIVE:** J is valid.
- **Either monk says it's EVASIVE:** Check whether the monk's critique is structural or is itself protecting the shared interest J surfaced. If the latter, the critique is evidence J is right.
- **Auditor says the "reveal" is just restating the contradiction:** Revise J or drop.
- **Auditor says zones are a convenient fiction:** If J relies on local sovereignty, this may be fatal. Re-examine.

### G interpretation
- **Both monks say the ground condition dissolves the debate:** G is valid.
- **Either monk says G operationalizes a higher-level factor as a lower-level mechanism:** G has enacted level-reduction. Drop or revise.
- **Either monk says G is on the same axis in disguise:** G hasn't earned its slot.
- **Auditor says "why was it missed" explanation is confabulation:** Check carefully — this is a common G failure mode.

### F interpretation
- **Both monks say the genealogy and reframed question are correct:** F is valid.
- **Either monk challenges the historical claim:** Check the claim. If F's genealogy is sloppy, F fails.
- **Auditor says the constituency is scapegoat, not load-bearing:** Revise or drop.
- **Auditor says the refocused question has its own fossil:** This is a Phase 7 recursion target — F exposed one frame, the recursion may need to expose the next.

### U interpretation
- **Both monks recognize the opposite loadings:** U has identified something real.
- **Either monk says "we're using the word about different referents":** U is disambiguation, not undecidability. Drop or reframe.
- **Auditor says U secretly privileges one loading:** Revise to make the refusal-to-resolve genuine.
- **U survives intact:** The undecidable is itself the finding for this round. It enters Phase 7 as the object, not as a problem to resolve.

## 6.5 Refining the Palette

After validation, the user picks among:
- **Accept a single candidate** and proceed to Phase 7 with that candidate as the round's output
- **Combine two candidates** — explicitly name how they combine (e.g., "S for the central move, J for what S drops") rather than collapsing J into S
- **Drop all candidates** and reopen Phase 4 — the decomposition didn't produce a candidate that fits
- **Hold the palette open** — declare the round's output to be the palette itself; Phase 7 recursion engages whichever candidate the user finds most productive next

**Write the full validation and auditor output to files** — one per candidate (e.g., `round_N_validation_S.md`, `round_N_validation_J.md`).

**Do not dump all feedback on the user.** For each candidate that survived validation, present:
- A 2-3 sentence summary of what the monks and auditor said
- The ONE concrete improvement (if any) most worth making

Then ask the user, per surviving candidate: "Incorporate this improvement? Or take the candidate as-is?" — **one at a time**, waiting for response between candidates. Even numbered sequentially, a wall of improvements across 3 candidates overwhelms and the user skims.

## 6.6 Anti-Sycophancy in Validation and Refinement

- When the user picks a candidate, do not celebrate. The pick is the user's judgment about fit; it's not a verdict on correctness.
- When the user rejects a candidate that the monks and auditor approved, do not capitulate. Say: "the monks and auditor both found this structurally sound — [specific points]. Are you sure the issue isn't [specific alternative reading]?" The user's judgment takes priority, but fold only after the case has been made.
- When the user proposes a new framework during refinement, it enters Phase 7 as decomposition material, NOT as the answer Phase 5 should have produced.
- Do NOT track the user's preferences across candidates and use them to bias the next round. The user is belief-free; treat each round's candidate selection as local to that round.
