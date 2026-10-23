import type { ReactNode } from 'react'

interface SectionHeaderProps {
  id?: string
  /** Section names stay in English (Tops, Bottoms), like the brand's labels */
  title: string
  subtitle: string
  action?: ReactNode
}

export function SectionHeader({ id, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
      <h2 id={id} className="text-[clamp(32px,4vw,60px)] leading-[1.05] font-semibold tracking-[-0.02em]">
        <span dir="ltr" className="[unicode-bidi:isolate]">{title}</span>
        <small className="mt-3 block text-base leading-snug font-medium tracking-normal text-ink-muted">{subtitle}</small>
      </h2>
      {action}
    </div>
  )
}
