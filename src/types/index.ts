export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  learningGoal?: string;
  onboardingComplete: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: number;
}

export interface Task {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: number;
}

export interface Resource {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  type: 'link' | 'pdf' | 'youtube';
  url: string;
  createdAt: number;
}
