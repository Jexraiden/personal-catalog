# Known Bugs

## Mobile product card action spacing differs between carousel and grid

- **Status:** Pending resolution
- **Area:** Catalog view, mobile layout
- **Observed behavior:** The vertical gap between the product text/price and the “Ver detalhes” button shifts slightly when switching between carousel and “Ver todos” grid on mobile. The desktop layout is currently acceptable.
- **Expected behavior:** The action button should have a consistent visual distance from the product text in both mobile views, without making the cards excessively tall.

### Attempts made

1. Added `h-full` to cards and made the content wrapper flexible. This did not resolve the difference and was reverted.
2. Set a fixed mobile card height of `36rem` so the grid could reserve the same space as the carousel. This aligned the actions but made the cards excessively tall; the fixed height was reverted.
3. Increased the grid-only action area padding, then adjusted it from `pt-12` to `pt-[2.875rem]` and `pt-9`. The screenshots continued to show a position difference, so these values did not reliably solve the issue.
4. Replaced `mt-auto` with a fixed mobile margin (`mt-4 pt-5`, retaining `md:mt-auto`) so both modes would use a fixed gap. The user confirmed this did not resolve the issue; this change was reverted.

### Current state

The last spacing change has been reverted. Current layout retains `mt-auto pt-5` for card actions and the grid-specific mobile `pt-9` adjustment. Further investigation is needed before changing card heights or spacing again.

## Product carousel remains draggable behind product details

- **Status:** Resolved
- **Area:** Catalog carousel, product details dialog
- **Observed behavior:** While product details were open, the desktop cursor could still show the carousel drag hand. Dragging over the dialog could move the carousel underneath it when pointer positions aligned.
- **Resolution:** The catalog disables carousel pointer gestures while any product details dialog is open, clears an active gesture and pointer capture when details open, and uses the default cursor for the disabled track.
- **Validation:** `git diff --check` passed, and the user confirmed the carousel behaves correctly with product details open.
