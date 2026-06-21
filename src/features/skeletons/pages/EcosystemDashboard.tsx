import { Card, CardContent } from '../../../components/ui/Card';
import { Sparkles, FileText, Briefcase, Calendar, Bell, CreditCard, Shield, Cloud, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ECOSYSTEM_MODULES = [
  { id: 'ai', title: 'AI Study Tools', desc: 'Auto-generate questions, summaries, and get AI tutoring.', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'pdf', title: 'PDF System', desc: 'Read, annotate, and turn PDFs into flashcards.', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'projects', title: 'Project Vault', desc: 'Manage capstones, assignments, and research.', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'calendar', title: 'Calendar & Planning', desc: 'Schedule blocks, track exams, and sync events.', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'notifications', title: 'Notifications', desc: 'Smart alerts for reviews and streaks.', icon: Bell, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'subscription', title: 'Subscription System', desc: 'Manage premium features and billing.', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'admin', title: 'Admin Panel', desc: 'System health, features, and users.', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'sync', title: 'Cloud Sync', desc: 'Multi-device real-time sync capabilities.', icon: Cloud, color: 'text-sky-500', bg: 'bg-sky-500/10' },
];

export function EcosystemDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Study OS Ecosystem</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore the expansive future modules of the Danish Study OS. These hubs are currently undergoing architecture planning and frontend visualization.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ECOSYSTEM_MODULES.map(mod => (
          <Card 
            key={mod.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden"
            onClick={() => navigate(`/${mod.id}`)}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-8 -translate-y-8 pointer-events-none rounded-full blur-2xl ${mod.bg}`} />
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mod.bg} group-hover:scale-110 transition-transform`}>
                <mod.icon className={`w-6 h-6 ${mod.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{mod.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {mod.desc}
              </p>
              <div className="flex items-center text-xs font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                Explore Module <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
