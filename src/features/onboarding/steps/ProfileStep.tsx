import type { OnboardingData } from '../OnboardingWizard';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';

export function ProfileStep({ 
  data, updateData, onNext, onPrev, onSkip
}: { 
  data: OnboardingData, updateData: (d: Partial<OnboardingData>) => void, onNext: () => void, onPrev: () => void, onSkip: () => void
}) {

  return (
    <div className="p-6 sm:p-10 space-y-8 flex-1">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Your Profile</h2>
        <p className="text-muted-foreground">How should we call you in your workspace?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            value={data.displayName} 
            onChange={e => updateData({ displayName: e.target.value })} 
            placeholder="John Doe"
            autoFocus
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-6 mt-auto">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onPrev}>Back</Button>
          <Button onClick={onNext} disabled={!data.displayName.trim()}>Continue</Button>
        </div>
        <button onClick={onSkip} className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline">Skip & Go To Dashboard</button>
      </div>
    </div>
  );
}
