'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Memory } from '@/types'
import { optimizeCloudinaryUrl } from '@/lib/cloudinary'
import { formatDate } from '@/lib/utils'

interface Props {
  memories: Memory[]
  onClickCard: (m: Memory) => void
  onDeleteCard: (m: Memory) => void
}

const CARD_W   = 300   // px — width of each carousel card
const CARD_GAP = 20    // px — gap between cards
const SPEED    = 0.5   // px per frame — scroll speed

const GRADIENTS = [
  ['#0a1628','#050c18'],
  ['#0a1f14','#050f09'],
  ['#170a28','#0d0518'],
  ['#281208','#160803'],
  ['#081828','#040c18'],
  ['#1a0a1a','#0d050d'],
]
const ACCENTS = [
  'rgba(212,175,55,0.18)',
  'rgba(80,200,120,0.12)',
  'rgba(150,90,220,0.12)',
  'rgba(220,130,50,0.12)',
  'rgba(50,150,220,0.12)',
  'rgba(220,70,110,0.10)',
]

/* ── Mini card for the carousel (self-contained, no break-inside) ──────────── */
function CarouselCard({
  memory, index, onClick, onDelete,
}: { memory: Memory; index: number; onClick: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [c1, c2] = GRADIENTS[index % GRADIENTS.length]
  const accent   = ACCENTS[index % ACCENTS.length]
  const initial  = memory.name?.charAt(0)?.toUpperCase() || '✦'
  const preview  = memory.message.length > 100
    ? memory.message.slice(0, 100).trimEnd() + '…'
    : memory.message

  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.07] cursor-pointer group"
      style={{
        width: CARD_W,
        height: 340,
        background: `linear-gradient(145deg,${c1},${c2})`,
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accent}` : '0 4px 24px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'box-shadow 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        flexDirection: 'column',
        display: 'flex',
        flexShrink: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: 'absolute', top: 0, left: 24, right: 24, height: 1,
          background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 10,
        }}
      />

      {/* Delete btn */}
      {hovered && (
        <button
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 30,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(180,40,40,0.4)',
            color: 'rgba(220,100,100,0.8)', fontSize: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={e => { e.stopPropagation(); onDelete() }}
        >✕</button>
      )}

      {/* Image — top 170px, fills width completely */}
      {memory.image_url ? (
        <div style={{ position: 'relative', width: '100%', height: 170, flexShrink: 0, overflow: 'hidden' }}>
          <Image
            src={optimizeCloudinaryUrl(memory.image_url, 500)}
            alt={memory.name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 15%', transition: 'transform 0.6s ease' }}
            className={hovered ? 'scale-[1.05]' : 'scale-100'}
            sizes={`${CARD_W}px`}
            loading="lazy"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
          {/* Name over image */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 14px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: 11 }}>{initial}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: 15, lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{memory.name}</p>
                {memory.created_at && (
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: '0.05em' }}>
                    {formatDate(memory.created_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No image — avatar header */
        <div style={{ height: 80, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 8px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: `radial-gradient(circle,${accent},rgba(0,0,0,0.35))`,
            border: '1px solid rgba(212,175,55,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: 18 }}>{initial}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'Georgia, serif', color: '#D4AF37', fontSize: 16,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{memory.name}</p>
            {memory.created_at && (
              <p style={{ color: 'rgba(212,175,55,0.3)', fontSize: 9, letterSpacing: '0.05em', marginTop: 2 }}>
                {formatDate(memory.created_at)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Message body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 14px', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ width: 1, height: 10, background: 'rgba(212,175,55,0.3)' }} />
          <span style={{ color: 'rgba(212,175,55,0.3)', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Memory</span>
        </div>
        <p style={{ color: 'rgba(240,234,214,0.65)', fontSize: 12.5, lineHeight: 1.75, flex: 1 }}>{preview}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingTop: 8,
          borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'rgba(212,175,55,0.22)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
            transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s' }}>
            Open →
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Main carousel ────────────────────────────────────────────────────────── */
export default function AutoScrollCarousel({ memories, onClickCard, onDeleteCard }: Props) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const posRef    = useRef(0)
  const rafRef    = useRef<number>(0)
  const paused    = useRef(false)

  // Need at least some cards — duplicate to fill
  const items = memories.length === 0 ? [] :
    memories.length < 6 ? [...memories, ...memories, ...memories] :
    [...memories, ...memories]           // duplicate for seamless loop

  const totalW = items.length * (CARD_W + CARD_GAP)
  const halfW  = (memories.length) * (CARD_W + CARD_GAP)   // half = one full set

  useEffect(() => {
    if (!trackRef.current || items.length === 0) return

    const animate = () => {
      if (!paused.current) {
        posRef.current += SPEED
        // Seamless: once we've scrolled one full set, snap back
        if (posRef.current >= halfW) posRef.current -= halfW
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${posRef.current}px)`
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [halfW, items.length])

  if (memories.length === 0) return null

  return (
    <div className="relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050810] to-transparent z-20 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050810] to-transparent z-20 pointer-events-none" />

      {/* Scroll track */}
      <div
        className="overflow-hidden"
        style={{ cursor: 'grab' }}
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: CARD_GAP,
            width: totalW,
            willChange: 'transform',
            paddingBottom: 8,
          }}
        >
          {items.map((memory, i) => (
            <CarouselCard
              key={`${memory.id}-${i}`}
              memory={memory}
              index={i}
              onClick={() => onClickCard(memory)}
              onDelete={() => onDeleteCard(memory)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
