# VODE

Next.js catalogue, persistent Zustand cart, and WhatsApp checkout. No payment gateway is used.

## Run

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business number including country code, using digits only. Restart development after changing it. Production builds must have this variable set at build time; rebuild to change the number.

The local number uses India's +91 country code, assumed from the rupee pricing and pincode fields. Local environment files are ignored by Git.

## Catalogue

The starter catalogue in `lib/products.ts` contains **sample products and prices**, with local illustrations in `public/products`. Replace these with approved VODE catalogue data and photography before launch. Sizes and colors come from this catalogue. Persisted items are validated against it and prices refreshed during hydration.

## Ordering

- Product page → choose size/color → add to bag → checkout.
- Same product/size/color merges quantities, including size edits in the bag.
- Quantity range is 1–999 per variation; use Remove to delete an item.
- The cart is stored under `vode-cart` with Zustand persistence. Hydration runs after mount to keep server and initial client markup consistent.
- Indian delivery fields are validated before a WhatsApp message opens in a new tab. Email, second address line, landmark, and notes are optional.
- The checkout includes a fallback WhatsApp link. Opening it does not send the message or confirm the order; the customer must send it.
- Cart contents remain until manually removed or cleared. Customer delivery details stay in component memory and are not persisted.
- The product total excludes delivery charges; VODE confirms availability, delivery, and payment arrangements manually.

## Checks

```sh
npm run lint
npm run build
npm test
npm run test:e2e
```

Unit tests cover cart mutations, persistence recovery, input validation, totals, and message encoding. Browser tests use installed Microsoft Edge in headless mode, test desktop and mobile sizes, and intercept WhatsApp URLs so no order is sent. Set `PLAYWRIGHT_CHANNEL=chromium` to use Playwright's downloaded Chromium instead.
