import { macroTask } from '@hong97/collections-utils'
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
  Keyboard,
  Platform,
  ScrollView,
  ScrollViewProps,
} from 'react-native'

const WINDOW_HEIGHT = Dimensions.get('window').height

export const KeyboardAvoidingScrollViewContext = createContext<
  | {
      focusElem: (elem: any) => void
    }
  | undefined
>(undefined)

interface IKeyboardAvoidingScrollView extends ScrollViewProps {
  bottomOffset?: number
  enable?: boolean
}

export const KeyboardAvoidingScrollView: React.FC<
  IKeyboardAvoidingScrollView
> = props => {
  const {
    bottomOffset = 0,
    keyboardShouldPersistTaps = 'handled',
    keyboardDismissMode = 'on-drag',
    children,
    enable = true,
    onScroll,
    ...rest
  } = props

  const scrollViewRef = useRef<ScrollView>(null)

  const containerHeight = useRef<number | undefined>(undefined)
  const scrollPosY = useRef<number>(0)
  const topToContainer = useRef<number>(0)
  const bottomToWindow = useRef<number>(0)
  const lock = useRef<boolean>(false)
  const measureTasks = useRef<Promise<void> | undefined>(undefined)
  const bottomAnimRef = useRef(new Animated.Value(0))

  const handleFocusElem = useCallback((elem: any) => {
    elem.measureLayout(scrollViewRef.current, (_, top) => {
      topToContainer.current = containerHeight.current
        ? top - scrollPosY.current
        : 0
    })
    measureTasks.current = new Promise(resolve => {
      elem.measureInWindow((left, top, width, height) => {
        bottomToWindow.current = WINDOW_HEIGHT - top - height - bottomOffset
        resolve()
      })
    })
  }, [])

  const handleLayout = useCallback(e => {
    containerHeight.current = e?.nativeEvent?.layout?.height
  }, [])

  const handleScroll = useCallback((e: any) => {
    scrollPosY.current = e?.nativeEvent?.contentOffset?.y || 0
    onScroll?.(e)
  }, [])

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    Keyboard.addListener(showEvent, e => {
      if (lock.current) {
        return
      }
      lock.current = true
      const keyboardHeight = e.endCoordinates.height
      Animated.timing(bottomAnimRef.current, {
        toValue: keyboardHeight + bottomOffset,
        duration: 0,
        useNativeDriver: false,
      }).start()
      measureTasks.current?.then(() => {
        macroTask(() => {
          scrollViewRef.current?.scrollTo({
            y: scrollPosY.current - (bottomToWindow.current - keyboardHeight),
          })
        }, 0)
      })
    })
    Keyboard.addListener(hideEvent, () => {
      lock.current = false
      Animated.timing(bottomAnimRef.current, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start()
    })
    return () => {
      lock.current = false
      measureTasks.current = undefined
      Keyboard.removeAllListeners(showEvent)
      Keyboard.removeAllListeners(hideEvent)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      focusElem: handleFocusElem,
    }),
    [handleFocusElem],
  )

  if (!enable) {
    return <ScrollView {...rest}>{children}</ScrollView>
  }

  return (
    <KeyboardAvoidingScrollViewContext.Provider value={contextValue}>
      <ScrollView
        {...rest}
        ref={scrollViewRef}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={keyboardDismissMode}
        onLayout={handleLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={{
            paddingBottom: bottomAnimRef.current,
          }}
        >
          {children}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingScrollViewContext.Provider>
  )
}
