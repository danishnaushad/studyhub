import type { OnboardingData } from '../OnboardingWizard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import type {  } from '../OnboardingWizard';

export function GoalStep({ 
  data, updateData, onNext, onPrev 
}: { 
  data: OnboardingData, updateData: (d: Partial<OnboardingData>) => void, onNext: () => void, onPrev: () => void 
}) {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Primary Goal</h2>
        <p className="text-muted-foreground">What is your main objective right now? (e.g. Pass BPSC, Learn React)</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal">Learning Goal</Label>
          <Input 
            id="goal" 
            value={data.learningGoal} 
            onChange={e => updateData({ learningGoal: e.target.value })} 
            placeholder="My ultimate goal is..."
            autoFocus
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext} disabled={!data.learningGoal.trim()}>Continue</Button>
      </div>
    </div>
  );
}
