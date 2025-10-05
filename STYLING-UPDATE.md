# Wedding Map Styling Update

## 🎨 What Changed

I've updated your wedding map app to match the beautiful burgundy and cream aesthetic from your table cards!

### Before & After

**Before:**
- Generic rose/pink color scheme
- Default system fonts
- Generic card styling

**After:**
- Rich burgundy (#7B2D26) and warm cream (#F5E6D3) palette
- Elegant Cormorant Garamond for headings
- Clean Montserrat for body text
- Sophisticated, timeless styling that matches your wedding materials

## 📁 Files Updated

### 1. `src/app/globals.css`
**What changed:**
- Replaced all rose/pink colors with burgundy/cream palette
- Updated primary color to deep burgundy
- Updated secondary color to warm cream
- Adjusted all theme colors to match your wedding aesthetic
- Increased border-radius to 1rem for softer, more elegant cards

**Key colors:**
```css
--burgundy: #7B2D26 (Deep burgundy from your table cards)
--cream: #F5E6D3 (Warm cream for text/borders)
```

### 2. `src/app/layout.tsx`
**What changed:**
- Replaced Geist fonts with:
  - **Cormorant Garamond** (elegant serif for headings/titles)
  - **Montserrat** (clean sans-serif for body text)
- Added font weights: 300, 400, 600, 700
- Set up CSS variables for easy font usage throughout the app

**How to use the fonts in your code:**
```tsx
// For headings/location names (serif)
<h1 className="font-serif text-4xl font-bold">Location Name</h1>

// For body text (sans-serif, default)
<p className="font-sans">Description text...</p>
```

### 3. `addresses.json` (NEW)
**What it is:**
- All 15 of your wedding table addresses
- Pre-formatted with:
  - Proper names (extracted from addresses file)
  - Full addresses
  - URL-friendly unique codes
  - Approximate latitude/longitude coordinates

**Note:** I used approximate coordinates based on the addresses. You may want to fine-tune these by:
1. Going to Google Maps
2. Right-clicking on the exact location
3. Clicking the coordinates at the top
4. Updating the lat/long in the JSON file

### 4. `scripts/import-addresses.ts` (NEW)
**What it does:**
- Bulk imports all 15 addresses from `addresses.json` into your Supabase database
- Checks for duplicates (won't re-import existing tables)
- Provides detailed progress output
- Safe to run multiple times

**How to use it:**
```bash
# After setting up .env.local with Supabase credentials
npm run import-addresses
```

### 5. `DESIGN-GUIDE.md` (NEW)
**What it is:**
- Complete design system documentation
- Color palette reference
- Typography guidelines
- Component styling patterns
- Based on your table card design

**Use this when:**
- Building new components
- Ensuring consistency
- Onboarding other developers
- Making future design decisions

## 🚀 What You Need To Do

### After Setting Up Supabase (from SETUP.md)

Once you've completed the Supabase setup in SETUP.md, run this to import all your addresses:

```bash
npm run import-addresses
```

You should see output like:
```
📍 Starting address import...

Found 15 addresses to import

✅ Imported "River Heights Road"
✅ Imported "Lakewood Drive"
✅ Imported "Connecticut Avenue"
...

📊 Import Summary:
   ✅ Successfully imported: 15
   ❌ Failed: 0

🎉 Import complete!
```

### Manual Address Adjustments (Optional)

The coordinates in `addresses.json` are approximate. To get exact coordinates:

1. Open `addresses.json`
2. For each address:
   - Go to Google Maps
   - Search for the address
   - Right-click on the exact spot
   - Click the coordinates (they'll copy to clipboard)
   - Paste into `addresses.json` (latitude first, longitude second)
3. Re-run `npm run import-addresses` (it will skip duplicates)
4. Or update directly in the admin dashboard at `/admin`

## 🎨 Color Usage Examples

### In Your Components

The new color system automatically applies to all shadcn/ui components. You can also use these classes:

```tsx
// Burgundy background with cream text
<div className="bg-primary text-primary-foreground">
  Content
</div>

// Cream background with burgundy text
<div className="bg-secondary text-secondary-foreground">
  Content
</div>

// Burgundy text
<h1 className="text-foreground">Heading</h1>

// Cream border
<div className="border border-border rounded-lg">
  Card content
</div>
```

## ✨ Visual Improvements

### What Will Look Different

1. **Homepage (`/`)**
   - Warm cream background gradient
   - Burgundy title text
   - Map markers will be burgundy (once you add the custom marker feature)

2. **Check-in Pages (`/checkin/*`)**
   - Cream cards on warm background
   - Burgundy buttons
   - Elegant serif headings

3. **Admin Dashboard (`/admin`)**
   - Light cream background
   - White cards with subtle shadows
   - Burgundy accent colors for stats

4. **Settings Page (`/settings`)**
   - Consistent burgundy/cream palette
   - Elegant typography
   - Polished, professional feel

### Typography Hierarchy

The fonts now automatically apply:
- **Headings** (h1, h2, h3): Cormorant Garamond (elegant serif)
- **Body text**: Montserrat (clean sans-serif)
- **Small text/labels**: Montserrat (lighter weights)

## 🔄 Next Steps (Optional Enhancements)

### 1. Custom Map Markers (Future Enhancement)

To use your actual table icons as map markers:
1. Copy table-icons to `public/table-icons/`
2. Update `WeddingMap.tsx` to use custom markers
3. This will show the actual burgundy cards on the map

### 2. Personal Stories

You can add the personal stories from your table cards to the database:
1. Add a `description` column to `wedding_tables` table
2. Update the check-in pages to show these stories
3. Makes each location more meaningful to guests

### 3. Table Icon Display

Display the actual table card images on check-in pages:
1. Add `icon_url` column to `wedding_tables`
2. Reference table-icons by number
3. Show the full card design on check-in

## 📋 Summary

✅ **Colors**: Updated to burgundy/cream from your table cards
✅ **Fonts**: Elegant Cormorant Garamond + clean Montserrat
✅ **Addresses**: All 15 addresses ready to import
✅ **Import Script**: One command to populate your database
✅ **Design Guide**: Complete reference for consistency

Your wedding map now has a sophisticated, timeless aesthetic that perfectly matches your wedding materials! 🎉

## Questions?

- **Where are my table card images?** In `table-icons/` folder (1.png through 24.png)
- **Can I change colors?** Yes! Edit `src/app/globals.css` and update the CSS variables
- **Can I use different fonts?** Yes! Edit `src/app/layout.tsx` and import different Google Fonts
- **What if I have more than 15 tables?** Add them to `addresses.json` and re-run the import script
