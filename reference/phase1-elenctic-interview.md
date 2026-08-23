# Phase 1: Elenctic Interview + Research

This is the most important phase. Everything downstream depends on it.

**⛔ Phase-opening check:** Do not inherit records, create files, spawn the gardener, or run the Phase 1 cluster until the workflow has shown the seven-phase overview and the Phase 1 opening card, and the user has said to start Phase 1. See `reference/dialectic-workflow.md` → Phase-opening gate.

**Entry — inherit the field record.** If this dialectic workflow grew from a Walk or Field Trip, first read the session record, field log, and Expedition log when one exists. Copy their lineage, original question, goal, typed observations, instrument readings, loaded terms, tensions, gaps, and working question into the control log. For every inherited instrument, retain the actual execution seat, context boundary, fallback or downgrade, access delta, control, artifact risk, and trace pointer. Do not replace the historical execution record with the card's preferred seat; a correlated fallback stays correlated unless rerun under the full contract. Treat this as interview and research substrate. Ask only for missing material; do not make the user restate it or rewrite ordinary chat as a scripted interview.

**Setup — dispatch the gardener in the background before new research.** The full dialectic workflow crosses the wiki threshold: it uses several agents, durable cross-links, and usually recursion. Create the workflow and staging directories, dispatch the persistent **gardener** subagent (`reference/dialectic-wiki.md`) to initialize the wiki, and immediately continue the interview and framing work. Do not wait for a startup or readiness response. You still read the research yourself; the gardener handles wiki bookkeeping asynchronously.

## Phase 1 instrument cluster

Read `reference/dialectic-instrument-map.md` and the relevant cards before running this phase. Phase 1 coordinates:

- `focus-interview` when no current focus was confirmed on the Walk or Field Trip;
- `elenchus` across 1b–1f;
- `tension-statement` for the initial burst at 1c.1 and whole-inquiry rechecks at 1c.4;
- `third-pole` at 1c.2 after the user selects a working tension;
- `frame-projector` at 1c.3 when the selected tension supports a plausible second axis; otherwise record it as not called because its operating range is one-dimensional;
- `home-frame-leak` at 1d.5;
- `neutral-control`, frozen after the user confirms the framing and before any Monk output exists;
- the persistent `atlas`, started with the gardener.

Announce each instrument just before its first operation. An inherited reading may satisfy an instrument only when its full readout and execution trace survive promotion; otherwise rerun it or record the named gap. Append each consequential reading to the control log's instrument ledger. Phase 1 closes only when the user has corrected the integrated framing and the neutral pre-belief baseline is frozen.

## Phase 1 cadence

Phase 1 is not one batch. Use these user-visible stops:

Throughout the interview, treat sources the user supplies as interview
substrate. Examine the relevant supplied material as it arrives, before asking
the next substantive question, and let it guide the remaining elenctic work.
The separate research go-ahead below applies to discovering or gathering new
sources and to an open-ended research batch; it does not delay reading sources
the user has supplied for the active phase.

Treat the elenctic interview as a responsive conversation for establishing the
right frame, not a fixed sequence of questions. The user may answer, redirect,
add a source, ask for a bounded comparison or generated possibilities, or
challenge the current line of inquiry. Use each move to update what the frame
must include, and distinguish generated probes from the user's testimony and
from evidence. The one-question rule limits questions the orchestrator asks; it
does not constrain how the user may move the inquiry.

