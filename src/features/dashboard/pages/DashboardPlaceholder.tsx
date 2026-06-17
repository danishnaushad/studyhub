import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../auth/services/auth.service';
import { Button } from '../../../components/ui/Button';

export function DashboardPlaceholder() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center pb-6 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Hello, {user?.displayName}</span>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </header>
        
        <main className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-xl bg-card">
            <h2 className="text-xl font-semibold mb-2">Phase 0 Complete</h2>
            <p className="text-muted-foreground">
              Firebase Foundation, Authentication, User Profiles, and Onboarding Flow have been successfully implemented.
            </p>
          </div>
          <div className="p-6 border rounded-xl bg-card border-dashed">
            <h2 className="text-xl font-semibold mb-2 text-muted-foreground">Future Phases Go Here</h2>
            <p className="text-muted-foreground text-sm">
              Dashboard UI, Learning Hub, Focus System, Analytics, and Projects will be built in upcoming phases.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
