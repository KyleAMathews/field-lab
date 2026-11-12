// Labels project the frozen model; they neither compute nor change its verdict.
export const title = "Design Grammar: ground generation before it starts";
export const state = ({ phase, reconstructed, preservationChecked }) => {
  if (phase === "generated") {
    return reconstructed && preservationChecked
      ? "Adjacent forms generated from grounded rules"
      : "Adjacent forms generated before grounding";
  }
  if (phase === "frozen") return "Grammar frozen after both checks";
  if (reconstructed && preservationChecked) return "Reconstruction and preservation checked";
  if (reconstructed) return "Source reconstructed; preservation still unchecked";
  if (preservationChecked) return "Preservation checked; reconstruction still missing";
  return "Candidate grammar extracted";
};
export const step = (action) => ({
  Reconstruct: "rebuild the source",
  CheckPreservation: "check the preservation properties",
  Freeze: "freeze the checked grammar",
  Generate: "generate adjacent forms",
  Done: "keep the generated result",
  PrematureGenerate: "generate before both checks",
})[action] ?? action;
