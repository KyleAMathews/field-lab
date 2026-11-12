------------------------------ MODULE Nephi2 ------------------------------
EXTENDS TLC

\* An interpretive abstraction of 2 Nephi 2, not a formalization of every
\* claim in the chapter. Read interpretation.json for verse links and limits.
\* Grace, resurrection and intercession are provisions of this represented
\* world, not events purchased by a person's actions or added after death.
CONSTANTS CollapseJudgmentIntoLife, FreezeCaptivityChoice
VARIABLES stage, response, descendants, judged, choseCaptivity
vars == <<stage, response, descendants, judged, choseCaptivity>>

Init ==
  /\ stage = "Eden"
  /\ response = "Uncommitted"
  /\ descendants = FALSE
  /\ judged = FALSE
  /\ choseCaptivity = FALSE

\* vv. 22-23: the no-transgression counterfactual can stay in Eden forever.
RemainInEden == /\ stage = "Eden" /\ UNCHANGED vars

\* v. 19: a narrative transition, not a claim that all opposition is sin.
FallAndExile ==
  /\ stage = "Eden"
  /\ stage' = "Exile"
  /\ UNCHANGED <<response, descendants, judged, choseCaptivity>>

\* vv. 20-21: the role changes from the first parents to their descendants.
\* Generations and instruction are compressed into one abstract transition.
DescendantsAndProbation ==
  /\ stage = "Exile"
  /\ stage' = "Probation"
  /\ descendants' = TRUE
  /\ UNCHANGED <<response, judged, choseCaptivity>>

\* vv. 21, 27-29: model a revisable orientation during probation, not one
\* isolated act that mechanically decides a person's eternal outcome.
\* "Mediator" abstracts the response described in vv. 7-9 and 27-28;
\* it does not replace grace with a sufficient human achievement.
ChooseLiberty ==
  /\ stage = "Probation"
  /\ ~(FreezeCaptivityChoice /\ response = "Captivity")
  /\ response' = "Mediator"
  /\ UNCHANGED <<stage, descendants, judged, choseCaptivity>>

ChooseCaptivity ==
  /\ stage = "Probation"
  /\ response' = "Captivity"
  /\ choseCaptivity' = TRUE
  /\ UNCHANGED <<stage, descendants, judged>>

\* v. 10 applies to everyone represented here, independent of response.
ComeToJudgment ==
  /\ stage = "Probation"
  /\ stage' = "Judgment"
  /\ judged' = TRUE
  /\ UNCHANGED <<response, descendants, choseCaptivity>>

\* vv. 8, 27-29 distinguish this from merely appearing at judgment (v. 10).
ReceiveLife ==
  /\ stage = "Judgment"
  /\ (response = "Mediator" \/ CollapseJudgmentIntoLife)
  /\ stage' = "Life"
  /\ UNCHANGED <<response, descendants, judged, choseCaptivity>>

ReceiveCaptivity ==
  /\ stage = "Judgment"
  /\ response = "Captivity"
  /\ stage' = "Captivity"
  /\ UNCHANGED <<response, descendants, judged, choseCaptivity>>

\* The chapter does not supply a decision procedure for "Uncommitted".
\* This is an explicit modeling gap, not a third theological destination.
LeaveDispositionUnspecified ==
  /\ stage = "Judgment"
  /\ response = "Uncommitted"
  /\ stage' = "Unspecified"
  /\ UNCHANGED <<response, descendants, judged, choseCaptivity>>

Done ==
  /\ stage \in {"Life", "Captivity", "Unspecified"}
  /\ UNCHANGED vars

Next ==
  \/ RemainInEden
  \/ FallAndExile
  \/ DescendantsAndProbation
  \/ ChooseLiberty
  \/ ChooseCaptivity
  \/ ComeToJudgment
  \/ ReceiveLife
  \/ ReceiveCaptivity
  \/ LeaveDispositionUnspecified
  \/ Done

\* No fairness assumption: remaining in a state forever is not ruled out
\* by an invented scheduler. We check safety and exhibit finite witnesses.
Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ stage \in {"Eden", "Exile", "Probation", "Judgment", "Life", "Captivity", "Unspecified"}
  /\ response \in {"Uncommitted", "Mediator", "Captivity"}
  /\ descendants \in BOOLEAN
  /\ judged \in BOOLEAN
  /\ choseCaptivity \in BOOLEAN

NoFallNoChildren == stage = "Eden" => ~descendants
OutcomeFollowsJudgment == stage \in {"Life", "Captivity", "Unspecified"} => judged
LifeRequiresMediatorResponse == stage = "Life" => response = "Mediator"
ProbationOffersBothChoices ==
  stage = "Probation" => (ENABLED ChooseLiberty /\ ENABLED ChooseCaptivity)

\* These negated goals are used only to obtain concrete reachability traces.
\* Their expected failure is a found witness, not a defect in the source.
AvoidLife == stage # "Life"
AvoidCaptivity == stage # "Captivity"
AvoidRepentance == ~(stage = "Life" /\ choseCaptivity)
=============================================================================
