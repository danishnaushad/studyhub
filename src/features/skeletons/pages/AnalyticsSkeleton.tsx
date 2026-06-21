import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { BarChart3 } from 'lucide-react';

export function AnalyticsSkeleton() {
  return (
    <SkeletonPageLayout
      title="Analytics 2.0"
      description="Comprehensive insights into study habits, retention, and productivity."
      icon={BarChart3}
      status="Planning"
      architectureNodes={["Data Aggregation Service","Chart Library","Export Engine"]}
      features={[{"title":"Heatmaps","desc":"GitHub-style activity heatmaps."},{"title":"Growth Charts","desc":"Track XP and level progression."},{"title":"Category Analytics","desc":"Deep dive into specific domains."}]}
    />
  );
}
