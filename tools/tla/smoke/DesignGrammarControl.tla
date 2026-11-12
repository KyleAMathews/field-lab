------------------------- MODULE DesignGrammarControl -------------------------
EXTENDS TLC

CONSTANT AllowPrematureGeneration

VARIABLES phase, reconstructed, preservationChecked

vars == <<phase, reconstructed, preservationChecked>>

Init ==
  /\ phase = "extracted"
  /\ reconstructed = FALSE
  /\ preservationChecked = FALSE

Reconstruct ==
  /\ phase = "extracted"
  /\ reconstructed' = TRUE
  /\ UNCHANGED <<phase, preservationChecked>>

CheckPreservation ==
  /\ phase = "extracted"
  /\ preservationChecked' = TRUE
  /\ UNCHANGED <<phase, reconstructed>>

Freeze ==
  /\ phase = "extracted"
  /\ reconstructed
  /\ preservationChecked
  /\ phase' = "frozen"
  /\ UNCHANGED <<reconstructed, preservationChecked>>

Generate ==
  /\ phase = "frozen"
  /\ phase' = "generated"
  /\ UNCHANGED <<reconstructed, preservationChecked>>

PrematureGenerate ==
  /\ AllowPrematureGeneration
  /\ phase = "extracted"
  /\ phase' = "generated"
  /\ UNCHANGED <<reconstructed, preservationChecked>>

\* A correct end state may keep the generated result without more work.
Done ==
  /\ phase = "generated"
  /\ UNCHANGED vars

Next ==
  \/ Reconstruct
  \/ CheckPreservation
  \/ Freeze
  \/ Generate
  \/ PrematureGenerate
  \/ Done

Spec == Init /\ [][Next]_vars

TypeOK ==
  /\ phase \in {"extracted", "frozen", "generated"}
  /\ reconstructed \in BOOLEAN
  /\ preservationChecked \in BOOLEAN

GenerationIsGrounded ==
  phase = "generated" => reconstructed /\ preservationChecked

=============================================================================
