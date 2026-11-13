import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Field, PageHeader, Section } from '../components/form'
import { adminService, errorMessage } from '../services/admin.service'
import type { StoreSettings } from '../types'

const EMPTY: StoreSettings = { whatsappNumber: '', social: { instagram: '', facebook: '', tiktok: '' } }

export function SettingsPage() {
  const queryClient = useQueryClient()
  const settings = useQuery({ queryKey: ['admin', 'settings'], queryFn: adminService.settings })
  const [form, setForm] = useState<StoreSettings>(EMPTY)

  useEffect(() => {
    if (settings.data) setForm({ whatsappNumber: settings.data.whatsappNumber, social: { ...EMPTY.social, ...settings.data.social } })
  }, [settings.data])

  const save = useMutation({
    mutationFn: adminService.saveSettings,
    onSuccess: () => {
      toast.success('الإعدادات اتحفظت')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  const setSocial = (key: keyof StoreSettings['social'], value: string) => setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }))

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate(form)
  }

  if (settings.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (settings.isError) return <p className="text-danger">{errorMessage(settings.error)}</p>

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-6">
      <PageHeader title="الإعدادات">
        <Button type="submit" size="sm" disabled={save.isPending}>
          {save.isPending ? 'جاري الحفظ…' : 'حفظ'}
        </Button>
      </PageHeader>

      <Section title="واتساب">
        <Field
          label="رقم واتساب المتجر"
          hint="الرقم اللي الأوردرات بتتبعتله. اكتبه زي 01001234567 أو 201001234567، وهيتحفظ بكود الدولة."
        >
          {(id) => (
            <Input
              id={id}
              dir="ltr"
              inputMode="tel"
              placeholder="201001234567"
              value={form.whatsappNumber}
              onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
            />
          )}
        </Field>
        {!form.whatsappNumber && (
          <p className="rounded-md bg-ember-tint px-3 py-2 text-sm text-ember-ink">
            من غير رقم، العميل هيشوف «هنتواصل معاك» بدل ما واتساب يفتح بعد الطلب.
          </p>
        )}
      </Section>

      <Section title="السوشيال ميديا">
        <p className="-mt-2 text-sm text-ink-muted">اللينكات دي بتظهر في آخر الصفحة. سيب أي خانة فاضية لو مش عايزها تظهر.</p>
        {(
          [
            ['instagram', 'Instagram', 'https://instagram.com/timberglow'],
            ['tiktok', 'TikTok', 'https://tiktok.com/@timberglow'],
            ['facebook', 'Facebook', 'https://facebook.com/timberglow'],
          ] as const
        ).map(([key, label, placeholder]) => (
          <Field key={key} label={label}>
            {(id) => <Input id={id} dir="ltr" type="url" placeholder={placeholder} value={form.social[key]} onChange={(e) => setSocial(key, e.target.value)} />}
          </Field>
        ))}
      </Section>
    </form>
  )
}
