import { CalendarDays } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';

export function ActivityHeatmap({ categoryId }: { categoryId?: string }) {
  const { heatmap } = useAnalytics(categoryId);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-primary'; // 120m+
      case 3: return 'bg-primary/80'; // 61-120m
      case 2: return 'bg-primary/60'; // 31-60m
      case 1: return 'bg-primary/40'; // 1-30m
      default: return 'bg-muted/30'; // 0m
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <CalendarDays className="h-4 w-4" />
          30-Day Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-2">
        <div className="flex flex-wrap gap-1 md:gap-1.5 max-w-[280px] justify-center">
          {heatmap.map((day, index) => (
            <div 
              key={index}
              className={`w-4 h-4 md:w-5 md:h-5 rounded-sm ${getLevelColor(day.level)} group relative`}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {day.date}: {day.minutes}m
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-4 text-[10px] text-muted-foreground font-medium">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-muted/30" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
