import { useRef } from 'react'

export function useOnce(fn: () => any) {
  const hasRun = useRef(false)
  if (!hasRun.current) {
    fn.call(null)
    hasRun.current = true
  }
}
