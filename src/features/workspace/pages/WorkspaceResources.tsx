import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../../../hooks/useAuth';
import { useDemo } from '../../../contexts/DemoContext';
import { useResources } from '../hooks/useResources';
import { resourcesService } from '../services/resources.service';
import { ResourceCard } from '../components/ResourceCard';
import { ResourceFormDialog } from '../components/ResourceFormDialog';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Resource } from '../../../types';
import { collection, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

import { PDFWorkspaceReader } from '../components/PDFReader/PDFWorkspaceReader';

export function WorkspaceResources() {
  const { category } = useWorkspace();
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const { resources, loading } = useResources(category.id);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadTask, setUploadTask] = useState<any>(null); // any used to avoid strict type import issues
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activePdfResource, setActivePdfResource] = useState<Resource | null>(null);

  const handleOpenAdd = () => {
    setEditingResource(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      await resourcesService.deleteResource(id);
    }
    setOpenMenuId(null);
  };

  const handleCancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (data: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'categoryId'>, file?: File | null) => {
    if (!user) return;
    
    let finalData = { ...data };
    const id = editingResource ? editingResource.id : doc(collection(db, 'resources')).id;

    if (file) {
      const { uploadTask: task, storagePath } = resourcesService.uploadResourceFileResumable(file, user.uid, id);
      setUploadTask(task);
      setUploadProgress(0);
      
      try {
        console.log('[Upload] Starting upload pipeline...');
        
        task.on('state_changed', (snapshot: any) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`[Upload] Progress callback fired: ${progress}%`);
          setUploadProgress(progress);
        });

        console.log('[Upload] Awaiting task resolution...');
        await task;

        console.log('[Upload] Complete callback fired! Fetching URL...');
        const { getDownloadURL } = await import('firebase/storage');
        const fileUrl = await getDownloadURL(task.snapshot.ref);
        
        console.log('[Upload] URL fetched successfully. Committing storage usage...');
        await resourcesService.commitResourceStorageUsage(user.uid, file.size);
        
        finalData = { ...finalData, fileUrl, storagePath, fileSize: file.size };
        console.log('[Upload] Pipeline finished successfully.');
      } catch (err) {
        console.error('[Upload] Caught exception in upload block:', err);
        throw err;
      } finally {
        setUploadTask(null);
        setUploadProgress(null);
      }
    }
    
    if (editingResource) {
      await resourcesService.updateResource(id, finalData);
    } else {
      await resourcesService.createResource({
        ...finalData,
        id, 
        userId: user.uid,
        categoryId: category.id
      });
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
          <p className="text-muted-foreground mt-1">
            Learning materials and links for {category.name}.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd} 
          className="shrink-0 flex items-center gap-2"
          disabled={isDemo}
          title={isDemo ? "Disabled in Demo Mode" : undefined}
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 opacity-50" />
          </div>
          <p>No resources added yet.</p>
          <p className="text-sm mt-1">Click 'Add Resource' to save a helpful link.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              isMenuOpen={openMenuId === resource.id}
              onToggleMenu={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === resource.id ? null : resource.id);
              }}
              onReadPdf={setActivePdfResource}
            />
          ))}
        </div>
      )}

      <ResourceFormDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingResource}
        uploadProgress={uploadProgress}
        onCancelUpload={handleCancelUpload}
      />

      {activePdfResource && (
        <PDFWorkspaceReader 
          resource={activePdfResource} 
          onClose={() => setActivePdfResource(null)} 
        />
      )}
    </div>
  );
}
