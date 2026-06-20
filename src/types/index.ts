export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  learningGoal?: string;
  onboardingComplete: boolean;
  hasMigratedToCloud?: boolean;
  streak?: number;
  longestStreak?: number;
  lastSessionDate?: string;
  studyStreak?: number;
  longestStudyStreak?: number;
  lastStudyDate?: string;
  storageUsed?: number;
  createdAt: number;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  targetMinutes?: number;
  isArchived?: boolean;
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

export type ResourceType = 'website' | 'youtube' | 'pdf' | 'github' | 'course' | 'book';

export interface Resource {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  type: ResourceType;
  url: string;
  
  fileUrl?: string;
  storagePath?: string;
  fileSize?: number;
  thumbnailUrl?: string;
  openCount?: number;
  lastOpenedAt?: number;
  
  description?: string;
  currentPage?: number;
  totalPages?: number;
  readingTime?: number; // accumulated reading time in seconds
  createdAt: number;
  updatedAt?: number;
}

export interface Note {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  
  // PDF Integration metadata
  sourceResourceId?: string;
  sourceResourceTitle?: string;
  sourcePageNumber?: number;
  sourceHighlightText?: string;
  
  createdAt: number;
  updatedAt: number;
}

export interface Question {
  id: string;
  userId: string;
  categoryId: string;
  question: string;
  answer: string;
  
  // PDF Integration metadata
  sourceResourceId?: string;
  sourceResourceTitle?: string;
  sourcePageNumber?: number;
  sourceHighlightText?: string;
  
  type: "fill_blank" | "multiple_choice" | "concept_review";
  status: "learning" | "review" | "mastered";
  
  reviewCount: number;
  masteryScore: number;
  
  createdAt: number;
  updatedAt: number;
  lastReviewed: number | null;
  nextReview: number | null;
  
  options?: string[];
  correctOption?: number;
  sourceNoteId?: string;
}

export type SprintType = 'course' | 'certification' | 'exam' | 'project' | 'custom';
export type SprintMetric = 'hours' | 'cards' | 'tasks';

export interface Sprint {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  sprintType: SprintType;
  metric: SprintMetric;
  targetValue: number;
  initialValue: number;
  currentValue: number;
  startDate: number;
  targetDate: number;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progressMap?: Record<string, number>;
  createdAt: number;
}
