'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// The easter egg appears after Konami code or after submitting a memory
export default function EasterEgg() {
  const [visible, setVisible] = useState(false)
  const keys = useRef<string[]>([])
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

  function useRef<T>(init: T) { return { current: init } }

  useEffect(() => {
    const ref: string[] = []
    const handler = (e: KeyboardEvent) => {
      ref.push(e.key)
      if (ref.length > KONAMI.length) ref.shift()
      if (ref.join(',') === KONAMI.join(',')) {
        setVisible(true)
        setTimeout(() => setVisible(false), 6000)
      }
    }
    window.addEventListener('keydown', handler)

    // Also listen for custom event from form
    const onSuccess = () => {
      setTimeout(() => {
        setVisible(true)
        setTimeout(() => setVisible(false), 6000)
      }, 1200)
    }
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
            ✦ "You changed more lives than you'll ever know."<br />
            <span className="text-cream/40 not-italic text-xs mt-1 block">— A grateful student, somewhere.</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
