/* ========================================================
   NAV.JS — Navigation Behavior
   Rahat Ahmed Portfolio v2.0
   
   Features:
   - Mobile hamburger drawer
   - Scroll-based nav styling
   - Active link highlighting (scroll spy)
   - Body scroll lock when menu open
   - Keyboard accessibility (Escape to close)
   ======================================================== */

(function () {
  'use strict';

  // ======================================================
  // ELEMENT SELECTORS
  // ======================================================
  const nav          = document.getElementById('nav');
  const navToggle    = document.getElementById('navToggle');
  const navMobile    = document.getElementById('navMobile');
  const navBackdrop  = document.getElementById('navBackdrop');
  const navLinks     = document.querySelectorAll('.nav__link');
  const mobileLinks  = document.querySelectorAll('.nav__mobile-link');
  const allSections  = document.querySelectorAll('main section[id]');
  const body         = document.body;

  // Guard clause — exit if essential elements missing
  if (!nav || !navToggle || !navMobile) {
    console.warn('Nav: Required elements not found');
    return;
  }

  // ======================================================
  // STATE
  // ======================================================
  let isMenuOpen = false;
  let lastScrollY = 0;

  // ======================================================
  // 1. MOBILE MENU TOGGLE
  // ======================================================
  function openMenu() {
    isMenuOpen = true;
    navMobile.classList.add('is-open');
    navBackdrop.classList.add('is-visible');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    navMobile.setAttribute('aria-hidden', 'false');
    navBackdrop.setAttribute('aria-hidden', 'false');
    
    // Lock body scroll
    body.style.overflow = 'hidden';
    body.style.paddingRight = getScrollbarWidth() + 'px';
  }

  function closeMenu() {
    isMenuOpen = false;
    navMobile.classList.remove('is-open');
    navBackdrop.classList.remove('is-visible');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navMobile.setAttribute('aria-hidden', 'true');
    navBackdrop.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    body.style.overflow = '';
    body.style.paddingRight = '';
  }

  function toggleMenu() {
    isMenuOpen ? closeMenu() : openMenu();
  }

  // Get scrollbar width to prevent layout shift
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  // ======================================================
  // 2. EVENT LISTENERS — MENU CONTROLS
  // ======================================================

  // Hamburger click
  navToggle.addEventListener('click', toggleMenu);

  // Backdrop click closes menu
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Mobile link click closes menu
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Small delay so smooth scroll starts before close
      setTimeout(closeMenu, 150);
    });
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
      navToggle.focus(); // Return focus for accessibility
    }
  });

  // Close menu on window resize (if opening desktop view)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 900 && isMenuOpen) {
        closeMenu();
      }
    }, 150);
  });

  // ======================================================
  // 3. SCROLL BEHAVIOR — Nav shadow & hide/show
  // ======================================================
  let scrollTicking = false;

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Add scrolled class when past 20px
    if (currentScrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    // Hide nav on scroll down, show on scroll up
    // Only on mobile/tablet
    if (window.innerWidth < 900) {
      if (currentScrollY > lastScrollY && currentScrollY > 200 && !isMenuOpen) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
    } else {
      nav.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  // ======================================================
  // 4. SCROLL SPY — Highlight active nav link
  // ======================================================

  function initScrollSpy() {
    if (!allSections.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          setActiveLink(sectionId);
        }
      });
    }, observerOptions);

    allSections.forEach(section => {
      spyObserver.observe(section);
    });
  }

  function setActiveLink(sectionId) {
    // Desktop nav links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Mobile nav links
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // ======================================================
  // 5. SMOOTH SCROLL ENHANCEMENT
  // ======================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Ignore # alone or invalid selectors
      if (targetId === '#' || targetId.length < 2) return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset (account for fixed nav)
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - navHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ======================================================
  // 6. INITIALIZE
  // ======================================================
  function init() {
    // Set initial state
    handleScroll();
    initScrollSpy();

    // Set initial active link based on URL hash
    if (window.location.hash) {
      const initialId = window.location.hash.substring(1);
      setActiveLink(initialId);
    } else {
      setActiveLink('home');
    }

    console.log('✓ Nav initialized');
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
