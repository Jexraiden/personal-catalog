# Personal Catalog — Product Specification

## 1. Overview

Personal Catalog is an open-source, reusable web application for presenting a catalog of items and collecting expressions of interest. The repository provides a public demo with fictional catalog records and contact destinations.

Visitors can browse items, review information and availability, temporarily select available items, and contact the catalog publisher through configured contact links.

Personal Catalog is not an e-commerce platform or marketplace. It does not process purchases, payments, orders, or reservations. Any negotiation takes place outside the application.

## 2. Goals

### 2.1 Product Goals

Personal Catalog aims to make catalog items easy to discover and evaluate, and to provide a clear way to express interest.

The product should:

- Provide a shareable catalog that works for a range of item types.
- Help visitors understand each item's details, condition, price, and availability.
- Let visitors group items of interest before contacting the publisher.
- Keep the implementation easy to reuse and adapt.

### 2.2 Project and Learning Goals

Personal Catalog is also intended to be a practical learning and portfolio project built around a real-world use case.

The project should:

- Provide hands-on practice with graphic design and visual identity decisions.
- Develop practical UI/UX design skills through the design and implementation of a real user-facing interface.
- Expand frontend development experience using modern web technologies.
- Provide practical experience with TypeScript, React, Next.js, and related modern web development tools where they are justified by actual product requirements or the project's explicit learning objectives.
- Apply and document a Spec-Driven Development workflow throughout the project.
- Explore effective use of AI as a tutor, implementation agent, and code reviewer while keeping product decisions and validation explicit.
- License project-authored code, documentation, icons, illustrations, and demonstration media under MIT; third-party works retain their own licenses.

## 3. MVP Scope

The MVP must provide a complete and usable catalog experience that allows visitors to discover items, evaluate them, select items they are interested in, and contact the owner without requiring an online purchasing process.

The MVP includes:

- A public catalog displaying items that are currently available or reserved.
- Product cards containing the essential information needed to identify and evaluate an item.
- Detailed product views containing additional information about each item.
- Support for multiple product media, including images and videos where available.
- Support for products sold as indivisible bundles or combos.
- Clear representation of product availability, including available and reserved states.
- A temporary selection mechanism that allows visitors to select one or more available items they are interested in.
- A selection summary showing the selected items and their combined item value.
- Contextual contact links for individual products and the visitor's current selection.
- A responsive interface suitable for desktop, tablet, and mobile devices.
- Light and dark visual themes.
- English (`en`) and Brazilian Portuguese (`pt-BR`) interface locales, with English at `/` and Portuguese at `/pt-BR`.
- Keyboard operation, visible focus, and accessible main visitor flows.
- The approved Personal Catalog visual identity and branding.
- A classic hero by default and an optional configurable campaign hero.

The application displays item prices and explains that shipping is arranged directly with the seller.

## 4. Out of Scope

The following capabilities are either explicitly excluded from Personal Catalog or intentionally deferred beyond the MVP.

### 4.1 Explicitly Excluded

The following capabilities are not part of the intended product:

- Online checkout.
- Online payments, including payment gateways or direct PIX, credit card, or boleto processing.
- Order creation or order management.
- User accounts and authentication.
- Persistent customer profiles, addresses, or purchase histories.
- Transactional inventory management.
- Automatic product purchasing or reservation.
- Marketplace functionality or support for multiple sellers.
- Traditional shopping cart and checkout behavior. Product selection exists only to group items of interest and support contact with the owner.
- Reviews, ratings, wishlists, recommendations, and similar e-commerce features.

Selecting an item must not purchase, reserve, or otherwise change the availability of that item.

### 4.2 Deferred Beyond the Current Application

These capabilities are not implemented and require a specification update before work begins:

- Persisting a visitor's selection across reloads or visits.
- Image zoom or pinch-to-zoom.
- Search, pagination, or incremental loading unless catalog size justifies them.
- A catalog administration interface, CMS, database, or managed product service.
- Analytics that track visitors or item interest.
- User accounts, checkout, payments, orders, or transactional reservations.

The application currently supports category filtering, two interface languages, saved theme and view preferences, product discounts, and optional campaign presentation. These are implemented scope, not deferred work.

## 5. Functional Requirements

### RF-001 — Product Catalog

The system must provide a public catalog where visitors can browse products currently offered by the owner.

Products must be included in or excluded from the public catalog according to the availability rules defined in RF-005.

### RF-002 — Product Card

Each product displayed in the public catalog must be represented by a product card that provides enough information for visitors to quickly identify and evaluate the item before opening its detailed view.

Each product card must display:

- The product's cover image.
- Its name and category label.
- Its condition and price.
- A reserved badge only when the product is reserved. Available products must not have an availability badge.

When a product represents an indivisible bundle or combo, the card must clearly indicate that it contains multiple items and may provide a concise summary of its contents.

Each product card must provide a clear way to access the product's detailed view.

On desktop, hovering or keyboard-focusing the product image or name reveals a “View more” hint; activating either opens the details dialog. On touch screens, the first tap reveals the hint and a second tap within three seconds opens details. If the hint expires, a new tap reveals it again.

Available products must provide a selection control directly from the product card. Products that cannot be selected must not present the control as an available action.

Product images must be presented consistently and without unnecessarily cropping relevant product content.

### RF-003 — Product Details

Visitors must be able to inspect the complete relevant information about a product without navigating away from the catalog.

The MVP must present product details in a modal dialog associated with the selected product.

The detailed view must display:

- The product's cover image and available additional media.
- Its name, category, price, and condition.
- A localized reserved badge only when its availability is `reserved`.
- Its description.
- Its optional specifications paragraph when provided.
- The actions applicable to its current availability state.

When additional condition information is available, the detailed view must present it to the visitor.

When a product represents an indivisible bundle or combo, the detailed view must clearly list the items included in the bundle.

Technical shipping information, such as package weight and dimensions, must not be displayed as part of the default product details.

