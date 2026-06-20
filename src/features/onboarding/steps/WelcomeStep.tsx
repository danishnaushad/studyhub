import { Button } from '../../../components/ui/Button';

export function WelcomeStep({ onNext, onSkip }: { onNext: () => void, onSkip: () => void }) {
  return (
    <div className="p-6 sm:p-10 text-center flex flex-col min-h-[300px]">
      <div className="space-y-3 mt-8">
        <h2 className="text-3xl font-semibold tracking-tight">Welcome to Danish Study OS</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Your universal learning environment. Let's configure your workspace for maximum focus and productivity.
        </p>
      </div>
      
      <div className="mt-12 space-y-4">
        <Button size="lg" onClick={onNext} className="w-full sm:w-auto px-8">
          Let's Setup My Workspace
        </Button>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={onSkip} 
          className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          Skip & Go To Dashboard
        </button>
      </div>
    </div>
  );
}
