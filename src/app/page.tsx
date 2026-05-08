'use client'
import { useEffect } from 'react'
import { useLenis } from '@/hooks/useLenis'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useMemoriesStore } from '@/store/memoriesStore'

import Loader from '@/components/ui/Loader'
import Navbar from '@/components/ui/Navbar'
import ParticleCanvas from '@/components/ui/ParticleCanvas'
import MusicToggle from '@/components/ui/MusicToggle'
import EasterEgg from '@/components/ui/EasterEgg'

import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import QuoteBanner from '@/components/sections/QuoteBanner'
import TimelineSection from '@/components/sections/TimelineSection'
import LoveLetterSection from '@/components/sections/LoveLetterSection'
import GallerySection from '@/components/sections/GallerySection'
import GratitudeWallSection from '@/components/sections/GratitudeWallSection'
import InviteSection from '@/components/sections/InviteSection'
import EndingSection from '@/components/sections/EndingSection'

export default function Home() {
  useLenis()
  useScrollReveal()

  const { load, reload, startRealtimeSync } = useMemoriesStore()

  useEffect(() => {
    // Initial load
    load()

    // Start realtime (INSERT + DELETE listener)
    const cleanup = startRealtimeSync()

    // Re-fetch when user comes back from /submit tab
    const handleFocus = () => reload()
    const handleVisibility = () => { if (!document.hidden) reload() }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cleanup()
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [load, reload, startRealtimeSync])

  return (
    <>
      <Loader />
      <ParticleCanvas />
      <Navbar />
      <MusicToggle />
      <EasterEgg />

      <main>
        <HeroSection />
        <StorySection />
        <QuoteBanner />
        <TimelineSection />
        <LoveLetterSection />
        <GallerySection />
        <GratitudeWallSection />
        <InviteSection />
        <EndingSection />
      </main>

      <footer className="relative text-center py-12 border-t border-gold/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
        <div className="relative z-10 space-y-3">
          <p className="font-serif text-gold/20 text-2xl">✦</p>
          <p className="text-cream/20 text-sm tracking-[0.2em]">
            Memories with the Best Ever · 2026
          </p>
          <p className="text-gold/35 text-xs tracking-[0.2em]">
            Developed with all love by{' '}
            <span className="text-gold/55 font-medium">Mohamed Hassan</span>
          </p>
        </div>
      </footer>
    </>
  )
}
