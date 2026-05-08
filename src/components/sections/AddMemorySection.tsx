import MultiStepForm from '@/components/forms/MultiStepForm'

export default function AddMemorySection() {
  return (
    <section
      id="add-memory"
      className="relative z-10 py-32 px-6"
      style={{ background: 'linear-gradient(180deg, #060a14 0%, #050810 100%)' }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/12 to-transparent" />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/50 text-[10px] tracking-[0.5em] uppercase">Your Turn</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h2 className="font-serif font-light text-cream text-4xl lg:text-5xl mb-4 leading-tight">
            Leave a Memory
          </h2>
          <p className="text-cream/35 text-sm leading-relaxed max-w-sm mx-auto">
            Every word of gratitude is a thread in a tapestry that will outlast any of us.
          </p>
        </div>

        <MultiStepForm />
      </div>
    </section>
  )
}
