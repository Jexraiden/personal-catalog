# Personal Catalog — Implementation Plan

This plan tracks the current implementation of the reusable catalog application. `docs/SPEC.md` defines product behavior; `docs/design/PUBLIC_BRAND.md` and `docs/design/UI_GUIDELINES.md` define its visual and interaction direction.

## Current status

Phases 1–11 and Phase 12 are complete. Phase 12 prepared the application as an open-source, English-first reusable demo with fictional contact destinations, public-safe sample data, generic project branding, and no project-specific deployment command.

## Phase 12 — Public repository productization (complete)

| Slice | Scope | Status |
| --- | --- | --- |
| 12.1 | Public identity and brand system | Complete; user reviewed the visual direction |
| 12.2 | Classic hero and public presentation | Complete |
| 12.3 | Generic configurable campaign presentation | Complete; user confirmed |
| 12.4 | About, footer, attribution, and fictional contact configuration | Complete; user tested |
| 12.5 | Catalog and selection terminology | Complete; user confirmed |
| 12.6 | Product cards and details presentation | Complete; user confirmed |
| 12.7 | Selection review and contact message | Complete; user confirmed |
| 12.8 | Public-safe catalog and media fixture | Complete; user confirmed |
| 12.9 | Repository, storage, deployment, and documentation audit | Complete; user confirmed |

## Follow-up — License and identity audit

### Scope

- Apply the MIT license to all first-party project code, documentation, icons, illustrations, sample data, and sample media.
- Keep third-party dependency and font licenses intact and documented.
- Remove all project-specific identity, terminology, artwork, and historical references from the current working tree.
- Keep fictional contact examples and avoid adding private data.
- Do not add deploy instructions to the README or a deploy command to the package scripts.
- Do not create commits unless the user explicitly requests one.

### Acceptance criteria

- Current tracked and untracked project files contain no references or assets tied to another brand or project.
- `LICENSE`, `README.md`, and `ASSET-RIGHTS.md` consistently describe the MIT scope and third-party licensing.
- Existing application behavior remains intact.
- `npm run lint`, `npm run typecheck`, and `git diff --check` pass.

## Plan maintenance

Keep this plan concise and update slice status only after its acceptance criteria are verified. Record new work as a scoped slice with explicit acceptance criteria before implementation.

## Follow-up — Specification alignment (complete)

- Reconcile `docs/SPEC.md` with the implemented public demo, including English-default locale routes, persisted locale/theme/catalog-view preferences, fictional contact destinations, category filtering, discounts, box terminology and icons, product media, campaign configuration, footer behavior, static export, and MIT licensing.
- Remove resolved decisions from the open-questions section and remove superseded or contradictory MVP requirements and acceptance criteria.
- Compare the revised requirements with the current application and scan the specification for references to the prior project identity.

**Status:** Complete. The acceptance criteria and behavior descriptions now match the current implementation; no prior-project identity references remain in the specification.
