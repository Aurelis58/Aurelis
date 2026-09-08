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
 
function renderProducts(items) {
  const el = document.querySelector('[data-list="products"]');
  if (!el) return;
  el.innerHTML = items.map(p => `
    <div class="product-card">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
      <div class="product-photo">
        <img src="${p.image}" alt="${p.imageAlt || p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="cat-label">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="price-row">
          <span class="price">${p.price}</span>
          <div class="add-btn"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
        </div>
      </div>
    </div>
  `).join('');
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
 
/* ---------------- hero carousel ---------------- */
let current = 0;
const totalSlides = 3;
let autoplayTimer = null;
 
function renderSlide() {
  const slidesEl = document.getElementById('slides');
  const dots = document.querySelectorAll('.dot');
  if (!slidesEl) return;
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}
function moveSlide(dir) {
  current = (current + dir + totalSlides) % totalSlides;
  renderSlide();
  resetAutoplay();
}
function goToSlide(i) {
  current = i;
  renderSlide();
  resetAutoplay();
}
function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => moveSlide(1), 6000);
}
window.moveSlide = moveSlide;
window.goToSlide = goToSlide;
 
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
        <img src="${b.image}" alt="${escapeHtml(b.name)}" loading="lazy">
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
        <div>
          <span class="order-item-name">${p.name}</span>
          <span class="order-item-unit">${unitLabel}</span>
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

  const deliveryFee = pageData.deliveryFee || 0;
  const deliveryFeeEls = document.querySelectorAll('[data-role="delivery-fee"]');
  deliveryFeeEls.forEach(el => el.textContent = formatMoney(deliveryFee, symbol));
 
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
    const total = hasItems ? subtotal + deliveryFee : 0;
 
    document.querySelectorAll('[data-role="subtotal"]').forEach(el => el.textContent = formatMoney(subtotal, symbol));
    document.querySelectorAll('[data-role="grand-total"]').forEach(el => el.textContent = formatMoney(total, symbol));
    return { subtotal, deliveryFee, total, hasItems };
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
 
  const form = document.getElementById('order-form');
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
 
    const totals = recalculate();
    const msgEl = document.getElementById('form-msg');
 
    if (!totals.hasItems) {
      msgEl.textContent = 'Please choose at least one item before submitting your order.';
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
        msgEl.textContent = colorsValid
          ? 'Please fill in your name, phone number and delivery address.'
          : 'Please fill in the required details for each item, and fill in your name, phone number and delivery address.';
        msgEl.className = 'form-msg error show';
      }
      return;
    }
    msgEl.className = 'form-msg';
 
    const orderedItems = [];
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
        orderedItems.push({
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
 
    const orderId = 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Date.now().toString().slice(-4);
    const orderDate = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
 
    const customer = {
      name: nameField.value.trim(),
      phone: phoneField.value.trim(),
      address: addressField.value.trim(),
      email: emailField ? emailField.value.trim() : '',
      notes: notesField ? notesField.value.trim() : ''
    };
 
    sendOrderEmails(pageData, site, orderId, orderDate, customer, orderedItems, totals);
    showReceipt(pageData, site, orderId, orderDate, customer, orderedItems, totals);
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
      ${l.borderImage ? `<img src="${l.borderImage}" alt="${escapeHtml(l.border)} border">` : ''}
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
      <span>${it.qty} x ${it.name} (${it.unit})</span>
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
      if (data.products) renderProducts(data.products);
      if (data.footer) {
        renderFooterColumns(data.footer.columns);
        renderLegalLinks(data.footer.legalLinks);
      }
 
      const page = document.body.getAttribute('data-page');
      if (page === 'privacy' && data.legalPages) {
        bindText(document, { legal: data.legalPages.privacyPolicy });
        renderLegalSections(data.legalPages.privacyPolicy);
      }
      if (page === 'terms' && data.legalPages) {
        bindText(document, { legal: data.legalPages.termsConditions });
        renderLegalSections(data.legalPages.termsConditions);
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
 
      if (document.getElementById('slides')) {
        renderSlide();
        resetAutoplay();
      }
    })
    .catch(err => {
      console.error('Could not load content.json', err);
    });
});