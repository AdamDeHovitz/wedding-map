# Wedding Map Design Guide

## Color Palette (From Table Cards)

### Primary Colors
```css
--burgundy-dark: #7B2D26    /* Main background, primary color */
--burgundy: #8B3A3A         /* Lighter burgundy for accents */
--cream: #F5E6D3            /* Text, borders, light backgrounds */
--cream-dark: #E8D4BB       /* Darker cream for subtle contrasts */
```

### Neutral Colors
```css
--black: #1A1A1A           /* Illustrations, strong text */
--white: #FFFFFF           /* Pure white backgrounds */
--gray-50: #F9F7F4         /* Very light backgrounds */
--gray-100: #F0EBE3        /* Subtle backgrounds */
```

### Usage
- **Backgrounds**: Burgundy dark for primary surfaces, cream for cards
- **Text**: Cream on burgundy, burgundy on cream
- **Accents**: Black for illustrations and icons
- **Borders**: Cream (#F5E6D3) with rounded corners

## Typography

### Font Families

**Display/Headings** (for location names, titles):
- Primary: Cormorant Garamond (elegant serif, high contrast)
- Fallback: Playfair Display, Georgia, serif
- Use: Table names, page titles, important headings

**Body/UI** (for descriptions, interface):
- Primary: Montserrat (clean, modern sans-serif)
- Secondary: Nunito Sans (readable, friendly)
- Fallback: system-ui, sans-serif
- Use: Descriptions, buttons, forms, general text

### Font Sizes & Weights
```css
/* Display (Location Names) */
h1: 2.5rem-4rem, font-weight: 700, Cormorant Garamond
h2: 2rem-3rem, font-weight: 600, Cormorant Garamond

/* Body Text */
body: 1rem, font-weight: 400, Montserrat
description: 0.875rem-1rem, font-weight: 500, Montserrat
small: 0.75rem-0.875rem, font-weight: 400, Nunito Sans
```

## Visual Style

### Cards
- **Border Radius**: 1rem (16px) for rounded corners
- **Border**: 3-4px cream border
- **Shadow**: Subtle, soft shadows
- **Padding**: Generous (1.5rem-2rem)

### Buttons
- **Primary**: Burgundy background, cream text
- **Secondary**: Cream background, burgundy text with burgundy border
- **Hover**: Darken by 10%, subtle transition
- **Border Radius**: 0.5rem (8px)

### Map Markers
- **Style**: Burgundy pins with cream numbers/icons
- **Size**: 40-48px
- **Border**: 2-3px cream border
- **Shadow**: Drop shadow for depth

### Illustrations
- **Style**: Minimalist black silhouettes
- **Placement**: Bottom of cards
- **Size**: Fill width, ~200-300px height

## Component Styling

### Homepage
- **Background**: Gradient from cream-50 to white
- **Title**: Burgundy text, Cormorant Garamond
- **Map**: Full viewport height

### Check-in Pages
- **Background**: Gradient burgundy to darker burgundy
- **Cards**: Cream background with burgundy text
- **Buttons**: Burgundy primary, cream secondary

### Admin Dashboard
- **Background**: Light cream gradient
- **Cards**: White with subtle shadows
- **Accent**: Burgundy for stats and important info

## Design Principles

1. **Elegance**: Use sophisticated typography and generous spacing
2. **Consistency**: Burgundy + cream throughout
3. **Storytelling**: Personal descriptions for each location
4. **Minimalism**: Clean, uncluttered interfaces
5. **Timeless**: Classic design that won't feel dated

## Table Card Design Pattern

Each table card follows this structure:
```
┌─────────────────────────────────────┐
│  Table No. X                        │ ← Small serif, cream
│                                     │
│  LOCATION NAME                      │ ← Large serif, cream, bold
│                                     │
│  Personal story/description about   │ ← Sans-serif, cream
│  this meaningful place              │
│                                     │
│  [Iconic illustration]              │ ← Black silhouette
└─────────────────────────────────────┘
```

Background: #7B2D26 (burgundy)
Border: #F5E6D3 (cream), rounded
