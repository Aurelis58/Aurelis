# Aurelis — Site Reference

A static, content-driven storefront for handmade crochet, ribbon bouquets, and personalized letters. All copy and product data live in `content.json`; `script.js` binds that data into the HTML shells at runtime, and `styles.css` holds the visual theme.

## File Map

| File | Role |
|---|---|
| `index.html` | Home page — hero, category tiles, product grid, "the craft" promo, promise section |
| `order-crochet.html` | Crochet catalog — pick items, colors and quantity, **Add to Basket** |
| `order-ribbon.html` | Ribbon catalog — pick colors, wrapper and quantity, **Add to Basket** |
| `order-letter.html` | Letter builder — pick border/size, write the letter, **Add to Basket** |
| `basket.html` | Unified basket + checkout — review items from all three categories, enter delivery details, place the order (receipt, PDF, email) |
| `privacy-policy.html` | Legal page, sections driven by `legalPages.privacyPolicy` |
| `terms-and-conditions.html` | Legal page, sections driven by `legalPages.termsConditions` |
| `404.html` | Not-found page (static copy, not content-bound) |
| `content.json` | Single source of truth for all site text, products, pricing, and legal copy |
| `script.js` | Binds `content.json` into the DOM; powers nav, search, order forms, receipts, PDF, email |
| `styles.css` | Theme tokens + layout/component styles |
| `butterfly_crochet.webp` | Product photo — Butterfly keychain |
| `heart_crochet_pink.webp` | Product photo — Heart with Ribbon (pink) |
| `heart_crochet_red.webp` | Product photo — used as hero slide 1 + "the craft" image |
| `mini_bouquet_samples.webp` | Product photo — Mini Bouquet Keychain / hero slide 2 |

## Content Binding System (`script.js`)

Two HTML data attributes drive templating, resolved against `content.json` via `getPath()`:

- `data-bind="path.to.value"` — sets `textContent`
- `data-bind-src` / `data-bind-href` / `data-bind-alt` — sets the matching attribute
- `data-list="key"` — a render target populated by a dedicated function (see below)

| `data-list` value | Rendered by | Source in `content.json` |
|---|---|---|
| `nav-links` | `renderNav()` | `nav.links` |
| `trust` | `renderTrust()` | `trust` |
| `categories` | `renderCategories()` | `categories` |
| `products` | `renderProducts()` | `products` (+ `categories` for icons) |
| `footer-columns` | `renderFooterColumns()` | `footer.columns` |
| `legal-links` | `renderLegalLinks()` | `footer.legalLinks` |
| `legal-sections` | `renderLegalSections()` | `legalPages.<page>.sections` |
| `order-items` | `renderOrderPage()` | `orderPages.<crochet\|ribbon\|letter>` |

The active page is identified by `<body data-page="...">` (`home`, `order-crochet`, `order-ribbon`, `order-letter`, `privacy`, `terms`, `404`), which `script.js` reads on `DOMContentLoaded` to decide what to render.

## content.json Schema (top-level keys)

- `site` — brand name, page title, footer tagline, copyright, order email, currency symbol, and **EmailJS credentials** (`publicKey`, `serviceId`, `clientTemplateId`, `customerTemplateId`)
- `nav.links` — header nav items
- `hero.slides[]` — hero eyebrow/heading/body/CTA/image (only slide 0 is rendered on the current static hero markup)
- `announcement.items[]` — 3-item scrolling announcement bar
- `trust[]` — trust-strip badges (title + detail)
- `categoriesSection` / `categories[]` — shop-by-category tiles
- `productsSection` / `products[]` — homepage product grid (name, category, price display string, image)
- `ritual` — "made slowly, on purpose" promo block
- `promiseSection.items[]` — 3-column promise checklist
- `colorOptions` — customization choices per line:
  - `ribbon.colors[]`, `ribbon.wrapper[]`
  - `crochet.colors[]`
  - `letter.sizes[]` (name, paperSize, dimensions, price) and `letter.borderDesigns[]` (name, image)
- `orderPages.{crochet|ribbon|letter}` — page title/heading/intro, `deliveryFee`, and the `products[]` (name, unit, price) used to build the order form
- `footer.columns[]` / `footer.legalLinks[]`
- `legalPages.{privacyPolicy|termsConditions}` — heading, effective date, `sections[]` (heading + body)

## Basket & Checkout Flow

The site now uses a single unified basket instead of a per-category checkout form. There is no login — the basket is just data in the browser.

