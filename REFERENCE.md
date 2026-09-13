# Aurelis — Site Reference

A static, content-driven storefront for handmade crochet, ribbon bouquets, and personalized letters. All copy and product data live in `content.json`; `script.js` binds that data into the HTML shells at runtime, and `styles.css` holds the visual theme.

## File Map

| File | Role |
|---|---|
| `index.html` | Home page — hero, category tiles, a preview product grid, "the craft" promo, promise section |
| `shop.html` | Full catalog — category tiles, category filter pills, the complete product grid (with search autocomplete and favorite hearts) |
| `favorites.html` | Lists every product the customer has hearted (saved in `localStorage`); empty state if none saved yet |
| `order-crochet.html` | Crochet catalog — pick items, colors and quantity, **Add to Basket** |
| `order-ribbon.html` | Ribbon catalog — pick colors, wrapper and quantity, **Add to Basket** |
| `order-letter.html` | Letter builder — pick border/size, write the letter, **Add to Basket** |
| `basket.html` | Unified basket + checkout — review items from all three categories, enter delivery details, place the order (receipt, PDF, email) |
| `privacy-policy.html` | Legal page, sections driven by `legalPages.privacyPolicy` |
| `terms-and-conditions.html` | Legal page, sections driven by `legalPages.termsConditions` |
| `cookie-policy.html` | Legal page, sections driven by `legalPages.cookiePolicy` — explains the site's local-storage usage |
| `404.html` | Not-found page (static copy, not content-bound) |
| `content.json` | Single source of truth for all site text, products, pricing, and legal copy |
| `script.js` | Binds `content.json` into the DOM; powers nav, search, favorites, shop filters, order forms + drafts, receipts, PDF, email, cookie notice |
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
| `products` | `renderProducts()` | `products` (+ `categories` for icons) — used on both `index.html` (preview grid) and `shop.html` (full grid) |
| `shop-filters` | `initShopFilters()` | `categories` — builds the "All / Crochet / Ribbons / Letters" filter pills, `shop.html` only |
| `favorite-items` | `renderFavoritesPage()` | `products`, filtered against the saved favorite IDs in `localStorage` |
| `footer-columns` | `renderFooterColumns()` | `footer.columns` |
| `legal-links` | `renderLegalLinks()` | `footer.legalLinks` |
| `legal-sections` | `renderLegalSections()` | `legalPages.<page>.sections` |
| `order-items` | `renderOrderPage()` | `orderPages.<crochet\|ribbon\|letter>` |
| `basket-items` | `renderBasketLines()` | the basket array in `localStorage` |

The active page is identified by `<body data-page="...">` (`home`, `shop`, `favorites`, `order-crochet`, `order-ribbon`, `order-letter`, `basket`, `privacy`, `terms`, `cookies`, `404`), which `script.js` reads on `DOMContentLoaded` to decide what to render.

## content.json Schema (top-level keys)

- `site` — brand name, page title, footer tagline, copyright, order email, currency symbol, and **EmailJS credentials** (`publicKey`, `serviceId`, `clientTemplateId`, `customerTemplateId`)
- `nav.links` — header nav items (the "Shop" link now points to `shop.html`)
- `hero.slides[]` — hero eyebrow/heading/body/CTA/image (only slide 0 is rendered on the current static hero markup)
- `announcement.items[]` — 3-item scrolling announcement bar
- `trust[]` — trust-strip badges (title + detail)
- `categoriesSection` / `categories[]` — shop-by-category tiles (rendered on both `index.html` and `shop.html`)
- `productsSection` / `products[]` — the full product catalog (name, category, price display string, image); `viewAllHref` now points to `shop.html`. This is the same array used for the homepage preview grid, `shop.html`'s full grid, the header search-autocomplete dropdown, and the favorites page filter.
- `ritual` — "made slowly, on purpose" promo block; its CTA now points to `shop.html`
- `promiseSection.items[]` — 3-column promise checklist
- `shopPage` — pageTitle/heading/intro for `shop.html`'s hero
- `favoritesPage` — pageTitle/heading/intro/empty-state copy for `favorites.html`
- `colorOptions` — customization choices per line:
  - `ribbon.colors[]`, `ribbon.wrapper[]`
  - `crochet.colors[]`
  - `letter.sizes[]` (name, paperSize, dimensions, price) and `letter.borderDesigns[]` (name, image)
