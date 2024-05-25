import React from 'react'

import { AnimationOptions } from '../../../utils'

export interface PortalOptions extends AnimationOptions {}

export interface IPortalInstance {
  close: () => Promise<any>
}

export interface IPortalContext {
  appendInstance: (
    renderFn: React.FC<{ id: number }>,
    options?: Partial<PortalOptions>,
  ) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
  getInstance: (id: number) => IPortalInstance | undefined
  setInstance: (id: number, instance: IPortalInstance) => void
}

export interface IPortalProviderProps {
  children: React.ReactNode
}
