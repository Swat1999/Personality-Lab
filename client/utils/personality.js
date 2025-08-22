export function analyzePersonalityClient(answers) {
  let score = 0;
  if (answers.teamPlayer === 'team player') score += 2;
  if (answers.teamPlayer === 'both') score += 1;
  if (answers.accountability === 'Yes') score += 2;
  if (answers.openToCriticism === 'Yes') score += 2;
  if (answers.approachable === 'Yes') score += 1;
  if (answers.easyGoing === 'Yes') score += 1;
  if (answers.getsTriggered === 'Yes') score -= 1;
  if (answers.likesGoingOut === 'Going out') score += 1;
  if (answers.keepUpTrends === 'Yes') score += 1;
  if (answers.readingOrMovies === 'Reading books') score += 1;

  if (score >= 8) return 'Collaborative & Adaptable';
  if (score >= 5) return 'Balanced & Reliable';
  if (score >= 2) return 'Independent & Thoughtful';
  return 'Reserved / Needs Growth';
}

export function suggestImprovements(answers) {
  const list = [];
  if (answers.openToCriticism === 'No') list.push('Practice receiving constructive feedback: ask for 1 takeaway after tasks.');
  if (answers.teamPlayer === 'individual') list.push('Join a small collaboration to build team habits.');
  if (answers.prefersAlone === 'Alone') list.push('Try a weekly coffee/meet-up to expand your support circle.');
  if (answers.likesGoingOut === 'Staying in') list.push('Plan one social outing a week to diversify experiences.');
  if (answers.getsTriggered === 'Yes') list.push('Learn quick calming tools: deep breathing or journaling.');
  if (answers.keepUpTrends === 'No') list.push('Subscribe to one newsletter in your interest area.');
  if (list.length === 0) list.push('You appear balanced — keep reflecting weekly.');
  return list;
}
