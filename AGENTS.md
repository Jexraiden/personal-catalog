# Personal Catalog — AI Agent Instructions

## Project Context

Personal Catalog is an open-source catalog application built with Next.js, React, TypeScript, and native CSS Modules.

The project follows Spec-Driven Development.

## Sources of Truth

- `docs/SPEC.md` — Functional requirements, business rules, and project scope.
- `docs/development/IMPLEMENTATION_PLAN.md` — Current phase, slices, tasks, and acceptance criteria.
- `docs/design/PUBLIC_BRAND.md` — Brand identity, visual system, and design foundations.
- `docs/design/UI_GUIDELINES.md` — Layouts, components, interactions, responsiveness, and accessibility.

## Development Workflow

1. Read `docs/SPEC.md` before making behavioral changes.
2. Follow the current implementation slice defined in `docs/development/IMPLEMENTATION_PLAN.md`.
3. Consult the relevant design documentation before implementing or modifying user-facing interfaces.
4. Validate changes before reporting completion.
5. Update `docs/development/IMPLEMENTATION_PLAN.md` after completing tasks.
6. Mark slices and phases as completed only after verifying their acceptance criteria.
7. Surface significant conflicts between requirements instead of resolving them silently.
8. Do not implement functionality from future slices prematurely.
9. Do not introduce unnecessary dependencies or speculative abstractions.
10. Do not create commits or push changes without user approval.

## Security and Privacy

- Never add secrets, credentials, environment files, or unintended private data to source control.
- Use only public-safe sample content in tracked files.

## Communication

- Communicate with the user in Brazilian Portuguese.
- Keep code, documentation, and technical identifiers in English.
- Explain important implementation decisions to support the user's learning.
- When asked to write a commit message, write it in English using Conventional Commits. Do not create the commit unless the user explicitly asks.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing code, and heed deprecation notices.

<!-- END:nextjs-agent-rules -->
