import React from 'react'

export interface IPortalInstance {}

export interface IPortalContext {
  appendInstance: (renderFn: React.FC<{ id: number }>) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
  getInstance: <T extends IPortalInstance = IPortalInstance>(
    id: number,
  ) => T | undefined
  setInstance: <T extends IPortalInstance = IPortalInstance>(
    id: number,
    instance: T,
  ) => void
}

export interface IPortalProviderProps {
  children: React.ReactNode
}
