import React, { useCallback, useMemo, useRef } from 'react'

import { SheetContext } from './SheetContext'
import { ISheetProviderProps, ShowOptions } from './types'

export const SheetProvider: React.FC<ISheetProviderProps> = props => {
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
    <SheetContext.Provider value={value}>
      {memoedChildren}
    </SheetContext.Provider>
  )
}
