import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Navigate, useLocation } from 'react-router'
import { adminService, errorMessage, isUnauthorized } from '../services/admin.service'

export const ME_QUERY_KEY = ['admin', 'me'] as const

/** Shows the dashboard only with a valid session; otherwise sends the admin to the login page. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const location = useLocation()
  const me = useQuery({ queryKey: ME_QUERY_KEY, queryFn: adminService.me })

  if (me.isPending) {
    return <div className="grid min-h-dvh place-items-center text-ink-muted">جاري التحميل…</div>
  }
  if (me.isError) {
    if (isUnauthorized(me.error)) {
      return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname)}`} replace />
    }
    return <div className="grid min-h-dvh place-items-center p-6 text-center text-danger">{errorMessage(me.error)}</div>
  }
  return children
}