1. **Open and focus.** After the phase-start go-ahead, open the declared records, start the atlas, dispatch the gardener in the background, inherit prior material, and run only the missing focus interview and first elenctic questions. Do not wait for the gardener. Return the provisional aim, stakes, and provenance inventory for correction without naming a real or deepest tension.
2. **Burst and choose—or stop.** After that correction, finish the needed elenctic probing and run `tension-statement`. If no live collision is supported, return that result and stop Phase 1. Otherwise present the 2–4 unranked, interview-traced options and stop for the user to choose, combine, rewrite, or reject them. Treat the choice as the current direction, not a promise to keep it. Do not test axes, research a pole, or draft the briefing before this choice.
3. **Test the chosen frame.** Run the third-pole probe on the user-selected working tension. If the specimen supports it, preview and then run the frame projector as its own substantial exposure. Return the possible poles or maps and ask what is misplaced or missing. If either operation may have changed the collision, use the 1c.4 whole-inquiry recheck; do not let its newest or most vivid output replace the working tension on its own.
4. **Propose grounding.** From the corrected frame, propose the research depth, named questions or tracks, number and kind of agents or searches, expected artifacts, and rough time/token band. **Stop for a separate research go-ahead.** Do not treat the Phase 1 start as permission for an open-ended research batch.
5. **Ground and recheck.** Run only the approved research batch, ingest it, and return a concise evidence-and-gap reading. Then announce and run home-frame leak reconnaissance under its card. After the user corrects that reading, run the 1c.4 whole-inquiry recheck. A `live` or `sharpened` result gets a short delta, not another full menu. A `moved`, `thin`, or `dissolved` result returns viable parked and new directions for user choice.
6. **Snapshot the current frame for the Monks.** Draft the integrated briefing, show the 1f framing summary, and ask for correction. Only after the user confirms it, record the Anchor and Goals & context, then freeze the final Monk count, neutral control, and exact specimen for this Monk run. The inquiry and tension trail remain open to later movement.

Add a checkpoint sooner whenever an instrument returns a strong perturbation or the user could cheaply correct a bad assumption. Never run focus, elenchus, tension burst, third-pole, frame projection, research, home-frame leakage, and neutral control as a single unattended tool cascade.

## 1a. Orient and Open Phase 1

The workflow entry contract gives the seven-phase overview. Do not repeat it here. Give the Phase 1 opening card even when the user already knows the workflow: current position, aim, scheduled instruments with short explanations, conditional calls, records and agents, estimated cost, and the first return point. Then stop. After the user starts Phase 1, point out what the prior Walk or Field Trip has already supplied and begin with the first cadence stop above.

## 1b. Understand What the User Wants

Recover what the user is thinking about from the inherited field record, then ask only for gaps. Determine:

- **Mode A (Stress-Test):** User has one idea they want to challenge. You need to identify the strongest possible antithesis.
- **Mode B (Opposition):** User has two positions in tension. You need to refine both to their steelman forms.

**Also capture the _broader goal_, not just the tension.** Reuse it from the field log when present; otherwise ask what the user is ultimately trying to _do_ with this dialectic — the deliverable and audience (e.g., "a skill to help people design X," "material for a blog post," "a decision I have to make," "a mental model I want to build"). The specific tension is in service of this larger purpose. Capture it in the control log's **Goals & context** (written at 1f; see `reference/dialectic-wiki.md`).

**Default monk count is 2 after the user selects a live tension.** Binary contradiction is the core structural unit of the dialectic and produces the tightest analysis. But 2 monks sometimes leaves a valid big perspective on the table — a position that can't be reached as a blend of the two poles, or that's arguing on a different axis entirely. If the interview surfaces such a position, add a third (or fourth) monk. See 1c.2.

## 1c. Elenctic Probing

Run the [`elenchus` card](instruments/elenchus.md), using inherited Walk and Field Trip material before asking new questions. For this workflow, ensure its reading covers:

- hidden assumptions and incompatible commitments;
- the candidate clashes supported by the user's account rather than one preselected “deepest” contradiction;
- the domain type—empirical, normative, personal, creative, or mixed;
- what the user wants the dialectic to update; and
- any third position already present in literature or practice.

Keep these elicited readings separate from the later phase framing.

## 1c.1 Tension Burst and User Selection

Run the [`tension-statement` card](instruments/tension-statement.md). Use the whole inherited record and interview, not only the last exchange.

Do not ask the user to approve one agent-picked “real tension.” Present the surviving menu and its traces. Each option must show:

- which user statements, corrections, or supplied artifacts root both demands and the collision condition;
- what outside source or orchestrator inference, if any, made the option novel;
- what would weaken the option; and
- what the frame may leave out.

