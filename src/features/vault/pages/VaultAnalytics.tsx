import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Activity, CalendarDays, TrendingUp, BarChart3, PlayCircle, Flame, Target } from 'lucide-react';
import { WeakConceptsList } from '../components/WeakConceptsList';
import { CategoryMasteryGrid } from '../components/CategoryMasteryGrid';
import { MASTERY_LEVELS } from '../utils/vaultHelpers';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis, Cell } from 'recharts';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useVault } from '../hooks/useVault';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function VaultAnalytics() {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  const { questions, stats, categoryStats, loading } = useVault();

  // Generate mock heatmap data for the last 12 weeks
  const heatmapWeeks: { date: string; count: number; level: number }[][] = [];
  let totalHeatmapReviews = 0;
  let bestDayReviews = 0;
  for (let w = 11; w >= 0; w--) {
    const week: { date: string; count: number; level: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (w * 7 + (6 - d)) * 86400000);
      const count = Math.random() > 0.4 ? Math.floor(Math.random() * 20) + 1 : 0;
      totalHeatmapReviews += count;
      if (count > bestDayReviews) bestDayReviews = count;
      const level = count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4;
      week.push({ date: date.toISOString().split('T')[0], count, level });
    }
    heatmapWeeks.push(week);
  }

  const heatmapColors = isDark 
    ? ['bg-muted/20', 'bg-emerald-900/60', 'bg-emerald-700/80', 'bg-emerald-500/90', 'bg-emerald-400']
    : ['bg-muted/30', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'];

  // Mock weekly trend data
  const weeklyTrend = [
    { day: 'Mon', reviews: 12 },
    { day: 'Tue', reviews: 8 },
    { day: 'Wed', reviews: 25 },
    { day: 'Thu', reviews: 6 },
    { day: 'Fri', reviews: 30 },
    { day: 'Sat', reviews: 14 },
    { day: 'Sun', reviews: 10 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <LoadingSpinner className="w-8 h-8 mb-4 text-primary" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* 1. OVERVIEW: HERO SECTION */}
      <section>
        <Card disableSurface className="border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Activity className="w-64 h-64" />
          </div>
          <CardContent className="p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
            {/* Main Score */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
              <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">Global Mastery Score</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl font-black tracking-tighter text-primary">{stats.avgMastery}%</span>
                <span className="text-sm font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +4%
                </span>
              </div>
              <p className="text-muted-foreground mt-3 max-w-xs">
                You are performing exceptionally well this week. Keep up the momentum!
              </p>
              <Button size="lg" className="mt-6 font-bold text-base px-8 h-12 shadow-md hover:-translate-y-0.5 transition-transform">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Review Session
              </Button>
            </div>

            {/* Sub Metrics */}
            <div className="grid grid-cols-2 gap-4 flex-1 w-full lg:w-auto">
              <div className="flex flex-col p-5 bg-muted/20 rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Retention</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">78%</div>
              </div>
              
              <div className="flex flex-col p-5 bg-muted/20 rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">12 <span className="text-lg font-medium text-muted-foreground">days</span></div>
              </div>

              <div className="flex flex-col p-5 bg-muted/20 rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Mastered</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">{stats.masteredCards} <span className="text-lg font-medium text-muted-foreground">/ {stats.total}</span></div>
              </div>

              <div className="flex flex-col p-5 bg-muted/20 rounded-2xl border border-border/40">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <CalendarDays className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Due Today</span>
                </div>
                <div className="text-3xl font-bold tracking-tight">{stats.dueToday} <span className="text-lg font-medium text-muted-foreground">cards</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. ACTIONABLE INSIGHTS */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight px-1">Actionable Insights</h3>
        <WeakConceptsList questions={questions} limit={4} />
      </section>

      {/* 3. ACTIVITY */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight px-1">Activity</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Review Activity Heatmap (GitHub Style) */}
          <Card disableSurface className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">Review Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 overflow-x-auto">
                  <div className="flex gap-1">
                    {heatmapWeeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-1">
                        {week.map((day, di) => (
                          <div
                            key={di}
                            className={`w-3.5 h-3.5 rounded-sm ${heatmapColors[day.level]} hover:ring-2 ring-foreground/20 transition-all cursor-default`}
                            title={`${day.date}: ${day.count} reviews`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                    <span>Less</span>
                    {heatmapColors.map((color, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col justify-around sm:justify-start gap-4 shrink-0 sm:border-l border-border/50 sm:pl-6">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Total Reviews</div>
                    <div className="text-2xl font-bold">{totalHeatmapReviews}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Best Day</div>
                    <div className="text-2xl font-bold">{bestDayReviews}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Current Streak</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Review Trend (Recharts) */}
          <Card disableSurface className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">Weekly Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Bar dataKey="reviews" radius={[4, 4, 0, 0]}>
                      {weeklyTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${entry.reviews > 15 ? '1' : '0.6'})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. DETAILED ANALYTICS */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight px-1">Detailed Analytics</h3>
        
        {/* Category Mastery */}
        <div className="mb-6">
          <CategoryMasteryGrid categoryStats={categoryStats} disableSurface={true} />
        </div>

        {/* Mastery Distribution Redesign */}
        <Card disableSurface className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Overall Mastery Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-5">
              {MASTERY_LEVELS.map((level, i) => {
                const count = level.level === 'new' ? stats.newCards
                  : level.level === 'learning' ? stats.learningCards
                  : level.level === 'improving' ? stats.improvingCards
                  : level.level === 'strong' ? stats.strongCards
                  : stats.masteredCards;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                
                // Color mappings for the redesigned bars
                const colors = [
                  'bg-gray-400 text-gray-400',
                  'bg-blue-500 text-blue-500',
                  'bg-amber-500 text-amber-500',
                  'bg-purple-500 text-purple-500',
                  'bg-emerald-500 text-emerald-500',
                ];

                return (
                  <div key={level.level} className="flex flex-col p-4 rounded-xl bg-muted/20 border border-border/40">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider">{level.label}</span>
                      <span className="text-sm font-bold">{pct}%</span>
                    </div>
                    
                    {/* Progress Track */}
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${colors[i].split(' ')[0]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    
                    <div className="text-2xl font-black">{count} <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cards</span></div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