**1. Category pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`)**
`renderOrderPage()` builds line items from `orderPages.<page>.products`, with per-item quantity and color/size/border customization pickers (`buildCustomizationEntryHtml`, `buildLetterEntryHtml`) — this part is unchanged from before. What changed is the button at the bottom: instead of collecting delivery details and finalizing an order, it validates the chosen options and calls `addItemsToBasket()`, which appends each line (tagged with its `category`) to a basket array stored in **`localStorage`** under the key `aurelis_basket_v1`. The page then resets its quantities to 0 so the customer can keep shopping, and shows an inline "Added to basket — View Basket" message.

**2. Basket icon**
Every page's header carries a basket icon with a live count badge (`data-role="basket-count"`), kept in sync by `updateBasketBadge()` (called on every page load, and on the `storage` event so multiple open tabs stay in sync). It links to `basket.html`.

**3. `basket.html` — the single checkout step**
- `renderBasketLines()` reads the basket out of `localStorage` and lists every item across all three categories, with its customization summary (or, for letters, the full letter preview card), a line price, and a remove button. Quantity is not independently editable per line here — because each line already carries its own per-unit customization (colors/border/message), changing quantity after the fact would invalidate that detail. To change quantity, the customer removes the line and re-adds it from the category page with the new amount.
- The Delivery Details form, Order Summary, and "Place Order" button are hidden while the basket is empty and revealed once it has items.
- On submit, `initBasketPage()` validates the delivery fields, then reuses the **same** receipt/PDF/email functions as before (`buildReceiptPdf()`, `sendOrderEmails()`, `showReceipt()` — these already only depended on a generic `items`/`totals`/`customer` shape, so no changes were needed there) to confirm the order across all categories in one email and one printable receipt. The basket is cleared after a successful submit.

Payment remains cash on delivery only — no payment details are ever collected.

External scripts (`@emailjs/browser` via jsdelivr CDN, `jspdf` via cdnjs CDN) now load only on `basket.html`, since that's the only page that emails or generates a PDF.

## Design Notes on the New Basket

- **One basket, all categories** — items from crochet, ribbon, and letters sit in the same basket and are checked out together in one order/one email, per the client's request.
- **Persistent** — the basket is saved in the browser's `localStorage`, so it survives closing the tab or navigating away. It's per-browser/per-device, not account-based (there's no login system on this site).
- **Add to Basket, not "forms"** — the delivery-details form (name/phone/address) is gone from the category pages and now appears once, on `basket.html`, at actual checkout. The color/size/border pickers on the category pages remain, since the shop still needs to know what to make for each custom piece — those aren't the "checkout form" the client wanted removed, they're product options.

## Security Notes

- `index.html`, `privacy-policy.html`, and `terms-and-conditions.html` carry a `Content-Security-Policy` meta tag scoped to: self, Google Fonts, and the two CDNs above for scripts, plus `api.emailjs.com` for form submissions.
- The order pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`) and `404.html` do **not** currently carry that same CSP meta tag — worth adding for consistency since the order pages are the ones actually loading the EmailJS/jsPDF scripts and calling out to `api.emailjs.com`.

## Known Data Gaps / Inconsistencies

- Image paths in `content.json` are inconsistent: most product/hero images use `assets/images/...`, but `hero.slides[2].image` ("images/hero-custom.jpg"), `products[3].image` ("images/product-letter.jpg"), and all `letter.borderDesigns[].image` entries use a bare `images/...` path — confirm the real folder structure before deploying so these don't 404.
- `hero-custom.jpg`, `product-letter.jpg`, and the six `border-*.jpg` border-design images referenced in `content.json` were not among the uploaded assets — only the four `assets/images/*.webp` product photos were provided.

## Theme Tokens (`styles.css`)

```
--cream:         #FFF7E6
--blush:         #F7C8D3
--blush-soft:    #FBE1E7
--rosewood:      #B46A72   (primary accent — logo, links, CTAs)
--rosewood-deep: #8f4d55
--sage:          #A8B58A
--sage-deep:     #8a9970
--mist:          #A9B7C6
--midnight:      #2D3A47
--ink:           #3a3128
```

Fonts: **Fraunces** (display/headings), **Parisienne** (script accent), **Jost** (body/UI) — loaded from Google Fonts.

## Product Photos (uploaded)

| Image | Depicts | Used for |
|---|---|---|
| `butterfly_crochet.webp` | Lavender/white crochet butterfly keychain with beaded chain | "Butterfly" product |
| `heart_crochet_pink.webp` | Pink/cream crochet heart keychain with a bow | "Heart with Ribbon" product |
| `heart_crochet_red.webp` | Red/cream crochet heart keychain with a bow | Hero slide 1 image, "The Craft" section image |
| `mini_bouquet_samples.webp` | Five ribbon-rose bouquet keychains in assorted colors | "Mini Bouquet Keychain" product, hero slide 2 image |