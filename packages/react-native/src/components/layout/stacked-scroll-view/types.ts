import React from 'react'
import { AnimatedScrollViewProps } from 'react-native-reanimated'

export interface ScrollViewContainerProps {
  children: React.ReactNode
}

export interface ScrollViewProps extends AnimatedScrollViewProps {}

export interface IScrollViewContainerContext {
  register: () => number
  setHeight: (key: number, height: number) => void
}

export type CellMeta = {
  height: number
}
