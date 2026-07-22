# Field Lab — thinking with AI

**A kit of instruments for seeing more with an LLM before you decide what it means.**

![A cartoon field party and two brass Electric Monks use cameras, notebooks, binoculars, and specimen jars to explore a jungle of strange plants and branching ideas.](assets/field-lab-expedition.webp)

## Install

Install the whole repository with the [`skills` CLI](https://github.com/vercel-labs/skills) so the skill and its instruments stay together. It supports Claude Code, Codex, and other agents:

```bash
npx skills add KyleAMathews/field-lab
```

Add `-g` for a global install. Then bring it an ordinary question:

```text
/field-lab Why do I keep putting off this small migration?
```

## First time? Take the tutorial

The easiest way to understand the lab is to try a few instruments:

```text
/field-lab I want to test the instruments in this field lab. Briefly explain how it works, then give me a few easy, low-stakes exercises for instruments that produce different kinds of readings. Let me choose what to try and guide me through one at a time.
```

The tutorial teaches the controls. This README explains why the lab exists.

## AI is too eager to finish your thought

Ask an LLM an open question and it will usually turn the first plausible reading into an answer. It resolves an ambiguous word, guesses your aim, selects a theory, and starts explaining. The result may be fluent and useful. It may also close the question just as it becomes interesting.

Field Lab slows that reflex. It treats an LLM first as a way to see and only later, when asked, as a way to conclude or act.

Venkatesh Rao calls this [camera mode rather than engine mode](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii). An engine spends what it already knows on action. A camera-like loop gathers more information through feedback. Each new reading can change where you point next.

That makes the human's role central. You bring the question, recognize what matters, correct the readings, and decide when the evidence is ready to become an understanding, judgment, or plan. The LLM carries instruments.

## What using it feels like

Every inquiry begins as a **Walk**. Sometimes the lab simply answers. Sometimes it asks a few questions because your aim or circumstances could change the answer. As the terrain becomes clearer, it offers a small choice of instruments and explains what each might reveal. You choose what comes out of the bag.

Suppose two people disagree about whether the kitchen is clean. An ordinary answer might produce a chore chart. A Walk might first notice that _clean_ names several things: sanitary surfaces, an empty sink, clear counters, food put away, or the feeling that tomorrow's work has not been left for someone else. A term scan makes those meanings visible. A stake map shows who bears each cost. A small experiment compares one evening under two definitions. None of these readings settles the relationship. Together they give the people involved something more precise to think with.

A Walk may last one exchange or many. It can use a web search, a camera, a 2×2, several fresh agents, or no instrument at all. It remains a conversation unless you decide the inquiry deserves a record.

- **Open a field log** when a promising Walk becomes a bounded **Field Trip** worth resuming, comparing, or auditing.
- **Start an Expedition** when several Field Trips belong to one larger question and need a shared index.
- **Choose a workflow** when a known method would help. The Electric Monk dialectic is one workflow; other workflows can use the same instrument bench.

The scale grows only when the question earns it. A good Walk that leaves you with one sharper distinction—or more questions than you began with—is a success.

## Instruments, not oracles

A thermometer reports 32°. It does not tell you how the day feels. For that you may need sunlight, wind, humidity, clothing, movement, and a person standing in the weather. Each instrument offers a narrow reading. Understanding comes from placing readings beside one another.

Field Lab instruments work the same way. They reveal something ordinary conversation tends to hide, and they state what they do not measure. They return observations, contrasts, traces, or calibrated probes—not a concealed analysis or action plan.

The bench includes instruments that can:

- separate meanings that fluent conversation has allowed to slide together;
- map actors, stakes, sequences, constraints, or ground conditions;
- expose what changes when a belief is held without hedging;
- form a 2×2 from observed clusters instead of forcing examples into ready-made axes;
- compare what is costly to say in several societies without treating taboo as truth;
- probe the model's expected grooves against a frozen source map;
- collect residue, anomalies, and questions that a neat explanation would discard;
- test an idea through small experiments or hostile scrutiny.

The counterfactual test is simple:

> Without this operation, what would remain unseen?

If the answer is only “the LLM would have worked more slowly,” it is a tool. If the operation creates a new and bounded way of seeing, it is an instrument.

## The Electric Monks

Douglas Adams imagined machines built to believe things for you. [Venkatesh Rao saw the deeper possibility](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients): if a machine carries a belief at full strength, a person can inspect that belief without taking on its inertia.

The Electric Monk dialectic turns that idea into an apparatus. Fresh, isolated agents inhabit incompatible positions without hedging. Research gives each position real material to work with. The lab then looks for the precise way each position fails from within its own logic, breaks their arguments into parts, and brings in material from outside the original dispute. Cross-links among those parts form a richer web than any one position could contain.

From there it may produce a synthesis, but synthesis is not compulsory. The honest result may be a conflict that should remain open, a missing ground condition, a frame that has outlived its use, or a word carrying incompatible meanings. Candidate readings face the original Monks and a hostile auditor before they earn much trust. Any unresolved contradiction can seed another round.

This is an **artificial belief system**, not a debate club and not an artificial thinker. The Monks carry incompatible beliefs so you can move among them lightly. They do not choose what you should believe.

## Intellectual lineage

Field Lab grew from one demanding dialectic workflow into a general bench for thinking with AI. Its shape comes from several lines of thought:

- **Douglas Adams and Venkatesh Rao — artificial belief.** Adams supplied the Electric Monk; Rao's [“Electric Monks and Fast Transients”](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients) explains how outsourcing belief can make human reorientation faster and better.
- **Rao — camera before engine.** [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii) treats generative AI as an instrument for seeing in latent space and distinguishes feedback-rich exploration from action that outruns context.
- **The Crooked Timber of AI — instruments of discovery.** The essay's account of scientific discovery helped recast the skill as a [field lab with instruments](https://protocolized.summerofprotocols.com/p/the-crooked-timber-of-ai), rather than one fixed reasoning engine.
- **Tim Ingold and Rao — walks, attention, and getting lost.** Ingold's [“On not knowing and paying attention”](https://journals.sagepub.com/doi/10.1177/07916035221088546) and Rao's [“How to Take Your Brain Off-Road”](https://ribbonfarm.com/2016/05/26/how-to-take-your-brain-off-road/) defend forms of attention that do not force every encounter onto an existing map.
- **Hegel — determinate negation.** A position becomes useful not when it is dismissed as wrong, but when its specific internal failure points toward what it cannot contain. _Aufhebung_ asks whether a new frame can cancel a position as complete while preserving what it saw.
- **John Boyd — destruction and creation.** [Boyd's 1976 essay](https://www.coljohnboyd.com/pdf/destruction-and-creation/) argues that closed conceptual systems must be broken apart and opened to outside material before genuinely new combinations can form. His OODA loop also places orientation between observation and decision, where Field Lab applies its strongest brake.
- **Elizabeth Eisenstein — comparison made durable.** Her account of typographic fixity in _The Printing Press as an Agent of Change_ showed how stable records let people place claims side by side and discover contradictions. Field logs extend that comparison across sessions, agents, and sources.
- **Christopher Alexander — semi-lattices rather than trees.** [“A City Is Not a Tree”](https://christopher-alexander-ces-archive.org/record/the-city-is-a-semi-lattice-but-not-a-tree-original-text-of-article-a-city-is-not-a-tree/) distinguishes neat hierarchies from overlapping structures. The dialectic's separate arguments are trees; decomposition and cross-links build a semi-lattice among their parts.

Individual instruments have their own lineages. Rao's [cluster-first method](https://ribbonfarm.com/2009/04/20/how-to-draw-and-judge-quadrant-diagrams/) governs 2×2s. Paul Graham's [“What You Can't Say”](https://paulgraham.com/say.html) prompted taboo parallax, with added truth and stereotype controls. The dialectic's durable memory borrows from Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

These are not doctrines the lab tries to prove. They are instruments too: each gives access to something, each distorts something, and none can read the whole specimen.

## Try a Walk

Bring the lab a question you have been postponing because a canned answer would be too shallow but a research project would be too much:

```text
/field-lab What am I missing about this?
```

If a short answer is enough, stop there. If something catches, keep walking.

## Repository

- [`SKILL.md`](SKILL.md) — entry point and routing rules
- [`reference/instruments/`](reference/instruments/) — the instrument bench
- [`reference/dialectic-workflow.md`](reference/dialectic-workflow.md) — the Electric Monk workflow
- [`reference/`](reference/) — field-work, memory, and validation contracts

## License

MIT
