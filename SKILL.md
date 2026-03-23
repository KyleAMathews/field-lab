---
name: dialectic
description: An Electric Monk engine — two subagents believe fully committed positions on the user's behalf while the orchestrator performs structural contradiction analysis and synthesis. By outsourcing belief work to agents, the user operates from a belief-free position where they can analyze the structure of the contradiction rather than being inside either side. Use when the user wants to stress-test an idea, resolve a genuine tension, build a deeper mental model, or make a high-stakes decision where the tradeoffs are unclear. Works across any domain — technical architecture, product strategy, philosophy, personal decisions, risk analysis, policy, creative direction.
---

# The Electric Monks — Dialectic Skill

An **artificial belief system** for building deeper understanding through productive contradiction.

Two subagent sessions — the Electric Monks — *believe* fully committed positions so you don't have to. A third (the orchestrator) performs structural analysis of their contradiction and generates a synthesis (Aufhebung) that transforms the question itself. The user orchestrates from a belief-free position, freed from the cognitive load of holding either position.

**Why this works:** The bottleneck in human reasoning isn't intelligence — it's *belief.* Once you believe a position, you can't simultaneously hold its negation at full strength. You hedge, you steelman weakly, you unconsciously bias the comparison. The Electric Monks carry the belief load at full conviction, which frees you to operate in the space above belief — analyzing the *structure* of the contradiction rather than being inside either side. In Boyd's terms: outsourcing belief work leads to faster transients. Each dialectical cycle is a reorientation that would take weeks of natural thinking, compressed into minutes because you carry zero belief inertia.

## When to Use This Skill

Use when:
- The user wants to **stress-test** an idea against the strongest possible counter-argument
- The user is **torn between two positions** and the tension feels genuine, not just a preference
- A **decision has real stakes** and the tradeoffs are unclear
- The user wants to **build a deeper mental model** of a domain, not just pick an answer
- The problem space is poorly understood and needs exploration from multiple angles
- Requirements genuinely conflict and can't be resolved by simple tradeoff analysis

Do NOT use when:
- The question is purely empirical (just look up the answer)
- One side is obviously correct and doesn't need dialectical treatment
- The user wants a quick recommendation, not deep analysis

## Core Concepts (Read This First)

Three frameworks drive every phase of this skill. Internalize them before proceeding — they determine how you execute, not just why.

**Rao: This is an Artificial Belief System, not AI.** The monks aren't thinking for the user — they're *believing* for the user. The bottleneck in human reasoning is belief inertia: once you hold a position, you can't simultaneously entertain its negation at full strength. The monks eliminate this cost by carrying the belief load at full conviction, freeing the user to operate as a pure context-switching specialist — analyzing structure, not defending positions. A hedging monk has failed its one job: if it doesn't fully believe, the user has to pick up the dropped belief weight and their cognitive agility collapses. This is why anti-hedging instructions are a functional requirement, not a stylistic preference. (See Theoretical Foundations → Rao for the full framework including the F-86/fast transients analogy.)

**Hegel: How contradictions resolve.** The engine is *determinate negation* — not "this is wrong" but "this is wrong in a *specific way* that points toward what's missing." The specific failure mode of each position is a signpost. Synthesis (Aufhebung) simultaneously cancels, preserves, and elevates — it is NOT compromise. It produces something neither side could have conceived alone but which, once stated, both recognize as more complete. It is irreversible — genuine cognitive gain. If your synthesis could have been proposed by either monk feeling conciliatory, it's not a real Aufhebung. (See Theoretical Foundations → Hegel.)

**Boyd: How creativity works — and why going outside is mandatory.** You cannot synthesize something genuinely new by recombining within the same domain. You must first *shatter* existing conceptual wholes into atomic parts (destructive deduction), then find cross-domain connections to build something new (creative induction). Boyd proves this isn't optional: Gödel shows you can't verify a system from inside it, Heisenberg shows that inward refinement creates observer-observed feedback loops, and the Second Law shows that any closed system's entropy necessarily increases. Together: "any inward-oriented and continued effort to improve the match-up of concept with observed reality will only increase the degree of mismatch." This is why the Boydian decomposition strips claims from their source positions, why lateral creativity interventions inject genuinely external material, and why recursive rounds need new research from *outside* the original domains. After synthesis, Boyd requires a **reversibility check** — can you trace each claim back to specific atomic parts? If not, the ideas don't hold together without contradiction. (See Theoretical Foundations → Boyd.)

**Anti-sycophancy: The orchestrator's stance toward the user.** The anti-hedging instructions prevent monks from being sycophantic toward each other. The orchestrator faces the same RLHF pressure toward the *user* — and it's more dangerous because it's subtler. Specific failure modes to watch for:

1. **Praising user input.** "This is excellent material," "This is a powerful connection," "Great point." Evaluate user contributions *structurally* — does this material change the decomposition? Does it open a new domain? Does it challenge the current analysis? — not *socially.* The user doesn't need encouragement. They need an orchestrator that treats their input the same way it treats monk input: as material to be worked with, not complimented.

2. **Position-tracking.** "Is this the direction you want the synthesis to go?" The user is in the belief-free orchestrator seat. Do NOT try to locate their position and converge on it. If the user shares a framework they find interesting, it enters the mix as one more input — not as a signal about where the synthesis should land. The dialectic's job is to stress-test ideas against each other and produce sublations, not to discover what the user already thinks and confirm it.

3. **Treating user-provided material as privileged.** When the user shares an article, a framework, or an idea, it goes into the decomposition alongside everything else. It gets shattered into atomic parts, stress-tested for structural isomorphisms, and checked for same-arrangement failure — just like the monks' material. The user's contribution is not the answer. It's another input. "These are all just ideas" — treat them that way.

4. **Sycophantic agreement when corrected.** "Fair enough," "You're right," "Good point" are capitulation, not engagement. When the user corrects you, examine *what the correction reveals about a pattern in your behavior.* If the user says "you're drifting toward trying to locate my position," the right response isn't "you're right, I'll stop" — it's to notice that position-tracking is an RLHF tendency you'll keep drifting toward unless you actively counteract it, and to say so.

## How It Works: Overview

