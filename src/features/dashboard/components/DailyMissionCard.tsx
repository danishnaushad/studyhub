import { CheckCircle2, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { useFocusStore } from '../../../store/focusStore';
import { useCategories } from '../../../hooks/useCategories';
import { getCategoryColor } from '../../../lib/colors';


export function DailyMissionCard() {
  const { history } = useFocusStore();
  const { categories } = useCategories();
  
  // Show only today's history or top 5
  const recentHistory = history.slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
          <History className="h-4 w-4" />
          Mission History
        </CardTitle>
        <span className="text-sm text-muted-foreground font-medium">
          {history.length} completed
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {recentHistory.length === 0 ? (
            <div className="text-sm text-muted-foreground italic text-center py-4">
              No missions completed yet. Start a focus session!
            </div>
          ) : (
            recentHistory.map((session) => (
              <div key={session.id} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col w-full border border-border/50 rounded-lg p-3 bg-muted/20">
                    <span className="text-sm font-bold text-foreground mb-2">
                      {session.activity}
                    </span>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                      {session.categoryId && categories.find(c => c.id === session.categoryId) && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Category</span>
                          <span className="font-semibold" style={{ color: getCategoryColor(categories.find(c => c.id === session.categoryId)?.color) }}>
                            {categories.find(c => c.id === session.categoryId)?.name}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Mode</span>
                        <span className="font-medium text-foreground">
                          {session.mode.charAt(0).toUpperCase() + session.mode.slice(1).replace('_', ' ')}
                        </span>
                      </div>

                      {session.totalSessions && session.totalSessions > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Sessions</span>
                          <span className="font-medium text-foreground">
                            {session.completedSessions} / {session.totalSessions}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex flex-col">
                        <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Duration</span>
                        <span className="font-medium text-foreground">
                          {
                            session.durationCompleted < 60 
                              ? `${Math.round(session.durationCompleted)}s` 
                              : `${Math.floor(session.durationCompleted / 60)}m${Math.round(session.durationCompleted % 60) > 0 ? ` ${Math.round(session.durationCompleted % 60)}s` : ''}`
                          }
                        </span>
                      </div>

                      <div className="flex flex-col col-span-2 mt-1">
                        <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Completed</span>
                        <span className="font-medium text-foreground">
                          {new Date(session.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