- `orderPages.{crochet|ribbon|letter}` — page title/heading/intro, `deliveryFee`, and the `products[]` (name, unit, price, **image, imageAlt**) used to build the order form
- `basketPage` — pageTitle/heading/intro/empty-state copy for `basket.html`
- `footer.columns[]` / `footer.legalLinks[]` (now includes a "Cookie Policy" entry)
- `legalPages.{privacyPolicy|termsConditions|cookiePolicy}` — heading, effective date, `sections[]` (heading + body)
- `cookieBanner` — message/accept-button text/"Learn more" link for the local-storage notice shown on first visit

## Favorites

- Each product card (homepage + `shop.html`) has a heart button, keyed by `category::name` (see `favoriteIdFor()`).
- Clicking it toggles the ID in `localStorage` under `aurelis_favorites_v1` via `toggleFavorite()`, and the heart fills in immediately.
- The header's heart nav icon carries a live count badge (`data-role="favorites-count"`), kept in sync by `updateFavoritesBadge()` — on load, on toggle, and on the `storage` event (multi-tab).
- `favorites.html` reads the same storage key and lists the matching products from the full `products` array; unhearting an item there removes it from the list immediately.

## Shop Page, Filters & Search

- `shop.html` is the canonical "browse everything" page: category tiles up top, then a filter-pill bar, then the full product grid. It carries a "← Back to Main Menu" link (`.back-link`) to `index.html`.
- `initShopFilters()` builds one pill per category plus "All"; clicking a pill sets `currentCategoryFilter` and re-applies `applyProductFilters()`, which combines it with any active search text.
- The header search box (present on every page) now has live autocomplete: typing shows up to 6 matching products (thumbnail, name, category, price) in a dropdown built by `initSearchAutocomplete()`. Clicking a suggestion either filters/scrolls to that card in-page (if a `.product-grid` exists on the current page) or redirects to `shop.html?q=<name>`, which `shop.html` reads on load to pre-fill and re-apply the search.
- Every entry point that used to scroll to `index.html#shop` (nav "Shop" link, "View All", the header shop-bag icon, the homepage "Craft" CTA, "Continue Shopping" links on `basket.html`/`favorites.html`) now points to `shop.html`. **Exception:** the shop-bag icon on the three order pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`) still hardcodes `index.html#shop` — see Known Data Gaps.

## Add-to-Basket Deep Link

- Each product card's `+` add button links to its order page with a query string, e.g. `order-crochet.html?add=Butterfly`.
- `renderOrderPage()` reads that `add` param, finds the matching item by a normalized name comparison (`normalizeItemName()`, so label differences like "Heart with Ribbon" vs. "Heart w/ Ribbon" still match), sets its quantity to 1 if it's still 0, recalculates, and smooth-scrolls to it with a brief highlight flash (`.order-item-card.highlight`).

## Order Draft Auto-Save

