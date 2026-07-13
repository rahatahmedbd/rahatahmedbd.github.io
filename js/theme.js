/* ========================================================
   THEME.JS — Dark / Light Mode Toggle
   Rahat Ahmed Portfolio v2.0
   
   Features:
   - Toggle between light and dark modes
   - Respects system preference by default
   - Saves user choice in localStorage
   - Smooth theme transition
   - Updates meta theme-color for mobile
   - Prevents flash on page load
   ======================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio-theme';
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const body = document.body;

  if (!themeToggle) {
    console.warn('Theme: Toggle button not found');
    return;
  }

  // ======================================================
  // GET SYSTEM PREFERENCE
  // ======================================================
  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // ======================================================
  // GET SAVED THEME (or use system preference)
  // ======================================================
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || getSystemPreference();
  }

  // ======================================================
  // SAVE THEME
  // ======================================================
  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // ======================================================
  // APPLY THEME
  // ======================================================
  function applyTheme(theme, animate = true) {
    // Add transitioning class for smooth animation
    if (animate) {
      body.classList.add('theme-transitioning');
    }

    // Set theme attribute
    htmlEl.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browser bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        theme === 'dark' ? '#0F0D0B' : '#7A0C2E'
      );
    }

    // Update toggle button aria
    themeToggle.setAttribute(
      'aria-label', 
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );

    // Remove transitioning class after animation
    if (animate) {
      setTimeout(() => {
        body.classList.remove('theme-transitioning');
      }, 500);
    }

    // Dispatch custom event
    const event = new CustomEvent('themeChanged', {
      detail: { theme: theme }
    });
    window.dispatchEvent(event);
  }

  // ======================================================
  // TOGGLE THEME
  // ======================================================
  function toggleTheme() {
    const currentTheme = htmlEl.getAttribute('data-theme') || getSavedTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme, true);
    saveTheme(newTheme);
  }

  // ======================================================
  // EVENT LISTENERS
  // ======================================================
  themeToggle.addEventListener('click', toggleTheme);

  // Listen for system theme changes (if user hasn't set preference)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light', true);
    }
  });

  // Keyboard shortcut: Alt + T
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });

  // ======================================================
  // INITIALIZE
  // ======================================================
  function init() {
    // Remove preload class (prevents flash)
    body.classList.remove('preload');
    
    // Apply theme without animation on load
    const initialTheme = getSavedTheme();
    applyTheme(initialTheme, false);
    
    console.log(`✓ Theme initialized — ${initialTheme}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
