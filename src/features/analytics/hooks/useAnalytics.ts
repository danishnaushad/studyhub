import { useMemo } from 'react';
import { useFocusStore } from '../../../store/focusStore';
import { useCategories } from '../../../hooks/useCategories';

export function useAnalytics(categoryId?: string) {
  const { history } = useFocusStore();
  const { categories } = useCategories();

  return useMemo(() => {
    const today = new Date();
    // Use local time matching the way today string is generated in focusStore
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let focusSecondsToday = 0;
    let sessionsToday = 0;
    let weeklyFocusSeconds = 0;
    
    const categorySeconds: Record<string, number> = {};
    const weeklyTrendMap: Record<string, number> = {};
    const heatmapMap: Record<string, number> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize the last 7 days buckets
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const str = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      weeklyTrendMap[str] = 0;
    }

    // Initialize the last 30 days buckets
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const str = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      heatmapMap[str] = 0;
    }

    // Filter history if categoryId is provided
    const filteredHistory = categoryId ? history.filter(s => s.categoryId === categoryId) : history;

    filteredHistory.forEach(session => {
      const sessionDate = new Date(session.completedAt);
      const sessionDateStr = new Date(sessionDate.getTime() - sessionDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      
      // Today stats
      if (sessionDateStr === todayStr) {
        focusSecondsToday += session.durationCompleted;
        sessionsToday += 1;
      }
      
      // Weekly stats
      if (session.completedAt >= oneWeekAgo) {
        weeklyFocusSeconds += session.durationCompleted;
      }

      // Weekly trend map
      if (weeklyTrendMap[sessionDateStr] !== undefined) {
        weeklyTrendMap[sessionDateStr] += session.durationCompleted;
      }

      // 30-day heatmap map
      if (heatmapMap[sessionDateStr] !== undefined) {
        heatmapMap[sessionDateStr] += session.durationCompleted;
      }

      // Most Active Category stats (All Time) - Only makes sense globally, but we'll still track it
      if (session.categoryId) {
        categorySeconds[session.categoryId] = (categorySeconds[session.categoryId] || 0) + session.durationCompleted;
      }
    });

    // Weekly Trend Array
    const weeklyTrend = Object.entries(weeklyTrendMap).map(([dateStr, secs]) => {
      const parts = dateStr.split('-');
      const localD = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return {
        day: dayNames[localD.getDay()],
        minutes: Math.floor(secs / 60)
      };
    });

    // Heatmap & Consistency Score
    let activeDays = 0;
    const heatmap = Object.entries(heatmapMap).map(([date, secs]) => {
      const minutes = Math.floor(secs / 60);
      if (minutes > 0) activeDays += 1;
      
      let level = 0;
      if (minutes >= 120) level = 4;
      else if (minutes >= 61) level = 3;
      else if (minutes >= 31) level = 2;
      else if (minutes > 0) level = 1;

      return { date, minutes, level };
    });

    const consistencyScore = Math.round((activeDays / 30) * 100);

    // Most Active Category
    let mostActiveCategoryId: string | null = null;
    let maxSeconds = -1; // change to -1 to handle 0 second sessions if they exist
    let totalAllTimeSeconds = 0;
    
    for (const [catId, secs] of Object.entries(categorySeconds)) {
      totalAllTimeSeconds += secs;
      if (secs > maxSeconds) {
        maxSeconds = secs;
        mostActiveCategoryId = catId;
      }
    }
    const cat = categories.find(c => c.id === mostActiveCategoryId);
    let mostActiveCategory = null;
    if (mostActiveCategoryId) {
      if (cat) {
        mostActiveCategory = { ...cat, minutes: Math.floor(Math.max(0, maxSeconds) / 60) };
      } else {
        mostActiveCategory = { id: mostActiveCategoryId, name: 'Deleted Category', color: 'gray', minutes: Math.floor(Math.max(0, maxSeconds) / 60) };
      }
    }

    // Category Distribution
    const categoryDistribution = Object.entries(categorySeconds).map(([catId, secs]) => {
      const cat = categories.find(c => c.id === catId);
      const percentage = totalAllTimeSeconds > 0 ? Math.round((secs / totalAllTimeSeconds) * 100) : 0;
      return {
        id: catId,
        name: cat ? cat.name : 'Deleted Category',
        color: cat ? cat.color : 'gray',
        percentage
      };
    }).sort((a, b) => b.percentage - a.percentage);

    // Target Completion %
    const relevantCategories = categoryId ? categories.filter(c => c.id === categoryId) : categories;
    const totalTargetMinutes = relevantCategories.reduce((sum, cat) => sum + (cat.targetMinutes || 0), 0);
    const focusMinutesToday = Math.floor(focusSecondsToday / 60);
    const targetCompletionPercentage = totalTargetMinutes > 0 
      ? Math.min(100, Math.round((focusMinutesToday / totalTargetMinutes) * 100))
      : 0;

    return {
      focusMinutesToday,
      sessionsToday,
      weeklyFocusMinutes: Math.floor(weeklyFocusSeconds / 60),
      mostActiveCategory,
      targetCompletionPercentage,
      weeklyTrend,
      categoryDistribution,
      heatmap,
      consistencyScore
    };
  }, [history, categories, categoryId]);
}
