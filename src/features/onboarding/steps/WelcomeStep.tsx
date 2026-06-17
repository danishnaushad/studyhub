import { Button } from '../../../components/ui/Button';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-8 text-center space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome to Danish Study OS</h2>
      <p className="text-muted-foreground text-lg max-w-sm mx-auto">
        Your Universal Learning Operating System. Let's set up your workspace for maximum focus and productivity.
      </p>
      <Button size="lg" onClick={onNext} className="mt-4">
        Get Started
      </Button>
    </div>
  );
}
