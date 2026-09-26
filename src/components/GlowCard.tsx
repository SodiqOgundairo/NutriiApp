import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  role?: string
}

function GlowCard({ children, className = '', role }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${Math.round(event.clientX - rect.left)}px`)
    el.style.setProperty('--my', `${Math.round(event.clientY - rect.top)}px`)
  }

  return (
    <div
      ref={ref}
      role={role}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-[20px] border border-white/70 bg-[#fafafa]/40 shadow-[0_12px_40px_rgba(4,94,10,0.08)] backdrop-blur-[28px] backdrop-saturate-150 transition hover:border-(--brand-500) ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(320px_circle_at_var(--mx,50%)_var(--my,50%),rgba(249,247,189,0.3),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-px right-3.5 left-3.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-(--brand-500) to-(--accent-500) transition-transform duration-700 ease group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px right-3.5 left-3.5 h-0.5 origin-right scale-x-0 rounded-full bg-gradient-to-r from-(--brand-500) to-(--accent-500) transition-transform duration-700 ease group-hover:scale-x-100 motion-reduce:transition-none"
      />
      {children}
    </div>
  )
}

export default GlowCard
