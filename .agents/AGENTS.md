# Auto-Sync Rule
Whenever a major task, phase, or priority implementation is completed and verified, automatically commit all changes to git and push them to the `main` branch. 

Example workflow at the end of a task:
1. `git add .`
2. `git commit -m "feat: [describe the changes made]"`
3. `git push origin main`

This ensures that the project remains continuously synced with GitHub and triggers Vercel deployments automatically.
