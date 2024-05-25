import React, { useCallback, useContext } from 'react'

import { PortalContext, PortalOptions } from '../../core'
import { Sheet } from './Sheet'
import { DEFAULT_SHEET_OPTIONS } from './constants'
import { ISheetInstance, UseSheet } from './types'

export function useSheet(): UseSheet {
  const portalContext = useContext(PortalContext)
  const { appendInstance, dropInstance, getInstance, setInstance } =
    portalContext

  const _show = useCallback(
    (renderFn: React.FC, options?: Partial<PortalOptions>) => {
      const _options = options
        ? {
            ...DEFAULT_SHEET_OPTIONS,
            ...options,
          }
        : DEFAULT_SHEET_OPTIONS
      return appendInstance(
        ({ id }) => (
          <Sheet
            id={id}
            options={_options}
            onPressMask={_options.onPressMask}
            onFlingClose={_options.onFlingClose}
            getInstance={instance => setInstance(id, instance)}
          >
            {React.createElement(renderFn)}
          </Sheet>
        ),
        options,
      )
    },
    [appendInstance, setInstance],
  )

  const _destroy = useCallback(
    (id: number) => {
      dropInstance(id)
    },
    [dropInstance],
  )

  const _getInstance = useCallback(
    (id: number) => {
      return getInstance(id) as ISheetInstance
    },
    [getInstance],
  )

  return {
    show: _show,
    destroy: _destroy,
    getInstance: _getInstance,
  }
}
