import { SkeletonPageLayout } from '../components/SkeletonPageLayout';
import { Sparkles } from 'lucide-react';

export function AIToolsSkeleton() {
  return (
    <SkeletonPageLayout
      title="AI Study Tools"
      description="Leverage LLMs for automatic question generation, summaries, and coaching."
      icon={Sparkles}
      status="Future"
      architectureNodes={["LLM Gateway","Vector Database","Prompt Engine"]}
      features={[{"title":"AI Flashcards","desc":"Auto-generate cards from text."},{"title":"Study Coach","desc":"Personalized AI tutor."},{"title":"Notes Summary","desc":"Synthesize long documents instantly."}]}
    />
  );
}