Record the full burst, clustered menu, and the user's response in the tension trail. Mark the selected option `working` and the other supported options `parked`. The user may choose, combine, rewrite, park, or reject every option, and may revisit that choice later.

**No-tension exit.** If the card finds no supported live collision, or the user rejects the whole menu without naming a replacement, stop Phase 1. Do not draft Monk positions or use research, analogy, or source language to waive a tension into existence. Offer to return to the interview, use another user-selected instrument, or end the dialectic workflow. Phase 2 requires a user-selected live tension.

## 1c.2 Third-Pole Probe (Missing-Perspective Check)

Run the [`third-pole` card](instruments/third-pole.md). Default to two Monks. Add a third or fourth only when the card returns a non-blended position with its own basis and constituency that changes what must be compared. Name every added position by what it believes rather than by number alone. Record a qualified “none found” when no candidate survives.

**Anti-sycophancy warning:** The elenctic interview is where position-tracking starts. The user will share what they think, what they've read, what frameworks they find compelling. Your job is to understand the _shape of the tension_ — not to figure out which side the user leans toward so you can build the synthesis in that direction. If the user seems excited about a particular framework or thinker, that's useful information for grounding the monks, but it is NOT a signal about where the synthesis should land. The user came to this tool to be in the belief-free seat. Help them get there — don't track their position and feed it back to them as a synthesis.

## 1c.3 Exploratory 2×2s (Mapping Where to Run the Monks)

When the specimen supports a plausible second axis, run [the frame-projector card](instruments/frame-projector.md). Explore every honest candidate with the user because Phase 1 uses the projections to decide where to point the Monks rather than to lock a frame. Each candidate serves three workflow needs:

- **Comprehension check** — it externalizes your model of the user's problem; they correct the axes and placements (the 2×2 is a _question_, not an answer).
- **Third-pole generator** — each second axis is a candidate orthogonal pole, feeding 1c.2 directly. A live second axis is often exactly the Monk-C position.
- **Fault-line scout** — the spread of framings stress-tests the user's chosen tension and Monk count. A materially different collision returns to the tension burst; the projection never replaces the selected frame on its own.

If no candidate second axis earns its place, record `frame-projector: not called — contraindicated by a one-dimensional specimen`. Do not manufacture an axis to satisfy the phase.

## 1c.4 Recheck a Moving Tension

Run the [`tension-statement` card](instruments/tension-statement.md) in recheck mode after the approved grounding batch and whenever the user says the current tension has moved, thinned, or dissolved. Also use it when a decisive fact defeats the collision. Do not rerun it merely because a new article, analogy, or thought is interesting.

At each recheck:

1. Reread the original question, Goals & context, full interview, accumulated evidence, current working question, and tension trail.
2. Mark new items as support, sharpening, side trails, weakening evidence, or decisive defeaters.
3. Apply the card's movement threshold. Recency, novelty, or one source's vocabulary is not enough to move the frame.
4. Return the status and delta. Show another menu only for `moved`, `thin`, or `dissolved`, or when the user asks to reconsider directions.
5. Record the user's current direction and preserve every prior version and side trail.

Before Phase 2, a user-selected move updates this round. Do not draft the briefing until one current tension is `live` or `sharpened`.

## 1d. Ground the Monks (Domain-Adaptive)

The monks need deep grounding before they can believe effectively. But _what_ constitutes grounding depends on the domain type and how novel it is. The skill must adapt.

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

Research agents should be given _specific_ search targets — not "research this topic" but "search for X's argument about Y, specifically the part about Z."

**Research now flows through the wiki.** Research subagents follow the research-subagent contract (`reference/research-subagent-prompt.md`) — they write page drafts to `<dialectic-dir>/staging/` and return only paths. You read the drafts for the interview and briefing, hand the same paths to the **gardener**, and continue working while it ingests them into the research wiki (`reference/dialectic-wiki.md`). Do not wait after each handoff. Check ingestion only when a later step needs a gardener-built view or when Phase 1 has no other incomplete gate items. So the research is both in play now (in your context) and organized for later — the monks, future rounds, and re-grounding. This starts the wiki compounding from Round 1.

