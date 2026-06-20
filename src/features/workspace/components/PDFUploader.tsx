import { useState, useRef } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PDFUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function PDFUploader({ onFileSelect, selectedFile, error }: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelectFile = (file: File) => {
    setLocalError('');
    if (file.type !== 'application/pdf') {
      setLocalError('Only PDF files are allowed.');
      onFileSelect(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setLocalError('File size must be under 25MB.');
      onFileSelect(null);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
    setLocalError('');
  };

  const displayError = localError || error;

  return (
    <div className="w-full cursor-pointer">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${displayError ? 'border-red-500 bg-red-500/5' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF (max. 25MB)</p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <File className="h-8 w-8 text-orange-500 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); clearFile(); }} type="button" className="shrink-0 text-muted-foreground hover:text-red-500">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {displayError && (
        <p className="text-sm text-red-500 mt-2">{displayError}</p>
      )}
    </div>
  );
}
