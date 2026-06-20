import { PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useAnalytics } from '../hooks/useAnalytics';
import { getCategoryColor } from '../../../lib/colors';


export function CategoryDistributionChart() {
  const { categoryDistribution } = useAnalytics();

  const gradientStopsArr: string[] = [];
  categoryDistribution.reduce((acc, cat) => {
    const start = acc;
    const end = acc + cat.percentage;
    gradientStopsArr.push(`${getCategoryColor(cat.color)} ${start}% ${end}%`);
    return end;
  }, 0);
  const gradientStops = gradientStopsArr.join(', ');

  const hasData = categoryDistribution.some(cat => cat.percentage > 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <PieChart className="h-4 w-4" />
          Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
        {hasData ? (
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
            {/* Pure CSS Pie Chart */}
            <div 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-inner shrink-0"
              style={{
                background: `conic-gradient(${gradientStops})`
              }}
            />
            
            {/* Legend */}
            <div className="flex flex-col gap-2 w-full max-w-[200px]">
              {categoryDistribution.filter(c => c.percentage > 0).map(cat => (
                <div key={cat.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getCategoryColor(cat.color) }} />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="font-bold ml-2">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic h-32 flex items-center justify-center">
            No data recorded yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
