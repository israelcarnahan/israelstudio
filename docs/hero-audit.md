# Hero TV Responsiveness Audit

## Current Issues Identified

### 1. Fixed Pixel Positioning

- `.hero-frame-container` uses rigid `!important` declarations:
  - `width: 90% !important`
  - `height: 630px !important`
  - `top: -258px !important`
  - `left: 23% !important`
- These fixed values don't scale well across different viewport sizes

### 2. Image Sizing Conflicts

- `.frame2-img` globally set to `width: 66%` (line 467 in globals.css)
- This conflicts with hero frame needs where the TV PNG should fill the container
- No aspect-ratio constraint on the TV frame image

### 3. Layout Flow Issues

- Hero frame uses negative `top: -258px` to pull upward
- No reserved vertical space in normal flow
- Carousel can overlap hero on certain widths due to lack of height reservation

### 4. Brittle Positioning

- Logo and buttons use `transform: translateX(240px)` inline styles
- These fixed pixel nudges drift at different breakpoints
- No responsive alternatives

### 5. CSS Class Locations

- `.hero-frame-container`: Lines 922-930 in globals.css
- `.frame2`: Lines 440-444 in globals.css
- `.frame2-img`: Lines 465-469 in globals.css
- `.frame2-canvas`: Lines 470-484 in globals.css
- `.frame-overlay`: Lines 527-541 in globals.css

### 6. !important Usage

- Heavy use of `!important` in hero positioning (lines 922-963)
- Video positioning also uses `!important` declarations
- These override cascade but make responsive adjustments difficult

### 7. Carousel Spacing

- `.carousel-wire-gap` set to `height: 4px` (line 911)
- May need adjustment with new hero height reservation

## Recommended Solution

1. **Centralize variables** for easy tuning
2. **Replace fixed pixels** with fluid `clamp()` functions
3. **Reserve vertical space** in normal flow to prevent carousel overlap
4. **Normalize TV image** to 100% width with proper aspect ratio
5. **Remove brittle transforms** and use responsive spacing
6. **Add ultra-wide guardrails** to prevent ballooning on large screens

## Files Requiring Changes

- `src/app/globals.css` - Main CSS variables and positioning
- `src/components/parallax-hero.tsx` - Remove inline transforms, add wrapper
- `src/components/featured-carousel.client.tsx` - Verify spacing (minimal changes)

## Implementation Summary

### ✅ Completed Changes

1. **CSS Variables Added** (globals.css lines 914-921):

   - `--hero-width: min(92vw, 1600px)`
   - `--hero-height: clamp(420px, 48vw, 760px)`
   - `--hero-top: -240px`
   - `--hero-left: 20vw`

2. **Hero Wrapper Added** (globals.css lines 923-927):

   - `.hero-wrap` reserves vertical space to prevent carousel overlap
   - Uses `min-height: calc(var(--hero-height) + max(0px, -1 * var(--hero-top)))`

3. **TV Image Fixed** (globals.css lines 929-935):

   - Override global `.frame2-img` 66% width for hero
   - Set to `width: 100% !important` for predictable scaling
   - Added TODO comment for aspect-ratio measurement

4. **Fluid Positioning** (globals.css lines 945-953):

   - Replaced fixed pixels with CSS variables
   - Uses `clamp()` for responsive height
   - Maintains `!important` only where needed for cascade override

5. **Ultra-wide Guardrails** (globals.css lines 988-1002):

   - `@media (min-width: 1440px)`: Reduces width to 88vw, adjusts positioning
   - `@media (min-width: 1920px)`: Further reduces to 80vw for ultra-wide displays

6. **Brittle Transforms Removed** (parallax-hero.tsx):

   - Replaced `transform: translateX(240px)` with responsive Tailwind classes
   - Logo: `lg:ml-40 xl:ml-56 2xl:ml-64`
   - Buttons: Same responsive spacing classes

7. **Carousel Spacing Improved** (globals.css line 1005):
   - Increased `.carousel-wire-gap` from 4px to 10px

### 🎯 Key Benefits

- **Single source of truth**: All hero positioning controlled by CSS variables
- **Responsive scaling**: Fluid `clamp()` and `min()` functions adapt to viewport
- **No overlap**: Hero reserves vertical space in normal flow
- **Predictable scaling**: TV PNG scales consistently at 100% width
- **Ultra-wide support**: Guardrails prevent ballooning on large displays
- **Maintainable**: Easy to adjust positioning by changing variable values

### 🔧 Remaining !important Usage

- `.hero-frame-container`: Position, width, height, top, left (needed for cascade override)
- `.hero-frame-container .frame2`: Width, height, margin, max-width (needed for cascade override)
- `.hero-frame-container .frame2-img`: Width, height (needed to override global 66% width)
- `.hero-logo`: Width, height, max-width (needed for consistent logo sizing)

### 📝 TODO Items

1. **Measure TV frame PNG aspect ratio** and set `aspect-ratio` property for perfect scaling
2. **Test at viewport widths**: 360px, 768px, 1024px, 1440px, 1920px, 2560px
3. **Verify no horizontal scrollbar** appears at any width
4. **Confirm carousel spacing** works with new hero height reservation
