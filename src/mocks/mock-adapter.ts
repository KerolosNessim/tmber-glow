import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { routes } from './routes'

/** Small delay so loading states are visible in development, like a real network. */
const LATENCY_MS = 350

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function matchRoute(method: string, path: string) {
  for (const route of routes) {
    if (route.method !== method) continue
    const names: string[] = []
    const pattern = route.path.replace(/:(\w+)/g, (_, name: string) => {
      names.push(name)
      return '([^/]+)'
    })
    const found = new RegExp(`^${pattern}$`).exec(path)
    if (found) {
      const params = Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(found[i + 1])]))
      return { route, params }
    }
  }
  return null
}

/** Axios adapter that resolves requests from local dummy data. No network calls. */
export const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  await wait(LATENCY_MS)

  const method = (config.method ?? 'get').toUpperCase()
  const url = new URL(config.url ?? '/', 'http://mock.local')
  const query = { ...Object.fromEntries(url.searchParams), ...(config.params ?? {}) } as Record<string, string>
  const hit = matchRoute(method, url.pathname)

  const respond = (status: number, data: unknown): AxiosResponse => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Not Found',
    headers: {},
    config,
    request: null,
  })

  if (!hit) {
    throw new AxiosError(`No mock for ${method} ${url.pathname}`, 'ERR_NOT_FOUND', config, null, respond(404, null))
  }

  const data = hit.route.handler({ params: hit.params, query, body: config.data })
  if (data === undefined) {
    throw new AxiosError('Not found', 'ERR_NOT_FOUND', config, null, respond(404, null))
  }
  return respond(200, { data })
}
