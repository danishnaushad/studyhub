import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { FileText } from 'lucide-react';

export function PDFSystemSkeleton() {
  return (
    <SkeletonPageLayout
      title="PDF System"
      description="Advanced PDF reader with highlights, annotations, and instant flashcard creation."
      icon={FileText}
      status="Future"
      architectureNodes={["PDF.js Engine","Annotation Store","Cloud Storage"]}
      features={[{"title":"PDF Reader","desc":"Built-in premium viewer."},{"title":"Highlights & Annotations","desc":"Markup documents directly."},{"title":"PDF to Questions","desc":"Convert highlights to flashcards."}]}
    />
  );
}
