# Auto-Sync Rule
Whenever a major task, phase, or priority implementation is completed and verified, you must follow this strict verification checklist before committing and pushing changes to GitHub.

## Pre-Push Verification Checklist
Before pushing code, you must execute:
1. `npm run build` - Ensure the build passes.
2. Ensure there are no TypeScript errors.
3. Ensure there are no lint errors.

**Critical Constraint**: If the build fails or there are outstanding errors, DO NOT push broken code to the repository. Fix the errors first.

## Auto-Sync Workflow
Only after the above verification passes, execute the following workflow to push changes to the `main` branch (which triggers Vercel deployments):
1. `git add .`
2. `git commit -m "feat: [describe the changes made]"`
3. `git push origin main`
