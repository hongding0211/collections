import React, { useCallback, useMemo, useRef, useState } from 'react'

import { Sheet } from './Sheet'
import { SheetContext } from './SheetContext'
import { DEFAULT_SHEET_OPTIONS } from './constants'
import { ISheetProviderProps, SheetInstance, SheetOptions } from './types'

export const SheetProvider: React.FC<ISheetProviderProps> = props => {
  const { children } = props

  // a state to trigger re-render
  const [renderCnt, setRenderCnt] = useState(0)

  const _cnt = useRef(0)

  const sheetMap = useRef<
    Map<
      number,
      {
        id: number
        renderInstance: React.ReactElement
        options: SheetOptions
        instance?: SheetInstance
      }
    >
  >(new Map())

  const appendInstance = useCallback(
    (renderFn: React.FC, options?: Partial<SheetOptions>) => {
      const _id = _cnt.current++
      const _options = options
        ? {
            ...DEFAULT_SHEET_OPTIONS,
            ...options,
          }
        : DEFAULT_SHEET_OPTIONS
      const _renderInstance = React.createElement(renderFn)
      sheetMap.current.set(_id, {
        id: _id,
        renderInstance: _renderInstance,
        options: _options,
      })
      setRenderCnt(r => r + 1)
      return _id
    },
    [],
  )

  const dropInstance = useCallback((id: number) => {
    if (!sheetMap.current.has(id)) {
      return
    }
    const sheet = sheetMap.current.get(id)
    /**
     * if useCloseAnim is enabled, then close the sheet using exploded instance,
     * otherwise just drop its instance.
     */
    if (sheet.options.useCloseAnim) {
      const sheet = sheetMap.current.get(id)
      if (!sheet) {
        return
      }
      sheet.instance.close().then(() => {
        sheetMap.current.delete(id)
        setRenderCnt(r => r + 1)
      })
    } else {
      sheetMap.current.delete(id)
      setRenderCnt(r => r + 1)
    }
    sheetMap.current.delete(id)
  }, [])

  const dropAllInstances = useCallback(() => {
    sheetMap.current.clear()
    setRenderCnt(r => r + 1)
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
      {[...sheetMap.current.values()].map(i => (
        <Sheet
          key={i.id}
          id={i.id}
          options={i.options}
          onPressMask={i.options.onPressMask}
          getInstance={instance =>
            (sheetMap.current.get(i.id).instance = instance)
          }
        >
          {i.renderInstance}
        </Sheet>
      ))}
      {memoedChildren}
    </SheetContext.Provider>
  )
}