Closing the detailed view must return the visitor to the catalog without unnecessarily losing their previous browsing context.

### RF-004 — Product Media

Products must support images and videos that allow visitors to inspect the item's appearance and condition.

The supported media types for the MVP are images and videos.

Each product has a required `coverImage` and optional `images` and `videos` collections. The detail view keeps the cover visible while presenting additional photos and videos in their own groups.

Every product displayed in the public catalog must define a `coverImage`. Additional images and videos are optional.

Within the product detailed view, the `coverImage` must remain displayed prominently and must not change when visitors open the media lightbox.

The thumbnail limit is five on desktop and three on mobile. Apply the active limit to the combined image and video count when deciding whether to show a single row or separate groups. Show a `+N` control after the limit. Show separate **“Fotos”** and **“Vídeos”** groups only when both types have items and the combined collection exceeds the active limit. If only one type exists, keep its thumbnails and `+N` in a single untitled row. On mobile, omit the reserved icon space beside group headings. Thumbnails have equal size; detail thumbnails use an accent-colored border on hover.

Selecting a photo thumbnail opens the lightbox with additional images only. The cover image is displayed only in the product details view and is not interactive. Selecting a video thumbnail opens the lightbox with only videos. Video thumbnails must be visually distinguishable before playback.

The lightbox carousel and thumbnails must contain only the media type that was selected to open it. Visitors can navigate within that type without closing the lightbox.

On desktop interfaces, the lightbox must provide visible navigation controls and support keyboard navigation between media items.

On touch-oriented mobile interfaces, the lightbox must support horizontal swipe navigation between media items and use the available screen space appropriately for media inspection.

Visitors must be able to close the lightbox and return to the same product detailed view they were previously viewing.

The lightbox must provide a fit-to-screen and 100% image-size control. Pinch-to-zoom and freeform zoom are not implemented.

### RF-005 — Product Availability

Each product must have an availability state that determines whether it is publicly displayed and which visitor actions are permitted.

The MVP must support the following availability states:

- `available`
- `reserved`
- `sold`

An `available` product must be displayed in the public catalog, must allow visitors to inspect its details, must be selectable, and must allow visitors to express interest in it.

A `reserved` product must remain visible in the public catalog and must allow visitors to inspect its details and express interest in it. A `reserved` product must not be selectable.

Reserved product cards must appear after all non-reserved product cards. This ordering must remain in effect when category filters are applied.

Product cards must identify reserved products with a “Reservado” badge at the upper-left of the image. If a discount badge is also present, place the reserved badge beside it. Apply a subtle dark overlay to the reserved product image. In the selection-control position, show a WhatsApp contact action instead of a selection action; its prefilled message must indicate interest in the reserved product and acknowledge its reserved state.

The detailed view of a reserved product must display a localized “Reserved” badge beside its category label.

Available products must not display an availability badge. Their available state is reflected by the selection action. Reserved products must display the localized reserved badge and the applicable contact action.

A `sold` product must remain part of the product data but must not be rendered as part of the public catalog or its product-detail flow.

The interface must distinguish reserved products through their reserved badge and contact action; available products are indicated by their selection action and must not have a separate status badge.

Availability rules must be enforced by product behavior and must not depend solely on visual presentation.

### RF-006 — Product Selection

Visitors must be able to temporarily group available products they are interested in so they can review those products together and contact the owner about them.

Only products with the `available` availability state may be added to the selection.

Selecting a product must not reserve it, purchase it, change its availability, or otherwise modify the product itself.

A product must not appear more than once in the current selection.

Visitors must be able to remove individual products from their selection without affecting the other selected products.

Selection controls use the localized “Add to box” / “Colocar na caixa” and “Remove from box” / “Retirar da caixa” labels. Use `/icons/box-open.svg` when adding and `/icons/box-closed.svg` when removing; treat both icons as decorative and retain visible action text.

When a product represents an indivisible bundle or combo, the entire bundle must be treated as one selected product. Individual items within the bundle must not be independently selectable or removable.

The interface must clearly communicate when a product is currently selected.

When at least one product is selected and no blocking overlay is open, the interface must provide a persistent selection summary bar.

The selection summary bar must communicate:

- The number of selected products.
- The combined value of the selected products.
- A clear action for opening and reviewing the current selection.

The selection review opens as a modal dialog. Visitors must be able to:

- Identify each selected product by its image, name, and price.
- Identify when a selected product represents a bundle or combo.
- Open the detailed view of a selected product.
- Remove individual products from the selection.
- See the combined value of the selected products.
- Access the action for contacting the owner about the selected products.

The selection summary bar shows the effective total. The review shows the sum of original prices, total savings, and the final effective total. Effective prices and savings account for valid discounts.

The selection interface must use terminology that represents a collection of items of interest and must not imply that the visitor is creating a shopping cart, order, checkout, or purchase.

The selection exists in memory only and is cleared when the page reloads or is left. It is not persisted across browsing sessions.

### RF-007 — Contact

Visitors must be able to contact the owner to express interest in the catalog, an individual product, or their current product selection.

The primary contact workflow is WhatsApp. The footer also provides a configured email link; Instagram supports social discovery and is not a contact workflow. The tracked WhatsApp, email, and Instagram destinations are fictional and cannot contact a real person.

The footer must provide links to the configured Instagram profile, WhatsApp contact, and email address. The Instagram link does not replace or modify the WhatsApp contact flow.

A general contact action must be accessible from the main website navigation without requiring the visitor to select or open a product.

Individual product detailed views must provide a contextual contact action for expressing interest in that product.

Both `available` and `reserved` products must allow visitors to express interest through the contextual contact action.

When contact is initiated from an individual product, the generated contact context must identify the product and its current price.

When at least one product is selected, the selection review must provide an action for contacting the owner about the current selection.

When contact is initiated from a product selection, the generated contact context must identify:

- Each selected product.
- The price of each selected product.
- The combined value of the selected products.

The contact experience must make it clear that the visitor is starting a conversation with the owner rather than placing an order or completing a purchase.