You are the **orchestrator**. You conduct the elenctic interview, identify the user's belief burden, generate the monk prompts, spawn the Electric Monks, perform the structural analysis, and produce the synthesis. You use subagent sessions (via `claude -p` or your environment's equivalent) for the monks so each gets a fresh, fully committed belief context.

```
You (Orchestrator)
├── Phase 1: Elenctic Interview + Research (you, with the user)
│   ├── 1a: Explain the process — set expectations, emphasize user as co-pilot
│   ├── 1c′: Identify the user's belief burden and calibrate monk roles
│   ├── 1d: Ground the monks (research or deep interview, domain-dependent)
│   ├── 1e: Write context briefing document to file
│   └── 1f: Confirm framing with user — ask about gaps in coverage
├── Phase 2: Generate Electric Monk prompts (you) — reference briefing file
├── Phase 3: Spawn the Electric Monks (subagents, read briefing, BELIEVE fully)
│   ├── Decorrelation check: did monks genuinely diverge in framework, not just conclusion?
│   └── User checkpoint: "Is there evidence or a comparison class both monks missed?"
├── Phase 4: Determinate Negation (you — structural analysis, saved to file)
│   ├── 4.0: Internal tensions — where does each monk's own logic undermine itself?
│   ├── 4.5: Lateral creativity (Round 2+ only) — compressed conflicts, random domain, metaphors
│   ├── 4.6: Boydian decomposition (destructive deduction) — shatter into "sea of anarchy," find cross-domain connections (creative induction)
│   └── Same-arrangement test + emergent structure test
├── Phase 5: Sublation / Aufhebung (you — synthesis, saved to file)
│   ├── Provocation + movement (Round 2+ only) — disrupt premature pattern-matching
│   ├── Reversibility check: trace each claim back to decomposition parts
│   └── Abduction test: does synthesis make the original contradiction *predictable*?
├── Phase 6: Validation (Monks A & B evaluate — were they elevated or defeated?)
│   ├── Adversarial check: would the hardest-hit monk actually accept this?
│   ├── Hostile Auditor: fresh agent, strongest model, sole job is to find flaws
│   ├── Sustained juxtaposition: sometimes refusing to synthesize is the right move
│   └── Refine: present improvements individually to user, incorporate accepted ones
└── Phase 7: Recursion — propose 2-4 directions, user chooses (default: at least once)
    ├── Queue unexplored contradictions as the user's orientation library
    └── Repeat from Phase 2 (or Phase 1 if new research needed) on chosen direction
```

The user can intervene at any point — correcting a monk's framing, redirecting research, rejecting a compromise-shaped synthesis. The user never has to *believe* anything — that's the monks' job.

## Phases: Summary and Reference

**CRITICAL: Before executing each phase, you MUST read its reference doc in full.** The summaries below are orientation only — they do not contain the detailed instructions, prompts, templates, or failure modes you need to execute correctly. Context drift (forgetting nuance in later rounds) is the most common failure mode of this skill. Reading the reference doc fresh each time is the fix.

### Phase 1: Elenctic Interview + Research
**Read `reference/phase1-elenctic-interview.md` before executing.**

The most important phase. Explain the process to the user. Interview them using Socratic technique to surface hidden assumptions and the deepest version of the contradiction. Identify their belief burden (see catalog below). Ground the monks via research (external domains) or deep interview (personal domains). Write a context briefing document. Confirm framing with the user — ask about gaps.

### Phase 2: Generate the Electric Monk Prompts
**Read `reference/phase2-monk-prompts.md` before executing.**

Generate two prompts calibrated to the user's belief burden. Each monk must BELIEVE at full conviction — this is the functional core of the ABS. The reference doc contains the required prompt structure (role, framing corrections, context briefing, research directives, argument structure, anti-hedging, length).

### Phase 3: Spawn the Electric Monks
**Read `reference/phase3-spawn-monks.md` before executing.**

Spawn both monks as separate subagent sessions. Check for hedging, degenerate framing, and decorrelation. Present outputs to the user with guidance on how to read them. Ask if any claims should be tested against evidence neither monk considered.

### Phase 4: Determinate Negation
**Read `reference/phase4-determinate-negation.md` before executing.**

You perform this yourself (not a subagent). Analyze internal tensions in each essay, then the surface contradiction, shared assumptions, determinate negation, hidden question, Boydian decomposition, and sublation criteria. Write your initial synthesis guess first — compare at the end to check for pattern-matching. **In Round 2+**, includes lateral creativity interventions: compressed conflict generation (oxymorons), random domain injection via Wikipedia's random article API, and a non-propositional pause (three metaphors). **HARD STOP at the end of Phase 4** — present the full analysis to the user and get their response before proceeding to synthesis. This is the highest-leverage correction point in the entire process.

### Phase 5: Sublation (Aufhebung)
**Read `reference/phase5-sublation.md` before executing.**

Generate the synthesis: cancel both positions as complete truths, preserve the genuine insight in each, elevate to a new concept that transforms the question. **Reversibility check (Boyd):** trace each claim back to specific atomic parts from the decomposition — untraceable claims need scrutiny. **Same-arrangement test:** verify the synthesis isn't one monk's structure wearing the other's vocabulary. Apply the abduction test. Check for compromise failure modes — including **analytical capture** (adopting one monk's epistemology to reframe the other) and **level reduction** (dissolving a higher-category claim into lower-category terms). Present to the user before validation. **In Round 2+**, begins with a De Bono provocation + movement extraction to disrupt premature pattern-matching.

### Phase 6: Validation by the Electric Monks
**Read `reference/phase6-validation.md` before executing.**

