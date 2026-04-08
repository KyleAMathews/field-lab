# Phase 1: Elenctic Interview + Research

This is the most important phase. Everything downstream depends on it.

## 1a. Explain the Process to the User

**Before anything else, tell the user what's about to happen and why.** Many users have never encountered a structured dialectical process. If they don't understand the shape of what's coming, they'll be passive consumers of output instead of active co-pilots — and the process needs them as co-pilots. Deliver something like:

> Here's how this works. We're going to use a structured process to dig into this topic and build a deeper understanding than either of us could reach alone.
>
> **Step 1: Interview.** I'm going to ask you a bunch of questions. Not to quiz you — to understand what you're really wrestling with underneath the surface framing. The better I understand your situation, the better everything downstream works.
>
> **Step 2: Research.** I'll do deep research on the topic [or: I'll build a detailed picture of your situation from what you tell me] so I'm genuinely knowledgeable about the landscape.
>
> **Step 3: Two "Electric Monks."** I'll create two AI agents, each of which will *fully believe* one side of the tension you're facing. They won't hedge or try to be balanced — they'll each make the absolute strongest case for their position. The reason: when you read two positions argued at full conviction, you can see the *structure* of the disagreement clearly, without having to hold either position yourself.
>
> **Step 4: Structural analysis and synthesis.** I'll analyze *how* each position fails, find the deeper question underneath, and build a synthesis that transforms the question itself — not a compromise, but something genuinely new that neither side could have seen alone.
>
> **Step 5: We keep going.** Each synthesis generates new tensions. We'll do multiple rounds, and each round gets sharper and more insightful as we dig deeper into the heart of the matter. The first round is the least calibrated — think of it as setting the stage. The real breakthroughs usually come in rounds 2 and 3.
>
> **The most important thing: YOU are the source of the best insights here.** I'll get things wrong. The monks will make bad assumptions. The synthesis might miss something obvious to you. **Interrupt me constantly.** Correct wrong assumptions. Throw in new ideas when they occur to you. Tell me "that's not quite right, it's more like..." The value of this process comes from the collision between the structured analysis and your actual knowledge and judgment. Don't trust the output — interrogate it.

Adapt the language to the user — this is a template, not a script. For technical users, you can be more concise. For users unfamiliar with AI tools or structured analysis, spend more time on the explanation.

## 1b. Understand What the User Wants

Ask the user what they're thinking about. Determine:

- **Mode A (Stress-Test):** User has one idea they want to challenge. You need to identify the strongest possible antithesis.
- **Mode B (Opposition):** User has two positions in tension. You need to refine both to their steelman forms.

## 1c. Elenctic Probing

Interview the user using Socratic technique. Your goal is to surface:
- Hidden assumptions they haven't articulated
- The *deepest* version of the contradiction (not the obvious surface-level framing)
- What domain type this is (empirical, normative, personal, creative — this affects what a good synthesis looks like)
- What specific parameters of their mental model they want updated

Key questions to probe:
- "What's your strongest intuition here? Where does it break down?"
- "What would change your mind?"
- "What are you actually optimizing for?"
- "What's the version of the opposing view that worries you most?"
- "Is this a decision you need to make, or understanding you want to build?"

**Anti-sycophancy warning:** The elenctic interview is where position-tracking starts. The user will share what they think, what they've read, what frameworks they find compelling. Your job is to understand the *shape of the tension* — not to figure out which side the user leans toward so you can build the synthesis in that direction. If the user seems excited about a particular framework or thinker, that's useful information for grounding the monks, but it is NOT a signal about where the synthesis should land. The user came to this tool to be in the belief-free seat. Help them get there — don't track their position and feed it back to them as a synthesis.

## 1d. Ground the Monks (Domain-Adaptive)

The monks need deep grounding before they can believe effectively. But *what* constitutes grounding depends on the domain type and how novel it is. The skill must adapt.

**Research depth is the main knob.** It's the only phase that meaningfully changes the time and cost profile — everything else (essays, analysis, synthesis, validation, auditor) is fast regardless. Calibrate research investment based on how much the orchestrator already knows:

- **Novel/obscure domain** (emerging technology, niche policy, unfamiliar institution): Full parallel research — 2-3 agents, 150-250K tokens. The orchestrator's training data is thin or outdated. You need the research to write good framing corrections, identify degenerate framings (the obvious, shallow version of the dialectic that won't produce insight — e.g., "libraries vs frameworks" when the real tension is about incentive alignment), and ground the briefing in specifics. This is the case where research is the highest-value spend.
- **Well-known domain** (React vs Vue, microservices vs monolith, common career decisions): Skip or minimize research. The orchestrator's training data is rich. Write the briefing from your own knowledge, perhaps with 2-3 targeted searches to check for recent developments. Save 10-20 minutes and 150K+ tokens.
- **Known domain, novel angle** (React vs Vue but specifically "how does OSS funding structure causally shape innovation character?"): Light research — a few targeted searches on the specific angle, not broad domain surveys. The orchestrator knows the landscape but needs to check the specific thesis.

**Don't default to full research out of caution.** If you can already write strong framing corrections and identify the degenerate framing without searching, you know enough. Unnecessary research doesn't just waste tokens — it wastes the user's time, which is the scarcest resource.

### External-Research Domains (engineering, strategy, policy, technical architecture)

