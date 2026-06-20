# ADR 001: Resource Relocation Behavior

**Status**: Deferred
**Date**: 2026-06-19

## Context
During Phase 15.3 (PDF Notes Integration), we discovered a potential architectural drift. When a user highlights a PDF to generate a Note or Question, the generated asset permanently inherits the active `categoryId` at the time of creation.

Currently, StudyHub does not support migrating a Resource between categories. However, if a user were to relocate a Resource in the future, all child assets (Notes, Questions, Flashcards) generated from that Resource would become orphaned in the original category.

## Decision
Implementation of cross-category migration logic for Resources and their cascading children is **deferred**.

## Future Considerations
Before implementing "Move Resource", we must decide whether:
1. **Strict Binding**: Moving a Resource automatically force-moves all associated Notes/Questions to the new category.
2. **Loose Binding**: Moving a Resource leaves the knowledge assets in their original categories as independent thoughts, merely retaining the `sourceResourceId` foreign key.

*This ADR serves as a placeholder to unblock Phase 15 development.*
