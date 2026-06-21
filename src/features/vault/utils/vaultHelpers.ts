import type { Question } from '../../../types';

export type MasteryLevel = 'new' | 'learning' | 'improving' | 'strong' | 'mastered';

export interface MasteryLevelInfo {
  level: MasteryLevel;
  label: string;
  color: string;        // tailwind color stem e.g. 'blue-500'
  bgClass: string;      // bg-* / text-* pair
  textClass: string;
  borderClass: string;
  min: number;
  max: number;
}

export const MASTERY_LEVELS: MasteryLevelInfo[] = [
  { level: 'new',       label: 'New',       color: 'gray-400',   bgClass: 'bg-gray-400/10',   textClass: 'text-gray-400',   borderClass: 'border-gray-400/20', min: 0,  max: 0 },
  { level: 'learning',  label: 'Learning',  color: 'blue-500',   bgClass: 'bg-blue-500/10',   textClass: 'text-blue-500',   borderClass: 'border-blue-500/20', min: 1,  max: 39 },
  { level: 'improving', label: 'Improving', color: 'amber-500',  bgClass: 'bg-amber-500/10',  textClass: 'text-amber-500',  borderClass: 'border-amber-500/20', min: 40, max: 69 },
  { level: 'strong',    label: 'Strong',    color: 'purple-500', bgClass: 'bg-purple-500/10', textClass: 'text-purple-500', borderClass: 'border-purple-500/20', min: 70, max: 89 },
  { level: 'mastered',  label: 'Mastered',  color: 'green-500',  bgClass: 'bg-green-500/10',  textClass: 'text-green-500',  borderClass: 'border-green-500/20', min: 90, max: 100 },
];

export function getMasteryLevel(score: number, reviewCount: number = 0): MasteryLevelInfo {
  if (score === 0 && reviewCount === 0) return MASTERY_LEVELS[0]; // New
  for (let i = MASTERY_LEVELS.length - 1; i >= 0; i--) {
    if (score >= MASTERY_LEVELS[i].min) return MASTERY_LEVELS[i];
  }
  return MASTERY_LEVELS[0];
}

/** Compute global vault stats from a list of questions */
export function computeVaultStats(questions: Question[]) {
  const total = questions.length;
  let dueToday = 0;
  let newCards = 0;
  let learningCards = 0;
  let improvingCards = 0;
  let strongCards = 0;
  let masteredCards = 0;
  let totalMastery = 0;

  const now = Date.now();

  questions.forEach(q => {
    const level = getMasteryLevel(q.masteryScore || 0, q.reviewCount || 0);
    totalMastery += (q.masteryScore || 0);

    switch (level.level) {
      case 'new': newCards++; break;
      case 'learning': learningCards++; break;
      case 'improving': improvingCards++; break;
      case 'strong': strongCards++; break;
      case 'mastered': masteredCards++; break;
    }

    if (q.status !== 'mastered' && (!q.nextReview || q.nextReview <= now)) {
      dueToday++;
    }
  });

  const avgMastery = total > 0 ? Math.round(totalMastery / total) : 0;
  const globalLevel = getMasteryLevel(avgMastery, total > 0 ? 1 : 0);

  return {
    total,
    dueToday,
    newCards,
    learningCards,
    improvingCards,
    strongCards,
    masteredCards,
    avgMastery,
    globalLevel,
  };
}


