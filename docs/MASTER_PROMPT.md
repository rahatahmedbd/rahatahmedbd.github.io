# 🚀 Rahat Ahmed Portfolio — MASTER PROJECT PROMPT (Adapted)

> Permanent rules for this project. Valid until explicitly changed.
> This document adapts the original master-prompt methodology to the **current existing website** (a static HTML/CSS/JS portfolio hosted on GitHub Pages).

---

## PROJECT GOAL

Build a **premium, modern, cinematic, multifunctional** personal website with **TWO experiences**, sharing the same information but presented differently:

1. **Website Experience** — the redesigned, cinematic normal website.
2. **RahatVerse Experience** — a cinematic interactive 3D city.

---

## INFORMATION PROTECTION (MOST IMPORTANT)

- Never remove, rewrite, or invent information.
- Never change achievements, education, portfolio/personal content, or the section order.
- Only presentation, design, animation, and experience may change.
- **Source of truth** = the original `index.html` (9 sections, bilingual bn/en, all text/images/links/contacts).

### Source of truth (locked)
- **Person:** Rahat Ahmed / রাহাত আহমেদ — Sunamganj, Bangladesh.
- HSC 2nd year student, Sunamganj Government College; home tutor & founder of **FS Coaching Center**; **A+ blood donor (4 times)**; **BNCC Cadet**; aspiring web developer; **General Secretary, Shantichakra Blood Society Sunamganj**; founder of **Helping Hand Organization**; tribute to his father **Farid Ahmed**.
- **Email:** rahatbd20505@gmail.com
- **Sections (order):** Home/Hero → About → Education → Achievements → Experience & Initiatives → Shantichakra Blood Society → Tribute → Gallery → Contact.
- **Brand:** Crimson `#7A0C2E`; fonts Baloo Da 2 / Hind Siliguri (Bangla) + Inter (English); bilingual (Bangla default) + dark/light.

---

## WEBSITE EXPERIENCE (target)

Premium · Modern · Fast · Minimal · Mobile-first · Cinematic · Multifunctional.

**Cinematic ingredients:** preloader/intro, scroll-driven scene choreography, section transitions, film overlays (grain/letterbox/vignette/light-leak), parallax & depth, kinetic typography, magnetic buttons + spotlight cursor, ambient score + UI SFX (toggle), reduced-motion fallback.

**Multifunctional ingredients:** two-experience switcher, Command Palette (⌘K), Settings/Control Center (sound/motion/language/theme), floating bottom dock, scroll-progress + chapter rail, per-scene interactivity (timeline, counters, filters, lightbox), toasts, easter eggs.

**Entry flow:** Welcome Gate (bilingual welcome + Website / RahatVerse choice) → Website experience: top utility bar (menu + language + theme/mood + experience toggle) + floating elevated bottom dock + redesigned hero + all sections in the existing order.

---

## RAHATVERSE EXPERIENCE (target)

A cinematic interactive 3D city. A vehicle takes the user through locations, each representing one website section (Hero/Store, About, Education, Achievements, Experience, Shantichakra Blood, Tribute, Gallery, Contact). Supports zoom/rotate and switching between **automatic cinematic tour** and **manual exploration**. Must feel like a modern AAA game while remaining lightweight and mobile-friendly.

---

## PROJECT DEVELOPMENT STRATEGY

- Build **phase by phase** — only ONE phase at a time.
- Never combine or skip phases.
- Each phase must leave the project **stable and deployable**.
- **Frontend first; backend last.**
- Prioritize **stability over speed**. More (smaller) phases are preferred over risky big ones.

---

## GIT WORKFLOW (MANDATORY)

- Each phase = its own branch named after the phase (`phase-XX-name`).
- **Arena-session adaptation:** within this session all work happens on the session branch `arena/019fd1c9-rahatahmedbd-github-io`; each phase ends with **commit → push session branch → open PR → (user merges after Vercel is connected) → verify**.
- Never work directly on `main`; never force unrelated branch names.

### After every phase
1. `npm install` → `npm run lint` → `npm run build` (+ type-check). Fix all errors.
2. Commit + push the branch.
3. Open a Pull Request.
4. Resolve conflicts if any.
5. Merge into `main` (after Vercel is connected, to avoid breaking the live GitHub Pages site).
6. Wait for Vercel production deployment.
7. Verify deployment + live website.
8. Only stop after everything succeeded.

---

## BUG PREVENTION

Before changing anything: analyze the project; detect broken/dead/duplicate code, unused files, dependency/package conflicts, build & performance issues. Fix safely. Never introduce new bugs.

---

## TECHNOLOGY STACK

- **Frontend:** Next.js · TypeScript · Tailwind CSS
- **Backend (last):** Supabase
- **Media:** Cloudinary
- **Hosting:** Vercel
- **Version Control:** GitHub

---

## DECISION MAKING

Do not ask unnecessary questions. Use engineering judgment. Choose the safest, most maintainable solution. Stability over speed.
