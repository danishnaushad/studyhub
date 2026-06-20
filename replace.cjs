const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const filesToUpdate = [
  'components/focus/FloatingTimer.tsx',
  'features/analytics/components/AnalyticsSummaryCards.tsx',
  'features/analytics/components/CategoryDistributionChart.tsx',
  'features/analytics/components/WeeklyTrendChart.tsx',
  'features/dashboard/components/ActiveSprintCard.tsx',
  'features/dashboard/components/CalendarWidget.tsx',
  'features/dashboard/components/CategoriesCard.tsx',
  'features/dashboard/components/CategoryProgressCard.tsx',
  'features/dashboard/components/DailyMissionCard.tsx',
  'features/dashboard/components/DeadlineWidget.tsx',
  'features/dashboard/components/NextActionsCard.tsx',
  'features/focus/components/FocusSessionCard.tsx',
  'features/sprints/pages/SprintDashboard.tsx',
  'features/workspace/layouts/WorkspaceLayout.tsx',
  'features/workspace/pages/WorkspaceOverview.tsx'
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(srcDir, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Determine relative path to src/lib/colors
  const depth = relPath.split('/').length - 1;
  const relativeToColors = '../'.repeat(depth) + 'lib/colors';

  // Check if we need to import
  if (!content.includes('getCategoryColor')) {
    const importStmt = `import { getCategoryColor } from '${relativeToColors}';\n`;
    // Insert after the last import statement
    const importMatch = [...content.matchAll(/^import .*;$/gm)].pop();
    if (importMatch) {
      const insertIndex = importMatch.index + importMatch[0].length;
      content = content.slice(0, insertIndex) + '\n' + importStmt + content.slice(insertIndex);
    } else {
      content = importStmt + content;
    }
  }

  // Replacements
  // 1. style={{ backgroundColor: category.color }} -> style={{ backgroundColor: getCategoryColor(category.color) }}
  content = content.replace(/backgroundColor:\s*(cat|category|mostActiveCategory|activeCategory)\.color/g, 'backgroundColor: getCategoryColor($1.color)');
  
  // 2. style={{ backgroundColor: cat.color || 'hsl(var(--primary))' }} 
  content = content.replace(/backgroundColor:\s*(cat|category)\?\.color\s*\|\|\s*'[^']+'/g, 'backgroundColor: getCategoryColor($1?.color)');
  
  // 3. style={{ color: category.color }}
  content = content.replace(/color:\s*(cat|category|mostActiveCategory|activeCategory)\.color/g, 'color: getCategoryColor($1.color)');
  
  // 4. style={{ color: categories.find(c => c.id === session.categoryId)?.color }}
  content = content.replace(/color:\s*categories\.find\([^)]+\)\?\.color/g, (match) => {
    return 'color: getCategoryColor(' + match.split('color: ')[1] + ')';
  });

  // 5. style={ev.categoryId ? { backgroundColor: categories.find(c => c.id === ev.categoryId)?.color } : {}}
  content = content.replace(/backgroundColor:\s*categories\.find\([^)]+\)\?\.color/g, (match) => {
    return 'backgroundColor: getCategoryColor(' + match.split('backgroundColor: ')[1] + ')';
  });

  // 6. CategoryDistributionChart.tsx: return `${cat.color} ${start}% ${end}%`;
  content = content.replace(/\$\{cat\.color\}/g, '${getCategoryColor(cat.color)}');
  
  // 7. WeeklyTrendChart.tsx: const barColor = activeCategory ? activeCategory.color : undefined;
  content = content.replace(/const barColor = (.*) \? (.*)\.color : undefined;/g, 'const barColor = $1 ? getCategoryColor($2.color) : undefined;');

  // 8. Handle alpha hex trick like + '20' which won't work with hsl()
  // Replace: getCategoryColor(activeCategory.color) + '20' with getCategoryColor(activeCategory.color).replace(')', ' / 0.2)')
  content = content.replace(/getCategoryColor\(([^)]+)\)\s*\+\s*'20'/g, "getCategoryColor($1).replace(')', ' / 0.2)')");

  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Replacements completed.');
