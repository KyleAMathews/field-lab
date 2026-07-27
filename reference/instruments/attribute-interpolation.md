---
id: attribute-interpolation
name: "Attribute interpolation"
summary: "Controlled generated variants, invariant features, collateral changes, and candidate thresholds along one declared attribute"
use_when: "A person wants to inspect how one specimen changes as one meaningful quality varies"
avoid_when: "Do not use without a stable source, one operational attribute, and declared invariants."
access_target: "Generated thresholds, discontinuities, co-varying qualities, and invariants along one declared change"
requires: "One preserved specimen, one attribute with anchors, and conditions to hold fixed"
execution_seat: orchestrator
fresh_context: optional
effort: medium
persistence: "One strip of three to five variants; can be done here or saved with the source when reused."
artifact_risk: "Generated steps imply a real continuous axis, while hidden qualities change with the named attribute."
maturity: draft
documented_uses: 0
---

# Attribute interpolation (`attribute-interpolation`)

- **Phenomenon sought:** Candidate thresholds, discontinuities, linked changes, and invariants exposed by generating controlled variants of one specimen along one declared attribute.
- **Why use it:** A label such as “more direct,” “more formal,” or “more abstract” hides what changes with it. An ordered strip makes the model's implied transitions inspectable without treating one endpoint as the answer.
- **Operating range:** Use for writing, design, strategy, concepts, or other material where the user already cares about one quality. Do not use without a stable source, an operational account of the attribute, and features to hold fixed. Do not offer a broad palette when the user is already overloaded by choices.
- **Input:** One frozen specimen, one attribute, two described or exemplified anchors, and a short invariant list. Use a small three-position strip by default; ask about the count only when it would change the result. If the attribute is vague, ask one question at a time until the endpoints imply observable differences.
- **What changes:** The model generates rather than measures variants. It attempts to vary one quality while holding declared conditions fixed, but latent correlations may change tone, content, structure, or values at the same time.
- **Procedure:**
  1. **Freeze the source.** Preserve the original and list the features that must not change.
  2. **Define one attribute.** State both anchors in observable terms or examples. Do not use a bare numeric scale as the definition.
  3. **Choose a small strip.** Use three generated positions unless the case needs fewer. Do not ask the user to rank them.
  4. **Generate independently from the source.** Produce each variant from the frozen specimen and its target position, not by editing the prior variant.
  5. **Audit invariants and collateral changes.** For every variant, name the intended change, any invariant breach, and any other quality that moved.
  6. **Mark candidate thresholds.** Describe where a small requested change appears to alter category, function, or interpretation. Call these generated discontinuities, not measurements of latent space.
  7. **Return the strip.** Place variants in order with the audit. Ask what the user notices; do not select a preferred point unless asked.
- **Result:** Return the frozen source, attribute definition, anchors, ordered generated variants, invariant audit, collateral changes, candidate thresholds, and unresolved ambiguity. Label every variant as a generated sample.
- **Control:** Generate each position from the same source. Keep an invariant checklist and reject or repair variants that violate it. Repeat one position only when framing sensitivity matters. The source remains the reference, not the previous variant.
- **Common distortions:** A subjective label becomes a fake metric; the model produces a smooth sequence because one was requested; correlated changes hide inside the target attribute; endpoints smuggle in a value judgment; or several variants create decision fatigue.
- **Escalate / stop:** Stop when the attribute cannot be defined without several simultaneous changes, the invariants keep breaking, or the variants differ only cosmetically. Testing a threshold in the world needs a separate chosen operation.
- **What it requires:** One bounded generation pass and a comparison strip. Ask for one definition or correction at a time. Save the source and variants when later tests need the same anchors.
- **Execution placement:** **Orchestrator.** It owns the frozen source, anchors, invariant list, and comparison. A fresh executor may generate one blinded position when contamination matters, but the orchestrator applies the same audit to all variants.
- **Distinctness:** Unlike [`framing-sensitivity`](framing-sensitivity.md), this instrument varies the specimen rather than the probe. Unlike [`design-grammar`](design-grammar.md), it varies one declared quality instead of recombining structural primitives. Unlike [`frame-projector`](frame-projector.md), it does not sort cases on two axes.
- **Provenance:** This Field Lab instrument draws on controlled interpolation as a way to navigate generated possibility spaces and on Kyle Mathews's [“Flying Drones in Latent Space”](https://bricolage.io/flying-drones-latent-space/). Its generated strip is a probe, not evidence that the model contains a linear, measurable axis matching the user's attribute.
