import axios, { type AxiosAdapter } from 'axios'

/**
 * Single axios instance for the whole app.
 * With VITE_API_URL set, requests go to the real API (timber-glow-api).
 * Without it, or with VITE_USE_MOCKS=true, every request is answered by
 * `mockAdapter` from the local dummy data in `src/mocks`.
 */
const apiUrl = import.meta.env.VITE_API_URL as string | undefined
const useMocks = !apiUrl || import.meta.env.VITE_USE_MOCKS === 'true'

/** Loaded on first use, so the dummy data never ships in a build that talks to the real API. */
const lazyMockAdapter: AxiosAdapter = async (config) => (await import('@/mocks/mock-adapter')).mockAdapter(config)

export const api = axios.create({
  baseURL: apiUrl ?? '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  ...(useMocks && { adapter: lazyMockAdapter }),
})
