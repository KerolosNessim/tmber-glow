import axios from 'axios'
import { mockAdapter } from '@/mocks/mock-adapter'

/**
 * Single axios instance for the whole app.
 * There is no backend yet: every request is answered by `mockAdapter` from the
 * local dummy data in `src/mocks`. When the real API exists, set VITE_API_URL
 * and remove the `adapter` line. Services and components stay the same.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
  adapter: mockAdapter,
})