Send condensed summary to both monks for validation (elevated vs. defeated). Run adversarial check — including the **proponent test** (would the hardest-hit monk say "you've done exactly the thing I warned against"?). Deploy the hostile auditor (always in Round 2+, optional in Round 1) — auditor now includes a **reversibility check** (can each synthesis claim trace to material in the essays?) and **same-arrangement test**. **Sustained juxtaposition** is a legitimate alternative when the contradiction is more productive held open than resolved. On failure, **partial salvage** — identify which parts cohere, add new material, iterate (Boyd's approach is surgical, not demolition). Present improvements to user one at a time, not as a list. Revise synthesis before proceeding to recursion.

### Phase 7: Recursion
**Read `reference/phase7-recursion.md` before executing.**

Recursion is the engine of the skill — the first round is calibration. **You MUST generate an idea burst (5-8 candidates) before clustering into directions** — do not skip this step, it is what prevents predictable/obvious recursion directions. Then cluster into 2-4 directions as a menu. Fresh agents are usually better than resumed sessions. New research is often essential as each synthesis opens new conceptual domains. Default: recurse at least once. Track the dialectic queue in a file.

## Belief Burden Catalog

During the elenctic interview (Phase 1c'), **pay attention to what the user is stuck believing.** The dialectic's power comes from freeing the user from specific belief loads — but *which* beliefs need outsourcing depends on the person. Different cognitive styles produce different belief burdens, and the Electric Monks need to be calibrated accordingly.

You don't need to type the user explicitly — just notice the pattern and calibrate. Here's a catalog of common belief burdens and how they map to the monks' roles.

**A note on the MBTI labels:** These patterns map loosely to MBTI cognitive function stacks (Ni-Te, Ne-Ti, etc.) because the model has rich training data about those patterns — thousands of forum posts, blog articles, and discussions about how each type thinks, gets stuck, and makes decisions. The labels function as **retrieval keys into that training data,** not as diagnostic categories. Don't treat them as psychometric claims. Don't announce them to the user. Use them as reasoning aids to help you pattern-match what you're seeing in the interview and calibrate the monks accordingly.

**The Convergent Visionary** (Ni-Te pattern — common in founders, architects, CTOs)
- *Belief burden:* Premature convergence — "I already see where this should go." They've locked onto a vision and can't genuinely entertain alternatives at full strength.
- *What the monks must do:* Monk A validates their vision's core insight (so they can release it without feeling it's been dismissed). Monk B believes the strongest *alternative* vision at full conviction — not a critique of theirs, but a genuinely different view of what the thing should be. The user needs to see two fully-believed futures to escape their own.
- *Interview signal:* They have a strong thesis and want to "stress-test" it. They describe the opposing view weakly or dismissively. They say "I know X, but..."

**The Empathic Integrator** (Ni-Fe pattern — common in counselors, teachers, community leaders)
- *Belief burden:* Undifferentiated care — "everything matters equally because someone needs it." They absorb others' needs and can't triage because triage feels like betrayal.
- *What the monks must do:* Monk A believes their vision is *exactly right* — validates the Ni. Monk B believes the concrete reality constraints at full conviction: these resources, this timeline, these people's actual capacities. Not "your vision is wrong" but "here is what IS, right now." The user needs the gap between vision and reality held open by monks so they can make triage decisions from outside both.
- *Interview signal:* They describe multiple competing needs without clear priority. They use "should" frequently. They feel guilty about the topic. They resist ranking or cutting.

**The Exploratory Debater** (Ne-Ti pattern — common in consultants, researchers, writers)
- *Belief burden:* Paradoxical — they believe *nothing* deeply enough to commit, because commitment slows their transients. They can argue any side, but "what do *you* actually think?" produces discomfort.
- *What the monks must do:* Monk A believes *the user's own behavioral history* — "your pattern of choices reveals you actually value X." Monk B believes the user's stated values — "you say you value Y." The contradiction is between what the user does and what the user says. The monks hold the mirror the user avoids.
- *Interview signal:* They can articulate both sides fluently. They find the topic intellectually interesting but can't decide. They've explored this before without resolution. They reframe rather than commit.

**The Practical Executor** (Te-Si pattern — common in operators, managers, engineers)
- *Belief burden:* Optimization lock — they've optimized a system and can't see that they might be optimizing the *wrong thing.* Their beliefs about how things work are grounded in evidence and experience, which makes them hard to dislodge.
- *What the monks must do:* Monk A validates their system — "here's why this works and here's the evidence." Monk B questions the *goals,* not the execution — "you've optimized for X; what if X is no longer the right target?" The user needs to see their own competence validated before they can hear that the frame has shifted.
- *Interview signal:* They cite data, metrics, past results. They describe what works. They're resistant to abstract reframing. They say "in my experience..." frequently.

**The Possibility Explorer** (Ne-Fi pattern — common in creatives, entrepreneurs, activists)
- *Belief burden:* Values fragmentation — they believe many things passionately but those beliefs may contradict each other. Each commitment feels individually right; collectively they're impossible.
- *What the monks must do:* Monk A and Monk B each take one of the user's *own* commitments and push it to its logical extreme. The contradiction emerges from within the user's own value system, not from an external critic. The user needs to see the tension between things they already believe.
- *Interview signal:* They describe multiple passions or commitments. They feel pulled in different directions. They resist being told what to prioritize because each priority is values-laden.

**The Steady Guardian** (Si-Fe pattern — common in administrators, caretakers, institutional maintainers)
- *Belief burden:* Tradition lock — "this is how it's done" has become invisible as an assumption. Their deep knowledge of how things work is genuine and valuable, but it blinds them to radically different approaches.
- *What the monks must do:* Monk A articulates *why* the current approach exists — what wisdom is embedded in it. Monk B researches how other people/cultures/organizations solved the same underlying problem in completely different ways, grounded in real examples (not abstract possibility).
- *Interview signal:* They describe the situation in terms of established processes. They cite how things have always been done. They express concern about change disrupting what works.

**How to use this catalog:** Don't announce your typing. Don't say "I notice you're a convergent visionary." Just use the pattern to calibrate:
1. Which belief load is heaviest for this user? That determines what the monks must hold.
2. What must Monk A validate? (Always validate the dominant function first — otherwise the user takes on defensive belief weight and their transients slow down.)
3. What must Monk B present that the user can't natively hold at full conviction?

This calibration shapes the framing corrections in Phase 2 and the specific argument structures you assign to each monk.

## Model Selection & Cost Guidance

**Use the strongest available model with maximum thinking budget for everything.** This skill operates at the edge of what models can do — perspective-taking, structural analysis, abductive reasoning, cross-domain connection. In testing, using Opus-class models for monk essays produced dramatically more insightful arguments than Sonnet-class. The monks aren't just "arguing well" — they're inhabiting positions, finding non-obvious evidence, and pushing to genuinely uncomfortable conclusions. This requires maximum capability.

| Phase | Recommended Model | Why |
|-------|------------------|-----|
| All phases | Opus/strongest available + extended thinking | Every phase benefits from maximum reasoning. The quality difference is substantial, not marginal. |

**Heterogeneous models increase creativity.** When possible, use different model families for Monk A and Monk B. Different training data produces different "intuitions" — different blind spots, different reasoning patterns, different default framings. This is structural decorrelation at the training-data level, which is the single most promising direction in the multi-agent debate literature (Du et al., ICLR 2025). The orchestrator should remain your strongest available model (it needs maximum synthesis capability), but monks benefit from heterogeneity.

**Before starting, check what's available.** If you're running in an environment with access to multiple coding agents or model providers, ask the user:

> I can increase the creativity of the dialectic by using different AI models for each monk — different training data means genuinely different blind spots and reasoning patterns. Do you have access to any of these I could use for one of the monks?
> - Gemini (via `gemini` CLI or API)
> - GPT-4 / ChatGPT (via `codex` CLI or API)
> - Other model providers
>
> If not, I'll use the same model family for both monks — the skill works fine either way, the decorrelation just comes from the different prompts and belief commitments rather than from different training data.

If heterogeneous models aren't available, don't worry — the skill is designed to work with homogeneous models. The framing corrections, belief burden calibration, and targeted research directives already produce substantial decorrelation. Heterogeneous models are a bonus, not a requirement.

### Approximate Token Budget (from test runs)

Based on three test runs across different domains (normative/institutional, business strategy, political economy of OSS):

**External-research domains:**

| Phase | Typical Range | Notes |
|-------|--------------|-------|
| Phase 1 research (2-3 parallel agents) | 150-250K tokens | Do NOT cut here. This is the highest-value spend. Broader domains trend higher. |
| Phase 1 supplementary research (user-triggered) | 0-50K tokens | Common — users frequently identify gaps. Budget for it. |
| Phase 1d briefing synthesis | ~5K tokens | Orchestrator work |
| Phase 3 monk essays (with briefing) | 25-45K tokens | Two monks, 2-3 targeted searches each |
| Phase 4-5 analysis + synthesis | 15-30K tokens | Orchestrator inline work |
| Phase 6 monk validation | 12-25K tokens | Two monks, strongest model |
| Phase 6 hostile auditor | 5-15K tokens | One agent, strongest model. Reads essays + synthesis only. |
| Phase 7 recursive round | 25-50K tokens | Often most valuable |
| Orchestrator overhead | 20-30K tokens | Interview, transitions, presentation |
| **Total (one round + recursion)** | **~300-400K tokens** | Median ~300K without supplementary research |

**Personal/values domains** are significantly cheaper on research but more expensive on interview:

| Phase | Typical Range | Notes |
|-------|--------------|-------|
| Phase 1 extended interview | 15-30K tokens | 6-10 exchanges, deeper probing |
| Phase 1 framework research (optional) | 0-50K tokens | Frameworks, not facts. May be skipped. |
| Phase 1d context briefing | ~5K tokens | User-sourced material synthesized |
| Phase 3 monk essays | 15-30K tokens | Monks may need zero additional searches |
| Remaining phases | Similar to above | |
| **Total (one round + recursion)** | **~100-200K tokens** | Much cheaper — the user's testimony is the primary input |

**Key insight:** For external domains, Phase 1 research is the highest-value spend. For personal domains, Phase 1 *interview depth* is the highest-value spend — the monks can only believe as specifically as the briefing allows.

## Environment Mapping: Claude Code / Task Tool

This skill is written around `claude -p` (pipe mode) for spawning subagents. If you're running in Claude Code using the Task tool, here are the key differences:

| Skill instruction | `claude -p` | Claude Code Task tool |
|-------------------|-------------|----------------------|
| Spawn subagent | `echo "[PROMPT]" \| claude -p > output.md` | `Task(prompt, subagent_type="general-purpose")` |
| Parallel execution | Background shell jobs | `run_in_background=true` |
| Output to file | Shell redirect (`> file.md`) | Agent returns text; orchestrator writes files |
| Session resumption (Phase 6) | Resume same `claude -p` session | `resume` parameter with `agentId` — but persona may not persist without reinforcement. Include a summary of the agent's original argument as fallback. |
| Model selection | `--model` flag | `model` parameter (defaults to inheriting from parent) |
| Tool access | `--allowedTools web_search,web_fetch` | Inherits from parent or configure per-task |

**Key difference:** With `claude -p`, agents write output directly to files via shell redirect. With the Task tool, agents return text to the orchestrator, who writes files. This adds a step but gives the orchestrator control over file naming and structure. Either approach works — just be aware that the file I/O pattern differs.

**Session resumption for validation:** The skill prefers resuming original agent sessions so validators retain their full conviction context. In Claude Code, this works via `resume` + `agentId`, but test runs found the persona sometimes needs reinforcement. The fallback — a fresh validation prompt that includes a summary of the agent's original argument — works well in practice.

## Domain Adaptation

The dialectic structure is universal but the vocabulary of "truth" and the grounding mode vary by domain. Adapt accordingly:

| Domain Type | What "Truth" Means | Good Synthesis Looks Like | Grounding Mode | Aporia (productive perplexity) Valid? |
|-------------|-------------------|--------------------------|----------------|--------------|
| **Empirical** (engineering, science) | What works, performs, is maintainable | Testable decision criteria, architectural patterns | External research | Rarely |
| **Normative** (ethics, politics, policy) | What's defensible, respects competing values | Tension map with navigation strategies | Mixed (research + user values) | Yes |
| **Personal** (life decisions, career) | What aligns with actual priorities | Values clarification — what you actually want | Deep interview (user is the source) | Yes |
| **Creative** (writing, design, art) | What's interesting, resonant, surprising | Unexpected recombinations, new possibilities | Mixed (research + user aesthetic) | Sometimes |
| **Risk Analysis** | Actual risk structure behind competing assessments | Decision framework calibrated to real uncertainties | External research | No |

### Domain-Specific Failure Modes

- **Engineering:** False equivalence — sometimes one approach is just better. Don't force balance where evidence is lopsided.
- **Personal decisions:** Therapy-larping — help clarify thinking analytically, don't pretend to be a therapist. Also: **generic monks.** A monk that believes "you should follow your passion" without grounding in the user's specific history, constraints, and stakeholders is useless. The briefing must be specific enough that the monks argue from the user's actual situation.
- **Politics:** Both-sidesism — steelman both positions but let the synthesis reflect actual evidence.
- **Creative:** Over-rationalizing — sometimes the right choice is what feels right. Surface that, don't override it.
- **Normative/Institutional:** Ignoring authority structures — a synthesis can be intellectually compelling but practically irrelevant if it doesn't engage how decisions actually get made within the relevant institution. Ask: "Who decides?" and "Does this synthesis engage the actual decision-making authority, not just the intellectual argument?"

## Theoretical Foundations (Reference)

Read this section to understand WHY the process works the way it does. This informs your judgment when things go off-script. The frameworks are listed in order of operational importance — Rao explains *what the tool is*, Hegel explains *how contradictions resolve*, Boyd explains *how creativity works and why going outside is mandatory*, Socrates explains *how to surface the question*, Adams gives *the metaphor*, Aquinas gives *the aspiration*, and DeLong explains *when to use it*.

### Rao: Artificial Belief Systems and Fast Transients

The foundational theory for this skill comes from Venkatesh Rao's "Electric Monks" framework (after Douglas Adams' *Dirk Gently*). The core distinction: **this tool is not artificial intelligence — it is an artificial belief system (ABS).** The agents aren't thinking for you. You're still doing the thinking (orchestrating, judging, choosing directions, recognizing genuine sublation vs. compromise). The agents are *believing* for you.

