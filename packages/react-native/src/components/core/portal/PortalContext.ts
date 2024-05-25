import { createContext } from 'react'

import { DEFAULT_CONTEXT } from './constants'
import { IPortalContext } from './types'

export const PortalContext = createContext<IPortalContext>(DEFAULT_CONTEXT)
