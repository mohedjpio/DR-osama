'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Smooth progress animation
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + Math.random() * 12
      })
    }, 150)

    const timer = setTimeout(() => setVisible(false), 2800)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-ink flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Spinning ring */}
          <motion.div
            className="w-20 h-20 rounded-full border border-gold/20 border-t-gold"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />

          <p className="font-serif text-gold/60 text-sm tracking-[0.4em] uppercase mt-8">
            Loading Memories
          </p>

          {/* Progress bar */}
          <div className="w-48 h-px bg-gold/10 mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
