import React, { forwardRef, useRef } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native'

import { ISheetProps, SheetInstance } from './types'

const DEFAULT_Z_INDEX = 10000

const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen')

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})

export const Sheet = forwardRef<SheetInstance, ISheetProps>((props, ref) => {
  const { id, children, options, getInstance } = props

  /**
   * General Refs
   */
  const hasLayoutMeasured = useRef(false)

  /**
   * Anim Refs
   */
  const zIndex = useRef(new Animated.Value(-1)).current
  const opacity = useRef(new Animated.Value(0)).current
  const top = useRef(new Animated.Value(0)).current

  const handleLayout = (e: LayoutChangeEvent) => {
    if (hasLayoutMeasured.current) {
      return
    }
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e
    hasLayoutMeasured.current = true
    // schedule a anim
    const startY = HEIGHT
    const endY = HEIGHT - height - options.bottomOffset
    zIndex.setValue(DEFAULT_Z_INDEX + id)
    opacity.setValue(1)
    if (options.useAnim) {
      top.setValue(startY)
      Animated.spring(top, {
        toValue: endY,
        useNativeDriver: false,
      }).start()
    } else {
      top.setValue(endY)
    }
  }

  const close = () =>
    new Promise(resolve => {
      Animated.spring(top, {
        toValue: HEIGHT,
        useNativeDriver: false,
      }).start(resolve)
    })

  getInstance?.({
    close,
  })

  return (
    <Animated.View
      style={[
        styles.sheetContainer,
        {
          zIndex,
          opacity,
          top,
        },
      ]}
    >
      <View onLayout={handleLayout}>{children}</View>
    </Animated.View>
  )
})
