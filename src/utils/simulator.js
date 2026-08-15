/**
 * Simulates active evaluation agent progress step-by-step
 */
export function calculateRewardScore(testSuite, weights, diffLines = 0) {
  const totalTests = testSuite.length;
  if (totalTests === 0) return 0;
  
  const passedTests = testSuite.filter(t => t.status === "PASSED").length;
  const unitTestRatio = passedTests / totalTests;

  const unitWeight = weights.unitTests || 0.6;
  const diffWeight = weights.diffCleanliness || 0.2;
  const secWeight = weights.securityScore || 0.2;

  // Base score from passed tests
  let score = unitTestRatio * unitWeight * 100;

  // Bonus for small, clean diffs
  if (diffLines > 0 && diffLines < 20) {
    score += diffWeight * 100;
  } else if (diffLines >= 20) {
    score += (diffWeight * 50);
  }

  // Security score
  score += secWeight * 100;

  return Math.min(100, Math.round(score * 10) / 10);
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`;
}
