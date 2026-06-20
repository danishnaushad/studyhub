import { Clock, CheckCircle2, TrendingUp, Target, Crown, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';
import { getCategoryColor } from '../../../lib/colors';


export function AnalyticsSummaryCards({ categoryId }: { categoryId?: string }) {
  const { focusMinutesToday, sessionsToday, weeklyFocusMinutes, mostActiveCategory, targetCompletionPercentage, consistencyScore } = useAnalytics(categoryId);

  const formatHours = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Focus Time Today */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatHours(focusMinutesToday)}</div>
        </CardContent>
      </Card>

      {/* Sessions Today */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            Sessions Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessionsToday}</div>
        </CardContent>
      </Card>

      {/* Target Completion */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-orange-500" />
            Daily Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold">{targetCompletionPercentage}%</div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Focus Time */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
            7-Day Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatHours(weeklyFocusMinutes)}</div>
        </CardContent>
      </Card>

      {/* Most Active Category */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Crown className="h-3.5 w-3.5 text-yellow-500" />
            Top Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {mostActiveCategory ? (
              <>
                <span className="text-lg font-bold truncate" style={{ color: getCategoryColor(mostActiveCategory.color) }}>
                  {mostActiveCategory.name}
                </span>
                <span className="text-sm font-medium text-muted-foreground mt-0.5">
                  {formatHours((mostActiveCategory as any).minutes)}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground text-sm font-normal">None yet</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Consistency Score */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-pink-500" />
            30-Day Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-bold">{consistencyScore}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
