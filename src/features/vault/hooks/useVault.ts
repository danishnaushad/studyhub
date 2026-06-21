import { useMemo } from 'react';
import { useAllQuestions } from '../../workspace/hooks/useQuestions';
import { useCategories } from '../../../hooks/useCategories';
import { computeVaultStats, getMasteryLevel } from '../utils/vaultHelpers';


export function useVault() {
  const { questions, loading: questionsLoading } = useAllQuestions();
  const { categories, loading: categoriesLoading } = useCategories();

  const loading = questionsLoading || categoriesLoading;

  const stats = useMemo(() => computeVaultStats(questions), [questions]);

  const dueQuestions = useMemo(() => {
    const now = Date.now();
    return questions.filter(q => q.status !== 'mastered' && (!q.nextReview || q.nextReview <= now));
  }, [questions]);

  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const catQuestions = questions.filter(q => q.categoryId === cat.id);
      const total = catQuestions.length;
      const avgMastery = total > 0
        ? Math.round(catQuestions.reduce((sum, q) => sum + (q.masteryScore || 0), 0) / total)
        : 0;
      const mastered = catQuestions.filter(q => (q.masteryScore || 0) >= 90).length;
      const dueNow = catQuestions.filter(q => q.status !== 'mastered' && (!q.nextReview || q.nextReview <= Date.now())).length;
      const level = getMasteryLevel(avgMastery, total > 0 ? 1 : 0);

      return { ...cat, total, avgMastery, mastered, dueNow, level };
    }).filter(c => c.total > 0);
  }, [categories, questions]);

  const weakConcepts = useMemo(() => {
    return questions
      .filter(q => (q.masteryScore || 0) < 40 && (q.reviewCount || 0) > 0)
      .sort((a, b) => (a.masteryScore || 0) - (b.masteryScore || 0))
      .slice(0, 5);
  }, [questions]);

  return {
    questions,
    categories,
    stats,
    categoryStats,
    weakConcepts,
    dueQuestions,
    loading
  };
}
