import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Activity, CalendarDays, TrendingUp, BarChart3 } from 'lucide-react';
import { WeakConceptsList } from '../components/WeakConceptsList';
import { MOCK_QUESTIONS, computeVaultStats, MASTERY_LEVELS } from '../utils/vaultHelpers';

export function VaultAnalytics() {
  const stats = computeVaultStats(MOCK_QUESTIONS);

  // Generate mock heatmap data for the last 12 weeks
  const heatmapWeeks: { date: string; count: number; level: number }[][] = [];
  for (let w = 11; w >= 0; w--) {
    const week: { date: string; count: number; level: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (w * 7 + (6 - d)) * 86400000);
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : 0;
      const level = count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4;
      week.push({ date: date.toISOString().split('T')[0], count, level });
    }
    heatmapWeeks.push(week);
  }

  const heatmapColors = [
    'bg-muted/30',
    'bg-green-500/20',
    'bg-green-500/40',
    'bg-green-500/60',
    'bg-green-500/80',
  ];

  // Mock weekly trend data
  const weeklyTrend = [
    { day: 'Mon', reviews: 12 },
    { day: 'Tue', reviews: 8 },
    { day: 'Wed', reviews: 15 },
    { day: 'Thu', reviews: 6 },
    { day: 'Fri', reviews: 20 },
    { day: 'Sat', reviews: 3 },
    { day: 'Sun', reviews: 10 },
  ];
  const maxReviews = Math.max(...weeklyTrend.map(d => d.reviews), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Retention Analytics</h2>
        <p className="text-muted-foreground mt-1">
          Track your review habits and knowledge growth.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Avg Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgMastery}%</div>
            <p className="text-xs text-muted-foreground mt-1">across {stats.total} cards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">78%</div>
            <p className="text-xs text-muted-foreground mt-1">last 30 days (mock)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-orange-500" />
              Review Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">5 days</div>
            <p className="text-xs text-muted-foreground mt-1">current streak (mock)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              Cards Mastered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.masteredCards}</div>
            <p className="text-xs text-muted-foreground mt-1">of {stats.total} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Mastery Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Mastery Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MASTERY_LEVELS.map(level => {
              const count = level.level === 'new' ? stats.newCards
                : level.level === 'learning' ? stats.learningCards
                : level.level === 'improving' ? stats.improvingCards
                : level.level === 'strong' ? stats.strongCards
                : stats.masteredCards;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

              return (
                <div key={level.level} className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wider w-20 ${level.textClass}`}>
                    {level.label}
                  </span>
                  <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${level.bgClass.replace('/10', '/60')}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-12 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Review Activity Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Review Activity (Last 12 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {heatmapWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className={`w-3 h-3 rounded-[2px] ${heatmapColors[day.level]} hover:ring-2 hover:ring-primary/30 transition-all cursor-default`}
                      title={`${day.date}: ${day.count} reviews`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              {heatmapColors.map((color, i) => (
                <div key={i} className={`w-3 h-3 rounded-[2px] ${color}`} />
              ))}
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Review Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              This Week&apos;s Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {weeklyTrend.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{day.reviews}</span>
                  <div className="w-full bg-muted/30 rounded-t relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-primary/70 rounded-t transition-all duration-500 hover:bg-primary"
                      style={{ height: `${(day.reviews / maxReviews) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak Concepts */}
        <WeakConceptsList questions={MOCK_QUESTIONS} />
      </div>
    </div>
  );
}
