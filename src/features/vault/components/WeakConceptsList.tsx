import { AlertTriangle, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import type { Question } from '../../../types';
import { MasteryLevelBadge } from './MasteryLevelBadge';

interface WeakConceptsListProps {
  questions: Question[];
  limit?: number;
}

export function WeakConceptsList({ questions, limit = 5 }: WeakConceptsListProps) {
  // Weak concepts: reviewed multiple times but still low mastery
  const weakConcepts = questions
    .filter(q => q.reviewCount >= 2 && (q.masteryScore || 0) < 50)
    .sort((a, b) => (a.masteryScore || 0) - (b.masteryScore || 0))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          Weak Concepts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weakConcepts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm italic">No weak concepts detected.</p>
            <p className="text-xs mt-1 opacity-70">Cards with multiple reviews but low mastery will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakConcepts.map((q) => (
              <div
                key={q.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-red-500/5 border-red-500/10 hover:bg-red-500/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{q.question}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <MasteryLevelBadge score={q.masteryScore || 0} reviewCount={q.reviewCount} size="sm" />
                    <span className="text-[10px] text-muted-foreground">
                      {q.reviewCount} reviews
                    </span>
                    {q.sourceResourceTitle && (
                      <span className="text-[10px] text-muted-foreground/70 truncate max-w-[120px]">
                        • {q.sourceResourceTitle}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end">
                  <span className="text-lg font-bold font-mono text-red-500">{q.masteryScore || 0}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
