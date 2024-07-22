import { createContext } from 'react'

import { IScrollViewContainerContext } from './types'

const DEFAULT_VALUE: IScrollViewContainerContext = {
  register: () => null,
  setHeight: () => null,
}

export const ScrollViewContainerContext =
  createContext<IScrollViewContainerContext>(DEFAULT_VALUE)
