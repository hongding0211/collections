import {
  SharedValue,
  runOnJS,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { AnimationOptions } from './types'

export function startAnim(
  anim: SharedValue<number>,
  toValue: number,
  options: AnimationOptions,
  onFinish: () => void = () => undefined,
) {
  if (options.useAnim && options.useLinearAnim) {
    anim.value = withTiming(
      toValue,
      {
        duration: options.animationDuration,
      },
      () => {
        runOnJS(onFinish)()
      },
    )
  }
  if (options.useAnim && !options.useLinearAnim) {
    anim.value = withSpring(toValue, options.springConfig, () => {
      runOnJS(onFinish)()
    })
  }
  if (!options.useAnim) {
    anim.value = toValue
    runOnJS(onFinish)()
  }
}
