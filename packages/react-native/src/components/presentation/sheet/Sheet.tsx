import { useContextEvents } from '@hong97/collections-react'
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Dimensions, LayoutChangeEvent, StyleSheet } from 'react-native'
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler'
import Animated, { useSharedValue } from 'react-native-reanimated'

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
  if (
    options.type === 'Expandable' &&
    (options.expandThreshold === undefined ||
      options.expandTarget === undefined)
  ) {
    console.warn(
      '[Sheet] Expand threshold or expand target is not set, type is fallback to Hug.',
    )
    _type = 'Hug'
  }

  let initHeight = 0
  if (_type === 'Segment') {
    initHeight = options.segmentHeightList?.[0] || 0
  }

  /**
   * auto height is disabled when type is Segment
   *
   * for Hug type, auto height is always enabled
   *
   * for Expandable type, auto height is enabled before height being measured at first time
   * once init height is measured, we then use container height to control the sheet height
   */
  const [useAutoHeight, setUseAutoHeight] = useState(_type !== 'Segment')

  /**
   * General Refs
   */
  const layoutHeight = useRef<number | undefined>(undefined)
  const currentSegmentIndex = useRef(0)
  const expanded = useRef(false)
  const firstTimeMeasuredHeight = useRef(0)
  const fireShowAnimFn = useRef<() => any>(() => null)
  /**
   * Anim Refs
   */
  const zIndex = useSharedValue(-1)
  const opacity = useSharedValue(0)
  const top = useSharedValue(0)
  const maskZIndex = useSharedValue(-1)
  const maskOpacity = useSharedValue(0)
  const containerHeight = useSharedValue(initHeight)

  const { addEventListener, removeEventListener, onEvent } =
    useContextEvents<ISheetInstanceEvents>()

  /**
   * start a close anim
   * notice this only schedule an anim
   * but won't destroy the sheet instance
   */
  const close = () =>
    new Promise(resolve => {
      /**
       * force using linear anim for mask opacity fade out
       * spring anim causes lag experience
       */
      startAnim(
        maskOpacity,
        0,
        {
          ...options,
          useLinearAnim: true,
          animationDuration: options.animationDuration / 2,
        },
        () => {
          maskZIndex.value = -1
        },
      )
      startAnim(top, HEIGHT, options, () => resolve(void 0))
    })

  const expand = useCallback(
    () => {
      if (
        !options.expandThreshold ||
        expanded.current ||
        !options.expandTarget ||
        !layoutHeight.current
      ) {
        return
      }
      if (firstTimeMeasuredHeight.current > options.expandThreshold) {
        const targetHeight = options.expandTarget
        const endY = HEIGHT - targetHeight - options.bottomOffset
        onEvent('onReadyEnableScrollView')
        startAnim(top, endY, options)
        startAnim(containerHeight, targetHeight, options, () => {
          expanded.current = true
        })
      }
    },
    // rest all all anim refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options, onEvent],
  )

  const handleSegmentChange = useCallback(() => {
    const targetHeight =
      options.segmentHeightList?.[currentSegmentIndex.current] || 0
    startAnim(containerHeight, targetHeight, options)
    /**
     * adjust top value manually
     * layout event is disabled for segment type for better performance
     * thus the top value won't be updated automatically
     */
    const endY = HEIGHT - targetHeight - options.bottomOffset
    startAnim(top, endY, options)
  }, [containerHeight, options, top])

  const handleFlingUp = useCallback(
    () => {
      switch (_type) {
        case 'Segment': {
          if (!options.segmentHeightList?.length || !containerHeight) {
            return
          }
          currentSegmentIndex.current = Math.min(
            options.segmentHeightList.length - 1,
            currentSegmentIndex.current + 1,
          )
          if (
            currentSegmentIndex.current ===
            options.segmentHeightList.length - 1
          ) {
            onEvent('onReadyEnableScrollView')
          }
          handleSegmentChange()
          break
        }
        case 'Expandable': {
          expand()
          break
        }
      }
    },
    // rest all all anim refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_type, options, handleSegmentChange, onEvent, expand],
  )

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
      /**
       * layout measure will be skipped in following scenarios
       * this prevents lag animation and for better performance
       */
      if (_type === 'Segment' && layoutHeight.current !== undefined) {
        return
      }
      if (
        _type === 'Expandable' &&
        layoutHeight.current !== undefined &&
        !expanded.current
      ) {
        return
      }

      const {
        nativeEvent: {
          layout: { height },
        },
      } = e

      /**
       * If layout height is not set, set it.
       * This means the sheet is not shown yet.
       * In this case, schedule an anim to show the sheet.
       */
      if (layoutHeight.current === undefined) {
        firstTimeMeasuredHeight.current = height

        /**
         * for Expandable type
         * based on the init height and expand threshold
         * we need to decide the correct height to show
         */
        let _height = height
        if (
          _type === 'Expandable' &&
          options.expandThreshold !== undefined &&
          !expanded.current
        ) {
          _height = Math.min(height, options.expandThreshold)
          if (height <= options.expandThreshold) {
            onEvent('onReadyEnableScrollView')
          }
        }

        // calculate the start and end position
        const startY = HEIGHT
        const endY = HEIGHT - _height - options.bottomOffset

        /**
         * for Expandable type
         * once the init height is measured
         * set the correct container height and disable auto height
         * this let us fully control the sheet height
         */
        containerHeight.value = _height
        setUseAutoHeight(false)

        /**
         * for Expandable type
         * we cannot fire an anim immediately
         * this is because we use setState to change container's height from 'auto' to 'containerHeight'
         * instead, we should fire this anim in an effect.
         */
        fireShowAnimFn.current = () => {
          // set sheet and mask visible
          zIndex.value = DEFAULT_Z_INDEX + id
          opacity.value = 1
          maskZIndex.value = DEFAULT_Z_INDEX + id
          startAnim(maskOpacity, 1, options)
          top.value = startY
          startAnim(top, endY, options)
        }
        if (_type !== 'Expandable') {
          fireShowAnimFn.current()
        }

        layoutHeight.current = height
      }

      /**
       * if layout height hasn't changed, do nothing
       * notice that layout height might be not precise
       * thus use Math.abs to compare
       */
      if (Math.abs(height - layoutHeight.current) < 1) {
        return
      }

      // If the layout height is changed, update the top value
      if (
        layoutHeight.current !== undefined &&
        Math.abs(height - layoutHeight.current) > 1
      ) {
        const endY = HEIGHT - height - options.bottomOffset
        top.value = endY
        layoutHeight.current = height
      }
    },
    // rest all all anim refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_type, options, id, onEvent],
  )

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
    expand,
    options,
  })

  useEffect(() => {
    if (
      _type === 'Hug' ||
      (_type === 'Segment' && options.segmentHeightList?.length === 1)
    ) {
      onEvent('onReadyEnableScrollView')
    }
  }, [_type, onEvent, options])

  useEffect(() => {
    if (_type === 'Expandable' && useAutoHeight === false) {
      fireShowAnimFn.current()
    }
  }, [_type, useAutoHeight])

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
              height: useAutoHeight ? 'auto' : containerHeight,
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
