import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Focus, 
  Layers, 
  HelpCircle, 
  BarChart3, 
  Settings,
  LogOut,
  Target,
  Map,
  Brain,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { authService } from '../../features/auth/services/auth.service';

const navigation = [
  { name: 'Mission Control', href: '/', icon: LayoutDashboard },
  { name: 'Sprint Zone', href: '/sprints', icon: Target },
  { name: 'Categories', href: '/categories', icon: Layers },
  { name: 'Questions Vault', href: '/vault', icon: HelpCircle },
  { name: 'Focus Sessions', href: '/focus', icon: Focus },
  { name: 'Knowledge Trainer', href: '/trainer', icon: Brain },
  { name: 'Learning Hub', href: '/learning', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Study OS Roadmap', href: '/roadmap', icon: Map },
  { name: 'Study OS Ecosystem', href: '/ecosystem', icon: Sparkles },
];

export const Sidebar: React.FC = () => {
  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <span className="text-xl font-bold tracking-tight">StudyHub</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 gap-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                )
              }
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="space-y-1 pt-6 border-t">
          <NavLink
            to="/settings"
            className={cn(
              'text-muted-foreground hover:bg-accent hover:text-accent-foreground group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
            )}
          >
            <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
