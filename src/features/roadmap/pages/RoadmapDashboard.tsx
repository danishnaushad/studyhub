import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ROADMAP_MODULES, CURRENT_FOCUS, PRODUCT_HEALTH } from '../utils/roadmapData';
import type { ModuleStatus } from '../utils/roadmapData';
import { Rocket, Target, CheckCircle2, Clock, GitPullRequest, Activity, ChevronRight, LayoutList, CheckCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

function StatusBadge({ status }: { status: ModuleStatus }) {
  const getStatusConfig = (status: ModuleStatus) => {
    switch (status) {
      case 'Frozen': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Stable': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Planning':
      case 'Architecture Approved': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Not Started':
      case 'Future': return 'bg-muted/50 text-muted-foreground border-border/50';
      default: return 'bg-muted/50 text-muted-foreground border-border/50';
    }
  };

  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', getStatusConfig(status))}>
      {status}
    </span>
  );
}

export function RoadmapDashboard() {
  const builtModules = ROADMAP_MODULES.filter(m => m.status === 'Frozen' || m.status === 'Stable' || m.progress === 100).length;
  const inProgressModules = ROADMAP_MODULES.filter(m => m.status === 'In Progress').length;
  const plannedModules = ROADMAP_MODULES.filter(m => m.status === 'Planning' || m.status === 'Architecture Approved' || m.status === 'Future').length;
  const frozenModules = ROADMAP_MODULES.filter(m => m.status === 'Frozen').length;
  
  const overallProgress = Math.round(ROADMAP_MODULES.reduce((acc, m) => acc + m.progress, 0) / ROADMAP_MODULES.length);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16 max-w-[1400px] mx-auto">
      
      {/* SECTION 1: Product Overview Hero */}
      <section>
        <Card disableSurface className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">Danish Study OS</h1>
                </div>
                <p className="text-muted-foreground text-lg">Central command & roadmap overview.</p>
              </div>
              
              <div className="flex flex-col items-end w-full lg:w-auto">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Overall Completion</span>
                <div className="flex items-end gap-3 w-full lg:w-auto">
                  <span className="text-6xl font-black tracking-tighter text-primary">{overallProgress}%</span>
                  <div className="w-full lg:w-48 h-3 bg-muted/50 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Built</span>
                <span className="text-2xl font-black">{builtModules} <span className="text-sm font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">In Progress</span>
                <span className="text-2xl font-black">{inProgressModules} <span className="text-sm font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Planned</span>
                <span className="text-2xl font-black">{plannedModules} <span className="text-sm font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-4 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Frozen</span>
                <span className="text-2xl font-black">{frozenModules} <span className="text-sm font-medium text-muted-foreground">Modules</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* SECTION 2: Current Development Focus */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-bold tracking-tight">Current Development Focus</h3>
            </div>
            
            <Card disableSurface className="border-amber-500/30 shadow-md bg-amber-500/5 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-amber-300" />
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black">{CURRENT_FOCUS.module}</h2>
                      <StatusBadge status="In Progress" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 rounded-md text-xs font-bold uppercase">{CURRENT_FOCUS.phase}</span>
                      {CURRENT_FOCUS.description}
                    </p>
                  </div>
                  
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg">
                    Continue Development
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Completed
                    </h4>
                    <ul className="space-y-2">
                      {CURRENT_FOCUS.completed.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 opacity-70" />
                          <span className="line-through opacity-70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Pending
                    </h4>
                    <ul className="space-y-2">
                      {CURRENT_FOCUS.pending.map(item => (
                        <li key={item} className="flex items-center gap-2 text-sm font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 3: Core Product Roadmap */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <LayoutList className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">Core Product Roadmap</h3>
            </div>
            
            <div className="grid gap-4">
              {ROADMAP_MODULES.map(module => (
                <Card key={module.id} disableSurface className="border-border/50 group hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg leading-none truncate">{module.name}</h4>
                          <StatusBadge status={module.status} />
                        </div>
                        
                        {/* Submodules rendering */}
                        {module.submodules && module.submodules.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {module.submodules.map((sub, i) => (
                              <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/50">
                                {sub}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full sm:w-48 shrink-0 flex flex-col items-end gap-1.5">
                        <span className="text-sm font-bold font-mono text-muted-foreground">{module.progress}%</span>
                        <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              module.progress === 100 ? 'bg-green-500' : 
                              module.status === 'In Progress' ? 'bg-amber-500' : 'bg-primary'
                            }`}
                            style={{ width: `${module.progress}%` }} 
                          />
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* SECTION 4: Development Timeline */}
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-blue-500" />
              Timeline
            </h3>
            
            <Card disableSurface className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-amber-500 before:to-muted">
                  
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 shrink-0 border-4 border-card flex items-center justify-center z-10">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="pt-1 w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">Completed</h4>
                      <div className="space-y-2 bg-card border border-border/50 rounded-xl p-3 shadow-sm">
                        {ROADMAP_MODULES.filter(m => m.status === 'Frozen' || m.status === 'Stable').map(m => (
                          <div key={m.id} className="text-sm font-medium">{m.name}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 shrink-0 border-4 border-card z-10" />
                    <div className="pt-1 w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">Current Focus</h4>
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 shadow-sm">
                        <div className="text-sm font-bold text-amber-600">{CURRENT_FOCUS.module}</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary shrink-0 border-4 border-card z-10" />
                    <div className="pt-1 w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Upcoming</h4>
                      <div className="space-y-2 bg-card border border-border/50 rounded-xl p-3 shadow-sm">
                        {ROADMAP_MODULES.filter(m => m.status === 'Planning' || m.status === 'Architecture Approved').map(m => (
                          <div key={m.id} className="text-sm font-medium">{m.name}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-muted shrink-0 border-4 border-card z-10" />
                    <div className="pt-1 w-full">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Future</h4>
                      <div className="space-y-2 bg-card border border-border/50 rounded-xl p-3 shadow-sm opacity-60">
                        {ROADMAP_MODULES.filter(m => m.status === 'Future').slice(0, 5).map(m => (
                          <div key={m.id} className="text-sm">{m.name}</div>
                        ))}
                        <div className="text-xs text-muted-foreground italic">+ {ROADMAP_MODULES.filter(m => m.status === 'Future').length - 5} more</div>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </section>

          {/* SECTION 5: Product Health */}
          <section>
            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Product Health
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Card disableSurface className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Modules Done</div>
                  <div className="text-2xl font-black">{PRODUCT_HEALTH.modulesCompleted}</div>
                </CardContent>
              </Card>
              <Card disableSurface className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Features Done</div>
                  <div className="text-2xl font-black text-green-500">{PRODUCT_HEALTH.featuresCompleted}</div>
                </CardContent>
              </Card>
              <Card disableSurface className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Planned</div>
                  <div className="text-2xl font-black">{PRODUCT_HEALTH.featuresPlanned}</div>
                </CardContent>
              </Card>
              <Card disableSurface className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">Tech Debt</div>
                  <div className="text-2xl font-black text-red-500">{PRODUCT_HEALTH.technicalDebtItems}</div>
                </CardContent>
              </Card>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
