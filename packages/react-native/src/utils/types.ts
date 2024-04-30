import { Animated } from 'react-native'

export interface AnimationOptions {
  useAnim: boolean
  useLinearAnim: boolean
  animationDuration: number
  springConfig?: Partial<Animated.SpringAnimationConfig>
}
