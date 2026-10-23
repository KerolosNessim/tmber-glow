import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/RootLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const CollectionPage = lazy(() => import('@/pages/CollectionPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'collections', element: <CollectionPage /> },
      { path: 'collections/:slug', element: <CollectionPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
