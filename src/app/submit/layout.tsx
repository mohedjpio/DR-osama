import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Leave a Memory · Dr. Osama El Nahas',
  description: 'Share your memory, your gratitude, your story with Dr. Osama El Nahas.',
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
