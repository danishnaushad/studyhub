import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Upload, Trash2, Search, ArrowUpDown, 
  Layers, Clock, HardDrive 
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { usePdfs } from '../hooks/usePdfs';
import { pdfService } from '../services/pdf.service';
import { useCategories } from '../../../hooks/useCategories';

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';

export function PdfLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pdfs, loading: pdfsLoading } = usePdfs();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.type !== 'application/pdf') {
      alert("Only PDF files are supported.");
      return;
    }
    // Check size, e.g. max 50MB
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large. Maximum size is 50MB.");
      return;
    }
    
    // We'll use a default category "general" if none selected. Better yet, let's enforce selection if we wanted, but let's just use the first category or empty for simplicity in this library.
    const catId = selectedCategory || (categories.length > 0 ? categories[0].id : 'unassigned');

    setIsUploading(true);
    try {
      await pdfService.uploadPdf(file, user.uid, catId);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload PDF.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (pdfId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this PDF? This action cannot be undone.')) return;
    try {
      await pdfService.deletePdf(pdfId, user.uid);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  // Computations
  const filteredAndSortedPdfs = useMemo(() => {
    let result = [...pdfs];
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return b.createdAt - a.createdAt;
        case 'oldest': return a.createdAt - b.createdAt;
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        case 'size-desc': return b.fileSize - a.fileSize;
        case 'size-asc': return a.fileSize - b.fileSize;
        default: return 0;
      }
    });
    
    return result;
  }, [pdfs, searchQuery, sortBy]);

  const totalPages = pdfs.reduce((sum, p) => sum + (p.pageCount || 0), 0);
  const recentCount = pdfs.filter(p => p.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000).length;

  if (pdfsLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <FileText className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PDF Workspace</h1>
            <p className="text-sm text-muted-foreground">Manage and study your PDF documents.</p>
          </div>
        </div>
        
        {/* Upload Button */}
        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? <LoadingSpinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total PDFs</p>
              <p className="text-3xl font-bold">{pdfs.length}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
              <p className="text-3xl font-bold">{totalPages}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Layers className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recently Added (7d)</p>
              <p className="text-3xl font-bold">{recentCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-2 rounded-lg border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border-none focus:outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2 pr-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm bg-transparent border-none focus:outline-none font-medium cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedPdfs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-bold">No PDFs found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              {searchQuery ? "Try adjusting your search query." : "Upload your first PDF to get started with the workspace."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedPdfs.map(pdf => {
            const cat = categories.find(c => c.id === pdf.categoryId);
            return (
              <Card key={pdf.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(`/pdf/${pdf.id}`)}>
                <div className="aspect-[4/3] bg-muted/30 relative flex items-center justify-center p-6 border-b">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => { e.stopPropagation(); handleDelete(pdf.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FileText className="h-16 w-16 text-red-500/40" />
                  {cat && (
                    <span 
                      className="absolute bottom-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name}
                    </span>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={pdf.title}>
                      {pdf.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <div className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {pdf.pageCount} pages
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {(pdf.fileSize / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
