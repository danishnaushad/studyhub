import { useEffect, useState } from 'react';
import { Sparkles, HelpCircle, Target, ArrowRight, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useCategories } from '../../../hooks/useCategories';
import { useFocusStore } from '../../../store/focusStore';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../../../lib/colors';


interface ActionItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onClick: () => void;
  priority: number;
}

export function NextActionsCard() {
  const { categories } = useCategories();
  const { categoryProgress, history } = useFocusStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>([]);

  useEffect(() => {
    if (!user || categories.length === 0) return;

    const fetchActions = async () => {
      const newActions: ActionItem[] = [];

      // 1. Continue Category Behind Target
      const behindCategories = categories.filter(cat => {
        const target = cat.targetMinutes || 0;
        if (target === 0) return false;
        const progressMins = Math.floor((categoryProgress[cat.id] || 0) / 60);
        return progressMins < target;
      });

      behindCategories.sort((a, b) => {
        const remA = (a.targetMinutes || 0) - Math.floor((categoryProgress[a.id] || 0) / 60);
        const remB = (b.targetMinutes || 0) - Math.floor((categoryProgress[b.id] || 0) / 60);
        return remB - remA; // largest remaining first
      });

      if (behindCategories.length > 0) {
        const cat = behindCategories[0];
        const remaining = (cat.targetMinutes || 0) - Math.floor((categoryProgress[cat.id] || 0) / 60);
        newActions.push({
          id: `continue-${cat.id}`,
          icon: <Target className="h-4 w-4" style={{ color: getCategoryColor(cat.color) }} />,
          title: `Continue ${cat.name}`,
          description: `${remaining} minutes remaining today.`,
          actionText: `Continue ${cat.name}`,
          onClick: () => {
            window.dispatchEvent(new CustomEvent('study-os:select-category', { detail: cat.id }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          priority: 100
        });
      }

      // 2. Review Open Questions
      try {
        const q = query(collection(db, 'questions'), where('userId', '==', user.uid), where('status', '==', 'open'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const firstDoc = snapshot.docs[0].data();
          const cat = categories.find(c => c.id === firstDoc.categoryId);
          const count = snapshot.size;
          newActions.push({
            id: 'open-questions',
            icon: <HelpCircle className="h-4 w-4 text-blue-500" />,
            title: `Review Open Questions`,
            description: `You have ${count} unresolved question${count > 1 ? 's' : ''}${cat ? ` in ${cat.name}` : ''}.`,
            actionText: 'Review Questions',
            onClick: () => {
              if (cat) navigate(`/category/${cat.id}/questions?filter=open`);
              else navigate('/categories');
            },
            priority: 90
          });
        }
      } catch (err) {
        console.error('Failed to fetch open questions', err);
      }

      // Find active category context for Notes/Questions prompts
      const lastSession = history.length > 0 ? history[history.length - 1] : null;
      const activeCat = lastSession ? categories.find(c => c.id === lastSession.categoryId) : categories[0];

      if (activeCat) {
        // 3. Create Notes
        newActions.push({
          id: 'create-notes',
          icon: <FileText className="h-4 w-4 text-purple-500" />,
          title: `Create Notes`,
          description: `Summarize what you learned in ${activeCat.name}.`,
          actionText: 'Create Note',
          onClick: () => navigate(`/category/${activeCat.id}/notes`),
          priority: 80
        });

        // 4. Create Questions
        newActions.push({
          id: 'create-questions',
          icon: <HelpCircle className="h-4 w-4 text-green-500" />,
          title: `Any Doubts?`,
          description: `Log new questions for ${activeCat.name}.`,
          actionText: 'Create Question',
          onClick: () => navigate(`/category/${activeCat.id}/questions`),
          priority: 70
        });
      }

      // 5. Start Session (Fallback)
      newActions.push({
        id: 'start-session-fallback',
        icon: <Sparkles className="h-4 w-4 text-orange-500" />,
        title: 'Ready to Focus?',
        description: 'Start a new session to build your streak.',
        actionText: 'Start Session',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        priority: 10
      });

      setActions(newActions.sort((a, b) => b.priority - a.priority));
    };

    fetchActions();
  }, [user, categories, categoryProgress, history, navigate]);

  if (actions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" />
          Study Coach
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.slice(0, 3).map(action => (
            <div key={action.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors group cursor-pointer" onClick={action.onClick}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-full border shadow-sm">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {action.actionText} <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
