/* ========================================================
   REVEAL.JS — Scroll Reveal Animation
   Rahat Ahmed Portfolio v2.0
   
   Features:
   - Intersection Observer based (performant)
   - Respects prefers-reduced-motion
   - Multiple reveal types (up, down, left, right, scale, fade)
   - Custom delays via data attributes
   - One-time trigger (better UX)
   - Handles late-added elements
   ======================================================== */

(function () {
  'use strict';

  // ======================================================
  // CHECK REDUCED MOTION PREFERENCE
  // ======================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ======================================================
  // SELECT ALL REVEAL ELEMENTS
  // ======================================================
  const revealElements = document.querySelectorAll('[data-reveal]');

  // Guard clause
  if (!revealElements.length) {
    console.warn('Reveal: No elements to reveal');
    return;
  }

  // ======================================================
  // REDUCED MOTION — Show all immediately
  // ======================================================
  if (prefersReducedMotion) {
    revealElements.forEach(el => {
      el.classList.add('is-visible');
    });
    console.log('✓ Reveal: Reduced motion mode - all visible');
    return;
  }

  // ======================================================
  // INTERSECTION OBSERVER OPTIONS
  // ======================================================
  const observerOptions = {
    root: null,          // Use viewport
    rootMargin: '0px 0px -80px 0px', // Trigger 80px before element enters
    threshold: 0.1       // 10% of element visible
  };

  // ======================================================
  // OBSERVER CALLBACK
  // ======================================================
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Get custom delay if specified
        const customDelay = el.getAttribute('data-reveal-delay');
        
        if (customDelay) {
          setTimeout(() => {
            el.classList.add('is-visible');
          }, parseInt(customDelay, 10));
        } else {
          el.classList.add('is-visible');
        }

        // Stop observing this element (one-time reveal)
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  // ======================================================
  // START OBSERVING ALL ELEMENTS
  // ======================================================
  function observeElements(elements) {
    elements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  observeElements(revealElements);

  // ======================================================
  // WATCH FOR DYNAMICALLY ADDED ELEMENTS
  // ======================================================
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check the node itself
          if (node.hasAttribute && node.hasAttribute('data-reveal')) {
            revealObserver.observe(node);
          }
          
          // Check descendants
          if (node.querySelectorAll) {
            const newReveals = node.querySelectorAll('[data-reveal]');
            observeElements(newReveals);
          }
        }
      });
    });
  });

  // Observe body for changes
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ======================================================
  // FALLBACK — Show all if page loaded but nothing visible
  // (Safety net for edge cases)
  // ======================================================
  window.addEventListener('load', () => {
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element is in viewport but not visible yet
        if (rect.top < window.innerHeight && !el.classList.contains('is-visible')) {
          el.classList.add('is-visible');
        }
      });
    }, 100);
  });

  // ======================================================
  // HANDLE PAGE VISIBILITY CHANGE
  // (Re-check reveals when tab becomes visible)
  // ======================================================
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Re-check all remaining un-revealed elements
      revealElements.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
            el.classList.add('is-visible');
          }
        }
      });
    }
  });

  console.log(`✓ Reveal initialized — ${revealElements.length} elements`);

})();// Reveal JS — Scroll Reveal Animation
