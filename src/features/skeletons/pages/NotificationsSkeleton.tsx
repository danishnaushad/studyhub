import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Bell } from 'lucide-react';

export function NotificationsSkeleton() {
  return (
    <SkeletonPageLayout
      title="Notifications"
      description="Smart alerts for reviews, streak warnings, and system updates."
      icon={Bell}
      status="Future"
      architectureNodes={["Push Service","Notification Center","Preferences DB"]}
      features={[{"title":"Review Reminders","desc":"Never miss a spaced repetition."},{"title":"Streak Protection","desc":"Alerts before losing your streak."},{"title":"Push Notifications","desc":"Cross-device alerts."}]}
    />
  );
}
