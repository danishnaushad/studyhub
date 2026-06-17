import { useState } from 'react';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { GoalStep } from './steps/GoalStep';
import { CategoryStep } from './steps/CategoryStep';
import { SuccessStep } from './steps/SuccessStep';

export type OnboardingData = {
  learningGoal: string;
  categories: string[];
};

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    learningGoal: '',
    categories: []
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const updateData = (partial: Partial<OnboardingData>) => setData({ ...data, ...partial });

  return (
    <div className="w-full max-w-xl mx-auto mt-12 bg-card border rounded-xl shadow-sm overflow-hidden">
      {step === 1 && <WelcomeStep onNext={nextStep} />}
      {step === 2 && <ProfileStep onNext={nextStep} onPrev={prevStep} />}
      {step === 3 && <GoalStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
      {step === 4 && <CategoryStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} />}
      {step === 5 && <SuccessStep data={data} />}
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
