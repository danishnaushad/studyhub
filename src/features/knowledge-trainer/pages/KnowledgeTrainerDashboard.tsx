import { useNavigate } from 'react-router-dom';
import { 
  Brain, Zap, Trophy, TrendingUp, Calendar, Clock, 
  CheckCircle2, Target, BookOpen, Layers, Flame
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useVault } from '../../vault/hooks/useVault';
import { useStudySessions } from '../hooks/useStudySessions';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export function KnowledgeTrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, stats, categoryStats, loading: vaultLoading } = useVault();
  const { sessions, loading: sessionsLoading } = useStudySessions();

  if (vaultLoading || sessionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground min-h-[50vh]">
        <LoadingSpinner className="w-8 h-8 mb-4 text-primary" />
        <p>Initializing Knowledge Engine...</p>
      </div>
    );
  }

  // --- Computations ---
  const dueToday = stats.dueToday;
  const newCards = questions.filter(q => q.status === 'learning' && q.reviewCount === 0).length;
  const learningCards = questions.filter(q => q.status === 'learning' && q.reviewCount > 0).length;
  const masteredCards = stats.masteredCards;
  const reviewCards = questions.length - newCards - learningCards - masteredCards;

  // Mastery Levels (using 0-100 score ranges for finer breakdown)
  const masteryNew = newCards;
  const masteryLearning = learningCards;
  const masteryImproving = questions.filter(q => (q.masteryScore || 0) >= 40 && (q.masteryScore || 0) < 70 && q.status !== 'mastered').length;
  const masteryStrong = questions.filter(q => (q.masteryScore || 0) >= 70 && q.status !== 'mastered').length;
  const masteryMastered = masteredCards;

  // Retention Stats
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

  const reviewedToday = sessions
    .filter(s => s.completedAt >= todayStart.getTime())
    .reduce((sum, s) => sum + s.cardsReviewed, 0);

  const reviewedWeekly = sessions
    .filter(s => s.completedAt >= weekStart.getTime())
    .reduce((sum, s) => sum + s.cardsReviewed, 0);

  const reviewedMonthly = sessions
    .filter(s => s.completedAt >= monthStart.getTime())
    .reduce((sum, s) => sum + s.cardsReviewed, 0);

  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Trainer</h1>
          <p className="text-sm text-muted-foreground">Advanced global review engine tracking your retention and mastery across all categories.</p>
        </div>
      </div>

      {/* SECTION 2: Daily Study (Hero) */}
      <Card className="overflow-hidden border-primary/20 shadow-md">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-br from-background to-primary/5">
          <div className="flex-1 text-center sm:text-left space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Daily Study Session</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              {dueToday > 0 
                ? `You have ${dueToday} cards due for review across your entire vault. Keep your streak alive!`
                : "You're all caught up! You can still launch a session to review ahead of schedule."}
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/vault/review')}
              className="text-lg tracking-wide font-bold px-8 py-6 h-auto shadow-xl hover:scale-[1.02] transition-transform w-full sm:w-auto"
            >
              <Zap className="h-6 w-6 mr-2" />
              Start Daily Session
            </Button>
          </div>
          <div className="shrink-0 flex items-center justify-center p-6 bg-background rounded-full shadow-inner border border-border/50 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            <Brain className="h-20 w-20 text-primary relative z-10" />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 1: Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center justify-center space-y-2">
            <Target className="h-6 w-6 text-red-500 mb-1" />
            <span className="text-3xl font-bold text-foreground">{dueToday}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Due Today</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center justify-center space-y-2">
            <Layers className="h-6 w-6 text-blue-500 mb-1" />
            <span className="text-3xl font-bold text-foreground">{newCards}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">New Cards</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center justify-center space-y-2">
            <TrendingUp className="h-6 w-6 text-amber-500 mb-1" />
            <span className="text-3xl font-bold text-foreground">{learningCards}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Learning</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center justify-center space-y-2">
            <BookOpen className="h-6 w-6 text-indigo-500 mb-1" />
            <span className="text-3xl font-bold text-foreground">{reviewCards}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Reviewing</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center justify-center space-y-2">
            <CheckCircle2 className="h-6 w-6 text-green-500 mb-1" />
            <span className="text-3xl font-bold text-foreground">{masteredCards}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mastered</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 3: Mastery Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Mastery Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" strokeWidth="12" className="stroke-muted/20" />
                  <circle
                    cx="60" cy="60" r="52"
                    fill="none" strokeWidth="12"
                    className="stroke-primary"
                    strokeDasharray={`${stats.avgMastery * 3.267} 326.7`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-mono text-primary">{stats.avgMastery}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">Global</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">New</span>
                <span className="font-bold">{masteryNew}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-amber-500 font-medium">Learning</span>
                <span className="font-bold">{masteryLearning}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-500 font-medium">Improving</span>
                <span className="font-bold">{masteryImproving}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-500 font-medium">Strong</span>
                <span className="font-bold">{masteryStrong}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="text-green-500 font-bold">Mastered</span>
                <span className="font-bold">{masteryMastered}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4 & 6: Retention Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center justify-center space-y-1">
                <span className="text-2xl font-bold text-foreground">{reviewedToday}</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Today's Cards</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center justify-center space-y-1">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="h-4 w-4" />
                  <span className="text-2xl font-bold">{user?.studyStreak || 0}</span>
                </div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Review Streak</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center justify-center space-y-1">
                <span className="text-2xl font-bold text-foreground">{reviewedWeekly}</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Weekly Cards</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center justify-center space-y-1">
                <span className="text-2xl font-bold text-foreground">{reviewedMonthly}</span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Monthly Cards</span>
              </CardContent>
            </Card>
          </div>

          <Card className="flex-1 h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No review sessions completed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/50 gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="p-2 bg-background rounded-md shadow-sm border">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {new Date(session.completedAt).toLocaleDateString()} at {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {session.duration >= 60 ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : `${session.duration}s`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-center">
                          <p className="text-sm font-bold">{session.cardsReviewed}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cards</p>
                        </div>
                        <div className="text-center">
                          <p className={session.accuracy >= 80 ? "text-sm font-bold text-green-500" : "text-sm font-bold text-amber-500"}>{session.accuracy}%</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Accuracy</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 5: Knowledge Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Knowledge Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No categories with cards found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryStats.map(cat => (
                <div key={cat.id} className="flex flex-col space-y-3 p-4 rounded-xl border bg-card hover:bg-accent/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground truncate max-w-[200px]" style={{ color: cat.color }}>
                      {cat.name}
                    </h3>
                    <span className="text-sm font-bold text-muted-foreground">{cat.avgMastery}% Mastery</span>
                  </div>
                  
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${cat.avgMastery}%`,
                        backgroundColor: cat.avgMastery >= 90 ? '#22c55e' : cat.color 
                      }} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>{cat.total} Cards</span>
                    <span className="flex items-center gap-3">
                      {cat.dueNow > 0 && <span className="text-red-500 flex items-center gap-1"><Zap className="h-3 w-3" />{cat.dueNow} Due</span>}
                      <span>{cat.mastered} Mastered</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
