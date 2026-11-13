import { useEffect, useId, useRef, useState, type DragEvent, type MouseEvent, type ReactNode } from 'react'
import { ImagePlus, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { cn } from '@/shared/lib/utils'
import type { Localized, Photo } from '@/shared/types/common.types'
import { adminService, errorMessage } from '../services/admin.service'

/** Small building blocks shared by the product and category forms. */

/** Page title with actions. `sticky` keeps it (and its Save button) visible while scrolling. */
export function PageHeader({ title, children, sticky }: { title: string; children?: ReactNode; sticky?: boolean }) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-wrap items-center justify-between gap-3',
        sticky && 'sticky top-14 z-[5] -mx-4 -mt-4 mb-2 bg-surface-soft/95 px-4 py-3 backdrop-blur md:-mx-8 md:-mt-8 md:px-8 md:py-4',
      )}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('grid gap-4 rounded-lg border border-line bg-surface p-4 md:p-6', className)}>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: (id: string) => ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('grid content-start gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}

/** Arabic + English inputs side by side for one piece of copy. */
export function LocalizedField({
  label,
  value,
  onChange,
  multiline,
  required,
}: {
  label: string
  value: Localized
  onChange: (value: Localized) => void
  multiline?: boolean
  required?: boolean
}) {
  const Control = multiline ? Textarea : Input
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={`${label} (عربي)`}>
        {(id) => (
          <Control id={id} dir="rtl" required={required} value={value.ar} onChange={(e) => onChange({ ...value, ar: e.target.value })} />
        )}
      </Field>
      <Field label={`${label} (English)`}>
        {(id) => (
          <Control id={id} dir="ltr" required={required} value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
        )}
      </Field>
    </div>
  )
}

/** Click on the photo to set its focus point: the part that stays visible when it is cropped. */
function focusFromClick(e: MouseEvent<HTMLButtonElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
  return `${x}% ${y}%`
}

/**
 * A photo: uploaded from the device (click or drag & drop), alt text in both languages,
 * and a focus point set by clicking on the preview.
 * The old Cloudinary image is deleted by the API when the form is saved without it.
 */
export function PhotoField({
  value,
  onChange,
  aspect = 'aspect-[4/5]',
}: {
  value: Photo
  onChange: (value: Photo) => void
  aspect?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const requiredRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    requiredRef.current?.setCustomValidity(value.src ? '' : 'ارفع صورة الأول')
  }, [value.src])

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('اختار ملف صورة')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('الصورة أكبر من 10 ميجا')
      return
    }
    setUploading(true)
    try {
      const { src, publicId } = await adminService.uploadImage(file)
      onChange({ ...value, src, publicId })
      toast.success('الصورة اترفعت. متنساش تحفظ.')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const [fx, fy] = (value.focus || '50% 50%').split(' ')

  const dropHandlers = {
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      setDragging(true)
    },
    onDragLeave: () => setDragging(false),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) void upload(file)
    },
  }

  return (
    <div className="grid gap-4 md:grid-cols-[200px_1fr]">
      <div className="relative grid content-start gap-2">
        {value.src ? (
          <button
            type="button"
            title="دوس على الصورة عشان تحدد نقطة التركيز"
            onClick={(e) => onChange({ ...value, focus: focusFromClick(e) })}
            {...dropHandlers}
            className={cn(
              'relative cursor-crosshair overflow-hidden rounded-md border border-line bg-surface-sunken',
              dragging && 'ring-2 ring-ember',
              aspect,
            )}
          >
            <img src={value.src} alt="" className="size-full object-cover" style={{ objectPosition: value.focus || 'center' }} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ember shadow"
              style={{ left: fx, top: fy }}
            />
            {uploading && <span className="absolute inset-0 grid place-items-center bg-surface/70 text-sm">جاري الرفع…</span>}
          </button>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            {...dropHandlers}
            className={cn(
              'grid cursor-pointer place-items-center content-center gap-2 rounded-md border-2 border-dashed border-line-strong bg-surface p-4 text-center text-sm text-ink-muted transition-colors hover:border-forest hover:text-forest',
              dragging && 'border-ember bg-ember-tint text-ember-ink',
              aspect,
            )}
          >
            <ImagePlus className="size-7" />
            {uploading ? 'جاري الرفع…' : 'دوس هنا أو اسحب الصورة'}
          </button>
        )}
        {/* Keeps the form from saving without a photo; the browser points at the upload area. */}
        <input
          ref={requiredRef}
          tabIndex={-1}
          aria-hidden="true"
          value={value.src}
          onChange={() => undefined}
          className="pointer-events-none absolute inset-x-0 top-1/2 h-px opacity-0"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
          }}
        />
        {value.src && (
          <Button type="button" size="sm" variant="secondary" disabled={uploading} onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            {uploading ? 'جاري الرفع…' : 'غيّر الصورة'}
          </Button>
        )}
        {value.src && <p className="text-xs text-ink-muted">دوس على الصورة عشان تحدد الجزء اللي يفضل ظاهر لما تتقص.</p>}
      </div>
      <div className="grid content-start gap-4">
        <LocalizedField label="وصف الصورة (alt)" value={value.alt} onChange={(alt) => onChange({ ...value, alt })} />
      </div>
    </div>
  )
}

/** "Ridge Heavy Hoodie" → "ridge-heavy-hoodie" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
