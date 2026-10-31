# VODE

A responsive Next.js App Router storefront built with React, TypeScript, Tailwind CSS, locally hosted Cormorant Garamond and Manrope fonts, Motion, Lucide icons and Zustand. Black, white and neutral greys throughout.

## Start

```sh
npm install
npm run dev
```

On PowerShell installations that block npm.ps1, use `npm.cmd` instead. Copy `.env.example` to `.env.local` and configure the business WhatsApp number. Never commit `.env.local`. Public environment changes require a server restart or production rebuild.

## Application structure

- `components/app.tsx`: complete shared App component, navigation and footer.
- `app/layout.tsx`: root document, locally hosted fonts and global metadata.
- `app/page.tsx`: Autumn campaign, the Cotton Signature Drop and brand story.
- `components/shop-shell.tsx`: fixed header, search, wishlist badge, mobile menu and accessible bag dialog.
- `components/catalogue.tsx`: collapsible sidebar with size, colour, price, availability and sorting in shareable URL parameters.
- `components/product-card.tsx`: product cards, hover image/zoom, wishlist and size-aware Add to Cart quick view.
- `components/product-detail.tsx`: image gallery, fullscreen viewer, size guide, quantities and mobile purchase bar.
- `components/checkout.tsx`: React Hook Form and Zod validation, WhatsApp order preparation.
- `lib/config.ts`: brand details, campaign assets, social/contact links and collection content.
- `lib/products.ts`: the only two listed products and their structured data.
- `components/hero-media.tsx`: original campaign film, silently looping without play/pause controls; a matching poster is used for reduced motion or playback failures.
- `components/footer-signature.tsx` / `components/vode-scene.tsx`: a compact, button-free Three.js VODE wordmark. It rotates only while clicking and dragging (or dragging with a finger), then holds the chosen angle on release. Hovering has no effect. Arrow keys provide equivalent interaction; Home resets the angle. Rendering runs only when needed and stops offscreen. A static wordmark remains available if WebGL is unsupported.

The catalogue uses one column below 768px, three from 768px and four from 1280px. Opening filters adds a left sidebar on desktop and an inline collapsible panel on mobile. The homepage's two-shirt editorial layout uses two wide photographs on desktop and one column on mobile.

## The Cotton Signature Drop

Only these shirts are listed:

1. **The 11:11 Cotton Shirt**: photos IMG_9079 and IMG_9084; black pinstripes, red 11:11 and Make a wish embroidery, VODE collar embroidery.
2. **The Que Sera Cotton Shirt**: photos IMG_9112 and IMG_9092; white pinstripes, red Que Sera Sera script and VODE collar embroidery.

Both use the brand-supplied pure cotton description. Optimized copies are in `public/images/drops`; source files were not modified. Images display in their natural colours. Only the interface uses black, white and neutral greys. Each shirt's secondary photograph stays paired with that shirt for hover and gallery views.

**Launch values still need confirmation:** the listed prices, compare-at prices, sizes and per-variant inventory remain preview values. `isSample: true` prevents them from producing merchant offers, being indexed as products, or entering the product sitemap. Set it to false only after replacing the preview commercial data with approved values. No ratings or sales claims are invented.

Removed placeholder products are discarded from restored carts, wishlists and recently viewed lists. Women, Accessories and New Drop were removed from the primary navigation; Men remains. The new-arrivals route still holds the requested Cotton Signature Drop and is accessible from its editorial section.

## Ordering and integrations

- Cart and wishlist persist in browser local storage. Cart prices and variants are checked against the current catalogue on restore.
- The bag supports quantity, size and colour changes, stock limits, removal and clearing.
- Checkout validates Indian mobile and PIN code formats. Delivery details remain in memory, not local storage.
- An order message includes customer/address details, selected variations, quantities, prices, discounts, product total, shipping status and a generated order reference.
- WhatsApp opening never confirms payment or clears the bag. The customer must review/send the message and agree final availability, delivery charges and payment with VODE.
- No card or UPI credentials are collected. Shipping charges are confirmed with the team and are explicitly excluded from the product total.
- Contact enquiries open WhatsApp or the configured email app. Instagram is the fallback if neither is configured.
- Newsletter requests use `NEXT_PUBLIC_NEWSLETTER_EMAIL` to open an email draft. When blank, the form explicitly says coming soon and directs visitors to Instagram. No email marketing integration is simulated.
- Policy pages are clearly labelled pre-launch templates. Add approved business details and terms before launch.

## Verification

The supplied 4K film is served as an H.264 1440×810, 30fps MP4, reduced from about 29 MB to 2.5 MB. The original file in Downloads was preserved. To prepare a replacement with the same output filenames:

```sh
npm exec --yes --package=ffmpeg-static -- node scripts/prepare-hero-video.mjs "PATH_TO_ORIGINAL_VIDEO.mp4"
```

The encoder is a temporary asset-preparation tool; it is not bundled with the website. Replace the video and poster paths in `lib/config.ts` if filenames change. The Three.js typeface is served locally from `public/fonts` with its original font metadata.

```sh
npm test
npm run build
npm run test:e2e
node scripts/design-review.mjs
```

Browser tests use the installed Microsoft Edge in headless mode, test desktop/mobile checkout and SEO, and intercept WhatsApp URLs so no message is sent. The design review checks page responses, headings, image loading and horizontal overflow, then saves screenshots under ignored `test-results/design`. It expects the development server at `http://localhost:3000`.

## Deployment

Deploy this repository to a Next.js-compatible host such as Vercel. Set the variables from `.env.example` in that host, use `npm run build`, and update `NEXT_PUBLIC_SITE_URL` to the production origin. Preview deployments are noindex. Sitemap, robots, canonical URLs, social metadata and breadcrumbs are generated by the app. Only approved products enter the product sitemap.

For Google Search Console, set `GOOGLE_SITE_VERIFICATION` to the HTML tag's content value and rebuild; submit `/sitemap.xml` after verifying ownership. Source changes do not themselves verify ownership or guarantee indexing. Check mobile/desktop performance on the deployed production URL before claiming Lighthouse results.
