# Phase 3: Spawn the Electric Monks

Spawn each monk as a separate subagent session — **typically Monk A and B, sometimes also C or D** if Phase 1c.1 surfaced additional poles. Use `claude -p` (or your environment's equivalent for spawning an independent agent) so each gets a clean context with full belief commitment.

```bash
# Example for Claude Code (scales to N monks):
echo "[MONK A PROMPT]" | claude -p --allowedTools web_search,web_fetch,read_file > round_1_monk_a.md
echo "[MONK B PROMPT]" | claude -p --allowedTools web_search,web_fetch,read_file > round_1_monk_b.md
# If third-pole probe added a Monk C:
echo "[MONK C PROMPT]" | claude -p --allowedTools web_search,web_fetch,read_file > round_1_monk_c.md
```

Run all monks in parallel if your environment supports it.

**Efficiency note:** With the context briefing in place, monks need only 2-3 targeted searches each (vs. 15-25 without it). For personal/values domains, monks may need zero additional searches — the briefing contains the user's own material which is the primary evidence base.

**For recursive rounds (Phase 7):** See Phase 7 for guidance — recursive rounds may or may not need new research depending on whether the new contradiction opens new conceptual domains.

**After both complete:** Read both outputs carefully. Check:
- Did each monk actually *believe* fully, or did it hedge? (A hedging monk has failed its core function.)
- Did the framing corrections work, or did a monk fall into the degenerate framing?
- Are the arguments grounded in specific evidence (from the briefing or their own searches)?

**Decorrelation check:** Verify the monks actually diverged. The skill's value comes from *structurally uncorrelated* exploration of the problem space. Check pairwise across all monks:
- Do the monks cite *different* evidence, or substantially overlapping sources?
- Do they frame the problem using *different* conceptual vocabularies?
- Do their unstated assumptions *diverge*, or do they share the same background framework?
- Would a reader recognize these as genuinely *different perspectives,* or the same perspective with different conclusions bolted on?

**With 3+ monks, check for coalition collapse.** The failure mode is two monks sharing a frame while only the third is genuinely different — this is a 2-vs-1 argument masquerading as three-way dialectic. If C is clearly orthogonal but A and B have collapsed onto the same axis, the third-pole probe worked but the A/B decorrelation didn't; reformulate A or B before proceeding. If any two monks' framings blur into each other, cut to 2 monks rather than ship degraded decorrelation.

If decorrelation is low — the monks are in "same framework, different conclusions" mode — consider reformulating the belief burdens to force genuinely different conceptual frames, not just different positions within one frame.

**If a monk's output hedges or is off-base:** Prefer restarting with a revised prompt over nudging. Fresh context with better instructions produces better results than correcting a monk that's lost its conviction.

**Save each monk's essay to a file** (e.g., `round_1_monk_a.md`, `round_1_monk_b.md`, `round_1_monk_c.md`). **Present a structural summary to the user** — not the essays themselves. The essays are raw material for the orchestrator's decomposition; most users won't read them and shouldn't need to. Give the user a quick orientation instead (scale to N monks):

> The monks have written their essays (saved to files if you want to read them). Here's the structural summary:
>
> **Monk A** argued [2-3 sentence summary of the core claim, key evidence, and most interesting move].
>
> **Monk B** argued [2-3 sentence summary of the core claim, key evidence, and most interesting move].
>
> [**Monk C**, if present, argued ...]
>
> **Where they diverged:** [describe the structural differences pairwise — what conceptual frame each used. With 3+ monks, note which pair diverged most and which least — the pair that diverged least is a decorrelation risk].
>
> **Anything surprising:** [Note if a monk made an unexpected move, cited evidence you didn't anticipate, or took the position somewhere the user might not have expected].

Then ask:
1. Does this capture the positions accurately, or is either monk missing something important about how this actually works?
2. **"Is there a claim either monk makes that should be tested against evidence neither has considered?"** — This is the second high-leverage intervention point. In testing, users identified claims that sounded plausible but collapsed under scrutiny when tested against comparison classes the monks didn't consider. Catching this before synthesis prevents the entire downstream analysis from being built on an untested assumption.

If the user identifies a testable claim, run a targeted research agent to check it. This is cheap (~25-50K tokens) and can fundamentally change the quality of the synthesis.
