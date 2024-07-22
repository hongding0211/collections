import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS, useSharedValue } from 'react-native-reanimated'

import { ScrollViewContainerContext } from './ScrollViewContainerContext'
import {
  CellMeta,
  IScrollViewContainerContext,
  ScrollViewContainerProps,
} from './types'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export const ScrollViewContainer: React.FC<
  ScrollViewContainerProps
> = props => {
  const { children } = props

  const _idx = useRef(0)

  const gesture = Gesture.Pan()

  const cells = useSharedValue<CellMeta[]>([])

  const contextValue = useRef<IScrollViewContainerContext>({
    register: () => {
      runOnJS(() => {
        cells.modify(v => [
          ...v,
          {
            height: 0,
          },
        ])
      })
      return _idx.current++
    },
    setHeight: (idx, height) => {
      console.log('!!👉 ScrollViewContainer.tsx: 29', idx, height)
    },
  })

  return (
    <ScrollViewContainerContext.Provider value={contextValue.current}>
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>{children}</View>
      </GestureDetector>
    </ScrollViewContainerContext.Provider>
  )
}
