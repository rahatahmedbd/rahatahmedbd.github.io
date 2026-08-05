/* ========================================================
   MAIN.JS — Entry Point
   Rahat Ahmed Portfolio v2.0
   
   This file loads all other JS modules and initializes
   global features like:
   - Footer year update
   - Console welcome message
   - Performance monitoring
   - Global utilities
   ======================================================== */

(function () {
  'use strict';

  // ======================================================
  // LOAD ALL MODULES
  // ======================================================
  const modules = [
    'js/nav.js',
    'js/reveal.js',
    'js/counter.js',
    'js/language.js',
    'js/theme.js'
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadAllModules() {
    try {
      await Promise.all(modules.map(loadScript));
      console.log('✓ All modules loaded');
      initializeApp();
    } catch (error) {
      console.error('Module loading error:', error);
    }
  }

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
  // Replace broken images with placeholder
  // ======================================================
  function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        if (this.dataset.errorHandled) return;
        this.dataset.errorHandled = 'true';
        
        // Create fallback
        const parent = this.parentElement;
        if (parent) {
          parent.style.background = 'linear-gradient(135deg, #F3EEE4, #E8DFD1)';
          parent.style.display = 'flex';
          parent.style.alignItems = 'center';
          parent.style.justifyContent = 'center';
          parent.style.color = '#8B7F73';
          parent.style.fontSize = '2rem';
          
          // Add icon
          const icon = document.createElement('span');
          icon.textContent = '📷';
          icon.style.opacity = '0.4';
          parent.appendChild(icon);
        }
        
        this.style.display = 'none';
      }, { once: true });
    });
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
      if (!link.hasAttribute('rel')) {
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
      link.addEventListener('click', function(e) {
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
  // START APP
  // ======================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllModules);
  } else {
    loadAllModules();
  }

})();
