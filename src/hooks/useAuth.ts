import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../types';

const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

const MOCK_USER: UserProfile = {
  uid: 'dev-user',
  displayName: 'Development User',
  email: 'dev@studyos.local',
  photoURL: null,
  onboardingComplete: true,
  createdAt: Date.now(),
};

export const useAuth = () => {
  const { user, loading } = useAuthStore();

  if (DEV_BYPASS_AUTH) {
    return {
      user: MOCK_USER,
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
