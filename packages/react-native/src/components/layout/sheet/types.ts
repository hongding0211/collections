import React from 'react'

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
  useSpringAnim: boolean
  animationDuration: number
  useCloseAnim: boolean
  bottomOffset: number
  onPressMask?: () => void
}

export type UseSheet = {
  show: (renderFn: React.FC, options?: Partial<SheetOptions>) => number
  destroy: (id: number) => void
  destroyAll: () => void
}

export interface ISheetProviderProps {
  children: React.ReactNode
  /**
   * Only allow one instance of sheet to be shown at a time.
   */
  monoInstance?: boolean
}

export type SheetInstance = {
  close: () => Promise<any>
}

export interface ISheetProps {
  children: React.ReactNode
  id: number
  options?: SheetOptions
  getInstance?: (instance: SheetInstance) => void
  onPressMask?: () => void
}
