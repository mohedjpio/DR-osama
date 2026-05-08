import { create } from 'zustand'
import type { Memory } from '@/types'
import { fetchMemories, subscribeToMemories, deleteMemoryById } from '@/lib/supabase'

interface MemoriesStore {
  memories: Memory[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  initialized: boolean

  load: () => Promise<void>
  reload: () => Promise<void>          // force re-fetch (used on tab focus)
  addMemory: (memory: Memory) => void
  removeMemory: (id: string, password: string) => Promise<void>
  removeById: (id: string) => void     // instant local remove (from realtime DELETE)
  setSearch: (query: string) => void
  startRealtimeSync: () => () => void
  filtered: () => Memory[]
}

export const useMemoriesStore = create<MemoriesStore>((set, get) => ({
  memories: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  initialized: false,

  load: async () => {
    if (get().initialized) return
    set({ isLoading: true, error: null })
    try {
      const memories = await fetchMemories()
      set({ memories, isLoading: false, initialized: true })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  // Force re-fetch — called when window regains focus (user returns from /submit)
  reload: async () => {
    set({ isLoading: true })
    try {
      const memories = await fetchMemories()
      set({ memories, isLoading: false, initialized: true })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  // Add only if not already present (prevents duplicate from realtime + optimistic)
  addMemory: (memory) =>
    set((state) => {
      if (state.memories.some((m) => m.id === memory.id)) return state
      return { memories: [memory, ...state.memories] }
    }),

  removeMemory: async (id: string, password: string) => {
    await deleteMemoryById(id, password)
    set((state) => ({ memories: state.memories.filter((m) => m.id !== id) }))
  },

  // Instant local remove triggered by realtime DELETE event
  removeById: (id: string) =>
    set((state) => ({ memories: state.memories.filter((m) => m.id !== id) })),

  setSearch: (query) => set({ searchQuery: query }),

  startRealtimeSync: () => {
    const channel = subscribeToMemories(
      (newMemory) => get().addMemory(newMemory),   // INSERT
      (id) => get().removeById(id),                // DELETE — updates gallery instantly
    )
    return () => { channel.unsubscribe() }
  },

  filtered: () => {
    const { memories, searchQuery } = get()
    if (!searchQuery.trim()) return memories
    const q = searchQuery.toLowerCase()
    return memories.filter(
      (m) => m.name.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
    )
  },
}))
