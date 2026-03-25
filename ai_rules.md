# Mortgage Site (Brochure & Public Face) - AI Context Document

## Project Overview
This repository (`Mortgage`) serves as the highly-optimized, public-facing brochure website for AskJuthis. It is designed to be lightweight, fast, and SEO-friendly. 

**Note: The Borrower Portal (SaaS application) was completely extracted from this repository into its own standalone project (SaaSMortgage/BorrowerPortal).**

## Tech Stack & Architecture
- **Frontend Core:** Plain HTML5, CSS3, and Vanilla JavaScript. No heavy frameworks (React/Vue/Angular).
- **Styling:** Custom `style.css` coupled with **Tailwind CSS** (via CDN).
- **Icons:** Google **Material Symbols** (Replaced Phosphor icons). *Always use `<span class="material-symbols-outlined">icon_name</span>`*.
- **Color Palette:** Material 3 design tokens used globally (`bg-primary`, `text-secondary-fixed`, etc.). Do NOT use legacy colors like `brand-navy` or `brand-gold`.

## Critical Rules & Guidelines
1. **Performance First:** 
   - Never use Tailwind's `backdrop-blur-*` or CSS `backdrop-filter: blur()` utilities. They destroy GPU rendering and cause massive scroll lag on mobile. Use transparent colors (e.g., `bg-primary/90`) instead.
   - All high-resolution images must be formatted as `.webp` (max 1920px width). Do NOT upload heavy `.jpg` or `.png` assets.
2. **Animations:**
   - Use the custom hardware-accelerated `.reveal` classes for fade-in scroll animations.
   - E.g., `<div class="reveal reveal-up">...</div>`. The IntersectionObserver in `main.js` handles the trigger.
3. **No SDKs:** 
   - Plaid, Persona, and Socket.io do **NOT** belong in this repository. Ensure `index.html` remains clean of third-party SaaS integrations.
4. **Calculators:**
   - Complex frontend logic for Payment, Refinance, Affordability, and Land Transfer Tax calculators exists in `calculators.html` and `calculators.js`. Maintain strict UI parity with Realtor.ca benchmarks.

## Developer Note
When starting a new session, read this file to instantly understand the boundaries of this repository. Any requests regarding secure portal access, DB models, or complex backend APIs belong in the `BorrowerPortal` project, not here!
