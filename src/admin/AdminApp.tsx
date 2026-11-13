import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router'
import { Toaster } from '@/shared/components/ui/sonner'
import { AdminLayout } from './components/AdminLayout'
import { RequireAdmin } from './components/RequireAdmin'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryFormPage } from './pages/CategoryFormPage'
import { HomeEditorPage } from './pages/HomeEditorPage'
import { LoginPage } from './pages/LoginPage'
import { OrderDetailsPage } from './pages/OrderDetailsPage'
import { OrdersPage } from './pages/OrdersPage'
import { OverviewPage } from './pages/OverviewPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { ProductsPage } from './pages/ProductsPage'
import { SettingsPage } from './pages/SettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
})

/**
 * The whole dashboard, mounted at /admin/* and loaded lazily,
 * so none of it ships with the storefront bundle. Arabic only, RTL.
 */
export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div dir="rtl" lang="ar" className="min-h-dvh bg-surface-soft text-[15px] leading-relaxed">
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:number" element={<OrderDetailsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/:id" element={<CategoryFormPage />} />
            <Route path="home" element={<HomeEditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
        <Toaster position="top-center" dir="rtl" richColors />
      </div>
    </QueryClientProvider>
  )
}