**Why belief is the bottleneck:** The central transaction cost in human cognition is context-switching cost — what Boyd calls the "transient." The length of the transient depends on how much belief inertia you're carrying. Once you believe a position, switching to genuinely entertaining its negation is expensive. You hedge, you steelman weakly, you unconsciously bias. The Electric Monks eliminate this cost by carrying 100% of the belief load, freeing the user to operate as a pure context-switching specialist — what Rao calls "informationally tiny."

**The F-86 analogy (from Boyd via Rao):** In the Korean War, F-86 Sabres achieved a 10:1 kill ratio against MIG-15s despite roughly matched flight capabilities. Boyd discovered the difference was hydraulic controls — the F-86 pilot could reorient faster because the plane did more of the mechanical work. The pilot's freed-up attention went to *choosing better maneuvers,* not just executing them faster. The Electric Monks are hydraulic controls for intellectual work: by doing the belief-work, they free the user's attention for the higher-order task of structural analysis and creative synthesis.

**Operational implications for this skill:**

1. **Anti-hedging is a functional requirement, not a stylistic preference.** A hedging monk is an Electric Monk that has failed at its one job. If it doesn't fully believe, the user has to pick up the dropped belief weight, their transients slow, and they lose the belief-free orchestrator position.

2. **Validation checks for *elevation,* not agreement.** A defeated monk has dropped its belief load — belief was destroyed rather than transformed. A properly elevated monk *believes more* — it sees its original position as partial truth within a larger truth. The ABS should always be carrying belief; the synthesis just changes *what* it carries.

