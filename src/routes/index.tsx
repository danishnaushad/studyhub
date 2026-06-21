import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import { Setup } from '../features/onboarding/pages/Setup';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { WorkspaceLayout } from '../features/workspace/layouts/WorkspaceLayout';
import { WorkspaceOverview } from '../features/workspace/pages/WorkspaceOverview';
import { WorkspaceResources } from '../features/workspace/pages/WorkspaceResources';
import { WorkspaceNotes } from '../features/workspace/pages/WorkspaceNotes';
import { WorkspaceQuestions } from '../features/workspace/pages/WorkspaceQuestions';
import { WorkspaceProjects } from '../features/workspace/pages/WorkspaceProjects';
import { WorkspaceAnalytics } from '../features/workspace/pages/WorkspaceAnalytics';
import { CategoriesManagement } from '../features/categories/pages/CategoriesManagement';
import { SprintDashboard } from '../features/sprints/pages/SprintDashboard';
import { VaultLayout } from '../features/vault/layouts/VaultLayout';
import { VaultDashboard } from '../features/vault/pages/VaultDashboard';
import { VaultCards } from '../features/vault/pages/VaultCards';
import { VaultAnalytics } from '../features/vault/pages/VaultAnalytics';
import { RoadmapDashboard } from '../features/roadmap/pages/RoadmapDashboard';
import { EcosystemDashboard } from '../features/skeletons/pages/EcosystemDashboard';
import { LearningHubSkeleton } from '../features/skeletons/pages/LearningHubSkeleton';
import { KnowledgeTrainerSkeleton } from '../features/skeletons/pages/KnowledgeTrainerSkeleton';
import { AnalyticsSkeleton } from '../features/skeletons/pages/AnalyticsSkeleton';
import { AIToolsSkeleton } from '../features/skeletons/pages/AIToolsSkeleton';
import { PDFSystemSkeleton } from '../features/skeletons/pages/PDFSystemSkeleton';
import { ProjectVaultSkeleton } from '../features/skeletons/pages/ProjectVaultSkeleton';
import { CalendarSkeleton } from '../features/skeletons/pages/CalendarSkeleton';
import { NotificationsSkeleton } from '../features/skeletons/pages/NotificationsSkeleton';
import { SubscriptionSkeleton } from '../features/skeletons/pages/SubscriptionSkeleton';
import { AdminSkeleton } from '../features/skeletons/pages/AdminSkeleton';
import { CloudSyncSkeleton } from '../features/skeletons/pages/CloudSyncSkeleton';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>



      {/* Onboarding - Protected but requires incomplete onboarding */}
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute requireOnboarding={false}>
            <Setup />
          </ProtectedRoute>
        } 
      />

      {/* Main App - Protected and requires completed onboarding */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Category Management */}
      <Route 
        path="/categories" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CategoriesManagement />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Sprint Zone */}
      <Route 
        path="/sprints" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SprintDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* Questions Vault */}
      <Route
        path="/vault"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VaultLayout />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<VaultDashboard />} />
        <Route path="cards" element={<VaultCards />} />
        <Route path="analytics" element={<VaultAnalytics />} />
      </Route>

      {/* Roadmap & Ecosystem */}
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoadmapDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ecosystem"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EcosystemDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Skeletons */}
      <Route path="/learning" element={<ProtectedRoute><DashboardLayout><LearningHubSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/trainer" element={<ProtectedRoute><DashboardLayout><KnowledgeTrainerSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><AnalyticsSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><DashboardLayout><AIToolsSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/pdf" element={<ProtectedRoute><DashboardLayout><PDFSystemSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><DashboardLayout><ProjectVaultSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><DashboardLayout><CalendarSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><DashboardLayout><SubscriptionSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><DashboardLayout><AdminSkeleton /></DashboardLayout></ProtectedRoute>} />
      <Route path="/sync" element={<ProtectedRoute><DashboardLayout><CloudSyncSkeleton /></DashboardLayout></ProtectedRoute>} />
      
      {/* Focus & Settings (Basic fallbacks to prevent 404 since they were enabled in sidebar) */}
      <Route path="/focus" element={<ProtectedRoute><DashboardLayout><div className="p-8">Focus Session UI is floating via TimerEngine. Check bottom right!</div></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout><div className="p-8 text-center text-muted-foreground">Settings Page Coming Soon</div></DashboardLayout></ProtectedRoute>} />


      {/* Category Workspace */}
      <Route 
        path="/category/:categoryId" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <WorkspaceLayout />
            </DashboardLayout>
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<WorkspaceOverview />} />
        <Route path="resources" element={<WorkspaceResources />} />
        <Route path="notes" element={<WorkspaceNotes />} />
        <Route path="questions" element={<WorkspaceQuestions />} />
        <Route path="projects" element={<WorkspaceProjects />} />
        <Route path="analytics" element={<WorkspaceAnalytics />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
