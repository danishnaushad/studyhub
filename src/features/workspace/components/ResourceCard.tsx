import { Globe, PlayCircle, FileText, GitBranch, GraduationCap, Book, ExternalLink, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import type { Resource, ResourceType } from '../../../types';
import { resourcesService } from '../services/resources.service';

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onReadPdf?: (resource: Resource) => void;
}

const getIconForType = (type: ResourceType) => {
  switch (type) {
    case 'youtube': return <PlayCircle className="h-5 w-5 text-red-500" />;
    case 'pdf': return <FileText className="h-5 w-5 text-orange-500" />;
    case 'github': return <GitBranch className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />;
    case 'course': return <GraduationCap className="h-5 w-5 text-indigo-500" />;
    case 'book': return <Book className="h-5 w-5 text-amber-600" />;
    case 'website':
    default: return <Globe className="h-5 w-5 text-gray-500" />;
  }
};

export function ResourceCard({ resource, onEdit, onDelete, isMenuOpen, onToggleMenu, onReadPdf }: ResourceCardProps) {
  const handleOpenResource = () => {
    resourcesService.trackResourceOpen(resource.id).catch(console.error);
    if (resource.type === 'pdf' && onReadPdf) {
      onReadPdf(resource);
    } else {
      const targetUrl = resource.type === 'pdf' && resource.fileUrl ? resource.fileUrl : resource.url;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted/20 rounded-lg mt-0.5">
              {getIconForType(resource.type)}
            </div>
            <div>
              <button 
                onClick={handleOpenResource}
                className="font-semibold text-lg hover:underline decoration-muted-foreground flex items-center gap-2 line-clamp-1 text-left"
                title={resource.title}
              >
                {resource.title}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2 mt-1">
                {resource.type === 'pdf' && resource.fileSize && (
                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    PDF • {(resource.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
              </div>
              {resource.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {resource.description}
                </p>
              )}
              {resource.type === 'pdf' && resource.totalPages && resource.totalPages > 0 && resource.currentPage && (
                <div className="mt-3 w-full space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Page {resource.currentPage} / {resource.totalPages}</span>
                    <span>{Math.min(100, Math.max(0, Math.round((resource.currentPage / resource.totalPages) * 100)))}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-300 ease-in-out" 
                      style={{ width: `${Math.min(100, Math.max(0, Math.round((resource.currentPage / resource.totalPages) * 100)))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative ml-2">
            <button 
              onClick={onToggleMenu}
              className="p-1 text-muted-foreground hover:bg-accent rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-popover text-popover-foreground border rounded-md shadow-md py-1 z-10" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(resource)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent flex items-center gap-2 disabled:opacity-50"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(resource.id)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent text-destructive flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
