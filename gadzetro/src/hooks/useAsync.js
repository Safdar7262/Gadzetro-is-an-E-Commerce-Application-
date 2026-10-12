import { useCallback, useEffect, useState } from 'react'

// Runs an async service call and tracks loading / error / data. Call reload() to run it again.
export default function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: '' }))
    asyncFn()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: '' }) })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: err?.message || 'Something went wrong' }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  const setData = useCallback((data) => setState((s) => ({ ...s, data })), [])
  return { ...state, reload, setData }
}
