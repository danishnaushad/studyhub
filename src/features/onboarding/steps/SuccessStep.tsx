import { useState } from 'react';
import type { OnboardingData } from '../OnboardingWizard';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import type {  } from '../OnboardingWizard';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../auth/services/auth.service';
import { db } from '../../../config/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function SuccessStep({ data }: { data: OnboardingData }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Create categories
      const batchPromises = data.categories.map(async (catName: string) => {
        const catRef = doc(collection(db, 'categories'));
        await setDoc(catRef, {
          id: catRef.id,
          userId: user.uid,
          name: catName,
          color: '#3b82f6', // Default blue
          createdAt: Date.now()
        });
      });
      await Promise.all(batchPromises);

      // Update user profile
      await authService.updateProfile(user.uid, { 
        learningGoal: data.learningGoal,
        onboardingComplete: true 
      });

      // Navigate to dashboard
      // The auth listener will pick up the change and navigate normally, 
      // but we force navigate to trigger router update
      navigate('/');
    } catch (err) {
      console.error('Failed to finish setup', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold tracking-tight">You're All Set!</h2>
      <p className="text-muted-foreground text-lg max-w-sm mx-auto">
        Your workspace is ready. Let's start achieving your goals with Danish Study OS.
      </p>
      <Button size="lg" onClick={handleFinish} className="mt-4" disabled={loading}>
        {loading ? <LoadingSpinner className="mr-2" /> : null}
        Enter Mission Control
      </Button>
    </div>
  );
}
