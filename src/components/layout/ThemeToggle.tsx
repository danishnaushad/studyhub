import { Moon, Sun, Stars } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeProvider';

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full w-10 h-10 transition-colors bg-accent/50 hover:bg-accent"
      title={`Switch Theme (Current: ${theme})`}
    >
      {theme === 'light' && <Sun className="h-5 w-5 text-amber-600" />}
      {theme === 'dark' && <Moon className="h-5 w-5 text-blue-400" />}
      {theme === 'midnight' && <Stars className="h-5 w-5 text-[#7C3AED]" />}
    </Button>
  );
}
