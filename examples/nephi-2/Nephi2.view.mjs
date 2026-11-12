export const title = '2 Nephi 2: an interpretive agency model';
export const state = ({stage, response}) => {
  if (stage === 'Probation') return ['Probation · vv. 21, 26–29', {
    Uncommitted: 'Response unspecified', Mediator: 'Turning toward the Mediator', Captivity: 'Choosing captivity',
  }[response]];
  if (stage === 'Judgment') return ['Judgment · v. 10', {
    Uncommitted: 'Unspecified response', Mediator: 'Mediator-facing response', Captivity: 'Captivity-facing response',
  }[response]];
  return {
    Eden: 'Eden · no fall counterfactual', Exile: 'Fall and exile · v. 19',
    Life: 'Liberty and eternal life · v. 27', Captivity: 'Captivity and death · vv. 27–29',
    Unspecified: 'Disposition left unspecified by this model',
  }[stage];
};
export const step = (action) => ({
  RemainInEden: 'remain without transgression · vv. 22–23',
  FallAndExile: 'partake and leave Eden · v. 19',
  DescendantsAndProbation: 'descendants enter probation · vv. 20–21',
  ChooseLiberty: 'turn toward the Mediator · vv. 21, 27–28',
  ChooseCaptivity: 'choose captivity · vv. 27–29',
  ComeToJudgment: 'come before God · v. 10',
  ReceiveLife: 'life through the Mediator · vv. 8, 27',
  ReceiveCaptivity: 'captivity and death · vv. 27–29',
  LeaveDispositionUnspecified: 'no verdict inferred for an unspecified response',
  Done: 'terminal observation',
})[action] ?? action;
