# Personal Catalog — Brand and Visual System

**Status:** Approved and implemented.

## Purpose

Personal Catalog is the English-first public demonstration identity for the reusable catalog application. It presents the project as a practical, editorial interface for browsing and sharing catalog items.

## Name and voice

- Project name: **Personal Catalog**.
- English is the primary locale at `/`; Brazilian Portuguese is available at `/pt-BR` through the language switch. Spanish is a future enhancement, not part of this slice.
- Use clear, neutral language about cataloging items and expressing interest.
- Keep the interface usable for different kinds of products and collections.

## Visual direction

- Use an open-page symbol with short catalog lines to suggest organizing and presenting items.
- Render the wordmark as localized text: “Personal Catalog” in English and “Catálogo Pessoal” in Brazilian Portuguese. Use Newsreader SemiBold with a restrained teal marker stroke beneath the text in both themes; do not use a wordmark image in the header.
- Use the mixed-collection hero illustration beside the introductory copy to suggest personal belongings across books, games, and other interests.
- Keep the optional campaign hero generic and configurable; its public example uses the same illustration and has no deadline until a publisher sets one.
- Keep product imagery as the main visual focus; reserve the symbol for brand locations such as the header, hero, footer, app icon, and social previews.
- Use Newsreader for editorial headings and prominent product titles; use Source Sans 3 for navigation, product information, controls, and other interface text.
- Keep serif typography to editorial moments so the identity feels personal without suggesting that the catalog is limited to books.

Both type families are available under the SIL Open Font License and are free to use in this commercial web project under its terms. Next.js self-hosts the selected Google Fonts at build time.

## Color palette

| Role | Color | Use |
| --- | --- | --- |
| Ink | `#20242C` | Light-theme text and dark surfaces |
| Paper | `#F5F7F6` | Light-theme page background |
| White | `#FFFFFF` | Light cards and high-contrast text on teal actions |
| Deep teal | `#137A70` | Light-theme actions and mark |
| Dark teal | `#0F635B` | Hover and pressed action state |
| Mint | `#59C3B1` | Dark-theme mark, reserved badge, and emphasis |
| Dark canvas | `#15191C` | Dark-theme page background |
| Dark card | `#222A2C` | Dark-theme cards |

The interface uses white text on deep-teal actions in the light theme and retains the mint accent against dark surfaces. Discount and availability colors remain semantic state colors.

Initial WCAG contrast checks for the proposed core combinations: deep teal on white `5.19:1`, hover teal on white `7.10:1`, mint on the dark canvas `8.31:1`, mint on dark badge text `7.03:1`, and ink on the light page background `14.46:1`. Recheck the full interface states and muted colors during final review.

## Asset applications

- The header wordmark is rendered as localized Newsreader text and uses the active teal accent for its marker stroke.
- `public/brand/personal-catalog-mark.svg` is the compact symbol used for application artwork and social previews.
- `public/brand/personal-catalog-hero-illustration.svg` accompanies the classic hero copy; localized alternative text describes its books, controller, and board-game pieces.
- `src/app/icon.svg` and `src/app/apple-icon.png` use the compact symbol.
- Generated Open Graph previews use localized descriptive copy and the compact symbol.

## Accessibility

- Keep the localized wordmark as real text so its language follows the active locale and remains accessible to assistive technology.
- Give informative symbol uses a localized text alternative; hide decorative instances from assistive technology.
- Preserve visible text and non-color cues for product status, selection, and interaction state.
- Recheck contrast in both themes if the proposed colors change.

All project-authored identity artwork and application assets in this repository are licensed under MIT. Third-party typefaces retain their own licenses.
