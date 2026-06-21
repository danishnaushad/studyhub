import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Briefcase } from 'lucide-react';

export function ProjectVaultSkeleton() {
  return (
    <SkeletonPageLayout
      title="Project Vault"
      description="Manage capstone projects, assignments, and research papers."
      icon={Briefcase}
      status="Future"
      architectureNodes={["Task Manager","Project Graph","Timeline Engine"]}
      features={[{"title":"Kanban Boards","desc":"Track project tasks."},{"title":"Research Linking","desc":"Link vault cards to projects."},{"title":"Milestones","desc":"Set deadlines and goals."}]}
    />
  );
}
