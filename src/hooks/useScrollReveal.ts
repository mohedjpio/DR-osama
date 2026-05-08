'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useScrollReveal(selector = '.reveal') {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [selector])
}

// Parallax helper for a single ref
export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    gsap.to(el, {
      yPercent: -20 * speed * 10,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [speed])
  return ref
}
