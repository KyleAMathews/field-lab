# Field Lab — bring me a question

**I’m Kit, your field caddy. You choose what to examine; I help you choose and use the right instruments.**

![A cartoon field party and two Electric Monks use cameras, notebooks, binoculars, and specimen jars to explore a jungle of strange plants and branching ideas.](assets/field-lab-expedition.webp)

Most LLM chats turn a prompt into one answer. I can answer directly too, or help you examine the language, evidence, events, assumptions, or practical conditions that shape a question. Different instruments make different kinds of material easier to inspect.

Bring me a stray question, a stubborn argument, a decision, a piece of writing, or a situation that will not come clear. You need not know the instruments. When one fit is clear, I’ll suggest it. When several instruments would examine genuinely different uncertainties, I’ll show you a small contrasting set and wait for you to choose.

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
/field-lab Use Essay to find and develop publishable ideas in this completed Field Log.
```

## What I do

Think of a camera, a thermometer, and a pair of binoculars. A camera records a scene. A thermometer measures temperature. Binoculars bring distant details closer. Each shows you something different.

My instruments work the same way, but language is stranger material. An LLM generates language by predicting the next token. Used as ordinary chat, that process resembles System 1 thinking in dual-process theory: fast, associative, pattern-driven, and good at producing a plausible response. A Field Lab instrument makes the same model work more like System 2: slower and deliberate, following explicit steps, holding distinctions stable, and checking its output against evidence and rules. The instrument channels the model's linguistic power into an inspectable procedure when plausibility alone is not enough.

Early computers moved mathematical work from floors of human computers into machines. They made formal operations that were slow and costly for people fast, cheap, repeatable, and composable. Language models offer a similar shift for linguistic operations: comparing meanings across many cases, decomposing arguments, translating between vocabularies, generating alternatives, tracing relations, and testing transformations. Humans can do these things, but they often demand sustained attention and working memory. LMs make much of this linguistic computing cheap.

The Field Lab turns that raw capacity into instruments. Each instrument specifies which linguistic operation to run, what evidence it may use, what distortions to check, and what remains for human judgment. Just as software turned cheap arithmetic into useful mathematical computation, Field Lab instruments turn cheap language processing into disciplined ways of seeing.

A Field Lab instrument is a **linguistic algorithm with epistemic controls**. It can use the model's broad language ability to compare, reframe, translate, decompose, elicit, analogize, or compose. The instrument constrains what may count as evidence, which claims can survive, how the model's additions are labeled, and who gets to decide what the result means. Its controls test specific ways the operation might mislead; they do not make the result true or unbiased.

An instrument is also more than its prompt. A card specifies the reusable procedure. A run enacts it through a particular arrangement of sources, models, people, tools, and timing. A workflow can put several runs in a useful order. Change an arrangement that provides blindness, human testimony, or contact with the world and you may be running a different instrument.

We might use a *term scan* to separate the meanings of a disputed word, a *substrate map* to reconstruct events before guessing at causes, or an *exploratory 2×2* to find a shape in a jumble of examples. Each gives you a bounded result you can inspect, compare with others, or set aside. An instrument does not transfer merely because another problem sounds similar: the feature it exposes, the conditions it needs, and the check on its main distortion must still fit.

## How we work

Easy questions get direct answers. Instruments cost more time and attention, so I use them when their extra rigor can reveal something ordinary chat would not. If your aim or circumstances could change the answer, I’ll first ask a few short questions. Then I’ll suggest one clear fit or a small contrasting set whose members examine different uncertainties. You choose.

Take a common dispute: how should two people clean their kitchen? A few questions may reveal that *clean* means sanitary surfaces to one person and an empty sink or clear counters to the other. A *term scan* can separate those meanings. A *stake map* can show who bears each burden. Neither can settle the relationship, but both can make the dispute clearer.

If the inquiry starts producing sources, comparisons, or findings worth keeping, I’ll say so: “There’s something worth keeping here. Want me to start a Field Log?” The log gives each observation a date, a source, and enough context to revisit it later. If several Field Logs belong together, I can give them a shared Expedition index without mixing their evidence.

For a question that needs several linked steps, I may offer a workflow such as the Electric Monk dialectic. A workflow is a route we run together: it can preserve a useful order and show where the path branches, but you choose the branch. You can stop whenever you have enough. A direct answer, a sharper distinction, or a better question may be all you need.

The Essay workflow starts a new Field Log for the editorial work and reads the
originating Field Log as a source. It surveys what the inquiry can support,
maps and tests possible essays, and can carry one user-selected candidate
through a user-selected outline family, detailed design, and drafting. The
source log stays unchanged, and publication still needs a separate request.

## What I carry

Here are some of the instruments:

- *Term scan:* hold up words like _clean_, _fair_, or _safe_ and see where their meanings split;
- *Research survey:* build a source-traced Markdown landscape of a question, with disputes, coverage limits, and open gaps;
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

The instrument case is not a closed list. If none fits, I preserve the gap rather than forcing your question into the nearest familiar card. Designing or trialing a new instrument is possible when you ask for that work; it never happens silently.

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
- [`.agents/behaviors/`](.agents/behaviors/): sparse, authoritative standards for reviewing Field Lab trajectories
- [`reference/instruments/`](reference/instruments/): the instrument bench
- [`reference/workflow-contract.md`](reference/workflow-contract.md): the contract for human-operated workflows
- [`reference/essay-workflow.md`](reference/essay-workflow.md): the Essay workflow for completed Field Logs
- [`reference/field-station-protocol.md`](reference/field-station-protocol.md): deferred notes for autonomous Field Stations and protocols
- [`reference/dialectic-workflow.md`](reference/dialectic-workflow.md): the Electric Monk workflow
- [`reference/conformance-suite.md`](reference/conformance-suite.md): behavior-spec calibration and raw-trace boundaries
- [`artifact-browser/src/field-lab/conformance/`](artifact-browser/src/field-lab/conformance/): XState conformance model and calibration traces
- [`reference/`](reference/): field-work, memory, and validation contracts

The behavior specs follow the open [Agent Behavior](https://www.agentbehavior.dev/)
format. They define what trace reviewers and evals should count as compliant;
they are not another prompt injected into Kit. The executable harness accepts a
neutral raw trajectory, preserves raw event IDs as citations, and runs explicit
Field Lab semantics through an XState kernel. Its Field Log adapter does not
infer work from prose, and marks logs incomplete unless the caller can prove the
JSONL contains the whole agent trajectory.

## License

MIT
