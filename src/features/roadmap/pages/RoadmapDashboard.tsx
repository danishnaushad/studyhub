import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ROADMAP_MODULES, CURRENT_FOCUS, PRODUCT_HEALTH, ECOSYSTEMS, LEARNING_PIPELINE, ARCHITECTURE_NODES } from '../utils/roadmapData';
import type { ModuleStatus } from '../utils/roadmapData';
import { 
  Rocket, Target, CheckCircle2, Clock, GitPullRequest, Activity, 
  LayoutList, GitCommit, 
  Layers, Sparkles, FileText, BarChart3, Trophy, Globe, ArrowRight,
  BookOpen, Edit3, HelpCircle, Brain, Award, Shield, Server, Box, Network
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'execution' | 'architecture' | 'learning' | 'ecosystems' | 'build-queue'>('execution');

  const builtModules = ROADMAP_MODULES.filter(m => m.status === 'Frozen' || m.status === 'Stable' || m.progress === 100).length;
  const inProgressModules = ROADMAP_MODULES.filter(m => m.status === 'In Progress').length;
  const plannedModules = ROADMAP_MODULES.filter(m => m.status === 'Planning' || m.status === 'Architecture Approved' || m.status === 'Future').length;
  const frozenModules = ROADMAP_MODULES.filter(m => m.status === 'Frozen').length;
  const overallProgress = Math.round(ROADMAP_MODULES.reduce((acc, m) => acc + m.progress, 0) / ROADMAP_MODULES.length);

  const renderIcon = (name: string, className?: string) => {
    const icons: Record<string, React.ElementType> = {
      Sparkles, FileText, BarChart3, Target, Trophy, Globe,
      BookOpen, Edit3, HelpCircle, Brain, Award
    };
    const Icon = icons[name] || Box;
    return <Icon className={className} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-[1400px] mx-auto">
      
      {/* Product Overview Hero (Always Visible) */}
      <section>
        <Card disableSurface className="border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">Product Command Center</h1>
                </div>
                <p className="text-muted-foreground text-lg">Danish Study OS Ecosystem & Roadmap Overview</p>
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

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-8 border-t border-border/50">
              {[
                { id: 'execution', label: 'Execution', icon: Activity },
                { id: 'architecture', label: 'Architecture', icon: Network },
                { id: 'learning', label: 'Learning Flow', icon: GitCommit },
                { id: 'ecosystems', label: 'Ecosystems', icon: Layers },
                { id: 'build-queue', label: 'Build Queue', icon: LayoutList }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TAB 1: EXECUTION */}
      {activeTab === 'execution' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Built</span>
                <span className="text-4xl font-black">{builtModules} <span className="text-base font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">In Progress</span>
                <span className="text-4xl font-black">{inProgressModules} <span className="text-base font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Planned</span>
                <span className="text-4xl font-black">{plannedModules} <span className="text-base font-medium text-muted-foreground">Modules</span></span>
              </div>
              <div className="flex flex-col p-6 bg-card rounded-xl border border-border/50 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Frozen</span>
                <span className="text-4xl font-black">{frozenModules} <span className="text-base font-medium text-muted-foreground">Modules</span></span>
              </div>
            </div>

            <Card disableSurface className="border-border/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Technical Health
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Features Done</div>
                    <div className="text-3xl font-black text-green-500">{PRODUCT_HEALTH.featuresCompleted}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Features Planned</div>
                    <div className="text-3xl font-black">{PRODUCT_HEALTH.featuresPlanned}</div>
                  </div>
                  <div className="col-span-2 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="text-sm font-bold uppercase tracking-wider text-red-500 mb-1">Technical Debt Items</div>
                    <div className="text-3xl font-black text-red-500">{PRODUCT_HEALTH.technicalDebtItems}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card disableSurface className="border-amber-500/30 shadow-md bg-amber-500/5 overflow-hidden h-full">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-amber-300" />
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-6 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Current Priority
                </h3>
                <h2 className="text-2xl font-black mb-2">{CURRENT_FOCUS.module}</h2>
                <p className="text-muted-foreground text-sm font-medium mb-6">
                  {CURRENT_FOCUS.phase}: {CURRENT_FOCUS.description}
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-amber-500" /> Pending Work
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
                
                <Button className="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-white font-bold">
                  Continue Development
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="animate-in slide-in-from-bottom-4">
          <Card disableSurface className="border-border/50 bg-card overflow-hidden">
            <CardContent className="p-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black mb-4">Product Architecture Map</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  A high-level hierarchical visualization of how Danish Study OS modules connect to form the complete application.
                </p>
              </div>

              <div className="flex flex-col items-center max-w-5xl mx-auto relative">
                {/* Core Foundation */}
                <div className="w-full bg-slate-500/10 border border-slate-500/20 rounded-2xl p-6 mb-12 relative z-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
                    <Shield className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Core Foundation Layer</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {ARCHITECTURE_NODES.core.map(node => (
                      <div key={node} className="px-6 py-3 bg-background border rounded-lg font-semibold shadow-sm">{node}</div>
                    ))}
                  </div>
                </div>

                {/* Connection Line */}
                <div className="w-px h-12 bg-border -mt-12 mb-0" />

                {/* Command Hubs */}
                <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-12 relative z-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-500 mb-4">
                    <Server className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Central Hubs</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {ARCHITECTURE_NODES.hubs.map(node => (
                      <div key={node} className="px-6 py-3 bg-background border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg font-bold shadow-sm">{node}</div>
                    ))}
                  </div>
                </div>

                {/* Fork Connection Lines */}
                <div className="w-full flex justify-center h-12 -mt-12 relative z-0">
                  <div className="w-1/2 border-l border-r border-t border-border rounded-t-xl" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full mt-4">
                  {/* Learning Engine */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-500 mb-4">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Learning & Synthesis</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      {ARCHITECTURE_NODES.learning.map(node => (
                        <div key={node} className="px-6 py-3 bg-background border rounded-lg font-medium shadow-sm">{node}</div>
                      ))}
                    </div>
                  </div>

                  {/* Retention Engine */}
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 relative z-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-500 mb-4">
                      <Brain className="w-5 h-5" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Retention & Mastery</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      {ARCHITECTURE_NODES.retention.map(node => (
                        <div key={node} className="px-6 py-3 bg-background border rounded-lg font-medium shadow-sm">{node}</div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: LEARNING FLOW */}
      {activeTab === 'learning' && (
        <div className="animate-in slide-in-from-bottom-4">
          <Card disableSurface className="border-border/50 bg-card overflow-hidden">
            <CardContent className="p-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black mb-4">The Learning Pipeline</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The definitive cognitive loop designed to take a student from initial resource exposure to permanent mastery.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative max-w-6xl mx-auto pb-10">
                {/* Visual Pipeline Line */}
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0" />
                
                {LEARNING_PIPELINE.map((step, idx) => (
                  <div key={step.step} className="relative z-10 flex flex-col items-center w-full lg:w-48 group">
                    <div className="w-16 h-16 rounded-2xl bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                      {renderIcon(step.icon, "w-8 h-8 text-primary")}
                    </div>
                    <div className="text-center bg-card p-4 rounded-xl border w-full shadow-sm">
                      <div className="text-xs font-black text-primary mb-1">STEP {step.step}</div>
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    
                    {/* Mobile Down Arrow */}
                    {idx < LEARNING_PIPELINE.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-muted-foreground my-4 lg:hidden rotate-90" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: ECOSYSTEMS */}
      {activeTab === 'ecosystems' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
          {ECOSYSTEMS.map((eco) => (
            <Card key={eco.title} disableSurface className="border-border/50 hover:border-primary/20 transition-all overflow-hidden group">
              <div className={cn("h-1.5 w-full", eco.bg.replace('/10', ''))} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("p-2.5 rounded-lg", eco.bg, eco.color)}>
                    {renderIcon(eco.icon, "w-6 h-6")}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{eco.title}</h3>
                </div>
                
                <ul className="space-y-3">
                  {eco.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <div className={cn("w-1.5 h-1.5 rounded-full", eco.bg.replace('/10', ''))} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 5: BUILD QUEUE */}
      {activeTab === 'build-queue' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="lg:col-span-2">
            <Card disableSurface className="border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-8">
                  <LayoutList className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-black tracking-tight">Core Module Roadmap</h3>
                </div>
                
                <div className="grid gap-4">
                  {ROADMAP_MODULES.map(module => (
                    <div key={module.id} className="p-5 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg leading-none truncate">{module.name}</h4>
                            <StatusBadge status={module.status} />
                          </div>
                          
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

                        <div className="w-full sm:w-48 shrink-0 flex flex-col items-end gap-1.5">
                          <span className="text-sm font-bold font-mono text-muted-foreground">{module.progress}%</span>
                          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                module.progress === 100 ? 'bg-green-500' : 
                                module.status === 'In Progress' ? 'bg-amber-500' : 'bg-primary'
                              )}
                              style={{ width: `${module.progress}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card disableSurface className="border-border/50 bg-card/50 sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
                  <GitPullRequest className="w-5 h-5 text-blue-500" />
                  Development Timeline
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-amber-500 before:to-muted">
                  
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
                        {ROADMAP_MODULES.filter(m => m.status === 'Future').slice(0, 4).map(m => (
                          <div key={m.id} className="text-sm">{m.name}</div>
                        ))}
                        <div className="text-xs text-muted-foreground italic">+ {ROADMAP_MODULES.filter(m => m.status === 'Future').length - 4} more</div>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