- While filling out any order page, `saveOrderDraft()` writes the full form state (quantities + per-item customizations or letter fields) to `localStorage` under `aurelis_draft_<crochet|ribbon|letter>_v1` on every change (it's called at the end of `recalculate()`).
- On page load, `restoreOrderDraft()` reads that key back and repopulates quantities, colors/wrapper selections, and letter border/size/to/from/message fields — so a customer who wanders off to `shop.html` mid-order and comes back doesn't lose their progress.
- Successfully submitting "Add to Basket" resets quantities to 0, which clears the saved draft (an empty draft — all quantities 0 — is deleted rather than stored).

## Basket & Checkout Flow

The site uses a single unified basket instead of a per-category checkout form. There is no login — the basket is just data in the browser.

**1. Category pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`)**
`renderOrderPage()` builds line items from `orderPages.<page>.products`, with per-item quantity and color/size/border customization pickers (`buildCustomizationEntryHtml`, `buildLetterEntryHtml`). The button at the bottom validates the chosen options and calls `addItemsToBasket()`, which appends each line (tagged with its `category`) to a basket array stored in **`localStorage`** under the key `aurelis_basket_v1`. The page then resets its quantities to 0 so the customer can keep shopping, and shows an inline "Added to basket — View Basket" message.

**2. Basket icon**
Every page's header carries a basket icon with a live count badge (`data-role="basket-count"`), kept in sync by `updateBasketBadge()` (called on every page load, and on the `storage` event so multiple open tabs stay in sync). It links to `basket.html`.

**3. `basket.html` — the single checkout step**
- `renderBasketLines()` reads the basket out of `localStorage` and lists every item across all three categories, with its customization summary (or, for letters, the full letter preview card), a line price, and a remove button. Quantity is not independently editable per line here — because each line already carries its own per-unit customization (colors/border/message), changing quantity after the fact would invalidate that detail. To change quantity, the customer removes the line and re-adds it from the category page with the new amount.
- The Delivery Details form, Order Summary, and "Place Order" button are hidden while the basket is empty and revealed once it has items.
- On submit, `initBasketPage()` validates the delivery fields, then reuses the **same** receipt/PDF/email functions as before (`buildReceiptPdf()`, `sendOrderEmails()`, `showReceipt()`) to confirm the order across all categories in one email and one printable receipt. The basket is cleared after a successful submit.

Payment remains cash on delivery only — no payment details are ever collected.

External scripts (`@emailjs/browser` via jsdelivr CDN, `jspdf` via cdnjs CDN) load only on `basket.html`, since that's the only page that emails or generates a PDF.

## Local Storage Keys (all client-side only, nothing sent to a server)

| Key | Holds | Written by |
|---|---|---|
| `aurelis_basket_v1` | The unified basket array | `addItemsToBasket()` / cleared after checkout |
| `aurelis_favorites_v1` | Array of favorited `category::name` IDs | `toggleFavorite()` |
| `aurelis_draft_crochet_v1`, `aurelis_draft_ribbon_v1`, `aurelis_draft_letter_v1` | In-progress order form state per category | `saveOrderDraft()` / cleared when quantities return to 0 |
| `aurelis_cookie_consent_v1` | Whether the customer has dismissed the local-storage notice | `initCookieBanner()` |

## Cookie / Local-Storage Consent

- No tracking cookies or analytics are used anywhere on the site — all persistence is `localStorage`, scoped to the customer's own browser.
- `initCookieBanner()` shows a dismissible bar (bound to `content.json`'s `cookieBanner`) on first visit of any page, explaining this plainly and linking to `cookie-policy.html`. Dismissing it just records that the notice was seen (`aurelis_cookie_consent_v1`) — it does not toggle any storage on/off, since the basket, favorites, and order drafts are core functionality, not optional tracking.
- `cookie-policy.html` is a full legal page (same pattern as Privacy/Terms) covering what's stored, why, and how to clear it.
- The Privacy Policy's "Cookies and Website Analytics" section was updated to match — it now describes local-storage usage instead of only saying "we don't use cookies."

## Security Notes

- `index.html`, `shop.html`, `favorites.html`, `cookie-policy.html`, `privacy-policy.html`, and `terms-and-conditions.html` carry a `Content-Security-Policy` meta tag scoped to: self, Google Fonts, and the two CDNs above for scripts, plus `api.emailjs.com` for form submissions.
- `basket.html`, the three order pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`), and `404.html` do **not** currently carry that same CSP meta tag. This is most worth fixing on `basket.html`, since it's the one page actually loading the EmailJS/jsPDF scripts and calling out to `api.emailjs.com`.

## Known Data Gaps / Inconsistencies

- The shop-bag ("Go to shop") header icon on the three order pages (`order-crochet.html`, `order-ribbon.html`, `order-letter.html`) still links to `index.html#shop` instead of `shop.html` — every other page's copy of that icon was updated when `shop.html` was introduced, but these three files haven't been re-uploaded for that edit yet.
- Image paths in `content.json` are inconsistent: most product/hero images use `assets/images/...`, but `hero.slides[2].image` ("images/hero-custom.jpg"), `products[3].image` / `orderPages.letter.products[0].image` (both "images/product-letter.jpg"), and all `letter.borderDesigns[].image` entries use a bare `images/...` path — confirm the real folder structure before deploying so these don't 404.
- `hero-custom.jpg`, `product-letter.jpg`, and the six `border-*.jpg` border-design images referenced in `content.json` were not among the uploaded assets — only the four `assets/images/*.webp` product photos were provided. Order-page item thumbnails and the homepage/shop grid both fall back gracefully (`onerror` hides the broken `<img>`) rather than showing a broken-image icon.

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
| `butterfly_crochet.webp` | Lavender/white crochet butterfly keychain with beaded chain | "Butterfly" product (homepage/shop grid + crochet order-page thumbnail) |
| `heart_crochet_pink.webp` | Pink/cream crochet heart keychain with a bow | "Heart with Ribbon" product (homepage/shop grid + crochet order-page thumbnail) |
| `heart_crochet_red.webp` | Red/cream crochet heart keychain with a bow | Hero slide 1 image, "The Craft" section image |
| `mini_bouquet_samples.webp` | Five ribbon-rose bouquet keychains in assorted colors | "Mini Bouquet Keychain" product (homepage/shop grid + ribbon order-page thumbnail), hero slide 2 image |