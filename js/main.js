/* Injection des partials header/footer, navigation mobile, active link, reveal au scroll */

async function injectPartial(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return;
  const res = await fetch(url, { cache: 'no-store' });
  host.innerHTML = await res.text();
}

function setActiveNavLink() {
  const current = document.body.dataset.page;
  if (!current) return;
  document.querySelectorAll('.main-nav a[data-page]').forEach((link) => {
    if (link.dataset.page === current) link.setAttribute('aria-current', 'page');
  });
}

function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function setupScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => observer.observe(el));
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

const CF_TRANSITION_HORSE_EMOJI = `<span class="cf-transition-horse">🏇</span>`;

function cfGetTransitionOverlay() {
  let overlay = document.getElementById('cfPageTransition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cfPageTransition';
    overlay.className = 'cf-transition';
    overlay.innerHTML = CF_TRANSITION_HORSE_EMOJI;
    document.body.appendChild(overlay);
  }
  return overlay;
}

function cfNavigateWithTransition(url) {
  const overlay = cfGetTransitionOverlay();
  overlay.classList.add('active');
  setTimeout(() => { window.location.href = url; }, 2000);
}

// Si la page est restaurée depuis le cache du navigateur (retour arrière),
// l'overlay de transition peut être resté figé en état "actif" : on le masque.
window.addEventListener('pageshow', () => {
  const overlay = document.getElementById('cfPageTransition');
  if (overlay) overlay.classList.remove('active');
});

function setupPageTransitions() {
  cfGetTransitionOverlay();
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    let url;
    try { url = new URL(href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    cfNavigateWithTransition(url.href);
  });
}

function setupGallopEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', (e) => {
    const horse = document.createElement('span');
    horse.className = 'cf-horse-burst';
    horse.textContent = '🐎';
    horse.style.left = e.clientX + 'px';
    horse.style.top = e.clientY + 'px';
    document.body.appendChild(horse);
    horse.addEventListener('animationend', () => horse.remove());
    setTimeout(() => horse.remove(), 1200);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupPageTransitions();
  setupGallopEffect();
  await Promise.all([
    injectPartial('#site-header', '/partials/header.html'),
    injectPartial('#site-footer', '/partials/footer.html'),
  ]);
  setActiveNavLink();
  setupNavToggle();
  setYear();
  setupScrollReveal();
  document.dispatchEvent(new CustomEvent('partialsReady'));
});
