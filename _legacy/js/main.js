/* ========================================================
   MAIN.JS — Entry Point
   Rahat Ahmed Portfolio v2.0

   NOTE: The feature modules (nav, reveal, counter, language,
   theme) are self-initializing IIFEs loaded directly from
   index.html via <script defer>. They must NOT be re-loaded
   here — doing so double-executes them (duplicate listeners,
   duplicate observers, double animations).

   This file only sets up the small global features that are
   not covered by any module:
   - Footer year update
   - Console welcome message
   - Performance monitoring
   - Global utilities (image-error fallback, external links,
     copy-email, contact form handling)
   ======================================================== */

(function () {
  'use strict';

  // ======================================================
  // GLOBAL INITIALIZATION
  // ======================================================
  function initializeApp() {
    updateFooterYear();
    showWelcomeMessage();
    handleImageErrors();
    initPerformanceMonitoring();
    initExternalLinkHandler();
    initCopyEmailFeature();
    initContactForm();

    console.log('✓ Main app initialized');
  }

  // ======================================================
  // FOOTER YEAR UPDATE
  // ======================================================
  function updateFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ======================================================
  // CONSOLE WELCOME MESSAGE
  // ======================================================
  function showWelcomeMessage() {
    const styles = {
      title: 'font-size: 20px; font-weight: bold; color: #7A0C2E; padding: 8px 0;',
      subtitle: 'font-size: 14px; color: #5A4F45; padding: 4px 0;',
      link: 'font-size: 13px; color: #1877F2; text-decoration: underline;',
      credit: 'font-size: 11px; color: #8B7F73; padding-top: 8px;'
    };

    console.log('%c🩸 Rahat Ahmed — Portfolio v2.0', styles.title);
    console.log('%cStudent · Teacher · Blood Donor · Web Developer', styles.subtitle);
    console.log('%c📧 rahatbd20505@gmail.com', styles.link);
    console.log('%c🌐 https://rahatahmedbd.github.io', styles.link);
    console.log('%c— Built with HTML, CSS, and vanilla JavaScript', styles.credit);
    console.log('%c— Made with ❤️ from Sunamganj, Bangladesh', styles.credit);
  }

  // ======================================================
  // IMAGE ERROR HANDLING
  // Replace broken images with a tasteful placeholder.
  // (Some gallery photos may not be committed yet.)
  // ======================================================
  function handleImageErrors() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // Also catch images that already failed before this runs.
      if (img.complete && img.naturalWidth === 0) {
        replaceBrokenImage(img);
        return;
      }

      img.addEventListener('error', function () {
        replaceBrokenImage(this);
      }, { once: true });
    });
  }

  function replaceBrokenImage(img) {
    if (img.dataset.errorHandled) return;
    img.dataset.errorHandled = 'true';

    const parent = img.parentElement;
    if (parent) {
      parent.style.background = 'linear-gradient(135deg, #F3EEE4, #E8DFD1)';
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';

      const icon = document.createElement('span');
      icon.textContent = '📷';
      icon.style.opacity = '0.4';
      icon.style.fontSize = '2rem';
      parent.appendChild(icon);
    }

    img.style.display = 'none';
  }

  // ======================================================
  // PERFORMANCE MONITORING
  // ======================================================
  function initPerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
            console.log(`⚡ Page loaded in ${loadTime}ms`);
          }
        }, 0);
      });
    }
  }

  // ======================================================
  // EXTERNAL LINK HANDLER
  // Add security attributes to external links
  // ======================================================
  function initExternalLinkHandler() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="rahatahmedbd.github.io"])');

    externalLinks.forEach(link => {
      if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  // ======================================================
  // COPY EMAIL FEATURE
  // Click email to copy to clipboard
  // ======================================================
  function initCopyEmailFeature() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(link => {
      link.addEventListener('click', function () {
        const email = this.getAttribute('href').replace('mailto:', '');

        // Try to copy to clipboard (silent, doesn't prevent default)
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).catch(() => {
            // Silent fail - default mailto: will still work
          });
        }
      });
    });
  }

  // ======================================================
  // CONTACT FORM HANDLER
  // Submits to Formspree via fetch with proper UX states.
  // Detects an unconfigured form ID and guides the owner.
  // ======================================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const action = form.getAttribute('action') || '';

    function setStatus(message, type) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.setAttribute('data-status', type); // success | error | loading
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Guard: Formspree ID not yet configured.
      if (!action || action.indexOf('YOUR_FORM_ID') !== -1) {
        console.error(
          'Contact form is not configured. Replace YOUR_FORM_ID in index.html ' +
          '(contact form action) with your real Formspree form ID.'
        );
        setStatus(
          '⚠️ The contact form is not configured yet. Please email rahatbd20505@gmail.com directly.',
          'error'
        );
        return;
      }

      // Native validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending…', 'loading');

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          form.reset();
          setStatus('✅ Thank you! Your message has been sent.', 'success');
        } else {
          const data = await response.json().catch(() => ({}));
          setStatus(
            (data && data.errors && data.errors[0] && data.errors[0].message) ||
            '❌ Something went wrong. Please try again or email directly.',
            'error'
          );
        }
      } catch (err) {
        setStatus('❌ Network error. Please email rahatbd20505@gmail.com directly.', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // ======================================================
  // START APP
  // ======================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

})();
