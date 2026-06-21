import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Construction, Sparkles, Server, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureItem {
  title: string;
  desc: string;
}

interface SkeletonPageProps {
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'Planning' | 'Future' | 'Architecture Approved';
  features: FeatureItem[];
  architectureNodes: string[];
}

export function SkeletonPageLayout({
  title,
  description,
  icon: Icon,
  status,
  features,
  architectureNodes,
}: SkeletonPageProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      {/* HERO SECTION */}
      <section>
        <Card disableSurface className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden relative bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute -top-24 -right-24 opacity-[0.03] pointer-events-none">
            <Icon className="w-[30rem] h-[30rem]" />
          </div>
          <CardContent className="p-8 sm:p-12 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-inner">
              <Icon className="w-12 h-12 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Construction className="w-3 h-3" />
                In Development
              </div>
              <h1 className="text-4xl font-black tracking-tight mb-3">{title}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {description}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button onClick={() => navigate('/roadmap')} variant="outline" className="border-primary/20 hover:bg-primary/10">
                  View Roadmap
                </Button>
                <Button onClick={() => navigate('/ecosystem')} variant="outline" className="border-primary/20 hover:bg-primary/10">
                  Explore Ecosystem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* STATUS & ARCHITECTURE OVERVIEW */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card disableSurface className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Development Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border/50">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Current Phase</p>
                <p className="text-xl font-bold">{status}</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-muted/30 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute bottom-0 w-full bg-amber-500/80" style={{ height: status === 'Planning' ? '20%' : status === 'Architecture Approved' ? '40%' : '5%' }} />
                 <span className="relative z-10 text-xs font-bold text-muted-foreground">WIP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card disableSurface className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              Future Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {architectureNodes.map((node, i) => (
                <div key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-semibold border border-blue-500/20">
                  {node}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* PLANNED FEATURES SECTION */}
      <section>
        <h3 className="text-xl font-bold tracking-tight px-1 mb-4">Planned Capabilities</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="p-5 rounded-xl border bg-card hover:bg-accent/20 hover:border-primary/30 transition-all group shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-base mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMPTY STATE COMPONENT PREVIEW */}
      <section>
        <Card disableSurface className="border-dashed border-2 border-border bg-accent/10">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center shadow-sm border mb-6">
              <Icon className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Module Not Yet Connected</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              The frontend skeleton for {title} is mounted, but the backend and database integration are pending implementation.
            </p>
            <Button variant="outline" disabled className="gap-2">
              Awaiting Database Integration <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
