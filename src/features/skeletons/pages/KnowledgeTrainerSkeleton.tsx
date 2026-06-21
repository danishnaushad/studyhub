import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Brain } from 'lucide-react';

export function KnowledgeTrainerSkeleton() {
  return (
    <SkeletonPageLayout
      title="Knowledge Trainer"
      description="Advanced spaced repetition and active recall engine for deep mastery."
      icon={Brain}
      status="Architecture Approved"
      architectureNodes={["Review Queue","SM-2 Algorithm","Mastery Tracker"]}
      features={[{"title":"Spaced Repetition","desc":"Algorithm-driven review scheduling."},{"title":"Flashcard Engine","desc":"Rich media flashcards."},{"title":"Retention Analytics","desc":"Detailed forgetting curve analysis."}]}
    />
  );
}
