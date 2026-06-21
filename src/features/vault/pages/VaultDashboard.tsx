import { Zap, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { VaultStatsBar } from '../components/VaultStatsBar';
import { CategoryMasteryGrid } from '../components/CategoryMasteryGrid';
import { MasteryLevelBadge } from '../components/MasteryLevelBadge';
import { MOCK_QUESTIONS, MOCK_CATEGORIES, computeVaultStats } from '../utils/vaultHelpers';

export function VaultDashboard() {
  const stats = computeVaultStats(MOCK_QUESTIONS);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Hero: Global Mastery + Study Now */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Mastery Ring */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-muted/20"
                />
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-primary"
                  strokeDasharray={`${stats.avgMastery * 3.267} 326.7`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono">{stats.avgMastery}%</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Mastery</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                <h2 className="text-xl font-bold tracking-tight">Global Knowledge Mastery</h2>
                <MasteryLevelBadge score={stats.avgMastery} reviewCount={stats.total > 0 ? 1 : 0} size="md" showScore={false} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {stats.total} cards across {MOCK_CATEGORIES.length} categories •{' '}
                {stats.dueToday > 0 ? (
                  <span className="text-red-500 font-semibold">{stats.dueToday} cards due for review</span>
                ) : (
                  <span className="text-green-500 font-semibold">All caught up!</span>
                )}
              </p>
              <Button size="lg" className="text-lg tracking-wide font-bold shadow-md hover:scale-[1.02] transition-transform gap-2">
                <Zap className="h-5 w-5" />
                Study Now {stats.dueToday > 0 && `(${stats.dueToday})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <VaultStatsBar
        total={stats.total}
        dueToday={stats.dueToday}
        newCards={stats.newCards}
        learningCards={stats.learningCards}
        improvingCards={stats.improvingCards}
        strongCards={stats.strongCards}
        masteredCards={stats.masteredCards}
      />

      {/* Category Mastery Breakdown */}
      <CategoryMasteryGrid questions={MOCK_QUESTIONS} categories={MOCK_CATEGORIES} />

      {/* Future Integration Points */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="opacity-60 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              AI Study Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Personalized study recommendations and auto-generated flashcards. Coming soon.
            </p>
          </CardContent>
        </Card>
        <Card className="opacity-60 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              PDF → Flashcard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Highlight text in a PDF and instantly create a flashcard or note. Coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
