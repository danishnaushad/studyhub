import { Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo className="scale-125" />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
