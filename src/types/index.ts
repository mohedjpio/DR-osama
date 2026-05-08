// ─── Memory ──────────────────────────────────────────────────────────────────
export interface Memory {
  id: string
  name: string
  message: string
  image_url: string | null
  created_at: string
}

export interface NewMemoryInput {
  name: string
  message: string
  image_url?: string | null
}

// ─── Form State ───────────────────────────────────────────────────────────────
export type FormStep = 0 | 1 | 2

export interface FormState {
  name: string
  message: string
  imageFile: File | null
  imagePreview: string | null
  step: FormStep
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}
