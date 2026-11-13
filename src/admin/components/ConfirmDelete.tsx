import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'

/** Confirmation dialog for destructive actions (delete, cancel an order…). `children` is the trigger button. */
export function ConfirmDelete({
  title,
  description,
  onConfirm,
  children,
  confirmLabel = 'احذف',
  cancelLabel = 'إلغاء',
}: {
  title: string
  description: string
  onConfirm: () => void
  children: ReactNode
  confirmLabel?: string
  cancelLabel?: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader className="sm:text-start">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel size="sm">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction size="sm" className="bg-danger text-surface hover:bg-danger/90" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
