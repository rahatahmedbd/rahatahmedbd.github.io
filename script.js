// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('[data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
}

// ===== Blood donation counter animation =====
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      let current = 0;
      const step = () => {
        current += 1;
        el.textContent = current
          .toString()
          .split('')
          .map(d => bnDigits[parseInt(d, 10)])
          .join('');
        if (current < target) {
          requestAnimationFrame(() => setTimeout(step, 180));
        }
      };
      if (target > 0) step();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Nav background on scroll (subtle shadow) =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 12) {
    nav.style.boxShadow = '0 8px 24px -16px rgba(34,26,21,0.35)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
