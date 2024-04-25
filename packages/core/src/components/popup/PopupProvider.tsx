import React, { useCallback, useMemo, useRef } from 'react'
import { IPopupProviderProps, ShowOptions } from './types'
import { PopupContext } from './PopupContext'

export const PopupProvider: React.FC<IPopupProviderProps> = props => {
  const { children } = props

  const _cnt = useRef(0)
  const instances = useRef<Record<number, React.ReactElement>>({})

  const appendInstance = useCallback(
    (renderFn: React.FC, options?: ShowOptions) => {
      return _cnt.current++
    },
    [],
  )

  const dropInstance = useCallback((id: number) => {}, [])

  const dropAllInstances = useCallback(() => {}, [])

  const value = useMemo(
    () => ({
      instances: instances.current,
      appendInstance,
      dropInstance,
      dropAllInstances,
    }),
    [appendInstance, dropInstance, dropAllInstances],
  )

  const memoedChildren = useMemo(() => children, [children])

  return (
    <PopupContext.Provider value={value}>
      {memoedChildren}
    </PopupContext.Provider>
  )
}
