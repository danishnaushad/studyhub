import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';
import { getAuthErrorMessage } from '../utils/auth-errors';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (isResetMode) {
        if (!email) {
          throw new Error('auth/invalid-email');
        }
        await authService.resetPassword(email);
        setSuccess('Password reset email sent. Please check your inbox.');
        setIsResetMode(false);
      } else {
        await authService.login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          required 
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com" 
        />
      </div>

      {!isResetMode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => {
                setIsResetMode(true);
                setError('');
                setSuccess('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <LoadingSpinner className="mr-2" /> : null}
        {isResetMode ? 'Send Reset Link' : 'Sign In'}
      </Button>

      {isResetMode && (
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full mt-2" 
          onClick={() => {
            setIsResetMode(false);
            setError('');
            setSuccess('');
          }}
          disabled={loading}
        >
          Back to Sign In
        </Button>
      )}
    </form>
  );
}
