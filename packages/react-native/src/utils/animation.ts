import { Animated } from 'react-native'

import { AnimationOptions } from './types'

export function startAnim(
  anim: Animated.Value,
  toValue: number,
  options: AnimationOptions,
  onFinish?: (...args: any) => any,
) {
  if (options.useAnim && options.useLinearAnim) {
    Animated.timing(anim, {
      toValue,
      duration: options.animationDuration,
      useNativeDriver: false,
    }).start(onFinish)
  }
  if (options.useAnim && !options.useLinearAnim) {
    Animated.spring(anim, {
      toValue,
      useNativeDriver: false,
      ...options.springConfig,
    }).start(onFinish)
  }
  if (!options.useAnim) {
    anim.setValue(toValue)
    onFinish?.()
  }
}
