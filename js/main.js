/* ============================================
   Кусочек счастья — интерактивность
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCatalogFilters();
  initOrderForm();
  initScrollReveal();
  initHeroReveal();
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
  const reveals = document.querySelectorAll('.section .reveal, .card, .step, .review-card');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      return;
    }

    form.reset();
    successMsg.hidden = false;

    setTimeout(() => {
      successMsg.hidden = true;
    }, 5000);
  });
}
