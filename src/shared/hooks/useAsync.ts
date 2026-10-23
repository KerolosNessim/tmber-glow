import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | undefined
  error: Error | undefined
  isLoading: boolean
}

/** Results are kept for the session so going back to a page doesn't reload it. */
const cache = new Map<string, unknown>()

/**
 * Runs `fetcher` when `key` changes and keeps the latest result.
 * Pass `null` as the key to skip the request.
 */
export function useAsync<T>(key: string | null, fetcher: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>(() => ({
    data: key ? (cache.get(key) as T | undefined) : undefined,
    error: undefined,
    isLoading: key !== null && !cache.has(key),
  }))

  useEffect(() => {
    if (key === null) return
    if (cache.has(key)) {
      setState({ data: cache.get(key) as T, error: undefined, isLoading: false })
      return
    }
    let active = true
    setState((s) => ({ ...s, isLoading: true, error: undefined }))
    fetcher()
      .then((data) => {
        cache.set(key, data)
        if (active) setState({ data, error: undefined, isLoading: false })
      })
      .catch((error: Error) => {
        if (active) setState({ data: undefined, error, isLoading: false })
      })
    return () => {
      active = false
    }
    // The key identifies the request; the fetcher is recreated on every render.
  }, [key])

  return state
}