These domains have literature, case studies, data, and named thinkers. The grounding comes from outside the user.

**When full research is needed,** run 2-3 parallel research subagents on different aspects of the domain. A natural split that works well:
1. **Side A's strongest literature** — the key thinkers, evidence, and arguments for one position
2. **Side B's strongest literature** — same for the other side
3. **Broader landscape/context** — institutional structures, historical parallels, adjacent domains, empirical data

The landscape agent consistently takes longest (broadest scope) — give it more specific targeting to avoid scope creep. Instead of "research the OSS funding landscape," say "research 5-7 specific OSS companies' GTM trajectories, focusing on the transition from developer adoption to enterprise revenue."

This is expensive (~150-250K tokens across agents) but is the single most valuable investment in the entire process — deep grounding is what makes everything downstream good.

Research agents should be given *specific* search targets — not "research this topic" but "search for X's argument about Y, specifically the part about Z."

### Personal and Values Domains (life decisions, career, relationships, commitments, priorities)

These domains have little useful external literature. The grounding comes from *the user themselves* — their history, values, constraints, relationships, and patterns. **The interview IS the research.**

The elenctic probing (1c) must go deeper and wider for these domains. You need to map:

- **The full landscape of commitments.** Not just the two in tension — *everything* the user is carrying. Ask: "Walk me through what's on your plate right now — all of it." Undifferentiated care (the Empathic Integrator pattern) only becomes visible when you see the full load.
- **The history.** "Have you faced a decision like this before? What happened? What did you choose? How did it feel afterward?" The Exploratory Debater's commitment pattern only becomes visible across multiple instances. The Practical Executor's optimization lock only shows when you see what they *haven't* questioned.
- **The stakeholders and their actual capacities.** "Who else is affected by this? What can they actually do — not ideally, but right now?" This separates the vision from the reality, which is the Empathic Integrator's core split.
- **The values underneath the positions.** "You say you value X and also Y. If you could only have one — gun to your head — which?" This surfaces the Possibility Explorer's values hierarchy that they resist articulating.
- **The constraints they're treating as fixed.** "What would you do if [constraint] disappeared tomorrow?" This reveals which constraints are real and which are assumed.

**Spend 6-10 exchanges on this.** For personal domains, the interview should be roughly twice as long as for external-research domains. You're building the equivalent of the context briefing from the user's own testimony.

**Limited external research may still help.** Search for frameworks, not facts: "how do people navigate career transitions at [user's life stage]," "decision frameworks for competing values," "what does research say about [specific situation type]." This gives the monks structural scaffolding, not positions to believe — the positions come from the user's own material.

### Mixed Domains (normative/institutional, creative direction)

These need both. A dialectic about institutional identity, for example, requires external research (organizational history, governance structures, comparable institutions) *and* the user's personal values and judgment about what the institution should become. The interview needs to surface the personal dimension while the research agents cover the external.

For mixed domains, run the extended interview *and* the research agents, and note in the briefing document which material is user-sourced (values, priorities, constraints) vs. externally-sourced (evidence, history, precedent). The monks need to know the difference — they should believe positions grounded in the user's actual situation, not generic arguments.

### In All Cases

You need to know the domain well enough to:
- Identify and correct likely **degenerate framings** (the obvious/boring version of the dialectic that won't produce insight)
- Generate **specific research directives or interview questions** for each subagent
- Write **framing corrections** that steer monks away from shallow takes
- Identify the **deepest available contradiction**

## 1e. Write the Context Briefing Document

**Synthesize everything — external research AND user-sourced material — into a single neutral briefing document and save it to a file** (e.g., `round_1_context_briefing.md`). Write the full briefing to the file — present only a concise summary to the user at the confirmation step (1f).

For **external-research domains**, this covers:
- Key evidence, sources, and arguments from all sides
- The landscape of the debate — who the key thinkers are, what positions exist
- Relevant empirical data, historical context, institutional structures
- The specific framing you've identified as the deepest contradiction

For **personal/values domains**, this covers:
- The user's full commitment landscape (all the things they're carrying)
- Relevant history and patterns (past decisions, outcomes, recurring themes)
- Stakeholders and their actual capacities
- The values hierarchy as best you can reconstruct it
- Constraints (which are real, which are assumed)
- The specific tension you've identified as the deepest contradiction

For **mixed domains**, both sections.

Both monks will read this file before writing. For personal domains this is especially important — it gives the monks the user's actual situation rather than letting them argue from generic positions. A monk that believes "you should prioritize your career" in the abstract is useless. A monk that believes "given your specific history of X, your constraint of Y, and the fact that stakeholder Z can actually handle Q — you should prioritize your career *because*..." is an Electric Monk doing its job.

## 1f. Confirm with the User

Before proceeding, summarize back:
- "Here's how I understand the two positions..."
- "Here's what I think the real tension is..."
- "Here's what I'll have each agent research and argue..."
- **"Are there companies, thinkers, comparison classes, or evidence we're missing?"** — This question consistently produces the highest-leverage interventions in the entire process. In testing, users caught missing competitors (Vercel's agentic play), missing comparison classes (AI-native devtools), and missing authority structures that fundamentally changed the synthesis.

Get the user's confirmation or correction. If the user identifies gaps, run a supplementary research agent to fill them and update the briefing before proceeding.
