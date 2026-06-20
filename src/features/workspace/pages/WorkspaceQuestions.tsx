import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, HelpCircle, Trophy, Flame, BrainCircuit } from 'lucide-react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../../../hooks/useAuth';
import { useQuestions } from '../hooks/useQuestions';
import { questionsService } from '../services/questions.service';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionEditorDialog } from '../components/QuestionEditorDialog';
import { PracticeSessionDialog } from '../components/PracticeSessionDialog';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { Question } from '../../../types';
import { buildStudyQueue, calculateCategoryStats } from '../utils/questionEngine';

type FilterType = 'all' | 'learning' | 'review' | 'mastered';

export function WorkspaceQuestions() {
  const { category } = useWorkspace();
  const { user } = useAuth();
  const { questions, loading, error } = useQuestions(category.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>(undefined);
  const [practiceQueue, setPracticeQueue] = useState<Question[]>([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [savedSessionData, setSavedSessionData] = useState<any>(null);

  useEffect(() => {
    if (category?.id) {
      const saved = localStorage.getItem(`studyhub_session_${category.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.activeQueue && parsed.activeQueue.length > 0) {
            setSavedSessionData(parsed);
            setShowResumeDialog(true);
          }
        } catch (e) {
          localStorage.removeItem(`studyhub_session_${category.id}`);
        }
      }
    }
  }, [category?.id]);

  const handleOpenAdd = () => {
    setEditingQuestion(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await questionsService.deleteQuestion(id);
    }
  };

  const handleSubmit = async (data: Partial<Question>) => {
    if (!user) return;
    
    // Clean undefined values from data
    const cleanData = { ...data };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key as keyof Question] === undefined) {
        delete cleanData[key as keyof Question];
      }
    });
    
    if (editingQuestion) {
      await questionsService.updateQuestion(editingQuestion.id, cleanData);
    } else {
      const newQuestion: any = {
        question: data.question || '',
        answer: data.answer || '',
        type: data.type || 'concept_review',
        status: 'learning',
        reviewCount: 0,
        masteryScore: 0,
        lastReviewed: null,
        nextReview: Date.now(),
        userId: user.uid,
        categoryId: category.id,
      };

      if (data.type === 'multiple_choice') {
        newQuestion.options = data.options || [];
        newQuestion.correctOption = data.correctOption;
      }

      await questionsService.createQuestion(newQuestion);
    }
  };

  const filteredQuestions = useMemo(() => {
    let result = questions;
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(q => q.status === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(question => 
        (question.question && question.question.toLowerCase().includes(q)) || 
        (question.answer && question.answer.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [questions, searchQuery, filter]);

  const handleStudyNow = () => {
    const queue = buildStudyQueue(questions, filter);
    
    if (queue.length > 0) {
      setPracticeQueue(queue);
    } else {
      alert("No cards to review!");
    }
  };

  const handlePracticeComplete = async (id: string, updates: Partial<Question>) => {
    await questionsService.updateQuestion(id, updates);
  };

  const stats = useMemo(() => {
    return calculateCategoryStats(questions);
  }, [questions]);

  const handleResumeSession = () => {
    if (savedSessionData) {
      setPracticeQueue(savedSessionData.activeQueue);
    }
    setShowResumeDialog(false);
  };

  const handleDiscardSession = () => {
    if (category?.id) {
      localStorage.removeItem(`studyhub_session_${category.id}`);
    }
    setSavedSessionData(null);
    setShowResumeDialog(false);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 shrink-0">
        <div className="space-y-4 w-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Knowledge Trainer</h2>
            <p className="text-muted-foreground mt-1">
              Track, review, and master concepts for {category.name}.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
            <div className="flex gap-6 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">New</span>
                <span className="text-2xl font-bold text-foreground">{stats.newCards}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Learning</span>
                <span className="text-2xl font-bold text-blue-500">{stats.learningCards}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Due Today</span>
                <span className="text-2xl font-bold text-red-500">{stats.dueToday}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mastered</span>
                <span className="text-2xl font-bold text-green-500">{stats.masteredCards}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mastery</span>
                <span className="text-2xl font-bold text-purple-500">{stats.masteryPercentage}%</span>
              </div>
              
              <div className="hidden lg:flex flex-col border-l border-border/50 pl-6 ml-2">
                <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-orange-500">
                  <Flame className="h-4 w-4" /> Current Streak: {user?.studyStreak || 0}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
                  <Trophy className="h-4 w-4" /> Best Streak: {user?.longestStudyStreak || 0}
                </div>
              </div>
            </div>
            
            <Button onClick={handleStudyNow} size="lg" className="w-full sm:w-auto text-lg tracking-wide shadow-md font-bold hover:scale-[1.02] transition-transform">
              Study Now
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search concepts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={handleOpenAdd} className="shrink-0 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Card</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border">
        {(['all', 'learning', 'review', 'mastered'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f} ({f === 'all' ? questions.length : questions.filter(q => q.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center flex-1">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="py-12 flex flex-col items-center justify-center flex-1">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center max-w-lg">
            <h3 className="text-lg font-bold text-red-500 mb-2">Error Loading Knowledge Trainer</h3>
            <p className="text-red-500/80">{error}</p>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50 flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6 opacity-50" />
          </div>
          <p>No knowledge cards created yet.</p>
          <p className="text-sm mt-1">Start tracking concepts you want to master.</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground italic border rounded-xl border-dashed bg-card/50 flex-1 flex flex-col items-center justify-center">
          <Search className="h-8 w-8 opacity-20 mb-4" />
          <p>No {filter !== 'all' ? filter : ''} cards found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl pb-8">
          {filteredQuestions.map(question => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <QuestionEditorDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingQuestion}
      />
      
      {practiceQueue.length > 0 && (
        <PracticeSessionDialog
          queue={practiceQueue}
          onClose={() => setPracticeQueue([])}
          onComplete={handlePracticeComplete}
          initialState={savedSessionData}
          categoryId={category.id}
        />
      )}

      {showResumeDialog && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-2xl border flex flex-col relative overflow-hidden p-6 text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Resume Session?</h2>
            <p className="text-sm text-muted-foreground">
              You have an unfinished study session from earlier. Would you like to resume where you left off?
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" onClick={handleDiscardSession} className="w-full">
                Discard
              </Button>
              <Button onClick={handleResumeSession} className="w-full">
                Resume
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
