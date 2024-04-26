import React from 'react'

export interface ISheetContext {
  instances: Record<number, React.ReactElement>
  appendInstance: (renderFn: React.FC, options?: ShowOptions) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
}

export interface ShowOptions {}

export type UseSheet = {
  show: (renderFn: React.FC, options?: ShowOptions) => number
  destroy: (id: number) => void
  destroyAll: () => void
}

export interface ISheetProviderProps {
  children: React.ReactNode
}