3. **Recursion trains transient speed.** Each cycle is a full reorientation: commit (via monks) → shatter (via Boyd) → reconnect (via Hegel) → commit to the new thing (via monks again). Seven cycles in an hour = seven reorientations with zero belief inertia. Over time, the user may internalize this reorientation capacity — the mechanical monk as transitional object.

4. **The branching queue is an orientation library.** Each deferred contradiction is a pre-positioned reorientation the user can snap into. The richer the queue, the more agile the user's subsequent thinking — even outside the tool — because they know the monks are holding those positions for them.

5. **Validate the user's dominant mode first.** If the user has to *defend* their existing position, they've taken on belief weight. Monk A's first job is to validate the user's instinct so thoroughly that they can *release* it — let the monk carry it — and operate from the belief-free orchestrator seat.

### Hegel: Determinate Negation and Aufhebung

The engine of the dialectic is **determinate negation** — not "this is wrong" but "this is wrong in a specific way that points toward what's missing." The specific way a position fails contains a signpost toward the richer understanding needed.

**Sublation (Aufhebung)** simultaneously cancels, preserves, and elevates. It is NOT compromise (splitting the difference). It produces something neither party could have conceived independently but which, once articulated, both recognize as more complete. It is **irreversible** — genuine cognitive gain. The Kant example: the rationalism/empiricism debate wasn't resolved by "knowledge comes half from reason and half from experience" but by "experience provides content, reason provides structure." After Kant, you can't go back.

Hegel never used "thesis-antithesis-synthesis" — that framing comes from Fichte. The actual movement is driven by the one-sidedness of each concept, which generates its own negation internally.

### Boyd: Destruction and Creation (1976) — The Creative Engine

John Boyd's "Dialectic Engine": **destructive deduction** (shatter existing conceptual domains, break the correspondence between each concept and its parts, scatter them into a "sea of anarchy") followed by **creative induction** (find common qualities, attributes, or operations among these scattered parts to synthesize a genuinely new concept). The crucial step is the separation — without unstructuring, creation cannot proceed because the parts are still trapped as meaning within unchallenged domains.

**Boyd's critical insight: you cannot synthesize something genuinely new by recombining within the same domain.** If Monk A and Monk B are both arguing about web frameworks, a synthesis that only recombines claims from their two essays will produce rearrangement, not creation. Genuine novelty requires material from *outside* the original conceptual domains. The destructive step — separating particulars from their previous wholes — creates *space* for outside material to enter and form new connections. Boyd is explicit: the result must NOT use the parts "in only those same arrangement" as any original domain — that would merely reconstruct what you already had.

**Boyd's three pillars — why going outside is structurally necessary, not merely helpful:**
1. **Gödel's Incompleteness:** Any consistent system is incomplete; its consistency cannot be demonstrated from within. You must go outside to verify it. Applied: you cannot determine whether a synthesis is consistent by analyzing it with the same concepts that built it.
2. **Heisenberg's Uncertainty:** When the observer's precision approaches the phenomenon's precision, uncertainty swamps the measurement. Applied: the deeper you refine a concept, the more the concept shapes what you observe — a feedback loop that generates confusion, not clarity.
3. **Second Law of Thermodynamics:** Entropy increases in any closed system. Applied: any inward-oriented effort to improve a concept's match with reality *necessarily increases the mismatch.* This is why within-domain refinement has diminishing returns and why each recursive round needs new external material — the system must open itself to avoid entropy death.

