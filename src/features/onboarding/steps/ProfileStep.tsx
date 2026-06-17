import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../auth/services/auth.service';

export function ProfileStep({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');

  const handleNext = async () => {
    if (user && name !== user.displayName) {
      await authService.updateProfile(user.uid, { displayName: name });
    }
    onNext();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Your Profile</h2>
        <p className="text-muted-foreground">Customize how you appear in Danish Study OS.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="How should we call you?"
          />
        </div>
        {/* Future expansion: Avatar upload */}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={handleNext} disabled={!name.trim()}>Continue</Button>
      </div>
    </div>
  );
}
