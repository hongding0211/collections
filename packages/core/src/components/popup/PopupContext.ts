import { createContext } from 'react'
import { IPopupContext } from './types'

export const PopupContext = createContext<IPopupContext>({
  instances: {},
  appendInstance: () => -1,
  dropInstance: () => null,
  dropAllInstances: () => null,
})
