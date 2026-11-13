import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/RootLayout'

/** The dashboard is its own chunk: shoppers never download it. */
const AdminApp = lazy(() => import('@/admin/AdminApp'))

const HomePage = lazy(() => import('@/pages/HomePage'))
const CollectionPage = lazy(() => import('@/pages/CollectionPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderPlacedPage = lazy(() => import('@/pages/OrderPlacedPage'))

export const router = createBrowserRouter([
  {
    path: 'admin/*',
    element: (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ),
  },
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'collections', element: <CollectionPage /> },
      { path: 'collections/:slug', element: <CollectionPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/:number', element: <OrderPlacedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
