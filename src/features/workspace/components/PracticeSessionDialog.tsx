import { useState, useEffect } from 'react';
import { X, CheckCircle2, Eye, BrainCircuit, Flame, Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Question } from '../../../types';
import { cn } from '../../../lib/utils';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { analyticsService } from '../../../services/analytics.service';
import { evaluateRating } from '../utils/questionEngine';

interface PracticeSessionDialogProps {
  queue: Question[];
  onClose: () => void;
  onComplete: (id: string, updates: Partial<Question>) => Promise<void>;
  initialState?: any;
  categoryId?: string;
}

export function PracticeSessionDialog({ queue, onClose, onComplete, initialState, categoryId }: PracticeSessionDialogProps) {
  const { user } = useAuth();
  const [activeQueue, setActiveQueue] = useState<Question[]>(initialState?.activeQueue || []);
  const [currentIndex, setCurrentIndex] = useState<number>(initialState?.currentIndex || 0);
  interface SessionStats {
    reviewed: number;
    correct: number;
    hard: number;
    incorrect: number;
    masteryGained: number;
  }
  
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialState?.sessionStats || {
    reviewed: 0,
    correct: 0,
    hard: 0,
    incorrect: 0,
    masteryGained: 0
  });
  const [sessionStartTime] = useState(initialState?.sessionStartTime || Date.now());
  const [studyDuration, setStudyDuration] = useState(0);
  const [failedCardIds, setFailedCardIds] = useState<Set<string>>(
    new Set(initialState?.failedCardIds || [])
  );

  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!initialState && queue.length > 0) {
      setActiveQueue([...queue]);
      setCurrentIndex(0);
      setSessionStats({ reviewed: 0, correct: 0, hard: 0, incorrect: 0, masteryGained: 0 });
      setFailedCardIds(new Set());
      resetCardState();
    } else if (initialState) {
      setActiveQueue(initialState.activeQueue || []);
      setCurrentIndex(initialState.currentIndex || 0);
      setSessionStats(initialState.sessionStats || { reviewed: 0, correct: 0, hard: 0, incorrect: 0, masteryGained: 0 });
      setFailedCardIds(new Set(initialState.failedCardIds || []));
      resetCardState();
    }
  }, [queue, initialState]);

  useEffect(() => {
    if (activeQueue.length > 0 && categoryId && currentIndex < activeQueue.length) {
      localStorage.setItem(`studyhub_session_${categoryId}`, JSON.stringify({
        activeQueue,
        currentIndex,
        sessionStats,
        sessionStartTime,
        failedCardIds: Array.from(failedCardIds)
      }));
    }
  }, [activeQueue, currentIndex, sessionStats, categoryId, sessionStartTime, failedCardIds]);

  useEffect(() => {
    if (activeQueue.length > 0 && currentIndex >= activeQueue.length) {
      const durationStr = Math.floor((Date.now() - sessionStartTime) / 60000);
      setStudyDuration(durationStr);
      
      if (categoryId) {
        localStorage.removeItem(`studyhub_session_${categoryId}`);
      }

      if (user) {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        analyticsService.updateStudyStreakTransaction(user.uid, todayStr, yesterdayStr);
      }
    }
  }, [currentIndex, activeQueue.length, categoryId, sessionStartTime, user]);

  const resetCardState = () => {
    setUserInput('');
    setSelectedOption(null);
    setIsRevealed(false);
    setIsCorrect(null);
  };

  if (activeQueue.length === 0) return null;

  if (currentIndex >= activeQueue.length) {
    const totalAttempts = sessionStats.correct + sessionStats.hard + sessionStats.incorrect;
    const accuracy = totalAttempts > 0 ? Math.round((sessionStats.correct / totalAttempts) * 100) : 0;
    
    return (
      <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-lg rounded-xl shadow-2xl border border-primary/20 flex flex-col relative overflow-hidden p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Session Complete</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-y border-border/50 py-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">{sessionStats.reviewed}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Reviewed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-green-500">{sessionStats.correct}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Correct</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-amber-500">{sessionStats.hard}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Hard</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-red-500">{sessionStats.incorrect}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Incorrect</span>
            </div>
            <div className="flex flex-col">
              <span className={cn("text-3xl font-bold", sessionStats.masteryGained >= 0 ? "text-green-500" : "text-red-500")}>
                {sessionStats.masteryGained > 0 ? '+' : ''}{sessionStats.masteryGained}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Mastery</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-blue-500">{accuracy}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">{studyDuration}m</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Duration</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-500">
              <Flame className="h-5 w-5" /> Current Streak: {user?.studyStreak || (sessionStats.reviewed > 0 ? 1 : 0)}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-500">
              <Trophy className="h-5 w-5" /> Best Streak: {user?.longestStudyStreak || (sessionStats.reviewed > 0 ? 1 : 0)}
            </div>
          </div>
          
          <Button onClick={onClose} size="lg" className="w-full text-lg tracking-wide font-bold">
            Finish
          </Button>
        </div>
      </div>
    );
  }

  const question = activeQueue[currentIndex];

  const handleCheckAnswer = () => {
    if (question.type === 'fill_blank') {
      const correct = userInput.trim().toLowerCase() === question.answer.trim().toLowerCase();
      setIsCorrect(correct);
    } else if (question.type === 'multiple_choice') {
      const correct = selectedOption === question.correctOption;
      setIsCorrect(correct);
    }
    setIsRevealed(true);
  };

  const handleRating = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setIsSaving(true);
    
    const safeType = question.type || 'concept_review';
    const isFailure = (safeType !== 'concept_review' && isCorrect === false) || (rating === 'again');

    const {
      newMasteryScore,
      newStatus,
      nextReviewDate: nextReview,
      requeueOffset: reinsertOffset,
      hasLapsedThisSession,
      actualGained
    } = evaluateRating(question, rating, isCorrect !== false, failedCardIds);

    if (isFailure) {
      setFailedCardIds(prev => new Set(prev).add(question.id));
    }

    const now = Date.now();
    const updatedQuestion = {
      ...question,
      masteryScore: newMasteryScore,
      status: newStatus,
      lapsedThisSession: hasLapsedThisSession, // Persist lapse state in-memory for the session
      lastReviewed: now,
      nextReview,
      reviewCount: question.reviewCount + 1
    };

    let isActIncorrect = false;
    let isActHard = false;
    let isActCorrect = false;

    if (question.type === 'concept_review') {
      if (rating === 'again') isActIncorrect = true;
      else if (rating === 'hard') isActHard = true;
      else isActCorrect = true;
    } else {
      if (isCorrect) {
        if (rating === 'hard') isActHard = true;
        else isActCorrect = true;
      } else {
        isActIncorrect = true;
      }
    }

    await onComplete(question.id, {
      masteryScore: newMasteryScore,
      status: newStatus,
      lastReviewed: now,
      nextReview,
      reviewCount: question.reviewCount + 1
    });

    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      correct: prev.correct + (isActCorrect ? 1 : 0),
      hard: prev.hard + (isActHard ? 1 : 0),
      incorrect: prev.incorrect + (isActIncorrect ? 1 : 0),
      masteryGained: prev.masteryGained + actualGained
    }));

    if (reinsertOffset !== 0) {
      setActiveQueue(prev => {
        const next = [...prev];
        if (reinsertOffset === -1) {
          next.push(updatedQuestion);
        } else {
          let insertIndex = currentIndex + 1 + reinsertOffset;
          const remainingCards = next.length - (currentIndex + 1);
          
          if (remainingCards < 2) {
            insertIndex = next.length; // push to end to avoid consecutive duplicate
          } else {
            insertIndex = Math.min(insertIndex, next.length);
          }
          next.splice(insertIndex, 0, updatedQuestion);
        }
        return next;
      });
    }

    setCurrentIndex(prev => prev + 1);
    resetCardState();
    setIsSaving(false);
  };

  if (!question) return null;
  const safeType = question.type || 'concept_review';

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-3xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-xl shadow-2xl border border-primary/20 flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 ease-out z-10" style={{ width: `${Math.min(100, (currentIndex / activeQueue.length) * 100)}%` }} />
        
        <div className="flex items-center justify-between p-6 border-b shrink-0 bg-muted/10">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold font-mono tracking-tight">Practice Session</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 px-3 py-1 rounded-full">
              Card {currentIndex + 1} of {activeQueue.length}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-accent rounded-md text-muted-foreground transition-colors" disabled={isSaving}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-y-auto relative">
          {isSaving && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full border bg-muted/20 text-muted-foreground">
              {safeType.replace('_', ' ')}
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full border bg-primary/10 text-primary">
              Mastery {question.masteryScore || 0}%
            </span>
          </div>

          <div className="text-2xl font-medium mb-8 leading-relaxed text-foreground text-center">
            {question.question}
          </div>

          <div className="space-y-6">
            {question.type === 'fill_blank' && (
              <div className="space-y-4">
                {isRevealed ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Your Answer</p>
                      <p className={cn("text-lg font-mono flex items-center gap-2", isCorrect ? "text-green-500" : "text-red-500")}>
                        {userInput || '(Blank)'} {isCorrect ? '✅' : '❌'}
                      </p>
                    </div>
                    {!isCorrect && (
                      <div className="p-4 rounded-lg border bg-green-500/10 border-green-500/30">
                        <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2">Correct Answer</p>
                        <p className="text-lg font-mono text-green-600 flex items-center gap-2">
                          {question.answer} ✅
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onPaste={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                      }}
                      placeholder="Enter your exact answer..."
                      className="w-full p-4 text-lg bg-background border-2 border-input rounded-lg focus:outline-none focus:border-primary font-mono transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userInput.trim()) {
                          handleCheckAnswer();
                        }
                      }}
                    />
                    <p className="text-xs text-amber-500 font-medium">
                      Paste disabled during active recall. Type your answer manually.
                    </p>
                    <Button 
                      className="w-full py-6 text-lg tracking-wide font-bold mt-2" 
                      onClick={handleCheckAnswer}
                      disabled={!userInput.trim()}
                    >
                      Check Answer
                    </Button>
                  </>
                )}
              </div>
            )}

            {question.type === 'multiple_choice' && (
              <div className="space-y-3">
                {question.options?.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = question.correctOption === idx;
                  
                  let btnClass = "border-border bg-card hover:border-primary/50 hover:bg-accent";
                  if (isRevealed) {
                    if (isCorrectOption) {
                      btnClass = "border-green-500 bg-green-500/10 text-green-600 font-medium";
                    } else if (isSelected && !isCorrectOption) {
                      btnClass = "border-red-500 bg-red-500/10 text-red-600 font-medium";
                    } else {
                      btnClass = "border-border bg-card opacity-50 cursor-not-allowed";
                    }
                  } else if (isSelected) {
                    btnClass = "border-primary bg-primary/10 text-primary font-medium";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isRevealed && setSelectedOption(idx)}
                      disabled={isRevealed}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all text-lg flex justify-between items-center",
                        btnClass
                      )}
                    >
                      <span>{opt}</span>
                      {isRevealed && isCorrectOption && <span>✅</span>}
                      {isRevealed && isSelected && !isCorrectOption && <span>❌</span>}
                    </button>
                  );
                })}
                {!isRevealed && (
                  <Button 
                    className="w-full py-6 text-lg tracking-wide font-bold mt-4" 
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                  >
                    Submit
                  </Button>
                )}
              </div>
            )}

            {question.type === 'concept_review' && !isRevealed && (
              <Button 
                className="w-full py-6 text-lg tracking-wide font-bold flex items-center justify-center gap-2" 
                onClick={() => setIsRevealed(true)}
              >
                <Eye className="h-5 w-5" />
                Reveal Answer
              </Button>
            )}
            {question.type === 'concept_review' && isRevealed && (
               <div className="space-y-4">
                 <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Correct Answer</h4>
                 <div className="p-6 bg-accent/30 rounded-lg text-lg text-foreground/90 whitespace-pre-wrap border border-border/50">
                   {question.answer}
                 </div>
               </div>
            )}
          </div>

          {isRevealed && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
              <div className="space-y-4 pt-6 border-t">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">How well did you know this?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    className="py-6 border-red-500/30 hover:bg-red-500/10 hover:text-red-500 flex flex-col gap-1 h-auto"
                    onClick={() => handleRating('again')}
                    disabled={isSaving}
                  >
                    <span className="font-bold">Again</span>
                    <span className="text-xs opacity-60">&lt; 1 min</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="py-6 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 flex flex-col gap-1 h-auto"
                    onClick={() => handleRating('hard')}
                    disabled={isSaving}
                  >
                    <span className="font-bold">Hard</span>
                    <span className="text-xs opacity-60">1 day</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "py-6 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500 flex flex-col gap-1 h-auto",
                      (question.type !== 'concept_review' && isCorrect === false) ? "opacity-50 cursor-not-allowed grayscale" : ""
                    )}
                    onClick={() => handleRating('good')}
                    disabled={isSaving || (question.type !== 'concept_review' && isCorrect === false)}
                  >
                    <span className="font-bold">Good</span>
                    <span className="text-xs opacity-60">3 days</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "py-6 border-green-500/30 hover:bg-green-500/10 hover:text-green-500 flex flex-col gap-1 h-auto",
                      (question.type !== 'concept_review' && isCorrect === false) ? "opacity-50 cursor-not-allowed grayscale" : ""
                    )}
                    onClick={() => handleRating('easy')}
                    disabled={isSaving || (question.type !== 'concept_review' && isCorrect === false)}
                  >
                    <span className="font-bold">Easy</span>
                    <span className="text-xs opacity-60">7 days</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
