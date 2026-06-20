import type { Question } from '../../../types';

export type RatingType = 'again' | 'hard' | 'good' | 'easy';

export interface RatingResult {
  newMasteryScore: number;
  newStatus: Question['status'];
  nextReviewDate: number;
  requeueOffset: number; // 0 means do not requeue
  hasLapsedThisSession: boolean;
  actualGained: number;
}

export function calculateStatus(
  masteryScore: number,
  hasLapsedThisSession: boolean
): Question['status'] {
  if (masteryScore === 100) {
    return hasLapsedThisSession ? 'review' : 'mastered';
  }
  if (masteryScore >= 50) {
    return 'review';
  }
  return 'learning';
}

export function calculateNextReview(rating: RatingType, now: number): number {
  let daysToAdd = 0;
  if (rating === 'hard') daysToAdd = 1;
  else if (rating === 'good') daysToAdd = 3;
  else if (rating === 'easy') daysToAdd = 7;
  
  return now + (daysToAdd * 24 * 60 * 60 * 1000);
}

export function evaluateRating(
  question: Question,
  rating: RatingType,
  isCorrect: boolean,
  failedCardIds: Set<string>,
  now: number = Date.now()
): RatingResult {
  let masteryChange = 0;
  let requeueOffset = 0;

  switch (rating) {
    case 'again': 
      masteryChange = -10; 
      requeueOffset = 3; // Reinsert ~3 cards away
      break;
    case 'hard': 
      masteryChange = 5; 
      requeueOffset = -1; // Reinsert at the very end
      break;
    case 'good': 
      masteryChange = 10; 
      break;
    case 'easy': 
      masteryChange = 20; 
      break;
  }

  let actualMasteryChange = masteryChange;
  const safeType = question.type || 'concept_review';
  const isFailure = (safeType !== 'concept_review' && isCorrect === false) || (rating === 'again');
  
  if (!isFailure && rating === 'hard') {
    requeueOffset = 0;
  }

  if (isFailure) {
    if (rating === 'again') actualMasteryChange = -10;
    else if (rating === 'hard') actualMasteryChange = -5;
    else actualMasteryChange = 0; // Fallback to prevent jumps
  } else if (failedCardIds.has(question.id) || (question as any).lapsedThisSession) {
    // If it lapsed earlier in the session, it cannot gain mastery now!
    if (actualMasteryChange > 0) {
      actualMasteryChange = 0;
    }
  }

  const newMasteryScore = Math.max(0, Math.min(100, (question.masteryScore || 0) + actualMasteryChange));
  const actualGained = newMasteryScore - (question.masteryScore || 0);
  
  const hasLapsedThisSession = isFailure || failedCardIds.has(question.id) || !!(question as any).lapsedThisSession;
  
  const newStatus = calculateStatus(newMasteryScore, hasLapsedThisSession);
  const nextReviewDate = calculateNextReview(rating, now);

  return {
    newMasteryScore,
    newStatus,
    nextReviewDate,
    requeueOffset,
    hasLapsedThisSession,
    actualGained
  };
}

export function buildStudyQueue(
  questions: Question[],
  filter: 'all' | 'learning' | 'review' | 'mastered',
  now: number = Date.now()
): Question[] {
  let sourceQuestions = questions;
  if (filter !== 'all') {
    sourceQuestions = questions.filter(q => q.status === filter);
  }

  const dueToday = sourceQuestions.filter(q => q.status !== 'mastered' && q.nextReview && q.nextReview <= now);
  const learning = sourceQuestions.filter(q => q.status === 'learning' && !dueToday.find(d => d.id === q.id));
  const review = sourceQuestions.filter(q => q.status === 'review' && !dueToday.find(d => d.id === q.id));
  const mastered = sourceQuestions.filter(q => q.status === 'mastered');

  return [...dueToday, ...learning, ...review, ...mastered];
}

export interface CategoryStats {
  newCards: number;
  learningCards: number;
  dueToday: number;
  masteredCards: number;
  masteryPercentage: number;
  totalCards: number;
}

export function calculateCategoryStats(questions: Question[], now: number = Date.now()): CategoryStats {
  let newCards = 0;
  let learningCards = 0;
  let dueToday = 0;
  let masteredCards = 0;
  const totalCards = questions.length;

  questions.forEach(q => {
    if (q.status === 'mastered') masteredCards++;
    else if (q.status === 'learning' && q.reviewCount === 0) newCards++;
    else if (q.status === 'learning') learningCards++;
    
    if (q.status !== 'mastered' && (!q.nextReview || q.nextReview <= now)) dueToday++;
  });

  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return {
    newCards,
    learningCards,
    dueToday,
    masteredCards,
    masteryPercentage,
    totalCards
  };
}
