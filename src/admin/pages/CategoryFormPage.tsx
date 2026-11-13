import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import { TabBar, TabPanel, useInvalidTabSwitch, type TabDef } from '../components/FormTabs'
import { Field, LocalizedField, PageHeader, PhotoField, Section, slugify } from '../components/form'
import { adminService, errorMessage } from '../services/admin.service'
import type { CategoryInput } from '../types'

const NO_BADGE = 'none'

type TabId = 'basics' | 'photo'

const TABS: TabDef<TabId>[] = [
  { id: 'basics', label: 'البيانات' },
  { id: 'photo', label: 'الصورة' },
]

const EMPTY: CategoryInput = {
  id: '',
  slug: '',
  group: 'tops',
  name: { ar: '', en: '' },
  description: { ar: '', en: '' },
  photo: { src: '', alt: { ar: '', en: '' }, focus: '50% 25%' },
  styles: 0,
  badge: null,
  isActive: true,
}

/** Add (/admin/categories/new) or edit (/admin/categories/:id) a category. */
export function CategoryFormPage() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const category = useQuery({ queryKey: ['admin', 'category', id], queryFn: () => adminService.category(id!), enabled: !isNew })
  const [form, setForm] = useState<CategoryInput>(EMPTY)
  const [tab, setTab] = useState<TabId>('basics')
  const onInvalid = useInvalidTabSwitch(TABS, setTab)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (category.data) {
      const { order: _o, productCount: _p, ...rest } = category.data
      setForm({ ...EMPTY, ...rest })
    }
  }, [category.data])

  const set = <K extends keyof CategoryInput>(key: K, value: CategoryInput[K]) => setForm((f) => ({ ...f, [key]: value }))

  const save = useMutation({
    mutationFn: (input: CategoryInput) => {
      const { id: _id, ...body } = input
      return isNew ? adminService.createCategory(body as CategoryInput) : adminService.updateCategory(id!, input)
    },
    onSuccess: () => {
      toast.success(isNew ? 'القسم اتضاف' : 'التعديلات اتحفظت')
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      navigate('/admin/categories')
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate(form)
  }

  if (!isNew && category.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (!isNew && category.isError) return <p className="text-danger">{errorMessage(category.error)}</p>

  return (
    <form onSubmit={onSubmit} onInvalidCapture={onInvalid} className="grid max-w-4xl gap-6">
      <PageHeader sticky title={isNew ? 'قسم جديد' : form.name.ar || 'تعديل القسم'}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/categories">
            <ArrowRight className="icon-dir" />
            رجوع
          </Link>
        </Button>
        <Button type="submit" size="sm" disabled={save.isPending}>
          {save.isPending ? 'جاري الحفظ…' : 'حفظ'}
        </Button>
      </PageHeader>

      <TabBar tabs={TABS} value={tab} onChange={setTab} />

      <TabPanel id="basics" active={tab}>
      <Section title="البيانات الأساسية">
        <LocalizedField
          label="الاسم"
          required
          value={form.name}
          onChange={(name) => setForm((f) => ({ ...f, name, ...(isNew && !slugTouched && { slug: slugify(name.en) }) }))}
        />
        <LocalizedField label="الوصف" multiline value={form.description} onChange={(description) => set('description', description)} />
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="الرابط (slug)" hint={`/collections/${form.slug || '…'}`} className="sm:col-span-2">
            {(fieldId) => (
              <Input
                id={fieldId}
                dir="ltr"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug', slugify(e.target.value))
                }}
              />
            )}
          </Field>
          <Field label="المجموعة">
            {(fieldId) => (
              <Select value={form.group} onValueChange={(v) => set('group', v as CategoryInput['group'])}>
                <SelectTrigger id={fieldId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="tops">فوق (هوديز وتيشيرتات)</SelectItem>
                  <SelectItem value="bottoms">تحت (بناطيل)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>
          <Field label="الشارة">
            {(fieldId) => (
              <Select value={form.badge ?? NO_BADGE} onValueChange={(v) => set('badge', v === NO_BADGE ? null : (v as 'new' | 'bestseller'))}>
                <SelectTrigger id={fieldId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value={NO_BADGE}>من غير</SelectItem>
                  <SelectItem value="new">جديد</SelectItem>
                  <SelectItem value="bestseller">الأكثر مبيعاً</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="عدد الموديلات" hint="الرقم اللي بيظهر على كارت القسم">
            {(fieldId) => (
              <Input id={fieldId} type="number" min={0} value={form.styles} onChange={(e) => set('styles', Number(e.target.value))} />
            )}
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="active" checked={form.isActive} onCheckedChange={(v) => set('isActive', v)} />
          <label htmlFor="active" className="cursor-pointer">
            ظاهر في المتجر
          </label>
        </div>
      </Section>
      </TabPanel>

      <TabPanel id="photo" active={tab}>
      <Section title="الصورة">
        <PhotoField value={form.photo} onChange={(photo) => set('photo', photo)} />
      </Section>
      </TabPanel>

    </form>
  )
}
