import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  Moon, Sun, Trash2, Eye, Sparkles, AlertCircle, Highlighter
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '../../../components/ui/Button';
import { usePdfs } from '../hooks/usePdfs';
import { usePdfHighlights } from '../hooks/usePdfHighlights';
import { highlightsService } from '../services/highlights.service';
import { questionsService } from '../../workspace/services/questions.service';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import type { PdfHighlight, Question } from '../../../types';
import { CreateFlashcardDialog } from '../components/CreateFlashcardDialog';

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const HIGHLIGHT_COLORS = {
  yellow: 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-yellow-300',
  blue: 'bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-300',
  green: 'bg-green-200 hover:bg-green-300 text-green-800 border-green-300',
  pink: 'bg-pink-200 hover:bg-pink-300 text-pink-800 border-pink-300',
};

export function PdfReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pdfs, loading: pdfsLoading } = usePdfs();
  const { highlights, loading: highlightsLoading } = usePdfHighlights(id);
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Selection state
  const [highlightText, setHighlightText] = useState('');
  const [tooltipPos, setTooltipPos] = useState<{ x: number, y: number } | null>(null);

  // Flashcard Modal state
  const [flashcardSourceHighlight, setFlashcardSourceHighlight] = useState<PdfHighlight | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const pdf = pdfs.find(p => p.id === id);

  const handleCreateFlashcard = async (questionData: Partial<Question>) => {
    if (!user || !pdf || !flashcardSourceHighlight) return;
    try {
      await questionsService.createQuestion({
        userId: user.uid,
        categoryId: questionData.categoryId!,
        question: questionData.question!,
        answer: questionData.answer!,
        type: questionData.type as any,
        options: questionData.options,
        status: 'learning',
        reviewCount: 0,
        masteryScore: 0,
        lastReviewed: null,
        nextReview: null,
        sourceResourceId: pdf.id,
        sourceResourceTitle: pdf.title,
        sourcePageNumber: flashcardSourceHighlight.pageNumber,
        sourceHighlightText: flashcardSourceHighlight.highlightText
      });
      alert('Flashcard created successfully!');
      navigate('/vault');
    } catch (error) {
      console.error("Failed to create question:", error);
      alert('Failed to create flashcard.');
    }
  };

  // Handle Text Selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      
      if (containerRef.current && containerRef.current.contains(selection.anchorNode)) {
        const text = selection.toString().trim();
        if (text) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setHighlightText(text);
          setTooltipPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const tooltip = document.getElementById('pdf-highlight-tooltip');
      if (tooltip && !tooltip.contains(e.target as Node)) {
        setTooltipPos(null);
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleCreateHighlight = async (color: PdfHighlight['color']) => {
    if (!user || !pdf || !highlightText) return;
    
    try {
      await highlightsService.createHighlight({
        userId: user.uid,
        pdfId: pdf.id,
        pdfTitle: pdf.title,
        pageNumber,
        highlightText,
        color
      });
      setTooltipPos(null);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Failed to save highlight:", error);
    }
  };

  const handleDeleteHighlight = async (highlightId: string) => {
    if (!confirm('Delete this highlight?')) return;
    try {
      await highlightsService.deleteHighlight(highlightId);
    } catch (error) {
      console.error("Failed to delete highlight:", error);
    }
  };

  if (pdfsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">PDF Not Found</h2>
        <Button onClick={() => navigate('/pdf')}>Back to Library</Button>
      </div>
    );
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const previousPage = () => setPageNumber(prev => prev > 1 ? prev - 1 : prev);
  const nextPage = () => setPageNumber(prev => (numPages && prev < numPages) ? prev + 1 : prev);
  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Computations
  const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const highlightsThisWeek = highlights.filter(h => h.createdAt >= weekStart).length;

  return (
    <div className={`fixed inset-0 z-50 flex ${isDarkMode ? 'dark bg-neutral-950 text-neutral-50' : 'bg-white text-neutral-900'}`}>
      
      {/* Main Content Area (PDF) */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Toolbar */}
        <div className={`flex items-center justify-between p-3 border-b shadow-sm shrink-0 ${isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/pdf')} className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
              <X className="h-5 w-5 mr-1" /> Close
            </Button>
            <div className="font-medium truncate max-w-[200px] sm:max-w-md" title={pdf.title}>
              {pdf.title}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={zoomOut} title="Zoom Out" className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={zoomIn} title="Zoom In" className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="icon" onClick={previousPage} disabled={pageNumber <= 1} className={isDarkMode ? 'border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 disabled:opacity-50' : ''}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 hidden sm:inline-block">
                Page {pageNumber} of {numPages || '?'}
              </span>
              <span className="text-sm px-2 sm:hidden">
                {pageNumber}/{numPages || '?'}
              </span>
              <Button variant="outline" size="icon" onClick={nextPage} disabled={!numPages || pageNumber >= numPages} className={isDarkMode ? 'border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 disabled:opacity-50' : ''}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} title="Toggle Dark Mode" className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* PDF Viewer Area */}
        <div 
          ref={containerRef}
          className={`flex-1 overflow-auto relative flex justify-center py-8 ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-100'}`}
        >
          <Document
            file={pdf.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center p-12">
                <LoadingSpinner className="h-8 w-8 text-primary" />
              </div>
            }
            className={`shadow-xl transition-all duration-200 ${isDarkMode ? 'invert hue-rotate-180 brightness-95 contrast-105' : ''}`}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              loading={<div className="h-[800px] w-[600px] bg-muted animate-pulse rounded-md" />}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>

        {/* Contextual Highlight Tooltip */}
        {tooltipPos && highlightText && (
          <div 
            id="pdf-highlight-tooltip"
            className="fixed z-[60] -translate-x-1/2 -translate-y-full pb-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-1 bg-background border p-1.5 rounded-full"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="px-2 text-xs font-semibold text-muted-foreground mr-1 hidden sm:block">Highlight</div>
            {(['yellow', 'blue', 'green', 'pink'] as const).map(color => (
              <button
                key={color}
                onClick={(e) => { e.preventDefault(); handleCreateHighlight(color); }}
                className={`h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110 ${HIGHLIGHT_COLORS[color]}`}
                title={`Highlight ${color}`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Right Sidebar (Highlights Panel) */}
      <div className={`w-80 shrink-0 border-l flex flex-col ${isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-border bg-card'}`}>
        <div className="p-4 border-b border-inherit flex items-center gap-2">
          <Highlighter className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">Highlights Panel</h3>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-px bg-border border-b border-inherit">
          <div className={`p-3 text-center ${isDarkMode ? 'bg-neutral-900' : 'bg-card'}`}>
            <p className="text-2xl font-bold text-primary">{highlights.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</p>
          </div>
          <div className={`p-3 text-center ${isDarkMode ? 'bg-neutral-900' : 'bg-card'}`}>
            <p className="text-2xl font-bold text-amber-500">{highlightsThisWeek}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">This Week</p>
          </div>
        </div>
        
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
          {highlightsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner className="h-6 w-6 text-primary" />
            </div>
          ) : highlights.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-3">
              <Highlighter className="h-8 w-8 mx-auto opacity-20" />
              <p className="text-sm">No highlights yet.</p>
              <p className="text-xs">Select text in the PDF to create one.</p>
            </div>
          ) : (
            highlights.map(h => (
              <div key={h.id} className={`rounded-lg border border-inherit overflow-hidden flex flex-col ${isDarkMode ? 'bg-neutral-800/50' : 'bg-muted/30'}`}>
                {/* Highlight Content */}
                <div className="p-3 flex gap-3">
                  <div className={`w-1 rounded-full shrink-0 ${
                    h.color === 'yellow' ? 'bg-yellow-400' : 
                    h.color === 'blue' ? 'bg-blue-400' : 
                    h.color === 'green' ? 'bg-green-400' : 'bg-pink-400'
                  }`} />
                  <p className="text-sm italic text-foreground flex-1">"{h.highlightText}"</p>
                </div>
                
                {/* Highlight Metadata & Actions */}
                <div className={`px-3 py-2 border-t border-inherit flex items-center justify-between bg-black/5 ${isDarkMode ? 'bg-white/5' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground">Page {h.pageNumber}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(h.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPageNumber(h.pageNumber)} title="View Page">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => handleDeleteHighlight(h.id)} title="Delete Highlight">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Future Placeholder Button -> Phase 7C Engine */}
                <div className="p-2 border-t border-inherit">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-7"
                    onClick={() => setFlashcardSourceHighlight(h)}
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    Create Flashcard
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Create Flashcard Modal */}
      {flashcardSourceHighlight && (
        <CreateFlashcardDialog
          isOpen={!!flashcardSourceHighlight}
          onClose={() => setFlashcardSourceHighlight(null)}
          onSubmit={handleCreateFlashcard}
          sourceHighlightText={flashcardSourceHighlight.highlightText}
          sourcePageNumber={flashcardSourceHighlight.pageNumber}
          sourceResourceTitle={flashcardSourceHighlight.pdfTitle}
        />
      )}
    </div>
  );
}
