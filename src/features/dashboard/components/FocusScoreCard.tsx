import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Flame } from 'lucide-react';
import { useAnalytics } from '../../analytics/hooks/useAnalytics';
import { useFocusStore } from '../../../store/focusStore';
import { useAuth } from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export function FocusScoreCard() {
  const { targetCompletionPercentage, consistencyScore } = useAnalytics();
  const { currentSession, totalSessions, phase } = useFocusStore();
  const { user } = useAuth();
  
  const [openRatio, setOpenRatio] = useState(100);

  useEffect(() => {
    if (!user) return;
    const fetchQuestions = async () => {
      try {
        const qDocs = await getDocs(query(collection(db, 'questions'), where('userId', '==', user.uid)));
        const total = qDocs.size;
        if (total === 0) {
          setOpenRatio(100);
          return;
        }
        let openCount = 0;
        qDocs.forEach(doc => {
          if (doc.data().status === 'open') openCount++;
        });
        
        // Ratio: 100% means 0 open questions, 0% means all open questions
        const ratio = Math.max(0, Math.round(((total - openCount) / total) * 100));
        setOpenRatio(ratio);
      } catch (err) {
        console.error('Failed to fetch questions ratio', err);
      }
    };
    fetchQuestions();
  }, [user]);

  // Session completion (how far along are they in their current engine loop? or history vs targets?)
  // If they are in a session, currentSession / totalSessions. If not, maybe just 100 if completed?
  // Actually, we'll just check today's completed sessions vs total planned.
  // Wait, session completion could just be: did they finish the last session they started?
  const sessionCompletion = phase === 'completed' ? 100 : (phase === 'idle' ? 100 : Math.round((currentSession / totalSessions) * 100));

  // Weights: Target (40%), Consistency (30%), Open Ratio (20%), Session (10%)
  const rawScore = 
    (targetCompletionPercentage * 0.4) + 
    (consistencyScore * 0.3) + 
    (openRatio * 0.2) + 
    (sessionCompletion * 0.1);
  
  const finalScore = Math.min(100, Math.round(rawScore));

  let statusText = 'Needs Focus';
  let colorClass = 'text-red-500';
  let bgClass = 'bg-red-500/10';

  if (finalScore >= 90) {
    statusText = 'Elite Scholar';
    colorClass = 'text-purple-500';
    bgClass = 'bg-purple-500/10';
  } else if (finalScore >= 75) {
    statusText = 'On Track';
    colorClass = 'text-green-500';
    bgClass = 'bg-green-500/10';
  } else if (finalScore >= 50) {
    statusText = 'Building Momentum';
    colorClass = 'text-yellow-500';
    bgClass = 'bg-yellow-500/10';
  }

  return (
    <Card className="h-full border-primary/10 shadow-sm relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-50 ${bgClass}`} />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          <Flame className="h-4 w-4" />
          Focus Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className={`text-5xl font-black tracking-tighter ${colorClass}`}>
              {finalScore}%
            </span>
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              {statusText}
            </span>
          </div>
          
          <div className="flex flex-col gap-2 text-xs font-medium text-right text-muted-foreground">
            <div className="flex items-center justify-end gap-2">
              Daily Target: <span className="text-foreground">{targetCompletionPercentage}%</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              Consistency: <span className="text-foreground">{consistencyScore}%</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              Questions Answered: <span className="text-foreground">{openRatio}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
