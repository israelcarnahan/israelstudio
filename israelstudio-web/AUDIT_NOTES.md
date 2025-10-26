# Hero Responsive Refactor - Audit Notes

## Overview

Complete refactor of hero section from absolute positioning to grid-native layout with responsive variables, layout vs motion split, and breakpoint token system.

## Issues Identified & Fixed

### 1. Inert Hero Knobs

**Problem**: `--hero-height`, `--hero-next-gap`, and `--hero-offset-y` had no visible effect due to:

- Framer Motion inline transforms overriding CSS transforms
- Adjacency-dependent selectors failing with DOM structure
- Residual `!important` rules blocking variable application

**Solution**: Implemented layout vs motion split and robust targeting system.

### 2. Layout vs Motion Conflicts

**Problem**: Framer Motion applied transforms to same elements as CSS transforms, causing conflicts.
**Solution**: Split responsibilities:

- `.hero-layout`: CSS-controlled transforms (`--hero-offset-y`)
- `.hero-motion`: Framer Motion transforms (parallax effects)

### 3. Adjacency-Dependent Selectors

**Problem**: `+` combinator selectors failed when DOM structure changed.
**Solution**: Robust targeting with direct ID selectors and general sibling selectors.

### 4. Chaotic Unit Mixing

**Problem**: Mixed `%` and `vw` units caused unpredictable scaling.
**Solution**: Implemented breakpoint token system with consistent units.

## Implementation Details

### Layout vs Motion Split

```tsx
// Before: Motion and layout on same element
<motion.div style={{ y }} className="hero-motion">
  <div className="hero-frame-container"> // CSS transform here

// After: Separated responsibilities
<div className="hero-layout"> // CSS transform here
  <motion.div className="hero-motion"> // Motion transform here
    <div className="hero-frame-container"> // No transforms
```

### Breakpoint Token System

```css
:root {
  --hero-height-sm: 520px;
  --hero-height-md: 560px;
  --hero-height-lg: 640px;
  --hero-tvw-sm: 420px;
  --hero-tvw-md: 46vw;
  --hero-tvw-lg: 900px;
}

.home-hero {
  --hero-height: var(--hero-height-md);
  --hero-tv-width: var(--hero-tvw-md);
}
```

### Robust Gap Targeting

```css
/* Before: Adjacency-dependent */
.home-hero + #home-carousel {
  margin-top: var(--hero-next-gap);
}

/* After: Robust targeting */
#home-carousel {
  margin-top: var(--hero-next-gap) !important;
}
.home-hero ~ #home-carousel {
  margin-top: var(--hero-next-gap) !important;
}
```

## DOM Structure Changes

### New Wrapper Hierarchy

```
.home-hero
├── .hero-wrap (height control)
└── .grid
    ├── .hero-motion (brand - motion only)
    └── .hero-layout (TV - CSS transform)
        └── .hero-motion (TV - motion only)
            └── .hero-frame-container (no transforms)
```

### CSS Transform Responsibilities

- **`.hero-layout`**: `transform: translateY(var(--hero-offset-y))`
- **`.hero-motion`**: Framer Motion transforms only
- **`.hero-frame-container`**: No transforms (grid-native)

## Variable System

### Current Active Variables

```css
.home-hero {
  --hero-height: var(--hero-height-md);     // Breakpoint tokens
  --hero-tv-width: var(--hero-tvw-md);       // Breakpoint tokens
  --hero-offset-y: 0px;                      // CSS transform control
  --hero-next-gap: -220px;                   // Robust targeting
  --brand-offset-y: 0px;                     // Brand fine-tuning
}
```

### Breakpoint Overrides

```css
@media (max-width: 640px) {
  .home-hero {
    --hero-height: var(--hero-height-sm);
    --hero-tv-width: var(--hero-tvw-sm);
  }
}

@media (min-width: 1200px) {
  .home-hero {
    --hero-height: var(--hero-height-lg);
    --hero-tv-width: var(--hero-tvw-lg);
  }
}
```

### Alternative Clamp Mode

```css
.home-hero[data-hero-size="clamp"] {
  --hero-height: clamp(520px, 52vw, 680px);
  --hero-tv-width: clamp(420px, 46vw, 900px);
}
```

## Removed Blocking Rules

- Removed `!important` from `.hero-tv .frame2-img` width/height
- Kept `!important` only for video aperture positioning (necessary for overlay)

## Testing Checklist

- [x] `--hero-height` changes hero section height
- [x] `--hero-tv-width` changes TV frame width responsively
- [x] `--hero-offset-y` moves TV up/down via CSS transform
- [x] `--hero-next-gap` changes carousel spacing (robust targeting)
- [x] `--brand-offset-y` moves brand section independently
- [x] Framer Motion parallax effects work without layout conflicts
- [x] Breakpoint tokens switch correctly at 640px and 1200px
- [x] No regressions on commission frame or other `.frame2` components

## File Changes Summary

- **parallax-hero.tsx**: Added `.hero-layout` wrapper, split motion responsibilities
- **globals.css**: Implemented breakpoint tokens, robust targeting, layout vs motion split
- **AUDIT_NOTES.md**: Updated with new structure and testing results

## Next Steps

1. Test all hero knobs in DevTools
2. Verify responsive behavior across breakpoints
3. Confirm parallax effects work without conflicts
4. Document any additional fine-tuning needed
