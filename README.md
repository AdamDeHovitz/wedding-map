# Wedding Map

An interactive wedding guest map where guests can check in at special locations and leave messages.

## Features

- 🗺️ Interactive map showing all wedding table locations
- 🔐 Google OAuth authentication
- 👤 Unique avatars for each guest
- 💬 Optional messages at each location
- 📱 QR code compatible (print codes on table cards)
- 🎨 Beautiful, responsive UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js v5
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor and run the contents of `supabase-schema.sql`
4. Get your project URL and API keys from Settings → API

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
6. Copy your Client ID and Client Secret

### 4. Set Up Mapbox

1. Create a free account at [mapbox.com](https://mapbox.com)
2. Go to Account → Access Tokens
3. Create a new token (or use the default public token)

**Alternative**: Use Google Maps API if you prefer (requires API key setup in Google Cloud)

### 5. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Generate an `AUTH_SECRET`:
```bash
openssl rand -base64 32
```

Fill in all the values in `.env.local`.

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
wedding-map/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   └── checkin/             # Check-in API
│   │   ├── admin/                   # Admin dashboard
│   │   ├── checkin/[code]/          # Guest check-in pages
│   │   └── page.tsx                 # Main map view
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   ├── AddTableForm.tsx
│   │   ├── CheckinForm.tsx
│   │   ├── WeddingMap.tsx
│   │   └── SessionProvider.tsx
│   ├── lib/
│   │   └── supabase.ts              # Supabase client
│   ├── types/
│   │   └── database.ts              # TypeScript types
│   └── auth.ts                      # NextAuth config
├── supabase-schema.sql              # Database schema
└── .env.local.example               # Environment variables template
```

## Usage Guide

### For You (Admin)

1. Visit `/admin` to access the admin dashboard
2. Click "Add New Table" to create locations for your wedding
3. For each table:
   - Enter the table name (e.g., "Table 1" or the actual address)
   - Enter the full address
   - Generate a unique code (this creates the URL)
   - Get coordinates from Google Maps (search address, copy lat/long from URL)
4. Copy the check-in links or generate QR codes
5. Print QR codes and place them on table cards at your wedding

### For Guests

1. Scan QR code or visit the unique link (e.g., `/checkin/table-1`)
2. Sign in with Google
3. Optionally leave a message
4. Click "Check In" to place their avatar on the map
5. View the main map at `/` to see all locations and guest check-ins

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Update Google OAuth redirect URI with your Vercel domain
5. Deploy!

### After Deployment

- Test the check-in flow with a few locations
- Generate QR codes for each table link
- Print and display at your wedding

## Customization

### Change Colors

Edit `src/app/globals.css` to change the color scheme (currently rose/pink theme).

### Change Map Style

In `src/components/WeddingMap.tsx`, change the `mapStyle` prop to any Mapbox style.

### Avatar Styles

Change the avatar style in the `getAvatarUrl` function (options: adventurer, avataaars, bottts, croodles, fun-emoji, etc.)

## Generating QR Codes

Use a free QR code generator like:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QR Code Monkey](https://www.qrcode-monkey.com/)

For each table, generate a QR code pointing to: `https://your-domain.vercel.app/checkin/[unique-code]`

## Troubleshooting

### Map not loading
- Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set correctly
- Ensure the token is public (not secret)

### Authentication not working
- Verify Google OAuth credentials
- Check redirect URIs match exactly
- Ensure `AUTH_SECRET` is set

### Database errors
- Verify Supabase credentials
- Check that schema was applied correctly
- Review RLS policies in Supabase dashboard

## License

MIT - feel free to use this for your own wedding!
