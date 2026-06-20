import * as React from "react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../contexts/ThemeProvider"

const MidnightCardSurface = () => {
  // Generate 5 static stars per card to avoid visual clutter (40-60 total across ~10 cards)
  const stars = React.useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.2 + 0.05,
      size: Math.random() > 0.8 ? 2 : 1,
    }));
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-black/20 pointer-events-none rounded-xl group-hover:from-indigo-900/15 group-hover:to-black/10 transition-colors duration-500" />
      <div className="absolute inset-0 opacity-50 pointer-events-none overflow-hidden rounded-xl">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white group-hover:shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-shadow duration-500"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 rounded-xl border border-indigo-500/10 shadow-[inset_0_0_20px_rgba(124,58,237,0.02)] pointer-events-none group-hover:border-indigo-500/30 group-hover:shadow-[inset_0_0_30px_rgba(124,58,237,0.05)] transition-all duration-500" />
    </>
  );
};

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme();
    const isMidnight = theme === 'midnight';
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow relative group transition-all duration-500", 
          isMidnight && "hover:-translate-y-[2px] hover:shadow-xl",
          className
        )} 
        {...props} 
      >
        {isMidnight && <MidnightCardSurface />}
        <div className="relative z-10 h-full flex flex-col">
          {props.children}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
