import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { BrainCircuit, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAllQuestions } from '../../workspace/hooks/useQuestions';

export function QuestionsAnalyticsWidget() {
  const { questions, loading } = useAllQuestions();

  const stats = useMemo(() => {
    if (!questions) return { total: 0, dueToday: 0, mastered: 0, masteryPercentage: 0 };
    
    const total = questions.length;
    const mastered = questions.filter(q => q.status === 'mastered').length;
    const learning = questions.filter(q => q.status === 'learning').length;
    
    const now = Date.now();
    const dueToday = questions.filter(q => {
      if (q.status === 'mastered') return false;
      return !q.nextReview || q.nextReview <= now;
    }).length;

    const masteryPercentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return { total, learning, dueToday, mastered, masteryPercentage };
  }, [questions]);

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[160px] animate-pulse">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <BrainCircuit className="h-6 w-6 opacity-50" />
          <p className="text-sm">Loading trainer data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group transition-all hover:border-primary/30 h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <BrainCircuit className="h-4 w-4 text-primary" />
          Knowledge Trainer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4 mt-2">
          <div>
            <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
              {stats.masteryPercentage}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total Mastery</p>
          </div>
          
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center relative bg-accent/50">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary"
                strokeDasharray={`${stats.masteryPercentage * 1.25} 125`}
              />
            </svg>
            <BrainCircuit className="h-5 w-5 text-primary relative z-10" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-4 border-border/50">
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-md bg-accent/30 hover:bg-accent/50 transition-colors">
            <BookOpen className="h-4 w-4 text-blue-500 mb-1" />
            <span className="text-lg font-semibold font-mono">{stats.total}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cards</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-md bg-purple-500/10 hover:bg-purple-500/20 transition-colors border border-purple-500/20">
            <BrainCircuit className="h-4 w-4 text-purple-500 mb-1" />
            <span className="text-lg font-semibold font-mono text-purple-500">{stats.learning}</span>
            <span className="text-[10px] text-purple-500/80 uppercase tracking-wider">Learning</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500 mb-1" />
            <span className="text-lg font-semibold font-mono text-red-500">{stats.dueToday}</span>
            <span className="text-[10px] text-red-500/80 uppercase tracking-wider">Review</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center p-2 rounded-md bg-green-500/10 hover:bg-green-500/20 transition-colors border border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
            <span className="text-lg font-semibold font-mono text-green-500">{stats.mastered}</span>
            <span className="text-[10px] text-green-500/80 uppercase tracking-wider">Mastered</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
