import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useCartSummary } from '@/features/cart/hooks/useCartSummary'
import { useCartStore } from '@/features/cart/store/cart.store'
import { GOVERNORATES } from '@/features/checkout/constants/governorates'
import {
  LAST_ORDER_KEY,
  isPhoneError,
  orderService,
  unavailableItems,
  type CustomerInfo,
  type UnavailableItem,
} from '@/features/checkout/services/order.service'
import { BrandIcon } from '@/shared/components/BrandIcon'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { useLocalized } from '@/shared/hooks/useLocalized'
import { useUiStore } from '@/shared/store/ui.store'

const EMPTY: CustomerInfo = { name: '', phone: '', governorate: '', city: '', address: '', notes: '' }

const controlClass = 'h-12 rounded-md bg-surface px-4 text-base md:text-base'

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-2">
      <Label htmlFor={id} className="text-[15px]">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[13px] text-ink-muted">{hint}</p>}
    </div>
  )
}

/** /checkout — customer details, then the order is saved and WhatsApp opens with it. */
export default function CheckoutPage() {
  const { t } = useTranslation('checkout')
  const { l, lang, price } = useLocalized()
  const navigate = useNavigate()
  const lines = useCartStore((s) => s.lines)
  const clear = useCartStore((s) => s.clear)
  const openCart = useUiStore((s) => s.openCart)
  const { subtotal } = useCartSummary()

  const [form, setForm] = useState<CustomerInfo>(EMPTY)
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phoneInvalid, setPhoneInvalid] = useState(false)
  const [unavailable, setUnavailable] = useState<UnavailableItem[]>([])

  const set = (key: keyof CustomerInfo) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setPhoneInvalid(false)
    setUnavailable([])
    try {
      const order = await orderService.place({
        customer: form,
        items: lines.map((line) => ({ productId: line.product.id, size: line.size, qty: line.qty })),
        lang,
        website,
      })
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ ...order, redirected: false }))
      } catch {
        // Private mode: the next page still gets the order through navigation state.
      }
      clear()
      navigate(`/order/${order.number}`, { replace: true, state: order })
    } catch (err) {
      const missing = unavailableItems(err)
      if (missing) {
        setUnavailable(missing)
        setError(t('errors.unavailable'))
      } else if (isPhoneError(err)) {
        setPhoneInvalid(true)
        setError(t('errors.phone'))
      } else {
        setError(t('errors.generic'))
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setBusy(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="wrap grid min-h-[50vh] content-center justify-items-center gap-5 py-section text-center">
        <p className="text-lg text-ink-muted">{t('empty')}</p>
        <Button asChild variant="outline">
          <Link to="/collections">{t('shop')}</Link>
        </Button>
      </div>
    )
  }

  const nameOf = (productId: string) => {
    const line = lines.find((x) => x.product.id === productId)
    return line ? l(line.product.name) : productId
  }

  return (
    <div className="wrap pt-8 pb-section md:pt-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-[clamp(30px,3.4vw,44px)] leading-tight font-semibold">{t('title')}</h1>
        <p className="mt-2 text-ink-muted">{t('subtitle')}</p>
      </header>

      {error && (
        <div role="alert" className="mb-6 max-w-2xl rounded-md border border-danger/30 bg-ember-tint px-4 py-3 text-[15px] text-danger">
          <p>{error}</p>
          {unavailable.length > 0 && (
            <ul className="mt-2 list-disc ps-5">
              {unavailable.map((u) => (
                <li key={`${u.productId}:${u.size}`}>
                  {t('errors.unavailableLine', { name: nameOf(u.productId), size: u.size, available: u.available })}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <div className="grid gap-8">
          <section className="grid gap-5">
            <h2 className="text-lg font-semibold">{t('contact')}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="co-name" label={t('fields.name')}>
                <Input id="co-name" autoComplete="name" required minLength={2} className={controlClass} value={form.name} onChange={set('name')} />
              </Field>
              <Field id="co-phone" label={t('fields.phone')} hint={t('fields.phoneHint')}>
                <Input
                  id="co-phone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  aria-invalid={phoneInvalid || undefined}
                  className={`${controlClass} text-start`}
                  value={form.phone}
                  onChange={set('phone')}
                />
              </Field>
            </div>
          </section>

          <section className="grid gap-5">
            <h2 className="text-lg font-semibold">{t('delivery')}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="co-gov" label={t('fields.governorate')}>
                <select
                  id="co-gov"
                  required
                  value={form.governorate}
                  onChange={set('governorate')}
                  className={`${controlClass} w-full cursor-pointer border border-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`}
                >
                  <option value="" disabled>
                    {t('fields.chooseGovernorate')}
                  </option>
                  {GOVERNORATES.map((g) => (
                    <option key={g.ar} value={g.ar}>
                      {l(g)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="co-city" label={t('fields.city')}>
                <Input id="co-city" autoComplete="address-level2" required minLength={2} className={controlClass} value={form.city} onChange={set('city')} />
              </Field>
            </div>
            <Field id="co-address" label={t('fields.address')} hint={t('fields.addressHint')}>
              <Textarea
                id="co-address"
                autoComplete="street-address"
                required
                minLength={5}
                rows={3}
                className="rounded-md bg-surface px-4 py-3 text-base md:text-base"
                value={form.address}
                onChange={set('address')}
              />
            </Field>
            <Field id="co-notes" label={t('fields.notes')}>
              <Textarea id="co-notes" rows={2} maxLength={500} className="rounded-md bg-surface px-4 py-3 text-base md:text-base" value={form.notes} onChange={set('notes')} />
            </Field>
            {/* Honeypot: invisible to people, filled in by bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="absolute -start-[9999px] size-px opacity-0"
            />
          </section>
        </div>

        <aside className="grid gap-5 rounded-lg border border-line bg-surface-soft p-5 lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold">{t('summary')}</h2>
            <button type="button" onClick={openCart} className="cursor-pointer text-sm underline underline-offset-4 hover:text-ember-ink">
              {t('edit')}
            </button>
          </div>
          <ul className="grid gap-4">
            {lines.map((line) => (
              <li key={line.key} className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
                <img
                  src={line.product.photo.src}
                  alt=""
                  className="aspect-[4/5] w-14 rounded-md object-cover"
                  style={{ objectPosition: line.product.photo.focus }}
                />
                <div className="grid leading-snug">
                  <span className="font-medium">{l(line.product.name)}</span>
                  <span className="spec text-ink-muted">
                    {line.product.color} · {line.size} · ×{line.qty}
                  </span>
                </div>
                <span className="tabular-nums">{price(line.product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="grid gap-2 border-t border-dashed border-line-strong pt-4 text-[15px]">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">{t('shipping')}</dt>
              <dd>{t('shippingValue')}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">{t('payment')}</dt>
              <dd>✓</dd>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3 text-lg font-bold">
              <dt>{t('subtotal')}</dt>
              <dd className="text-[22px] tabular-nums">{price(subtotal)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" disabled={busy} className="w-full">
            {busy ? (
              t('submitting')
            ) : (
              <>
                <BrandIcon name="whatsapp" className="size-5" strokeWidth={1.6} />
                {t('submit')}
              </>
            )}
          </Button>
        </aside>
      </form>
    </div>
  )
}
