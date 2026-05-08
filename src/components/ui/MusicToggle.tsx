'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  // Show button after loader
  useEffect(() => { setTimeout(() => setVisible(true), 3000) }, [])

  const notes = [261.63, 293.66, 329.63, 392.00, 349.23, 329.63, 293.66]
  const noteIdx = useRef(0)

  function playNote() {
    if (!ctxRef.current || !gainRef.current) return
    const osc = ctxRef.current.createOscillator()
    const env = ctxRef.current.createGain()
    osc.type = 'sine'
    osc.frequency.value = notes[noteIdx.current % notes.length] * 0.5
    noteIdx.current++
    env.gain.setValueAtTime(0, ctxRef.current.currentTime)
    env.gain.linearRampToValueAtTime(0.06, ctxRef.current.currentTime + 0.1)
    env.gain.exponentialRampToValueAtTime(0.001, ctxRef.current.currentTime + 1.5)
    osc.connect(env)
    env.connect(gainRef.current)
    osc.start()
    osc.stop(ctxRef.current.currentTime + 1.5)
  }

  function startMusic() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainRef.current = ctxRef.current.createGain()
      gainRef.current.gain.value = 1
      gainRef.current.connect(ctxRef.current.destination)
    }

    const loop = () => {
      playNote()
      noteTimer.current = setTimeout(loop, 1100)
    }
    loop()
  }

  function stopMusic() {
    if (noteTimer.current) clearTimeout(noteTimer.current)
  }

  const toggle = () => {
    const next = !playing
    setPlaying(next)
    next ? startMusic() : stopMusic()
  }

  if (!visible) return null

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 glass px-4 py-2 rounded-full text-xs tracking-widest uppercase text-gold/70 hover:text-gold hover:border-gold/40 transition-all"
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
              className="w-0.5 bg-gold rounded-full"
              animate={{ height: ['3px', '12px', '3px'] }}
              transition={{ duration: 0.9, delay, repeat: Infinity }}
            />
          ))}
        </span>
      )}
    </motion.button>
  )
}
