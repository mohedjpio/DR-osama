import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

// ── Load fonts via next/font (never fails, self-hosted via Google CDN) ────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Memories with the Best Ever',
  description: 'A graduation tribute for the professor who changed our lives.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png',    type: 'image/png', sizes: '512x512' },
    ],
    apple: { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    shortcut: '/favicon.png',
  },
  openGraph: {
    title: 'Memories with the Best Ever',
    description: 'A cinematic tribute — Class of 2026.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
