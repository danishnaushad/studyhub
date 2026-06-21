import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { BookOpen } from 'lucide-react';

export function LearningHubSkeleton() {
  return (
    <SkeletonPageLayout
      title="Learning Hub"
      description="Central repository for all educational resources, documents, and videos."
      icon={BookOpen}
      status="Planning"
      architectureNodes={["Resource Collections","Notes System","File Storage","Graph Database"]}
      features={[{"title":"Resource Ingestion","desc":"Import PDFs, links, and text easily."},{"title":"Rich Notes Editor","desc":"Synthesize information alongside resources."},{"title":"Project Organization","desc":"Group resources by projects or domains."}]}
    />
  );
}
