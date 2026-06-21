import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Shield } from 'lucide-react';

export function AdminSkeleton() {
  return (
    <SkeletonPageLayout
      title="Admin Panel"
      description="Superuser dashboard for system health, user management, and configuration."
      icon={Shield}
      status="Future"
      architectureNodes={["RBAC System","Admin Gateway","Audit Logs"]}
      features={[{"title":"User Management","desc":"View and manage accounts."},{"title":"System Health","desc":"Monitor server metrics."},{"title":"Feature Flags","desc":"Toggle beta features."}]}
    />
  );
}
