import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/services/auth.service';
import { categoriesService } from '../categories/services/categories.service';
import { auth } from '../../config/firebase';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { CategoryStep } from './steps/CategoryStep';
import { GoalStep } from './steps/GoalStep';
import { SuccessStep } from './steps/SuccessStep';

export type OnboardingCategory = {
  id: string; // temporary id for UI mapping
  name: string;
  color: string;
  targetMinutes: number;
};

export type OnboardingData = {
  displayName: string;
  learningGoal: string;
  categories: OnboardingCategory[];
};

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    displayName: auth.currentUser?.displayName || '',
    learningGoal: '',
    categories: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const updateData = (partial: Partial<OnboardingData>) => setData(prev => ({ ...prev, ...partial }));

  const handleSkip = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user");
      
      // Create default General category
      await categoriesService.createCategory({
        userId: user.uid,
        name: 'General',
        color: 'gray',
        targetMinutes: 60
      });

      await authService.updateProfile(user.uid, { onboardingComplete: true });
      navigate('/');
    } catch (e) {
      console.error('Failed to skip onboarding:', e);
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user");

      // Save display name and goal
      await authService.updateProfile(user.uid, {
        displayName: data.displayName,
        learningGoal: data.learningGoal,
        onboardingComplete: true
      });

      // Save categories and keep track of real IDs
      const categoryIdMap: Record<string, string> = {};
      for (const cat of data.categories) {
        const realId = await categoriesService.createCategory({
          userId: user.uid,
          name: cat.name,
          color: cat.color,
          targetMinutes: cat.targetMinutes
        });
        categoryIdMap[cat.id] = realId;
      }

      navigate('/');
    } catch (e) {
      console.error('Failed to complete onboarding:', e);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12">
      {/* Header */}
      {step < 5 && (
        <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
          <div className="text-sm font-medium text-muted-foreground">
            Step {step} of 5
          </div>
          <button 
            onClick={() => authService.logout()} 
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted/50">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {step === 1 && <WelcomeStep onNext={nextStep} onSkip={handleSkip} />}
        {step === 2 && <ProfileStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} onSkip={handleSkip} />}
        {step === 3 && <GoalStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} onSkip={handleSkip} />}
        {step === 4 && <CategoryStep data={data} updateData={updateData} onNext={nextStep} onPrev={prevStep} onSkip={handleSkip} />}
        {step === 5 && <SuccessStep onComplete={handleComplete} loading={loading} />}
      </div>
    </div>
  );
}
