import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, FolderTree, House, LayoutDashboard, LogOut, Package, ReceiptText, Settings, type LucideIcon } from 'lucide-react'
import { Link, Outlet, matchPath, useLocation, useNavigate } from 'react-router'
import { Separator } from '@/shared/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { adminService } from '../services/admin.service'
import { ME_QUERY_KEY } from './RequireAdmin'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Only active on this exact path (the overview would otherwise match every page) */
  end?: boolean
}

/** The sidebar sits on the right (RTL), so its tooltips open to the left. */
const tip = (children: string) => ({ children, side: 'left' as const })

const SALES: NavItem[] = [
  { to: '/admin', label: 'نظرة عامة', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'الأوردرات', icon: ReceiptText },
]

const CATALOG: NavItem[] = [
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/categories', label: 'الأقسام', icon: FolderTree },
]

const CONTENT: NavItem[] = [
  { to: '/admin/home', label: 'الصفحة الرئيسية', icon: House },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

function NavGroup({ label, items, badges }: { label: string; items: NavItem[]; badges?: Record<string, number> }) {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ to, label: itemLabel, icon: Icon, end }) => {
            const active = !!matchPath({ path: to, end: !!end }, pathname)
            const badge = badges?.[to]
            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild isActive={active} tooltip={tip(itemLabel)}>
                  <Link to={to} onClick={() => isMobile && setOpenMobile(false)}>
                    <Icon />
                    <span>{itemLabel}</span>
                  </Link>
                </SidebarMenuButton>
                {!!badge && <SidebarMenuBadge className="bg-ember-tint text-ember-ink">{badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function AdminSidebar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const me = useQuery({ queryKey: ME_QUERY_KEY, queryFn: adminService.me })
  // Count of new orders next to "الأوردرات"; refreshed whenever the stats are.
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats })
  const newOrders = stats.data?.byStatus.new ?? 0

  async function logout() {
    await adminService.logout().catch(() => undefined)
    queryClient.clear()
    navigate('/admin/login', { replace: true })
  }

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip={tip("Timber Glow")}>
              <Link to="/admin">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-forest text-sm font-bold text-on-forest">TG</span>
                <span className="grid leading-tight">
                  <span className="font-semibold">Timber Glow</span>
                  <span className="spec text-ink-muted">DASHBOARD</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="المبيعات" items={SALES} badges={{ '/admin/orders': newOrders }} />
        <NavGroup label="المنتجات" items={CATALOG} />
        <NavGroup label="المحتوى" items={CONTENT} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={tip("افتح المتجر")}>
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink />
                <span>افتح المتجر</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip={tip("تسجيل الخروج")} className="hover:text-danger">
              <LogOut />
              <span className="grid leading-tight">
                <span>تسجيل الخروج</span>
                {me.data && <span className="truncate text-xs text-ink-muted">{me.data.email}</span>}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0 bg-surface-soft">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-line bg-surface/90 px-4 backdrop-blur">
          <SidebarTrigger className="-ms-1" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-ink-muted">لوحة التحكم</span>
        </header>
        <main className="min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
