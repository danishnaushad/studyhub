# Architecture Decision Records (ADR)

This file tracks significant architectural decisions made during the development of StudyHub.

## ADR-001: Question Engine Centralization (Phase 13)
**Context:** Spaced repetition and status calculations were duplicated across multiple components.
**Decision:** All calculations for `evaluateRating`, `calculateStatus`, `calculateNextReview`, and queue building are centralized in `src/features/workspace/utils/questionEngine.ts`.
**Consequence:** Single source of truth for spaced repetition logic.

## ADR-002: PDF Upload Pipeline Wrapper (Phase 14)
**Context:** Firebase Storage's `uploadBytesResumable` does not fire the `error` callback of `state_changed` for all classes of network or rule failures, causing manual Promise wrappers to hang indefinitely.
**Decision:** Removed manual Promise wrappers and natively awaited the `UploadTask` directly to properly propagate initialization errors to the UI.
**Consequence:** Ensured stable, predictable UI un-blocking if an upload is denied.

## ADR-003: Distinct Flashcard Entity (Phase 15.1 - Pending)
**Context:** Phase 15 required a way to generate "Flashcards" from PDFs. Initially proposed re-using the `Question` model.
**Decision:** Explicitly mandate that Flashcards are modeled and implemented as a separate entity from Questions.
**Consequence:** Requires a new schema definition and dedicated Knowledge Trainer integration paths.

## ADR-004: PDF Rendering Engine (Phase 15.1)
**Context:** Browsers natively open PDFs in new tabs, breaking the user's workspace context.
**Decision:** Use `react-pdf` (wrapping Mozilla's `pdf.js`) to render PDFs directly within the React DOM.
**Consequence:** Increases bundle size but allows deep integration, text extraction, and coordinate-based highlighting for future phases.

## ADR-005: Local Study Folder Integration (Phase 15.7 - Planned)
**Context:** Users need to read and organize local PDFs natively without incurring Firebase Storage costs or manually uploading files one by one into an IndexedDB cache.
**Decision:** We will leverage the modern browser **File System Access API** to allow users to connect a "Local Study Folder." The app will scan the folder for PDFs, generate metadata in Firestore linked to the local file path, and stream the file binary directly into `PDFWorkspaceReader`.
**Consequence:** Users avoid cloud storage costs entirely. The browser must prompt for directory read permissions upon returning to the app. Metadata (notes, flashcards, reading progress) syncs via Firestore, but the raw file remains completely local and private.
