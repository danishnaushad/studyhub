const fs = require('fs');

function repl(p, r) {
  let c = fs.readFileSync(p, 'utf8');
  for (let [s, d] of r) {
    c = c.replace(s, d);
  }
  fs.writeFileSync(p, c);
}

repl('src/features/auth/components/LoginForm.tsx', [
  [/import \{ useNavigate \} from 'react-router-dom';/, "import { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';"]
]);

repl('src/features/auth/components/RegisterForm.tsx', [
  [/import \{ useNavigate \} from 'react-router-dom';/, "import { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';"]
]);

repl('src/features/onboarding/OnboardingWizard.tsx', [
  [/import \{ WelcomeStep \}/, "import { useState } from 'react';\nimport { WelcomeStep }"],
  [/\(s\) =>/g, "(s: number) =>"]
]);

repl('src/features/onboarding/steps/ProfileStep.tsx', [
  [/import \{ Button \}/, "import { useState } from 'react';\nimport { Button }"]
]);

repl('src/features/onboarding/steps/GoalStep.tsx', [
  [/import \{ Button \}/, "import type { OnboardingData } from '../OnboardingWizard';\nimport { Button }"]
]);

repl('src/features/onboarding/steps/CategoryStep.tsx', [
  [/import \{ Button \}/, "import { useState } from 'react';\nimport type { OnboardingData } from '../OnboardingWizard';\nimport { Button }"],
  [/\(c\) =>/g, "(c: string) =>"],
  [/\(cat\) =>/g, "(cat: string) =>"],
  [/variant="secondary"/g, 'variant="outline"']
]);

repl('src/features/onboarding/steps/SuccessStep.tsx', [
  [/import \{ useNavigate \}/, "import { useState } from 'react';\nimport type { OnboardingData } from '../OnboardingWizard';\nimport { useNavigate }"],
  [/\(catName\) =>/g, "(catName: string) =>"]
]);

repl('src/store/authStore.ts', [
  [/import type \{  \} from '\.\.\/types';/g, "import type { UserProfile } from '../types';"]
]);

repl('src/features/auth/services/auth.service.ts', [
  [/import \{ auth, db \}/, "import type { UserProfile } from '../../../types';\nimport { auth, db }"]
]);

console.log('All files fixed');
