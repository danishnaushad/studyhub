import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Alert } from '../../../components/ui/Alert';
import { getAuthErrorMessage } from '../utils/auth-errors';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorCode('');
    setSuccess('');
    
    try {
      await authService.register(email, password, name);
      navigate('/onboarding');
    } catch (err: any) {
      setErrorCode(err.code || '');
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await authService.resetPassword(email);
      setSuccess('Password reset email sent. Please check your inbox.');
      setErrorCode(''); // Clear error code so prompt disappears
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <Alert variant="success">{success}</Alert>}
      {error && (
        <Alert 
          variant="error"
          action={
            errorCode === 'auth/email-already-in-use' && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button type="button" size="sm" onClick={handleResetPassword} disabled={loading}>
                  {loading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                  Reset Password
                </Button>
              </div>
            )
          }
        >
          {error}
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          required 
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="John Doe" 
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <LoadingSpinner className="mr-2" /> : null}
        Create Account
      </Button>
    </form>
  );
}
