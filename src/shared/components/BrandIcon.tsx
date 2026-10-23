import type { SVGProps } from 'react'
import { cn } from '@/shared/lib/utils'

/** Line icons drawn for Timber Glow (copied from the homepage design). UI icons come from lucide-react. */
const PATHS = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  truck: (
    <>
      <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
  swap: <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />,
  cash: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2.5" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  leaf: <path d="M5 19c0-8 5-13 14-13 0 9-5 13-11 13H5zM5 19l7-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.6 2.4 4.3 5 4.5" />,
  facebook: (
    <path d="M14.5 21v-8h3l.5-3.5h-3.5V7.6c0-1 .4-1.6 1.7-1.6H18V3a20 20 0 0 0-2.6-.2c-2.6 0-4.3 1.6-4.3 4.4v2.3H8V13h3.1v8" />
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.2-4A8 8 0 1 1 8.4 19z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-.9.9c-1.3-.5-2.4-1.6-2.9-2.9l.9-.9-1-2z" />
    </>
  ),
} as const

export type BrandIconName = keyof typeof PATHS

interface BrandIconProps extends SVGProps<SVGSVGElement> {
  name: BrandIconName
  /** Mirror in RTL (for arrows that point "forward") */
  directional?: boolean
}

export function BrandIcon({ name, directional, className, strokeWidth = 1.75, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(directional && 'icon-dir', className)}
      {...props}
    >
      {PATHS[name]}
    </svg>
  )
}
