/* ========================================================
   COUNTER.JS — Number Count-Up Animation
   Rahat Ahmed Portfolio v2.0
   
   Features:
   - Smooth 0 → target counting
   - Bengali (০-৯) and English (0-9) number support
   - Language-aware (uses current portfolio language)
   - Intersection Observer triggered
   - Respects reduced motion
   - One-time animation
   - Easing (starts slow, speeds up, slows down)
   ======================================================== */

(function () {
  'use strict';

  // ======================================================
  // ELEMENTS & CONFIG
  // ======================================================
  const counters = document.querySelectorAll('[data-count]');
  
  if (!counters.length) {
    console.warn('Counter: No elements found');
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Bengali digits mapping
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  // Animation duration (in ms)
  const DEFAULT_DURATION = 1800;
  const DEFAULT_START = 0;

  // ======================================================
  // HELPER: Convert English to Bengali digits
  // ======================================================
  function toBengaliNumber(num) {
    return String(num)
      .split('')
      .map(char => {
        const digit = parseInt(char, 10);
        return isNaN(digit) ? char : bengaliDigits[digit];
      })
      .join('');
  }

  // ======================================================
  // HELPER: Get current language
  // ======================================================
  function getCurrentLanguage() {
    // Check localStorage first (set by language.js)
    const savedLang = localStorage.getItem('portfolio-lang');
    if (savedLang) return savedLang;
    
    // Fallback to HTML lang attribute
    const htmlLang = document.documentElement.getAttribute('lang');
    return htmlLang === 'en' ? 'en' : 'bn';
  }

  // ======================================================
  // HELPER: Format number based on language
  // ======================================================
  function formatNumber(num, includeSuffix = false, originalText = '') {
    const currentLang = getCurrentLanguage();
    let formatted = currentLang === 'bn' ? toBengaliNumber(num) : String(num);
    
    // Preserve "+" suffix if original had it
    if (includeSuffix && originalText.includes('+')) {
      formatted += '+';
    }
    
    return formatted;
  }

  // ======================================================
  // EASING FUNCTION (Ease-out cubic)
  // Makes counter feel more natural
  // ======================================================
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ======================================================
  // ANIMATE COUNTER
  // ======================================================
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = parseInt(element.getAttribute('data-count-duration'), 10) || DEFAULT_DURATION;
    const start = parseInt(element.getAttribute('data-count-start'), 10) || DEFAULT_START;
    const originalText = element.textContent;
    
    // Check if original had "+" suffix
    const hasSuffix = originalText.includes('+');

    // If reduced motion, show final value immediately
    if (prefersReducedMotion) {
      element.textContent = formatNumber(target, hasSuffix, originalText);
      return;
    }

    // If target is invalid, skip
    if (isNaN(target)) {
      console.warn('Counter: Invalid target', element);
      return;
    }

    const range = target - start;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(start + (range * easedProgress));
      
      element.textContent = formatNumber(currentValue, hasSuffix, originalText);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        element.textContent = formatNumber(target, hasSuffix, originalText);
        element.classList.add('is-counted');
      }
    }

    window.requestAnimationFrame(step);
  }

  // ======================================================
  // INTERSECTION OBSERVER — Trigger when visible
  // ======================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.4  // 40% visible before triggering
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Skip if already counted
        if (el.classList.contains('is-counted')) {
          observer.unobserve(el);
          return;
        }
        
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // ======================================================
  // START OBSERVING
  // ======================================================
  counters.forEach(counter => {
    // Set initial value to 0 (in correct format)
    const originalText = counter.textContent;
    const hasSuffix = originalText.includes('+');
    counter.textContent = formatNumber(0, hasSuffix, originalText);
    
    counterObserver.observe(counter);
  });

  // ======================================================
  // LANGUAGE CHANGE HANDLER
  // Re-render counted numbers when language switches
  // ======================================================
  window.addEventListener('languageChanged', (e) => {
    counters.forEach(counter => {
      if (counter.classList.contains('is-counted')) {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const hasSuffix = counter.textContent.includes('+');
        counter.textContent = formatNumber(target, hasSuffix, counter.textContent);
      }
    });
  });

  console.log(`✓ Counter initialized — ${counters.length} counters`);

})();
