import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Use the SERVICE ROLE key server-side so RLS never blocks the delete ─────
// This key is secret — it is never exposed to the browser.
function getAdminClient() {
  const url    = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !secret) {
    throw new Error('Supabase service role key not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
  }

  return createClient(url, secret, {
    auth: { persistSession: false },
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // ── Basic UUID format check ────────────────────────────────────────────
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Invalid memory ID.' }, { status: 400 })
    }

    // ── Password guard (server-side — never trust the client alone) ────────
    const body = await req.json().catch(() => ({}))
    const ADMIN_PASSWORD = process.env.ADMIN_DELETE_PASSWORD ?? 'Dr@0sama#2026!MemX'

    if (!body.password || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    const supabase = getAdminClient()

    // ── Confirm the row exists first ───────────────────────────────────────
    const { data: existing, error: fetchErr } = await supabase
      .from('memories')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchErr || !existing) {
      return NextResponse.json({ error: 'Memory not found.' }, { status: 404 })
    }

    // ── Hard delete ────────────────────────────────────────────────────────
    const { error: deleteErr } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)

    if (deleteErr) {
      throw new Error(deleteErr.message)
    }

    // ── Verify it's actually gone ──────────────────────────────────────────
    const { data: gone } = await supabase
      .from('memories')
      .select('id')
      .eq('id', id)
      .single()

    if (gone) {
      throw new Error('Delete appeared to succeed but row still exists in database.')
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 })

  } catch (err) {
    console.error('[DELETE /api/memories/:id]', err)
    return NextResponse.json(
      { error: (err as Error).message ?? 'Unexpected server error.' },
      { status: 500 }
    )
  }
}
