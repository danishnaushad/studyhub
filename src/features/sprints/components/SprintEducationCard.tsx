import { useState, useEffect } from 'react';
import { Target, BookOpen, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';

export function SprintEducationCard() {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('sprintEducationExpanded');
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }
  }, []);

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem('sprintEducationExpanded', String(newState));
  };

  return (
    <Card className="border border-primary/20 bg-primary/5 mb-8 shadow-sm transition-all overflow-hidden">
      <div 
        className={cn(
          "flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-primary/10 transition-colors",
          isExpanded && "border-b border-primary/10"
        )}
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-full text-primary">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-primary">What Is A Sprint?</h3>
        </div>
        <button className="p-1 text-primary/70 hover:text-primary transition-colors">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <CardContent className="p-5 animate-in slide-in-from-top-4 fade-in duration-300">
          <p className="text-muted-foreground mb-5 text-sm md:text-base leading-relaxed max-w-3xl">
            A <strong>Sprint</strong> is a focused learning challenge. Instead of vaguely studying indefinitely, you set a strict, time-bound goal. 
            This creates urgency, forces you to track metrics, and accelerates your progress.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                <Target className="h-4 w-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">Certification Goal</span>
              </div>
              <p className="font-medium">Complete Cyber Security 101</p>
              <p className="text-xs text-muted-foreground mt-auto">Track by: Tasks Completed</p>
            </div>

            <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">Volume Goal</span>
              </div>
              <p className="font-medium">Read 500 Pages of Documentation</p>
              <p className="text-xs text-muted-foreground mt-auto">Track by: Pages/Cards</p>
            </div>

            <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-500 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">Time Goal</span>
              </div>
              <p className="font-medium">Code 40 Hours This Month</p>
              <p className="text-xs text-muted-foreground mt-auto">Track by: Hours Focused</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
