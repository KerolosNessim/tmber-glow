import { categories } from './data/categories'
import { products } from './data/products'
import { homeContent } from './data/home'

interface MockRequest {
  params: Record<string, string>
  query: Record<string, string>
  body: unknown
}

interface MockRoute {
  method: 'GET' | 'POST'
  path: string
  /** Return `undefined` for a 404. */
  handler: (req: MockRequest) => unknown
}

export const routes: MockRoute[] = [
  { method: 'GET', path: '/home', handler: () => homeContent },
  {
    method: 'GET',
    path: '/categories',
    handler: ({ query }) => (query.group ? categories.filter((c) => c.group === query.group) : categories),
  },
  {
    method: 'GET',
    path: '/categories/:slug',
    handler: ({ params }) => categories.find((c) => c.slug === params.slug),
  },
  {
    method: 'GET',
    path: '/products',
    handler: ({ query }) => {
      let list = products
      if (query.category) list = list.filter((p) => p.categorySlug === query.category)
      if (query.ids) {
        const ids = query.ids.split(',')
        list = list.filter((p) => ids.includes(p.id))
      }
      return list
    },
  },
  {
    method: 'GET',
    path: '/products/:id',
    handler: ({ params }) => products.find((p) => p.id === params.id),
  },
  {
    method: 'GET',
    path: '/settings',
    handler: () => ({ whatsappNumber: '', social: { instagram: '', facebook: '', tiktok: '' } }),
  },
  {
    // Demo only: nothing is saved without the real API.
    method: 'POST',
    path: '/orders',
    handler: ({ body }) => {
      const { items } = JSON.parse(String(body)) as { items: { productId: string; qty: number }[] }
      const subtotal = items.reduce((sum, i) => sum + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.qty, 0)
      return { number: 'TG-DEMO', subtotal, whatsappUrl: null }
    },
  },
]
