import { CheckCircle2, LayoutDashboard, Target, Flag, BarChart2, BrainCircuit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function SuccessStep({ 
  onComplete, 
  loading 
}: { 
  onComplete: () => void, 
  loading: boolean 
}) {
  return (
    <div className="p-6 sm:p-10 text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">Workspace Ready</h2>
        <p className="text-muted-foreground text-lg max-w-sm mx-auto">
          Your personalized environment has been configured.
        </p>
      </div>

      <div className="text-left bg-muted/30 p-6 rounded-lg border w-full max-w-sm space-y-4 mb-8">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Dashboard Includes</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Focus Engine</span>
          </li>
          <li className="flex items-center gap-3">
            <Target className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium">Category Tracking</span>
          </li>
          <li className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">Sprint Progress</span>
          </li>
          <li className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-info" />
            <span className="text-sm font-medium">Analytics</span>
          </li>
          <li className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Knowledge Trainer</span>
          </li>
        </ul>
      </div>

      <div className="w-full max-w-sm">
        <Button size="lg" onClick={onComplete} disabled={loading} className="w-full">
          {loading ? <LoadingSpinner className="mr-2" /> : null}
          Go To Dashboard
        </Button>
      </div>
    </div>
  );
}
