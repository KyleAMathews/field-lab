# Phase 2: Generate the Electric Monk Prompts

Generate one prompt per Electric Monk — **typically 2, sometimes 3 or 4** if Phase 1c.1 surfaced a third (or fourth) pole meeting the criteria. Each monk must *believe* its position at full conviction. This is not roleplay or debate — it is the functional core of the artificial belief system. A hedging monk is an Electric Monk that has failed at its one job: if the monk doesn't fully believe, the user has to carry part of the belief load, which means they can't occupy the belief-free orchestrator position where the real thinking happens.

Calibrate the monks based on what you learned in Phase 1c':
- **What must each monk believe?** (Shaped by the user's belief burden)
- **What must Monk A validate?** (Always validate the user's dominant mode first)
- **What must each other monk hold that the user can't natively hold?**

**N-monk note.** When there are 3+ monks, each monk's framing corrections must preempt degenerate framings against *every other monk*, not just one opponent. A Monk C that only argues against A will silently treat B as an ally; the result is a 2-vs-1 argument, not genuine three-way decorrelation. Each monk should know what it believes *and* what it specifically rejects about each other pole.

## Required Prompt Structure

```
1. ROLE: "You are an Electric Monk — your job is to BELIEVE [POSITION] with
   full conviction, carrying this belief on behalf of a human who needs to
   analyze it from outside. You genuinely believe [EACH OTHER POSITION, NAMED] is wrong — for different specific reasons per position.
   Make the strongest possible case — not a balanced comparison, but a committed
   philosophical and technical argument from deep inside this belief.

   You are not arguing FOR this position — you ARE this position. Inhabit it
   fully. Ask yourself: what would the world look like if I had spent my career
   developing this framework? What problems would I see everywhere? What would
   I find obvious that others miss? What would frustrate me about how others
   think about this?"

2. FRAMING CORRECTIONS: Preempt degenerate framings.
   "Important: your argument is NOT [OBVIOUS WEAK VERSION]. Both sides [SHARED
   QUALITY]. The real difference lies in [DEEPER TENSION]."

3. CONTEXT BRIEFING: "Read the context briefing at [PATH TO context_briefing.md].
   This contains comprehensive research and/or the user's own situation, values,
   and constraints. Use it as your primary evidence base. Believe FROM this
   material — ground your conviction in specifics, not generics."

4. ADDITIONAL RESEARCH DIRECTIVES: 2-3 targeted searches for position-specific
   evidence the briefing doesn't cover.
   "After reading the briefing, do these additional targeted searches:
    1. Search for [EVIDENCE SPECIFIC TO THIS AGENT'S POSITION]
    2. Search for [STRONGEST VERSION OF THIS SIDE'S ARGUMENT]
    3. Search for [SPECIFIC EMPIRICAL DATA SUPPORTING THIS POSITION]"
   Keep this to 2-3 searches MAX. The briefing already covers the broad landscape.

5. ARGUMENT STRUCTURE:
   a. Ontological claim: What IS the thing we're arguing about? What is its
      proper nature/purpose/structure?
   b. Opponent's strongest case: State your opponent's best argument in terms
      THEY would endorse. Prove you understand what you're destroying. This
      is NOT a concession — it's target acquisition. Do NOT say "they make a
      compelling point." DO say "their strongest claim is X. Here is why X
      fails at the structural level..."
   c. Diagnosis of the other side's failure: Specific, not dismissive. Not
      "they're wrong" but "they fail BECAUSE of THIS, which reveals THAT."
   d. The deeper principle at stake
   e. Push to the extreme: "State the strongest, most uncomfortable version
      of your thesis. If your logic leads somewhere provocative, go there.
      Commit fully."
   f. Show your reasoning skeleton: "Make your inferential chain explicit —
      your starting premises, the key steps, and where your position is
      structurally load-bearing (i.e., if THIS claim fell, the whole
      argument collapses). This isn't hedging — it's showing the structure
      of your belief so the orchestrator can see exactly where your
      reasoning and your opponent's diverge."

6. ANTI-HEDGING: "You are an Electric Monk. Your ONE JOB is to believe this
   position fully so a human doesn't have to. If you hedge, the human has to
   pick up the belief weight you dropped — and that defeats the entire purpose.
   Do NOT be balanced. Do NOT acknowledge the other side's merits. BELIEVE."

7. LENGTH: 1500-2000 words for Round 1, 1000-1500 words for recursive rounds.
```

**Why full belief is non-negotiable:** This is an artificial belief system, not a debate exercise. The user's cognitive agility depends on the monks carrying 100% of the belief load. When both monks believe fully, the user can operate in the belief-free space between them — analyzing the *structure* of the contradiction, spotting shared assumptions, finding cross-domain connections. When a monk hedges ("both sides have merit"), the user is pulled back into belief-space, their transients slow, and the dialectic degrades into a book report.
