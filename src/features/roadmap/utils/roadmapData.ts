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
  {
    id: 'auth',
    name: 'Authentication',
    progress: 100,
    status: 'Frozen',
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    progress: 100,
    status: 'Frozen',
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    progress: 95,
    status: 'Stable',
  },
  {
    id: 'categories',
    name: 'Categories',
    progress: 95,
    status: 'Stable',
  },
  {
    id: 'sprints',
    name: 'Sprint Zone',
    progress: 90,
    status: 'Stable',
  },
  {
    id: 'focus',
    name: 'Focus Engine',
    progress: 85,
    status: 'Stable',
  },
  {
    id: 'vault',
    name: 'Questions Vault',
    progress: 80,
    status: 'In Progress',
    submodules: [
      'UI Skeleton',
      'Database Integration',
      'Review Engine',
      'Analytics',
      'AI Integration'
    ]
  },
  {
    id: 'learning',
    name: 'Learning Hub',
    progress: 20,
    status: 'Planning',
    submodules: [
      'Resources',
      'Notes',
      'Projects',
      'PDF Library'
    ]
  },
  {
    id: 'knowledge',
    name: 'Knowledge Trainer',
    progress: 15,
    status: 'Architecture Approved',
    submodules: [
      'Dashboard',
      'Flashcards',
      'Review Queue',
      'Retention Analytics',
      'Mastery Tracking'
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics 2.0',
    progress: 10,
    status: 'Planning',
    submodules: [
      'Heatmaps',
      'Growth Charts',
      'Retention Analytics',
      'Category Analytics'
    ]
  },
  {
    id: 'ai-tools',
    name: 'AI Study Tools',
    progress: 0,
    status: 'Future',
    submodules: [
      'AI Flashcards',
      'AI Questions',
      'AI Notes Summary',
      'AI Study Coach'
    ]
  },
  {
    id: 'pdf-system',
    name: 'PDF System',
    progress: 0,
    status: 'Future',
    submodules: [
      'PDF Reader',
      'Highlights',
      'Annotations',
      'Flashcard Generation'
    ]
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
  completed: [
    'UI Skeleton'
  ],
  pending: [
    'Firestore Integration',
    'Review Engine',
    'Analytics Engine'
  ]
};

export const PRODUCT_HEALTH = {
  modulesCompleted: 6,
  featuresCompleted: 24,
  featuresPlanned: 45,
  technicalDebtItems: 3
};
