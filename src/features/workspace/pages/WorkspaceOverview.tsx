import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useResources } from '../hooks/useResources';
import { useNotes } from '../hooks/useNotes';
import { useQuestions } from '../hooks/useQuestions';
import { BookOpen, FileText, HelpCircle, AlertCircle, FolderDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor } from '../../../lib/colors';


export function WorkspaceOverview() {
  const { category } = useWorkspace();
  const navigate = useNavigate();
  
  const { resources } = useResources(category.id);
  const { notes } = useNotes(category.id);
  const { questions } = useQuestions(category.id);

  const cardsToReview = questions.filter(q => {
    if (q.status === 'mastered') return false;
    return !q.nextReview || q.nextReview <= Date.now();
  });

  const summaryCards = [
    {
      title: 'Resources',
      count: resources.length,
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      onClick: () => navigate(`/category/${category.id}/resources`),
      color: 'bg-purple-500/10'
    },
    {
      title: 'Notes',
      count: notes.length,
      icon: <FileText className="h-5 w-5 text-blue-500" />,
      onClick: () => navigate(`/category/${category.id}/notes`),
      color: 'bg-blue-500/10'
    },
    {
      title: 'Knowledge Cards',
      count: questions.length,
      icon: <HelpCircle className="h-5 w-5 text-green-500" />,
      onClick: () => navigate(`/category/${category.id}/questions`),
      color: 'bg-green-500/10'
    },
    {
      title: 'Cards to Review',
      count: cardsToReview.length,
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      onClick: () => navigate(`/category/${category.id}/questions?filter=review`),
      color: 'bg-orange-500/10'
    },
    {
      title: 'Projects',
      count: 0,
      icon: <FolderDot className="h-5 w-5 text-muted-foreground" />,
      onClick: () => navigate(`/category/${category.id}/projects`),
      color: 'bg-muted/30'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">
            Welcome to your <span style={{ color: getCategoryColor(category.color) }} className="font-semibold">{category.name}</span> workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Card 
            key={card.title} 
            className="hover:shadow-md transition-all cursor-pointer group"
            onClick={card.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
