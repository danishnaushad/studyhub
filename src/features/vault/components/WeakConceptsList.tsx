import { TrendingDown, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
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
    <Card disableSurface className="border-red-500/20 shadow-sm shadow-red-500/5">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            Weak Concepts
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Cards with multiple reviews but low retention.
          </p>
        </div>
        {weakConcepts.length > 0 && (
          <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600">
            <Zap className="h-4 w-4 mr-2" />
            Review Weak Concepts
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {weakConcepts.length === 0 ? (
          <div className="text-center py-10 bg-accent/30 rounded-xl border border-dashed border-border/50 text-muted-foreground">
            <Target className="h-10 w-10 mx-auto mb-3 opacity-30 text-green-500" />
            <p className="text-base font-medium text-foreground">You're fully caught up!</p>
            <p className="text-sm mt-1 opacity-80">No struggling concepts detected right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakConcepts.map((q) => {
              const severity = (q.masteryScore || 0) < 20 ? 'critical' : 'warning';
              return (
                <div
                  key={q.id}
                  className="group flex items-start justify-between gap-4 p-4 rounded-xl border bg-card hover:border-red-500/30 transition-all shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-2 h-2 rounded-full ${severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} title={`Severity: ${severity}`} />
                      <p className="text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">{q.question}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MasteryLevelBadge score={q.masteryScore || 0} reviewCount={q.reviewCount} size="sm" />
                      <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded-full">
                        {q.reviewCount} reviews
                      </span>
                      {q.sourceResourceTitle && (
                        <span className="text-xs text-muted-foreground/70 truncate max-w-[150px]">
                          from {q.sourceResourceTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end justify-center">
                    <span className={`text-2xl font-bold font-mono tracking-tighter ${severity === 'critical' ? 'text-red-500' : 'text-orange-500'}`}>
                      {q.masteryScore || 0}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
