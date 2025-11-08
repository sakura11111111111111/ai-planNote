/**
 * Calculate the next review date based on the Ebbinghaus forgetting curve
 * Simplified version of SuperMemo SM-2 algorithm
 * @param {Object} note - The note object
 * @param {string} quality - 'failed', 'hard', or 'good'
 * @returns {Object} Updated note with new review schedule
 */
export function calculateNextReview(note, quality) {
  const today = new Date();
  let { repetitions, interval, easeFactor } = note;

  // Initialize values if undefined
  repetitions = repetitions || 0;
  interval = interval || 1;
  easeFactor = easeFactor || 2.5;

  switch (quality) {
    case 'failed':
      // Forgot the content, reset progress
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2); // Decrease ease factor
      break;

    case 'hard':
      // Barely remembered, slight increase
      repetitions = repetitions + 1;
      interval = Math.ceil(interval * 1.2); // Modest increase
      easeFactor = Math.max(1.3, easeFactor - 0.15); // Slight decrease
      break;

    case 'good':
      // Remembered well, follow the standard progression
      repetitions = repetitions + 1;
      
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 2;
      } else if (repetitions === 3) {
        interval = 4;
      } else if (repetitions === 4) {
        interval = 7;
      } else if (repetitions === 5) {
        interval = 15;
      } else if (repetitions === 6) {
        interval = 30;
      } else {
        // For repetitions > 6, use ease factor
        interval = Math.ceil(interval * easeFactor);
      }
      
      easeFactor = Math.min(2.5, easeFactor + 0.1); // Slight increase
      break;

    default:
      throw new Error('Invalid quality parameter. Must be "failed", "hard", or "good"');
  }

  // Calculate next review date
  const nextReviewDate = new Date(today);
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return {
    ...note,
    repetitions,
    interval,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString().split('T')[0] // Format as 'YYYY-MM-DD'
  };
}
