# ✦ Memories with the Best Ever

A cinematic, emotional tribute website for a graduating professor. Built with Next.js 14, Framer Motion, GSAP, Supabase, and Cloudinary.

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout + metadata
│   ├── page.tsx              # Main page (orchestrator)
│   ├── globals.css           # Base styles + Tailwind
│   ├── qr/page.tsx           # Shareable QR code page
│   └── api/
│       ├── memories/route.ts # GET + POST memories (Supabase)
│       └── upload/route.ts   # Server-side Cloudinary upload
├── components/
│   ├── ui/
│   │   ├── Loader.tsx        # Cinematic loading screen
│   │   ├── Navbar.tsx        # Fixed top nav
│   │   ├── ParticleCanvas.tsx# Mouse-reactive particles
│   │   ├── MusicToggle.tsx   # Ambient tone generator
│   │   ├── EasterEgg.tsx     # Hidden easter egg (Konami + form submit)
│   │   ├── MemoryCard.tsx    # 3D tilt masonry card
│   │   └── MemoryModal.tsx   # Animated full-screen modal
│   ├── sections/
│   │   ├── HeroSection.tsx   # Letter-by-letter animated quote
│   │   ├── StorySection.tsx  # Parallax story + stats
│   │   ├── QuoteBanner.tsx   # Horizontal scroll quotes (GSAP)
│   │   ├── GallerySection.tsx# Masonry gallery + search
│   │   ├── AddMemorySection.tsx
│   │   └── EndingSection.tsx # Slideshow + emotional ending
│   └── forms/
│       └── MultiStepForm.tsx # Animated 3-step form + drag-drop
├── hooks/
│   ├── useLenis.ts           # Smooth scroll (Lenis)
│   └── useScrollReveal.ts   # GSAP scroll animations + parallax
├── lib/
│   ├── supabase.ts           # Supabase client + queries
│   ├── cloudinary.ts         # Image upload helpers
│   └── utils.ts              # cn(), formatDate(), truncate()
├── store/
│   └── memoriesStore.ts     # Zustand global state
└── types/
    └── index.ts              # Shared TypeScript types
supabase/
└── schema.sql               # Database setup SQL
```

---

## ⚡ Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-username/memories-with-the-best-ever.git
cd memories-with-the-best-ever
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your credentials (see sections below).

### 3. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## 🧠 Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Realtime** is enabled automatically by the schema SQL. No extra config needed.

---

## ☁️ Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to **Settings → Upload → Upload presets**
3. Create a new preset:
   - **Signing Mode**: Unsigned
   - **Folder**: `memories`
   - **Name**: `memories_unsigned`
4. Copy your cloud name, API key, and API secret

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123xyz
```

Images are auto-optimized (quality: auto, format: auto) and served via CDN.

---

## 🚀 Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel deploy --prod
```

### Option B — GitHub → Vercel Dashboard

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add all environment variables from `.env.local`
4. Deploy!

### Vercel environment variables to add

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `NEXT_PUBLIC_SITE_URL` | Your final Vercel URL |

---

## 🥚 Easter Egg

Two triggers:
- **Konami Code**: ↑ ↑ ↓ ↓ ← → ← → B A
- **After submitting a memory**: appears automatically after 1.2s

---

## 📱 QR Code Page

Visit `/qr` to get a scannable QR code that links to your site. Perfect for printing and sharing at the graduation ceremony.

---

## 🎨 Customisation

| What | Where |
|---|---|
| Quote in hero | `HeroSection.tsx` → `QUOTE` constant |
| Professor's name | `StorySection.tsx` |
| Stats (years, etc.) | `StorySection.tsx` → `stats` array |
| Color theme | `tailwind.config.ts` + `globals.css` |
| Ambient piano notes | `MusicToggle.tsx` → `notes` array |
| Google Fonts | `globals.css` `@import` |

---

## 🔐 Security notes

- Images are validated server-side (type + size) in `/api/upload`
- All inputs validated both client + server side
- Supabase Row Level Security is enabled (public read + insert only)
- No personal data is stored beyond name, message, and optional image URL
