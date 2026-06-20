import { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import type { Question } from '../../../../types';

interface PDFQuestionGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questionData: Partial<Question>) => Promise<void>;
  sourceHighlightText: string;
  sourcePageNumber: number;
  sourceResourceTitle: string;
  initialType: "fill_blank" | "multiple_choice" | "concept_review";
}

export function PDFQuestionGeneratorDialog({
  isOpen,
  onClose,
  onSubmit,
  sourceHighlightText,
  sourcePageNumber,
  sourceResourceTitle,
  initialType
}: PDFQuestionGeneratorDialogProps) {
  const [type, setType] = useState(initialType);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill logic
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      if (initialType === 'concept_review') {
        setQuestion('');
        setAnswer(sourceHighlightText);
      } else if (initialType === 'fill_blank') {
        setQuestion(sourceHighlightText);
        setAnswer('');
      } else {
        setQuestion('');
        setAnswer('');
      }
      setOptions(['', '', '', '']);
      setIsSubmitting(false);
    }
  }, [isOpen, initialType, sourceHighlightText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    
    // Multiple choice validation
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (type === 'multiple_choice') {
      if (validOptions.length < 2) return; // Need at least 2 options
      if (!validOptions.includes(answer.trim())) return; // Answer must be in options
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        question: question.trim(),
        answer: answer.trim(),
        options: type === 'multiple_choice' ? validOptions : undefined
      });
      onClose();
    } catch (err) {
      console.error("Failed to generate question:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg border overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Create Question
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <form id="question-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 p-3 rounded-md border text-sm text-muted-foreground border-l-4 border-l-primary/50">
              <div className="font-medium text-foreground mb-1 text-xs">
                From: {sourceResourceTitle} (Page {sourcePageNumber})
              </div>
              <p className="line-clamp-3 italic">"{sourceHighlightText}"</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="concept_review">Concept Review</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="multiple_choice">Multiple Choice</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="question" className="text-sm font-medium">
                {type === 'fill_blank' ? 'Question (use ___ for blank)' : 'Question'}
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={type === 'fill_blank' ? "The powerhouse of the cell is the ___." : "What is the powerhouse of the cell?"}
                className="w-full p-2 rounded-md border bg-background min-h-[80px] resize-y"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium">Answer / Concept</label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Mitochondria"
                className="w-full p-2 rounded-md border bg-background min-h-[80px] resize-y"
                required
              />
            </div>

            {type === 'multiple_choice' && (
              <div className="space-y-3 pt-2 border-t">
                <label className="text-sm font-medium block">Distractor Options</label>
                <p className="text-xs text-muted-foreground mb-2">Include the correct answer as one of the options.</p>
                {options.map((opt, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1} ${opt === answer && opt ? '(Correct)' : ''}`}
                      className={`flex-1 p-2 border rounded-md bg-background ${opt === answer && opt ? 'border-green-500' : ''}`}
                      required={index < 2} // Require at least 2
                    />
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="p-4 border-t shrink-0 flex justify-end gap-2 bg-muted/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="question-form" disabled={isSubmitting || !question.trim() || !answer.trim()}>
            {isSubmitting ? 'Saving...' : 'Save Question'}
          </Button>
        </div>
      </div>
    </div>
  );
}
