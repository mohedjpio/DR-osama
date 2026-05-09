import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url    = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !secret) throw new Error('Supabase service role key not configured.')
  return createClient(url, secret, { auth: { persistSession: false } })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Invalid memory ID.' }, { status: 400 })
    }

    let body: { password?: string } = {}
    try { body = await req.json() } catch { /* empty body */ }

    const ADMIN_PASSWORD = process.env.ADMIN_DELETE_PASSWORD ?? 'Dr@0sama#2026!MemX'
    if (!body.password || body.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    const supabase = getAdminClient()

    const { data: existing } = await supabase
      .from('memories').select('id').eq('id', id).single()
    if (!existing) {
      return NextResponse.json({ error: 'Memory not found.' }, { status: 404 })
    }

    const { error: deleteErr } = await supabase.from('memories').delete().eq('id', id)
    if (deleteErr) throw new Error(deleteErr.message)

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
