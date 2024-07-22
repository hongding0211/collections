import { useOnce } from '@hong97/collections-react'
import { omit } from '@hong97/collections-utils'
import React, { useCallback, useContext, useRef } from 'react'
import Animated from 'react-native-reanimated'

import { ScrollViewContainerContext } from './ScrollViewContainerContext'
import { ScrollViewProps } from './types'

export const ScrollView: React.FC<ScrollViewProps> = props => {
  const { onContentSizeChange, ...restProps } = props

  const downgradeProps = omit(restProps, ['scrollEnabled'])

  const { register, setHeight } = useContext(ScrollViewContainerContext)

  const key = useRef(-1)

  useOnce(() => {
    key.current = register()
  })

  const handleContentSizeChanged = useCallback(
    (width: number, height: number) => {
      setHeight(key.current, height)
      if (typeof onContentSizeChange === 'function') {
        onContentSizeChange(width, height)
      }
    },
    [onContentSizeChange, setHeight],
  )

  return (
    <Animated.ScrollView
      onContentSizeChange={handleContentSizeChanged}
      {...downgradeProps}
      scrollEnabled={false}
    />
  )
}
