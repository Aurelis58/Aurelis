const ICONS = {
  crochet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="5"/><path d="M13 13l7 7"/></svg>',
  ribbon: '<svg width="52px" height="52px" viewBox="0 0 1.56 1.56" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.26 0.325v0.948c0 0.058 0.07 0.087 0.111 0.046L0.78 0.91l0.409 0.409c0.041 0.041 0.111 0.012 0.111 -0.046V0.325a0.13 0.13 0 0 0 -0.13 -0.13H0.39a0.13 0.13 0 0 0 -0.13 0.13" stroke="#b46a72" stroke-width="0.13" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  letter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6l9 7 9-7"/></svg>',
  wallart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 15l3-4 2 3 3-4 3 5"/></svg>',
  giftsets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v18M4 8l8-5 8 5M4 16l8 5 8-5"/></svg>',
  babykids: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-8-4.6-8-11a4.8 4.8 0 018-3.6A4.8 4.8 0 0120 10c0 6.4-8 11-8 11z"/></svg>',
  fallback: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/></svg>'
};
 
const TRUST_ICONS = [
  '<svg viewBox="0 0 24 24"><path d="M12 21s-8-4.6-8-11a4.8 4.8 0 018-3.6A4.8 4.8 0 0120 10c0 6.4-8 11-8 11z"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M20 7l-9 9-5-5" stroke-width="2"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z"/></svg>'
];
 
function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

/* ---------------- basket storage (localStorage) ---------------- */
const BASKET_KEY = 'aurelis_basket_v1';
const CATEGORY_LABELS = { crochet: 'Crochet', ribbon: 'Ribbon', letter: 'Letter' };

function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key || '';
}

