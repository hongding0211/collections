import { createContext } from 'react'

import { DEFAULT_CONTEXT } from './constants'
import { ISheetContext } from './types'

export const SheetContext = createContext<ISheetContext>(DEFAULT_CONTEXT)
