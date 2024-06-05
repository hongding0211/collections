import { ContextEventsValue } from '@hong97/collections-react'
import React from 'react'
import { ScrollViewProps } from 'react-native'

import { AnimationOptions } from '../../../utils'
import { IPortalInstance } from '../../core'

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
  close: (id: number) => void
  getInstance: (id: number) => ISheetInstance | undefined
}

export interface ISheetInstance extends IPortalInstance {
  close: () => Promise<any>
  expand: () => void
  options: SheetOptions
}

export interface ISheetProps {
  children: React.ReactNode
  id: number
  options: SheetOptions
  getInstance?: (instance: ISheetInstance) => void
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
