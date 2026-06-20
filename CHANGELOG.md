# Changelog

All notable changes to StudyHub will be documented in this file.

## [Unreleased] - Phase 15.4
### Added
- Phase 15.4 PDF Question Integration pending.

## [Phase 15.3] - 2026-06-19
### Added
- PDF Notes Integration. Added contextual popup to create Notes directly from highlighted text in `PDFWorkspaceReader`.
- Deep-linked Notes: Notes now retain `sourceResourceId`, `sourceResourceTitle`, `sourcePageNumber`, and `sourceHighlightText`.
- NoteCard visually updated to display source context blockquotes without breaking grid constraints.

## [Phase 15.2] - 2026-06-19
### Added
- Added `readingTime` tracking using the Page Visibility API to safely prevent idle-time inflation.
- Injected dynamic Progress Bar into `ResourceCard` for PDFs indicating `currentPage / totalPages` and a clamped percentage.
- Implemented unmount-only Firestore sync to strictly eliminate periodic database writes during active reading.

## [Phase 15.1] - 2026-06-19
### Added
- Native in-app PDF viewing overlay (`PDFWorkspaceReader.tsx`) powered by `react-pdf`.
- Support for PDF pagination and scaling (zoom controls).
- Dark mode toggle that safely inverts PDF canvas colors for reading.
- Automatic page persistence synchronizing with Firestore `resources` document.

## [Phase 14] - 2026-06-19
### Fixed
- Hardened PDF Upload pipeline to explicitly pass `{ contentType: 'application/pdf' }` resolving silent Firebase Storage rule rejections.
- Refactored Promise wrapper natively around `UploadTask` to properly propagate and display authorization exceptions.
- Resolved Resource Dropdown menu clipping by removing `overflow-hidden` constraints.
- Updated styling of "Cancel Upload" button to match destructive aesthetic.

## [Phase 13] - 2026-06-18
### Changed
- Refactored Space Repetition logic centrally into `questionEngine.ts`.
- Removed duplicated mastery calculations across the application.
