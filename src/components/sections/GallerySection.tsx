'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemoriesStore } from '@/store/memoriesStore'
import type { Memory } from '@/types'
import MemoryCard from '@/components/ui/MemoryCard'
import MemoryModal from '@/components/ui/MemoryModal'
import DeleteModal from '@/components/ui/DeleteModal'
import AutoScrollCarousel from '@/components/ui/AutoScrollCarousel'

const PAGE_SIZE = 12
type ViewMode  = 'grid' | 'list'
type SortMode  = 'newest' | 'oldest'
type FilterTab = 'all' | 'photo' | 'written'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="skeleton rounded-2xl" style={{ height: 420 }} />
      ))}
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="skeleton rounded-2xl h-[120px]" />
      ))}
    </div>
  )
}

function SkeletonCarousel() {
  return (
    <div className="flex gap-5 overflow-hidden pb-2">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton rounded-2xl flex-shrink-0" style={{ width: 300, height: 340 }} />
      ))}
    </div>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div className="text-center py-32" initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <p className="font-serif text-gold/15 text-5xl mb-5">✦</p>
      <p className="font-serif text-cream/20 text-2xl mb-2">
        {query ? `No results for "${query}"` : 'No memories yet.'}
      </p>
      <p className="text-cream/10 text-sm">
        {query ? 'Try a different search.' : 'Be the first to leave one below.'}
      </p>
    </motion.div>
  )
}

function GridIcon({ active }: { active: boolean }) {
  const c = active ? 'rgba(212,175,55,0.85)' : 'rgba(240,234,214,0.25)'
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={c} />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill={c} />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill={c} />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill={c} />
    </svg>
  )
}

function ListIcon({ active }: { active: boolean }) {
  const c = active ? 'rgba(212,175,55,0.85)' : 'rgba(240,234,214,0.25)'
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2"  width="14" height="3.5" rx="1.5" fill={c} />
      <rect x="1" y="7"  width="14" height="3.5" rx="1.5" fill={c} />
      <rect x="1" y="12" width="14" height="3.5" rx="1.5" fill={c} />
    </svg>
  )
}

