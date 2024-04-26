import React, { useRef } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native'

import { ISheetProps } from './types'

const DEFAULT_Z_INDEX = 10000

const { height: HEIGHT } = Dimensions.get('screen')

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
})

export const Sheet: React.FC<ISheetProps> = props => {
  const { id, children, options, getInstance, onPressMask } = props

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

  const maskZIndex = useRef(new Animated.Value(-1)).current

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

    // calculate the start and end position
    const startY = HEIGHT
    const endY = HEIGHT - height - options.bottomOffset

    // set sheet and mask visible
    zIndex.setValue(DEFAULT_Z_INDEX + id)
    maskZIndex.setValue(DEFAULT_Z_INDEX + id)
    opacity.setValue(1)

    if (options.useAnim) {
      // schedule an anim if useAnim is enabled
      top.setValue(startY)
      Animated.spring(top, {
        toValue: endY,
        useNativeDriver: false,
      }).start()
    } else {
      top.setValue(endY)
    }
  }

  // start a close anim
  const close = () =>
    new Promise(resolve => {
      maskZIndex.setValue(-1)
      Animated.spring(top, {
        toValue: HEIGHT,
        useNativeDriver: false,
      }).start(resolve)
    })

  getInstance?.({
    close,
  })

  return (
    <>
      {!!options.showMask && (
        <Animated.View
          style={[
            styles.mask,
            {
              backgroundColor: options.maskColor,
              zIndex: maskZIndex,
            },
          ]}
          onTouchEnd={onPressMask}
        />
      )}
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
    </>
  )
}
