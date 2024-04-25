import React from 'react'

export interface IPopupContext {
  instances: Record<number, React.ReactElement>
  appendInstance: (renderFn: React.FC, options?: ShowOptions) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
}

export interface ShowOptions {}

export type UsePopup = {
  show: (renderFn: React.FC, options?: ShowOptions) => number
  destroy: (id: number) => void
  destroyAll: () => void
}

export interface IPopupProviderProps {
  children: React.ReactNode
}