### Personal and Values Domains (life decisions, career, relationships, commitments, priorities)

These domains have little useful external literature. The grounding comes from _the user themselves_ — their history, values, constraints, relationships, and patterns. **The interview IS the research.**

The elenctic probing (1c) must go deeper and wider for these domains. You need to map:

- **The full landscape of commitments.** Not just the two in tension — _everything_ the user is carrying. Ask: "Walk me through what's on your plate right now — all of it." Undifferentiated care (the Empathic Integrator pattern) only becomes visible when you see the full load.
- **The history.** "Have you faced a decision like this before? What happened? What did you choose? How did it feel afterward?" The Exploratory Debater's commitment pattern only becomes visible across multiple instances. The Practical Executor's optimization lock only shows when you see what they _haven't_ questioned.
- **The stakeholders and their actual capacities.** "Who else is affected by this? What can they actually do — not ideally, but right now?" This separates the vision from the reality, which is the Empathic Integrator's core split.
- **The values underneath the positions.** "You say you value X and also Y. If you could only have one — gun to your head — which?" This surfaces the Possibility Explorer's values hierarchy that they resist articulating.
- **The constraints they're treating as fixed.** "What would you do if [constraint] disappeared tomorrow?" This reveals which constraints are real and which are assumed.

**Spend 6-10 exchanges on this.** For personal domains, the interview should be roughly twice as long as for external-research domains. You're building the equivalent of the context briefing from the user's own testimony.

**Limited external research may still help.** Search for frameworks, not facts: "how do people navigate career transitions at [user's life stage]," "decision frameworks for competing values," "what does research say about [specific situation type]." This gives the monks structural scaffolding, not positions to believe — the positions come from the user's own material.

### Mixed Domains (normative/institutional, creative direction)

These need both. A dialectic about institutional identity, for example, requires external research (organizational history, governance structures, comparable institutions) _and_ the user's personal values and judgment about what the institution should become. The interview needs to surface the personal dimension while the research agents cover the external.

For mixed domains, run the extended interview _and_ the research agents, and note in the briefing document which material is user-sourced (values, priorities, constraints) vs. externally-sourced (evidence, history, precedent). The monks need to know the difference — they should believe positions grounded in the user's actual situation, not generic arguments.

### In All Cases

You need to know the domain well enough to:

- Identify and correct likely **degenerate framings** (the obvious/boring version of the dialectic that won't produce insight)
- Generate **specific research directives or interview questions** for each subagent
- Write **framing corrections** that steer monks away from shallow takes
- Distinguish several plausible contradictions, recognize when none is live, and ground the user's selected one

## 1d.5 Blind Structural Reconnaissance (Discovering the Domain's Hidden Structure)

Run the [`home-frame-leak` card](instruments/home-frame-leak.md). Use its surviving structural reading as input to the 1c.4 whole-inquiry recheck and rerun the third-pole check only after the user confirms the current direction. Its newest frame is a candidate side trail, not an automatic replacement.

Keep the raw cross-domain vocabulary out of the Monk briefing unless the enrichment rule below admits one or two framings. Do not let this instrument pre-pick Phase 4 donors or turn its output into an answer.

## 1e. Write the Context Briefing Document

**Synthesize everything — external research AND user-sourced material — into a single neutral briefing document and save it to a file** (e.g., `round_1_context_briefing.md`). You write this from everything you've read — external research and user-sourced interview material alike. The gardener ingests the same research in the background for durable use by the monks and later rounds; its wiki copy does not replace the briefing, and briefing work does not wait for routine ingest. Write the full briefing to the file — present only a concise summary to the user at the confirmation step (1f).

For **external-research domains**, this covers:

- Key evidence, sources, and arguments from all sides
- The landscape of the debate — who the key thinkers are, what positions exist
- Relevant empirical data, historical context, institutional structures
- The user-selected working tension and the provenance of each load-bearing demand, condition, and inference

For **personal/values domains**, this covers:

- The user's full commitment landscape (all the things they're carrying)
- Relevant history and patterns (past decisions, outcomes, recurring themes)
- Stakeholders and their actual capacities
- The values hierarchy as best you can reconstruct it
- Constraints (which are real, which are assumed)
- The user-selected working tension and its roots in the user's account, supplied material, and labeled inferences

