/* ============================================
   Кусочек счастья — интерактивность
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCatalogFilters();
  initOrderForm();
  initScrollReveal();
  initHeroReveal();
  initReviewsCarousel();
});

/* --- Появление элементов при загрузке hero --- */
function initHeroReveal() {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  requestAnimationFrame(() => {
    heroReveals.forEach((el) => el.classList.add('reveal--visible'));
  });
}

/* --- Появление элементов при скролле --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.section .reveal, .card, .step, .promo-card, .reviews-carousel');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => {
    if (!el.closest('.hero')) {
      observer.observe(el);
    }
  });
}

/* --- Sticky header с тенью при скролле --- */
function initHeader() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  });

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('header__nav--open');
    burger.classList.toggle('header__burger--active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('header__nav--open');
      burger.classList.remove('header__burger--active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --- Фильтры каталога --- */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      cards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.classList.toggle('card--hidden', !show);
      });
    });
  });
}

/* --- Форма заказа --- */
function initOrderForm() {
  const form = document.getElementById('orderForm');
  const successMsg = document.getElementById('formSuccess');
  const consent = form.querySelector('#consent');
  const consentError = document.getElementById('consentError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    consentError.hidden = true;

    if (!name || !phone) {
      return;
    }

    if (!consent.checked) {
      consentError.hidden = false;
      consent.focus();
      return;
    }

    form.reset();
    successMsg.hidden = false;

    setTimeout(() => {
      successMsg.hidden = true;
    }, 5000);
  });

  consent?.addEventListener('change', () => {
    if (consent.checked) {
      consentError.hidden = true;
    }
  });
}

/* --- Карусель отзывов (stagger) --- */
function initReviewsCarousel() {
  const carousel = document.getElementById('reviewsCarousel');
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll('.review-card')];
  const prevBtn = carousel.querySelector('[data-dir="-1"]');
  const nextBtn = carousel.querySelector('[data-dir="1"]');
  let activeIndex = 0;

  function updatePositions() {
    const total = cards.length;

    cards.forEach((card, index) => {
      let position = index - activeIndex;

      if (position > 1) position -= total;
      if (position < -1) position += total;

      card.dataset.position = String(position);
      card.setAttribute('aria-hidden', position !== 0 ? 'true' : 'false');
    });
  }

  function move(steps) {
    const total = cards.length;
    activeIndex = (activeIndex + steps + total) % total;
    updatePositions();
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const position = Number(card.dataset.position);
      if (position !== 0) move(position);
    });
  });

  prevBtn?.addEventListener('click', () => move(-1));
  nextBtn?.addEventListener('click', () => move(1));

  updatePositions();
}
