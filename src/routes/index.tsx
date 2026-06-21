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
