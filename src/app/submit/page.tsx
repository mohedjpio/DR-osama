'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import Image from 'next/image'
import { insertMemory } from '@/lib/supabase'
import type { FormStep } from '@/types'

// ── Particle canvas (self-contained, no shared store needed) ──────────────────
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0, raf: number
    type P = { x:number;y:number;vx:number;vy:number;size:number;opacity:number;life:number;max:number;gold:boolean }
    let pts: P[] = []
    const mk = (): P => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.2, vy: (Math.random()-.5)*.2-.06,
      size: Math.random()*1.3+.3, opacity: Math.random()*.4+.08,
      life: 0, max: 300+Math.random()*500, gold: Math.random()>.65
    })
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    resize(); pts = Array.from({length:90}, mk)
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach((p,i) => {
        p.life++; p.x+=p.vx; p.y+=p.vy
        const a = p.opacity*(1-p.life/p.max)
        ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=p.gold?'#D4AF37':'#F0EAD6'
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore()
        if (p.life>p.max||p.y<-10) pts[i]=mk()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-50" />
}

// ── Step variants ─────────────────────────────────────────────────────────────
const variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40, scale: 0.97 }),
}

const STEPS = ['Your Name', 'Your Memory', 'A Photo']

export default function SubmitPage() {
  const [step, setStep]           = useState<FormStep>(0)
  const [dir,  setDir]            = useState(1)
  const [name, setName]           = useState('')
  const [message, setMessage]     = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [fileErr, setFileErr]     = useState<string | null>(null)
  const [nameErr, setNameErr]     = useState(false)
  const [msgErr,  setMsgErr]      = useState(false)

  const onDrop = useCallback((accepted: File[], rejected: { file: File; errors: { code: string; message: string }[] }[]) => {
    setFileErr(null)
    if (rejected.length) { setFileErr('Images only, max 5 MB.'); return }
    setImageFile(accepted[0])
    setPreview(URL.createObjectURL(accepted[0]))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxSize: 5*1024*1024, multiple: false,
  })

  function goTo(next: FormStep) { setDir(next > step ? 1 : -1); setStep(next) }

  function toStep1() {
    if (!name.trim()) { setNameErr(true); return }
    setNameErr(false); goTo(1)
  }
  function toStep2() {
    if (!message.trim()) { setMsgErr(true); return }
    setMsgErr(false); goTo(2)
  }

  async function submit() {
    setSubmitting(true); setError(null)
    try {
      let imageUrl: string | null = null
      if (imageFile) {
        const fd = new FormData(); fd.append('file', imageFile)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        imageUrl = data.url
      }
      await insertMemory({ name: name.trim(), message: message.trim(), image_url: imageUrl })
      setSuccess(true)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep(0); setDir(1); setName(''); setMessage('')
    setImageFile(null); setPreview(null); setSuccess(false)
    setError(null); setFileErr(null); setNameErr(false); setMsgErr(false)
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <Particles />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_65%)]" />

        <motion.div
          className="relative z-10 max-w-md"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="w-24 h-24 rounded-full border-2 border-gold mx-auto mb-10 flex items-center justify-center text-gold text-4xl"
            animate={{ boxShadow: [
              '0 0 0 0 rgba(212,175,55,0.4)',
              '0 0 0 28px rgba(212,175,55,0)',
              '0 0 0 0 rgba(212,175,55,0)',
            ]}}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            ✦
          </motion.div>

          <p className="text-gold/50 text-[10px] tracking-[0.5em] uppercase mb-4">Submitted</p>
          <h2 className="font-serif font-light text-cream text-4xl mb-4">Thank you, {name}.</h2>
          <p className="text-cream/40 text-sm leading-relaxed mb-10">
            Your memory has been woven into the tapestry of gratitude.
            Dr. Osama El Nahas will carry your words forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="border border-gold/20 text-gold/50 hover:text-gold hover:border-gold/50 px-7 py-3 rounded-xl text-xs tracking-[0.25em] uppercase transition-all"
            >
              Add Another Memory
            </button>
            <Link
              href="/"
              className="border border-white/10 text-cream/30 hover:text-cream/60 hover:border-white/20 px-7 py-3 rounded-xl text-xs tracking-[0.25em] uppercase transition-all text-center"
            >
              View All Memories
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── MAIN FORM ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink relative overflow-hidden">
      <Particles />

      {/* Ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="fixed top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />

      {/* ── TOP BAR ── */}
      <motion.header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gold/8"
        style={{ background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(16px)' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-cream/30 hover:text-gold text-xs tracking-[0.3em] uppercase transition-colors group"
        >
          <motion.span
            className="inline-block"
            animate={{ x: [0,-3,0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ←
          </motion.span>
          <span>Back to Memories</span>
        </Link>

        <span className="font-serif text-gold/60 text-sm tracking-widest">✦</span>

        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-400 ${
                i < step  ? 'w-4 h-1.5 bg-gold/50' :
                i === step ? 'w-6 h-1.5 bg-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]' :
                             'w-1.5 h-1.5 bg-white/10'
              }`}
            />
          ))}
        </div>
      </motion.header>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* LEFT — Emotional side panel */}
        <motion.aside
          className="lg:w-[42%] lg:fixed lg:inset-y-0 lg:left-0 flex flex-col items-center justify-center px-10 py-32 lg:py-20 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16,1,0.3,1] }}
        >
          {/* Dr. Osama portrait */}
          <div className="relative mb-8 lg:mb-10">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold/20 via-gold/5 to-transparent blur-md" />
            <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border border-gold/25">
              <Image
                src="/dr-osama.jpg"
                alt="Dr. Osama El Nahas"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <motion.div
              className="absolute -inset-3 rounded-full border border-dashed border-gold/12"
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <p className="text-gold/40 text-[10px] tracking-[0.5em] uppercase mb-3">Tribute to</p>
          <h1 className="font-serif font-light text-cream text-3xl lg:text-4xl leading-tight mb-2">
            Dr. Osama<br />El Nahas
          </h1>
          <p className="text-gold/40 text-xs tracking-[0.2em] mb-8">Professor · Mentor · Legend</p>

          {/* Divider */}
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gold/30 to-transparent mb-8 hidden lg:block" />

          {/* Rotating quotes */}
          <RotatingQuote />

          {/* Step description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="mt-10 hidden lg:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gold/30 text-[10px] tracking-[0.35em] uppercase mb-1">
                Step {step + 1} of 3
              </p>
              <p className="text-cream/50 text-sm">
                {[
                  'Tell us who you are.',
                  'Write what this professor meant to you.',
                  'Attach a photo from the journey. (Optional)',
                ][step]}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.aside>

        {/* RIGHT — Form panel */}
        <main className="lg:ml-[42%] flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-28 lg:py-20 min-h-screen">
          <motion.div
            className="max-w-lg w-full mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16,1,0.3,1] }}
          >
            {/* Progress bar */}
            <div className="mb-12">
              <div className="flex justify-between mb-3">
                {STEPS.map((label, i) => (
                  <span key={i} className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                    i <= step ? 'text-gold/60' : 'text-cream/15'
                  }`}>{label}</span>
                ))}
              </div>
              <div className="h-px bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold/50 to-gold"
                  animate={{ width: `${((step+1)/3)*100}%` }}
                  transition={{ duration: 0.55, ease: [0.16,1,0.3,1] }}
                />
              </div>
            </div>

            {/* Form steps */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>

                {/* ── STEP 0: Name ── */}
                {step === 0 && (
                  <motion.div key="s0" custom={dir} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                  >
                    <h2 className="font-serif font-light text-cream text-4xl mb-2">Who are you?</h2>
                    <p className="text-cream/30 text-sm mb-8">Your name will appear on your memory card.</p>

                    <div className="relative mb-2">
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setNameErr(false) }}
                        onKeyDown={e => e.key === 'Enter' && toStep1()}
                        placeholder="Your full name…"
                        maxLength={100}
                        autoFocus
                        className={`w-full bg-white/[0.04] border text-cream placeholder-cream/18 px-5 py-4 rounded-2xl text-base outline-none transition-all duration-300
                          ${nameErr
                            ? 'border-red-500/50 focus:border-red-400/70 shadow-[0_0_20px_rgba(220,38,38,0.06)]'
                            : 'border-gold/20 focus:border-gold/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.06)]'
                          }`}
                      />
                      {name && (
                        <motion.div
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-xs"
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                        >✓</motion.div>
                      )}
                    </div>
                    <AnimatePresence>
                      {nameErr && (
                        <motion.p className="text-red-400/70 text-xs mb-6"
                          initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                          Please enter your name to continue.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <button onClick={toStep1}
                      className="w-full mt-8 py-4 rounded-2xl font-medium text-sm tracking-[0.12em] text-ink hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}>
                      Continue →
                    </button>
                  </motion.div>
                )}

                {/* ── STEP 1: Message ── */}
                {step === 1 && (
                  <motion.div key="s1" custom={dir} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                  >
                    <h2 className="font-serif font-light text-cream text-4xl mb-2">Your memory.</h2>
                    <p className="text-cream/30 text-sm mb-8">
                      Share a moment, a lesson, a feeling. There is no wrong answer here.
                    </p>

                    <div className="relative mb-2">
                      <textarea
                        value={message}
                        onChange={e => { setMessage(e.target.value); setMsgErr(false) }}
                        placeholder="Share your memory, your gratitude, your story…"
                        maxLength={1000}
                        rows={8}
                        autoFocus
                        className={`w-full bg-white/[0.04] border text-cream placeholder-cream/18 px-5 py-4 rounded-2xl text-sm leading-[1.85] outline-none transition-all duration-300 resize-none
                          ${msgErr
                            ? 'border-red-500/50 focus:border-red-400/70'
                            : 'border-gold/18 focus:border-gold/50 focus:shadow-[0_0_20px_rgba(212,175,55,0.05)]'
                          }`}
                      />
                      {/* Character count pill */}
                      <div className={`absolute bottom-3 right-3 text-[9px] tracking-wide px-2 py-0.5 rounded-full transition-colors ${
                        message.length > 900 ? 'bg-red-900/40 text-red-300/70' : 'bg-black/30 text-cream/20'
                      }`}>
                        {message.length}/1000
                      </div>
                    </div>
                    <AnimatePresence>
                      {msgErr && (
                        <motion.p className="text-red-400/70 text-xs mb-4"
                          initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                          Please write your memory before continuing.
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => goTo(0)}
                        className="flex-1 border border-white/[0.08] text-cream/30 hover:text-cream/55 hover:border-white/[0.15] py-4 rounded-2xl text-sm transition-all">
                        ← Back
                      </button>
                      <button onClick={toStep2}
                        className="flex-[2] py-4 rounded-2xl font-medium text-sm tracking-[0.12em] text-ink hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] transition-all duration-300"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}>
                        Continue →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Photo ── */}
                {step === 2 && (
                  <motion.div key="s2" custom={dir} variants={variants}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                  >
                    <h2 className="font-serif font-light text-cream text-4xl mb-2">A moment in time.</h2>
                    <p className="text-cream/30 text-sm mb-8">
                      Attach a photo if you have one. Completely optional — your words are enough.
                    </p>

                    {/* Drop zone */}
                    <div {...getRootProps()}
                      className={`relative rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-300 overflow-hidden ${
                        isDragActive
                          ? 'border-gold/60 bg-gold/5 shadow-[0_0_40px_rgba(212,175,55,0.1)]'
                          : 'border-gold/15 hover:border-gold/35 hover:bg-white/[0.02]'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <div className="relative group">
                          <img src={preview} alt="Preview"
                            className="w-full max-h-72 object-cover object-center" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <span className="text-white/0 group-hover:text-white/70 text-xs tracking-widest uppercase transition-all duration-300">
                              Click to change
                            </span>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={e => { e.stopPropagation(); setImageFile(null); setPreview(null) }}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/60 hover:text-white text-xs transition-colors"
                          >✕</button>
                        </div>
                      ) : (
                        <div className="py-16 px-6">
                          <motion.div
                            className="text-gold/18 text-5xl mb-5 select-none"
                            animate={{ y: isDragActive ? -6 : 0 }}
                            transition={{ duration: 0.3 }}
                          >⬆</motion.div>
                          <p className="text-cream/35 text-sm mb-1.5">
                            Drop a photo here, or <span className="text-gold/50 underline cursor-pointer">browse</span>
                          </p>
                          <p className="text-cream/15 text-xs">JPG · PNG · WEBP · Max 5 MB</p>
                        </div>
                      )}
                    </div>

                    {fileErr && (
                      <motion.p className="text-red-400/70 text-xs mt-2"
                        initial={{ opacity:0 }} animate={{ opacity:1 }}>
                        {fileErr}
                      </motion.p>
                    )}

                    {/* Server error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-800/30 flex items-start gap-3"
                          initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        >
                          <span className="text-red-400 text-sm flex-shrink-0">✕</span>
                          <p className="text-red-300/80 text-sm leading-relaxed">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => goTo(1)}
                        className="flex-1 border border-white/[0.08] text-cream/30 hover:text-cream/55 hover:border-white/[0.15] py-4 rounded-2xl text-sm transition-all">
                        ← Back
                      </button>
                      <button onClick={submit} disabled={submitting}
                        className="flex-[2] py-4 rounded-2xl font-medium text-sm tracking-[0.12em] text-ink hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(212,175,55,0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ background: 'linear-gradient(135deg,#D4AF37,#B8952E)' }}>
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              className="w-4 h-4 rounded-full border border-ink/40 border-t-ink inline-block"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                            />
                            Saving memory…
                          </span>
                        ) : 'Submit Memory ✦'}
                      </button>
                    </div>

                    <p className="text-center text-cream/15 text-[10px] tracking-wide mt-5">
                      Your memory is permanently saved and visible to everyone on the main site.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Vertical separator (desktop) */}
            <div className="hidden lg:block absolute left-[42%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

// ── Rotating inspirational quotes ─────────────────────────────────────────────
function RotatingQuote() {
  const quotes = [
    '"Some people don\'t just teach — they change lives."',
    '"A teacher affects eternity."',
    '"The best teachers make you believe in yourself."',
    '"Education, at its best, is an act of love."',
  ]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1) % quotes.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="max-w-xs mx-auto lg:mx-0 min-h-[80px] flex items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="font-serif italic text-cream/30 text-base leading-relaxed text-center lg:text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.7 }}
        >
          {quotes[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
