import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { AppRoutes } from './routes';
import { FloatingTimer } from './components/focus/FloatingTimer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <FloatingTimer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
