/* ========================================================
   LANGUAGE.JS — Bilingual Toggle System
   Rahat Ahmed Portfolio v2.0
   
   Features:
   - Toggle between Bengali (বাং) and English (EN)
   - Saves preference in localStorage
   - Updates all elements with data-lang-bn / data-lang-en
   - Updates HTML lang attribute
   - Dispatches custom event for other scripts
   - Smooth fade transition
   ======================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-lang';
  const DEFAULT_LANG = 'bn';

  const langButtons = document.querySelectorAll('.lang-switch__btn');
  const htmlEl = document.documentElement;
  const body = document.body;

  if (!langButtons.length) {
    console.warn('Language: No language buttons found');
    return;
  }

  // ======================================================
  // GET SAVED LANGUAGE
  // ======================================================
  function getSavedLanguage() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  // ======================================================
  // SAVE LANGUAGE
  // ======================================================
  function saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // ======================================================
  // APPLY LANGUAGE TO ALL ELEMENTS
  // ======================================================
  function applyLanguage(lang) {
    // Update HTML lang attribute
    htmlEl.setAttribute('lang', lang);

    // Update all elements with data-lang-* attributes
    const translatableElements = document.querySelectorAll('[data-lang-bn], [data-lang-en]');
    
    translatableElements.forEach(el => {
      const bnText = el.getAttribute('data-lang-bn');
      const enText = el.getAttribute('data-lang-en');
      
      if (lang === 'bn' && bnText) {
        el.textContent = bnText;
      } else if (lang === 'en' && enText) {
        el.textContent = enText;
      }
    });

    // Update button states
    langButtons.forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Add language class to body
    body.classList.remove('lang-bn', 'lang-en');
    body.classList.add(`lang-${lang}`);

    // Dispatch custom event for other scripts
    const event = new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    });
    window.dispatchEvent(event);
  }

  // ======================================================
  // SWITCH LANGUAGE WITH FADE ANIMATION
  // ======================================================
  function switchLanguage(newLang) {
    const currentLang = getSavedLanguage();
    if (newLang === currentLang) return;

    // Add fade class
    body.classList.add('language-fading');

    setTimeout(() => {
      applyLanguage(newLang);
      saveLanguage(newLang);
      
      setTimeout(() => {
        body.classList.remove('language-fading');
      }, 50);
    }, 150);
  }

  // ======================================================
  // BUTTON CLICK HANDLERS
  // ======================================================
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        switchLanguage(targetLang);
      }
    });
  });

  // ======================================================
  // INITIALIZE ON PAGE LOAD
  // ======================================================
  function init() {
    const savedLang = getSavedLanguage();
    applyLanguage(savedLang);
    console.log(`✓ Language initialized — ${savedLang}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