function getBasket() {
  try {
    const raw = localStorage.getItem(BASKET_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveBasket(items) {
  try {
    localStorage.setItem(BASKET_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Could not save basket', e);
  }
  updateBasketBadge();
}

function addItemsToBasket(newItems) {
  const basket = getBasket();
  newItems.forEach(it => {
    const id = 'itm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    basket.push({ id, ...it });
  });
  saveBasket(basket);
}

function removeBasketItem(id) {
  saveBasket(getBasket().filter(it => it.id !== id));
}

function clearBasket() {
  saveBasket([]);
}

/* ---------------- cookie / local-storage consent notice ---------------- */
const COOKIE_CONSENT_KEY = 'aurelis_cookie_consent_v1';

function initCookieBanner(copy) {
  try {
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;
  } catch (e) {
    return; // storage unavailable — nothing to notify about
  }

  const bar = document.createElement('div');
  bar.className = 'cookie-banner';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Local storage notice');
  bar.innerHTML = `
    <p>${escapeHtml(copy.message)} <a href="${copy.learnMoreHref}">${escapeHtml(copy.learnMoreText)}</a></p>
    <button type="button" class="btn cookie-banner-accept">${escapeHtml(copy.acceptText)}</button>
  `;
  document.body.appendChild(bar);

  bar.querySelector('.cookie-banner-accept').addEventListener('click', () => {
    try { localStorage.setItem(COOKIE_CONSENT_KEY, 'seen'); } catch (e) {}
    bar.remove();
  });
}

function updateBasketBadge() {
  const count = getBasket().reduce((sum, it) => sum + (it.qty || 1), 0);
  document.querySelectorAll('[data-role="basket-count"]').forEach(el => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---------------- favorites storage (localStorage) ---------------- */
const FAVORITES_KEY = 'aurelis_favorites_v1';

function favoriteIdFor(p) {
  return `${p.category || ''}::${p.name || ''}`;
}

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Could not save favorites', e);
  }
  updateFavoritesBadge();
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  saveFavorites(favs);
  return idx === -1; // true if it just became a favorite
}

function updateFavoritesBadge() {
  const count = getFavorites().length;
  document.querySelectorAll('[data-role="favorites-count"]').forEach(el => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function initFavoriteButtons(root) {
  const scope = root || document;
  scope.querySelectorAll('.heart[data-fav-id]').forEach(btn => {
    const fav = isFavorite(btn.getAttribute('data-fav-id'));
    btn.classList.toggle('active', fav);
    btn.setAttribute('aria-pressed', String(fav));
  });
}

/* delegated heart-click handler shared by the homepage grid and the favorites page */
function bindFavoriteClicks(el, onToggle) {
  el.addEventListener('click', e => {
    const heartBtn = e.target.closest('.heart[data-fav-id]');
    if (!heartBtn) return;
    e.preventDefault();
    const nowFav = toggleFavorite(heartBtn.getAttribute('data-fav-id'));
    heartBtn.classList.toggle('active', nowFav);
    heartBtn.setAttribute('aria-pressed', String(nowFav));
    if (onToggle) onToggle(nowFav, heartBtn);
  });
}
 
function iconFor(key) {
  return ICONS[key] || ICONS.fallback;
}
 
function bindText(root, data) {
  root.querySelectorAll('[data-bind]').forEach(el => {
    const value = getPath(data, el.getAttribute('data-bind'));
    if (value !== undefined) el.textContent = value;
  });
  root.querySelectorAll('[data-bind-href]').forEach(el => {
    const value = getPath(data, el.getAttribute('data-bind-href'));
    if (value !== undefined) el.setAttribute('href', value);
  });
  root.querySelectorAll('[data-bind-placeholder]').forEach(el => {
    const value = getPath(data, el.getAttribute('data-bind-placeholder'));
    if (value !== undefined) el.setAttribute('placeholder', value);
  });
  root.querySelectorAll('[data-bind-src]').forEach(el => {
    const value = getPath(data, el.getAttribute('data-bind-src'));
    if (value !== undefined) el.setAttribute('src', value);
  });
  root.querySelectorAll('[data-bind-alt]').forEach(el => {
    const value = getPath(data, el.getAttribute('data-bind-alt'));
    if (value !== undefined) el.setAttribute('alt', value);
  });
}
 
function renderNav(links) {
  const els = document.querySelectorAll('[data-list="nav-links"]');
  els.forEach(el => {
    el.innerHTML = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
  });
}
 
function renderTrust(items) {
  const el = document.querySelector('[data-list="trust"]');
  if (!el) return;
  el.innerHTML = items.map((t, i) => `
    <div class="trust-item">
      <div style="width:26px;height:26px;flex-shrink:0;color:var(--blush);">${TRUST_ICONS[i % TRUST_ICONS.length]}</div>
      <div><strong>${t.title}</strong><span>${t.detail}</span></div>
    </div>
  `).join('');
}
 
function renderCategories(items) {
  const el = document.querySelector('[data-list="categories"]');
  if (!el) return;
  el.innerHTML = items.map(c => `
    <a class="cat-card" href="${c.href}">
      <div class="cat-circle"><div class="cat-circle-inner" style="background:var(--blush-soft); color:var(--rosewood);">
        ${iconFor(c.icon)}
      </div></div>
      <h3>${c.name}</h3>
    </a>
  `).join('');
}
 
function hrefForCategoryIn(categories, catName) {
  const cat = (categories || []).find(c => c.name === catName);
  return cat ? cat.href : '#shop';
}

function buildProductCardHtml(p, categories) {
  return `
    <div class="product-card" data-category="${escapeHtml(p.category || '')}">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
      <div class="product-photo">
        <img src="${p.image}" alt="${p.imageAlt || p.name}" loading="lazy">
        <button type="button" class="heart" data-fav-id="${escapeHtml(favoriteIdFor(p))}" aria-label="Save ${escapeHtml(p.name)} to favorites" aria-pressed="false">
          <svg viewBox="0 0 24 24" stroke-width="1.8"><path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.6 4.3 5 3.2c2.3-.7 4.5.2 6 2.2 1.5-2 3.7-2.9 6-2.2 3.4 1.1 4.6 4.8 3 8-2.5 4.7-10 9.3-10 9.3z"/></svg>
        </button>
      </div>
      <div class="product-info">
        <span class="cat-label">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price-row">
          <span class="price">${p.price}</span>
          <a class="add-btn" href="${hrefForCategoryIn(categories, p.category)}?add=${encodeURIComponent(p.name)}" aria-label="Order ${escapeHtml(p.name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(items, categories) {
  const el = document.querySelector('[data-list="products"]');
  if (!el) return;
  el.innerHTML = items.map(p => buildProductCardHtml(p, categories)).join('');
  initFavoriteButtons(el);
  bindFavoriteClicks(el);
}

/* ---------------- favorites page ---------------- */
function renderFavoritesPage(products, categories) {
  const el = document.querySelector('[data-list="favorite-items"]');
  const emptyEl = document.getElementById('favorites-empty');
  if (!el) return;

  function draw() {
    const favIds = getFavorites();
    const list = (products || []).filter(p => favIds.includes(favoriteIdFor(p)));
    if (!list.length) {
      el.innerHTML = '';
      el.style.display = 'none';
      if (emptyEl) emptyEl.style.display = '';
      return;
    }
    el.style.display = '';
    if (emptyEl) emptyEl.style.display = 'none';
    el.innerHTML = list.map(p => buildProductCardHtml(p, categories)).join('');
    initFavoriteButtons(el);
  }

  draw();

  bindFavoriteClicks(el, () => draw());

  window.addEventListener('storage', e => {
    if (e.key === FAVORITES_KEY) draw();
  });
}
 
function renderFooterColumns(columns) {
  const el = document.querySelector('[data-list="footer-columns"]');
  if (!el) return;
  el.innerHTML = columns.map(col => `
    <div class="foot-col">
      <h4>${col.heading}</h4>
      ${col.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    </div>
  `).join('');
}
 
function renderLegalLinks(links) {
  const el = document.querySelector('[data-list="legal-links"]');
  if (!el) return;
  el.innerHTML = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
}
 
function renderLegalSections(page) {
  const el = document.querySelector('[data-list="legal-sections"]');
  if (!el || !page) return;
  el.innerHTML = page.sections.map(s => `
    <div class="legal-section">
      <h2>${s.heading}</h2>
      <p>${s.body}</p>
    </div>
  `).join('');
}
 
/* ---------------- mobile nav ---------------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('nav.links');
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

/* ---------------- nav icons: search / account / basket ---------------- */
let currentSearchTerm = '';
let currentCategoryFilter = '';

function applyProductFilters() {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;
  const q = currentSearchTerm.trim().toLowerCase();
  let anyVisible = false;
  grid.querySelectorAll('.product-card').forEach(card => {
    const nameEl = card.querySelector('h3');
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    const cardCategory = card.getAttribute('data-category') || '';
    const matchesSearch = !q || name.includes(q);
    const matchesCategory = !currentCategoryFilter || cardCategory === currentCategoryFilter;
    const match = matchesSearch && matchesCategory;
    card.style.display = match ? '' : 'none';
    if (match) anyVisible = true;
  });
  let emptyMsg = grid.parentElement.querySelector('.search-empty');
  if (!emptyMsg) {
    emptyMsg = document.createElement('p');
    emptyMsg.className = 'search-empty';
    grid.insertAdjacentElement('afterend', emptyMsg);
  }
  emptyMsg.textContent = q ? 'No products match your search.' : 'No products in this category yet.';
  emptyMsg.style.display = anyVisible ? 'none' : 'block';
}

function filterProducts(term) {
  currentSearchTerm = term || '';
  applyProductFilters();
}
window.filterProducts = filterProducts;

function initShopFilters(categories) {
  const el = document.querySelector('[data-list="shop-filters"]');
  if (!el) return;
  const names = ['All', ...(categories || []).map(c => c.name)];
  el.innerHTML = names.map((name, i) => `
    <button type="button" class="filter-pill${i === 0 ? ' active' : ''}" data-category="${i === 0 ? '' : escapeHtml(name)}">${escapeHtml(name)}</button>
  `).join('');

  el.addEventListener('click', e => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    el.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategoryFilter = btn.getAttribute('data-category') || '';
    applyProductFilters();
  });
}

/* ---------------- header search: auto-suggest as you type ---------------- */
function ensureSuggestionsBox(wrap) {
  let box = wrap.querySelector('.search-suggestions');
  if (!box) {
    box = document.createElement('div');
    box.className = 'search-suggestions';
    box.setAttribute('role', 'listbox');
    wrap.appendChild(box);
  }
  return box;
}

function buildSuggestionItemHtml(p) {
  return `
    <button type="button" class="suggestion-item" role="option" data-name="${escapeHtml(p.name)}">
      <img src="${p.image}" alt="" loading="lazy">
      <span class="suggestion-info">
        <span class="suggestion-name">${escapeHtml(p.name)}</span>
        <span class="suggestion-meta">${escapeHtml(p.category || '')} &middot; ${escapeHtml(p.price || '')}</span>
      </span>
    </button>
  `;
}

function initSearchAutocomplete(products) {
  const input = document.getElementById('searchInput');
  const wrap = document.getElementById('searchWrap');
  if (!input || !wrap || !products || !products.length) return;

  const box = ensureSuggestionsBox(wrap);

  function renderSuggestions(term) {
    const q = term.trim().toLowerCase();
    if (!q) {
      box.innerHTML = '';
      box.classList.remove('show');
      return;
    }
    const matches = products.filter(p => (p.name || '').toLowerCase().includes(q)).slice(0, 6);
    if (!matches.length) {
      box.innerHTML = `<div class="suggestion-empty">No matches for "${escapeHtml(term.trim())}".</div>`;
      box.classList.add('show');
      return;
    }
    box.innerHTML = matches.map(buildSuggestionItemHtml).join('');
    box.classList.add('show');
  }

  function goToSuggestion(name) {
    const grid = document.querySelector('.product-grid');
    box.classList.remove('show');
    if (grid) {
      input.value = name;
      filterProducts(name);
      const card = Array.from(grid.querySelectorAll('.product-card')).find(c => {
        const h3 = c.querySelector('h3');
        return h3 && h3.textContent.trim() === name;
      });
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.location.href = `shop.html?q=${encodeURIComponent(name)}`;
    }
  }

  input.addEventListener('input', () => renderSuggestions(input.value));
  input.addEventListener('focus', () => { if (input.value.trim()) renderSuggestions(input.value); });

  box.addEventListener('click', e => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    goToSuggestion(item.getAttribute('data-name'));
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      box.classList.remove('show');
      return;
    }
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      const grid = document.querySelector('.product-grid');
      if (!grid) window.location.href = `shop.html?q=${encodeURIComponent(input.value.trim())}`;
      else box.classList.remove('show');
    }
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) box.classList.remove('show');
  });
}

function initNavIcons() {
  const toggle = document.getElementById('searchToggle');
  const wrap = document.getElementById('searchWrap');
  const input = document.getElementById('searchInput');
  if (!toggle || !wrap || !input) return;

  toggle.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      input.focus();
    } else {
      input.value = '';
      filterProducts('');
    }
  });

  input.addEventListener('input', () => filterProducts(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      filterProducts('');
      wrap.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}

/* ---------------- order forms (crochet / ribbon) ---------------- */
function formatMoney(amount, symbol) {
  return `${symbol}${amount.toFixed(2)}`;
}
 
/* ---------------- color customization helpers ---------------- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildSelectOptions(list, placeholder) {
  let html = `<option value="" disabled selected>${placeholder}</option>`;
  html += list.map(c => `<option value="${c}">${c}</option>`).join('');
  return html;
}

function buildBorderSwatches(borderDesigns, groupName) {
  return borderDesigns.map(b => `
    <label class="border-swatch">
      <input type="radio" name="${groupName}" value="${escapeHtml(b.name)}">
      <span class="border-swatch-card">
        <img src="${b.image}" alt="${escapeHtml(b.name)}" loading="lazy" onerror="this.style.display='none'">
        <span class="border-swatch-name">${escapeHtml(b.name)}</span>
      </span>
    </label>
  `).join('');
}

function buildSizeOptions(sizes, groupName, symbol) {
  return sizes.map(s => `
    <label class="size-option">
      <input type="radio" name="${groupName}" value="${escapeHtml(s.name)}" data-role="size-radio" data-price="${s.price}">
      <span class="size-option-card">
        <span class="size-option-name">${escapeHtml(s.name)}</span>
        <span class="size-option-paper">${escapeHtml(s.paperSize || '')}</span>
        <span class="size-option-dims">${escapeHtml(s.dimensions)}</span>
        <span class="size-option-price">${formatMoney(s.price, symbol)}</span>
      </span>
    </label>
  `).join('');
}

function buildLetterEntryHtml(entryIndex, cardIndex, borderDesigns, sizes, symbol) {
  const groupName = `letter-border-${cardIndex}-${entryIndex}`;
  const sizeGroupName = `letter-size-${cardIndex}-${entryIndex}`;
  return `
    <div class="letter-entry" data-role="letter-entry">
      <div class="letter-entry-head">
        <span>Letter ${entryIndex + 1}</span>
        ${entryIndex > 0 ? `<button type="button" class="copy-prev-btn" data-action="copy-prev">+ Same as previous</button>` : ''}
      </div>
      <div class="option-field" data-role="border-field">
        <label>Border Design *</label>
        <div class="border-swatch-grid">${buildBorderSwatches(borderDesigns, groupName)}</div>
        <span class="option-error">Please choose a border design.</span>
      </div>
      <div class="option-field" data-role="size-field">
        <label>Letter Size *</label>
        <div class="size-option-grid">${buildSizeOptions(sizes, sizeGroupName, symbol)}</div>
        <span class="option-error">Please choose a letter size.</span>
      </div>
      <div class="letter-fields-grid">
        <div class="option-field" data-role="to-field">
          <label>To *</label>
          <input type="text" data-role="letter-to" placeholder="e.g. Mom">
          <span class="option-error">Please enter a recipient.</span>
        </div>
        <div class="option-field" data-role="from-field">
          <label>From *</label>
          <input type="text" data-role="letter-from" placeholder="e.g. Alex">
          <span class="option-error">Please enter a sender.</span>
        </div>
      </div>
      <div class="option-field" data-role="message-field">
        <label>Message *</label>
        <textarea data-role="letter-message" placeholder="Write your letter here..."></textarea>
        <span class="option-error">Please write your message.</span>
      </div>
    </div>
  `;
}

function syncLetterEntries(card, qty, borderDesigns, sizes, symbol) {
  const container = card.querySelector('[data-role="letter-entries"]');
  if (!container) return;
  const cardIndex = card.getAttribute('data-index');
  let entries = container.querySelectorAll('[data-role="letter-entry"]');
  if (qty > entries.length) {
    for (let i = entries.length; i < qty; i++) {
      container.insertAdjacentHTML('beforeend', buildLetterEntryHtml(i, cardIndex, borderDesigns, sizes, symbol));
    }
  } else if (qty < entries.length) {
    for (let i = entries.length - 1; i >= qty; i--) {
      entries[i].remove();
    }
  }
}

function buildOptionsBlock(pageKey, colorConf, name) {
  if (!colorConf) return '';
  if (pageKey === 'ribbon' || pageKey === 'crochet') {
    return `
      <div class="order-item-options" data-role="options">
        <div class="customization-entries" data-role="customization-entries"></div>
      </div>
    `;
  }
  if (pageKey === 'letter') {
    return `
      <div class="order-item-options" data-role="options">
        <div class="letter-entries" data-role="letter-entries"></div>
      </div>
    `;
  }
  return '';
}

function buildCustomizationEntryHtml(entryIndex, pageKey, colorConf, name) {
  const label = `${name} ${entryIndex + 1}`;
  if (pageKey === 'ribbon') {
    return `
      <div class="customization-entry" data-role="customization-entry">
        <div class="customization-entry-head">
          <span>${escapeHtml(label)}</span>
          ${entryIndex > 0 ? `<button type="button" class="copy-prev-btn" data-action="copy-prev">+ Same as previous</button>` : ''}
        </div>
        <div class="option-field" data-role="color1-field">
          <label>1st Color *</label>
          <select data-role="color1" aria-label="1st color for ${escapeHtml(label)}">
            ${buildSelectOptions(colorConf.colors, 'Select a color')}
          </select>
          <span class="option-error">Please choose a 1st color.</span>
        </div>
        <div class="option-field" data-role="color2-field">
          <label>2nd Color (optional)</label>
          <select data-role="color2" aria-label="2nd color for ${escapeHtml(label)}">
            <option value="">None</option>
          </select>
        </div>
        <div class="option-field" data-role="wrapper-field">
          <label>Wrapper Color *</label>
          <select data-role="wrapper" aria-label="Wrapper color for ${escapeHtml(label)}">
            ${buildSelectOptions(colorConf.wrapper, 'Select a wrapper color')}
          </select>
          <span class="option-error">Please choose a wrapper color.</span>
        </div>
      </div>
    `;
  }
  if (pageKey === 'crochet') {
    return `
      <div class="customization-entry" data-role="customization-entry">
        <div class="customization-entry-head">
          <span>${escapeHtml(label)}</span>
          ${entryIndex > 0 ? `<button type="button" class="copy-prev-btn" data-action="copy-prev">+ Same as previous</button>` : ''}
        </div>
        <div class="option-field" data-role="color1-field">
          <label>1st Color *</label>
          <select data-role="color1" aria-label="1st color for ${escapeHtml(label)}">
            ${buildSelectOptions(colorConf.colors, 'Select a color')}
          </select>
          <span class="option-error">Please choose a 1st color.</span>
        </div>
        <div class="option-field" data-role="color2-field">
          <label>2nd Color *</label>
          <select data-role="color2" aria-label="2nd color for ${escapeHtml(label)}">
            <option value="" disabled selected>Select a color</option>
          </select>
          <span class="option-error">Please choose a 2nd color.</span>
        </div>
      </div>
    `;
  }
  return '';
}

function syncCustomizationEntries(card, qty, pageKey, colorConf, name) {
  const container = card.querySelector('[data-role="customization-entries"]');
  if (!container) return;
  let entries = container.querySelectorAll('[data-role="customization-entry"]');
  if (qty > entries.length) {
    for (let i = entries.length; i < qty; i++) {
      container.insertAdjacentHTML('beforeend', buildCustomizationEntryHtml(i, pageKey, colorConf, name));
    }
    // initialize the 2nd-color list for any newly added entries
    container.querySelectorAll('[data-role="customization-entry"]').forEach(entryEl => {
      if (!entryEl.dataset.initialized) {
        refreshSecondColor(entryEl, colorConf);
        entryEl.dataset.initialized = 'true';
      }
    });
  } else if (qty < entries.length) {
    for (let i = entries.length - 1; i >= qty; i--) {
      entries[i].remove();
    }
  }
}

function refreshSecondColor(card, colorConf) {
  const color2Select = card.querySelector('[data-role="color2"]');
  if (!color2Select) return;
  const color1 = card.querySelector('[data-role="color1"]').value;
  const prevValue = color2Select.value;
  const secondRequired = !color2Select.querySelector('option[value=""]:not([disabled])');
  const filtered = colorConf.colors.filter(c => c !== color1);
  let html = secondRequired
    ? `<option value="" disabled ${!prevValue ? 'selected' : ''}>Select a color</option>`
    : `<option value="">None</option>`;
  html += filtered.map(c => `<option value="${c}" ${c === prevValue ? 'selected' : ''}>${c}</option>`).join('');
  color2Select.innerHTML = html;
}

function copyCustomizationEntry(fromEntry, toEntry, colorConf) {
  const color1From = fromEntry.querySelector('[data-role="color1"]');
  const color1To = toEntry.querySelector('[data-role="color1"]');
  const color2From = fromEntry.querySelector('[data-role="color2"]');
  const color2To = toEntry.querySelector('[data-role="color2"]');
  const wrapperFrom = fromEntry.querySelector('[data-role="wrapper"]');
  const wrapperTo = toEntry.querySelector('[data-role="wrapper"]');

  if (color1From && color1To) color1To.value = color1From.value;
  if (color2From && color2To) color2To.value = color2From.value;
  if (colorConf && color1To) refreshSecondColor(toEntry, colorConf);
  if (wrapperFrom && wrapperTo) wrapperTo.value = wrapperFrom.value;

  toEntry.querySelectorAll('.option-field.invalid').forEach(f => f.classList.remove('invalid'));
}

function copyLetterEntry(fromEntry, toEntry) {
  const borderFrom = fromEntry.querySelector('[data-role="border-field"] input[type="radio"]:checked');
  if (borderFrom) {
    const match = toEntry.querySelector(`[data-role="border-field"] input[type="radio"][value="${CSS.escape(borderFrom.value)}"]`);
    if (match) match.checked = true;
  }
  const sizeFrom = fromEntry.querySelector('[data-role="size-field"] input[type="radio"]:checked');
  if (sizeFrom) {
    const match = toEntry.querySelector(`[data-role="size-field"] input[type="radio"][value="${CSS.escape(sizeFrom.value)}"]`);
    if (match) match.checked = true;
  }
  const toFrom = fromEntry.querySelector('[data-role="letter-to"]');
  const toTo = toEntry.querySelector('[data-role="letter-to"]');
  if (toFrom && toTo) toTo.value = toFrom.value;
  const fromFrom = fromEntry.querySelector('[data-role="letter-from"]');
  const fromTo = toEntry.querySelector('[data-role="letter-from"]');
  if (fromFrom && fromTo) fromTo.value = fromFrom.value;
  const msgFrom = fromEntry.querySelector('[data-role="letter-message"]');
  const msgTo = toEntry.querySelector('[data-role="letter-message"]');
  if (msgFrom && msgTo) msgTo.value = msgFrom.value;

  toEntry.querySelectorAll('.option-field.invalid').forEach(f => f.classList.remove('invalid'));
}

function formatColorLine(pageKey, sel) {
  if (!sel) return '';
  if (pageKey === 'ribbon' || pageKey === 'crochet') {
    const list = sel.customizations || [];
    const groups = [];
    list.forEach(c => {
      const colors = c.color2 ? `${c.color1} and ${c.color2}` : c.color1;
      const wrapperPart = (pageKey === 'ribbon' && c.wrapper) ? ` (${c.wrapper} Wrapper)` : '';
      const label = `${colors}${wrapperPart}`;
      const existing = groups.find(g => g.label === label);
      if (existing) existing.count++;
      else groups.push({ label, count: 1 });
    });
    return groups.map(g => g.count > 1 ? `${g.count} \u00d7 ${g.label}` : g.label).join('\n');
  }
  if (pageKey === 'letter') {
    const multi = sel.letters.length > 1;
    return sel.letters.map((l, i) => {
      const prefix = multi ? `Letter ${i + 1} \u2014 ` : '';
      return `${prefix}Design: ${l.border} | Size: ${l.size} (${l.sizeDimensions}, ${l.sizePrice}) | To: ${l.to} | From: ${l.from} | "${l.message}"`;
    }).join('\n');
  }
  return '';
}

function normalizeItemName(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\bw\//g, 'with')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getDraftKey(pageKey) {
  return `aurelis_draft_${pageKey}_v1`;
}

function saveOrderDraft(pageKey, itemsEl) {
  try {
    const draft = [];
    itemsEl.querySelectorAll('.order-item-card').forEach(card => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      const qtyInput = card.querySelector('[data-role="qty"]');
      const qty = parseInt(qtyInput ? qtyInput.value : 0, 10) || 0;
      const entry = { index, qty };

      const letterEntries = card.querySelectorAll('[data-role="letter-entry"]');
      if (letterEntries.length) {
        entry.letters = Array.from(letterEntries).map(entryEl => {
          const border = entryEl.querySelector('[data-role="border-field"] input[type="radio"]:checked');
          const size = entryEl.querySelector('[data-role="size-field"] input[type="radio"]:checked');
          return {
            border: border ? border.value : '',
            size: size ? size.value : '',
            to: (entryEl.querySelector('[data-role="letter-to"]') || {}).value || '',
            from: (entryEl.querySelector('[data-role="letter-from"]') || {}).value || '',
            message: (entryEl.querySelector('[data-role="letter-message"]') || {}).value || ''
          };
        });
      }

      const customEntries = card.querySelectorAll('[data-role="customization-entry"]');
      if (customEntries.length) {
        entry.customizations = Array.from(customEntries).map(entryEl => ({
          color1: (entryEl.querySelector('[data-role="color1"]') || {}).value || '',
          color2: (entryEl.querySelector('[data-role="color2"]') || {}).value || '',
          wrapper: (entryEl.querySelector('[data-role="wrapper"]') || {}).value || ''
        }));
      }

      draft.push(entry);
    });

    if (draft.some(d => d.qty > 0)) {
      localStorage.setItem(getDraftKey(pageKey), JSON.stringify(draft));
    } else {
      localStorage.removeItem(getDraftKey(pageKey));
    }
  } catch (e) {
    console.error('Could not save order draft', e);
  }
}

function restoreOrderDraft(pageKey, itemsEl, colorConf, symbol) {
  let draft;
  try {
    const raw = localStorage.getItem(getDraftKey(pageKey));
    draft = raw ? JSON.parse(raw) : null;
  } catch (e) {
    draft = null;
  }
  if (!draft || !Array.isArray(draft) || !draft.length) return;

  draft.forEach(entryData => {
    const card = itemsEl.querySelector(`.order-item-card[data-index="${entryData.index}"]`);
    if (!card) return;
    const qty = entryData.qty || 0;
    const qtyInput = card.querySelector('[data-role="qty"]');
    if (qtyInput) qtyInput.value = qty;
    if (qty <= 0) return;

    if (pageKey === 'letter' && colorConf) {
      syncLetterEntries(card, qty, colorConf.borderDesigns, colorConf.sizes, symbol);
      const entries = card.querySelectorAll('[data-role="letter-entry"]');
      (entryData.letters || []).forEach((letterData, i) => {
        const entryEl = entries[i];
        if (!entryEl) return;
        if (letterData.border) {
          const radio = entryEl.querySelector(`[data-role="border-field"] input[type="radio"][value="${CSS.escape(letterData.border)}"]`);
          if (radio) radio.checked = true;
        }
        if (letterData.size) {
          const radio = entryEl.querySelector(`[data-role="size-field"] input[type="radio"][value="${CSS.escape(letterData.size)}"]`);
          if (radio) radio.checked = true;
        }
        const toInput = entryEl.querySelector('[data-role="letter-to"]');
        if (toInput) toInput.value = letterData.to || '';
        const fromInput = entryEl.querySelector('[data-role="letter-from"]');
        if (fromInput) fromInput.value = letterData.from || '';
        const msgInput = entryEl.querySelector('[data-role="letter-message"]');
        if (msgInput) msgInput.value = letterData.message || '';
      });
    } else if (colorConf) {
      const nameEl = card.querySelector('.order-item-name');
      syncCustomizationEntries(card, qty, pageKey, colorConf, nameEl ? nameEl.textContent : '');
      const entries = card.querySelectorAll('[data-role="customization-entry"]');
      (entryData.customizations || []).forEach((custData, i) => {
        const entryEl = entries[i];
        if (!entryEl) return;
        const color1 = entryEl.querySelector('[data-role="color1"]');
        if (color1 && custData.color1) color1.value = custData.color1;
        refreshSecondColor(entryEl, colorConf);
        const color2 = entryEl.querySelector('[data-role="color2"]');
        if (color2 && custData.color2) color2.value = custData.color2;
        const wrapper = entryEl.querySelector('[data-role="wrapper"]');
        if (wrapper && custData.wrapper) wrapper.value = custData.wrapper;
      });
    }
  });
}

function renderOrderPage(pageKey, pageData, site, colorOptions) {
  const symbol = site.currencySymbol || '$';
  const itemsEl = document.querySelector('[data-list="order-items"]');
  if (!itemsEl) return;

  const colorConf = colorOptions ? colorOptions[pageKey] : null;

  itemsEl.innerHTML = pageData.products.map((p, i) => {
    const letterSizes = (pageKey === 'letter' && colorConf && colorConf.sizes) ? colorConf.sizes : null;
    const unitLabel = letterSizes && letterSizes.length
      ? `From ${formatMoney(Math.min(...letterSizes.map(s => s.price)), symbol)}`
      : `${formatMoney(p.price, symbol)} per ${p.unit}`;
    return `
    <div class="order-item-card" data-price="${p.price}" data-index="${i}">
      <div class="order-item">
        <div class="order-item-headline">
          ${p.image ? `<img class="order-item-photo" src="${p.image}" alt="${escapeHtml(p.imageAlt || p.name)}" loading="lazy" onerror="this.style.display='none'">` : ''}
          <div>
            <span class="order-item-name">${p.name}</span>
            <span class="order-item-unit">${unitLabel}</span>
          </div>
        </div>
        <div class="order-item-price" data-role="line-total">${formatMoney(0, symbol)}</div>
        <div class="qty-control">
          <button type="button" class="qty-btn" data-action="minus" aria-label="Decrease quantity">-</button>
          <input class="qty-input" type="number" min="0" step="1" value="0" data-role="qty" aria-label="Quantity for ${p.name}">
          <button type="button" class="qty-btn" data-action="plus" aria-label="Increase quantity">+</button>
        </div>
      </div>
      ${buildOptionsBlock(pageKey, colorConf, p.name)}
    </div>
  `;
  }).join('');

  restoreOrderDraft(pageKey, itemsEl, colorConf, symbol);

  function recalculate() {
    let subtotal = 0;
    itemsEl.querySelectorAll('.order-item-card').forEach(card => {
      const price = parseFloat(card.getAttribute('data-price'));
      const idx = parseInt(card.getAttribute('data-index'), 10);
      const qtyInput = card.querySelector('[data-role="qty"]');
      let qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 0) qty = 0;
      qtyInput.value = qty;

      if (pageKey === 'letter' && colorConf) {
        syncLetterEntries(card, qty, colorConf.borderDesigns, colorConf.sizes, symbol);
      } else if ((pageKey === 'ribbon' || pageKey === 'crochet') && colorConf) {
        syncCustomizationEntries(card, qty, pageKey, colorConf, pageData.products[idx].name);
      }

      let lineTotal;
      if (pageKey === 'letter') {
        lineTotal = 0;
        card.querySelectorAll('[data-role="size-radio"]:checked').forEach(r => {
          lineTotal += parseFloat(r.getAttribute('data-price')) || 0;
        });
      } else {
        lineTotal = price * qty;
      }
      card.querySelector('[data-role="line-total"]').textContent = formatMoney(lineTotal, symbol);
      subtotal += lineTotal;

      const optionsEl = card.querySelector('[data-role="options"]');
      if (optionsEl) optionsEl.classList.toggle('show', qty > 0);
    });
    const hasItems = subtotal > 0;
 
    document.querySelectorAll('[data-role="subtotal"]').forEach(el => el.textContent = formatMoney(subtotal, symbol));
    saveOrderDraft(pageKey, itemsEl);
    return { subtotal, hasItems };
  }
 
  itemsEl.addEventListener('click', e => {
    const btn = e.target.closest('.qty-btn');
    if (btn) {
      const card = btn.closest('.order-item-card');
      const input = card.querySelector('[data-role="qty"]');
      let qty = parseInt(input.value, 10) || 0;
      qty = btn.getAttribute('data-action') === 'plus' ? qty + 1 : Math.max(0, qty - 1);
      input.value = qty;
      recalculate();
      return;
    }

    const copyBtn = e.target.closest('[data-action="copy-prev"]');
    if (copyBtn) {
      const entry = copyBtn.closest('[data-role="customization-entry"], [data-role="letter-entry"]');
      if (!entry) return;
      const prevEntry = entry.previousElementSibling;
      if (!prevEntry) return;
      if (entry.matches('[data-role="customization-entry"]')) {
        copyCustomizationEntry(prevEntry, entry, colorConf);
      } else if (entry.matches('[data-role="letter-entry"]')) {
        copyLetterEntry(prevEntry, entry);
      }
      recalculate();
    }
  });
  itemsEl.addEventListener('input', e => {
    if (e.target.matches('[data-role="qty"]')) recalculate();
  });
  itemsEl.addEventListener('change', e => {
    if (e.target.matches('[data-role="size-radio"]')) recalculate();
    if (e.target.matches('[data-role="color1"]')) {
      const entry = e.target.closest('[data-role="customization-entry"]');
      if (entry && colorConf) refreshSecondColor(entry, colorConf);
    }
  });
 
  recalculate();

  /* deep-link support: a product-grid "add" button can link here as
     order-crochet.html?add=<name> to pre-fill that item's quantity to 1 */
  const addParam = new URLSearchParams(window.location.search).get('add');
  if (addParam) {
    const wanted = normalizeItemName(addParam);
    const target = Array.from(itemsEl.querySelectorAll('.order-item-card')).find(card => {
      const nameEl = card.querySelector('.order-item-name');
      return nameEl && normalizeItemName(nameEl.textContent) === wanted;
    });
    if (target) {
      const qtyInput = target.querySelector('[data-role="qty"]');
      if (qtyInput && (parseInt(qtyInput.value, 10) || 0) === 0) {
        qtyInput.value = 1;
        recalculate();
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('highlight');
      setTimeout(() => target.classList.remove('highlight'), 1600);
    }
  }
 
  const form = document.getElementById('order-form');
  if (!form) return;
 
  form.addEventListener('submit', e => {
    e.preventDefault();
 
    const totals = recalculate();
    const msgEl = document.getElementById('form-msg');
    let valid = true;
 
    if (!totals.hasItems) {
      msgEl.textContent = 'Please choose at least one item and quantity before adding to your basket.';
      msgEl.className = 'form-msg error show';
      valid = false;
    }

    // validate color/customization selections for any item with a quantity
    let colorsValid = true;
    itemsEl.querySelectorAll('.order-item-card').forEach(card => {
      const qty = parseInt(card.querySelector('[data-role="qty"]').value, 10) || 0;
      if (qty <= 0) {
        card.querySelectorAll('.option-field').forEach(f => f.classList.remove('invalid'));
        return;
      }

      if (pageKey === 'letter') {
        card.querySelectorAll('[data-role="letter-entry"]').forEach(entryEl => {
          const borderField = entryEl.querySelector('[data-role="border-field"]');
          const checkedBorder = borderField.querySelector('input[type="radio"]:checked');
          if (!checkedBorder) { borderField.classList.add('invalid'); colorsValid = false; }
          else borderField.classList.remove('invalid');

          const sizeField = entryEl.querySelector('[data-role="size-field"]');
          const checkedSize = entryEl.querySelector('[data-role="size-field"] input[type="radio"]:checked');
          if (!checkedSize) { sizeField.classList.add('invalid'); colorsValid = false; }
          else sizeField.classList.remove('invalid');

          const toField = entryEl.querySelector('[data-role="to-field"]');
          const toInput = entryEl.querySelector('[data-role="letter-to"]');
          if (!toInput.value.trim()) { toField.classList.add('invalid'); colorsValid = false; }
          else toField.classList.remove('invalid');

          const fromField = entryEl.querySelector('[data-role="from-field"]');
          const fromInput = entryEl.querySelector('[data-role="letter-from"]');
          if (!fromInput.value.trim()) { fromField.classList.add('invalid'); colorsValid = false; }
          else fromField.classList.remove('invalid');

          const msgField = entryEl.querySelector('[data-role="message-field"]');
          const msgInput = entryEl.querySelector('[data-role="letter-message"]');
          if (!msgInput.value.trim()) { msgField.classList.add('invalid'); colorsValid = false; }
          else msgField.classList.remove('invalid');
        });
        return;
      }

      card.querySelectorAll('[data-role="customization-entry"]').forEach(entryEl => {
        const color1Select = entryEl.querySelector('[data-role="color1"]');
        const color2Select = entryEl.querySelector('[data-role="color2"]');
        const wrapperSelect = entryEl.querySelector('[data-role="wrapper"]');

        if (color1Select) {
          const field = entryEl.querySelector('[data-role="color1-field"]');
          if (!color1Select.value) { field.classList.add('invalid'); colorsValid = false; }
          else field.classList.remove('invalid');
        }
        if (color2Select && pageKey === 'crochet') {
          const field = entryEl.querySelector('[data-role="color2-field"]');
          if (!color2Select.value) { field.classList.add('invalid'); colorsValid = false; }
          else field.classList.remove('invalid');
        }
        if (wrapperSelect) {
          const field = entryEl.querySelector('[data-role="wrapper-field"]');
          if (!wrapperSelect.value) { field.classList.add('invalid'); colorsValid = false; }
          else field.classList.remove('invalid');
        }
      });
    });
    if (!colorsValid) valid = false;
 
    if (!valid) {
      if (totals.hasItems) {
        msgEl.textContent = 'Please fill in the required details for each item before adding to your basket.';
        msgEl.className = 'form-msg error show';
      }
      return;
    }
 
    const newItems = [];
    itemsEl.querySelectorAll('.order-item-card').forEach(card => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      const qty = parseInt(card.querySelector('[data-role="qty"]').value, 10) || 0;
      if (qty > 0) {
        const product = pageData.products[idx];
        let sel;
        let lineTotal;
        if (pageKey === 'letter') {
          const letters = [];
          card.querySelectorAll('[data-role="letter-entry"]').forEach(entryEl => {
            const checkedBorder = entryEl.querySelector('[data-role="border-field"] input[type="radio"]:checked');
            const checkedSize = entryEl.querySelector('[data-role="size-field"] input[type="radio"]:checked');
            const borderName = checkedBorder ? checkedBorder.value : '';
            const sizeName = checkedSize ? checkedSize.value : '';
            const borderInfo = (colorConf && colorConf.borderDesigns || []).find(b => b.name === borderName);
            const sizeInfo = (colorConf && colorConf.sizes || []).find(s => s.name === sizeName);
            const sizePrice = sizeInfo ? sizeInfo.price : (checkedSize ? parseFloat(checkedSize.getAttribute('data-price')) || 0 : 0);
            letters.push({
              border: borderName,
              borderImage: borderInfo ? borderInfo.image : '',
              size: sizeName,
              sizeDimensions: sizeInfo ? sizeInfo.dimensions : '',
              sizePrice,
              to: entryEl.querySelector('[data-role="letter-to"]').value.trim(),
              from: entryEl.querySelector('[data-role="letter-from"]').value.trim(),
              message: entryEl.querySelector('[data-role="letter-message"]').value.trim()
            });
          });
          sel = { letters };
          lineTotal = letters.reduce((sum, l) => sum + (l.sizePrice || 0), 0);
        } else {
          const customizations = [];
          card.querySelectorAll('[data-role="customization-entry"]').forEach(entryEl => {
            const color1Select = entryEl.querySelector('[data-role="color1"]');
            const color2Select = entryEl.querySelector('[data-role="color2"]');
            const wrapperSelect = entryEl.querySelector('[data-role="wrapper"]');
            customizations.push({
              color1: color1Select ? color1Select.value : '',
              color2: color2Select ? color2Select.value : '',
              wrapper: wrapperSelect ? wrapperSelect.value : ''
            });
          });
          sel = { customizations };
          lineTotal = product.price * qty;
        }
        newItems.push({
          category: pageKey,
          name: product.name,
          unit: product.unit,
          price: product.price,
          qty,
          lineTotal,
          colorLine: formatColorLine(pageKey, sel),
          letters: pageKey === 'letter' ? sel.letters : null
        });
      }
    });

    addItemsToBasket(newItems);

    const addedCount = newItems.reduce((sum, it) => sum + it.qty, 0);
    msgEl.innerHTML = `Added ${addedCount} item${addedCount === 1 ? '' : 's'} to your basket. <a href="basket.html">View Basket &rarr;</a>`;
    msgEl.className = 'form-msg success show';

    // reset the form back to zero so the customer can add a different item next
    itemsEl.querySelectorAll('[data-role="qty"]').forEach(input => { input.value = 0; });
    recalculate();
  });
}
 
/* ---------------- basket page ---------------- */
function renderBasketLines(symbol) {
  const listEl = document.querySelector('[data-list="basket-items"]');
  const emptyEl = document.getElementById('basket-empty');
  const checkoutBlocks = document.querySelectorAll('[data-role="checkout-block"]');
  const items = getBasket();

  if (!listEl) return { items, subtotal: 0 };

  if (!items.length) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    checkoutBlocks.forEach(el => el.style.display = 'none');
    return { items, subtotal: 0 };
  }

  if (emptyEl) emptyEl.style.display = 'none';
  checkoutBlocks.forEach(el => el.style.display = '');

  listEl.innerHTML = items.map(it => `
    <div class="basket-line" data-id="${it.id}">
      <div class="basket-line-main">
        <span class="basket-line-cat">${escapeHtml(categoryLabel(it.category))}</span>
        <span class="basket-line-name">${it.qty} &times; ${escapeHtml(it.name)}</span>
        ${(!it.letters && it.colorLine) ? it.colorLine.split('\n').map(line => `<div class="basket-line-sub">* ${escapeHtml(line)}</div>`).join('') : ''}
        ${it.letters && it.letters.length ? buildLetterPreviewsHtml(it.letters, symbol) : ''}
      </div>
      <div class="basket-line-price">${formatMoney(it.lineTotal, symbol)}</div>
      <button type="button" class="basket-remove-btn" data-action="remove-basket-item" data-id="${it.id}" aria-label="Remove ${escapeHtml(it.name)} from basket">&times;</button>
    </div>
  `).join('');

  const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
  return { items, subtotal };
}

function initBasketPage(site, basketConf) {
  const symbol = site.currencySymbol || '$';
  const deliveryFee = (basketConf && basketConf.deliveryFee) || 0;
  const listEl = document.querySelector('[data-list="basket-items"]');
  if (!listEl) return;

  function recalc() {
    const { items, subtotal } = renderBasketLines(symbol);
    const hasItems = items.length > 0;
    const total = hasItems ? subtotal + deliveryFee : 0;
    document.querySelectorAll('[data-role="delivery-fee"]').forEach(el => el.textContent = formatMoney(deliveryFee, symbol));
    document.querySelectorAll('[data-role="subtotal"]').forEach(el => el.textContent = formatMoney(subtotal, symbol));
    document.querySelectorAll('[data-role="grand-total"]').forEach(el => el.textContent = formatMoney(total, symbol));
    return { items, subtotal, deliveryFee, total, hasItems };
  }

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="remove-basket-item"]');
    if (!btn) return;
    removeBasketItem(btn.getAttribute('data-id'));
    recalc();
  });

  recalc();

  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameField = document.getElementById('cust-name');
    const phoneField = document.getElementById('cust-phone');
    const addressField = document.getElementById('cust-address');
    const emailField = document.getElementById('cust-email');
    const notesField = document.getElementById('cust-notes');
    const fields = [nameField, phoneField, addressField];
    let valid = true;

    fields.forEach(f => {
      const wrapper = f.closest('.form-field');
      if (!f.value.trim()) {
        wrapper.classList.add('invalid');
        valid = false;
      } else {
        wrapper.classList.remove('invalid');
      }
    });

    const totals = recalc();
    const msgEl = document.getElementById('form-msg');

    if (!totals.hasItems) {
      msgEl.textContent = 'Your basket is empty. Add a few items before placing your order.';
      msgEl.className = 'form-msg error show';
      valid = false;
    }

    if (!valid) {
      if (totals.hasItems) {
        msgEl.textContent = 'Please fill in your name, phone number and delivery address.';
        msgEl.className = 'form-msg error show';
      }
      return;
    }
    msgEl.className = 'form-msg';

    const orderId = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
    const orderDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const customer = {
      name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      address: addressField.value.trim(),
      email: emailField ? emailField.value.trim() : '',
      notes: notesField ? notesField.value.trim() : ''
    };

    const orderedItems = totals.items;

    sendOrderEmails(null, site, orderId, orderDate, customer, orderedItems, totals);
    showReceipt(null, site, orderId, orderDate, customer, orderedItems, totals);

    clearBasket();
  });
}

function buildReceiptPdf(site, orderId, orderDate, customer, items, totals) {
  if (!window.jspdf) return null;
  const { jsPDF } = window.jspdf;
  const symbol = site.currencySymbol || '$';
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 40;
  const right = 555;
  let y = 50;
 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(site.brandName || 'Order Receipt', left, y);
  y += 20;
 
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Order ${orderId}`, left, y);
  doc.text(orderDate, right, y, { align: 'right' });
  y += 28;
 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Delivery To', left, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  [customer.name, customer.phone, customer.address].forEach(line => {
    doc.text(line, left, y);
    y += 14;
  });
  if (customer.email) { doc.text(`Email: ${customer.email}`, left, y); y += 14; }
  if (customer.notes) { doc.text(`Notes: ${customer.notes}`, left, y); y += 14; }
  y += 14;
 
  const pageBottom = 800;
  function ensureSpace(needed) {
    if (y + needed > pageBottom) {
      doc.addPage();
      y = 50;
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Items', left, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  items.forEach(it => {
    ensureSpace(20);
    doc.text(`${it.qty} x ${it.name} (${it.unit})`, left, y);
    doc.text(formatMoney(it.lineTotal, symbol), right, y, { align: 'right' });
    y += 14;
    if (!it.letters && it.colorLine) {
      doc.setFontSize(9);
      it.colorLine.split('\n').forEach(line => {
        const wrapped = doc.splitTextToSize(`* ${line}`, right - left - 10);
        wrapped.forEach(wLine => {
          ensureSpace(12);
          doc.text(wLine, left + 10, y);
          y += 12;
        });
      });
      doc.setFontSize(10);
    }
  });

  const allLetters = items.filter(it => it.letters && it.letters.length).flatMap(it => it.letters);
  if (allLetters.length) {
    y += 10;
    ensureSpace(24);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Letters to Write', left, y);
    y += 18;

    const multi = allLetters.length > 1;
    allLetters.forEach((l, i) => {
      ensureSpace(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text(multi ? `Letter ${i + 1}` : 'Letter', left, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Border: ${l.border}      Size: ${l.size} (${l.sizeDimensions}) - ${formatMoney(l.sizePrice || 0, symbol)}`, left, y);
      y += 13;
      doc.text(`To: ${l.to}      From: ${l.from}`, left, y);
      y += 16;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('Message:', left, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      const wrapped = doc.splitTextToSize(l.message, right - left - 16);
      wrapped.forEach(wLine => {
        ensureSpace(17);
        doc.text(wLine, left + 8, y);
        y += 17;
      });
      y += 12;
    });
  }
 
  ensureSpace(30);
  y += 6;
  doc.setDrawColor(180, 106, 114);
  doc.line(left, y, right, y);
  y += 18;
 
  ensureSpace(60);
  doc.setFontSize(10);
  doc.text('Subtotal', left, y);
  doc.text(formatMoney(totals.subtotal, symbol), right, y, { align: 'right' });
  y += 14;
  doc.text('Delivery Fee', left, y);
  doc.text(formatMoney(totals.deliveryFee, symbol), right, y, { align: 'right' });
  y += 20;
 
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Total Due on Delivery', left, y);
  doc.text(formatMoney(totals.total, symbol), right, y, { align: 'right' });
  y += 26;
 
  ensureSpace(20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Payment method: Cash on delivery', left, y);
 
  return doc.output('datauristring').replace(/;filename=[^;]*/, '');
}
 
function buildLetterPreviewsHtml(letters, symbol) {
  const multi = letters.length > 1;
  return letters.map((l, i) => `
    <div class="letter-preview-card">
      ${l.borderImage ? `<img src="${l.borderImage}" alt="${escapeHtml(l.border)} border" loading="lazy" onerror="this.style.display='none'">` : ''}
      <div class="letter-preview-body">
        <div class="letter-preview-meta">
          ${multi ? `<span><strong>Letter ${i + 1}</strong></span>` : ''}
          <span>Border: <strong>${escapeHtml(l.border)}</strong></span>
          <span>Size: <strong>${escapeHtml(l.size)}</strong> (${escapeHtml(l.sizeDimensions)}) &middot; ${formatMoney(l.sizePrice || 0, symbol)}</span>
        </div>
        <div class="letter-preview-tofrom">To ${escapeHtml(l.to)}, from ${escapeHtml(l.from)}</div>
        <div class="letter-preview-message">${escapeHtml(l.message)}</div>
      </div>
    </div>
  `).join('');
}

function buildLetterPreviewsPlainText(letters, symbol) {
  const multi = letters.length > 1;
  return letters.map((l, i) => {
    const prefix = multi ? `Letter ${i + 1}\n` : '';
    return `${prefix}Border: ${l.border}\nSize: ${l.size} (${l.sizeDimensions}) - ${formatMoney(l.sizePrice || 0, symbol)}\nTo: ${l.to}\nFrom: ${l.from}\nMessage:\n${l.message}`;
  }).join('\n\n');
}

function buildItemsHtml(items, symbol) {
  return items.map(it => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0dde1;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#3a3128;vertical-align:top;">
        <div style="font-weight:600;">${it.qty} &times; ${escapeHtml(it.name)} <span style="font-weight:400;color:#8a7f74;">(${escapeHtml(it.unit)})</span></div>
        ${(!it.letters && it.colorLine) ? it.colorLine.split('\n').map(line => `<div style="font-size:12.5px;font-style:italic;color:#8a7f74;margin-top:4px;">* ${escapeHtml(line)}</div>`).join('') : ''}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0dde1;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#8f4d55;text-align:right;white-space:nowrap;vertical-align:top;">
        ${formatMoney(it.lineTotal, symbol)}
      </td>
    </tr>
  `).join('');
}

function buildLetterPreviewsEmailHtml(letters, symbol) {
  const multi = letters.length > 1;
  return letters.map((l, i) => `
    <div style="background:#FBE1E7;border-radius:10px;padding:16px 18px;margin:0 0 14px 0;font-family:Helvetica,Arial,sans-serif;">
      <div style="font-size:12.5px;color:#8f4d55;margin-bottom:8px;">
        ${multi ? `<strong>Letter ${i + 1}</strong> &middot; ` : ''}Border: <strong>${escapeHtml(l.border)}</strong> &middot; Size: <strong>${escapeHtml(l.size)}</strong> (${escapeHtml(l.sizeDimensions)}) &middot; ${formatMoney(l.sizePrice || 0, symbol)}
      </div>
      <div style="font-size:15px;color:#2D3A47;margin-bottom:8px;">To ${escapeHtml(l.to)}, from ${escapeHtml(l.from)}</div>
      <div style="font-size:16px;line-height:1.7;color:#3a3128;background:#FFF7E6;border-radius:8px;padding:12px 14px;white-space:pre-wrap;">${escapeHtml(l.message)}</div>
    </div>
  `).join('');
}

function sendOrderEmails(pageData, site, orderId, orderDate, customer, items, totals) {
  const symbol = site.currencySymbol || '$';
  const cfg = site.emailjs;
  const statusEl = document.getElementById('email-status');
 
  const itemsText = items
    .map(it => {
      const base = `${it.qty} x ${it.name} (${formatMoney(it.price, symbol)} per ${it.unit}) = ${formatMoney(it.lineTotal, symbol)}`;
      const colorPart = (!it.letters && it.colorLine) ? it.colorLine.split('\n').map(line => `\n   * ${line}`).join('') : '';
      return base + colorPart;
    })
    .join('\n');

  const itemsHtml = buildItemsHtml(items, symbol);

  const allLetters = items.filter(it => it.letters && it.letters.length).flatMap(it => it.letters);
  const lettersText = allLetters.length ? buildLetterPreviewsPlainText(allLetters, symbol) : '';
  const lettersHtml = allLetters.length ? buildLetterPreviewsEmailHtml(allLetters, symbol) : '';
 
  const templateParams = {
    order_id: orderId,
    order_date: orderDate,
    shop_name: site.brandName,
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_address: customer.address,
    customer_email: customer.email || 'Not provided',
    customer_notes: customer.notes || 'None',
    has_notes: customer.notes ? 'yes' : '',
    has_email: customer.email ? 'yes' : '',
    items_text: itemsText,
    items_html: itemsHtml,
    has_letters: allLetters.length ? 'yes' : '',
    letters_text: lettersText,
    letters_html: lettersHtml,
    subtotal: formatMoney(totals.subtotal, symbol),
    delivery_fee: formatMoney(totals.deliveryFee, symbol),
    total: formatMoney(totals.total, symbol)
  };
 
  if (!cfg || !cfg.publicKey || !window.emailjs) {
    if (statusEl) {
      statusEl.textContent = 'Automatic email is not set up yet. Please save this receipt, we will confirm your order by phone.';
      statusEl.className = 'email-status show error';
    }
    console.error('EmailJS is not configured. Fill in site.emailjs in content.json.');
    return;
  }
 
  const sends = [
    emailjs.send(cfg.serviceId, cfg.clientTemplateId, {
      ...templateParams,
      receipt_pdf: buildReceiptPdf(site, orderId, orderDate, customer, items, totals)
    })
      .then(() => ({ ok: true, target: 'client' }))
      .catch(err => ({ ok: false, target: 'client', err }))
  ];
 
  if (customer.email) {
    sends.push(
      emailjs.send(cfg.serviceId, cfg.customerTemplateId, templateParams)
        .then(() => ({ ok: true, target: 'customer' }))
        .catch(err => ({ ok: false, target: 'customer', err }))
    );
  }
 
  Promise.all(sends).then(results => {
    if (!statusEl) return;
    const allOk = results.every(r => r.ok);
    if (allOk) {
      statusEl.textContent = customer.email
        ? 'A confirmation email has been sent to you and to our team.'
        : 'A confirmation email has been sent to our team.';
      statusEl.className = 'email-status show success';
    } else {
      results.forEach(r => { if (!r.ok) console.error('EmailJS send failed for', r.target, r.err); });
      statusEl.textContent = 'We could not send a confirmation email automatically. Please keep this receipt, we will confirm your order by phone.';
      statusEl.className = 'email-status show error';
    }
  });
}
 
function showReceipt(pageData, site, orderId, orderDate, customer, items, totals) {
  const symbol = site.currencySymbol || '$';
  const wrap = document.getElementById('receipt-wrap');
  const formSection = document.querySelector('.order-form-section');
  if (!wrap) return;
 
  document.getElementById('receipt-order-id').textContent = orderId;
  document.getElementById('receipt-order-date').textContent = orderDate;
  document.getElementById('receipt-cust-name').textContent = customer.name;
  document.getElementById('receipt-cust-phone').textContent = customer.phone;
  document.getElementById('receipt-cust-address').textContent = customer.address;
 
  const emailRow = document.getElementById('receipt-cust-email-row');
  if (customer.email) {
    document.getElementById('receipt-cust-email').textContent = customer.email;
    emailRow.style.display = '';
  } else {
    emailRow.style.display = 'none';
  }
 
  const notesRow = document.getElementById('receipt-cust-notes-row');
  if (customer.notes) {
    document.getElementById('receipt-cust-notes').textContent = customer.notes;
    notesRow.style.display = '';
  } else {
    notesRow.style.display = 'none';
  }
 
  const linesEl = document.getElementById('receipt-lines');
  linesEl.innerHTML = items.map(it => `
    <div class="receipt-line">
      <span>${it.qty} x ${escapeHtml(it.name)} (${escapeHtml(it.unit)})</span>
      <span>${formatMoney(it.lineTotal, symbol)}</span>
    </div>
    ${(!it.letters && it.colorLine) ? it.colorLine.split('\n').map(line => `<div class="receipt-line-sub">* ${escapeHtml(line)}</div>`).join('') : ''}
  `).join('');

  const lettersSection = document.getElementById('receipt-letters-section');
  const lettersEl = document.getElementById('receipt-letters');
  const allLetters = items.filter(it => it.letters && it.letters.length).flatMap(it => it.letters);
  if (lettersSection && lettersEl) {
    if (allLetters.length) {
      lettersEl.innerHTML = buildLetterPreviewsHtml(allLetters, symbol);
      lettersSection.style.display = '';
    } else {
      lettersEl.innerHTML = '';
      lettersSection.style.display = 'none';
    }
  }
 
  document.getElementById('receipt-subtotal').textContent = formatMoney(totals.subtotal, symbol);
  document.getElementById('receipt-delivery').textContent = formatMoney(totals.deliveryFee, symbol);
  document.getElementById('receipt-total').textContent = formatMoney(totals.total, symbol);
 
  if (formSection) formSection.style.display = 'none';
  wrap.classList.add('show');
  wrap.scrollIntoView({ behavior: 'auto' });
}
 
/* ---------------- boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavIcons();
  updateBasketBadge();
  updateFavoritesBadge();
  window.addEventListener('storage', e => {
    if (e.key === BASKET_KEY) updateBasketBadge();
    if (e.key === FAVORITES_KEY) updateFavoritesBadge();
  });
  fetch('content.json')
    .then(res => res.json())
    .then(data => {
      document.title = getPath(data, 'site.pageTitle') || document.title;
      bindText(document, data);
 
      if (window.emailjs && data.site && data.site.emailjs && data.site.emailjs.publicKey) {
        emailjs.init({ publicKey: data.site.emailjs.publicKey });
      }
 
      if (data.nav) renderNav(data.nav.links);
      if (data.trust) renderTrust(data.trust);
      if (data.categories) renderCategories(data.categories);
      if (data.products) renderProducts(data.products, data.categories);
      initSearchAutocomplete(data.products);
      if (data.footer) {
        renderFooterColumns(data.footer.columns);
        renderLegalLinks(data.footer.legalLinks);
      }
      if (data.cookieBanner) initCookieBanner(data.cookieBanner);
 
      const page = document.body.getAttribute('data-page');
      if (page === 'privacy' && data.legalPages) {
        bindText(document, { legal: data.legalPages.privacyPolicy });
        renderLegalSections(data.legalPages.privacyPolicy);
      }
      if (page === 'terms' && data.legalPages) {
        bindText(document, { legal: data.legalPages.termsConditions });
        renderLegalSections(data.legalPages.termsConditions);
      }
      if (page === 'cookies' && data.legalPages) {
        bindText(document, { legal: data.legalPages.cookiePolicy });
        renderLegalSections(data.legalPages.cookiePolicy);
      }
      if (page === 'order-crochet' && data.orderPages) {
        document.title = data.orderPages.crochet.pageTitle;
        bindText(document, { order: data.orderPages.crochet });
        renderOrderPage('crochet', data.orderPages.crochet, data.site, data.colorOptions);
      }
      if (page === 'order-ribbon' && data.orderPages) {
        document.title = data.orderPages.ribbon.pageTitle;
        bindText(document, { order: data.orderPages.ribbon });
        renderOrderPage('ribbon', data.orderPages.ribbon, data.site, data.colorOptions);
      }
      if (page === 'order-letter' && data.orderPages) {
        document.title = data.orderPages.letter.pageTitle;
        bindText(document, { order: data.orderPages.letter });
        renderOrderPage('letter', data.orderPages.letter, data.site, data.colorOptions);
      }
      if (page === 'basket' && data.basketPage) {
        document.title = data.basketPage.pageTitle;
        bindText(document, { basket: data.basketPage });
        initBasketPage(data.site, data.basketPage);
      }
      if (page === 'favorites' && data.favoritesPage) {
        document.title = data.favoritesPage.pageTitle;
        bindText(document, { favorites: data.favoritesPage });
        renderFavoritesPage(data.products, data.categories);
      }
      if (page === 'shop' && data.shopPage) {
        document.title = data.shopPage.pageTitle;
        bindText(document, { shop: data.shopPage });
        initShopFilters(data.categories);

        const q = new URLSearchParams(window.location.search).get('q');
        if (q) {
          const input = document.getElementById('searchInput');
          const wrap = document.getElementById('searchWrap');
          const toggle = document.getElementById('searchToggle');
          if (input) input.value = q;
          if (wrap) wrap.classList.add('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'true');
          filterProducts(q);
        }
      }
      if (page === '404') {
        document.title = `Page Not Found | ${data.site.brandName}`;
      }
    })
    .catch(err => {
      console.error('Could not load content.json', err);
    });
});