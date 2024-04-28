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
  const layoutHeight = useRef<number | undefined>(undefined)
  /**
   * Anim Refs
   */
  const zIndex = useRef(new Animated.Value(-1)).current
  const opacity = useRef(new Animated.Value(0)).current
  const top = useRef(new Animated.Value(0)).current
  const maskZIndex = useRef(new Animated.Value(-1)).current
  const maskOpacity = useRef(new Animated.Value(0)).current

  const handleLayout = (e: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = e

    // layout height might be not precise
    // thus use Math.abs to compare
    if (Math.abs(height - layoutHeight.current) < 1) {
      return
    }

    // If layout height is not set, set it.
    // This means the sheet is not shown yet.
    // In this case, schedule an anim to show the sheet.
    if (layoutHeight.current === undefined) {
      // calculate the start and end position
      const startY = HEIGHT
      const endY = HEIGHT - height - options.bottomOffset

      // set sheet and mask visible
      zIndex.setValue(DEFAULT_Z_INDEX + id)
      opacity.setValue(1)
      maskZIndex.setValue(DEFAULT_Z_INDEX + id)
      if (options.maskAnim && options.useAnim) {
        maskOpacity.setValue(0)
        Animated.timing(maskOpacity, {
          toValue: 1,
          duration: options.animationDuration / 2,
          useNativeDriver: false,
        }).start()
      } else {
        maskOpacity.setValue(1)
      }

      if (options.useAnim) {
        top.setValue(startY)
        if (options.useSpringAnim) {
          Animated.spring(top, {
            toValue: endY,
            useNativeDriver: false,
          }).start()
        } else {
          Animated.timing(top, {
            toValue: endY,
            duration: options.animationDuration,
            useNativeDriver: false,
          }).start()
        }
      } else {
        top.setValue(endY)
      }
      layoutHeight.current = height
    }

    // If the layout height is changed, update the top value
    if (
      layoutHeight.current !== undefined &&
      Math.abs(height - layoutHeight.current) > 1
    ) {
      const endY = HEIGHT - height - options.bottomOffset
      top.setValue(endY)
      layoutHeight.current = height
    }
  }

  // start a close anim
  const close = () =>
    new Promise(resolve => {
      if (options.maskAnim) {
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: options.animationDuration / 2,
          useNativeDriver: false,
        }).start(() => {
          maskZIndex.setValue(-1)
        })
      } else {
        maskZIndex.setValue(-1)
      }
      if (options.useSpringAnim) {
        Animated.spring(top, {
          toValue: HEIGHT,
          useNativeDriver: false,
        }).start(resolve)
      } else {
        Animated.timing(top, {
          toValue: HEIGHT,
          duration: options.animationDuration,
          useNativeDriver: false,
        }).start(resolve)
      }
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
              opacity: maskOpacity,
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
