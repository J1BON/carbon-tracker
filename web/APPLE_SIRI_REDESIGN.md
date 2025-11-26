# Apple Siri-Inspired Redesign

This document describes the Apple Siri-inspired redesign of the Carbon Tracker application.

## Overview

The frontend has been completely redesigned to match Apple Siri's website aesthetic:
- Dark gradient backgrounds (`from-[#0a0a0a] via-[#111111] to-[#1a1a1a]`)
- Glassmorphic cards with backdrop blur
- Smooth Framer Motion animations
- Inter font family (similar to SF Pro Display)
- Minimal, modern, and futuristic design

## New Components

### Sections (`web/src/components/sections/`)

1. **HeroSection.tsx** - Landing hero with animated leaf icon, headline, and CTA buttons
2. **AboutSection.tsx** - Two-column layout with stats and glassmorphic cards
3. **FeaturesSection.tsx** - Grid of 4 feature cards (CFC Tracking, Carbon Score, Eco Tips, Sustainability Goals)
4. **ReportSubmissionSection.tsx** - Clean form for submitting carbon reports
5. **SuggestionsSection.tsx** - Animated cards displaying personalized eco suggestions

### Updated Components

1. **Navbar.tsx** - Redesigned with dark glassmorphic background, Apple-style navigation
2. **Footer.tsx** - Minimal dark footer matching Apple Siri aesthetic

### New Pages

1. **Home.tsx** - Landing page combining all sections (`/home` route)

## Design Features

### Color Palette
- Background: Dark gradients from `#0a0a0a` → `#111111` → `#1a1a1a`
- Accent Colors: Emerald (`emerald-400`), Teal (`teal-400`), Cyan (`cyan-400`), Purple (`purple-400`)
- Text: White (`text-white`) on dark backgrounds, Gray (`text-gray-300`) for secondary text

### Glassmorphism
- Glass cards use `bg-white/5 backdrop-blur-lg` with `border border-white/10`
- Hover effects: `hover:scale-105` and `hover:border-white/20`

### Animations
- **Framer Motion** animations for:
  - Fade-in on scroll (using `useInView` hook)
  - Smooth scaling and hover effects
  - Floating elements (leaf icon, scroll indicator)
  - Parallax-like effects

### Typography
- Font: **Inter** (loaded from Google Fonts)
- Headlines: Large, bold, tracking-tight
- Gradient text for emphasis: `bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent`

## Routes

The new landing page is available at:
- `/home` - Apple Siri-inspired landing page (public access)

Existing routes remain unchanged:
- `/` - Dashboard (protected, requires authentication)
- `/login` - Login page
- All other routes remain as before

## Integration

The redesign is fully integrated:

1. ✅ All sections created in `web/src/components/sections/`
2. ✅ Home page created at `web/src/pages/Home.tsx`
3. ✅ Routing updated in `web/src/App.tsx`
4. ✅ Navbar and Footer redesigned
5. ✅ Global styles updated in `web/src/styles/index.css`
6. ✅ Tailwind config updated with Inter font
7. ✅ Framer Motion installed and configured
8. ✅ Inter font loaded in `web/index.html`

## Usage

### View the Landing Page

Navigate to `/home` to see the new Apple Siri-inspired design:

```bash
# Start the dev server
cd web
npm run dev

# Visit http://localhost:3000/home
```

### Customize Colors

Edit the gradient colors in each section component:
- Hero: `bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#1a1a1a]`
- Accent gradients: `from-indigo-500 to-purple-600`

### Add New Sections

1. Create a new component in `web/src/components/sections/`
2. Use Framer Motion for animations
3. Follow the glassmorphic design pattern
4. Import and add to `web/src/pages/Home.tsx`

## Technical Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Lucide React** - Icons

## Design Principles

1. **Minimalism** - Clean, uncluttered interfaces
2. **Smooth Animations** - Everything animates elegantly
3. **Glassmorphism** - Translucent cards with blur effects
4. **Dark Gradients** - Deep, rich backgrounds
5. **Bold Typography** - Large, impactful headlines
6. **Responsive** - Mobile-friendly design

## Next Steps

To further customize:

1. **Colors**: Update gradient values in Tailwind classes
2. **Animations**: Adjust Framer Motion transition timings
3. **Content**: Update text and images in section components
4. **Sections**: Add or remove sections as needed

## Notes

- The design matches Apple Siri's aesthetic while maintaining the carbon tracking theme
- All animations are smooth and performant
- The design is fully responsive and mobile-friendly
- Glassmorphism effects work best on modern browsers with backdrop-filter support











