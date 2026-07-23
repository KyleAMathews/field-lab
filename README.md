# Field Lab — thinking with AI

**Bring a question. Pack some instruments. Let's see what lives in latent space.**

![A cartoon field party and two Electric Monks use cameras, notebooks, binoculars, and specimen jars to explore a jungle of strange plants and branching ideas.](assets/field-lab-expedition.webp)

## Install

Install the whole repository with the [`skills` CLI](https://github.com/vercel-labs/skills). It supports Claude Code, Codex, and other agents:

```bash
npx skills add KyleAMathews/field-lab
```

Add `-g` for a global install. Then ask a stray question, pull out instruments during a Walk, open a field log, gather related trips into an Expedition, or run the full Electric Monk dialectic:

```text
/field-lab Why do moths fly toward porch lights?
/field-lab My wife and I mean different things by a clean kitchen.
/field-lab Open a field log for three weeks of deployment observations.
/field-lab Start an Expedition for our ongoing work on AI-assisted code review.
/field-lab Run the full dialectic on whether our framework should own deployment.
```

## First time? Take the tutorial

The easiest way to understand the lab is to try a few instruments:

```text
/field-lab I want to test the instruments in this field lab. Briefly explain how it works, then give me a few easy, low-stakes exercises for instruments that produce different kinds of readings. Let me choose what to try and guide me through one at a time.
```

The tutorial teaches the controls. This README explains why the lab exists.

## LLMs are strange new instruments for sensing

We mostly use LLMs as answer machines: ask a question, get a paragraph. I built Field Lab around a stranger idea—use them for sensing.

You are the explorer in a latent-space jungle. You choose where to walk and what deserves a closer look. The LLM runs the field lab: it offers instruments, operates the ones you select, and returns their readings. You decide what those readings mean and where to look next.

A camera records a scene. A thermometer measures temperature. Binoculars bring distant detail closer. Each reveals something that your unaided senses might miss.

Field Lab works the same way. You examine a question, idea, text, or situation. Something catches your eye in the distance, so you pick up the binoculars. Two texts use the same word in incompatible ways, so you reach for a *term scan*. A story jumps from events to causes, so you pull out a *substrate map*. A jumble of examples hints at a shape, so you try an *exploratory 2×2*. The same question now yields several readings instead of one smooth answer.

An instrument gives you a reading, not an answer. A *term scan* shows how words are being used; it does not choose the right meaning. A *substrate map* lays out what happened; it does not tell you why. You can place several readings side by side and decide what they add up to.

Like physical instruments, these can distort what they show. Binoculars narrow your field of view. A *term scan* can make word choice look more important than it is. The reading names that risk. It does not turn one view into a complete explanation or recommendation.

## What using it feels like

Every inquiry begins as a **Walk** in latent space. Easy questions get direct answers. If your aim or circumstances could change the answer, the lab asks a few quick questions about what you want, what you have already noticed, and what constraints matter. Then it offers a few instruments and says what each might show. You choose.

My wife and I tried this on what looked like a tiny question: how should we clean the kitchen? A few quick questions brought out feelings, constraints, and different meanings of _clean_ before we reached for a solution. Clean could mean sanitary surfaces, an empty sink, clear counters, food put away, or not waking up to someone else's unfinished work.

A *term scan* separates those meanings. A *stake map* shows who bears each cost. A *small experiment* tests two definitions against an evening in the actual kitchen. None of these readings can settle a relationship. They give the people in it sharper material to think with.

A Walk can be a quick look around or a long ramble. You might scan a term, consult a source, sketch a 2×2, ask fresh agents to explore different positions, or simply talk. Nothing needs to be recorded yet.

Suppose the kitchen experiment turns up a pattern you want to follow. You pull out the field log, and the Walk becomes a **Field Trip**. The log gives each observation a date, a source, and enough context to revisit it later. If you make several related Field Trips, collect them into an **Expedition**. The index shows where you've been and which paths stay open.

When a finding calls for structured analysis, choose a workflow: a known procedure that combines instruments in a set order. The Electric Monk dialectic is one such workflow; others can draw from the same instrument bench.

Turn back whenever you have enough. A Walk might bring home a direct answer, a sharper distinction, or a better question.

## What's on the field lab bench?

Here are some of the instruments:

- *Focus interview:* interview you about your aims, stakes, and constraints;
- *Term scan:* hold up words like _clean_, _fair_, or _safe_ and see where their meanings split;
- *Substrate map:* reconstruct what happened step by step before guessing why;
- *Exploratory 2×2:* collect and cluster concrete examples before drawing the axes;
- *Electric Monks:* have separate agents argue opposing beliefs at full strength, then compare their cases;
- *Taboo parallax:* find taboo ideas by comparing what is costly to say across countries and public arenas;
- *Blind cartography:* probe several fresh agents to see which ideas are precommodified in the model, then use published sources to reveal what they missed;
- *Residue collector:* gather the facts, contradictions, and outliers a neat explanation leaves behind;
- *Hostile auditor:* hand an argument to a fresh hostile reader and see where it breaks.

The test is simple:

> What would this show me that ordinary chat would not?

A tool helps you do something. An instrument changes what you can observe, separate, compare, or test.

## The Electric Monks

Field Lab's heaviest apparatus began as a Douglas Adams joke. He imagined machines built to believe things for you. [Venkatesh Rao asked what follows](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients): if a machine carries a belief at full strength, you can inspect it without taking on its inertia.

In the Electric Monk dialectic, fresh and isolated agents inhabit incompatible positions without hedging. Research grounds each one. The lab finds where each position breaks on its own terms, strips the arguments into parts, and brings in material from outside the dispute. Cross-linking those parts exposes relations no single position contains.

Synthesis is one possible result, not the goal. The inquiry may instead end with an open conflict, a missing ground condition, a frame that no longer fits, or a word carrying incompatible meanings. The original Monks and a hostile auditor test whatever comes out. Any contradiction left over can start another round.

That makes it an **artificial belief system**: the Monks do the believing while you compare what follows from each belief.

## Intellectual lineage

Field Lab began with the Electric Monks. These ideas shaped what it became:

- **Artificial belief: Douglas Adams and Venkatesh Rao.** Adams invented the Electric Monk. In [“Electric Monks and Fast Transients”](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients), Rao argues that machines can carry belief while humans switch among points of view.
- **Camera before engine: Rao.** [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii) treats AI as an instrument for seeing in latent space. In camera mode, feedback adds context before the model acts on it.
- **Instruments of discovery: _The Crooked Timber of AI_.** Its account of [scientific discovery](https://protocolized.summerofprotocols.com/p/the-crooked-timber-of-ai) helped turn one fixed workflow into a field lab.
- **Walking without a map: Tim Ingold and Rao.** Ingold asks what becomes visible when [a walk has no fixed destination](https://journals.sagepub.com/doi/10.1177/07916035221088546). Rao shows how orderly reading can make us blind in [“How to Take Your Brain Off-Road”](https://ribbonfarm.com/2016/05/26/how-to-take-your-brain-off-road/).
- **Determinate negation: Hegel.** Look for the exact point where a position breaks. _Aufhebung_ asks what a new frame can discard and what it must keep.
- **Destruction and creation: John Boyd.** [Boyd's 1976 essay](https://www.coljohnboyd.com/pdf/destruction-and-creation/) argues that we cannot make new models by polishing a closed system. We must break it apart, bring in outside material, and recombine. His OODA loop puts orientation between observation and decision. Field Lab slows the jump between them.
- **Comparison at scale: Elizabeth Eisenstein.** _The Printing Press as an Agent of Change_ describes how print held texts still enough for people to compare them. LLMs extend that advantage. Field Lab uses them to compare sources, committed positions, instrument readings, and cross-domain fragments without asking the user to hold it all in working memory.
- **Semi-lattices: Christopher Alexander.** [“A City Is Not a Tree”](https://christopher-alexander-ces-archive.org/record/the-city-is-a-semi-lattice-but-not-a-tree-original-text-of-article-a-city-is-not-a-tree/) contrasts tidy planning trees with the overlaps of living cities. A dialectic begins with separate argument trees, then cross-links their parts.

A few instruments draw on more specific sources. Rao's [cluster-first method](https://ribbonfarm.com/2009/04/20/how-to-draw-and-judge-quadrant-diagrams/) governs *exploratory 2×2s*. Paul Graham's [“What You Can't Say”](https://paulgraham.com/say.html) prompted *taboo parallax*, with added truth and stereotype controls. The dialectic's memory borrows from Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

None of these thinkers supplies a complete philosophy for the lab. Each changed one part of its design.

## Take a question into the field

Start with a question that keeps wriggling out of its answer:

```text
/field-lab What am I missing about this?
```

If the first answer is enough, great. If not, pull out an instrument.

## Repository

- [`SKILL.md`](SKILL.md): entry point and routing rules
- [`reference/instruments/`](reference/instruments/): the instrument bench
- [`reference/dialectic-workflow.md`](reference/dialectic-workflow.md): the Electric Monk workflow
- [`reference/`](reference/): field-work, memory, and validation contracts

## License

MIT
