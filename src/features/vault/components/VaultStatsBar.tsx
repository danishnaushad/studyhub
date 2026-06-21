import { BrainCircuit, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';

interface VaultStatsBarProps {
  total: number;
  dueToday: number;
  newCards: number;
  learningCards: number;
  improvingCards: number;
  strongCards: number;
  masteredCards: number;
}

export function VaultStatsBar({ total, dueToday, newCards, learningCards, improvingCards, strongCards, masteredCards }: VaultStatsBarProps) {
  const stats = [
    { label: 'Total', value: total, icon: <BookOpen className="h-4 w-4" />, color: 'text-foreground', bg: 'bg-accent/30' },
    { label: 'Due Today', value: dueToday, icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500', bg: 'bg-red-500/10 border border-red-500/20' },
    { label: 'New', value: newCards, icon: null, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    { label: 'Learning', value: learningCards, icon: null, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Improving', value: improvingCards, icon: <BrainCircuit className="h-4 w-4" />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Strong', value: strongCards, icon: <Sparkles className="h-4 w-4" />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Mastered', value: masteredCards, icon: null, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center p-3 rounded-lg ${stat.bg} hover:scale-[1.02] transition-transform`}
            >
              {stat.icon && <span className={`${stat.color} mb-1`}>{stat.icon}</span>}
              <span className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
