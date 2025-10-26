# Hero Grid-Native Complete Refactor - Audit Notes

## ✅ COMPLETED: Full Grid-Native Hero System

### **Major System Overhaul**
- **Removed ALL legacy absolute positioning** (`top:`, `left:`, fixed `width:`)
- **Implemented pure CSS Grid layout** with `justify-self: center; align-self: start;`
- **Added `.home-hero` scoping** to prevent collisions with other `.frame2` components
- **Implemented Parallax Guard Clause** - motion effects only apply visual transforms, not layout

### **New Grid-Native Architecture**
```css
.home-hero {
  /* All variables scoped under .home-hero */
  --hero-height: clamp(480px, 56vw, 680px);
  --hero-tv-scale: clamp(36%, 47vw, 56%);
  --hero-offset-y: -720px; /* replaces legacy top: */
  --hero-next-gap: -450px;
  --brand-offset-y: 0px;
}

.home-hero .hero-frame-container {
  /* Grid-native positioning */
  justify-self: center;
  align-self: start;
  transform: translateY(var(--hero-offset-y));
}
```

### **Parallax Guard Clause Implementation**
- **TSX**: Added `.hero-motion` class with `will-change: transform`
- **CSS**: Motion effects isolated to visual transforms only
- **No layout-affecting properties** in motion styles (no `top`, `left`, `width`, `margin`)

### **Variable System - Fully Functional**
- ✅ `--hero-tv-scale` controls TV width (responsive with clamps)
- ✅ `--hero-offset-y` provides vertical fine-tuning via transform
- ✅ `--hero-next-gap` defines clean spacing before next section
- ✅ `--brand-offset-y` enables independent brand movement
- ✅ All variables scoped under `.home-hero` for collision prevention

### **CSS Consolidation Completed**
- ✅ **`.embla-viewport-visible`**: Consolidated into single canonical definition
- ✅ **`.slide-img-wrap`**: Single definition (duplicates removed)
- ✅ **`@keyframes wiggle`**: Renamed conflicting definition to `wiggle-enhanced`
- ✅ **Updated references**: `.btn-sparkle:hover` uses `wiggle-enhanced`

## **Key Technical Achievements**

### **1. Grid-Native Layout**
- TV stays perfectly centered in grid column during viewport changes
- No more "walking" TV when DevTools opens/closes
- Responsive scaling with CSS clamps

### **2. Motion Isolation**
- Parallax effects remain visually active
- Motion does not affect layout positioning
- Clean separation between visual effects and structural layout

### **3. Variable Control System**
- All hero variables now fully functional
- Real-time control via CSS custom properties
- Responsive scaling with safe bounds

### **4. Collision Prevention**
- `.home-hero` scoping prevents interference with commission frame
- Non-hero `.frame2` components remain untouched
- Clean separation of concerns

## **Testing Results**
- ✅ TV remains centered during viewport resizing
- ✅ No horizontal scrollbars at common widths
- ✅ Commission frame unchanged
- ✅ Logo/buttons independent movement
- ✅ Parallax effects active but layout stable
- ✅ All duplicate CSS consolidated

## **Remaining Legacy Usage (Intentionally Preserved)**
- **Commission frame**: Uses different aperture values (`--canvas-*`)
- **Global frame defaults**: `.frame2:not(.hero-tv)` behavior preserved
- **Other wiggle variants**: `wiggle-ghost`, `wiggle-chip`, `wiggle-chip-ghost` (different purposes)

## **Asset Dimensions**
- TV frame: 1024x1536px (aspect ratio ~0.67)
- Logo: 1600x1532px (aspect ratio ~1.04)

## **Future Migration Path**
- All variables now use new naming convention
- Legacy variables can be removed in future cleanup
- System is ready for additional responsive breakpoints