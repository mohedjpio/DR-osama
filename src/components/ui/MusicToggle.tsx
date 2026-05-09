'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Show button after loader finishes
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  // Create audio element once on mount
  useEffect(() => {
    audioRef.current = new Audio('/music.mp3')
    audioRef.current.loop = true
    // Preload so first play is instant
    audioRef.current.preload = 'auto'
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const toggle = () => {
    const next = !playing
    setPlaying(next)
    if (next) {
      audioRef.current?.play().catch(() => {
        // Browser blocked autoplay — silently ignore
        setPlaying(false)
      })
    } else {
      audioRef.current?.pause()
    }
  }

  if (!visible) return null

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 glass px-4 py-2 rounded-full text-xs tracking-widest uppercase text-gold/70 hover:text-gold transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label={playing ? 'Pause music' : 'Play ambient music'}
    >
      <span className="text-base">{playing ? '♫' : '♪'}</span>
      <span>{playing ? 'Music On' : 'Music'}</span>
      {playing && (
        <span className="flex items-end gap-px h-3 ml-1">
          {[0, 0.15, 0.3, 0.45, 0.6].map((delay, i) => (
            <motion.span
              key={i}
              className="w-0.5 bg-gold rounded-full inline-block"
              animate={{ height: ['3px', '12px', '3px'] }}
              transition={{ duration: 0.9, delay, repeat: Infinity }}
            />
          ))}
        </span>
      )}
    </motion.button>
  )
}
