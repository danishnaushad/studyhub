import { useWorkspace } from '../contexts/WorkspaceContext';

export function WorkspaceProjects() {
  const { category } = useWorkspace();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground mt-1">
            Manage long-term goals and projects for {category.name}.
          </p>
        </div>
      </div>
      <div className="text-center py-12 text-muted-foreground italic border rounded-lg border-dashed">
        Projects integration coming in Phase 7...
      </div>
    </div>
  );
}
