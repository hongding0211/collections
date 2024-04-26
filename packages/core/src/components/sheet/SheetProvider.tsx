import React, {
  Ref,
  createRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Sheet } from './Sheet'
import { SheetContext } from './SheetContext'
import { DEFAULT_SHEET_OPTIONS } from './constants'
import { ISheetProviderProps, SheetInstance, SheetOptions } from './types'

export const SheetProvider: React.FC<ISheetProviderProps> = props => {
  const { children } = props

  const [renderInstances, setRenderInstances] = useState<
    {
      id: number
      instance: React.ReactElement
      options: SheetOptions
    }[]
  >([])

  const _cnt = useRef(0)

  const sheetInstanceMap = useRef<Map<number, SheetInstance>>(new Map())

  const appendInstance = useCallback(
    (renderFn: React.FC, options?: Partial<SheetOptions>) => {
      const id = _cnt.current++
      const _options = options
        ? {
            ...DEFAULT_SHEET_OPTIONS,
            ...options,
          }
        : DEFAULT_SHEET_OPTIONS
      setRenderInstances(r => [
        ...r,
        {
          id,
          instance: React.createElement(renderFn),
          options: _options,
        },
      ])
      return id
    },
    [],
  )

  const dropInstance = useCallback(
    (id: number) => {
      const idx = renderInstances.findIndex(r => r.id === id)
      if (idx === -1) {
        return
      }
      /**
       * if useCloseAnim is enabled, then close the sheet using exploded instance,
       * otherwise just drop its instance.
       */
      if (renderInstances[idx].options.useCloseAnim) {
        const instance = sheetInstanceMap.current.get(id)
        if (!instance) {
          return
        }
        instance.close().then(() => {
          setRenderInstances(r => r.filter(e => e.id !== id))
        })
      } else {
        setRenderInstances(r => r.filter(e => e.id !== id))
      }
      sheetInstanceMap.current.delete(id)
    },
    [renderInstances],
  )

  const dropAllInstances = useCallback(() => {
    sheetInstanceMap.current.clear()
    setRenderInstances([])
  }, [])

  const value = useMemo(
    () => ({
      appendInstance,
      dropInstance,
      dropAllInstances,
    }),
    [appendInstance, dropInstance, dropAllInstances],
  )

  const memoedChildren = useMemo(() => children, [children])

  return (
    <SheetContext.Provider value={value}>
      {renderInstances.map(i => (
        <Sheet
          key={i.id}
          id={i.id}
          options={i.options}
          getInstance={instance => sheetInstanceMap.current.set(i.id, instance)}
        >
          {i.instance}
        </Sheet>
      ))}
      {memoedChildren}
    </SheetContext.Provider>
  )
}
