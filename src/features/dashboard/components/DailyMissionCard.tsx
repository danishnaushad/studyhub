import { CheckCircle2, Circle, Flag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { cn } from '../../../lib/utils';

// Placeholder data structure for future use
const missions = [
  { id: 1, title: 'Complete first Study Session', completed: false },
  { id: 2, title: 'Add a new learning resource', completed: false },
  { id: 3, title: 'Review your Categories', completed: true },
];

export function DailyMissionCard() {
  const completedCount = missions.filter(m => m.completed).length;
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <Flag className="h-4 w-4" />
          Daily Missions
        </CardTitle>
        <span className="text-sm text-muted-foreground font-medium">
          {completedCount} / {missions.length}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {missions.map((mission) => (
            <div key={mission.id} className="flex items-start gap-3">
              {mission.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <span className={cn(
                "text-sm font-medium",
                mission.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
              )}>
                {mission.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
