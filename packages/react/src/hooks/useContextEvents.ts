import { useCallback, useRef } from 'react'

import { ContextEvents } from './types'

export function useContextEvents<T = Record<string, any>>(): ContextEvents<T> {
  const events = useRef(new Map<keyof T, ((payload?: T[keyof T]) => void)[]>())

  const addEventListener = useCallback(
    (event: keyof T, cb: (payload?: T[keyof T]) => void) => {
      if (!events.current.has(event)) {
        events.current.set(event, [])
      }
      events.current.get(event)!.push(cb)
    },
    [],
  )

  const removeEventListener = useCallback((event: keyof T) => {
    events.current.delete(event)
  }, [])

  const onEvent = useCallback((event: keyof T, payload?: T[keyof T]) => {
    if (!events.current.has(event)) {
      return
    }
    events.current.get(event)!.forEach(cb => cb(payload))
  }, [])

  return {
    events,
    addEventListener,
    removeEventListener,
    onEvent,
  }
}
