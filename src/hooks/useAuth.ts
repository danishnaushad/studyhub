import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, loading } = useAuthStore();

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isOnboardingComplete: user?.onboardingComplete ?? false,
  };
};
