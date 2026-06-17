
import { UserProfileSection } from '../components/UserProfileSection';
import { LearningGoalCard } from '../components/LearningGoalCard';
import { CategoriesCard } from '../components/CategoriesCard';
import { DailyMissionCard } from '../components/DailyMissionCard';
import { QuickStatsCard } from '../components/QuickStatsCard';

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <UserProfileSection />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <LearningGoalCard />
        </div>

        <div className="lg:col-span-2">
          <CategoriesCard />
        </div>

        <div>
          <QuickStatsCard />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <DailyMissionCard />
        </div>
      </div>
    </div>
  );
}
