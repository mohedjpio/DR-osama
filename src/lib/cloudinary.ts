// ─── Client-side upload via unsigned preset ───────────────────────────────────
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'memories_unsigned'

  if (!cloudName) throw new Error('Cloudinary cloud name not configured.')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'memories')
  // Auto quality + format optimisation
  formData.append('quality', 'auto')
  formData.append('fetch_format', 'auto')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message ?? 'Upload failed')
  }

  const data = await res.json()
  return data.secure_url as string
}

// ─── Optimised URL helper ─────────────────────────────────────────────────────
export function optimizeCloudinaryUrl(url: string, width = 800): string {
  if (!url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
}
