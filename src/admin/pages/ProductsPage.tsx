import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { formatPrice } from '@/shared/lib/format'
import { ConfirmDelete } from '../components/ConfirmDelete'
import { PageHeader } from '../components/form'
import { adminService, errorMessage } from '../services/admin.service'

const ALL = 'all'

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [category, setCategory] = useState(ALL)
  const [search, setSearch] = useState('')

  const products = useQuery({ queryKey: ['admin', 'products'], queryFn: () => adminService.products() })
  const categories = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminService.categories })

  const remove = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      toast.success('المنتج اتحذف')
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  const categoryName = useMemo(
    () => new Map(categories.data?.map((c) => [c.slug, c.name.ar]) ?? []),
    [categories.data],
  )

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (products.data ?? []).filter(
      (p) =>
        (category === ALL || p.categorySlug === category) &&
        (!q || p.name.ar.toLowerCase().includes(q) || p.name.en.toLowerCase().includes(q) || p.id.includes(q)),
    )
  }, [products.data, category, search])

  return (
    <>
      <PageHeader title="المنتجات">
        <Button asChild size="sm">
          <Link to="/admin/products/new">
            <Plus />
            منتج جديد
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="دوّر بالاسم…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 max-w-xs bg-surface"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-10 w-52 bg-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value={ALL}>كل الأقسام</SelectItem>
            {categories.data?.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name.ar}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {products.isPending ? (
        <p className="text-ink-muted">جاري التحميل…</p>
      ) : products.isError ? (
        <p className="text-danger">{errorMessage(products.error)}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">المنتج</TableHead>
                <TableHead className="text-start">القسم</TableHead>
                <TableHead className="text-start">السعر</TableHead>
                <TableHead className="text-start">المخزون</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const total = p.stock.reduce((sum, s) => sum + s.qty, 0)
                const soldOut = p.stock.filter((s) => s.qty <= 0).map((s) => s.size)
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Link to={`/admin/products/${p.id}`} className="flex items-center gap-3">
                        <img src={p.photo.src} alt="" className="size-12 rounded-md object-cover" style={{ objectPosition: p.photo.focus }} />
                        <span className="grid">
                          <span className="font-medium">{p.name.ar}</span>
                          <span className="spec text-ink-muted">
                            {p.id} · {p.color}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{categoryName.get(p.categorySlug) ?? p.categorySlug}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatPrice(p.price, 'ar')}</TableCell>
                    <TableCell>
                      <span className="font-medium">{total}</span>
                      {soldOut.length > 0 && <span className="block text-xs text-danger">خلص: {soldOut.join('، ')}</span>}
                    </TableCell>
                    <TableCell>
                      {p.isActive ? (
                        <span className="rounded-full bg-forest-tint px-2.5 py-0.5 text-xs text-forest-deep">ظاهر</span>
                      ) : (
                        <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs text-ink-muted">مخفي</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label="تعديل">
                          <Link to={`/admin/products/${p.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <ConfirmDelete
                          title={`حذف "${p.name.ar}"؟`}
                          description="المنتج هيتشال من المتجر نهائياً. لو عايز تخفيه بس، اقفل «ظاهر في المتجر» من صفحة التعديل."
                          onConfirm={() => remove.mutate(p.id)}
                        >
                          <Button variant="ghost" size="icon" aria-label="حذف" className="hover:bg-ember-tint hover:text-danger">
                            <Trash2 className="size-4" />
                          </Button>
                        </ConfirmDelete>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-ink-muted">
                    مفيش منتجات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
