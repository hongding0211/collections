import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'

import { SheetInstanceContext } from './Sheet'
import { ISheetScrollViewProps } from './types'

export const SheetScrollView: React.FC<ISheetScrollViewProps> =
  React.forwardRef<ScrollView, ISheetScrollViewProps>((props, ref) => {
    const { onScroll, scrollEventThrottle = 16, ...restProps } = props

    const [scrollEnabled, setScrollEnabled] = useState(false)

    const sheetInstanceContext = useContext(SheetInstanceContext)
    const { addEventListener, removeEventListener } = sheetInstanceContext

    const handleScroll = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        /**
         * Fling gesture is temporarily disabled when the sheet is expanded to max height
         * due to lack of react native reanimated support.
         *
         * This feature will be enabled in the future.
         */
        // const offsetY = e.nativeEvent.contentOffset.y
        // if (offsetY <= 0) {
        //   setScrollEnabled(false)
        // }
        onScroll?.(e)
      },
      [onScroll],
    )

    useEffect(() => {
      addEventListener('onReadyEnableScrollView', () => {
        setScrollEnabled(true)
      })
      return () => {
        removeEventListener('onReadyEnableScrollView')
      }
    }, [addEventListener, removeEventListener])

    return (
      <ScrollView
        {...restProps}
        ref={ref}
        onScroll={handleScroll}
        scrollEnabled={scrollEnabled}
        scrollEventThrottle={scrollEventThrottle}
      />
    )
  })
