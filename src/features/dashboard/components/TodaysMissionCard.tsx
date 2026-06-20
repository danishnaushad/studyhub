import { useEffect, useState } from 'react';
import { Target, HelpCircle, BookOpen, CheckCircle2, Circle, ArrowRight, Rocket } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useCategories } from '../../../hooks/useCategories';
import { useFocusStore } from '../../../store/focusStore';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface MissionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  isCompleted: boolean;
  actionText?: string;
  onClick?: () => void;
  priority: number;
}

export function TodaysMissionCard() {
  const { categories } = useCategories();
  const { focusMinutesToday, categoryProgress, history } = useFocusStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<MissionItem[]>([]);

  useEffect(() => {
    if (!user || categories.length === 0) return;

    const fetchMissions = async () => {
      const newMissions: MissionItem[] = [];

      // 1. Daily Target Mission
      const totalTargetMinutes = categories.reduce((sum, cat) => sum + (cat.targetMinutes || 0), 0);
      const isTargetMet = focusMinutesToday >= totalTargetMinutes && totalTargetMinutes > 0;
      
      newMissions.push({
        id: 'global-target',
        icon: <Target className={`h-4 w-4 ${isTargetMet ? 'text-green-500' : 'text-orange-500'}`} />,
        title: isTargetMet ? 'Daily focus target reached' : `Reach daily focus target (${focusMinutesToday}/${totalTargetMinutes}m)`,
        isCompleted: isTargetMet,
        actionText: isTargetMet ? undefined : 'Focus Now',
        onClick: isTargetMet ? undefined : () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        priority: 100
      });

      // 2. Open Questions Mission
      try {
        const q = query(collection(db, 'questions'), where('userId', '==', user.uid), where('status', '==', 'open'));
        const snapshot = await getDocs(q);
        const count = snapshot.size;
        const hasOpen = count > 0;
        
        newMissions.push({
          id: 'open-questions',
          icon: <HelpCircle className={`h-4 w-4 ${!hasOpen ? 'text-green-500' : 'text-blue-500'}`} />,
          title: hasOpen ? `Answer ${count} open question${count > 1 ? 's' : ''}` : 'All questions answered',
          isCompleted: !hasOpen,
          actionText: hasOpen ? 'Review' : undefined,
          onClick: hasOpen ? () => {
            const firstDoc = snapshot.docs[0].data();
            const cat = categories.find(c => c.id === firstDoc.categoryId);
            if (cat) navigate(`/category/${cat.id}/questions?filter=open`);
            else navigate('/categories');
          } : undefined,
          priority: 90
        });
      } catch (err) {
        console.error('Failed to fetch open questions', err);
      }

      // 3. Specific Category Target Mission
      const behindCategories = categories.filter(cat => {
        const target = cat.targetMinutes || 0;
        if (target === 0) return false;
        const progressMins = Math.floor((categoryProgress[cat.id] || 0) / 60);
        return progressMins < target;
      });

      behindCategories.sort((a, b) => {
        const remA = (a.targetMinutes || 0) - Math.floor((categoryProgress[a.id] || 0) / 60);
        const remB = (b.targetMinutes || 0) - Math.floor((categoryProgress[b.id] || 0) / 60);
        return remB - remA;
      });

      if (behindCategories.length > 0) {
        const cat = behindCategories[0];
        const remaining = (cat.targetMinutes || 0) - Math.floor((categoryProgress[cat.id] || 0) / 60);
        newMissions.push({
          id: `continue-${cat.id}`,
          icon: <BookOpen className="h-4 w-4 text-purple-500" />,
          title: `Complete ${cat.name} target (${remaining}m left)`,
          isCompleted: false,
          actionText: 'Continue',
          onClick: () => {
            window.dispatchEvent(new CustomEvent('study-os:select-category', { detail: cat.id }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          priority: 80
        });
      } else if (categories.some(c => (c.targetMinutes || 0) > 0)) {
        newMissions.push({
          id: `all-categories-met`,
          icon: <BookOpen className="h-4 w-4 text-green-500" />,
          title: 'All category targets completed',
          isCompleted: true,
          priority: 80
        });
      }

      setMissions(newMissions.sort((a, b) => b.priority - a.priority));
    };

    fetchMissions();
  }, [user, categories, focusMinutesToday, categoryProgress, history, navigate]);

  const completedCount = missions.filter(m => m.isCompleted).length;
  const progressPercentage = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;

  if (missions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-primary">
          <Rocket className="h-4 w-4" />
          Today's Mission
        </CardTitle>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {completedCount} / {missions.length} Completed
        </span>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="w-full bg-secondary h-2 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="space-y-2">
          {missions.map(mission => (
            <div 
              key={mission.id} 
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                mission.isCompleted ? 'bg-muted/50 border-transparent opacity-75' : 'bg-card/80 border-border hover:bg-accent/50 cursor-pointer group'
              }`}
              onClick={mission.onClick}
            >
              <div className="flex items-center gap-3">
                {mission.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <h4 className={`text-sm font-semibold ${mission.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {mission.title}
                  </h4>
                </div>
              </div>
              
              {!mission.isCompleted && mission.actionText && (
                <div className="flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {mission.actionText} <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
