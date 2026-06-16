# Phase 6 — Stage A: Monk Validation (6.2)

*For each candidate the user selected (6.0), send the candidate-type-specific prompt below to both monks. Apply only the sub-section matching the candidate you're validating.*

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

---

**Before moving on:** write each candidate's monk-validation output to `round_N_validation_<candidate>.md` (e.g. `round_N_validation_S.md`). Then read `reference/phase6-stage-b-hostile-auditor.md`.
