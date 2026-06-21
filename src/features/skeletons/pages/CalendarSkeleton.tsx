import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Calendar } from 'lucide-react';

export function CalendarSkeleton() {
  return (
    <SkeletonPageLayout
      title="Calendar & Planning"
      description="Schedule study blocks, track deadlines, and plan your week."
      icon={Calendar}
      status="Future"
      architectureNodes={["Event Store","Sync Engine","Notification Scheduler"]}
      features={[{"title":"Study Schedule","desc":"Time-block your day."},{"title":"Exam Countdowns","desc":"Track major milestones."},{"title":"Sync","desc":"Integrate with Google Calendar."}]}
    />
  );
}
