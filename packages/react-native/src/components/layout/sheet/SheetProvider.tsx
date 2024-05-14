import React, { useCallback, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { Sheet } from './Sheet'
import { SheetContext } from './SheetContext'
import { DEFAULT_SHEET_OPTIONS } from './constants'
import { ISheetProviderProps, SheetInstance, SheetOptions } from './types'

export const SheetProvider: React.FC<ISheetProviderProps> = props => {
  const { children, monoInstance = false } = props

  /**
   * An auto-increment counter to generate unique id for each sheet instance.
   */
  const _cnt = useRef(0)

  /**
   * Why use a ref to store the render instance
   * instead of using state to directly trigger a re-render?
   *
   * State creates a closure, aka a snapshot.
   *
   *
   * Consider the following scenario:
   *
   * When a user invokes a show method to append a new sheet instance,
   * you may pass some callbacks in the options,
   * such as destroying the sheet in the onPressMask callback.
   *
   * The problem occurs here:
   * This callback captures a closure which is the state before the instance has been actually created,
   * where at this moment, the instance list has not been updated yet (does not include the instance you're about to create).
   *
   * Thus, when you try to destroy a sheet instance,
   * dropInstance() will not be able to find the instance you just created.
   *
   * Therefore, to solve this problem, we use a ref to store all the instances.
   * Then we use setRenderCnt to manually trigger a re-render when it's necessary.
   */
  const [, setRenderCnt] = useState(0)
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
      const id = _cnt.current++
      const _options = options
        ? {
            ...DEFAULT_SHEET_OPTIONS,
            ...options,
          }
        : DEFAULT_SHEET_OPTIONS
      const renderInstance = React.createElement(renderFn)
      if (monoInstance) {
        sheetMap.current.clear()
      }
      sheetMap.current.set(id, {
        id,
        renderInstance,
        options: _options,
      })
      setRenderCnt(r => r + 1)
      return id
    },
    [monoInstance],
  )

  const dropInstance = useCallback((id: number) => {
    if (!sheetMap.current.has(id)) {
      return
    }
    const sheet = sheetMap.current.get(id)!
    /**
     * if useAnim is enabled, then close the sheet using exploded instance,
     * otherwise just drop its instance.
     */
    if (sheet.options.useAnim) {
      sheet.instance?.close().then(() => {
        sheetMap.current.delete(id)
        setRenderCnt(r => r + 1)
      })
    } else {
      sheetMap.current.delete(id)
      setRenderCnt(r => r + 1)
    }
  }, [])

  const dropAllInstances = useCallback(() => {
    sheetMap.current.clear()
    setRenderCnt(r => r + 1)
  }, [])

  const getInstance = useCallback((id: number) => {
    return sheetMap.current.get(id)?.instance || undefined
  }, [])

  const value = useMemo(
    () => ({
      appendInstance,
      dropInstance,
      dropAllInstances,
      getInstance,
    }),
    [appendInstance, dropInstance, dropAllInstances, getInstance],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SheetContext.Provider value={value}>
        {[...sheetMap.current.values()].map(i => (
          <Sheet
            key={i.id}
            id={i.id}
            options={i.options}
            onPressMask={i.options.onPressMask}
            onFlingClose={i.options.onFlingClose}
            getInstance={instance =>
              (sheetMap.current.get(i.id)!.instance = instance)
            }
          >
            {i.renderInstance}
          </Sheet>
        ))}
        {children}
      </SheetContext.Provider>
    </GestureHandlerRootView>
  )
}