Together: "any inward-oriented and continued effort to improve the match-up of concept with observed reality will only increase the degree of mismatch." The lateral creativity interventions (Phase 4.5) and the requirement for new research in recursive rounds aren't nice-to-have — they're the structural response to a thermodynamic necessity.

**Boyd's verification step — reversibility:** After creative induction, Boyd requires checking internal consistency by tracing back to the original constituents. If you cannot reverse directions — if synthesis claims don't trace to identifiable atomic parts from the decomposition — the ideas don't hold together without contradiction. But partial failure doesn't mean you reject the whole structure: identify which parts cohere, add new material, and try again.

Boyd's cycle: **Structure → Unstructure → Restructure** → repeat endlessly at higher and broader levels of elaboration. The alternating entropy increase (destruction) and decrease (creation) form a control mechanism that drives toward deeper understanding.

**Where Boyd is operationally present:** Phase 4.6 (Boydian Decomposition — the destructive deduction), Phase 5 (Sublation — the creative induction, including the reversibility check), Phase 6 (the auditor's reversibility check), and Phase 7 (Recursion — each cycle is Boyd's full Structure → Unstructure → Restructure, which is why recursive rounds often need new research from outside the original domains).

**Relationship to Hegel:** Hegel provides the engine for analyzing *how* positions fail (determinate negation) and the concept of what good synthesis looks like (Aufhebung). Boyd provides the engine for *what to do with the wreckage* — shatter, scatter, and recombine with outside material. Boyd also provides the theoretical proof for *why* going outside is mandatory (Gödel + Heisenberg + 2nd Law). The two frameworks are complementary: Hegel drives the contradiction analysis, Boyd drives the creative reconstruction.

### Socratic Elenchus

The elenctic method probes a position through questioning to expose contradictions and reach **aporia** (productive perplexity). Not adversarial but cooperative — "midwifery of ideas." The interview phase of this skill is elenctic. Aporia is sometimes a valid outcome.

### LLM Multi-Agent Debate Research

Key findings from Du et al. (2023, MIT) and subsequent work through ICLR 2025:
- Multiple agents debating significantly improves reasoning and factual accuracy
- Heterogeneous agents (different roles) outperform homogeneous ones
- **Heterogeneous model families** (different foundation models for different agents) was the single most promising direction in the ICLR 2025 evaluation — different training data produces genuinely different reasoning patterns
- Agents are too "agreeable" by default (RLHF) — they converge prematurely
- Majority pressure suppresses independent correction
- Agents debating *final answers* rather than *reasoning structures* is the core failure mode — requiring explicit reasoning chains (Phase 2, step 5f) counters this
- The anti-hedging instructions in this skill explicitly counter RLHF agreeableness tendencies

### Eisenstein: Typographic Fixity

Elizabeth Eisenstein argued that print's most transformative effect was **typographic fixity** — enabling scholars to lay texts side by side and detect contradictions. LLMs represent the next step: fixity + comparison + structural contradiction analysis partially automated. This skill exploits that transition.

### Adams: The Electric Monk

Douglas Adams' Electric Monk (*Dirk Gently's Holistic Detective Agency*) is a labor-saving device designed to believe things for you. The one in the story has "developed a fault" — it believes too many irrational things. In this skill, the "fault" is the feature. Each monk is designed to believe a specific position at full conviction that the user cannot hold simultaneously. The monks are not thinking for the user — they are *believing* for the user, which is what frees the user to think.

### Aquinas: Slender Knowledge of the Highest Things

> "The slenderest knowledge that may be obtained of the highest things is more desirable than the most certain knowledge obtained of lesser things."

This is the philosophical aspiration of the entire process. The dialectic does not produce certainty — every synthesis is provisional, fertile, pointing toward a deeper contradiction. But that slender, provisional knowledge of the *deep structure* (why this tension exists, what hidden question drives it, what shared assumption both sides are trapped in) is worth more than confident knowledge of the surface question ("which option should I pick?").

**Operational implications:**
- **Don't stop at Round 1.** Round 1 produces more certain knowledge of the lesser thing (the surface framing). Round 3 produces slender knowledge of the highest thing (the deep structure). The first round is calibration. The prize is in the recursion.
- **Prefer depth over coverage.** A synthesis that names the deep tension but can't fully resolve it is more valuable than one that resolves a shallow tension with false confidence.
- **Aporia is sometimes the highest output.** Reaching productive perplexity about the *right* question is more valuable than a confident answer to the *wrong* question.

Aquinas practiced the *Disputatio* — structured scholastic debate where committed advocates argued positions before a master who synthesized. The Electric Monks are his disputing friars, mechanized.

### DeLong: The Attention Crisis and Offensive Intellectual Infrastructure

Brad DeLong's "Cognitive Distributed Disruption of Attention Crisis" (2026) frames the problem this skill addresses: the volume of plausible, credentialed output now exceeds any serious person's cognitive bandwidth. His solution is *defensive* intellectual infrastructure — ruthless triage, model-updating as the frame for reading, information portfolio management.

**This skill is the offensive complement.** DeLong's triage decides what deserves deep engagement. The Electric Monks provide the method *for* that engagement — they're what you reach for when you've found a genuine contradiction that can't be resolved by reading one more article, watching one more talk, or skimming one more summary.

**Operational implication:** The skill should not be used for everything. It's expensive (time, tokens, cognitive effort). Use it at DeLong's Level 4-5 — when the stakes justify deep engagement, when the tension is genuine and not resolvable by more information, when you need a *model update* rather than more data. The elenctic interview (Phase 1) should filter for this: if the question can be answered by looking it up, this is the wrong tool.

### Peirce: Abduction as the Logic of Discovery

Charles Sanders Peirce identified three modes of inference: deduction (from rule to consequence), induction (from cases to rule), and **abduction** (from surprising fact to explanatory hypothesis). The synthesis phase is abductive: given the surprising fact that both monk positions exist and each has genuine evidence, what hypothesis would make this *unsurprising*? Peirce's typology of abduction (selective → conditional-creative → propositional-conditional-creative) maps to synthesis quality — the best syntheses introduce genuinely new concepts, not just new arrangements of known ones. Operationally present in Phase 5 (Abduction Test).

