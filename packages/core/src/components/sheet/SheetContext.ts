import { createContext } from 'react'

import { ISheetContext } from './types'

export const SheetContext = createContext<ISheetContext>({
  instances: {},
  appendInstance: () => -1,
  dropInstance: () => null,
  dropAllInstances: () => null,
})
