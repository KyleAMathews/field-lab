# Executable TLA+ control

Read this only when a Design Grammar run contains consequential stateful or concurrent behavior. The control asks a narrow question: do the frozen rules permit a state that violates a frozen invariant within the explored boundary?

## Translate the frozen grammar

Keep a trace from every formal element to the frozen Model or Evidence layer:

| Design Grammar item | TLA+ element |
| --- | --- |
| primitives and active relations | variables |
| source-specific starting state and limits | constants and `Init` |
| legal transformations | actions in `Next` |
| preservation properties and forbidden states | invariants |
| source-supported progress claim | temporal property |
| source-supported scheduling assumption | fairness condition |
| ablation or negative case | deliberately weakened action or configuration |

Do not add fairness to make a liveness property pass. Do not encode an inferred rule as source-stated. Record the model file, configuration, TLC version, explored-state result, and any counterexample in the Process layer.

## Draw the checked state graph

From the skill root:

```sh
scripts/statechart path/to/Model.tla --config path/to/Model.cfg --view path/to/view.mjs --out path/to/new-chart
```

`--config` defaults to the model's sibling `.cfg` file, and `--out` to `Model-chart`. Omit `--view` to show the model's values directly. Use a new or empty output directory. The host needs Docker and Node 20 or later. The image pins TLC 1.7.4, Java 21, Node 24.19.0, and pstack's statechart compiler from version 0.15.36. No global pstack installation is needed. The first image build needs network access; checking runs without network access.

The model directory, configuration directory, and optional view directory are mounted read-only. Keep imported TLA+ modules beside the model and imported view modules within the view directory. The command mounts only a temporary output folder writable and publishes it to the requested destination after a successful check or a counterexample. A setup/checker error or interruption publishes no result. `FIELD_LAB_TLC_IMAGE` changes the image tag used by both this command and `scripts/tlc`.

The output contains:

- `index.md`: the complete checker report followed by a Mermaid statechart. Open this in the artifact browser or embed its chart in the human brief after freezing the analytical state.
- `chart.mmd`: editable Mermaid source, when the compiler emits a chart.
- `report.md`: the unmodified compiler report, with rule verdicts and numbered counterexample paths.
- `tlc.out` and any `tlc-RULE.out`: raw checker output retained by the compiler.

The [2 Nephi 2 example](../examples/nephi-2/) separates narrative transitions
from logical dependencies and plays three concrete TLC paths. Its README
explains how to run the viewer and regenerate the checked-in evidence.

Exit 0 means all configured rules hold in the explored abstraction. Exit 1 means a configured rule breaks; it still writes the chart and report. Exit 2 means setup or checking failed. Interruptions exit 130 or 143. A caller must distinguish a counterexample from a tool failure.

### Give the chart readable labels

A view module exports functions that project model values without changing the model or verdict. Start with [the bundled example](../tools/tla/smoke/DesignGrammarControl.view.mjs). It keeps grounded and premature generation distinct even though both share `phase = "generated"`.

- `state(vars)` returns a string for a flat chart, an array for nested states, or an object whose keys name parallel regions.
- `step(action, from, to)` returns the readable action label. End a label with a condition in brackets when hidden state controls its outcome. In parallel regions, let the compiler supply cross-region conditions rather than overriding them with brackets.
- `group(vars)` and `colors` optionally annotate phase groups; `title` sets the title. Group class names are `blue`, `orange`, `purple`, `yellow`, `teal`, `tan`, and `pink`. Custom group colors need matching renderer CSS or Mermaid class definitions. Failure marks include their own Mermaid styles.

Functions must depend only on their arguments. TLA+ sequences and functions arrive as objects keyed by their indices or arguments; sets arrive as arrays. Write `Next` as a disjunction of named actions so the report can name the steps. Give a correct terminal state an explicit `UNCHANGED vars` action, as the bundled model does, so completion does not appear as a deadlock.

Choose labels from the frozen grammar and retain the formal-element-to-grammar-ID mapping beside the model. A merge must not hide where a rule fails. The compiler distinguishes a state whose members all break a rule (`breaks`) from a state where only some do (`mayBreak`). Keep different failures distinguishable. A parallel-region view falls back to a nested view when it would imply transitions the model does not admit.

Prefer a small chart. Steps that remain within one displayed label are omitted from the drawing; the report states their count. Returning `null` from `step()` hides a transition. Preserve each bug path, reachability from an initial state, and an outgoing arrow for any displayed state that has one in the model. Hide all concrete steps represented by an arrow or none of them. State any hidden transitions in the human return. Keep the full model and report as the source of the result.

### Preserve exploration limits

Use finite constants or source-justified constraints. An unbounded model can run without end. At most 500 distinct model states receive a full-graph drawing. Above that, the compiler draws counterexample paths only; when no rule breaks, it may emit no `chart.mmd`. `index.md` still preserves the report.

The compiler checks the configuration as written, then removes a broken rule and reruns to find other failures. After the first failure, reruns are bounded at 100,000 distinct states. An unfinished check is reported as `not checked`, never as a passing rule. Retain that distinction in the brief.

`VIEW` and `SYMMETRY` identify states for TLC; displayed edges can therefore point to representatives. Constraints also limit which successors are explored and which deadlocks can be found. Preserve the compiler's qualifications and inspect raw traces before treating a projected path as a source-level history. Rendering cannot establish that the encoded abstraction matches the frozen grammar.

### Validate the integration

```sh
scripts/check-statechart-container
```

Pass a new output directory to retain the example in a chosen location:

```sh
scripts/check-statechart-container /tmp/design-grammar-charts
```

The grounded configuration must pass. Enabling premature generation must produce a one-step counterexample to `GenerationIsGrounded`, mark the bad state in the chart, and preserve the same chart and report in `index.md`. The control retains both outputs and prints their location. It tests the checker-to-chart path; it does not validate a new grammar's source fidelity.

The pinned compiler, license, upstream tests, and file hashes live under `tools/tla/statechart/`. Field Lab's wrapper stays outside those upstream files.

## Run TLC directly

The existing raw checker command remains available:

```sh
scripts/tlc path/to/model-directory -config Model.cfg Model
scripts/check-tla-container
```

The container verifies the official `tla2tools.jar` checksum during the build. The JAR and transient state directories are not committed. The model directory is mounted read-only at `/work`; raw TLC writes transient state under `/tmp` in the container.

The raw smoke control checks the same grounded/premature-generation distinction. Neither command replaces reconstruction, ablation, preservation, or range controls.

## Interpret the result

A passing bounded run means TLC found no violation in the states generated by the encoded specification and configuration. It does not prove that:

- the model faithfully represents the source;
- the frozen grammar contains every real transition or invariant;
- the boundary covers production scale or timing; or
- the system is correct outside the explored abstraction.

Classify a counterexample before changing anything:

- **Grammar failure:** the trace is legal under the frozen grammar but violates its preservation contract. Reopen the analytical state, version the correction, and rerun reconstruction, ablation, and affected controls.
- **Encoding failure:** the formal model does not match a frozen item. Correct the mapping and retain a receipt for the change.
- **Boundary discovery:** the result depends on a previously unstated constant, initial state, or fairness assumption. Record it as a boundary condition; do not silently tune it away.

Keep model checking optional when the grammar is static or when the source cannot support a faithful transition model. Mark it `not applicable` rather than manufacturing state merely to use the tool.
