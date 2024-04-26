import { useContext } from 'react'

import { SheetContext } from './SheetContext'
import { UseSheet } from './types'

export function useSheet(): UseSheet {
  const popupContext = useContext(SheetContext)
  const { appendInstance, dropInstance, dropAllInstances } = popupContext

  return {
    show: appendInstance,
    destroy: dropInstance,
    destroyAll: dropAllInstances,
  }
}
