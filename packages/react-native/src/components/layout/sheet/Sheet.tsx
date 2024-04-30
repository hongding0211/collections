import { useContextEvents } from '@hong97/collections-react'
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native'
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler'

import { startAnim } from '../../../utils'
import { DEFAULT_SHEET_INSTANCE_CONTEXT } from './constants'
import {
  ISheetInstanceContext,
  ISheetInstanceEvents,
  ISheetProps,
} from './types'

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

export const SheetInstanceContext = createContext<ISheetInstanceContext>(
  DEFAULT_SHEET_INSTANCE_CONTEXT,
)

export const Sheet: React.FC<ISheetProps> = props => {
  const { id, children, options, getInstance, onPressMask, onFlingClose } =
    props

  let _type = options.type
  if (options.type === 'Segment' && options.segmentHeightList === undefined) {
    console.warn(
      '[Sheet] Segment height list is not set, type is fallback to Hug.',
    )
    _type = 'Hug'
  }

  const initHeight = _type === 'Hug' ? 0 : options.segmentHeightList?.[0] || 0

  /**
   * General Refs
   */
  const layoutHeight = useRef<number | undefined>(undefined)
  const currentSegmentIndex = useRef(0)
  /**
   * Anim Refs
   */
  const zIndex = useRef(new Animated.Value(-1)).current
  const opacity = useRef(new Animated.Value(0)).current
  const top = useRef(new Animated.Value(0)).current
  const maskZIndex = useRef(new Animated.Value(-1)).current
  const maskOpacity = useRef(new Animated.Value(0)).current
  const containerHeight = useRef(new Animated.Value(initHeight)).current

  const { addEventListener, removeEventListener, onEvent } =
    useContextEvents<ISheetInstanceEvents>()

  const handleSegmentChange = useCallback(() => {
    const targetHeight =
      options.segmentHeightList?.[currentSegmentIndex.current] || 0
    startAnim(containerHeight, targetHeight, options)
    // adjust top value manually
    // layout event is disabled for segment type for better performance
    // thus the top value won't be updated automatically
    const endY = HEIGHT - targetHeight - options.bottomOffset
    startAnim(top, endY, options)
  }, [containerHeight, options, top])

  const handleFlingUp = useCallback(() => {
    if (
      _type !== 'Segment' ||
      !options.segmentHeightList?.length ||
      !containerHeight
    ) {
      return
    }
    currentSegmentIndex.current = Math.min(
      options.segmentHeightList.length - 1,
      currentSegmentIndex.current + 1,
    )
    if (currentSegmentIndex.current === options.segmentHeightList.length - 1) {
      onEvent('onReadyEnableScrollView')
    }
    handleSegmentChange()
  }, [_type, containerHeight, options, handleSegmentChange, onEvent])

  const handleFlingDown = useCallback(() => {
    if (currentSegmentIndex.current === 0) {
      onFlingClose?.()
      return
    }
    currentSegmentIndex.current = Math.max(0, currentSegmentIndex.current - 1)
    handleSegmentChange()
  }, [handleSegmentChange, onFlingClose])

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      // for type which isn't Hug,
      // layout measurement is not needed except the first time (to calculate the correct top value)
      if (_type !== 'Hug' && layoutHeight.current !== undefined) {
        return
      }

      const {
        nativeEvent: {
          layout: { height },
        },
      } = e

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
        startAnim(maskOpacity, 1, options)

        top.setValue(startY)
        startAnim(top, endY, options)

        layoutHeight.current = height
      }

      // layout height might be not precise
      // thus use Math.abs to compare
      if (Math.abs(height - layoutHeight.current) < 1) {
        return
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
    },
    [
      _type,
      layoutHeight,
      options,
      id,
      maskOpacity,
      maskZIndex,
      top,
      opacity,
      zIndex,
    ],
  )

  // start a close anim
  const close = () =>
    new Promise(resolve => {
      // force using linear anim for mask opacity fade out
      // spring anim cause lag experience
      startAnim(
        maskOpacity,
        0,
        {
          ...options,
          useLinearAnim: true,
          animationDuration: options.animationDuration / 2,
        },
        () => {
          maskZIndex.setValue(-1)
        },
      )
      startAnim(top, HEIGHT, options, resolve)
    })

  /**
   * Using a ref to store the gesture instance,
   * multi instances cause crash and God knows why. :D
   */
  const flingUpGesture = useRef(
    Gesture.Fling().direction(Directions.UP).onEnd(handleFlingUp),
  ).current
  const flingDownGesture = useRef(
    Gesture.Fling().direction(Directions.DOWN).onEnd(handleFlingDown),
  ).current
  const gesture = Gesture.Exclusive(flingUpGesture, flingDownGesture)

  const sheetInstanceContextValue = useMemo(
    () => ({
      addEventListener,
      removeEventListener,
    }),
    [addEventListener, removeEventListener],
  )

  getInstance?.({
    close,
  })

  useEffect(() => {
    if (
      _type === 'Hug' ||
      (_type === 'Segment' && options.segmentHeightList?.length === 1)
    ) {
      onEvent('onReadyEnableScrollView')
    }
  }, [])

  return (
    <SheetInstanceContext.Provider value={sheetInstanceContextValue}>
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
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              zIndex,
              opacity,
              top,
              height: _type === 'Hug' ? 'auto' : containerHeight,
            },
          ]}
          onLayout={handleLayout}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </SheetInstanceContext.Provider>
  )
}
