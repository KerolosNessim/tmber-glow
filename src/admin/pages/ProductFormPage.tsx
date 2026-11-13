import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { ALL_SIZES } from '@/features/catalog/constants/catalog.constants'
import type { Size } from '@/features/catalog/types/catalog.types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import { TabBar, TabPanel, useInvalidTabSwitch, type TabDef } from '../components/FormTabs'
import { Field, LocalizedField, PageHeader, PhotoField, Section, slugify } from '../components/form'
import { adminService, errorMessage } from '../services/admin.service'
import type { ProductInput } from '../types'

const NO_BADGE = 'none'

type TabId = 'basics' | 'pricing' | 'stock' | 'photo'

const TABS: TabDef<TabId>[] = [
  { id: 'basics', label: 'البيانات' },
  { id: 'pricing', label: 'السعر والمواصفات' },
  { id: 'stock', label: 'المخزون' },
  { id: 'photo', label: 'الصورة' },
]

const EMPTY: ProductInput = {
  id: '',
  categorySlug: '',
  name: { ar: '', en: '' },
  color: '',
  swatch: '#d8cdb4',
  family: '',
  gsm: 320,
  price: 0,
  compareAtPrice: null,
  photo: { src: '', alt: { ar: '', en: '' }, focus: '50% 30%' },
  gallery: [],
  stock: ALL_SIZES.map((size) => ({ size, qty: 0 })),
  badge: null,
  isActive: true,
}

/** Add (/admin/products/new) or edit (/admin/products/:id) a product. */
export function ProductFormPage() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const product = useQuery({ queryKey: ['admin', 'product', id], queryFn: () => adminService.product(id!), enabled: !isNew })
  const categories = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminService.categories })

  const [form, setForm] = useState<ProductInput>(EMPTY)
  const [tab, setTab] = useState<TabId>('basics')
  const onInvalid = useInvalidTabSwitch(TABS, setTab)
  const [idTouched, setIdTouched] = useState(false)

  useEffect(() => {
    if (product.data) {
      const { order: _o, updatedAt: _u, ...rest } = product.data
      setForm({ ...EMPTY, ...rest, family: rest.family ?? '' })
    }
  }, [product.data])

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((f) => ({ ...f, [key]: value }))

  const save = useMutation({
    mutationFn: (input: ProductInput) => (isNew ? adminService.createProduct(input) : adminService.updateProduct(id!, input)),
    onSuccess: () => {
      toast.success(isNew ? 'المنتج اتضاف' : 'التعديلات اتحفظت')
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      navigate('/admin/products')
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.categorySlug) {
      setTab('basics')
      toast.error('اختار القسم')
      return
    }
    save.mutate({ ...form, family: form.family || undefined, compareAtPrice: form.compareAtPrice || null })
  }

  // Stock: a size is offered when it has a row; unchecking removes the row.
  const stockOf = (size: Size) => form.stock.find((s) => s.size === size)
  const toggleSize = (size: Size, on: boolean) =>
    set(
      'stock',
      on ? ALL_SIZES.filter((s) => s === size || stockOf(s)).map((s) => stockOf(s) ?? { size: s, qty: 0 }) : form.stock.filter((s) => s.size !== size),
    )
  const setQty = (size: Size, qty: number) => set('stock', form.stock.map((s) => (s.size === size ? { ...s, qty } : s)))

  if (!isNew && product.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (!isNew && product.isError) return <p className="text-danger">{errorMessage(product.error)}</p>

  return (
    <form onSubmit={onSubmit} onInvalidCapture={onInvalid} className="grid max-w-4xl gap-6">
      <PageHeader sticky title={isNew ? 'منتج جديد' : form.name.ar || 'تعديل المنتج'}>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/products">
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
          onChange={(name) => {
            setForm((f) => ({ ...f, name, ...(isNew && !idTouched && { id: slugify(name.en) }) }))
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="القسم">
            {(fieldId) => (
              <Select value={form.categorySlug} onValueChange={(v) => set('categorySlug', v)}>
                <SelectTrigger id={fieldId} className="w-full">
                  <SelectValue placeholder="اختار القسم" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {categories.data?.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name.ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
          <Field label="المعرّف في الرابط (id)" hint={isNew ? 'بيتعمل من الاسم الإنجليزي، ومينفعش يتغير بعد الحفظ' : 'مينفعش يتغير بعد الحفظ'}>
            {(fieldId) => (
              <Input
                id={fieldId}
                dir="ltr"
                required
                disabled={!isNew}
                value={form.id}
                onChange={(e) => {
                  setIdTouched(true)
                  set('id', slugify(e.target.value))
                }}
              />
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

      <TabPanel id="pricing" active={tab}>
      <Section title="السعر والمواصفات">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="السعر (جنيه)">
            {(fieldId) => (
              <Input id={fieldId} type="number" min={0} required value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
            )}
          </Field>
          <Field label="السعر قبل الخصم" hint="اتركه فاضي لو مفيش خصم">
            {(fieldId) => (
              <Input
                id={fieldId}
                type="number"
                min={0}
                value={form.compareAtPrice ?? ''}
                onChange={(e) => set('compareAtPrice', e.target.value ? Number(e.target.value) : null)}
              />
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
          <Field label="اسم اللون" hint="بيظهر بالإنجليزي، مثال: OAT">
            {(fieldId) => <Input id={fieldId} dir="ltr" required value={form.color} onChange={(e) => set('color', e.target.value.toUpperCase())} />}
          </Field>
          <Field label="لون الدايرة">
            {(fieldId) => (
              <div className="flex gap-2">
                <input
                  type="color"
                  aria-label="اختار اللون"
                  value={/^#[0-9a-f]{6}$/i.test(form.swatch) ? form.swatch : '#000000'}
                  onChange={(e) => set('swatch', e.target.value)}
                  className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-input"
                />
                <Input id={fieldId} dir="ltr" required value={form.swatch} onChange={(e) => set('swatch', e.target.value)} />
              </div>
            )}
          </Field>
          <Field label="العيلة (family)" hint="نفس الموديل بألوان تانية">
            {(fieldId) => <Input id={fieldId} dir="ltr" value={form.family ?? ''} onChange={(e) => set('family', slugify(e.target.value))} />}
          </Field>
          <Field label="الوزن (GSM)">
            {(fieldId) => <Input id={fieldId} type="number" min={1} required value={form.gsm} onChange={(e) => set('gsm', Number(e.target.value))} />}
          </Field>
        </div>
      </Section>
      </TabPanel>

      <TabPanel id="stock" active={tab}>
      <Section title="المقاسات والمخزون">
        <p className="-mt-2 text-sm text-ink-muted">علّم المقاسات المتاحة واكتب الكمية. المقاس اللي كميته صفر بيظهر «خلص» في المتجر.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ALL_SIZES.map((size) => {
            const row = stockOf(size)
            return (
              <div key={size} className="grid gap-2 rounded-md border border-line p-3">
                <label className="flex cursor-pointer items-center gap-2 font-semibold">
                  <input type="checkbox" checked={!!row} onChange={(e) => toggleSize(size, e.target.checked)} className="size-4 accent-forest" />
                  <span className="spec text-sm">{size}</span>
                </label>
                <Input
                  type="number"
                  min={0}
                  aria-label={`كمية مقاس ${size}`}
                  disabled={!row}
                  value={row?.qty ?? ''}
                  onChange={(e) => setQty(size, Math.max(0, Number(e.target.value)))}
                />
              </div>
            )
          })}
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
