import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Images only' }, { status: 415 })

    const cloudName  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey     = process.env.CLOUDINARY_API_KEY
    const apiSecret  = process.env.CLOUDINARY_API_SECRET
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const str = `folder=memories&timestamp=${timestamp}${apiSecret}`
    const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(str))
    const signature = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('')

    const upload = new FormData()
    upload.append('file', file)
    upload.append('api_key', apiKey)
    upload.append('timestamp', String(timestamp))
    upload.append('signature', signature)
    upload.append('folder', 'memories')
    upload.append('quality', 'auto')
    upload.append('fetch_format', 'auto')

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: upload })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error?.message ?? 'Cloudinary upload failed')
    }
    const result = await res.json()
    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
