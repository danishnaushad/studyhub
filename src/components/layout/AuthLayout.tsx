import { Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { ThemeToggle } from './ThemeToggle';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background transition-colors duration-500 p-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo className="scale-125" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
