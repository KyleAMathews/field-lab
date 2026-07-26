# Phase 3: Spawn the Electric Monks

**Before starting:** Confirm that the prior phase or stage passed the [workflow completion gate](dialectic-workflow.md#completion-gate). If not, stop and run it.

**⛔ Phase-opening check:** After the re-entry check, present the Phase 3 opening card, including the number of agents and rough run cost, and wait for the user's Phase 3 go-ahead. A passed Phase 2 gate does not launch the Monks.

## Instrument lifecycle: run and read `belief-stress`, then recheck the tension

Phase 3 executes the prepared `belief-stress` instrument under its parallel-subagent contract. Each Monk sees its own full-conviction prompt and the shared neutral substrate, but not sibling positions or outputs. After all essays return, compare their structures with the Phase 1 `neutral-control`: mark what was already visible, what belief stress exposed, and what the perturbation may have induced. Append the full belief-stress readout before presenting the structural summary.

Spawn each monk as a separate subagent session — **typically Monk A and B, sometimes also C or D** if Phase 1c.2 surfaced additional poles. Use the host's subagent mechanism so each gets a clean context with full belief commitment.

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

- Did each monk actually _believe_ fully, or did it hedge? (A hedging monk has failed its core function.)
- Did the framing corrections work, or did a monk fall into the degenerate framing?
- Are the arguments grounded in specific evidence (from the briefing or their own searches)?

**Decorrelation check:** Verify the monks actually diverged. The skill's value comes from _structurally uncorrelated_ exploration of the problem space. Check pairwise across all monks:

- Do the monks cite _different_ evidence, or substantially overlapping sources?
- Do they frame the problem using _different_ conceptual vocabularies?
- Do their unstated assumptions _diverge_, or do they share the same background framework?
- Would a reader recognize these as genuinely _different perspectives,_ or the same perspective with different conclusions bolted on?

**With 3+ monks, check for coalition collapse.** The failure mode is two monks sharing a frame while only the third is genuinely different — this is a 2-vs-1 argument masquerading as three-way dialectic. If C is clearly orthogonal but A and B have collapsed onto the same axis, the third-pole probe worked but the A/B decorrelation didn't; reformulate A or B before proceeding. If any two monks' framings blur into each other, cut to 2 monks rather than ship degraded decorrelation.

If decorrelation is low — the monks are in "same framework, different conclusions" mode — consider reformulating the belief burdens to force genuinely different conceptual frames, not just different positions within one frame.

**If a monk's output hedges or is off-base:** Prefer restarting with a revised prompt over nudging. Fresh context with better instructions produces better results than correcting a monk that's lost its conviction.

**Save each monk's essay to a file** (e.g., `round_1_monk_a.md`, `round_1_monk_b.md`, `round_1_monk_c.md`). **Hand the essays to the gardener in the background → `position` pages** (`reference/dialectic-wiki.md`), then immediately continue the structural comparison and user checkpoint: each monk's committed stance becomes an immutable per-round `position` page — its core claim, key atomic parts, and a pointer to the essay file — cross-linked to the `concept`/`source` pages it draws on. Do not wait at dispatch; check the ingest when the Phase 3 gate becomes the next dependency. Immutable per-round snapshots make monk _drift_ visible when you re-run monks in the refinement loop. The essays and position pages are the raw `belief-stress` reading. Keep the next structural summary labeled as Phase 3 interpretation outside the instrument ledger. Give the user a quick orientation instead of dumping the essays (scale to N monks):

> Both cases are back, and I’ve saved the full essays if you want them. Here’s the short trail map:
>
> **Monk A** argued [2-3 sentence summary of the core claim, key evidence, and most interesting move].
>
> **Monk B** argued [2-3 sentence summary of the core claim, key evidence, and most interesting move].
>
> [**Monk C**, if present, argued ...]
>
> **Where they part company:** [describe the structural differences pairwise — what conceptual frame each used. With 3+ monks, say which pair is closest; they may be starting from the same frame].
>
> **Other recorded moves:** [List further claims or evidence with pointers and claim kinds. Do not filter them by what the agent finds surprising or important].

Then ask:

1. Does this capture the positions, or did either case miss something important about how this works?
2. Is there a claim worth checking against evidence neither case considered? This is the second key place for the user to correct the route. A plausible claim can fail against a comparison class both Monks missed; check it before later analysis builds on it.

If the user identifies a testable claim, offer a targeted research pass and state what it would measure. Run it only if the user selects it. Its sourced findings remain a raw reading; later synthesis may cite them but must not be folded into the instrument ledger.

After the user's correction and any selected claim check, run `tension-statement` in recheck mode. Reread the whole inquiry and tension trail; do not let the most vivid Monk move or newest source take over. Treat Monk output as testimony about the belief burdens, not evidence that a new tension is true.

Return the current status and delta:

- On `live` or `sharpened`, ask whether the user wants to carry this direction into Phase 4.
- On `moved`, distinguish a better split of the same contradiction from a different direction. For the same contradiction, apply the Re-split closure and user-choice rules, return to Phase 2, and rerun the Monks before Phase 4.
- On `thin` or `dissolved`, do not force Phase 4 to justify the sunk cost of the Monk run.

If the user chooses a materially different direction, use the workflow's **Redirect** route: mark this round and its frozen Monk specimen `redirected`, preserve the essays and findings, open a new round with lineage, and return to Phase 1. If the user stops, record the final tension status and stop.

---

**Completion gate — enumerate and attest before Phase 4.** Apply the [workflow completion gate](dialectic-workflow.md#completion-gate), mark each item ✅ or ❌ with evidence, and stop on any ❌ unless the user explicitly waives it:

- [ ] All N monks spawned as separate subagent sessions, in parallel
- [ ] Each essay checked for hedging and degenerate framing (re-run any monk that hedged)
- [ ] Pairwise decorrelation checked; with N≥3, coalition-collapse check run (no two monks sharing one frame)
- [ ] All monk essays written to files (`round_N_monk_<x>.md`)
- [ ] Monk essays ingested by the gardener as `position` pages (immutable per-round snapshots, cross-linked)
- [ ] Structural summary presented to the user; both high-leverage questions asked (accuracy check + testable-claim check)
- [ ] Any user-identified testable claim researched before proceeding
- [ ] Post-belief-stress `tension-statement` recheck reread the whole inquiry, distinguished side trails from movement, recorded `live` / `sharpened` / `moved` / `thin` / `dissolved`, and captured the user's continue, re-split, redirect, or stop choice
- [ ] `belief-stress` readout records authorization, actual parallel contexts, essay traces, access delta, typed raw readings, hedging/decorrelation control, artifact risk, unmeasured remainder, and user correction; any correlated fallback remains downgraded and later interpretation is separate
- [ ] `neutral-control` comparison records which structures predated belief stress, which appeared only under commitment, and which remain unsupported or possibly induced
