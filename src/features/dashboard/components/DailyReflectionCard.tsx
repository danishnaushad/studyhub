import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getReflection, saveReflection } from '../services/reflection.service';

export function DailyReflectionCard() {
  const { user } = useAuth();
  const [learned, setLearned] = useState('');
  const [confused, setConfused] = useState('');
  const [nextStudy, setNextStudy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    const loadReflection = async () => {
      const data = await getReflection(user.uid, todayStr);
      if (data) {
        setLearned(data.learned);
        setConfused(data.confused);
        setNextStudy(data.nextStudy);
        setIsSaved(true);
      }
      setIsLoaded(true);
    };
    loadReflection();
  }, [user, todayStr]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await saveReflection(user.uid, todayStr, { learned, confused, nextStudy });
      setIsSaved(true);
      // Flash saved state, then we can leave it as is
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save reflection', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <Card className="shadow-sm border-primary/10">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-medium flex items-center gap-2 uppercase tracking-wider text-primary">
          <BookOpen className="h-4 w-4" />
          Daily Reflection
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground">What did I learn today?</label>
          <textarea
            className="w-full min-h-[80px] p-2 text-sm bg-background border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="Summarize your key takeaways..."
            value={learned}
            onChange={(e) => { setLearned(e.target.value); setIsSaved(false); }}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground">What confused me today?</label>
          <textarea
            className="w-full min-h-[80px] p-2 text-sm bg-background border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="Any blockers or concepts you struggled with..."
            value={confused}
            onChange={(e) => { setConfused(e.target.value); setIsSaved(false); }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground">What should I study tomorrow?</label>
          <textarea
            className="w-full min-h-[60px] p-2 text-sm bg-background border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="Set your intention for tomorrow..."
            value={nextStudy}
            onChange={(e) => { setNextStudy(e.target.value); setIsSaved(false); }}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || (isSaved && learned.length > 0)}
            className="w-full sm:w-auto"
          >
            {isSaving ? 'Saving...' : isSaved ? (
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Saved</span>
            ) : 'Save Reflection'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
