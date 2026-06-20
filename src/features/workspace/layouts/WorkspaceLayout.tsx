import { useEffect } from 'react';
import { Outlet, useParams, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, LayoutDashboard, FileText, HelpCircle, Briefcase, BarChart2 } from 'lucide-react';
import { WorkspaceProvider } from '../contexts/WorkspaceContext';
import { useCategories } from '../../../hooks/useCategories';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { getCategoryColor } from '../../../lib/colors';


export function WorkspaceLayout() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, loading } = useCategories();
  
  const category = categories.find(c => c.id === categoryId);

  // Auto-redirect to overview if just visiting /category/:id
  useEffect(() => {
    if (categoryId && location.pathname === `/category/${categoryId}`) {
      navigate(`/category/${categoryId}/overview`, { replace: true });
    }
  }, [categoryId, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Workspace not found</h2>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', path: 'overview', icon: LayoutDashboard },
    { name: 'Resources', path: 'resources', icon: BookOpen },
    { name: 'Notes', path: 'notes', icon: FileText },
    { name: 'Questions', path: 'questions', icon: HelpCircle },
    { name: 'Projects', path: 'projects', icon: Briefcase },
    { name: 'Analytics', path: 'analytics', icon: BarChart2 },
  ];

  return (
    <WorkspaceProvider category={category}>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: getCategoryColor(category.color) }} 
                />
                <h1 className="text-2xl font-bold tracking-tight">{category.name} Workspace</h1>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <nav className="flex space-x-1 overflow-x-auto no-scrollbar">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive 
                      ? 'bg-background text-primary border-t border-x border-border shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background/50">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </WorkspaceProvider>
  );
}