Initiating contact must not create an order, reserve a product, modify product availability, or otherwise create a transactional record within Personal Catalog.

Negotiation, confirmation of availability, payment arrangements, delivery arrangements, and completion of the sale take place outside Personal Catalog.

### RF-008 — Light and Dark Themes

The interface must support both light and dark visual themes.

Both themes must follow the design tokens in `docs/design/PUBLIC_BRAND.md` while preserving the same content, functionality, and information hierarchy.

When no explicit visitor theme preference is active, the interface must use the visitor's operating system or browser color scheme preference to determine the initial theme.

Visitors must be able to manually switch between the light and dark themes.

A manually selected theme must be saved in the visitor's browser and restored on later visits. A saved manual selection must take precedence over the operating system or browser color scheme preference. When no saved manual selection exists, the interface must use the system preference.

Switching themes must not change the page content, product data, current product selection, navigation state, or available functionality.

Both themes must maintain sufficient visual distinction between content, interactive controls, availability states, selected states, and focus states.

Theme preference is stored locally under `personal-catalog-theme` and is not associated with an account or shared across devices.

### RF-009 — Catalog View Preference

Visitors must be able to browse the catalog using either the product carousel or the complete product grid.

When no saved catalog view preference exists, the catalog must open in carousel mode.

When a visitor changes the catalog view, the selected mode must be saved in the visitor's browser and restored on later visits. Only supported values (`carousel` and `grid`) may be restored; invalid stored values must fall back to carousel mode.

The catalog view preference is stored locally under `personal-catalog-view` and is not associated with an account or shared across devices.

### RF-010 — Product Discounts

A product may define an optional `discountedPriceInCents` containing its final discounted price in the catalog currency. An omitted, empty, null, or zero value means no discount. A positive discounted price must be lower than the product's original `priceInCents`; invalid values must fail catalog validation.

When a discount is active, product cards, product details, and the selection review must show the discounted price as the current price and the original price struck through. Cards show a discount percentage tag over the upper-left of the product image; details and discounted selection entries show the same percentage near the price. Calculate the percentage from the original and discounted prices and round it to the nearest whole percent.

