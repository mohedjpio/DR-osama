'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { insertMemory } from '@/lib/supabase'
import { useMemoriesStore } from '@/store/memoriesStore'
import type { FormStep } from '@/types'

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
}

export default function MultiStepForm() {
  const [step, setStep] = useState<FormStep>(0)
  const [dir, setDir] = useState(1)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const { addMemory } = useMemoriesStore()

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    setFileError(null)
    if (rejected.length) { setFileError('Images only, max 5 MB.'); return }
    const file = accepted[0]
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  function goTo(next: FormStep) {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setError(null)
    try {
      let imageUrl: string | null = null
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        imageUrl = data.url
      }
      const newMemory = await insertMemory({ name: name.trim(), message: message.trim(), image_url: imageUrl })
      addMemory(newMemory)
      setIsSuccess(true)
      window.dispatchEvent(new Event('memory-submitted'))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function next(to: FormStep) {
    if (to === 1 && !name.trim()) return
    if (to === 2 && !message.trim()) return
    goTo(to)
  }

  function reset() {
    setStep(0); setName(''); setMessage('')
    setImageFile(null); setPreview(null)
    setIsSuccess(false); setError(null); setFileError(null); setDir(1)
  }

  if (isSuccess) {
    return (
      <motion.div
        className="text-center py-16 px-6"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-gold mx-auto mb-8 flex items-center justify-center text-gold text-3xl"
          animate={{ boxShadow: ['0 0 0 0 rgba(212,175,55,0.4)', '0 0 0 24px rgba(212,175,55,0)', '0 0 0 0 rgba(212,175,55,0)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✦
        </motion.div>
        <h3 className="font-serif text-cream text-3xl mb-3">Thank you.</h3>
        <p className="text-cream/40 leading-relaxed max-w-sm mx-auto text-sm mb-10">
          Your memory has been added to the tapestry of gratitude. It will live here, forever.
        </p>
        <button
          onClick={reset}
          className="border border-gold/25 text-gold/50 hover:text-gold hover:border-gold/60 px-8 py-3 rounded-xl text-xs tracking-[0.25em] uppercase transition-all"
        >
          Add Another Memory
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-3">
          {['Your Name', 'Your Memory', 'Add a Photo'].map((label, i) => (
            <span
              key={i}
              className={`text-[10px] tracking-widest uppercase transition-colors ${
                i <= step ? 'text-gold/60' : 'text-cream/15'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold/60 to-gold"
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-400 ${
                i <= step
                  ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {/* ── Step 0: Name ── */}
          {step === 0 && (
            <motion.div
              key="s0"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-gold/35 text-[10px] tracking-[0.4em] uppercase mb-2">Step 1 of 3</p>
              <h3 className="font-serif text-cream text-3xl mb-8">Who are you?</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && next(1)}
                placeholder="Your name…"
                maxLength={100}
                autoFocus
                className="w-full bg-white/[0.04] border border-gold/20 focus:border-gold/50 text-cream placeholder-cream/20 px-5 py-4 rounded-xl text-base outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(212,175,55,0.06)]"
              />
              {!name.trim() && name.length > 0 && (
                <p className="text-red-400/60 text-xs mt-2">Please enter your name.</p>
              )}
              <div className="mt-8">
                <button
                  onClick={() => next(1)}
                  className="w-full py-4 rounded-xl font-medium text-sm tracking-[0.1em] text-ink transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Message ── */}
          {step === 1 && (
            <motion.div
              key="s1"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-gold/35 text-[10px] tracking-[0.4em] uppercase mb-2">Step 2 of 3</p>
              <h3 className="font-serif text-cream text-3xl mb-8">What do you remember?</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your memory, your gratitude, your story…"
                maxLength={1000}
                rows={7}
                autoFocus
                className="w-full bg-white/[0.04] border border-gold/20 focus:border-gold/50 text-cream placeholder-cream/20 px-5 py-4 rounded-xl text-sm leading-relaxed outline-none transition-all duration-300 resize-none focus:shadow-[0_0_20px_rgba(212,175,55,0.06)]"
              />
              <div className="flex justify-between items-center mt-1.5 mb-8">
                {!message.trim() && message.length > 0
                  ? <p className="text-red-400/60 text-xs">Please share your memory.</p>
                  : <span />
                }
                <p className="text-gold/25 text-xs ml-auto">{message.length}/1000</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => goTo(0)}
                  className="flex-1 border border-gold/15 text-cream/35 hover:text-cream/60 hover:border-gold/30 py-4 rounded-xl text-sm transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => next(2)}
                  className="flex-[2] py-4 rounded-xl font-medium text-sm tracking-[0.1em] text-ink transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Image ── */}
          {step === 2 && (
            <motion.div
              key="s2"
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-gold/35 text-[10px] tracking-[0.4em] uppercase mb-2">Step 3 of 3</p>
              <h3 className="font-serif text-cream text-3xl mb-8">A moment in time.</h3>

              <div
                {...getRootProps()}
                className={`relative rounded-2xl overflow-hidden border-2 border-dashed text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-gold/60 bg-gold/5 shadow-[0_0_30px_rgba(212,175,55,0.08)]'
                    : 'border-gold/15 hover:border-gold/35 hover:bg-white/[0.02]'
                }`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-60 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                      <span className="text-white/60 text-xs tracking-widest">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-14 px-6">
                    <div className="text-gold/20 text-4xl mb-4">⬆</div>
                    <p className="text-cream/35 text-sm mb-1">
                      Drop a photo, or <span className="text-gold/50 underline">browse</span>
                    </p>
                    <p className="text-cream/15 text-xs">Optional · JPG, PNG, WEBP · Max 5 MB</p>
                  </div>
                )}
              </div>

              {fileError && <p className="text-red-400/60 text-xs mt-2">{fileError}</p>}
              {error && <p className="text-red-400/70 text-sm mt-3 p-3 rounded-lg bg-red-950/30 border border-red-800/30">{error}</p>}

              <p className="text-cream/20 text-xs mt-3 text-center">
                Your memory matters even without a photo.
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => goTo(1)}
                  className="flex-1 border border-gold/15 text-cream/35 hover:text-cream/60 hover:border-gold/30 py-4 rounded-xl text-sm transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 rounded-xl font-medium text-sm tracking-[0.1em] text-ink transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,175,55,0.25)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-4 h-4 border border-ink/40 border-t-ink rounded-full"
                      />
                      Saving…
                    </span>
                  ) : 'Submit Memory ✦'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
