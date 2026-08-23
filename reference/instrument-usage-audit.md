# Instrument usage audit

This ledger supports the `maturity` and `documented_uses` fields on canonical
instrument cards. It records completed Field Lab uses, not efficacy,
correctness, user benefit, or donor-field evidence.

**Audited:** 2026-08-23

**Corpus:** this repository, `/Users/kylemathews/programs/dialectics`, and
`/Users/kylemathews/programs/scripture-study`

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

The 2026-08-23 scan added 164 countable canonical completions recorded after
the prior audit. It deduplicated published and Markdown mirrors of JSONL
ledgers, ignored noncanonical prototype IDs, and excluded seven canonical
synthetic comparator runs whose own Field Log says they do not count as
home-domain uses.

## Audit result

| Instrument                | Completed uses | Maturity      |
| ------------------------- | -------------- | ------------- |
| `atlas`                   | 9              | `trialed`     |
| `attribute-interpolation` | 0              | `draft`       |
| `behavior-chain`          | 0              | `draft`       |
| `belief-stress`           | 4              | `trialed`     |
| `blind-cartography`       | 10             | `practiced`   |
| `candidate-spectrograph`  | 2              | `trialed`     |
| `criterion-excavation`    | 2              | `trialed`     |
| `defamiliarize`           | 4              | `trialed`     |
| `design-grammar`          | 25             | `established` |
| `donor-perturb`           | 12             | `practiced`   |
| `elenchus`                | 11             | `practiced`   |
| `focus-interview`         | 12             | `practiced`   |
| `formation-section`       | 7              | `trialed`     |
| `fracture-scan`           | 12             | `practiced`   |
| `frame-projector`         | 15             | `practiced`   |
| `framing-sensitivity`     | 0              | `draft`       |
| `frontier-rheometer`      | 3              | `trialed`     |
| `ground-condition`        | 13             | `practiced`   |
| `home-frame-leak`         | 1              | `trialed`     |
| `hostile-assay`           | 8              | `trialed`     |
| `loss-audit`              | 27             | `established` |
| `negative-transfer`       | 8              | `trialed`     |
| `neutral-control`         | 5              | `trialed`     |
| `open-page`               | 0              | `draft`       |
| `position-preservation`   | 2              | `trialed`     |
| `real-world-check`        | 0              | `draft`       |
| `residue-collect`         | 8              | `trialed`     |
| `self-distanced-replay`   | 0              | `draft`       |
| `stake-map`               | 0              | `draft`       |
| `structural-recombine`    | 105            | `established` |
| `substrate-map`           | 9              | `trialed`     |
| `taboo-parallax`          | 2              | `trialed`     |
| `tension-statement`       | 29             | `established` |
| `term-scan`               | 17             | `practiced`   |
| `third-pole`              | 19             | `practiced`   |

## Material qualifications

- `behavior-chain` remains at zero. One prior agent-failure comparison helped
  with card admission, but the shipped card targets human material and that
  trial does not test it. The later synthetic comparator run also does not
  count as a home-domain use.
- The 2026-07-27 Rubric Builder forward-test adds one completed use each for
  `focus-interview`, `criterion-excavation`, `neutral-control`,
  `hostile-assay`, and `loss-audit`. Intake and excavation reconstructed the
  user's answers from existing user-authored material rather than a normal
  live, one-example-at-a-time interview, so Criterion Excavation's pacing and
  correction controls remain untested. The loss audit used one fresh scanner
  with sibling records visible rather than parallel one-source scanners; its
  result is complete but has weaker separation. A target-contaminated holdout
  application was discarded and contributes no count.
- `home-frame-leak` has three documented stopped runs and one later completed
  reading. The stopped runs remain useful evidence but do not raise the count.
- `atlas` has two runs under the current card name and nine distinct
  wiki-backed workflow uses. The named runs mirror workflow uses, so the
  deduplicated count is nine.
- `belief-stress` and `elenchus` have older workflow lineages whose controls do
  not always match the current standalone cards.
- `design-grammar` reaches 25 uses across at least eight distinct inquiries.
  Its `established` label meets both the count and inquiry-diversity gates.
- `structural-recombine` records a conservative floor of 100 completed Boydian
  decomposition outputs across well over five inquiries plus five later named
  runs. The maturity label applies to the core operation, not every control
  added to the current card.
- `loss-audit` now has 27 countable outputs across more than five inquiries.
- `tension-statement` reaches 29 uses across five distinct inquiries. Its
  `established` label meets both gates, though many of the new readings are
  bounded null results from one item-by-item strategy inventory.
- `position-preservation` now has two named completed runs. Older workflow
  analogues remain excluded because they are not clear enough to count as the
  standalone card.
- The Robert K. Merton comparison fixtures explicitly say their synthetic
  forward-tests do not count as home-domain uses. Its two earlier source-based
  runs do count. Published Field Log copies and Markdown projections of JSONL
  ledgers are mirrors and were deduplicated.

Representative current-card evidence appears in:

- `field-trip-product-instrument-prototypes/field_log.jsonl`
- `dialectics/expedition-databricks-neon-product-fieldwork/field-trips/agentic-infrastructure-neon/field_log.jsonl`
- `dialectics/expedition-databricks-neon-product-fieldwork/field-trips/neon-reactivity-api-design/field_log.jsonl`
- `dialectics/expedition-databricks-neon-product-fieldwork/field-trips/product-strategy-tensions/field_log.jsonl`
- `dialectics/field-trip-orthostatic-readiness/field_log.jsonl`
- `scripture-study/dialectics/providence-life-plan/field-trip/field_log.jsonl`
- `scripture-study/field-trip-buddhist-grasping-and-lds-doctrine/field_log.jsonl`
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
