import { NavLink, Outlet } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { cn } from '../../../lib/utils';

const tabs = [
  { name: 'Dashboard', href: '/vault', end: true },
  { name: 'All Cards', href: '/vault/cards', end: false },
  { name: 'Analytics', href: '/vault/analytics', end: false },
];

export function VaultLayout() {
  return (
    <div className="space-y-0 animate-in fade-in duration-500">
      {/* Header */}
      <header className="border-b bg-card -mx-8 -mt-6 px-8 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Questions Vault</h1>
            <p className="text-sm text-muted-foreground">Track, review, and master concepts across all categories.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.href}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2.5 text-sm font-medium rounded-t-md transition-colors border-b-2',
                  isActive
                    ? 'bg-background text-primary border-primary shadow-sm'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Content */}
      <div className="pt-6">
        <Outlet />
      </div>
    </div>
  );
}
