import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { ConfirmDelete } from '../components/ConfirmDelete'
import { PageHeader } from '../components/form'
import { adminService, errorMessage } from '../services/admin.service'
import type { AdminCategory } from '../types'

const GROUP_LABEL = { tops: 'فوق', bottoms: 'تحت' } as const
const QUERY_KEY = ['admin', 'categories']

export function CategoriesPage() {
  const queryClient = useQueryClient()
  const categories = useQuery({ queryKey: QUERY_KEY, queryFn: adminService.categories })

  const reorder = useMutation({
    mutationFn: (list: AdminCategory[]) => adminService.reorderCategories(list.map((c) => c.id)),
    // Move the row right away, then confirm with the server.
    onMutate: (list) => queryClient.setQueryData(QUERY_KEY, list),
    onError: (err) => toast.error(errorMessage(err)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const remove = useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      toast.success('القسم اتحذف')
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (err) => toast.error(errorMessage(err)),
  })

  function move(index: number, by: -1 | 1) {
    const list = [...(categories.data ?? [])]
    const [item] = list.splice(index, 1)
    list.splice(index + by, 0, item)
    reorder.mutate(list)
  }

  return (
    <>
      <PageHeader title="الأقسام">
        <Button asChild size="sm">
          <Link to="/admin/categories/new">
            <Plus />
            قسم جديد
          </Link>
        </Button>
      </PageHeader>
      <p className="-mt-3 mb-4 text-sm text-ink-muted">رتّب الأقسام بالأسهم، ونفس الترتيب هيظهر في المتجر.</p>

      {categories.isPending ? (
        <p className="text-ink-muted">جاري التحميل…</p>
      ) : categories.isError ? (
        <p className="text-danger">{errorMessage(categories.error)}</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-start">الترتيب</TableHead>
                <TableHead className="text-start">القسم</TableHead>
                <TableHead className="text-start">المجموعة</TableHead>
                <TableHead className="text-start">المنتجات</TableHead>
                <TableHead className="text-start">الحالة</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.data.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex gap-0.5">
                      <button
                        type="button"
                        aria-label="لفوق"
                        disabled={i === 0 || reorder.isPending}
                        onClick={() => move(i, -1)}
                        className="grid size-7 cursor-pointer place-items-center rounded hover:bg-surface-sunken disabled:opacity-30"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="لتحت"
                        disabled={i === categories.data.length - 1 || reorder.isPending}
                        onClick={() => move(i, 1)}
                        className="grid size-7 cursor-pointer place-items-center rounded hover:bg-surface-sunken disabled:opacity-30"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/categories/${c.id}`} className="flex items-center gap-3">
                      <img src={c.photo.src} alt="" className="size-12 rounded-md object-cover" style={{ objectPosition: c.photo.focus }} />
                      <span className="grid">
                        <span className="font-medium">{c.name.ar}</span>
                        <span className="spec text-ink-muted">/{c.slug}</span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{GROUP_LABEL[c.group]}</TableCell>
                  <TableCell>{c.productCount ?? 0}</TableCell>
                  <TableCell>
                    {c.isActive ? (
                      <span className="rounded-full bg-forest-tint px-2.5 py-0.5 text-xs text-forest-deep">ظاهر</span>
                    ) : (
                      <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs text-ink-muted">مخفي</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="تعديل">
                        <Link to={`/admin/categories/${c.id}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <ConfirmDelete
                        title={`حذف قسم "${c.name.ar}"؟`}
                        description={
                          c.productCount
                            ? `القسم فيه ${c.productCount} منتج، ومش هينفع يتحذف غير لما تنقلهم لقسم تاني أو تحذفهم.`
                            : 'القسم هيتشال من المتجر نهائياً.'
                        }
                        onConfirm={() => remove.mutate(c.id)}
                      >
                        <Button variant="ghost" size="icon" aria-label="حذف" className="hover:bg-ember-tint hover:text-danger">
                          <Trash2 className="size-4" />
                        </Button>
                      </ConfirmDelete>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
