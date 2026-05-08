import { createClient } from '@supabase/supabase-js'
import type { Memory, NewMemoryInput } from '@/types'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Fetch all memories ───────────────────────────────────────────────────────
export async function fetchMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Memory[]
}

// ─── Insert a new memory ─────────────────────────────────────────────────────
export async function insertMemory(input: NewMemoryInput): Promise<Memory> {
  const { data, error } = await supabase
    .from('memories')
    .insert([input])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Memory
}

// ─── Delete a memory — goes through the server API route ─────────────────────
export async function deleteMemoryById(id: string, password: string): Promise<void> {
  const res = await fetch(`/api/memories/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error ?? `Delete failed (${res.status})`)
  if (json.deletedId !== id) throw new Error('Server returned unexpected delete confirmation.')
}

// ─── Realtime — listen for INSERT and DELETE ──────────────────────────────────
export function subscribeToMemories(
  onInsert: (memory: Memory) => void,
  onDelete?: (id: string) => void,
) {
  return supabase
    .channel('memories-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'memories' },
      (payload) => onInsert(payload.new as Memory)
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'memories' },
      (payload) => onDelete?.(payload.old.id as string)
    )
    .subscribe()
}
