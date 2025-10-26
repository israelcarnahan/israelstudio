# Hero Responsive Refactor - Audit Notes

## Current Issues Identified

### 1. **Absolute Positioning Problem**

- `.hero-frame-container` uses `position: relative !important; top: var(--hero-top) !important; left: var(--hero-left) !important;`
- This causes TV to "walk" across page when viewport changes
- Values like `--hero-top: -720px` and `--hero-left: 23%` are band-aids for layout issues

### 2. **Variable Naming Inconsistencies**

- Multiple naming suggestions in comments but not implemented
- `--tv-scale` vs `--hero-tv-scale`
- `--hero-gap` vs `--hero-next-gap`
- `--v-*` vs `--hero-screen-*`

### 3. **Duplicate CSS Rules**

- Multiple `.embla-viewport-visible` definitions
- Multiple `.slide-img-wrap` definitions
- Multiple `@keyframes wiggle` definitions
- Need consolidation

### 4. **Grid vs Absolute Positioning Conflict**

- Hero uses `grid md:grid-cols-[420px,1fr]` but TV container ignores grid with absolute positioning
- Should be grid-native with transforms for fine-tuning only

## Implementation Plan

### Phase 1: Make TV Grid-Native ✅

- Remove absolute positioning from `.hero-frame-container`
- Use `justify-self: center` and `align-self: start` for grid alignment
- Replace `top:` with `transform: translateY()` for fine-tuning

### Phase 2: Variable Normalization ✅

- Add new variable names with fallbacks to existing ones
- Update hero-only rules to use new names
- Document remaining legacy usage

### Phase 3: Cleanup Duplicates ✅

- Consolidate duplicate CSS rules
- Scope hero-only rules under `.hero-tv`
- Preserve non-hero frame behavior

### Phase 4: Responsive Enhancements ✅

- Add clamps for responsive scaling
- Test viewport changes
- Ensure no horizontal scrollbars

## Decisions Made

### Variable Migration Strategy

- Use fallback approach: `--hero-tv-scale: var(--tv-scale, 47%);`
- This prevents breaking changes while enabling future cleanup
- Document all legacy usage for future migration

### Grid Alignment Strategy

- Use `justify-self: center` for horizontal centering
- Use `align-self: start` for vertical alignment
- Fine-tune with `transform: translateY(var(--hero-offset-y))`

### Aspect Ratio Decision

- TV frame: 1024x1536 (aspect ratio ~0.67)
- Will test `aspect-ratio: 2/3` on `.hero-tv.frame2`
- If it warps the art, will remove and document

## Blocked Items

### Legacy Variable Usage

- `--hero-top` still used in some non-hero contexts
- `--tv-scale` used in global frame defaults
- Cannot rename universally without breaking other components

### Commission Frame Protection

- Must preserve `.frame2:not(.hero-tv)` behavior
- Commission frame uses different aperture values
- Cannot consolidate all frame rules

## Cleanup Completed ✅

### Duplicate CSS Rules Consolidated
- **`.slide-img-wrap`**: Removed duplicate definition, kept canonical version
- **`.embla-viewport-visible`**: Consolidated multiple definitions into single block
- **`@keyframes wiggle`**: Renamed second definition to `wiggle-enhanced` to avoid conflict
- **Updated references**: `.btn-sparkle:hover` now uses `wiggle-enhanced`

### Remaining Duplicates (Intentionally Preserved)
- **`.slide-img-wrap`**: Still appears in carousel section (different context)
- **`.embla-viewport-visible`**: Still appears in carousel section (different context)
- **Multiple wiggle variants**: `wiggle-ghost`, `wiggle-chip`, `wiggle-chip-ghost` (different purposes)

## Testing Checklist

- [ ] Resize browser window (narrow → wide)
- [ ] Open/close DevTools
- [ ] TV stays centered in grid column
- [ ] No horizontal scrollbars
- [ ] Commission frame unchanged
- [ ] Logo/buttons independent movement
- [ ] Lighthouse a11y ≥ 90

## Asset Dimensions

- TV frame: 1024x1536px (aspect ratio ~0.67)
- Logo: 1600x1532px (aspect ratio ~1.04)