export default function GallerySection() {
  const { isLoading, setSearch, searchQuery, filtered } = useMemoriesStore()
  const [view,   setView]   = useState<ViewMode>('grid')
  const [sort,   setSort]   = useState<SortMode>('newest')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [page,   setPage]   = useState(1)
  const [selected, setSelected] = useState<Memory | null>(null)
  const [toDelete, setToDelete] = useState<Memory | null>(null)

  const handleSearch = (q: string) => { setSearch(q); setPage(1) }
  const handleFilter = (f: FilterTab) => { setFilter(f); setPage(1) }
  const handleSort   = (s: SortMode) => { setSort(s);   setPage(1) }

  const base = filtered()

  const processed = useMemo(() => {
    let list = [...base]
    if (filter === 'photo')   list = list.filter(m => !!m.image_url)
    if (filter === 'written') list = list.filter(m => !m.image_url)
    if (sort === 'oldest')    list = [...list].reverse()
    return list
  }, [base, filter, sort])

  const total      = processed.length
  const paginated  = processed.slice(0, page * PAGE_SIZE)
  const hasMore    = page < Math.ceil(total / PAGE_SIZE)

  const FILTER_TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all',     label: 'All',     count: base.length },
    { key: 'photo',   label: 'Photos',  count: base.filter(m => !!m.image_url).length },
    { key: 'written', label: 'Written', count: base.filter(m => !m.image_url).length },
  ]

  return (
    <section
      id="gallery"
      className="relative z-10 py-32"
      style={{ background: 'linear-gradient(180deg,#050810 0%,#060a14 50%,#0a0f1e 100%)' }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />

      {/* ── HEADER ── */}
      <div className="text-center mb-12 px-6">
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/45 text-[10px] tracking-[0.55em] uppercase">Their Words</span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <h2 className="font-serif font-light text-cream text-4xl lg:text-6xl mb-4 leading-tight">
          A Gallery of<br /><em className="text-gold not-italic">Memories</em>
        </h2>
        <p className="text-cream/28 text-sm max-w-md mx-auto leading-relaxed">
          Every word here is a thread of love, woven by students who were changed forever.
        </p>
      </div>

      {/* ── AUTO-SCROLL CAROUSEL ── */}
      <div className="mb-16 px-0">
        {isLoading ? (
          <div className="px-6"><SkeletonCarousel /></div>
        ) : base.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-5 px-6">
              <div className="w-4 h-px bg-gold/30" />
              <p className="text-gold/35 text-[9px] tracking-[0.4em] uppercase">Live scroll — hover to pause</p>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-gold/40"
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <AutoScrollCarousel
              memories={base}
              onClickCard={setSelected}
              onDeleteCard={setToDelete}
            />
          </>
        ) : null}
      </div>

      {/* ── DIVIDER ── */}
      {base.length > 0 && (
        <div className="flex items-center gap-4 mb-12 px-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/12" />
          <span className="text-gold/20 text-xs tracking-widest uppercase">Browse All</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/12" />
        </div>
      )}

      {/* ── CONTROLS ── */}
      <div className="px-6 max-w-6xl mx-auto mb-10 space-y-5">

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/28 pointer-events-none text-base select-none">⌕</span>
          <input
            type="text"
            placeholder="Search by name or message…"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-gold/12 hover:border-gold/22 focus:border-gold/45 text-cream placeholder-cream/18 pl-12 pr-10 py-3.5 rounded-2xl text-sm outline-none transition-all duration-300"
          />
          {searchQuery && (
            <button onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/30 hover:text-gold/60 text-sm transition-colors">✕</button>
          )}
        </div>

        {/* Filter + Sort + View */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-1">
            {FILTER_TABS.map(tab => (
              <button key={tab.key} onClick={() => handleFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-[10px] tracking-widest uppercase transition-all ${
                  filter === tab.key
                    ? 'bg-gold/12 text-gold border border-gold/20'
                    : 'text-cream/30 hover:text-cream/55'
                }`}>
                {tab.label}
                <span className={`ml-1.5 text-[9px] ${filter === tab.key ? 'text-gold/60' : 'text-cream/18'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => handleSort(e.target.value as SortMode)}
              className="bg-white/[0.02] border border-white/[0.05] text-cream/35 text-[10px] tracking-wide px-3 py-2 rounded-xl outline-none cursor-pointer hover:border-gold/18 transition-colors">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] rounded-xl p-1">
              {(['grid','list'] as ViewMode[]).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    view === v ? 'bg-gold/12 border border-gold/18' : 'hover:bg-white/[0.03]'
                  }`} title={`${v} view`}>
                  {v === 'grid' ? <GridIcon active={view === 'grid'} /> : <ListIcon active={view === 'list'} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gold/20 text-[10px] tracking-widest">
          {total === 0 ? 'No memories found'
            : `Showing ${Math.min(page * PAGE_SIZE, total)} of ${total} ${total === 1 ? 'memory' : 'memories'}`}
        </p>
      </div>

      {/* ── GRID / LIST ── */}
      <div className="px-6 max-w-6xl mx-auto">
        {isLoading ? (
          view === 'grid' ? <SkeletonGrid /> : <SkeletonList />
        ) : total === 0 ? (
          <EmptyState query={searchQuery} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {view === 'grid' ? (
                <motion.div key="grid"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  {paginated.map((m, i) => (
                    <MemoryCard key={m.id} memory={m} onClick={setSelected} onDelete={setToDelete} index={i} view="grid" />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="list"
                  className="space-y-3 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  {paginated.map((m, i) => (
                    <MemoryCard key={m.id} memory={m} onClick={setSelected} onDelete={setToDelete} index={i} view="list" />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-12">
                <p className="text-cream/18 text-xs mb-4 tracking-widest">
                  {total - page * PAGE_SIZE} more waiting
                </p>
                <motion.button
                  onClick={() => setPage(p => p + 1)}
                  className="relative group px-10 py-4 rounded-2xl border border-gold/18 text-gold/50 text-sm tracking-[0.15em] uppercase overflow-hidden transition-all hover:border-gold/45 hover:text-gold"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/7 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Load more memories
                </motion.button>
              </div>
            )}

            {!hasMore && total > PAGE_SIZE && (
              <div className="text-center mt-12">
                <div className="inline-flex items-center gap-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/18" />
                  <span className="text-gold/18 text-[9px] tracking-widest uppercase">All memories shown</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/18" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <MemoryModal memory={selected} onClose={() => setSelected(null)} />
      <DeleteModal memory={toDelete} onClose={() => setToDelete(null)} />
    </section>
  )
}
