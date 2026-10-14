import { useCallback, useEffect, useRef, useState } from 'react'

// Runs an async service call and tracks loading / error / data.
// reload() refreshes quietly: the old data stays on screen, so tables do not flash a loader after an action.
export default function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const [tick, setTick] = useState(0)
  const quiet = useRef(false)

  useEffect(() => {
    let cancelled = false
    const isQuietReload = quiet.current
    quiet.current = false
    setState((s) => (isQuietReload && s.data !== null ? s : { ...s, loading: true, error: '' }))
    asyncFn()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: '' }) })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: err?.message || 'Something went wrong' }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => { quiet.current = true; setTick((t) => t + 1) }, [])
  const setData = useCallback((data) => setState((s) => ({ ...s, data })), [])
  return { ...state, reload, setData }
}