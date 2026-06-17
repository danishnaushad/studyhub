import { TrendingUp, Clock, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export function QuickStatsCard() {
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
          <div className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> Focus Time
            </span>
            <span className="text-2xl font-bold">0h</span>
          </div>
          <div className="flex flex-col space-y-1 p-3 bg-accent/50 rounded-lg">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" /> Day Streak
            </span>
            <span className="text-2xl font-bold">1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
