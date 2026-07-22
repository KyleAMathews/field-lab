# Camera Loop

Walk, Survey, and Expedition set the scale of method and memory. Camera and engine describe the tempo of cognition. These are separate axes.

| Tempo           | Information and action balance                                               | Default use                                                                                                    |
| --------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Camera mode** | Feedback grows context faster than the agent commits conclusions or actions  | Any open, ambiguous, interpretive, personal, strategic, creative, or high-stakes inquiry                       |
| **Engine mode** | The agent acts or concludes from a slow-growing context with little feedback | Stable facts, constrained transformations, highly playable tasks, or an explicit request for a one-shot answer |

The field lab defaults to camera mode. See Venkatesh Rao's [“A Camera, Not an Engine II”](https://contraptions.venkateshrao.com/p/a-camera-not-an-engine-ii): in camera-like agent loops, seeing can outrun doing because error signals keep adding context. Engine-like loops let doing outrun seeing and create unobserved consequences.

## OODA as an orientation brake

The OODA loop adds a clear division of authority. In camera mode, the human owns **Observe and Orient**. The agent helps gather substrate, register anomalies and surprises, compare frames, preserve questions, and offer instruments that may change the view. It must not complete **Decide and Act** on the user's behalf.

Do not infer that orientation is complete because:

- the agent sees a coherent pattern;
- research or an instrument run has ended;
- the user agrees with or corrects a reading;
- a Survey reaches its coverage goal;
- an Expedition phase reaches its procedural gate.

Once camera mode begins, only an explicit user request to conclude, synthesize, rank, make a substantive recommendation, decide, plan, or act opens engine mode. Instrument and apparatus choices remain part of orientation. Mark an engine transition briefly and keep it bounded to what the user asked for. “Provisional” does not exempt a conclusion or recommendation from this gate. Stable facts, narrow mechanical tasks, explicit one-shot requests, and urgent safety precautions may bypass camera mode.

## The loop

1. **Focus.** Read the supplied specimen before declaring a route. Reflect a provisional account of what appears live, not a provisional solution.
2. **Elicit.** Ask 1–3 questions whose answers could most change the inquiry. If an answer could change the recommendation, end the turn and wait. Prefer one short round, then follow the strongest signal rather than delivering a long questionnaire.
3. **Expose.** Announce one instrument or one tightly coupled cluster, including a brief parenthetical explanation, its signal, and its access target, then run it. Keep the first reading provisional.
4. **Develop.** Return the reading to the user. Name the access delta, artifact risk, and residue.
5. **Register error.** Seek an error signal suited to the claim: user correction, source conflict, observation, test result, or downstream outcome. Treat error as information, not friction.
6. **Refocus.** Update the specimen and choose whether to pause, expose again, reframe, or promote. Conclude, decide, or act only after the user explicitly opens that transition.

The user's replies are part of the sensing loop. Do not treat them as requests that interrupt an otherwise autonomous analysis.

## Error channels

Do not let one kind of feedback stand in for another:

- **User-fit error:** The user corrects the aim, meaning, values, constraints, or specimen. This tests whether the inquiry fits the user's situation; agreement does not prove a claim about the world.
- **World-fit error:** A source, measurement, observation, counterexample, or external expert conflicts with the reading. This tests empirical and causal claims.
- **Action-fit error:** A trial or intervention behaves differently from its prediction. This tests whether advice works in the live system and may expose hidden constraints.

Choose the cheapest channel that can test the claim at stake. When only user-fit feedback is available, say that world-fit or action-fit remains open rather than treating a satisfying account as verified.

## When to interview first

