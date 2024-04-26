import React, { Ref } from 'react'

export interface ISheetContext {
  appendInstance: (
    renderFn: React.FC,
    options?: Partial<SheetOptions>,
  ) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
}

export interface SheetOptions {
  showMask: boolean
  maskColor: string
  useAnim: boolean
  useCloseAnim: boolean
  bottomOffset: number
}

export type UseSheet = {
  show: (renderFn: React.FC, options?: Partial<SheetOptions>) => number
  destroy: (id: number) => void
  destroyAll: () => void
}

export interface ISheetProviderProps {
  children: React.ReactNode
}

export type SheetInstance = {
  close: () => Promise<any>
}

export interface ISheetProps {
  children: React.ReactNode
  id: number
  options?: SheetOptions
  getInstance?: (instance: SheetInstance) => void
}