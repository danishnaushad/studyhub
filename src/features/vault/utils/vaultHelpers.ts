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

/** Mock data for UI skeleton / UAT testing */
export const MOCK_QUESTIONS: Question[] = [
  { id: 'mock-1', userId: 'u1', categoryId: 'cat-1', question: 'What is SQL injection?', answer: 'A code injection technique that exploits SQL vulnerabilities in web applications.', type: 'concept_review', status: 'learning', reviewCount: 3, masteryScore: 25, createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000, lastReviewed: Date.now() - 86400000, nextReview: Date.now() - 3600000 },
  { id: 'mock-2', userId: 'u1', categoryId: 'cat-1', question: 'What does XSS stand for?', answer: 'Cross-Site Scripting', type: 'fill_blank', status: 'review', reviewCount: 7, masteryScore: 55, createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 2, lastReviewed: Date.now() - 86400000 * 2, nextReview: Date.now() + 86400000 },
  { id: 'mock-3', userId: 'u1', categoryId: 'cat-2', question: 'Is Python dynamically typed?', answer: 'Yes', type: 'concept_review', status: 'mastered', reviewCount: 12, masteryScore: 95, createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 3, lastReviewed: Date.now() - 86400000 * 3, nextReview: Date.now() + 86400000 * 14 },
  { id: 'mock-4', userId: 'u1', categoryId: 'cat-1', question: 'What is a CSRF attack?', answer: 'Cross-Site Request Forgery — forces an authenticated user to submit unintended requests.', type: 'concept_review', status: 'learning', reviewCount: 1, masteryScore: 10, createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000, lastReviewed: Date.now() - 86400000, nextReview: Date.now() - 7200000, sourceResourceTitle: 'OWASP Guide.pdf', sourcePageNumber: 42, sourceHighlightText: 'CSRF is an attack that forces end users to execute unwanted actions' },
  { id: 'mock-5', userId: 'u1', categoryId: 'cat-2', question: 'What is a Python decorator?', answer: 'A function that takes another function and extends its behavior without modifying it.', type: 'concept_review', status: 'review', reviewCount: 5, masteryScore: 60, createdAt: Date.now() - 86400000 * 8, updatedAt: Date.now() - 86400000 * 1, lastReviewed: Date.now() - 86400000, nextReview: Date.now() },
  { id: 'mock-6', userId: 'u1', categoryId: 'cat-3', question: 'What port does HTTPS use?', answer: '443', type: 'fill_blank', status: 'mastered', reviewCount: 10, masteryScore: 100, createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 5, lastReviewed: Date.now() - 86400000 * 5, nextReview: Date.now() + 86400000 * 30 },
  { id: 'mock-7', userId: 'u1', categoryId: 'cat-3', question: 'What layer does TCP operate on?', answer: 'Transport Layer (Layer 4)', type: 'concept_review', status: 'learning', reviewCount: 0, masteryScore: 0, createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, lastReviewed: null, nextReview: null },
  { id: 'mock-8', userId: 'u1', categoryId: 'cat-1', question: 'Which HTTP method is idempotent?', answer: 'GET, PUT, DELETE', type: 'concept_review', status: 'review', reviewCount: 8, masteryScore: 45, createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000, lastReviewed: Date.now() - 86400000, nextReview: Date.now() },
  { id: 'mock-9', userId: 'u1', categoryId: 'cat-2', question: 'What is list comprehension in Python?', answer: 'A concise way to create lists: [expr for item in iterable if condition]', type: 'concept_review', status: 'mastered', reviewCount: 9, masteryScore: 90, createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 86400000 * 4, lastReviewed: Date.now() - 86400000 * 4, nextReview: Date.now() + 86400000 * 21 },
  { id: 'mock-10', userId: 'u1', categoryId: 'cat-1', question: 'What is the difference between authentication and authorization?', answer: 'Authentication verifies identity; authorization determines access permissions.', type: 'concept_review', status: 'learning', reviewCount: 2, masteryScore: 15, createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000, lastReviewed: Date.now() - 86400000, nextReview: Date.now() - 1800000 },
];

export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Cyber Security', color: 'red' },
  { id: 'cat-2', name: 'Python', color: 'green' },
  { id: 'cat-3', name: 'Networking', color: 'blue' },
];
