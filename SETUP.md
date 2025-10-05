# Wedding Map - Quick Setup Guide

## ✅ What's Been Built

Your wedding map application is now scaffolded with all core features:

### Core Features
- ✅ Interactive map with Mapbox integration
- ✅ Google OAuth authentication
- ✅ Unique check-in links for each table
- ✅ Guest avatars (randomly generated)
- ✅ Optional message system
- ✅ Admin dashboard for managing tables
- ✅ Responsive, polished UI with Tailwind + shadcn/ui

### File Structure
```
wedding-map/
├── supabase-schema.sql         ← Run this in Supabase SQL editor
├── .env.local.example          ← Copy to .env.local and fill in
├── table-icons/                ← Your 24 table icon images
└── src/
    ├── app/
    │   ├── page.tsx            ← Main map view
    │   ├── admin/              ← Admin dashboard
    │   ├── checkin/[code]/     ← Guest check-in pages
    │   └── api/
    ├── components/
    │   ├── WeddingMap.tsx      ← Interactive map
    │   ├── CheckinForm.tsx     ← Check-in UI
    │   └── AddTableForm.tsx    ← Create new tables
    └── lib/
        └── supabase.ts         ← Database client
```

## 🚀 Next Steps (In Order)

### 1. Set Up Supabase (Database)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project name (e.g., "wedding-map"), database password, and region
4. Wait for project to initialize (~2 minutes)
5. Go to SQL Editor (left sidebar)
6. Click "New Query"
7. Copy and paste the entire contents of `supabase-schema.sql`
8. Click "Run"
9. Go to Settings → API
10. Copy these values (you'll need them soon):
    - `Project URL`
    - `anon public` key
    - `service_role` key (click "Reveal" to see it)

### 2. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen if prompted (External, add your email)
6. Choose "Web application"
7. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Click "Create"
9. Copy your `Client ID` and `Client Secret`

### 3. Set Up Mapbox (Map Service)
1. Go to [mapbox.com](https://mapbox.com) and create a free account
2. You'll automatically get a default public access token
3. Go to "Account" → "Access tokens"
4. Copy your "Default public token"

**Alternative**: If you prefer Google Maps (since you have Google Cloud credit):
- Enable Maps JavaScript API in Google Cloud Console
- Create an API key
- Restrict it to Maps JavaScript API
- You'll need to modify the map component slightly (I can help with this)

### 4. Configure Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Generate a secure AUTH_SECRET
openssl rand -base64 32
```

Now edit `.env.local` and fill in all values:
```env
AUTH_SECRET=<paste the generated secret here>
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

NEXT_PUBLIC_SUPABASE_URL=<from Supabase Settings → API>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase Settings → API>

NEXT_PUBLIC_MAPBOX_TOKEN=<from Mapbox dashboard>
```

### 5. Test Locally
```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the map (empty for now)

### 6. Add Your First Table
1. Go to `http://localhost:3000/admin`
2. Click "Add New Table"
3. Fill in:
   - **Name**: Table 1 (or the actual address name)
   - **Address**: Full address (e.g., "123 Main St, Brooklyn, NY")
   - **Unique Code**: Click "Generate" or type `table-1`
   - **Latitude/Longitude**:
     - Go to [Google Maps](https://maps.google.com)
     - Search for your address
     - Right-click on the location → Click the coordinates at the top
     - Copy the latitude (first number) and longitude (second number)
4. Click "Create Table"

### 7. Test Check-In Flow
1. Visit the check-in link shown in the admin dashboard
2. Sign in with Google
3. Leave a test message
4. Check in
5. Go back to the homepage - you should see your avatar on the map!

## 📋 For Your Wedding Day

### Before the Wedding
1. Add all 24 tables to the admin dashboard (based on your table-icons)
2. Generate QR codes for each check-in link:
   - Use [QR Code Generator](https://www.qr-code-generator.com/)
   - Link format: `https://your-domain.vercel.app/checkin/table-1`
3. Print QR codes and attach to your table cards
4. Test a few check-ins with friends/family

### During the Wedding
- Guests scan QR codes at their tables
- They sign in with Google
- They leave messages and check in
- Everyone can view the growing map at the homepage

### After the Wedding
- Export all messages from the admin dashboard
- Keep the map live as a digital keepsake
- Share the link with guests so they can revisit

## 🎨 Customization Ideas

Since you mentioned wanting it to match your wedding materials, here are some areas to customize:

### Colors
The current theme uses rose/pink tones. You can change this by editing:
- `src/app/globals.css` - Main color variables
- Component class names (search for `rose-` to replace with your color)

### Fonts
Currently using Geist fonts. You can change in `src/app/layout.tsx`

### Map Style
Currently using Mapbox streets style. You can change to:
- `mapbox://styles/mapbox/light-v11` (minimal)
- `mapbox://styles/mapbox/outdoors-v12` (nature-themed)
- Or create a custom style in Mapbox Studio to match your wedding colors

### Avatar Style
Currently using "avataaars" style. Change in both:
- `src/components/WeddingMap.tsx`
- `src/components/CheckinForm.tsx`

Options: `adventurer`, `bottts`, `fun-emoji`, `lorelei`, `micah`, `miniavs`, `open-peeps`, `personas`, `pixel-art`

## 🚀 Deployment to Vercel

When you're ready to deploy:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial wedding map setup"
   git push
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click "Import Project" and select your `wedding-map` repo

4. Add all environment variables (same as `.env.local` but update `NEXTAUTH_URL` to your Vercel URL)

5. Deploy!

6. Update Google OAuth redirect URI to include your Vercel domain:
   ```
   https://your-site.vercel.app/api/auth/callback/google
   ```

## 💡 Tips

- **Table Icons**: Your `table-icons` folder has numbered images (1-24). You can use these in future if you want to display custom icons for each table
- **Privacy**: All guest emails are stored but only names are displayed
- **Messages**: Character limit is 280 (like a tweet)
- **Pre-seed**: Consider adding a few check-ins yourself before the wedding so the map isn't empty

## ❓ Need Help?

If you get stuck, check:
1. Browser console for errors (F12)
2. Supabase logs (Dashboard → Logs)
3. Vercel deployment logs
4. The main README.md for troubleshooting section

Good luck with your wedding! 🎉
