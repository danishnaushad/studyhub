import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Question } from '../../../types';

interface QuestionEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Question>) => Promise<void>;
  initialData?: Question;
}

export function QuestionEditorDialog({ isOpen, onClose, onSubmit, initialData }: QuestionEditorDialogProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState<Question['type']>('concept_review');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setQuestion(initialData.question);
        setAnswer(initialData.answer || '');
        setType(initialData.type || 'concept_review');
        setOptions(initialData.options && initialData.options.length > 0 ? initialData.options : ['', '', '', '']);
        setCorrectOption(initialData.correctOption ?? 0);
      } else {
        setQuestion('');
        setAnswer('');
        setType('concept_review');
        setOptions(['', '', '', '']);
        setCorrectOption(0);
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Question text is required.');
      return;
    }
    
    if (type === 'multiple_choice' && options.some(opt => !opt.trim())) {
      setError('All multiple choice options must be filled out.');
      return;
    }
    
    if (!answer.trim() && type !== 'multiple_choice') {
       setError('Answer text is required for this question type.');
       return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const submitData: Partial<Question> = {
        question: question.trim(),
        answer: type === 'multiple_choice' ? options[correctOption].trim() : answer.trim(),
        type,
      };

      if (type === 'multiple_choice') {
        submitData.options = options.map(o => o.trim());
        submitData.correctOption = correctOption;
      }

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-bold">{initialData ? 'Edit Knowledge Card' : 'Create Knowledge Card'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Question Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as Question['type'])}
                className="w-full p-2 bg-background border border-input rounded-md text-sm"
                disabled={loading}
              >
                <option value="concept_review">Concept Review</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="multiple_choice">Multiple Choice</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-none"
                placeholder={type === 'fill_blank' ? "e.g., What does LAN stand for?" : "What do you want to learn?"}
                disabled={loading}
              />
            </div>

            {type === 'multiple_choice' ? (
              <div className="space-y-3">
                <label className="text-sm font-medium">Options</label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="correctOption"
                      checked={correctOption === idx}
                      onChange={() => setCorrectOption(idx)}
                      className="w-4 h-4 text-primary"
                    />
                    <input 
                      id={`option-input-${idx}`}
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (idx < options.length - 1) {
                            document.getElementById(`option-input-${idx + 1}`)?.focus();
                          } else {
                            document.getElementById('create-card-btn')?.click();
                          }
                        }
                      }}
                      className="flex-1 p-2 bg-background border border-input rounded-md text-sm"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      disabled={loading}
                    />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground mt-1">Select the radio button next to the correct answer.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">{type === 'fill_blank' ? 'Exact Answer' : 'Explanation / Notes'}</label>
                <textarea 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-3 bg-accent/30 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
                  placeholder={type === 'fill_blank' ? "e.g., Local Area Network" : "Explain the concept here..."}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <div className="p-4 border-t flex justify-end gap-2 shrink-0 bg-muted/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button id="create-card-btn" type="submit" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {initialData ? 'Save Changes' : 'Create Card'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
