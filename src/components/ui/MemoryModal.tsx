'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Memory } from '@/types'
import { formatDate } from '@/lib/utils'
import { optimizeCloudinaryUrl } from '@/lib/cloudinary'

interface Props {
  memory: Memory | null
  onClose: () => void
}

export default function MemoryModal({ memory, onClose }: Props) {
  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/92 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Modal box */}
          <motion.div
            className="relative z-10 w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-3xl border border-gold/15 shadow-[0_0_120px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.05)]"
            style={{ background: 'linear-gradient(160deg,#0f1830 0%,#080e1c 100%)' }}
            initial={{ scale: 0.86, y: 32, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all text-sm"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image */}
            {memory.image_url && (
              <div className="relative w-full overflow-hidden rounded-t-3xl" style={{ height: 300 }}>
                <Image
                  src={optimizeCloudinaryUrl(memory.image_url, 900)}
                  alt={memory.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 15%' }}
                  sizes="600px"
                  priority
                />
                {/* Gradient fade into card body */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080e1c] via-[#080e1c]/20 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="px-8 pt-7 pb-10">
              {/* Header: avatar + name + date */}
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-gold text-xl leading-none">
                    {memory.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-gold text-xl leading-tight">{memory.name}</p>
                  {memory.created_at && (
                    <p className="text-gold/35 text-xs tracking-wide mt-0.5">{formatDate(memory.created_at)}</p>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gold/10" />
                <span className="text-gold/25 text-xs tracking-widest uppercase">Memory</span>
                <div className="flex-1 h-px bg-gold/10" />
              </div>

              {/* Full message */}
              <p className="text-cream/70 text-base leading-[1.9] font-light">
                {memory.message}
              </p>

              {/* Bottom accent */}
              <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-3">
                <div className="w-6 h-px bg-gold/20" />
                <span className="text-gold/20 text-lg">✦</span>
                <div className="w-6 h-px bg-gold/20" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
