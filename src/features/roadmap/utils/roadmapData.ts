export type ModuleStatus = 'Not Started' | 'Planning' | 'Architecture Approved' | 'UI Built' | 'Backend Built' | 'UAT' | 'Stable' | 'Frozen' | 'In Progress' | 'Future';

export interface RoadmapModule {
  id: string;
  name: string;
  description?: string;
  progress: number;
  status: ModuleStatus;
  submodules?: string[];
}

export const ROADMAP_MODULES: RoadmapModule[] = [
  { id: 'auth', name: 'Authentication', progress: 100, status: 'Frozen' },
  { id: 'onboarding', name: 'Onboarding', progress: 100, status: 'Frozen' },
  { id: 'dashboard', name: 'Dashboard', progress: 95, status: 'Stable' },
  { id: 'categories', name: 'Categories', progress: 95, status: 'Stable' },
  { id: 'sprints', name: 'Sprint Zone', progress: 90, status: 'Stable' },
  { id: 'focus', name: 'Focus Engine', progress: 85, status: 'Stable' },
  {
    id: 'vault',
    name: 'Questions Vault',
    progress: 80,
    status: 'In Progress',
    submodules: ['UI Skeleton', 'Database Integration', 'Review Engine', 'Analytics', 'AI Integration']
  },
  {
    id: 'learning',
    name: 'Learning Hub',
    progress: 20,
    status: 'Planning',
    submodules: ['Resources', 'Notes', 'Projects', 'PDF Library']
  },
  {
    id: 'knowledge',
    name: 'Knowledge Trainer',
    progress: 15,
    status: 'Architecture Approved',
    submodules: ['Dashboard', 'Flashcards', 'Review Queue', 'Retention Analytics', 'Mastery Tracking']
  },
  {
    id: 'analytics',
    name: 'Analytics 2.0',
    progress: 10,
    status: 'Planning',
    submodules: ['Heatmaps', 'Growth Charts', 'Retention Analytics', 'Category Analytics']
  },
  {
    id: 'ai-tools',
    name: 'AI Study Tools',
    progress: 0,
    status: 'Future',
    submodules: ['AI Flashcards', 'AI Questions', 'AI Notes Summary', 'AI Study Coach']
  },
  {
    id: 'pdf-system',
    name: 'PDF System',
    progress: 0,
    status: 'Future',
    submodules: ['PDF Reader', 'Highlights', 'Annotations', 'Flashcard Generation']
  },
  { id: 'projects', name: 'Project Vault', progress: 0, status: 'Future' },
  { id: 'calendar', name: 'Calendar & Planning', progress: 0, status: 'Future' },
  { id: 'notifications', name: 'Notifications', progress: 0, status: 'Future' },
  { id: 'subscriptions', name: 'Subscription System', progress: 0, status: 'Future' },
  { id: 'admin', name: 'Admin Panel', progress: 0, status: 'Future' },
  { id: 'sync', name: 'Cloud Sync', progress: 0, status: 'Future' }
];

export const CURRENT_FOCUS = {
  module: 'Questions Vault',
  phase: 'Phase 5B',
  description: 'Database & State Management',
  status: 'In Progress',
  completed: ['UI Skeleton'],
  pending: ['Firestore Integration', 'Review Engine', 'Analytics Engine']
};

export const PRODUCT_HEALTH = {
  modulesCompleted: 6,
  featuresCompleted: 24,
  featuresPlanned: 45,
  technicalDebtItems: 3
};

// Ecosystem Data
export const ECOSYSTEMS = [
  {
    title: 'AI Ecosystem',
    icon: 'Sparkles',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    items: ['AI Flashcards', 'AI Questions', 'AI Notes', 'AI PDF Assistant', 'AI Study Coach', 'AI Insights']
  },
  {
    title: 'PDF Ecosystem',
    icon: 'FileText',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    items: ['PDF Library', 'PDF Reader', 'Highlights', 'Annotations', 'Bookmarks', 'PDF to Questions', 'PDF to Flashcards']
  },
  {
    title: 'Analytics Ecosystem',
    icon: 'BarChart3',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    items: ['Focus Analytics', 'Sprint Analytics', 'Category Analytics', 'Retention Analytics', 'Knowledge Analytics']
  },
  {
    title: 'Productivity Ecosystem',
    icon: 'Target',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    items: ['Daily Mission', 'Calendar', 'Task Planning', 'Study Schedule', 'Goal Tracking']
  },
  {
    title: 'User Growth System',
    icon: 'Trophy',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    items: ['XP', 'Levels', 'Achievements', 'Badges', 'Streaks']
  },
  {
    title: 'Future Vision Layer',
    icon: 'Globe',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    items: ['Study Groups', 'Shared Notes', 'Team Workspaces', 'Mentor Dashboard', 'Leaderboards']
  }
];

export const LEARNING_PIPELINE = [
  { step: 1, title: 'Resource', icon: 'BookOpen', desc: 'Ingest PDFs, Links, Text' },
  { step: 2, title: 'Notes', icon: 'Edit3', desc: 'Synthesize & Summarize' },
  { step: 3, title: 'Questions', icon: 'HelpCircle', desc: 'Active Recall Testing' },
  { step: 4, title: 'Knowledge Trainer', icon: 'Brain', desc: 'Spaced Repetition' },
  { step: 5, title: 'Mastery', icon: 'Award', desc: 'Deep Understanding' }
];

export const ARCHITECTURE_NODES = {
  core: ['Authentication', 'User Profile', 'Cloud Sync'],
  hubs: ['Mission Control', 'Sprint Zone', 'Focus Engine'],
  learning: ['Categories', 'Learning Hub', 'Notes', 'Resources'],
  retention: ['Questions Vault', 'Knowledge Trainer', 'Analytics 2.0']
};
