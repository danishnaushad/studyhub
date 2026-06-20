import { TrendingUp, Clock, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useFocusStore } from '../../../store/focusStore';
import { useCategories } from '../../../hooks/useCategories';

export function QuickStatsCard() {
  const { focusMinutesToday, streak, dailyTargets } = useFocusStore();
  const { categories } = useCategories();

  const formatHours = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const totalTargetMinutes = categories.reduce((acc, cat) => {
    // Completely relies on initialized daily target
    return acc + (dailyTargets[cat.id] || 0);
  }, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="h-4 w-4" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg col-span-2 sm:col-span-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> Focus Time
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{formatHours(focusMinutesToday)}</span>
              {totalTargetMinutes > 0 && (
                <span className="text-xs text-muted-foreground font-medium">/ {formatHours(totalTargetMinutes)}</span>
              )}
            </div>
            {totalTargetMinutes > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Remaining: {formatHours(Math.max(0, totalTargetMinutes - focusMinutesToday))}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" /> Day Streak
            </span>
            <span className="text-2xl font-bold">{streak}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
