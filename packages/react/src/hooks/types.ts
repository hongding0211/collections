import { Ref } from 'react'

export type ContextEvents<T> = {
  events: Ref<Map<keyof T, ((payload: T[keyof T]) => void | undefined)[]>>
  addEventListener: (event: keyof T, cb: (payload?: T[keyof T]) => void) => void
  removeEventListener: (event: keyof T) => void
  onEvent: (event: keyof T, payload?: T[keyof T]) => void
}

export type ContextEventsValue<T> = Pick<
  ContextEvents<T>,
  'addEventListener' | 'removeEventListener'
>
