import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Button } from '../../../../components/ui/Button';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import type { Resource } from '../../../../types';
import { resourcesService } from '../../services/resources.service';
import { notesService } from '../../services/notes.service';
import { questionsService } from '../../services/questions.service';
import { PDFNoteGeneratorDialog } from './PDFNoteGeneratorDialog';
import { PDFQuestionGeneratorDialog } from './PDFQuestionGeneratorDialog';
import { FileText } from 'lucide-react';
import type { Question } from '../../../../types';

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFWorkspaceReaderProps {
  resource: Resource;
  onClose: () => void;
}

export function PDFWorkspaceReader({ resource, onClose }: PDFWorkspaceReaderProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(resource.currentPage || 1);
  const [scale, setScale] = useState<number>(1.2);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pageNumberRef = useRef(pageNumber);
  const numPagesRef = useRef(numPages);
  
  const startTimeRef = useRef<number>(Date.now());
  const accumulatedTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Keep refs in sync for unmount closure
  useEffect(() => {
    pageNumberRef.current = pageNumber;
    numPagesRef.current = numPages;
  }, [pageNumber, numPages]);

  // Handle visibility changes for accurate time tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden) {
        if (isVisibleRef.current) {
          accumulatedTimeRef.current += (now - startTimeRef.current);
          isVisibleRef.current = false;
        }
      } else {
        if (!isVisibleRef.current) {
          startTimeRef.current = now;
          isVisibleRef.current = true;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Save progress and time on unmount ONLY
  useEffect(() => {
    return () => {
      let finalTime = accumulatedTimeRef.current;
      if (isVisibleRef.current) {
        finalTime += (Date.now() - startTimeRef.current);
      }
      const seconds = Math.floor(finalTime / 1000);
      
      const currentP = pageNumberRef.current;
      const totalP = numPagesRef.current;

      const save = async () => {
        try {
          if (seconds > 0) {
            await resourcesService.updateReadingTime(resource.id, seconds);
          }
          await resourcesService.updateResource(resource.id, { 
            currentPage: currentP,
            ...(totalP ? { totalPages: totalP } : {})
          });
        } catch (err) {
          console.error('Failed to save PDF reading progress on close', err);
        }
      };
      save();
    };
  }, [resource.id]);

  // Selection Capture for Notes & Questions Integration
  const [highlightText, setHighlightText] = useState('');
  const [tooltipPos, setTooltipPos] = useState<{ x: number, y: number } | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [questionType, setQuestionType] = useState<"fill_blank" | "multiple_choice" | "concept_review">("concept_review");

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        // We do NOT clear tooltip on collapse immediately here because 
        // clicking the tooltip button might cause a selection collapse before the click registers.
        // We will handle clearing elsewhere or rely on mousedown.
        return;
      }
      
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
      // If clicking outside the tooltip, clear it
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

  const handleCreateNoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNoteDialogOpen(true);
    setTooltipPos(null); // hide tooltip
  };

  const handleCreateQuestionClick = (e: React.MouseEvent, type: "fill_blank" | "multiple_choice" | "concept_review") => {
    e.preventDefault();
    e.stopPropagation();
    setQuestionType(type);
    setIsQuestionDialogOpen(true);
    setTooltipPos(null); // hide tooltip
  };

  const handleNoteSubmit = async (title: string, content: string) => {
    await notesService.createNote({
      userId: resource.userId,
      categoryId: resource.categoryId,
      title,
      content,
      sourceResourceId: resource.id,
      sourceResourceTitle: resource.title,
      sourcePageNumber: pageNumber,
      sourceHighlightText: highlightText
    });
  };

  const handleQuestionSubmit = async (questionData: Partial<Question>) => {
    // categoryId comes directly from resource metadata as requested
    await questionsService.createQuestion({
      userId: resource.userId,
      categoryId: resource.categoryId,
      question: questionData.question!,
      answer: questionData.answer!,
      type: questionData.type as any,
      options: questionData.options,
      status: 'learning',
      reviewCount: 0,
      masteryScore: 0,
      lastReviewed: null,
      nextReview: null,
      sourceResourceId: resource.id,
      sourceResourceTitle: resource.title,
      sourcePageNumber: pageNumber,
      sourceHighlightText: highlightText
    });
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (!resource.currentPage) {
      // First open
      setPageNumber(1);
    }
  }

  const previousPage = () => setPageNumber(prev => prev > 1 ? prev - 1 : prev);
  const nextPage = () => setPageNumber(prev => (numPages && prev < numPages) ? prev + 1 : prev);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // If the resource doesn't have a valid url/fileUrl, we shouldn't render
  const pdfUrl = resource.fileUrl || resource.url;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'dark bg-neutral-950 text-neutral-50' : 'bg-white text-neutral-900'}`}>
      
      {/* Top Toolbar */}
      <div className={`flex items-center justify-between p-3 border-b shadow-sm ${isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose} className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
            <X className="h-5 w-5 mr-1" /> Close
          </Button>
          <div className="font-medium truncate max-w-sm" title={resource.title}>
            {resource.title}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={zoomOut} title="Zoom Out" className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={zoomIn} title="Zoom In" className={isDarkMode ? 'hover:bg-neutral-800 text-neutral-100' : ''}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousPage} disabled={pageNumber <= 1} className={isDarkMode ? 'border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 disabled:opacity-50' : ''}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              Page {pageNumber} of {numPages || '?'}
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
        className={`flex-1 overflow-auto relative ${isDarkMode ? 'bg-neutral-950' : 'bg-neutral-100'}`}
      >
        <div className="flex justify-center min-h-full py-8">
          <Document
            file={pdfUrl}
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
      </div>

      {/* Contextual Highlight Tooltip */}
      {tooltipPos && highlightText && (
        <div 
          id="pdf-highlight-tooltip"
          className="fixed z-[60] -translate-x-1/2 -translate-y-full pb-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-1 bg-background border p-1 rounded-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <Button 
            size="sm" 
            onClick={handleCreateNoteClick}
            className="rounded-full shadow-sm gap-2 px-3 py-1.5 text-xs h-auto"
            variant="ghost"
          >
            <FileText className="h-3.5 w-3.5" />
            Note
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button 
            size="sm" 
            onClick={(e) => handleCreateQuestionClick(e, 'concept_review')}
            className="rounded-full shadow-sm px-3 py-1.5 text-xs h-auto"
            variant="ghost"
            title="Concept Review"
          >
            Concept
          </Button>
          <Button 
            size="sm" 
            onClick={(e) => handleCreateQuestionClick(e, 'fill_blank')}
            className="rounded-full shadow-sm px-3 py-1.5 text-xs h-auto"
            variant="ghost"
            title="Fill in the Blank"
          >
            Blank
          </Button>
          <Button 
            size="sm" 
            onClick={(e) => handleCreateQuestionClick(e, 'multiple_choice')}
            className="rounded-full shadow-sm px-3 py-1.5 text-xs h-auto"
            variant="ghost"
            title="Multiple Choice"
          >
            Quiz
          </Button>
        </div>
      )}

      {/* Note Generator Dialog */}
      <PDFNoteGeneratorDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        onSubmit={handleNoteSubmit}
        sourceHighlightText={highlightText}
        sourcePageNumber={pageNumber}
        sourceResourceTitle={resource.title}
      />

      {/* Question Generator Dialog */}
      <PDFQuestionGeneratorDialog
        isOpen={isQuestionDialogOpen}
        onClose={() => setIsQuestionDialogOpen(false)}
        onSubmit={handleQuestionSubmit}
        sourceHighlightText={highlightText}
        sourcePageNumber={pageNumber}
        sourceResourceTitle={resource.title}
        initialType={questionType}
      />
    </div>
  );
}
