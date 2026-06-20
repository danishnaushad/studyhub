import { useWorkspace } from '../contexts/WorkspaceContext';
import { AnalyticsSummaryCards } from '../../analytics/components/AnalyticsSummaryCards';
import { WeeklyTrendChart } from '../../analytics/components/WeeklyTrendChart';
import { ActivityHeatmap } from '../../analytics/components/ActivityHeatmap';

export function WorkspaceAnalytics() {
  const { category } = useWorkspace();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-1">
            Performance metrics for {category.name}.
          </p>
        </div>
      </div>

      <AnalyticsSummaryCards categoryId={category.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="md:col-span-2 lg:col-span-2">
          <WeeklyTrendChart categoryId={category.id} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ActivityHeatmap categoryId={category.id} />
        </div>
      </div>
    </div>
  );
}
