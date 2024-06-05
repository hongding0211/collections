import { WithSpringConfig } from 'react-native-reanimated'

export interface AnimationOptions {
  useAnim: boolean
  useLinearAnim: boolean
  animationDuration: number
  springConfig?: Partial<WithSpringConfig>
}
