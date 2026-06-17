
export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
        DS
      </div>
      <span className="font-bold text-xl tracking-tight">Danish Study OS</span>
    </div>
  );
}
