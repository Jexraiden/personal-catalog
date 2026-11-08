# Handoff — Shipping Disclosure

## Goal

Clarify that displayed prices cover the products and shipping is arranged directly with the seller, while keeping the disclosure visible and visually secondary to product actions.

## Completed changes

- Added localized shipping notes to the catalog, selection review, and product details in Portuguese and English.
- Updated the catalog instruction and selection value label to refer to item values, avoiding the implication that the amount includes shipping.
- Styled each note with a subtle, borderless background mixed from 5% theme foreground and 95% theme background.
- Rendered `/public/icons/info.svg` as a CSS mask so its color follows `currentColor` and matches the active theme foreground exactly.
- Updated `docs/development/IMPLEMENTATION_PLAN.md` with the change and linked this handoff.

## Validation

- `npm run typecheck` passed.
- `npm run lint` passed.
- `git diff --check` passed.
- The rendered result was manually reviewed and confirmed to work as expected.

## Files

- `src/lib/i18n.ts`
- `src/features/catalog/view/view.tsx`
- `src/features/catalog/view/view.module.css`
- `src/features/selection/summary.tsx`
- `src/features/selection/summary.module.css`
- `src/features/products/product/content/content.tsx`
- `src/features/products/product/content/content.module.css`
- `docs/development/IMPLEMENTATION_PLAN.md`

