import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, Activity, ArrowRight, Zap, PlayCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useSprints } from '../../sprints/hooks/useSprints';
import { useCategories } from '../../../hooks/useCategories';
import { getCategoryColor } from '../../../lib/colors';


export function ActiveSprintCard() {
  const navigate = useNavigate();
  const { sprints } = useSprints();
  const { categories } = useCategories();

  const activeSprint = useMemo(() => {
    const active = sprints.filter(s => s.status === 'active');
    if (active.length === 0) return null;
    
    // Sort by most urgent (closest targetDate)
    return active.sort((a, b) => a.targetDate - b.targetDate)[0];
  }, [sprints]);

  if (!activeSprint) {
    return (
      <div className="p-6 bg-card border rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">No Active Sprints</h3>
            <p className="text-muted-foreground text-sm mt-1">Set a goal and sprint towards it to accelerate your learning.</p>
          </div>
        </div>
        <Button onClick={() => navigate('/sprints')} className="relative z-10 shrink-0 shadow-md transition-transform hover:scale-105">
          <Zap className="mr-2 h-4 w-4" />
          Create Sprint
        </Button>
      </div>
    );
  }

  const category = categories.find(c => c.id === activeSprint.categoryId);
  const totalTarget = activeSprint.targetValue;
  const current = activeSprint.currentValue;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((current - activeSprint.initialValue) / totalTarget) * 100)));
  
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.ceil((activeSprint.targetDate - now) / (1000 * 60 * 60 * 24)));
  
  const remainingValue = Math.max(0, totalTarget - (current - activeSprint.initialValue));
  const dailyRequirementRaw = daysRemaining > 0 ? remainingValue / daysRemaining : remainingValue;
  
  let formattedDaily = '';
  if (activeSprint.metric === 'hours') {
    const mins = Math.ceil(dailyRequirementRaw * 60);
    formattedDaily = `${mins} Minutes`;
  } else if (activeSprint.metric === 'cards') {
    formattedDaily = `${Math.ceil(dailyRequirementRaw)} Cards`;
  } else {
    formattedDaily = `${Math.ceil(dailyRequirementRaw)} Tasks`;
  }

  return (
    <div className="p-6 bg-card border border-primary/20 rounded-xl shadow-lg relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Target className="h-32 w-32" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Active Sprint
              </span>
              <span className="text-xs font-medium text-muted-foreground border px-2 py-0.5 rounded-full bg-background/50 capitalize">
                {activeSprint.sprintType}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mt-2">{activeSprint.name}</h3>
            {category && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(category.color) }} />
                {category.name}
              </p>
            )}
          </div>
          
          <Button 
            size="lg" 
            onClick={() => navigate(`/category/${activeSprint.categoryId}/overview`)}
            className="w-full sm:w-auto shadow-md transition-all hover:scale-[1.02] bg-primary text-primary-foreground font-bold"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Continue Sprint
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-background/50 rounded-lg p-4 border border-border/50 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Days Left
            </span>
            <span className="text-2xl font-bold">{daysRemaining}</span>
          </div>
          
          <div className="flex flex-col border-l border-border/50 pl-4">
            <span className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> Required Today
            </span>
            <span className="text-2xl font-bold text-orange-500">{formattedDaily}</span>
          </div>
          
          <div className="flex flex-col border-l border-border/50 pl-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Progress
            </span>
            <span className="text-2xl font-bold text-blue-500">{progressPercent}%</span>
          </div>

          <div className="flex flex-col border-l border-border/50 pl-4 justify-center items-end pr-2">
            <button 
              onClick={() => navigate('/sprints')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              View Details <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
