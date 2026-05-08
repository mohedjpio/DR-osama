'use client'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import { useState } from 'react'

export default function QRPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const [mode, setMode] = useState<'gallery' | 'submit'>('submit')

  const url = mode === 'submit' ? `${origin}/submit` : origin

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink px-6 text-center py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04)_0%,transparent_65%)]" />

      <div className="relative z-10 max-w-sm w-full">
        <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase mb-5">Share this experience</p>
        <h1 className="font-serif text-cream text-3xl mb-3 leading-snug">
          Memories with<br />the Best Ever
        </h1>
        <p className="text-cream/25 text-xs mb-10">Dr. Osama El Nahas · Class of 2026</p>

        {/* Toggle */}
        <div className="flex bg-white/[0.03] border border-gold/10 rounded-2xl p-1 mb-8 gap-1">
          {(['submit', 'gallery'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-xs tracking-widest uppercase transition-all ${
                mode === m
                  ? 'bg-gold/15 text-gold border border-gold/25'
                  : 'text-cream/30 hover:text-cream/55'
              }`}
            >
              {m === 'submit' ? 'Add Memory' : 'View Gallery'}
            </button>
          ))}
        </div>

        {/* QR */}
        <div className="p-6 bg-white/[0.025] border border-gold/12 rounded-2xl mb-6 inline-block mx-auto">
          <QRCodeSVG
            value={url}
            size={200}
            bgColor="transparent"
            fgColor="#D4AF37"
            level="H"
          />
        </div>

        <p className="text-cream/25 text-xs mb-1">Scan to {mode === 'submit' ? 'add a memory' : 'view the gallery'}</p>
        <p className="text-gold/25 text-[10px] font-mono mb-10 break-all">{url}</p>

        <div className="flex flex-col gap-3">
          <Link href="/submit"
            className="border border-gold/20 text-gold/50 hover:text-gold hover:border-gold/50 px-6 py-3 rounded-xl text-xs tracking-widest uppercase transition-all">
            ✦ Add a Memory
          </Link>
          <Link href="/"
            className="border border-white/8 text-cream/25 hover:text-cream/50 hover:border-white/15 px-6 py-3 rounded-xl text-xs tracking-widest uppercase transition-all">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
