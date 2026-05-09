'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function EasterEgg() {
  const [visible, setVisible] = useState(false)
  const keysRef = useRef<string[]>([])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      keysRef.current.push(e.key)
      if (keysRef.current.length > KONAMI.length) keysRef.current.shift()
      if (keysRef.current.join(',') === KONAMI.join(',')) {
        setVisible(true)
        setTimeout(() => setVisible(false), 6000)
      }
    }

    const onSuccess = () => {
      setTimeout(() => {
        setVisible(true)
        setTimeout(() => setVisible(false), 6000)
      }, 1200)
    }

    window.addEventListener('keydown', handler)
    window.addEventListener('memory-submitted', onSuccess)
    return () => {
      window.removeEventListener('keydown', handler)
      window.removeEventListener('memory-submitted', onSuccess)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-20 right-6 z-50 glass rounded-xl px-5 py-4 max-w-xs border border-gold/20"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-serif italic text-gold/80 text-sm leading-relaxed">
            ✦ &ldquo;You changed more lives than you&apos;ll ever know.&rdquo;<br />
            <span className="text-cream/40 not-italic text-xs mt-1 block">— A grateful student, somewhere.</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
