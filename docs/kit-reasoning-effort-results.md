# Kit reasoning effort comparison

2026-09-13. Complete.

Low reduced median warm-turn time from **26.4 to 24.7 seconds (6.4%)** in
three pairs. It was faster in two pairs and 0.3 seconds slower in the third.
All six warm turns made one append call and passed the record checks. This
small sample shows a modest saving; it does not establish a reliable general
speedup or justify sacrificing quality on harder work.

| Pair | High | Low | Low versus High |
| --- | ---: | ---: | ---: |
| 1 | 26.422 s | 22.932 s | 3.490 s faster |
| 2 | 27.129 s | 25.330 s | 1.799 s faster |
| 3 | 24.425 s | 24.732 s | 0.307 s slower |
| Median | 26.422 s | 24.732 s | 1.690 s faster |

Median reported reasoning tokens fell from 167 to 106 (36.5%). The reduction
in total elapsed time was much smaller. Model output, input/cache processing,
and runtime overhead remain part of each turn; this experiment does not
attribute seconds to each component.

All comments survived exactly once, histories validated, and saved current
questions matched the final replies. Trace review found focused follow-up
questions and no new research, premature instrument completion, or second-log
edits. Both efforts parked an unresolved prior question when needed or marked
it answered before adding the next question. These checks do not establish
equal quality on complex interviews or dialectic analysis.

[Raw trial summaries and verified turn settings](benchmarks/kit-logging-2026-09-13/reasoning-effort.json)
include all 12 turns: six High-effort recovery seeds and six measured warm
follow-ups. Saved turn metadata confirmed GPT-6 Astra throughout, High for
every seed, and the assigned High/Low setting for every follow-up.

Compare GPT-6 Astra at High and Low for a warm Kit interview turn, using the
same Field Lab code and instructions. The user's standalone CLI configuration
was `model = "gpt-6-astra"` and `model_reasoning_effort = "high"` when inspected.
The benchmark passes per-process overrides; it does not edit those settings.

Reasoning effort is a runner setting. Kit's skill text does not switch the
current conversation's setting. A runner can choose it when starting or
resuming a CLI turn through `model_reasoning_effort`.
See the [official configuration reference](https://developers.openai.com/codex/config-reference).

## Method

- Three High/Low pairs, alternating order: High/Low, Low/High, High/Low.
- Current candidate instructions and GPT-6 Astra fixed for every run. Use
  app-bundled Codex 0.153.3 throughout to match the earlier logging experiments.
- Every trial starts its own disposable Field Trip and saved conversation.
  Its initial recovery turn always uses High, then the same follow-up message
  runs at the assigned effort. Seed times are reported separately.
- The prompt, fixture, and follow-up text are fixed. Each model-generated seed
  response can differ, so the warm histories are equivalent tasks, not byte-
  identical contexts. No trial inherits another trial's answers or log writes.
- Measure full CLI wall time, command count, generated output, reasoning
  tokens, input/cache tokens, and saved events. Require one verbatim comment,
  a valid log, and a current question matching the final response. Inspect the
  replies for scope drift or premature completion as well.
- Confirm actual model/effort from the saved test turns' metadata. No private
  reasoning text is used in the report.

```sh
node scripts/benchmark-kit-logging.mjs --live --pairs 3 --case answer \
  --variant candidate --warm --compare-efforts high,low --model gpt-6-astra \
  --codex /Applications/ChatGPT.app/Contents/Resources/codex
```

This is a small latency experiment on a simple interview, not an evaluation of
research, synthesis, difficult judgment, or long-running dialectic quality.
Timing includes CLI startup, model processing, tool dispatch, and file writes.
It does not isolate inference time or establish a general speed guarantee.
The Low sample is the first turn after changing effort from High. Cache hits
can differ when the setting changes, so this is not a sustained series of
Low-effort turns with a fully warm cache.
