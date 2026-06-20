import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlertProps {
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Alert({ variant = 'default', title, children, className, action }: AlertProps) {
  const variantStyles = {
    default: 'bg-secondary text-secondary-foreground border-border',
    error: 'bg-destructive/15 text-destructive-text border-destructive/40',
    success: 'bg-success/15 text-success border-success/50',
    warning: 'bg-warning/15 text-warning border-warning/50',
    info: 'bg-info/15 text-info border-info/50',
  };

  const IconMap = {
    default: Info,
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = IconMap[variant];

  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
        variantStyles[variant],
        className
      )}
    >
      <Icon className={cn('h-5 w-5', variantStyles[variant].split(' ')[1])} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {action && (
          <div className="shrink-0 mt-2 sm:mt-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
