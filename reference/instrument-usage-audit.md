# Instrument usage audit

This ledger supports the `maturity` and `documented_uses` fields on canonical
instrument cards. It records completed Field Lab uses, not efficacy,
correctness, user benefit, or donor-field evidence.

**Audited:** 2026-07-27

**Corpus:** `/Users/kylemathews/programs/dialectics` and this repository

## Counting rule

Count one use when a saved ledger or readout says the named operation completed,
or when a finished artifact clearly performs the card's operation. Deduplicate
mirrored logs, revisions, and later user confirmations of the same run. Exclude
definitions, offers, queues, plans, generic examples, and operations stopped
before a reading.

Count an older workflow operation only when its artifact clearly performs the
same operation. When the current standalone card has stronger controls, note the
predecessor lineage rather than implying that every old run tested those
controls. Use the lower count when the evidence is ambiguous.

## Audit result

| Instrument                | Completed uses | Maturity      |
| ------------------------- | -------------- | ------------- |
| `atlas`                   | 8              | `trialed`     |
| `attribute-interpolation` | 0              | `draft`       |
| `behavior-chain`          | 0              | `draft`       |
| `belief-stress`           | 1              | `trialed`     |
| `blind-cartography`       | 1              | `trialed`     |
| `candidate-spectrograph`  | 1              | `trialed`     |
| `criterion-excavation`    | 1              | `trialed`     |
| `defamiliarize`           | 2              | `trialed`     |
| `design-grammar`          | 1              | `trialed`     |
| `donor-perturb`           | 8              | `trialed`     |
| `elenchus`                | 8              | `trialed`     |
| `focus-interview`         | 9              | `trialed`     |
| `formation-section`       | 0              | `draft`       |
| `fracture-scan`           | 3              | `trialed`     |
| `frame-projector`         | 4              | `trialed`     |
| `framing-sensitivity`     | 0              | `draft`       |
| `frontier-rheometer`      | 1              | `trialed`     |
| `ground-condition`        | 6              | `trialed`     |
| `home-frame-leak`         | 0              | `draft`       |
| `hostile-assay`           | 2              | `trialed`     |
| `loss-audit`              | 22             | `practiced`   |
| `negative-transfer`       | 3              | `trialed`     |
| `neutral-control`         | 2              | `trialed`     |
| `open-page`               | 0              | `draft`       |
| `position-preservation`   | 0              | `draft`       |
| `real-world-check`        | 0              | `draft`       |
| `residue-collect`         | 3              | `trialed`     |
| `self-distanced-replay`   | 0              | `draft`       |
| `stake-map`               | 0              | `draft`       |
| `structural-recombine`    | 100            | `established` |
| `substrate-map`           | 6              | `trialed`     |
| `taboo-parallax`          | 2              | `trialed`     |
| `tension-statement`       | 2              | `trialed`     |
| `term-scan`               | 5              | `trialed`     |
| `third-pole`              | 16             | `practiced`   |

## Material qualifications

- `behavior-chain` begins at zero. One prior agent-failure comparison helped
  with card admission, but the shipped card targets human material and that
  trial does not test it.
- The 2026-07-27 Rubric Builder forward-test adds one completed use each for
  `focus-interview`, `criterion-excavation`, `neutral-control`,
  `hostile-assay`, and `loss-audit`. Intake and excavation reconstructed the
  user's answers from existing user-authored material rather than a normal
  live, one-example-at-a-time interview, so Criterion Excavation's pacing and
  correction controls remain untested. The loss audit used one fresh scanner
  with sibling records visible rather than parallel one-source scanners; its
  result is complete but has weaker separation. A target-contaminated holdout
  application was discarded and contributes no count.
- `home-frame-leak` has three documented stopped runs and no valid completed
  reading. The stop-rule evidence remains useful but does not raise the
  completed-use count.
- `atlas` has one run under the current card name and eight distinct wiki-backed
  workflow uses. The count deduplicates the named run from its workflow.
- `belief-stress` and `elenchus` have older workflow lineages whose controls do
  not always match the current standalone cards.
- `structural-recombine` records a conservative floor of 100 completed Boydian
  decomposition outputs across well over five inquiries, plus one run under
  the current card name. The maturity label applies to the core operation, not
  every control added to the current card.
- `loss-audit` has twenty named workflow outputs and one ad hoc run.
- `position-preservation` has substantial workflow analogues, but none is clear
  enough to count as the standalone card.

Representative current-card evidence appears in:

- `dialectics/field-trip-act-two-search-ecology/field_log.md`
- `dialectics/field-trip-anthropic-agi-strategy-tax/round_1_dialectic_log.md`
- `dialectics/field-trip-databricks-yan-conversation/field_log.md`
- `dialectics/field-trip-liang-worldview/field_log.md`
- `dialectics/field-trip-non-anglo-transit-systems/field_log.md`
- `dialectics/field-trip-nonnumerical-novel-decisions/field_log.md`
- `dialectics/baas-market-survey/survey_log.md`
- `dialectics/survey-japanese-work-taboo/survey_log.md`
- `dialectics/survey-us-founder-ideal/survey_log.md`

Re-run the audit before raising a maturity label. Do not lower a count merely
because an old artifact moved; record the missing evidence and investigate.
