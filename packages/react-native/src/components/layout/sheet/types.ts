import { ContextEventsValue } from '@hong97/collections-react'
import React from 'react'
import { ScrollViewProps } from 'react-native'

import { AnimationOptions } from '../../../utils'

export interface ISheetContext {
  appendInstance: (
    renderFn: React.FC,
    options?: Partial<SheetOptions>,
  ) => number
  dropInstance: (id: number) => void
  dropAllInstances: () => void
  getInstance: (id: number) => SheetInstance | undefined
}

export interface SheetOptions extends AnimationOptions {
  type: 'Hug' | 'Segment' | 'Expandable'
  maxHeight: number
  segmentHeightList?: number[]
  expandThreshold?: number
  expandTarget?: number
  showMask: boolean
  maskColor: string
  bottomOffset: number
  onPressMask?: () => void
  onFlingClose?: () => void
}

export type UseSheet = {
  show: (renderFn: React.FC, options?: Partial<SheetOptions>) => number
  destroy: (id: number) => void
  destroyAll: () => void
  getInstance: (id: number) => SheetInstance | undefined
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
  expand: () => void
}

export interface ISheetProps {
  children: React.ReactNode
  id: number
  options: SheetOptions
  getInstance?: (instance: SheetInstance) => void
  onPressMask?: () => void
  onFlingClose?: () => void
}

export interface ISheetInstanceEvents {
  onReadyEnableScrollView: undefined
}

export interface ISheetInstanceContext
  extends ContextEventsValue<ISheetInstanceEvents> {}

export interface ISheetScrollViewProps
  extends Omit<ScrollViewProps, 'scrollEnabled'> {}
