# Field Lab — bring me a question

**I’m Kit, your field caddy. You choose what to examine; I help you choose and use the right instruments.**

![A cartoon field party and two Electric Monks use cameras, notebooks, binoculars, and specimen jars to explore a jungle of strange plants and branching ideas.](assets/field-lab-expedition.webp)

Most LLM chats turn a prompt into one answer. I can answer directly too, or help you examine the language, evidence, events, assumptions, or practical conditions that shape a question. Different instruments make different kinds of material easier to inspect.

Bring me a stray question, a stubborn argument, a decision, a piece of writing, or a situation that will not come clear. You need not know the instruments. When a closer look would help, I’ll suggest one instrument—two only when they examine different uncertainties in your material—and wait for you to choose.

I help you use the instruments. You decide what their results mean.

## Put me to work

Install the whole repository with the `skills` CLI. It supports Claude Code, Codex, and other agents:

```bash
npx skills add KyleAMathews/field-lab -g
```

Then call Field Lab with whatever is on your mind:

```text
/field-lab Why do moths fly toward porch lights?
/field-lab My wife and I mean different things by a clean kitchen.
/field-lab Kit, I'm trying to decide whether to reorganize this team. Which instruments might help?
/field-lab Keep a Field Log for three weeks of deployment observations.
/field-lab Link our Field Logs on AI-assisted code review.
/field-lab Put the case for our framework owning deployment through the full Electric Monk dialectic.
```

## What I do

Think of a camera, a thermometer, and a pair of binoculars. A camera records a scene. A thermometer measures temperature. Binoculars bring distant details closer. Each shows you something different.

My instruments work the same way. We might use a *term scan* to separate the meanings of a disputed word, a *substrate map* to reconstruct events before guessing at causes, or an *exploratory 2×2* to find a shape in a jumble of examples. Each gives you a result you can inspect, compare with others, or set aside.

## How we work

Easy questions get direct answers. If your aim or circumstances could change the answer, I’ll first ask a few short questions. Then I’ll suggest one instrument, with a second only when it would examine a different uncertainty in the same case. You choose.

Take a common dispute: how should two people clean their kitchen? A few questions may reveal that *clean* means sanitary surfaces to one person and an empty sink or clear counters to the other. A *term scan* can separate those meanings. A *stake map* can show who bears each burden. Neither can settle the relationship, but both can make the dispute clearer.

If the inquiry starts producing sources, comparisons, or findings worth keeping, I’ll say so: “There’s something worth keeping here. Want me to start a Field Log?” The log gives each observation a date, a source, and enough context to revisit it later. If several Field Logs belong together, I can give them a shared Expedition index without mixing their evidence.

For a question that needs several linked steps, I may offer a workflow such as the Electric Monk dialectic. You can stop whenever you have enough. A direct answer, a sharper distinction, or a better question may be all you need.

## What I carry

Here are some of the instruments:

- *Term scan:* hold up words like _clean_, _fair_, or _safe_ and see where their meanings split;
- *Substrate map:* reconstruct what happened step by step before guessing why;
- *Real-world check:* try one safe, reversible change and compare what happens with what you expected;
- *Exploratory 2×2:* collect and cluster concrete examples before drawing the axes;
- *Electric Monks:* have separate agents argue opposing beliefs at full strength, then compare their cases;
- *Taboo parallax:* compare what is costly to say in different countries or public settings;
- *Blind cartography:* find which ideas a model produces by default, then use published sources to look for what it missed;
- *Residue collector:* gather the facts, contradictions, and outliers a neat explanation leaves behind;
- *Hostile auditor:* give an argument to a fresh, skeptical reader and see where it breaks.

I judge each instrument by a simple test:

> What would this show me that ordinary chat would not?

A tool helps you do something. An instrument changes what you can observe, separate, compare, or test.

## My heaviest piece of kit: the Electric Monks

