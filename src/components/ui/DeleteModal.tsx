'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Memory } from '@/types'
import { useMemoriesStore } from '@/store/memoriesStore'

// Admin password — also enforced server-side in /api/memories/[id]/route.ts
// Set ADMIN_DELETE_PASSWORD in .env.local to override.
const ADMIN_PASSWORD = 'Dr@0sama#2026!MemX'

interface Props {
  memory: Memory | null
  onClose: () => void
}

type Phase = 'idle' | 'deleting' | 'success' | 'error'

export default function DeleteModal({ memory, onClose }: Props) {
  const [password, setPassword] = useState('')
  const [phase,    setPhase]    = useState<Phase>('idle')
  const [errMsg,   setErrMsg]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { removeMemory } = useMemoriesStore()

  // Reset every time a new memory is passed in
  useEffect(() => {
    if (memory) {
      setPassword(''); setPhase('idle'); setErrMsg('')
      setTimeout(() => inputRef.current?.focus(), 280)
    }
  }, [memory])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function shake() {
    inputRef.current?.animate(
      [
        { transform: 'translateX(-7px)' },
        { transform: 'translateX(7px)'  },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)'  },
        { transform: 'translateX(0)'    },
      ],
      { duration: 380, easing: 'ease-in-out' }
    )
  }

  async function handleDelete() {
    if (!password) return

    // ── Client-side password check (UX only) ──────────────────────────────
    if (password !== ADMIN_PASSWORD) {
      setErrMsg('Incorrect password. Access denied.')
      shake()
      return
    }

    setPhase('deleting')
    setErrMsg('')

    try {
      // ── Calls server → server deletes with service role key → verifies gone
      await removeMemory(memory!.id, password)
      setPhase('success')
      setTimeout(() => { onClose(); setPhase('idle') }, 1600)
    } catch (err) {
      setPhase('error')
      setErrMsg((err as Error).message ?? 'Delete failed. Please try again.')
      shake()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phase === 'idle') handleDelete()
  }

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/95 backdrop-blur-2xl"
            onClick={() => phase !== 'deleting' && onClose()}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ scale: 0.88, y: 28, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{   scale: 0.93,  y: 14, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
          >
            <div
              className="rounded-2xl border border-red-900/25 p-8 relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg,#100818,#080d18)' }}
            >
              {/* Subtle red glow top */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-700/40 to-transparent" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-900/10 blur-2xl rounded-full pointer-events-none" />

              {/* ── SUCCESS ── */}
              {phase === 'success' && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-emerald-500/50 bg-emerald-900/20 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5"
                    animate={{ boxShadow: ['0 0 0 0 rgba(52,211,153,0.3)', '0 0 0 16px rgba(52,211,153,0)', '0 0 0 0 rgba(52,211,153,0)'] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ✓
                  </motion.div>
                  <p className="font-serif text-cream/80 text-xl mb-1">Permanently deleted.</p>
                  <p className="text-cream/30 text-xs tracking-wide">The memory has been removed from the database.</p>
                </motion.div>
              )}

              {/* ── DELETING SPINNER ── */}
              {phase === 'deleting' && (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full border border-red-700/40 border-t-red-400 mx-auto mb-5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-cream/40 text-sm tracking-widest">Deleting from database…</p>
                  <p className="text-cream/20 text-xs mt-1">Verifying removal…</p>
                </motion.div>
              )}

              {/* ── IDLE / ERROR form ── */}
              {(phase === 'idle' || phase === 'error') && (
                <>
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-11 h-11 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center text-red-400 text-xl flex-shrink-0 mt-0.5">
                      ⚠
                    </div>
                    <div>
                      <h3 className="font-serif text-cream text-xl leading-tight">Delete Memory</h3>
                      <p className="text-cream/30 text-xs mt-1 leading-relaxed">
                        This permanently removes the memory from the database.<br />
                        <span className="text-red-400/60">This action cannot be undone.</span>
                      </p>
                    </div>
                  </div>

                  {/* Memory preview */}
                  <div className="rounded-xl border border-gold/10 bg-white/[0.025] p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-gold text-xs leading-none">
                          {memory.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-serif text-gold text-sm">{memory.name}</p>
                    </div>
                    <p className="text-cream/35 text-xs leading-relaxed line-clamp-3 pl-8">
                      {memory.message}
                    </p>
                  </div>

                  {/* Password */}
                  <label className="block mb-2">
                    <span className="text-cream/35 text-[10px] tracking-[0.3em] uppercase">
                      Admin Password Required
                    </span>
                  </label>
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrMsg(''); setPhase('idle') }}
                    onKeyDown={handleKey}
                    placeholder="Enter admin password…"
                    className="w-full bg-white/[0.04] border border-red-900/30 focus:border-red-600/50 text-cream placeholder-cream/18 px-4 py-3.5 rounded-xl text-sm outline-none transition-colors"
                    autoComplete="new-password"
                    spellCheck={false}
                  />

                  {/* Error message */}
                  <AnimatePresence>
                    {errMsg && (
                      <motion.div
                        className="mt-3 flex items-start gap-2 bg-red-950/40 border border-red-800/30 rounded-lg px-3 py-2.5"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <span className="text-red-400 text-xs mt-px flex-shrink-0">✕</span>
                        <p className="text-red-300/80 text-xs leading-relaxed">{errMsg}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={onClose}
                      className="flex-1 border border-white/[0.08] text-cream/35 hover:text-cream/60 hover:border-white/[0.15] py-3.5 rounded-xl text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={!password}
                      className="flex-[1.4] bg-red-900/50 hover:bg-red-800/65 border border-red-700/40 hover:border-red-600/60 text-red-300 hover:text-red-200 py-3.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Delete Permanently
                    </button>
                  </div>

                  {/* Fine print */}
                  <p className="text-center text-cream/15 text-[10px] tracking-wide mt-4">
                    Password verified server-side · Cannot be recovered after deletion
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
