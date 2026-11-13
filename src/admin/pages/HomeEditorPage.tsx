import { useEffect, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import type { HeroSlide, HomeContent, Hotspot, LookbookPost, Perk, PerkIcon } from '@/features/home/types/home.types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Field, LocalizedField, PageHeader, PhotoField, Section } from '../components/form'
import { ListEditor, newId } from '../components/ListEditor'
import { TabBar, TabPanel, useInvalidTabSwitch, type TabDef } from '../components/FormTabs'
import { adminService, errorMessage } from '../services/admin.service'

const EMPTY_PHOTO = { src: '', alt: { ar: '', en: '' }, focus: '50% 30%' }
const EMPTY_TEXT = { ar: '', en: '' }

const PERK_ICONS: { value: PerkIcon; label: string }[] = [
  { value: 'truck', label: 'عربية شحن' },
  { value: 'swap', label: 'استبدال' },
  { value: 'cash', label: 'فلوس' },
  { value: 'leaf', label: 'ورقة شجر' },
]

type SectionId = 'slides' | 'perks' | 'intro' | 'look' | 'lookbook'

/** Labels used when a missing field sends the admin to its tab. */
const SECTIONS: TabDef<SectionId>[] = [
  { id: 'slides', label: 'السلايدر' },
  { id: 'perks', label: 'المميزات' },
  { id: 'intro', label: 'المقدمة' },
  { id: 'look', label: 'الطقم' },
  { id: 'lookbook', label: 'انستجرام' },
]

const TITLE_HINT = 'حط الكلمة اللي عايزها تتلوّن بين نجمتين، زي: كولكشن الشتا *نزل*'

function NumberInput({ value, onChange, ...props }: { value: number; onChange: (n: number) => void } & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'>) {
  return <Input type="number" value={Number.isFinite(value) ? value : ''} onChange={(e) => onChange(Number(e.target.value))} {...props} />
}

/** Everything on the store's home page, in both languages. */
export function HomeEditorPage() {
  const queryClient = useQueryClient()
  const home = useQuery({ queryKey: ['admin', 'home'], queryFn: adminService.home })
  const products = useQuery({ queryKey: ['admin', 'products'], queryFn: () => adminService.products() })
  const [form, setForm] = useState<HomeContent | null>(null)
  const [params, setParams] = useSearchParams()
  const tab: SectionId = SECTIONS.find((x) => x.id === params.get('section'))?.id ?? 'slides'
  const setTab = (id: SectionId) => setParams({ section: id }, { replace: true })
  const onInvalid = useInvalidTabSwitch(SECTIONS, setTab)

  useEffect(() => {
    if (home.data) setForm(home.data)
  }, [home.data])

  const save = useMutation({
    mutationFn: adminService.saveHome,
    onSuccess: () => {
      toast.success('الصفحة الرئيسية اتحفظت')
      void queryClient.invalidateQueries({ queryKey: ['admin', 'home'] })
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  if (home.isPending) return <p className="text-ink-muted">جاري التحميل…</p>
  if (home.isError) return <p className="text-danger">{errorMessage(home.error)}</p>
  if (!form) return <p className="text-ink-muted">مفيش محتوى للصفحة الرئيسية. شغّل npm run seed في الـ API.</p>

  const set = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => setForm((f) => f && { ...f, [key]: value })
  const look = form.look
  const setLook = (patch: Partial<HomeContent['look']>) => set('look', { ...look, ...patch })
  const productName = (id: string) => products.data?.find((p) => p.id === id)?.name.ar ?? id

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (form) save.mutate(form)
  }

  return (
    <form onSubmit={onSubmit} onInvalidCapture={onInvalid} className="grid max-w-4xl gap-6">
      <PageHeader sticky title="الصفحة الرئيسية">
        <Button asChild variant="ghost" size="sm">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            شوف الصفحة
          </a>
        </Button>
        <Button type="submit" size="sm" disabled={save.isPending}>
          {save.isPending ? 'جاري الحفظ…' : 'حفظ'}
        </Button>
      </PageHeader>

      <TabBar
        tabs={[
          { id: 'slides', label: 'السلايدر', count: form.slides.length },
          { id: 'perks', label: 'المميزات', count: form.perks.length },
          { id: 'intro', label: 'المقدمة' },
          { id: 'look', label: 'الطقم' },
          { id: 'lookbook', label: 'انستجرام', count: form.lookbook.posts.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      <TabPanel id="slides" active={tab}>
      <Section title="السلايدر (أول الصفحة)">
        <ListEditor<HeroSlide>
          items={form.slides}
          onChange={(slides) => set('slides', slides)}
          min={1}
          addLabel="سلايد جديد"
          thumbnail={(s) => s.photo.src}
          itemTitle={(s, i) => `سلايد ${i + 1}${s.title.ar ? `: ${s.title.ar.replace(/\*/g, '')}` : ''}`}
          create={() => ({
            id: newId(),
            photo: EMPTY_PHOTO,
            eyebrow: { kind: 'new' },
            title: EMPTY_TEXT,
            body: EMPTY_TEXT,
            cta: { label: { ar: 'شوف الكولكشن', en: 'Shop the collection' }, to: '/collections' },
          })}
          renderItem={(slide, update) => (
            <>
              <PhotoField value={slide.photo} onChange={(photo) => update({ ...slide, photo })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الشارة فوق العنوان">
                  {(id) => (
                    <Select
                      value={slide.eyebrow.kind}
                      onValueChange={(kind) =>
                        update({ ...slide, eyebrow: kind === 'new' ? { kind: 'new' } : { kind: 'spec', text: 'WINTER 26 · 320 GSM' } })
                      }
                    >
                      <SelectTrigger id={id} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="new">كلمة «جديد»</SelectItem>
                        <SelectItem value="spec">نص مواصفات</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                {slide.eyebrow.kind === 'spec' && (
                  <Field label="نص المواصفات" hint="بالإنجليزي، زي WASHED · 360 GSM">
                    {(id) => (
                      <Input
                        id={id}
                        dir="ltr"
                        value={slide.eyebrow.kind === 'spec' ? slide.eyebrow.text : ''}
                        onChange={(e) => update({ ...slide, eyebrow: { kind: 'spec', text: e.target.value } })}
                      />
                    )}
                  </Field>
                )}
              </div>
              <LocalizedField label="العنوان" value={slide.title} onChange={(title) => update({ ...slide, title })} />
              <p className="-mt-2 text-xs text-ink-muted">{TITLE_HINT}</p>
              <LocalizedField label="الوصف" multiline value={slide.body} onChange={(body) => update({ ...slide, body })} />
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <LocalizedField label="نص الزرار" value={slide.cta.label} onChange={(label) => update({ ...slide, cta: { ...slide.cta, label } })} />
                <Field label="الزرار بيودّي على" hint="زي /collections/oversize">
                  {(id) => <Input id={id} dir="ltr" value={slide.cta.to} onChange={(e) => update({ ...slide, cta: { ...slide.cta, to: e.target.value } })} />}
                </Field>
              </div>
            </>
          )}
        />
      </Section>
      </TabPanel>

      <TabPanel id="perks" active={tab}>
      <Section title="المميزات (الشريط تحت السلايدر)">
        <ListEditor<Perk>
          items={form.perks}
          onChange={(perks) => set('perks', perks)}
          max={6}
          addLabel="ميزة جديدة"
          itemTitle={(p, i) => p.title.ar || `ميزة ${i + 1}`}
          create={() => ({ id: newId(), icon: 'truck', title: EMPTY_TEXT, text: EMPTY_TEXT })}
          renderItem={(perk, update) => (
            <>
              <Field label="الأيقونة" className="max-w-60">
                {(id) => (
                  <Select value={perk.icon} onValueChange={(icon) => update({ ...perk, icon: icon as PerkIcon })}>
                    <SelectTrigger id={id} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      {PERK_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
              <LocalizedField label="العنوان" value={perk.title} onChange={(title) => update({ ...perk, title })} />
              <LocalizedField label="النص" value={perk.text} onChange={(text) => update({ ...perk, text })} />
            </>
          )}
        />
      </Section>
      </TabPanel>

      <TabPanel id="intro" active={tab}>
      <Section title="مقدمة الأقسام">
        <Field label="سطر المواصفات" hint="بالإنجليزي، زي 100% COTTON · BRUSHED FLEECE">
          {(id) => <Input id={id} dir="ltr" value={form.intro.spec} onChange={(e) => set('intro', { ...form.intro, spec: e.target.value })} />}
        </Field>
        <LocalizedField label="العنوان" value={form.intro.title} onChange={(title) => set('intro', { ...form.intro, title })} />
        <p className="-mt-2 text-xs text-ink-muted">{TITLE_HINT}</p>
        <LocalizedField label="النص" multiline value={form.intro.body} onChange={(body) => set('intro', { ...form.intro, body })} />
      </Section>
      </TabPanel>

      <TabPanel id="look" active={tab}>
      <Section title="الطقم (Shop the look)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم الطقم" hint="بالإنجليزي">
            {(id) => <Input id={id} dir="ltr" value={look.title} onChange={(e) => setLook({ title: e.target.value })} />}
          </Field>
          <Field label="سعر الطقم (جنيه)">
            {(id) => <NumberInput id={id} min={0} value={look.setPrice} onChange={(setPrice) => setLook({ setPrice })} />}
          </Field>
        </div>
        <LocalizedField label="الوصف" value={look.subtitle} onChange={(subtitle) => setLook({ subtitle })} />
        <PhotoField value={look.photo} onChange={(photo) => setLook({ photo })} />

        <Field label="منتجات الطقم">
          {() => (
            <div className="flex flex-wrap gap-2">
              {products.data?.map((p) => {
                const on = look.productIds.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-sm ${on ? 'border-forest bg-forest-tint' : 'border-line'}`}
                  >
                    <input
                      type="checkbox"
                      className="accent-forest"
                      checked={on}
                      onChange={() =>
                        setLook({
                          productIds: on ? look.productIds.filter((x) => x !== p.id) : [...look.productIds, p.id],
                          hotspots: on ? look.hotspots.filter((h) => h.productId !== p.id) : look.hotspots,
                        })
                      }
                    />
                    {p.name.ar}
                  </label>
                )
              })}
            </div>
          )}
        </Field>

        <div className="grid gap-2">
          <h3 className="text-sm font-medium">النقط على الصورة</h3>
          <p className="text-xs text-ink-muted">مكان كل منتج على الصورة بالنسبة المئوية: من الشمال (x) ومن فوق (y).</p>
          <ListEditor<Hotspot>
            items={look.hotspots}
            onChange={(hotspots) => setLook({ hotspots })}
            addLabel="نقطة جديدة"
            itemTitle={(h) => productName(h.productId) || 'نقطة'}
            create={() => ({ productId: look.productIds[0] ?? '', x: 50, y: 50 })}
            renderItem={(spot, update) => (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                <Field label="المنتج">
                  {(id) => (
                    <Select value={spot.productId} onValueChange={(productId) => update({ ...spot, productId })}>
                      <SelectTrigger id={id} className="w-full">
                        <SelectValue placeholder="اختار منتج من الطقم" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {look.productIds.map((pid) => (
                          <SelectItem key={pid} value={pid}>
                            {productName(pid)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <Field label="x %">
                  {(id) => <NumberInput id={id} dir="ltr" min={0} max={100} value={spot.x} onChange={(x) => update({ ...spot, x })} />}
                </Field>
                <Field label="y %">
                  {(id) => <NumberInput id={id} dir="ltr" min={0} max={100} value={spot.y} onChange={(y) => update({ ...spot, y })} />}
                </Field>
              </div>
            )}
          />
        </div>
      </Section>
      </TabPanel>

      <TabPanel id="lookbook" active={tab}>
      <Section title="صور انستجرام (آخر الصفحة)">
        <Field label="اسم الحساب" hint="زي @timberglow" className="max-w-xs">
          {(id) => <Input id={id} dir="ltr" value={form.lookbook.handle} onChange={(e) => set('lookbook', { ...form.lookbook, handle: e.target.value })} />}
        </Field>
        <ListEditor<LookbookPost>
          items={form.lookbook.posts}
          onChange={(posts) => set('lookbook', { ...form.lookbook, posts })}
          addLabel="صورة جديدة"
          thumbnail={(p) => p.photo.src}
          itemTitle={(_, i) => `صورة ${i + 1}`}
          create={() => ({ id: newId(), photo: { ...EMPTY_PHOTO, focus: '50% 50%' }, href: '' })}
          renderItem={(post, update) => (
            <>
              <PhotoField aspect="aspect-square" value={post.photo} onChange={(photo) => update({ ...post, photo })} />
              <Field label="لينك البوست">
                {(id) => <Input id={id} dir="ltr" placeholder="https://instagram.com/p/…" value={post.href} onChange={(e) => update({ ...post, href: e.target.value })} />}
              </Field>
            </>
          )}
        />
      </Section>
      </TabPanel>

    </form>
  )
}
