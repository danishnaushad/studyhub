# StudyHub Master Context

## Vision
StudyHub is transforming from a simple resource repository into an interactive, all-in-one Study Material Hub. It is designed to act as a unified workspace where users can store materials, actively read, generate notes, build flashcards, and use spaced repetition (Knowledge Trainer) without ever breaking their focus context.

## Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + custom UI components (shadcn-like)
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage (for PDFs and media)
- **Authentication**: Firebase Auth
- **State Management**: React Context / Zustand hooks

## Core Principles
1. **Workspace Context**: Users must be able to perform all studying activities (reading, testing, noting) without leaving their current category workspace.
2. **Phase-Gate Execution**: Development strictly follows a Build → UAT → Fix → Stabilize → Freeze model to prevent feature creep and regression.
3. **Data Isolation**: All resources, notes, and questions are strictly scoped to `userId` and `categoryId`. No cross-category or cross-user leakage.

## Core Entities
- **Category**: Top-level organization unit.
- **Resource**: Links, videos, and PDFs.
- **Note**: Text-based context tied to categories or resources.
- **Question/Flashcard**: Active recall units evaluated by the Knowledge Trainer.
- **Sprint**: Time-boxed goals or structural milestones.
