function analyzePersonality(answers = {}) {
  let score = 0;
  if (!answers) return 'Balanced';

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

module.exports = { analyzePersonality };