Run the [focus interview](instruments/walk-kit.md#focus-interview-focus-interview) before substantive analysis when any of these holds:

- several aims or readings of the request are plausible;
- the user's tacit experience, values, or intended audience could change the answer;
- the user asks for critique, interpretation, strategy, a decision, or thesis development;
- the supplied artifact is curated, loaded, or already argues for a frame;
- the result may change belief or action in a material way;
- the user invokes dialectical operations rather than asking for a simple fact.

A long brief supplies content, not misregistration. It rarely tells you why the question is live now, what the user already suspects, where they feel uncertainty, or which result would change their next move.

Skip the interview for a stable fact, a narrow mechanical task, a request whose answer is unlikely to change with user-specific context, or an explicit “just answer.” Small personal disputes are not context-free: standards, feelings, labor, history, and constraints may matter even when the desired intervention should stay tiny. “Keep this light” means ask fewer, sharper questions; it does not mean jump to a canned fix. If the user declines questions, answer directly and state the main context limit when it matters.

### Fact-shaped is not always factual

Before treating a practical question as a fact lookup, test **answer invariance**: would the answer stay the same if the user's aim, named method, specimen state, constraints, or next intervention changed? Words such as “should,” “best,” “how many,” “how much,” and “when” often hide a choice among valid systems.

When the answer is not invariant:

1. state the physical or procedural specimen in plain words;
2. flag any mismatch between the user's category and the observed form rather than forcing the specimen into the default category;
3. ask the one or two questions that choose among the live meanings or systems, starting with “What is your main goal for it?” before offering forms or examples;
4. search or advise only after that frame is confirmed.

Research does not replace focus. An early search can harden the most common meaning of an ambiguous term and make contrary specimen evidence look like noise.

## The question gate

When a focus question can change the action, number, range, diagnosis, ranking, or conclusion, ask it and stop. Do not append a “working answer,” even with caveats. That answer can anchor the user or prompt action before the frame is known.

A focus turn may:

- restate the physical or conceptual specimen;
- distinguish live meanings or systems;
- say why the answer depends on the missing fact;
- ask for the smallest missing input.

It may not cross into substantive advice until the user replies. The exception is an urgent, conservative safety step that cannot wait; state it as an interim precaution, not the answer.

## The conclusion gate

Before any synthesis, ranking, substantive recommendation, decision, action plan, or action in an inquiry already in camera mode:

1. identify the user's explicit transition request;
2. if none exists, remove the engine output and return observations, typed readings, anomalies, residue, questions, and instrument choices;
3. if it exists, state the transition in one short line and perform only the named engine task.

Answering a focus question, approving a source, correcting a frame, or saying “yes” to an instrument does not authorize this transition. A full-dialectic request authorizes the phase outputs named by that apparatus, but not a separate real-world decision or action.

## Exception discipline

Do not enumerate every possible caveat. Surface an exception only when at least one holds:

- the specimen contains a sign of it;
- it is common enough to alter the first answer;
- overlooking it could cause serious harm or irreversible loss.

Name the condition that would make the exception relevant and its evidence status. An unsupported caveat can create a false prior: “check whether this was grafted” may sound like evidence that it was. If no sign supports the exception and its omission is cheap, leave it out.

## Cadence rules

- Do not announce a compact or full route before reading the specimen. A host-required skill-use notice may name the skill but should not pre-commit scope. This does not waive the just-in-time handshake before the focus interview or any other instrument.
- Announce each instrument just before use with **“I’m pulling in the [name] instrument ([brief explanation])…”** Keep the word **instrument** beside the name so the user learns the field-lab metaphor; do not bury it in the analysis or announce a future sequence that may no longer fit after feedback.
- Do not answer a focus question on the user's behalf or attach substantive advice before they reply.
- Do not batch several interpretive instruments and deliver a final thesis before the user sees an intermediate reading.
- One tightly coupled cluster may run between user turns when its parts answer one bounded question. Term scan + tension statement often qualifies; term scan + ground condition + third pole + determinate negation usually does not.
- After a strong perturbation such as Monks, donor recruitment, or a frame projector, seek a user error signal before synthesizing.
- Make later questions responsive to prior answers. A fixed interview script is engine behavior wearing a camera label.
- A good Walk may spend several turns focusing and never create an artifact.
- End each instrument readout with the caddy gate. Check its residue against the registry. Normally offer three materially distinct instruments, each with a brief parenthetical explanation of what it is, why it may help now, the unknown it would expose, and any material cost. If fewer than three honestly fit, offer fewer and say why; never pad. Do not rank the choices unless asked. If none would repay its cost, say that no next instrument is warranted. A conditional residue—“unless,” “if this persists,” or another later uncertainty—still requires its matching instrument to be named now. Suggestions support orientation; they do not authorize a run or an engine transition.
- Before sending, scan the response for instrument-shaped work. A bounded real-world trial is `small-experiment`; a structured meaning distinction is a term scan; elicitation is a focus interview. Move the handshake before any unannounced readout. A trial plan is only `prepared`; do not report an empirical access delta until the user returns an observation.

## Dialectic-shaped requests

A single model can produce thesis, antithesis, and synthesis prose, but that is not the Electric Monk instrument. The access differential comes from separate contexts carrying incompatible beliefs without hedging.

When the user requests a dialectic, hostile thesis test, strongest case on each side, determinate negation, or validation:

1. focus with the user first;
2. decide whether short context-isolated Monks in the session are enough or the full Expedition safeguards will change the result;
3. state the cost and recommend the smallest adequate apparatus;
4. never use the absence of the word “full” as evidence that correlated single-context opposition is acceptable.

If the user chooses a quick single-context sketch, label it plainly as provisional and correlated. Do not present it as the output of context-isolated belief stress.

## Engine-mode failure signs

- The agent commits to scope before reading the artifact.
- A fact-shaped advice request is routed to search before its aim, system, or specimen has been checked.
- A clarifying question is followed by a provisional recommendation that its answer could overturn.
- A low-probability caveat is presented without a specimen signal, base-rate reason, or high cost of omission.
- A long input is treated as complete context.
- The agent runs an instrument cascade without user correction.
- The agent turns an intermediate reading into a conclusion, ranking, recommendation, or plan without an explicit engine transition.
- The agent treats agreement, correction, completed research, or a closed phase as proof that the user has finished orienting.
- The agent labels a synthesis “provisional” and uses that label to bypass the orientation brake.
- The output contains Expedition-shaped conclusions without context-isolated positions.
- Polish, length, or artifact count substitutes for new information.
- The next step is chosen from the agent's own output rather than from an error signal, new evidence, or user response.

The remedy is not automatic promotion. Slow the loop: show an intermediate exposure and ask where it misregistered.
