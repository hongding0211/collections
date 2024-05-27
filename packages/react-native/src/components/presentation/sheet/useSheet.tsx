import React, { useCallback, useContext } from 'react'

import { PortalContext } from '../../core'
import { Sheet } from './Sheet'
import { DEFAULT_SHEET_OPTIONS } from './constants'
import { ISheetInstance, SheetOptions, UseSheet } from './types'

export function useSheet(): UseSheet {
  const portalContext = useContext(PortalContext)
  const { appendInstance, dropInstance, getInstance, setInstance } =
    portalContext

  const _show = useCallback(
    (renderFn: React.FC, options?: Partial<SheetOptions>) => {
      const _options = options
        ? {
            ...DEFAULT_SHEET_OPTIONS,
            ...options,
          }
        : DEFAULT_SHEET_OPTIONS
      return appendInstance(({ id }) => (
        <Sheet
          id={id}
          options={_options}
          onPressMask={_options.onPressMask}
          onFlingClose={_options.onFlingClose}
          getInstance={instance => setInstance(id, instance)}
        >
          {React.createElement(renderFn)}
        </Sheet>
      ))
    },
    [appendInstance, setInstance],
  )

  const _close = useCallback(
    (id: number) => {
      const sheetInstance = getInstance<ISheetInstance>(id)
      if (!sheetInstance) {
        return
      }
      /**
       * if useAnim is enabled, then close the sheet using exploded instance,
       * otherwise just drop its instance.
       */
      if (sheetInstance.options.useAnim) {
        sheetInstance.close().then(() => {
          dropInstance(id)
        })
      } else {
        dropInstance(id)
      }
    },
    [dropInstance, getInstance],
  )

  return {
    show: _show,
    close: _close,
    getInstance,
  }
}
