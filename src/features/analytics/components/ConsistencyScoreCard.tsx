import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';

export function ConsistencyScoreCard() {
  const { consistencyScore } = useAnalytics();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-blue-500" />
          30-Day Consistency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold">{consistencyScore}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
