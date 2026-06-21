import { cn } from '../../../lib/utils';
import { getMasteryLevel } from '../utils/vaultHelpers';

interface MasteryLevelBadgeProps {
  score: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export function MasteryLevelBadge({ score, reviewCount = 0, size = 'sm', showScore = true }: MasteryLevelBadgeProps) {
  const level = getMasteryLevel(score, reviewCount);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border',
        level.bgClass,
        level.textClass,
        level.borderClass,
        sizeClasses[size]
      )}
    >
      {level.label}
      {showScore && <span className="opacity-70 font-mono">{score}%</span>}
    </span>
  );
}
