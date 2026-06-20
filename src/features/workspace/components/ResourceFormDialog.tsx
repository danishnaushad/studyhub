import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Resource, ResourceType } from '../../../types';
import { PDFUploader } from './PDFUploader';

interface ResourceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Resource, 'id' | 'createdAt' | 'userId' | 'categoryId'>, file?: File | null) => Promise<void>;
  initialData?: Resource;
  uploadProgress?: number | null;
  onCancelUpload?: () => void;
}

export function ResourceFormDialog({ isOpen, onClose, onSubmit, initialData, uploadProgress, onCancelUpload }: ResourceFormDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('website');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setUrl(initialData.url);
        setType(initialData.type);
        setDescription(initialData.description || '');
      } else {
        setTitle('');
        setUrl('');
        setType('website');
        setDescription('');
      }
      setSelectedFile(null);
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (type !== 'pdf' && !url.trim()) {
      setError('URL is required for non-PDF resources.');
      return;
    }

    if (type === 'pdf' && !initialData?.fileUrl && !selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ 
        title: title.trim(), 
        url: type === 'pdf' ? (initialData?.url || '') : url.trim(), 
        type, 
        description: description.trim() 
      }, selectedFile);
      onClose();
    } catch (err: any) {
      if (err.code === 'storage/canceled') {
        setError('Upload canceled.');
      } else {
        setError(err.message || 'Failed to save resource');
      }
    } finally {
      setLoading(false);
    }
  };

  const isUploading = uploadProgress !== undefined && uploadProgress !== null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">{initialData ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors" disabled={loading && !isUploading}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['website', 'youtube', 'pdf', 'github', 'course', 'book'] as ResourceType[]).map(t => (
                <label key={t} className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${type === t ? 'bg-primary/10 border-primary font-medium' : 'hover:bg-accent'} ${(loading || (initialData && initialData.type === 'pdf')) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="hidden" disabled={loading || (initialData && initialData.type === 'pdf')} />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              placeholder={type === 'pdf' ? "e.g. React Cheatsheet" : "e.g. React Documentation"}
              disabled={loading}
            />
          </div>

          {type === 'pdf' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">File {initialData?.fileUrl && '(Optional to replace)'}</label>
              {isUploading ? (
                <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Uploading...</span>
                    <span className="font-bold">{Math.round(uploadProgress!)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-2 transition-all duration-300 ease-out" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={onCancelUpload} className="bg-transparent border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
                      Cancel Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <PDFUploader 
                  selectedFile={selectedFile} 
                  onFileSelect={setSelectedFile}
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                placeholder="https://..."
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] disabled:opacity-50"
              placeholder="Brief note about this resource..."
              disabled={loading}
            />
          </div>

          {!isUploading && (
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Resource')}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
