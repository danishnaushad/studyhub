import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { BarChart3 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useCategories } from '../../../hooks/useCategories';
import { getCategoryColor } from '../../../lib/colors';


export function WeeklyTrendChart({ categoryId }: { categoryId?: string }) {
  const { weeklyTrend } = useAnalytics(categoryId);
  const { categories } = useCategories();
  const maxMinutes = Math.max(...weeklyTrend.map(d => d.minutes), 1); // prevent division by zero
  
  const activeCategory = categoryId ? categories.find(c => c.id === categoryId) : null;
  const barColor = activeCategory ? getCategoryColor(activeCategory.color) : undefined;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <BarChart3 className="h-4 w-4" />
          7-Day Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-end justify-between pt-4 gap-2">
        {weeklyTrend.map((data, index) => {
          const heightPercentage = (data.minutes / maxMinutes) * 100;
          return (
            <div key={index} className="flex flex-col items-center gap-2 w-full group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {data.minutes}m
              </div>
              
              {/* Bar */}
              <div className="w-full bg-muted/50 rounded-sm h-32 md:h-48 relative flex items-end justify-center overflow-hidden">
                <div 
                  className="w-full transition-all duration-300 rounded-sm opacity-80 group-hover:opacity-100"
                  style={{ 
                    height: `${heightPercentage}%`,
                    backgroundColor: barColor || 'hsl(var(--primary))'
                  }}
                />
              </div>
              
              {/* Label */}
              <span className="text-xs text-muted-foreground font-medium">
                {data.day}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
