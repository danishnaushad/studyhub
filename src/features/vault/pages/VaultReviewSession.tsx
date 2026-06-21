import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Eye, BrainCircuit, ArrowLeft, Flame, Trophy } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Question } from '../../../types';
import { cn } from '../../../lib/utils';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../hooks/useAuth';
import { analyticsService } from '../../../services/analytics.service';
import { questionsService } from '../../workspace/services/questions.service';
import { evaluateRating } from '../../workspace/utils/questionEngine';
import { useVault } from '../hooks/useVault';

interface SessionStats {
  reviewed: number;
  correct: number;
  hard: number;
  incorrect: number;
  masteryGained: number;
}

export function VaultReviewSession() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dueQuestions, questions, loading: vaultLoading } = useVault();
  
  const [activeQueue, setActiveQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    reviewed: 0,
    correct: 0,
    hard: 0,
    incorrect: 0,
    masteryGained: 0
  });
  const [sessionStartTime] = useState(Date.now());
  const [studyDuration, setStudyDuration] = useState(0);
  const [failedCardIds, setFailedCardIds] = useState<Set<string>>(new Set());

  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!vaultLoading && !initialized) {
      setActiveQueue([...dueQuestions]);
      setInitialized(true);
    }
  }, [vaultLoading, initialized, dueQuestions]);

  const resetCardState = () => {
    setUserInput('');
    setSelectedOption(null);
    setIsRevealed(false);
    setIsCorrect(null);
  };

  useEffect(() => {
    if (initialized && activeQueue.length > 0 && currentIndex >= activeQueue.length) {
      const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
      const durationStr = Math.floor(durationSec / 60);
      setStudyDuration(durationStr);

      if (user && !isSaved) {
        setIsSaved(true);
        // Streak logic
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        analyticsService.updateStudyStreakTransaction(user.uid, todayStr, yesterdayStr);

        // Save Study Session
        const totalAttempts = sessionStats.correct + sessionStats.hard + sessionStats.incorrect;
        const accuracy = totalAttempts > 0 ? Math.round((sessionStats.correct / totalAttempts) * 100) : 0;
        
        analyticsService.saveStudySession({
          id: crypto.randomUUID(),
          cardsReviewed: sessionStats.reviewed,
          correctCount: sessionStats.correct,
          hardCount: sessionStats.hard,
          incorrectCount: sessionStats.incorrect,
          accuracy,
          duration: durationSec,
          masteryGained: sessionStats.masteryGained,
          completedAt: Date.now()
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, activeQueue.length, initialized, isSaved]);

  if (vaultLoading || !initialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground min-h-[50vh]">
        <LoadingSpinner className="w-8 h-8 mb-4 text-primary" />
        <p>Preparing your review session...</p>
      </div>
    );
  }

  // Empty States
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh] space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
          <BrainCircuit className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Vault is Empty</h2>
        <p className="text-muted-foreground max-w-md">Create your first question in a category to start building your knowledge vault.</p>
        <Button onClick={() => navigate('/vault')} className="mt-4">Return to Vault</Button>
      </div>
    );
  }

  if (activeQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh] space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">You're fully caught up.</h2>
        <p className="text-muted-foreground max-w-md">No questions are due for review right now. Great job staying on top of your learning!</p>
        <Button onClick={() => navigate('/vault')} className="mt-4">Return to Vault</Button>
      </div>
    );
  }

  // Completion State
  if (currentIndex >= activeQueue.length) {
    const totalAttempts = sessionStats.correct + sessionStats.hard + sessionStats.incorrect;
    const accuracy = totalAttempts > 0 ? Math.round((sessionStats.correct / totalAttempts) * 100) : 0;
    
    return (
      <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
        <div className="bg-card w-full rounded-xl shadow-2xl border flex flex-col relative overflow-hidden p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Session Complete</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-y py-8 my-4">
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-foreground">{sessionStats.reviewed}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Reviewed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-green-500">{sessionStats.correct}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Correct</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-amber-500">{sessionStats.hard}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Hard</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-red-500">{sessionStats.incorrect}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Incorrect</span>
            </div>
            <div className="flex flex-col">
              <span className={cn("text-4xl font-bold", sessionStats.masteryGained >= 0 ? "text-green-500" : "text-red-500")}>
                {sessionStats.masteryGained > 0 ? '+' : ''}{sessionStats.masteryGained}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Mastery Gained</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-blue-500">{accuracy}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Accuracy</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold text-foreground">{studyDuration}m</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2">Duration</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 mb-6 text-lg">
            <div className="flex items-center gap-2 font-semibold text-orange-500">
              <Flame className="h-6 w-6" /> Current Streak: {user?.studyStreak || (sessionStats.reviewed > 0 ? 1 : 0)}
            </div>
            <div className="flex items-center gap-2 font-semibold text-amber-500">
              <Trophy className="h-6 w-6" /> Best Streak: {user?.longestStudyStreak || (sessionStats.reviewed > 0 ? 1 : 0)}
            </div>
          </div>
          
          <Button onClick={() => navigate('/vault')} size="lg" className="w-full sm:w-auto mx-auto text-lg tracking-wide font-bold px-12 py-6 mt-4">
            Return to Vault
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
      lapsedThisSession: hasLapsedThisSession,
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

    try {
      await questionsService.updateQuestion(question.id, {
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
              insertIndex = next.length;
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
    } catch (err) {
      console.error("Failed to update question rating", err);
    } finally {
      setIsSaving(false);
    }
  };

  const safeType = question.type || 'concept_review';

  return (
    <div className="max-w-4xl mx-auto w-full py-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/vault')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Session
        </Button>
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 px-4 py-2 rounded-full">
          Card {currentIndex + 1} of {activeQueue.length}
        </div>
      </div>

      <div className="bg-card w-full rounded-xl shadow-2xl border flex flex-col relative overflow-hidden min-h-[60vh]">
        <div className="absolute top-0 left-0 h-1.5 bg-primary transition-all duration-500 ease-out z-10" style={{ width: `${Math.min(100, (currentIndex / activeQueue.length) * 100)}%` }} />
        
        <div className="p-8 sm:p-12 flex-1 flex flex-col relative">
          {isSaving && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <LoadingSpinner className="h-8 w-8 text-primary" />
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full border bg-muted/20 text-muted-foreground">
              {safeType.replace('_', ' ')}
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full border bg-primary/10 text-primary">
              Mastery {question.masteryScore || 0}%
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-medium mb-12 leading-relaxed text-foreground text-center flex-1 flex items-center justify-center">
            {question.question}
          </div>

          <div className="space-y-6 w-full max-w-2xl mx-auto">
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
                      onPaste={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}
                      onContextMenu={(e) => e.preventDefault()}
                      placeholder="Enter your exact answer..."
                      className="w-full p-6 text-xl bg-background border-2 border-input rounded-xl focus:outline-none focus:border-primary font-mono transition-colors text-center"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userInput.trim()) {
                          handleCheckAnswer();
                        }
                      }}
                    />
                    <Button 
                      className="w-full py-8 text-xl tracking-wide font-bold mt-4 shadow-lg" 
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
              <div className="space-y-4">
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
                        "w-full text-left p-6 rounded-xl border-2 transition-all text-lg sm:text-xl flex justify-between items-center",
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
                    className="w-full py-8 text-xl tracking-wide font-bold mt-6 shadow-lg" 
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
                className="w-full py-8 text-xl tracking-wide font-bold flex items-center justify-center gap-3 shadow-lg mt-auto" 
                onClick={() => setIsRevealed(true)}
              >
                <Eye className="h-6 w-6" />
                Reveal Answer
              </Button>
            )}
            {question.type === 'concept_review' && isRevealed && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">Correct Answer</h4>
                 <div className="p-8 bg-accent/30 rounded-xl text-xl sm:text-2xl text-foreground/90 whitespace-pre-wrap border border-border/50 text-center leading-relaxed">
                   {question.answer}
                 </div>
               </div>
            )}
          </div>

          {isRevealed && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12 w-full max-w-3xl mx-auto">
              <div className="space-y-6 pt-8 border-t">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-center">How well did you know this?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="py-8 border-red-500/30 hover:bg-red-500/10 hover:text-red-500 flex flex-col gap-2 h-auto text-lg"
                    onClick={() => handleRating('again')}
                    disabled={isSaving}
                  >
                    <span className="font-bold">Again</span>
                    <span className="text-sm opacity-60 font-normal">&lt; 1 min</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="py-8 border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500 flex flex-col gap-2 h-auto text-lg"
                    onClick={() => handleRating('hard')}
                    disabled={isSaving}
                  >
                    <span className="font-bold">Hard</span>
                    <span className="text-sm opacity-60 font-normal">1 day</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "py-8 border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500 flex flex-col gap-2 h-auto text-lg",
                      (question.type !== 'concept_review' && isCorrect === false) ? "opacity-50 cursor-not-allowed grayscale" : ""
                    )}
                    onClick={() => handleRating('good')}
                    disabled={isSaving || (question.type !== 'concept_review' && isCorrect === false)}
                  >
                    <span className="font-bold">Good</span>
                    <span className="text-sm opacity-60 font-normal">3 days</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "py-8 border-green-500/30 hover:bg-green-500/10 hover:text-green-500 flex flex-col gap-2 h-auto text-lg",
                      (question.type !== 'concept_review' && isCorrect === false) ? "opacity-50 cursor-not-allowed grayscale" : ""
                    )}
                    onClick={() => handleRating('easy')}
                    disabled={isSaving || (question.type !== 'concept_review' && isCorrect === false)}
                  >
                    <span className="font-bold">Easy</span>
                    <span className="text-sm opacity-60 font-normal">7 days</span>
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
