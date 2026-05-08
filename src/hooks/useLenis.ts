'use client'
import { useEffect } from 'react'

export function useLenis() {
  useEffect(() => {
    let lenisInstance: { raf: (time: number) => void; destroy: () => void } | null = null
    let rafId: number

    async function init() {
      try {
        const Lenis = (await import('lenis')).default
        lenisInstance = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        })

        function raf(time: number) {
          lenisInstance?.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      } catch {
        // Lenis failed to load — fall back to native scroll silently
      }
    }

    init()
    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance?.destroy()
    }
  }, [])
}
