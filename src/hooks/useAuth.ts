import { useAuthStore } from '../store/authStore';
import { useDemo } from '../contexts/DemoContext';

export const useAuth = () => {
  const { user, loading } = useAuthStore();
  const { isDemo } = useDemo();

  if (isDemo) {
    return {
      user: {
        uid: 'demo-user',
        email: 'demo@studyos.com',
        displayName: 'Demo Explorer',
        onboardingComplete: true
      } as any,
      loading: false,
      isAuthenticated: true,
      isOnboardingComplete: true,
    };
  }
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    isOnboardingComplete: user?.onboardingComplete ?? false,
  };
};
