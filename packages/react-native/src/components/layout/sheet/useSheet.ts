import { useContext } from 'react'

import { SheetContext } from './SheetContext'
import { UseSheet } from './types'

export function useSheet(): UseSheet {
  const sheetContext = useContext(SheetContext)
  const { appendInstance, dropInstance, dropAllInstances, getInstance } =
    sheetContext

  return {
    show: appendInstance,
    destroy: dropInstance,
    destroyAll: dropAllInstances,
    getInstance,
  }
}