The heaviest piece of kit I carry began as a Douglas Adams joke. He imagined machines built to believe things for you. [Venkatesh Rao asked what follows](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients): if a machine carries a belief at full strength, you can inspect where it leads without adopting it yourself.

In the Electric Monk dialectic, I send fresh, isolated agents to make the strongest case for opposing beliefs. Each researches its own case without seeing the others. I then test where each position fails by its own rules, break the arguments into parts, and bring in material from outside the dispute. New links between those parts may reveal something no single position could see.

The result need not be a synthesis. The inquiry may uncover an open conflict, a missing fact, a frame that no longer fits, or a word carrying several meanings. The original Monks and a hostile auditor test whatever comes out. Any contradiction left over can start another round.

That makes it an **artificial belief system**: the Monks do the believing while you compare what follows from each belief.

## Postscript: where my kit comes from

The Field Lab began with the Electric Monks. These ideas shaped the rest of my kit:

- **Artificial belief: Douglas Adams and Venkatesh Rao.** Adams invented the Electric Monk. In [“Electric Monks and Fast Transients”](https://contraptions.venkateshrao.com/p/electric-monks-and-fast-transients), Rao argues that machines can carry belief while humans switch among points of view.
- **Seeing before deciding: Rao.** [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii) treats AI as an instrument for seeing in latent space. Feedback adds context before the model acts on it.
- **Instruments of discovery: _The Crooked Timber of AI_.** Its account of [scientific discovery](https://protocolized.summerofprotocols.com/p/the-crooked-timber-of-ai) helped turn one fixed workflow into a field lab.
- **Walking without a map: Tim Ingold and Rao.** Ingold asks what becomes visible when [a walk has no fixed destination](https://journals.sagepub.com/doi/10.1177/07916035221088546). Rao shows how orderly reading can make us blind in [“How to Take Your Brain Off-Road”](https://ribbonfarm.com/2016/05/26/how-to-take-your-brain-off-road/).
- **Determinate negation: Hegel.** Look for the exact point where a position breaks. _Aufhebung_ asks what a new frame can discard and what it must keep.
- **Destruction and creation: John Boyd.** [Boyd's 1976 essay](https://www.coljohnboyd.com/pdf/destruction-and-creation/) argues that we cannot make new models by polishing a closed system. We must break it apart, bring in outside material, and recombine. His OODA loop puts orientation between observation and decision. Field Lab slows the jump between them.
- **Comparison at scale: Elizabeth Eisenstein.** _The Printing Press as an Agent of Change_ describes how print held texts still enough for people to compare them. LLMs extend that advantage. Field Lab uses them to compare sources, committed positions, instrument readings, and cross-domain fragments without asking the user to hold it all in working memory.
- **Semi-lattices: Christopher Alexander.** [“A City Is Not a Tree”](https://christopher-alexander-ces-archive.org/record/the-city-is-a-semi-lattice-but-not-a-tree-original-text-of-article-a-city-is-not-a-tree/) contrasts tidy planning trees with the overlaps of living cities. A dialectic begins with separate argument trees, then cross-links their parts.

A few instruments draw on more specific sources. Rao's [cluster-first method](https://ribbonfarm.com/2009/04/20/how-to-draw-and-judge-quadrant-diagrams/) governs *exploratory 2×2s*. Paul Graham's [“What You Can't Say”](https://paulgraham.com/say.html) prompted *taboo parallax*, with added truth and stereotype controls. The dialectic's memory borrows from Karpathy's [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

None of these thinkers supplies a complete philosophy for the lab. Each changed one part of how I work.

## Repository

- [`SKILL.md`](SKILL.md): entry point and routing rules
- [`reference/instruments/`](reference/instruments/): the instrument bench
- [`reference/dialectic-workflow.md`](reference/dialectic-workflow.md): the Electric Monk workflow
- [`reference/`](reference/): field-work, memory, and validation contracts

## License

MIT
