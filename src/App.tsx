import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { AppRoutes } from './routes';
import { FloatingTimer } from './components/focus/FloatingTimer';
import { TimerEngine } from './components/focus/TimerEngine';

import { ThemeProvider } from './contexts/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <TimerEngine />
          <FloatingTimer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
