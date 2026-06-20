import { useEffect } from 'react';
import { QuestionsAnalyticsWidget } from '../components/QuestionsAnalyticsWidget';
import { UserProfileSection } from '../components/UserProfileSection';
import { ActiveSprintCard } from '../components/ActiveSprintCard';
import { FocusSessionCard } from '../../focus/components/FocusSessionCard';
import { TodaysMissionCard } from '../components/TodaysMissionCard';
import { QuickStatsCard } from '../components/QuickStatsCard';
import { FocusScoreCard } from '../components/FocusScoreCard';
import { LiveClockCard } from '../components/LiveClockCard';
import { FocusMusicCard } from '../components/FocusMusicCard';
import { CalendarWidget } from '../components/CalendarWidget';
import { DeadlineWidget } from '../components/DeadlineWidget';
import { CategoryProgressCard } from '../components/CategoryProgressCard';
import { AnalyticsSummaryCards } from '../../analytics/components/AnalyticsSummaryCards';
import { WeeklyTrendChart } from '../../analytics/components/WeeklyTrendChart';
import { CategoryDistributionChart } from '../../analytics/components/CategoryDistributionChart';
import { ActivityHeatmap } from '../../analytics/components/ActivityHeatmap';
import { DailyMissionCard } from '../components/DailyMissionCard';
import { DailyReflectionCard } from '../components/DailyReflectionCard';
import { useFocusStore } from '../../../store/focusStore';
import { useTheme } from '../../../contexts/ThemeProvider';

export function Dashboard() {
  const checkDailyReset = useFocusStore(state => state.checkDailyReset);
  const isRunning = useFocusStore(state => state.isRunning);
  const widgetVisibility = useFocusStore(state => state.widgetVisibility);
  const { theme } = useTheme();

  useEffect(() => {
    checkDailyReset();
  }, [checkDailyReset]);

  // Hierarchy styling for Midnight Mode
  const isMidnight = theme === 'midnight';
  const focusGroupClass = isMidnight ? 'opacity-100 scale-[1.01] transition-all duration-700' : 'transition-all duration-500';
  const dimGroupClass = isMidnight 
    ? (isRunning ? 'opacity-[0.85] hover:opacity-100 transition-all duration-1000' : 'opacity-95 hover:opacity-100 transition-all duration-500') 
    : 'transition-all duration-500';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <UserProfileSection />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Header / Goal */}
        {widgetVisibility.currentSprint && (
          <div className="md:col-span-2 lg:col-span-3">
            <ActiveSprintCard />
          </div>
        )}

        {/* 1. Focus Engine + Mission */}
        <div className={`lg:col-span-2 flex flex-col gap-6 ${focusGroupClass}`}>
          <FocusSessionCard />
          {widgetVisibility.dailyGoal && <TodaysMissionCard />}
        </div>
        
        {/* Top Right Column: Clock > Music > Calendar > Deadlines */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {widgetVisibility.clock && (
            <div className={focusGroupClass}>
              <LiveClockCard />
            </div>
          )}
          <div className={focusGroupClass}>
            <FocusMusicCard />
          </div>
          <div className={dimGroupClass}>
            <CalendarWidget />
          </div>
          <div className={dimGroupClass}>
            <DeadlineWidget />
          </div>
        </div>

        {/* 3 & 4. Quick Stats & Focus Score */}
        <div className={`lg:col-span-2 ${dimGroupClass}`}>
          <QuickStatsCard />
        </div>
        <div className={`lg:col-span-1 ${dimGroupClass}`}>
          <FocusScoreCard />
        </div>

        {/* 5. Category Progress & Knowledge Trainer */}
        <div className={`md:col-span-2 lg:col-span-2 ${dimGroupClass}`}>
          <CategoryProgressCard />
        </div>
        <div className={`lg:col-span-1 ${dimGroupClass}`}>
          <QuestionsAnalyticsWidget />
        </div>

        {/* 6. Analytics Overview */}
        <div className={`md:col-span-2 lg:col-span-3 mt-4 ${dimGroupClass}`}>
          <h3 className="text-xl font-bold tracking-tight mb-4">Analytics Overview</h3>
          <AnalyticsSummaryCards />
        </div>

        <div className={`md:col-span-2 lg:col-span-2 ${dimGroupClass}`}>
          <WeeklyTrendChart />
        </div>

        <div className={`md:col-span-2 lg:col-span-1 ${dimGroupClass}`}>
          <CategoryDistributionChart />
        </div>

        <div className={`md:col-span-2 lg:col-span-3 ${dimGroupClass}`}>
          <ActivityHeatmap />
        </div>

        {/* 7. Mission History */}
        <div className={`md:col-span-2 lg:col-span-3 mt-4 ${dimGroupClass}`}>
          <h3 className="text-xl font-bold tracking-tight mb-4">Activity Logs</h3>
          <DailyMissionCard />
        </div>

        {/* 8. Daily Reflection */}
        <div className="md:col-span-2 lg:col-span-3">
          <DailyReflectionCard />
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8 opacity-50">
        Version Test 1
      </div>
    </div>
  );
}
