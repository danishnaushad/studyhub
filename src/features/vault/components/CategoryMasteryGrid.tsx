import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { getCategoryColor } from '../../../lib/colors';
import type { Question } from '../../../types';
import { getMasteryLevel } from '../utils/vaultHelpers';

interface CategoryMasteryGridProps {
  questions: Question[];
  categories: { id: string; name: string; color: string }[];
}

export function CategoryMasteryGrid({ questions, categories }: CategoryMasteryGridProps) {
  const categoryStats = categories.map(cat => {
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

  if (categoryStats.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Mastery by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map(cat => {
            const circumference = 2 * Math.PI * 28;
            const offset = circumference - (cat.avgMastery / 100) * circumference;

            return (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-accent/10 hover:bg-accent/20 transition-colors group"
              >
                {/* Progress Ring */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      strokeWidth="4"
                      className="stroke-muted/30"
                    />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      strokeWidth="4"
                      stroke={getCategoryColor(cat.color)}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold font-mono">{cat.avgMastery}%</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{cat.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${cat.level.bgClass} ${cat.level.textClass}`}>
                      {cat.level.label}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{cat.total} cards</span>
                    <span className="text-green-500">{cat.mastered} mastered</span>
                    {cat.dueNow > 0 && (
                      <span className="text-red-500 font-semibold">{cat.dueNow} due</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
