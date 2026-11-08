# Personal Catalog

Personal Catalog is a reusable, open-source catalog site for sharing items that are for sale.

**Live demo:** [jexraiden.github.io/personal-catalog](https://jexraiden.github.io/personal-catalog/)

This project began with a personal need: I wanted one place to list items from my collection so people could easily see what I still have available. It also gave me a practical way to practice React and TypeScript, Spec-Driven Development with AI, product design, and UI/UX. The original use case grew out of my experience with [Tesouro Errante](https://www.tesouroerrante.com.br); this repository is a separate, reusable project and a way to share what I learned while building it.

The site lets visitors browse item details and availability, select available items they are interested in, and contact the catalog owner. It does not process purchases, payments, orders, or reservations.

## Use this repository

### Requirements

- Node.js and npm

### Run locally

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:3000`. The project works without a local environment file. To run the available code checks or produce a static build, use:

```bash
npm run lint
npm run typecheck
npm run build
```

The build output is written to `out/`.

### Publish the GitHub Pages demo

The `main` branch is published automatically to [the live demo](https://jexraiden.github.io/personal-catalog/) by the GitHub Actions workflow in `.github/workflows/deploy.yml`. In the repository settings, open **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**. The workflow builds the example catalog and deploys the static output whenever changes are pushed to `main`; it can also be started manually from the Actions tab.

### Add your catalog

Create `data/catalog.yaml` to provide your own catalog. This file is ignored by Git so you can keep your catalog local; the YAML data is read during the build and is not served as a separate public file. If `data/catalog.yaml` does not exist, the site automatically uses [`data/catalog-example.yaml`](data/catalog-example.yaml) and its sample items.

Start by copying the example file, then edit its categories and products. A catalog has a root `currency` (an ISO 4217 currency code; the included example uses `USD`), a `categories` list, and a `products` list. Every product must include:

- `id`: unique, stable identifier.
- `name`, `description`, and `category`: the category value must match a category `id`.
- `priceInCents`: integer amount in the catalog currency's smallest unit (for example, `2245` means $22.45).
- `condition` and `availability` (`available`, `reserved`, or `sold`).
- `coverImage`, with `src` and descriptive `alt` text.

Optional product fields include `specifications`, `discountedPriceInCents`, `conditionDetails`, additional `images`, `videos`, `comboItems`, and `shipping` package measurements. Image and local video paths must point to files included in the project, usually under `public/`. YouTube videos use `source: "youtube"` and an HTTPS YouTube URL; local videos use `source: "local"` and a site path beginning with `/`.

The recommended (but optional) folder layout for product images and videos is the one used under [`public/catalog/example`](public/catalog/example). It groups each product's media into `images/` and `videos/` folders and is useful as a working example when adding your own media.

Example:

```yaml
currency: "USD"

categories:
  - id: "books"
    label: "Books"

products:
  - id: "sample-book"
    name: "Sample Book"
    category: "books"
    description: "A short description of the item."
    specifications: "Hardcover, English-language edition."
    priceInCents: 4500
    discountedPriceInCents: 4000
    condition: "Very good"
    conditionDetails: "Clean pages with light shelf wear on the cover."
    availability: "available"
    coverImage:
      src: "/catalog/sample-book/images/cover.jpg"
      alt: "Cover of the sample book"
    images:
      - src: "/catalog/sample-book/images/back.jpg"
        alt: "Back cover of the sample book"
    videos:
      - source: "local"
        src: "/catalog/example/sample-book/videos/condition.mp4"
        poster: "/catalog/example/sample-book/images/cover.jpg"
      - source: "youtube"
        src: "https://www.youtube.com/watch?v=VIDEO_ID"
    comboItems:
      - name: "Companion booklet"
        description: "A short guide included with the book."
        specifications: "Paperback, 24 pages."
```

The example media paths above are illustrative: add matching files under `public/` or change the paths to files you provide. Replace `VIDEO_ID` with a real YouTube video ID if you keep that entry.

Available items can be selected for an inquiry. Reserved items are marked as reserved and cannot be selected; sold items are omitted from the public catalog. The site does not show an “available” badge.

### Set your contact details

Before publishing a copy, replace the fictional destinations in [`src/config/site.ts`](src/config/site.ts) with the contact details you intend to make public. The contact options are Instagram, WhatsApp, and email, reflecting the original project’s contact channels. These values become part of the generated public site. The checked-in examples do not reach a real person.

The optional `SITE_URL` setting controls the site’s metadata origin. See [`.env.example`](.env.example) for its example format; a production build requires an absolute `http` or `https` origin.

### Choose and customize the hero variant

The homepage supports a classic hero and a campaign hero. This variant structure was created to make it possible to customize the homepage for a special campaign, such as the seasonal promotions originally needed for Tesouro Errante. In [`src/config/hero.ts`](src/config/hero.ts), set `activeHero` to `"classic"` or `"campaign"` to choose which hero the homepage displays.

The included campaign hero is a starting example. Update its localized copy in `src/lib/i18n.ts` (`campaignTitle`, `campaignDescription`, and `campaignCta`) for both English and Brazilian Portuguese, and set its optional countdown in [`src/config/campaign.ts`](src/config/campaign.ts). Use `endsAt: null` to omit the countdown, or provide an ISO 8601 date/time with an explicit timezone offset to show one.

For a campaign with a distinct design or interaction, implement the needed hero component(s), semantic HTML structure, and CSS styles, then connect the variant through `src/config/hero.ts` and the hero component switch in `src/app/_components/home/hero/index.tsx`. Keep campaign-specific content localized and accessible, and retain the classic hero as an option for the regular catalog presentation. The existing `campaign` variant is a configurable example; it does not include every campaign layout or feature a publisher might need.

## Technology

- Next.js with the App Router
- React
- TypeScript
- Native CSS and CSS Modules
- YAML catalog data

## Project documentation

- [Product specification](docs/SPEC.md)
- [Implementation plan](docs/development/IMPLEMENTATION_PLAN.md)
- [Public brand and visual system](docs/design/PUBLIC_BRAND.md)
- [UI guidelines](docs/design/UI_GUIDELINES.md)
- [Asset rights](ASSET-RIGHTS.md)

## License

The application code, documentation, icons, illustrations, and sample catalog and media created for this repository are licensed under the MIT License. This license does not cover original Tesouro Errante materials; those materials are not part of this project's license. Third-party fonts and dependencies retain their own licenses. See [LICENSE](LICENSE) and [ASSET-RIGHTS.md](ASSET-RIGHTS.md).
