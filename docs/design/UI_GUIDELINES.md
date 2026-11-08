# Personal Catalog — UI Guidelines

**Status:** Approved and implemented

These guidelines describe the current interface. `docs/SPEC.md` is the source of truth for product requirements and acceptance criteria.

## Experience principles

- Present a clear, adaptable catalog for different kinds of items.
- Keep product information, status, price, and contact actions more prominent than decoration.
- Do not imply checkout or purchases; the site supports browsing, temporary selection, and contact.
- Keep all flows responsive, keyboard accessible, and usable in light and dark themes.

## Page structure

### Header and hero

- Render the localized Personal Catalog wordmark and provide navigation to Items, About, Contact, and theme controls.
- Keep icon-only controls named for assistive technology, with visible focus and usable touch targets.
- Introduce the catalog with a clear heading, short description, and catalog link. Use the approved collection illustration where appropriate.
- The optional campaign presentation is generic, configurable, and has no deadline by default.

### Catalog

- Support carousel and grid views, category filters, and clear empty states.
- Keep category filters active when switching views and preserve selection state.
- Keep horizontal carousel overflow within the carousel, with keyboard-operable navigation.
- Do not use infinite scrolling. Use a grid for the full eligible catalog.

### Product cards and details

- Prioritize product imagery, title, condition, price, and relevant status.
- Available products have no status badge. Show a “Reserved” badge only for reserved products; sold products are hidden.
- Reserved products remain viewable but cannot be selected. Offer contextual contact instead.
- Selection controls use `/icons/box-open.svg` for “Add to box” / “Colocar na caixa” and `/icons/box-closed.svg` for “Remove from box” / “Retirar da caixa”. Icons are decorative; action text supplies the accessible name.
- Product details use a gallery and clearly grouped information. Combos are indivisible units and list their included items.
- Keep image sizing consistent and use `object-fit: contain` for varied product formats.

### Selection and contact

- Selection is temporary and does not create an order, reservation, or purchase.
- Present an item count and combined value, using clear labels that do not imply checkout.
- Contact actions may prepare a message with the selected items or the current product.
- Demo contact destinations are fictional examples and are not intended to reach real people.

### Footer

- Include localized About copy and configured contact links.
- Keep essential contact and navigation available outside the footer as well.
- Label example contact links as examples and use the fictional destinations in the tracked configuration.

## Visual system

- Use Newsreader for editorial headings and Source Sans 3 for interface text.
- Follow the color tokens and brand applications in `PUBLIC_BRAND.md` and the semantic tokens in the application styles.
- Keep product imagery central and use the mark and illustration only in their established brand locations.
- Maintain readable contrast in both themes and do not communicate state through color alone.

## Responsive behavior

- Adapt navigation, hero, catalog controls, cards, details, gallery, and selection panel to available space.
- On narrow screens, use a compact navigation, a single-column details view, and fixed controls that respect safe-area insets.
- Choose breakpoints based on content and verify that no page-level horizontal scrolling is introduced.

## Accessibility

- Use semantic headings, buttons, links, and form controls.
- Provide visible keyboard focus and keyboard operation for navigation, filters, dialogs, gallery controls, and selection.
- Manage dialog focus and return focus to the originating control when an overlay closes.
- Give informative images localized alt text; mark decorative artwork as decorative.
- Provide text cues for status, selection, errors, and actions. Respect reduced-motion preferences.