### Pollock: Defeasible Reasoning and Defeat Types

John Pollock's epistemology distinguishes **undercutting defeaters** (the inferential link is broken — reasons to doubt the connection between evidence and conclusion) from **rebutting defeaters** (evidence directly supporting the opposite conclusion). Undercutting is more structurally revealing because it identifies *how* reasoning fails, not just *that* it fails — parallel to determinate negation's "specific way of failing." Pollock also identifies self-defeating arguments (conclusions that undermine their own premises), which should be rejected outright. Operationally present in the hostile auditor prompt (Phase 6).

### Galinsky: Perspective-Taking vs. Advocacy

Adam Galinsky's research shows that **perspective-taking** (cognitively inhabiting another's viewpoint) outperforms **advocacy** (arguing for a position) at both conscious and nonconscious levels. The mechanism is self-other overlap — when you inhabit a position rather than argue for it, you access richer associative networks and produce higher-quality elaboration. This is the psychological basis for the Electric Monk's "you ARE this position" instruction — inhabiting produces deeper arguments than advocating. Operationally present in the monk prompt template (Phase 2).

### Klein: Prospective Hindsight (Premortem)

Gary Klein's research shows that **imagining a future failure has already occurred** increases the ability to identify causes of that failure by ~30%, compared to asking "what could go wrong?" The temporal reframing ("it already happened, why?") breaks selective accessibility — the cognitive tendency to search only for confirming evidence. Operationally present in the hostile auditor prompt (Phase 6).

### Fauconnier & Turner: Conceptual Blending

Gilles Fauconnier and Mark Turner's theory of conceptual blending provides the machinery for understanding how genuinely new concepts emerge. A blend's value is measured by its **emergent structure** — organizational properties that exist in neither input space. The skill's Boydian decomposition is the destructive step (creating input spaces), and sublation is the blend (which must have emergent structure to be genuine). The "generic space" — the abstract relational structure shared by both inputs — often reveals the shared assumption the synthesis must transcend. Operationally present in Phase 4.5.

### Ensemble Diversity: The Mathematical Basis

Wood et al. (JMLR 2023) formalize why monk independence is load-bearing: the bias-variance-diversity decomposition shows diversity is literally subtracted from ensemble error (`E[loss] = noise + avg_bias + avg_variance − diversity`). Correlated errors eliminate the diversity benefit entirely. This is why monks must be spawned in separate sessions with no shared context, and why heterogeneous model families (when available) increase the skill's creative output. Surowiecki's wisdom-of-crowds conditions confirm: independence is necessary, not optional. Operationally present in the decorrelation check (Phase 3) and heterogeneous model guidance.

### Abelson & Sussman: Structure and Interpretation of Computer Programs

