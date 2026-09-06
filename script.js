const ICONS = {
  crochet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="5"/><path d="M13 13l7 7"/></svg>',
  ribbon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8c8-6 16 6 8 6-8 0-4-12 8-6"/></svg>',
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
 
/* ---------------- boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  fetch('content.json')
    .then(res => res.json())
    .then(data => {
      document.title = getPath(data, 'site.pageTitle') || document.title;
      bindText(document, data);
 
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
 
      if (document.getElementById('slides')) {
        renderSlide();
        resetAutoplay();
      }
    })
    .catch(err => {
      console.error('Could not load content.json', err);
    });
});