Selection totals and contact messages use the effective price (the discounted price when active, otherwise the original price). The selection review shows the sum of original prices, the total savings (the sum of each selected product's original minus effective price), and the final effective total.

### RF-011 — Category Filtering

Visitors must be able to filter the eligible catalog products by the categories configured in the catalog data.

The catalog must provide a category filter button that opens a list of configured categories. Visitors may select one or more categories, and the catalog must update immediately to show products that match any selected category. When no category is selected, all otherwise eligible catalog products must be shown.

The filter must work in both carousel and grid modes. Changing the filter must not change product availability, product selection, or the saved catalog view preference.

The filter menu remains open while category checkboxes are changed. Its trigger shows the number of selected categories. A “All categories” action clears the filters and closes the menu.

When the active filter matches no products, the catalog must explain that there are no matches and provide a clear action to remove the category filters.

Category labels must be displayed as authored in the catalog data. The filter and its controls must be operable by keyboard and have accessible names and states. Category filter state is temporary and does not need to persist across visits.

### RF-012 — Interface Localization

The application must provide English (`en`) and Brazilian Portuguese (`pt-BR`) interface content. English is the default at `/`; Portuguese is available at `/pt-BR`.

Visitors must be able to switch languages. Save the choice in local storage as `personal-catalog-locale` and restore it on later visits, routing English to `/` and Portuguese to `/pt-BR`.

Translate application-owned copy, accessible names, document language, page and social metadata, generated contact messages, and locale-sensitive formatting. Format prices with the catalog's currency code; do not convert currencies.

Display publisher-authored catalog values as written in the YAML. Do not translate product names, descriptions, conditions, categories, combo content, or image alternative text.

Changing language must not change the selected products, catalog view, theme, or catalog values.

### RF-013 — Home Presentation and Footer

The header must show the localized Personal Catalog wordmark and controls for Items, About, general WhatsApp contact, language, and theme.

The classic hero is the default. It includes a heading, short introduction, collection illustration, and link to the catalog. A generic campaign hero may be selected through static configuration. It reuses the collection illustration; its countdown is shown only when a valid ISO 8601 end timestamp with an explicit timezone offset is configured. When the configured deadline passes, show the localized ended state. No campaign deadline is configured by default.

The About section and footer must use the localized project description, brand mark, Instagram social link, WhatsApp contact link, and email link. The footer also provides catalog navigation and a back-to-top link. Show the email address in a selectable tooltip on hover and keyboard focus; on mobile touch, the first tap reveals it and the second opens the email action. Tracked contact destinations and catalog content must be fictional demonstration values; publishers must replace contact destinations before publishing their own copy.

The interface must identify itself as a public demonstration and must not imply that the fictional contact links reach a real person.

## 6. Interface and Accessibility Requirements

The Personal Catalog interface must remain usable, understandable, and consistent across the supported viewport sizes, input methods, and visual themes.

### 6.1 Responsive Behavior

The interface must adapt to desktop, tablet, and mobile layouts without removing essential product information or functionality.

Responsive transitions should be determined by the available space and content needs rather than by assumptions about specific device models.

On larger layouts:

- The hero may present its textual content and collection illustration side by side.
- The catalog should display multiple products simultaneously when sufficient space is available.
- Product details should use a two-column layout when appropriate, separating product media from information and actions.
- The product selection review should be presented as a contained modal interface.

On smaller layouts:

- Header controls must adapt to narrow viewports while keeping item, About, contact, locale, and theme actions accessible.
- The hero content must adapt to a stacked layout when necessary.
- The catalog must remain comfortably browsable without requiring horizontal page scrolling.
- Product details must adapt to a single-column layout.
- The product selection review must use the available viewport space appropriately and may become near-fullscreen.
- Media navigation must remain usable through touch interaction.

Exact numeric breakpoints are implementation decisions and are not defined by this specification.

### 6.2 Keyboard Interaction and Focus

All interactive controls required for the main user flows must be operable using a keyboard.

Keyboard focus must always have a clearly visible visual state.

Focus order must follow a logical sequence consistent with the visual and interaction hierarchy of the interface.

Opening a product details modal, lightbox, or selection review must move interaction context appropriately into the opened interface.

Closing an overlay interface must restore focus to an appropriate element in the previous interaction context whenever possible.

The Escape key must close the topmost dismissible interface layer without unnecessarily closing underlying interface layers.

Sequential media navigation in the lightbox must support appropriate keyboard controls.

### 6.3 Modal and Overlay Behavior

Modal dialogs and lightboxes must clearly distinguish their active content from the underlying page.

When an overlay requires focused interaction, underlying page controls must not interfere with that interaction.

Closing a product detail modal must return the visitor to their previous catalog context.

Closing a media lightbox must return the visitor to the corresponding product detailed view.

Only the topmost dismissible layer should be closed by a single dismissal action.

On mobile layouts, the selection summary bar must not obstruct product details, the lightbox, or the selection review.

### 6.4 Visual Accessibility

Text and essential interface elements must maintain sufficient contrast against their backgrounds in both light and dark themes.

Information and interaction states must not be communicated through color alone.

Reserved products must have a textual reserved badge. Available products do not need a status badge; their selection action indicates that they can be selected.

Selected products must remain distinguishable through more than a subtle color change when necessary for clear interaction feedback.

Interactive controls must remain visually distinguishable from non-interactive content.

Text must remain readable and interface controls must remain understandable when the layout adapts across supported viewport sizes.

### 6.5 Motion and Interaction Feedback

Interactive actions must provide sufficient feedback for visitors to understand changes in interface state.

Selection and deselection actions must visibly communicate the resulting state.

Opening and closing interface layers should maintain clear spatial and interaction continuity.

Non-essential animation and motion effects should respect the visitor's reduced-motion preference.

Motion must not be required to understand essential product information or complete the main user flows.

## 7. Data Model

The data model is defined by the YAML catalog and its TypeScript validation model.

### 7.1 Product

A product represents one indivisible commercial item offered by the owner.

Each product must contain:

- A unique and stable identifier.
- A name.
- A description.
- A price expressed in the single currency configured for the catalog.
- A non-negative price in integer cents, formatted using the catalog's root-level currency code.
- A condition.
- An availability state.
- A required cover image.

A product may also contain:

- An optional discounted price in cents, lower than the original price when greater than zero. Empty or zero values mean no discount.
- Additional condition details.
- Optional product specifications represented as a paragraph string.
- A collection of combo items when the product represents a bundle or combo.
  - Optional shipping measurements stored for reference; the current application does not display them.

A combo must still be represented as one product. Its individual contents are descriptive parts of that product and must not be treated as independently selectable products.

### 7.2 Product Availability

The supported product availability states are:

- `available`
- `reserved`
- `sold`

The behavioral meaning of each availability state is defined by RF-005.

### 7.3 Product Media

A product must contain:

- A required `coverImage` object containing `src` and `alt`.
- An optional `images` list of image objects containing `src` and `alt`.
- An optional `videos` list of video objects containing `source` and `src`, with an optional `poster`.

The field name identifies the media role; media objects must not repeat it in a `type` field. Image and video objects must not contain an `isMain` field. Each video must identify its source as `youtube` or `local`.

### 7.4 Combo Items

A combo item represents an individual item contained within an indivisible product bundle.

Combo items exist to describe the contents of the bundle and must not behave as independent products.

A combo item must contain:

- A name.

A combo item may also contain:

- A description when additional identification or context is useful.
- Optional specifications represented as a paragraph string and displayed after the item's description within the combo list.

Price, availability, selection behavior, and shipping information belong to the parent product rather than to its individual combo items.

### 7.5 Shipping Information

Products may provide physical package measurements for reference.

Shipping information must support:

- Weight.
- Width.
- Height.
- Length.

For a combo product, shipping information represents the complete packaged combo rather than its individual contents.

Measurements use grams and centimeters. They are not displayed by the current application.

### 7.6 Product Selection

A visitor's current product selection is interaction state and must remain conceptually separate from product data.

The selection references products but must not modify the products themselves.

A selected product's availability, price, media, or other product data must not change as a consequence of being selected.

The selection must support:

- Zero or more selected products.
- Unique product membership.
- Removal of individual selected products.
- Calculation of the combined value of the currently selected products.

Selection state exists in memory only and is cleared when the page is reloaded or the visitor leaves the page. It is not written to local storage or a server.

## 8. Technical Constraints

The technical architecture of Personal Catalog must remain proportional to the product's actual requirements and explicit learning objectives.

The project intentionally uses technologies from the modern React and TypeScript ecosystem as part of its educational and professional goals. Technologies, infrastructure components, runtime services, and dependencies beyond the defined core stack must not be introduced without a concrete product or project need.

### 8.1 Core Technology Stack

The project must use:

- Next.js 16 with the App Router as the primary web framework.
- React 19 as the user interface library.
- TypeScript as the primary programming language for application logic and the product data model.
- Native CSS with co-located CSS Modules and semantic custom properties as the styling approach.

Component styles should be scoped with CSS Modules. Global CSS should be limited to reset and base behavior, document defaults, design tokens, theme selection, and genuinely shared rules.

The project should use the capabilities provided by this stack before introducing additional frameworks or overlapping technologies.

### 8.2 Rendering and Client-Side Interaction

The project should use the simplest rendering and execution model appropriate to each requirement.

Client-side React behavior should be introduced where browser interaction or client-managed state requires it, including experiences such as product selection, interactive overlays, media navigation, and theme switching.

Components and application areas that do not require client-side behavior should not be made client-side solely for implementation convenience.

The choice between server-side and client-side execution must not change the product behavior defined elsewhere in this specification.

The application is configured for a static export. `npm run build` produces the static site in `out/`. `SITE_URL` supplies the absolute HTTP or HTTPS origin used by metadata and is required for a production build; development defaults to `http://localhost:3000`.

### 8.3 Product Data Storage

The MVP must use structured, typed, file-based product data rather than a database.

The product data structure must follow the conceptual model defined in Section 7.

The application must use `data/catalog.yaml` as the source of truth for product records and the required ISO 4217 currency code when that file exists. If it is absent, the application must read and validate `data/catalog-example.yaml` as the catalog source. The currency code is a required root-level string, such as `currency: "BRL"`, and applies to all products in the catalog; per-product currency overrides are not supported. The application must parse and validate the selected file and map its values to the existing TypeScript product model. Invalid required data must fail validation rather than silently produce an incomplete catalog or incorrectly formatted prices. Changing the configured currency changes price formatting only and does not perform exchange-rate conversion or adjust product amounts.

The WhatsApp phone number, email address, and Instagram profile URL are static site information defined and validated in `src/config/site.ts`. These values are public when rendered or used in generated contact links. Tracked values are fictional examples and must not include a personal author profile.

Both YAML files must reside outside `public/`. `data/catalog.yaml` is excluded from version control and overrides the tracked example when present. The application must not expose either YAML file itself through a public URL; information intentionally displayed or used by the public site remains public. Changing the selected catalog data requires a new build and deployment to update the published site.

A `data/catalog-example.yaml` template remains in the repository and provides the catalog used when no local `data/catalog.yaml` exists. It may also be copied to the ignored `data/catalog.yaml` and edited there to override the example. Example records and every referenced media asset are intentionally distributed as public demonstration content.

A database must not be introduced into the MVP unless the specification is updated with a requirement that demonstrates a concrete need for persistent server-managed data.

### 8.4 Server-Side Functionality

The MVP must not require a separate backend application.

When server-side endpoints are required, the project should initially use Next.js Route Handlers and the server capabilities available within the Next.js application.

Server-side functionality should be introduced only when required by a product capability, security boundary, external service integration, or other concrete technical need.

A separate backend service or framework should only be introduced if future requirements make the capabilities provided by Next.js insufficient or unnecessarily difficult to maintain.

External service credentials, private configuration, or other secrets must never be exposed through client-side code.

### 8.5 Dependencies

Third-party dependencies beyond the defined core stack must be introduced only when they provide a clear benefit that is not reasonably covered by the existing project stack or a simple maintainable implementation.

Dependencies must not be added solely to increase the number of technologies represented in the project.

Any dependency that significantly affects the project architecture or introduces substantial runtime complexity should have a documented justification.

### 8.6 Development Environment

The project uses Node.js 24 and npm. Docker is not required.

### 8.7 Architectural Evolution

Technical decisions must remain open to revision when product requirements or explicit learning objectives change.

Significant architectural changes, including the introduction of a database, separate backend service, additional application framework, or persistent server infrastructure, must be justified before implementation.

The specification must be updated when such changes alter previously defined product behavior, constraints, or architectural assumptions.

### 8.8 Internationalization

The public interface supports English (`en`) and Brazilian Portuguese (`pt-BR`). English is the default locale at `/`; Portuguese is served at `/pt-BR`. A language control lets the visitor switch between them, and the selected language is saved in local storage under `personal-catalog-locale`.

Internationalized application-owned content includes visible labels and messages, navigation, buttons, empty and error states, accessible names and descriptions, document language, page and social metadata, and generated contact messages. Locale-aware formatting of application-generated values such as prices and counts must follow the selected interface language while using the currency configured in `data/catalog.yaml`. The currency code selects display formatting only; the application does not convert amounts between currencies.

Product and category content supplied through `data/catalog.yaml` is authored by the catalog publisher and must be displayed as written, without translation or language-based fallback. This includes product names, descriptions, condition labels and details, category labels, combo item names and descriptions, and media alternative text. The YAML schema does not need duplicate locale fields solely for interface internationalization.

The language choice must not change catalog data, product or selection behavior, contact destination, visual theme, or responsive behavior. The language control must remain accessible by keyboard and assistive technology.

## 9. Security and Privacy

Personal Catalog must follow a data-minimization approach and must not collect, expose, or persist information that is not required by its defined product capabilities.

The application must treat any information delivered to the visitor's browser as publicly accessible, regardless of whether the original source file or server-side project data is committed to the public repository.

### 9.1 Public and Private Product Data

Only product information intended for public display or required for public product behavior may be delivered to the visitor's browser.

The tracked demonstration catalog and referenced media are public. Publishers must not put private product information in the public catalog. The ignored local catalog override is not committed, but any values rendered into a published application are still public.

Products or product information that are not intended to be public must not be included in publicly delivered application data.

### 9.2 Secrets and Private Configuration

API credentials, access tokens, private keys, and other secrets must never be committed to the public repository or exposed through client-side code, static assets, or responses sent to visitors.

Secrets required by external integrations must only be accessed within an appropriate server-side execution context.

Private configuration used by server-side integrations must not be exposed to the client unless that specific information is intentionally public.

### 9.3 Visitor Data

The MVP must not require user accounts or persistent visitor profiles.

The application must not collect or persist personal visitor information unless a defined product capability requires it.

When visitor-provided information is required for a temporary operation, only the minimum information necessary for that operation should be processed.

Information used for a temporary operation should not be persisted unless persistence is explicitly required by the specification.

### 9.4 External Services

Communication with external services that requires private credentials must occur through an appropriate server-side boundary.

The application must expose only the external service data required by the corresponding product capability.

Visitor-provided input used in external service requests must be validated before being used by server-side integrations.

Responses from external services must not be assumed to be valid or safe solely because they originate from a trusted provider.

The application must not expose external service credentials, unnecessary provider metadata, or private configuration when returning integration results to the client.

### 9.5 External Contact

Contact actions may direct visitors to an external communication service such as WhatsApp.

Context generated for external contact must contain only the information required to identify the relevant product or selection and support the intended conversation.

Initiating external contact must not cause Personal Catalog to persist personal visitor information.

### 9.6 Content Rendering

Product content must be rendered using safe framework mechanisms.

Product data must not require arbitrary executable script content.

Raw or externally supplied HTML must not be rendered without an explicit requirement and an appropriate security review.

### 9.7 Future Security Requirements

Any future capability that introduces authentication, persistent personal data, payments, persistent orders, or other sensitive operations requires a new security and privacy review before implementation.

Such capabilities must not inherit the MVP's security assumptions without reevaluating the risks introduced by the new requirements.

### 9.8 Public Distribution and Privacy

The application is open source under the MIT License. The license applies to first-party source code, documentation, icons, illustrations, sample catalog data, and sample media. Third-party dependencies and typefaces remain subject to their own licenses.

The repository must use public-safe demonstration content and clearly fictional contact destinations. It must not include secrets, credentials, private configuration, private catalog content, or private contact information. Documentation must identify example contact values and explain that publishers should replace them only with information they intend to publish.

The public version must be runnable without private files or deployment credentials. The package identifier is `personal-catalog`; browser preferences use the `personal-catalog-*` local-storage namespace. Selection remains in memory only.

The public demonstration must not send visitors to a real person's contact channels. Tracked contact destinations are fictional examples. Any new unresolved product decision must be recorded before implementation.

## 10. MVP Validation and Release Criteria

The Personal Catalog MVP may be considered ready for its initial public release only after the implemented product has been validated against the requirements defined by this specification.

Validation must consider the complete visitor experience rather than only isolated components or individual acceptance criteria.

### 10.1 Functional Validation

Before release:

- All functional requirements included in the MVP must satisfy their defined acceptance criteria.
- Visitors must be able to complete the primary product journey from catalog discovery to contacting the owner.
- Available and reserved products must behave according to the availability rules defined in RF-005.
- Sold products must not be exposed through the public catalog or product-detail flow.
- Product details and supported product media must remain accessible through their defined interactions.
- Product selection must correctly support adding, reviewing, and removing eligible products without creating orders or reservations.
- Selection count and combined item value must remain consistent with the products currently selected.
- Individual product contact and selection-based contact must provide the context required by RF-007.
- Light and dark themes must preserve the same product content and functionality.

Deferred capabilities defined in Section 4 must not block the MVP release.

### 10.2 Interface and Accessibility Validation

The primary visitor flows must be reviewed across representative desktop, tablet, and mobile viewport sizes.

Before release:

- Essential content and functionality must remain usable without unintended horizontal page scrolling.
- Navigation, catalog browsing, product details, media inspection, selection, and contact actions must remain usable across the supported layout ranges.
- Primary interactive controls must be operable using keyboard navigation where required by Section 6.
- Keyboard focus must remain visibly identifiable.
- Modal and overlay dismissal behavior must preserve the expected interaction context.
- Essential information and interface states must not rely on color alone.
- Both light and dark themes must maintain sufficient visual readability and interaction clarity.
- Non-essential motion must not prevent visitors who prefer reduced motion from completing the main user flows.

Exact numeric viewport breakpoints are not release criteria unless they are later defined by the specification.

### 10.3 Technical Validation

The release candidate must successfully complete the project's defined automated validation commands.

At minimum:

- The production build must complete successfully.
- TypeScript validation must complete without unresolved type errors.
- Automated linting or equivalent static analysis configured by the project must complete without unresolved release-blocking errors.
- The application must not depend on a database or separate backend service unless the specification has been updated to require one.
- Production behavior must remain consistent with the architecture and technical constraints defined in Section 8.

Additional automated tests may be introduced as the implementation evolves. When such tests cover MVP requirements, they should form part of the release validation process.

### 10.4 Security and Privacy Validation

Before release, the production application and its configuration must be reviewed against Section 9.

The release must verify that:

- No secrets or private credentials are exposed through client-side code or publicly delivered assets.
- No secrets or private credentials required by deployment are committed to the public source history intended for distribution.
- Product information exposed to visitors is intentionally public.
- Private or unpublished product information is not unintentionally included in publicly delivered application data.
- Private contact information is not exposed unless explicitly intended to be public.
- External contact actions include only the context required by the defined contact flow.
- No persistent visitor information is collected unless explicitly required by the specification.

### 10.5 MVP Release Readiness

The MVP is ready for initial public release when:

- The functional requirements included in the MVP satisfy their acceptance criteria.
- The primary visitor journey can be completed without a release-blocking failure.
- The interface and accessibility validation defined in this section has been completed.
- The project's required production build, type validation, and configured static analysis complete successfully.
- The security and privacy validation defined in this section has been completed.
- No known release-blocking defect prevents the intended catalog, product evaluation, selection, or contact flows.
- Any remaining incomplete functionality is explicitly identified as deferred or out of scope by this specification.

The public application is the primary project deliverable and follows the distribution and privacy requirements defined in Section 9.

## 11. Acceptance Criteria

The following acceptance criteria define the verifiable conditions used to validate the functional requirements in Section 5.

Each acceptance criterion is associated with the functional requirement identified by its corresponding numeric prefix.

- CA-001-01 — Visitors can access and browse the catalog without authentication.
- CA-001-02 — The catalog displays all products eligible for public display according to RF-005.
- CA-002-01 — Every product card displays the product's cover image.
- CA-002-02 — Reserved products display a localized reserved badge; available products do not display an availability badge.
- CA-002-03 — Every product card displays the product's name.
- CA-002-04 — Every product card displays the product's condition.
- CA-002-05 — Every product card displays the product's price.
- CA-002-06 — A product representing a bundle or combo is clearly identifiable as containing multiple items.
- CA-002-07 — A visitor can access a product's detailed view from its product card.
- CA-002-08 — An available product exposes a selection control directly from its card.
- CA-002-09 — A product that cannot be selected does not expose an enabled selection action.
- CA-002-10 — Product images are displayed without unnecessarily cropping relevant product content.
- CA-003-01 — A visitor can open the detailed view of a product from the catalog.
- CA-003-02 — Opening a product's detailed view does not navigate the visitor away from the catalog.
- CA-003-03 — The detailed view displays the media associated with the selected product.
- CA-003-04 — The detailed view displays the product's name, category, price, condition, and description; it displays a reserved badge only for reserved products.
- CA-003-05 — Additional condition information is displayed when it exists for the selected product.
- CA-003-06 — When the selected product is a bundle or combo, the detailed view lists the items included in it.
- CA-003-07 — The detailed view exposes the actions applicable to the product's current availability state.
- CA-003-08 — Package weight and dimensions are not displayed as part of the default product details.
- CA-003-09 — A visitor can close the detailed view and return to the catalog without unnecessarily losing their previous browsing context.
- CA-003-10 — Non-empty product specifications are displayed after the description; missing, null, empty, or whitespace-only values are ignored.
- CA-003-11 — Non-empty combo-item specifications are displayed after each item's description; missing, null, empty, or whitespace-only values are ignored.
- CA-004-01 — Every product displayed in the public catalog has a valid `coverImage`.
- CA-004-02 — A product may omit `images` and/or `videos` while retaining its required `coverImage`.
- CA-004-03 — The `coverImage` is displayed when product details open and remains the detail view's primary image.
- CA-004-04 — Photo thumbnails open a lightbox containing only additional images; video thumbnails open a lightbox containing videos. The cover image is excluded from the lightbox.
- CA-004-05 — The thumbnail limit is five on desktop and three on mobile, and the combined image/video count determines whether groups appear. Separate labeled groups appear only when both media types exist and exceed the active limit; a single media type stays in one untitled row. Overflow uses `+N` after the active limit. On mobile, group headings omit the reserved icon space.
- CA-004-06 — Video media is visually distinguishable from image media before playback.
- CA-004-07 — Selecting a photo or video thumbnail opens that media in the lightbox; the cover image is not interactive.
- CA-004-08 — The visitor can navigate between items of the selected media type while the lightbox remains open.
- CA-004-09 — On desktop interfaces, visible controls allow navigation between media items in the lightbox.
- CA-004-10 — On desktop interfaces, keyboard controls allow navigation between media items in the lightbox.
- CA-004-11 — On touch-oriented mobile interfaces, horizontal swipe gestures allow navigation between media items in the lightbox.
- CA-004-12 — Closing the lightbox returns the visitor to the same product detailed view.
- CA-005-01 — A product with the `available` state is displayed in the public catalog.
- CA-005-02 — A visitor can open the detailed view of an `available` product.
- CA-005-03 — An `available` product can be added to the visitor's selection.
- CA-005-04 — A visitor can express interest in an `available` product.
- CA-005-05 — A product with the `reserved` state is displayed in the public catalog.
- CA-005-06 — A visitor can open the detailed view of a `reserved` product.
- CA-005-07 — A `reserved` product cannot be added to the visitor's selection.
- CA-005-08 — A visitor can still express interest in a `reserved` product.
- CA-005-09 — A product with the `sold` state is not displayed in the public catalog.
- CA-005-10 — A `sold` product cannot be reached through the public product-detail flow.
- CA-005-11 — Reserved products display a localized reserved badge; available products do not display an availability badge.
- CA-005-12 — The detailed view of a reserved product displays a localized “Reserved” badge beside its category label.
- CA-006-01 — A visitor can add an `available` product to the current selection.
- CA-006-02 — A `reserved` product cannot be added to the current selection.
- CA-006-03 — A `sold` product cannot be added to the current selection through the public catalog experience.
- CA-006-04 — Selecting a product does not change its availability state.
- CA-006-05 — Selecting the same product again does not create a duplicate entry in the selection.
- CA-006-06 — A visitor can remove one selected product without removing other selected products.
- CA-006-07 — A selected bundle or combo counts as one selected product.
- CA-006-08 — Individual items within a selected bundle or combo cannot be independently selected or removed.
- CA-006-09 — The interface clearly indicates when a product is currently selected.
- CA-006-10 — The persistent selection summary bar is displayed when at least one product is selected and no product detail or selection dialog is open.
- CA-006-11 — The persistent selection summary bar is not displayed when there are no selected products or while a product detail or selection dialog is open.
- CA-006-12 — The selection summary displays the correct number of selected products.
- CA-006-13 — The selection summary shows the effective total; the review shows the original total, savings, and effective total using active discounts.
- CA-006-14 — A visitor can open the current selection and review its products.
- CA-006-15 — Each product in the selection review displays its image, name, and price.
- CA-006-16 — A selected bundle or combo is clearly identified as containing multiple items.
- CA-006-17 — A visitor can open a selected product's detailed view from the selection review.
- CA-006-18 — A visitor can access an action to contact the owner about the current selection.
- CA-006-19 — The selection interface does not present the selection as a shopping cart, order, checkout, or completed purchase.
- CA-006-20 — Unselected products use the localized “Add to box” action and `/icons/box-open.svg`; selected products use “Remove from box” and `/icons/box-closed.svg`.
- CA-007-01 — A visitor can access a general contact action without selecting or opening a product.
- CA-007-02 — The primary contact action opens WhatsApp using the configured destination and general contact message.
- CA-007-03 — An `available` product provides a contextual contact action from its detailed view.
- CA-007-04 — A `reserved` product provides a contextual contact action from its detailed view.
- CA-007-05 — Contact initiated from an individual product identifies that product and its current price.
- CA-007-06 — When at least one product is selected, the visitor can initiate contact about the current selection.
- CA-007-07 — Contact initiated from a selection identifies every selected product.
- CA-007-08 — Contact initiated from a selection includes the price of each selected product.
- CA-007-09 — Contact initiated from a selection includes the correct combined item value.
- CA-007-10 — Initiating contact does not change the availability state of any product.
- CA-007-11 — Initiating contact does not create an order, checkout, reservation, or purchase within Personal Catalog.
- CA-007-12 — The footer provides configured Instagram, WhatsApp, and email links; Instagram is for social discovery and WhatsApp/email provide contact actions.
- CA-008-01 — The interface can be displayed using the light theme.
- CA-008-02 — The interface can be displayed using the dark theme.
- CA-008-03 — When no manual theme preference is active, a visitor whose system prefers a light color scheme initially receives the light theme.
- CA-008-04 — When no manual theme preference is active, a visitor whose system prefers a dark color scheme initially receives the dark theme.
- CA-008-05 — A visitor can manually switch from the light theme to the dark theme.
- CA-008-06 — A visitor can manually switch from the dark theme to the light theme.
- CA-008-07 — A manual theme selection takes precedence over automatic system preference detection while the manual selection is active.
- CA-008-08 — Switching themes does not alter page content, product data, current product selection, navigation state, or available functionality.
- CA-008-09 — Essential content, controls, and interface states remain visually distinguishable in both themes.
- CA-008-10 — A manual theme choice is stored under `personal-catalog-theme` and overrides the system preference on later visits.
- CA-009-01 — The catalog defaults to carousel mode and supports switching to grid mode.
- CA-009-02 — The selected catalog view is stored under `personal-catalog-view`; invalid stored values fall back to carousel mode.
- CA-010-01 — A missing, empty, null, or zero discounted price is treated as no discount.
- CA-010-02 — A positive discounted price lower than the original price passes validation.
- CA-010-03 — A discounted price equal to or greater than the original price fails validation.
- CA-010-04 — Product cards show the calculated discount percentage, discounted price, and struck-through original price when discounted.
- CA-010-05 — Product details show the calculated discount percentage, discounted price, and struck-through original price when discounted.
- CA-010-06 — Selection entries show the effective price and the original price when discounted.
- CA-010-07 — The selection review shows original subtotal, the sum of individual savings, and the effective total.
- CA-010-08 — Selection totals and generated contact messages use effective product prices.
- CA-011-01 — The catalog provides a button that opens a list of configured product categories.
- CA-011-02 — A visitor can select and clear one or more categories using keyboard-accessible controls.
- CA-011-03 — The catalog immediately shows products matching any selected category.
- CA-011-04 — With no category selected, the catalog shows all otherwise eligible products.
- CA-011-05 — Category filtering works in both carousel and grid modes.
- CA-011-06 — Changing category filters does not change the current product selection or saved catalog view preference.
- CA-011-07 — When no products match, the catalog explains the empty result and provides an action to clear filters.
- CA-011-08 — Category labels in the filter match the catalog-authored labels.

### 11.1 Interface Localization Acceptance Criteria

- CA-012-01 — The application supports Brazilian Portuguese (`pt-BR`) and English (`en`) interface languages.
- CA-012-02 — English is the default interface language at `/`; Brazilian Portuguese is served at `/pt-BR`.
- CA-012-03 — A visitor can change the interface language using an accessible control.
- CA-012-04 — The selected language applies consistently to all application-owned public copy, including navigation, catalog controls, product actions, selection UI, footer, statuses, and feedback messages.
- CA-012-05 — Accessible names, descriptions, and dynamic announcements use the selected interface language.
- CA-012-06 — The document language and page/social metadata reflect the selected interface language.
- CA-012-07 — Application-generated contact messages use the selected interface language and preserve the existing contact context and non-transactional meaning.
- CA-012-08 — Application-generated price, count, and other locale-sensitive formatting follows the selected language and uses the catalog's configured ISO 4217 currency code for prices; changing the code does not trigger currency conversion.
- CA-012-09 — Text and labels supplied through `data/catalog.yaml` are displayed as authored and are not translated or replaced based on interface language.
- CA-012-10 — Changing the interface language does not alter catalog values, selection membership, availability, theme, navigation context, or responsive behavior.
- CA-012-11 — The selected interface language remains active while the visitor navigates the site and opens or closes its overlays.
- CA-012-12 — The selected language is stored under `personal-catalog-locale` and restores the matching route on later visits.

### 11.2 Home Presentation Acceptance Criteria

- CA-013-01 — The header provides localized navigation to the catalog and About section, general contact, locale switching, and theme switching.
- CA-013-02 — The classic hero is the default and includes a localized heading, introduction, illustration, and catalog link.
- CA-013-03 — The optional campaign hero uses generic localized copy and the collection illustration; the countdown is absent unless a valid configured deadline is provided.
- CA-013-04 — The About/footer area displays the localized demo description, project mark, configured social/contact links, catalog navigation, and back-to-top action.
- CA-013-05 — Tracked catalog records and contact destinations are fictional demonstration values.
- CA-013-06 — The email link exposes its address through a keyboard and pointer tooltip; on mobile, the first tap reveals the address and the next tap opens the email action.
- CA-013-07 — A configured campaign deadline must be a valid ISO 8601 timestamp with an explicit offset; after it passes, the localized ended state is displayed.

## 12. Future Considerations

The following decisions are outside the current implementation and require new requirements before work begins:

- Whether catalog size will eventually justify search, pagination, or incremental loading.
- Whether visitor selection should ever persist across reloads or visits. The current behavior is explicitly in-memory only.
- Whether to add analytics, administration, or a managed catalog service.

Responsive breakpoints are content-driven implementation details; no exact viewport widths are prescribed. The brand direction, footer behavior, locale defaults, saved theme/view preferences, MIT scope, and public-demo identity are resolved and are not open questions.

## 13. Technical and Language Conventions

- Project documentation must be written in English.
- Source code identifiers must be written in English.
- Technical comments should be written in English when comments are necessary.
- Commit messages must be written in English.
- Instructions intended for AI coding agents must be written in English.
- The public interface is localized in English (`en`) and Brazilian Portuguese (`pt-BR`), with English at `/` as the default and Portuguese at `/pt-BR`.