For **mixed domains**, both sections.

Both monks will read this file before writing. For personal domains this is especially important — it gives the monks the user's actual situation rather than letting them argue from generic positions. A monk that believes "you should prioritize your career" in the abstract is useless. A monk that believes "given your specific history of X, your constraint of Y, and the fact that stakeholder Z can actually handle Q — you should prioritize your career _because_..." is an Electric Monk doing its job.

Give the briefing a short **frame provenance** block. Trace the selected tension and each Monk position to the interview, other user-supplied material, outside sources, and orchestrator inferences without blending those kinds. Novel framing is allowed; silent frame selection is not.

### 1e.1 Cross-Domain Monk Enrichment

Weave 1–2 cross-domain framings surfaced by 1d.5 into the briefing — as _analogies the monks may reason with_, not positions they must hold, and framings only (not full donor decompositions; that is Phase 4's job). **This is on by default.** Test runs bear it out: bringing an outsider frame in early loosens the home-frame lock-in that otherwise makes the monks — and the synthesis — converge on the prior, and when kept to framings it does so _without_ blunting the determinate negations.

**Go light or skip when the monks are grounded in the user's own material** (personal/values domains). There the grounding _is_ the user's specific history, constraints, and stakeholders; cross-domain analogies can muddy positions that should stay rooted in that. Enrichment earns its keep most in external-research and conceptual domains.

**Standing guard (the risk is real and domain-dependent).** Enrichment can still **correlate the monks** (arguments converge in texture even with opposing poles) or **pre-fill the gaps** (shrinking the determinate negation that is the dialectic's engine). So Phase 4 stage A (4.3) checks each round whether the negations came out sharp and complementary or homogenized; if a round's come back blurred, that's the enrichment muddying — dial it back or skip it for that domain. (Not an open experiment anymore — early enrichment has proven net-positive; this is the ongoing safeguard that keeps it honest per-domain.)

## 1f. Confirm with the User

Before proceeding, summarize back:

- "This is the current tension for the next Monk run, and here is how it changed—or stayed stable—through the rechecks..."
- "Here is how each position grows from that choice and from what you told me..."
- "Here's what I'll have each agent research and argue..."
- **"Are there companies, thinkers, comparison classes, or evidence we're missing?"** — This question consistently produces the highest-leverage interventions in the entire process. In testing, users caught missing competitors (Vercel's agentic play), missing comparison classes (AI-native devtools), and missing authority structures that fundamentally changed the synthesis.
- **"Is there a third live position we're not accounting for — one that isn't a blend of A and B, or that's arguing on a different axis entirely?"** — This is the third-pole check from 1c.2 surfaced one more time before the briefing locks. If the user names a position that meets the three criteria (not-a-blend, independent constituency, ideally orthogonal axis), add it as Monk C and update the briefing.

Get the user's confirmation or correction. If the user identifies gaps, run a supplementary research agent to fill them and update the briefing before proceeding. Then run the 1c.4 recheck; do not silently edit the selected tension or promote a fresh source into the frame. **State the final monk count, what each monk will believe, and that this freezes only the next Monk specimen** before moving to Phase 2.

**Write the frozen Anchor and the Goals & context.** Once framing is confirmed, write two things to `round_1_dialectic_log.md` (see `reference/dialectic-wiki.md` → the control log):

- **Anchor** — the original felt tension or question in the user's own words, never overwritten. It is a historical bearing for measuring movement, not a command to keep working a tension that has thinned, dissolved, or ceased to serve the goal.
- **Goals & context** — the user's broader purpose from 1b: intended deliverables, audience, and what a useful outcome looks like. This is _dialectic-level_ — it frames every round, not just this tension — and the user can update it. Re-read it with the Anchor at each loop-top so the synthesis stays aimed at what the user actually needs, not just at resolving the tension.

---

**No-current-tension completion exit.** If 1c.1 returns no supported tension, a recheck returns `thin` or `dissolved` and the user selects no replacement, or the user rejects every option without a replacement, record the readout, tension-trail statuses, unchanged or closed working question, and stopped workflow state; present that result and stop. Do not apply the Phase 1→2 gate below.

**Completion gate — enumerate and attest before Phase 2.** Apply the [workflow completion gate](dialectic-workflow.md#completion-gate), mark each item ✅ or ❌ with evidence, and stop on any ❌ unless the user explicitly waives it:

- [ ] Phase 1 opening card, promised first checkpoint, and later user phase-start pointer recorded in the phase-start ledger
- [ ] 1a–1b: prior field record inherited; every consequential instrument retains its authorization, actual seat, context boundary, fallback or downgrade, access delta, typed raw readings, calibration or control, artifact risk, unmeasured remainder, and trace; needed orientation given; elenctic gaps filled; the provenance inventory preserves the user's account without preselecting a contradiction
- [ ] 1c: belief burden identified (see `reference/belief-burden-catalog.md`)
- [ ] 1c.1: `tension-statement` tested whether a live collision exists; a 5–8 item burst was generated before clustering, 2–4 unranked traced options were presented, and the user's provisional choice, combination, or rewrite was recorded with a message pointer
- [ ] 1c.2: third-pole probe run on the user-selected tension; final monk count decided (2 default; 3–4 only on the criteria)
- [ ] 1c.3: frame-projector formation trace shown—typed phenomenology inventory; multiple candidate four-cluster partitions with members, prototypes, overlaps, and outliers; candidate separators with chemistry and failure notes; label workshop with naming mode and alternatives—followed by complete separate paired ASCII and SVG diagrams with both named axes and poles, four bounded evocatively labeled cells, and relevant examples, then explored with the user; or the instrument recorded as not called with its specific contraindication
- [ ] 1d: monks grounded — external research **or** deep personal interview, as the domain requires
- [ ] 1d.5: blind structural reconnaissance run; fault-line choice sharpened against it
- [ ] 1c.4: after grounding and home-frame leakage, `tension-statement` reread the whole inquiry, disposed new items as support / sharpening / side trail / weakening / decisive dissolve, applied the movement threshold, and recorded a user-confirmed `live` or `sharpened` current direction
- [ ] 1e.1: 1–2 cross-domain framings woven into the briefing (or consciously skipped for a personal/values domain — state which)
- [ ] Gardener dispatched in the **background** at the start of Phase 1 (before research), without blocking the interview or other independent work — or research consciously skipped for a well-known domain (state which)
- [ ] Research ingested into the wiki by the gardener (durable organized memory for monks / future rounds / re-grounding)
- [ ] Context briefing written to `round_N_context_briefing.md`
- [ ] Context briefing contains frame provenance for the selected tension and every Monk position, with user testimony, supplied material, outside sources, and orchestrator inferences kept distinct
- [ ] Frozen Anchor written to `round_1_dialectic_log.md` (original felt tension, verbatim)
- [ ] Goals & context written to the control log — the user's broader purpose, deliverables, and audience (NOT just the narrow tension)
- [ ] 1f: the current tension, its status and trail, and its roots summarized back; "what are we missing?" + third-pole questions asked; final monk count, each monk's belief, and the limited scope of the frozen Monk specimen stated to the user
- [ ] Instrument ledger attests `focus-interview` (inherited or run), `elenchus`, initial and post-grounding `tension-statement`, `third-pole`, conditional `frame-projector`, `home-frame-leak`, and `atlas` with authorization, actual seats, contexts, typed raw readings, calibration or controls, access deltas, artifact risks, unmeasured remainders, trace paths, and user-feedback state; the tension trail preserves generated menus, side trails, statuses, and user choices separately; phase analysis is separate, a contraindicated frame projector is recorded as not called rather than given a fabricated readout, and every fallback remains labeled
- [ ] `neutral-control` frozen from the user-confirmed specimen before any Monk output is read; baseline trace recorded for the Phase 3 comparison
