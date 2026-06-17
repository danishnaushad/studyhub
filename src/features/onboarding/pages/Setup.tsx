import { OnboardingWizard } from '../OnboardingWizard';
import { Logo } from '../../../components/ui/Logo';

export function Setup() {
  return (
    <div className="min-h-screen bg-muted/30 p-4 pt-12">
      <div className="flex justify-center mb-8">
        <Logo className="scale-125" />
      </div>
      <OnboardingWizard />
    </div>
  );
}
