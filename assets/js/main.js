'use strict';

// CONFIGURATION: preencher somente com dados confirmados antes da publicação.
const SITE_CONFIG = Object.freeze({
  canonicalUrl: '',
  googleReviewsUrl: '',
  whatsappNotice: { initialDelay: 6000, visibleFor: 4500, repeatAfter: 90000 }
});
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

function configureMetadata() {
  if (SITE_CONFIG.canonicalUrl) {
    const url = new URL(SITE_CONFIG.canonicalUrl);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url.href;
    document.head.append(canonical);
    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = url.href;
    document.head.append(ogUrl);
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(meta => {
      meta.content = new URL('assets/img/hs-ambiente.webp', url).href;
    });
  }
  if (SITE_CONFIG.googleReviewsUrl) {
    document.querySelectorAll('.google-review-link').forEach(link => {
      link.href = SITE_CONFIG.googleReviewsUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    });
  }
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
}

// HEADER / MOBILE MENU: dialog provides focus containment and background inertness.
function initializeMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  const closeMenu = () => {
    if (menu.open) menu.close();
  };
  toggle.addEventListener('click', () => {
    menu.showModal();
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
  });
  menu.querySelector('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

// SCROLL / ANCHORS / ACTIVE NAVIGATION
function initializeScroll() {
  const header = document.querySelector('.site-header');
  const topLink = document.querySelector('.back-top');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-media img');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const contentLinks = [...document.querySelectorAll('main a, footer a')];
  const desktop = window.matchMedia('(min-width: 901px)');
  let scheduled = false;
  let heroVisible = true;
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; }).observe(hero);
  }
  const update = () => {
    scheduled = false;
    const scrolled = window.scrollY > 40;
    header?.classList.toggle('scrolled', scrolled);
    let showTop = window.scrollY > window.innerHeight * .65;
    if (showTop && topLink && window.innerWidth <= 640) {
      const control = topLink.getBoundingClientRect();
      showTop = !contentLinks.some(link => rectanglesOverlap(control, link.getBoundingClientRect()));
    }
    if (topLink) {
      topLink.classList.toggle('visible', showTop);
      topLink.setAttribute('aria-hidden', String(!showTop));
      topLink.tabIndex = showTop ? 0 : -1;
    }
    if (heroImage && heroVisible) {
      const offset = !motionPreference.matches && desktop.matches ? Math.min(window.scrollY * .035, 22) : 0;
      heroImage.style.setProperty('--parallax', `${offset}px`);
    }
    const marker = (header?.offsetHeight || 72) + 100;
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) current = section.id;
    });
    navLinks.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const requestUpdate = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  motionPreference.addEventListener('change', requestUpdate);
  update();
}

// REVEALS: enhance only when supported; no-JS content is visible.
function initializeReveals() {
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    element.classList.add('reveal-ready');
    observer.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('revealed'));
      observer.disconnect();
    }
  });
}

// SERVICES: photos illustrate only the treatments represented in the supplied assets.
function initializeServicePreview() {
  const image = document.getElementById('service-photo');
  if (!image) return;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let timer;
  const showPhoto = row => {
    clearTimeout(timer);
    image.classList.add('changing');
    timer = setTimeout(() => {
      image.src = `assets/img/${row.dataset.photo}`;
      image.alt = row.dataset.alt;
      image.classList.remove('changing');
    }, motionPreference.matches ? 0 : 160);
  };
  document.querySelectorAll('.service-row[data-photo]').forEach(row => {
    row.addEventListener('mouseenter', () => { if (finePointer.matches) showPhoto(row); });
    row.addEventListener('focusin', () => showPhoto(row));
  });
}

// GALLERY: native modal, Escape, focus return, full uncropped photographs.
function initializeGallery() {
  const modal = document.querySelector('.lightbox');
  if (!modal) return;
  const image = modal.querySelector('img');
  const caption = modal.querySelector('figcaption');
  document.querySelectorAll('[data-gallery]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      modal.showModal();
      document.body.classList.add('lightbox-open');
    });
  });
  modal.querySelector('.lightbox-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
}

// WHATSAPP: timing is centralized; hide during modal navigation or an inactive tab.
function initializeWhatsAppNotice() {
  const note = document.querySelector('.whatsapp-note');
  if (!note) return;
  const timing = SITE_CONFIG.whatsappNotice;
  let timer;
  let dismissed = false;
  const hide = () => { note.hidden = true; };
  const show = () => {
    if (dismissed) return;
    if (document.hidden || document.querySelector('dialog[open]')) {
      timer = setTimeout(show, timing.repeatAfter);
      return;
    }
    note.hidden = false;
    if (window.innerWidth <= 640) {
      const bounds = note.getBoundingClientRect();
      const coversLink = [...document.querySelectorAll('main a, footer a')].some(link =>
        rectanglesOverlap(bounds, link.getBoundingClientRect())
      );
      if (coversLink) {
        hide();
        timer = setTimeout(show, timing.repeatAfter);
        return;
      }
    }
    timer = setTimeout(() => {
      hide();
      timer = setTimeout(show, timing.repeatAfter);
    }, timing.visibleFor);
  };
  note.querySelector('.note-close').addEventListener('click', () => {
    dismissed = true;
    clearTimeout(timer);
    hide();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  document.querySelectorAll('dialog').forEach(dialog => {
    new MutationObserver(() => { if (dialog.open) hide(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  window.addEventListener('pagehide', () => { clearTimeout(timer); hide(); });
  window.addEventListener('pageshow', event => { if (event.persisted && !dismissed) timer = setTimeout(show, timing.initialDelay); });
  timer = setTimeout(show, timing.initialDelay);
}

function rectanglesOverlap(first, second) {
  return second.width > 0 && second.height > 0 &&
    first.left < second.right && first.right > second.left &&
    first.top < second.bottom && first.bottom > second.top;
}

configureMetadata();
initializeMenu();
initializeScroll();
initializeReveals();
initializeServicePreview();
initializeGallery();
initializeWhatsAppNotice();
