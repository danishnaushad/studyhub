import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Category } from '../../../types';

interface WorkspaceContextType {
  category: Category;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ category, children }: { category: Category; children: ReactNode }) {
  return (
    <WorkspaceContext.Provider value={{ category }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