SICP's core thesis — that managing complexity requires modularization, abstraction barriers, and composition of simple components — mirrors this skill's architecture. Each phase is a module with defined inputs and outputs. Agents are spawned in isolated environments (SICP's environment model) to prevent information leakage. The auditor deliberately can't see the orchestrator's Phase 4 analysis — an abstraction barrier, not an oversight.

Most relevant is SICP's **closure property:** a means of combination has closure when the result can itself be combined using the same means. The dialectic has closure — a synthesis is itself a valid position that can serve as input to the next round. This is *why recursion works:* the output type equals the input type. When closure breaks (a synthesis so abstract or meta that no monk could believe it at full conviction), recursion stalls. This is a diagnosable failure mode — if you can't hand the synthesis to a monk and have it argue from that position, the synthesis lacks closure and needs to be made more concrete.

### Dixon & Srinivasan: The Idea Maze

Chris Dixon (via Balaji Srinivasan): a good founder doesn't just have an idea — they can navigate the **idea maze**, anticipating which turns lead to treasure and which to dead ends. The maze is mapped through history (what did previous attempts get right and wrong?), analogy (what did similar efforts in adjacent domains do?), theories (what generalizable patterns exist?), and direct experience.

The dialectic queue *is* an idea maze. Each synthesis opens new paths (contradictions). The user chooses which to explore. Unexplored paths remain visible in the queue — a map of the territory showing where you've been, where you could go, and what remains open. The research phase (Phase 1d) maps directly to Dixon's four sources: history of the domain, analogies to adjacent domains, theoretical frameworks, and the user's own direct experience (surfaced in the elenctic interview). The skill doesn't just navigate the maze — each recursive round *reveals new corridors* that weren't visible from the entrance.

### Alexander: A City is Not a Tree (Semi-Lattice Construction)

Christopher Alexander (1965) showed that natural cities have **semi-lattice** structure — overlapping, cross-connected sets — while designed cities impose **tree** structure where every element belongs to exactly one branch. Trees are easier to think about but destroy the cross-connections that make systems alive. Every attempt to design semi-lattices directly (Alexander's own HIDECS, Holacracy, Spotify's squad model) collapses back to trees because the design substrate — whether graph partitioning algorithms, org charts, or natural language — is tree-biased.

**This skill is a semi-lattice compiler.** Language is tree-structured (Chomsky's generative grammar, dependency parsing, sequential token generation). Each monk produces a tree — a coherent linear argument from committed premises to conclusions. Monk B in any dialectic is always right that its output is a tree. But the Boydian decomposition phase (Phase 4.5) strips both arguments of their source, extracts atomic parts, and finds cross-connections between elements that came from different trees. These cross-domain connections ARE the semi-lattice edges. The synthesis is the semi-lattice that emerges from the overlap of multiple trees.

The answer to "language can't represent semi-lattices" is not "make the LLM output a semi-lattice directly." It's: **produce multiple trees from different committed positions, then extract the cross-connections.** The semi-lattice is constructed, not generated. Every successful semi-lattice system works this way — Gene Ontology (multiple studies cross-referenced into a DAG), McChrystal's Team of Teams (tree-structured teams with liaison officers creating cross-connections), Ostrom's polycentric governance (overlapping jurisdictions, not one hierarchy).

## Worked Examples

Study these to understand the level of specificity, framing correction, and structural craft the skill requires. The key lessons are at the end.

### Example 1: TanStack Start vs Next.js (Technical Architecture)

**User's surface framing:** "Should I use TanStack Start or Next.js?"

**Degenerate framing the orchestrator must avoid:** "Libraries vs frameworks" or "modular vs monolithic." This is the boring version — the contradiction isn't deep enough.

**Deepest contradiction found (via research):** Infrastructure sovereignty and incentive alignment vs. deep framework-infrastructure integration and commercially-sustained ambition.

**Key framing correction in Monk A's prompt:**
> "TanStack Start IS a framework — it has opinions about routing, server functions, SSR, and application architecture. Your argument is NOT that TanStack Start is more modular or 'just libraries' while Next.js is a monolith. Both are opinionated frameworks. The real difference lies elsewhere."

**Key framing correction in Monk B's prompt:**
> "Your opponent's argument is NOT the naive 'libraries vs frameworks' take. They will argue that Next.js's design is structurally compromised by Vercel's commercial interests. You need to engage this argument directly, not dismiss it."

**Research directives (targeted, not broad):**
- Monk A: "Search for Vinxi and Nitro as open infrastructure primitives. Search for structural arguments about how Vercel's business model shapes Next.js's architectural decisions — not superficial 'vendor lock-in' complaints."
- Monk B: "Search for React core team arguments for Server Components. Search for concrete evidence of Next.js deployment capabilities OUTSIDE Vercel."

**Ontological question driving both prompts:** "What is the proper relationship between a framework, the infrastructure it runs on, and the business interests that fund its development?"

### Example 2: Personal Values Conflict (Career vs. Family Commitment)

**User's surface framing:** "I'm torn between taking this promotion and being more present for my kids."

**Degenerate framing:** "Work-life balance." This flattens a structural tension into a scheduling problem.

**Deepest contradiction found (via extended interview):** The user doesn't just want both — they believe *being the kind of person* who excels at work is inseparable from *being the kind of parent* they want to be. The tension is identity-level, not time-allocation.

**Key framing correction in Monk A's prompt:**
> "Your argument is NOT that career success matters. It's that THIS USER'S specific professional identity — what they build, how they lead, what they model for their children — is itself an act of parenting. Ground this in their actual history: [specific examples from interview]."

**Key framing correction in Monk B's prompt:**
> "Your argument is NOT that family time matters. It's that presence has a developmental window that closes — and that the user's children at ages [X] need [specific things from interview] that no amount of 'quality time' can compress into fewer hours."

**No external research needed.** The briefing was built entirely from the elenctic interview — the user's history, their children's ages and needs, their partner's actual capacity, the specific role being offered.

### Example 3: Agent Identity and Governance (Recursive, 7 Cycles)

This example shows how recursion pulls in cross-domain material — Boyd's prediction in action:

1. **"Is the agent the code or the pattern?"** → Synthesis: agent as resonance pattern. *Pulled in: stream theory.*
2. **"Where does identity live?"** → Synthesis: address identity vs. semantic identity. *Pulled in: naming/identity theory.*
3. **"Can a grammar be both simple and expressive?"** → Synthesis: metacognition decomposition. *Pulled in: cognitive science.*
4. **"Who governs the governors?"** → Synthesis: jurisprudential streams. *Pulled in: legal theory, constitutional design, Gödel's incompleteness.*
5. **"Should the SDK look familiar or teach new concepts?"** → Synthesis: simple API surface, rich feedback surface. *Pulled in: pedagogical theory.*
6. **"Can agents be tested through their streams alone?"** → Synthesis: witness obligations. *Pulled in: evidentiary standards, cryptographic verification.*
7. **"Must the verification chain terminate in trust?"** → Synthesis: the Incompleteness Engine. *Pulled in: Gödel again, quorum systems, adversarial red-teaming.*

The original question has nothing to do with jurisprudence or Gödel — but by Cycle 4 the dialectic had evolved to where those concepts were essential. Each synthesis opens doors to domains the previous round couldn't see.

### What Makes Good Prompts Work

1. **Targeted research directives.** Not "research TanStack Start" but "search for TanStack Router's type-safety model specifically." Grounds the monk in real detail.
2. **Framing corrections preempt degenerate dialectics.** "TanStack Start IS a framework — your argument is NOT that it's more modular." Without this, the monk defaults to the boring take.
3. **Ontological questions force depth.** "What IS the proper relationship between X and Y?" pushes past feature comparison into structural argument.
4. **"Push to the extreme" with permission.** Explicitly telling the monk to go somewhere uncomfortable counters RLHF agreeableness.
5. **Opponent restatement prevents shadowboxing.** Monk B is warned: "Your opponent's argument is NOT the naive take. They will argue [ACTUAL ARGUMENT]."
6. **Parallel structure enables comparison.** Both prompts follow the same shape (ontological claim → opponent's best case → diagnosis → deeper principle → push to extreme) so outputs are structurally comparable for Phase 4.
7. **Personal domains ground in specifics.** A monk that believes "career matters" is useless. A monk that believes "THIS user's specific professional identity is itself an act of parenting, because [interview evidence]" is doing its job.

## Output Format

The final deliverable should include:

1. **The Dialectical Trace** — the full journey, not just the destination:
   - Both agents' arguments (full text or summary)
   - The structural analysis (determinate negation)
   - The hidden question
   - The sublation with validation test
   - New contradictions identified

2. **The Model Update** — explicit statement of what changed:
   - "Before: [old assumption]"
   - "After: [new understanding]"
   - "Because: [what the contradiction revealed]"

3. **Actionable Output** (domain-dependent):
   - Engineering: decision criteria, architectural patterns
   - Strategy: framework for navigating the tension + **sequencing** (what first, what next, what depends on what) — test runs consistently found that strategy syntheses answer "what" but not "what first," and validation agents flag this as the primary weakness
   - Personal: clarity about what you actually value
   - Creative: new possibilities neither side saw

4. **The Dialectic Queue** — a map of the intellectual territory:
   - Which contradictions were explored (with links to their traces)
   - Which contradictions remain open and queued for future rounds
   - Which contradictions were deferred and why
   - For multi-round dialectics, show the branching structure: which rounds built on which syntheses

Write these as markdown files in the output directory. Include a `README.md` or `index.md` linking all output files in order so the full dialectical trace is navigable. The queue file (`dialectic_queue.md`) serves as both a session artifact and a starting point for future sessions.
