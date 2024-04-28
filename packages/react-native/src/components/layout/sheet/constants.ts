import { SheetOptions } from './types'

export const DEFAULT_SHEET_OPTIONS: SheetOptions = {
  showMask: true,
  maskAnim: true,
  maskColor: 'rgba(0, 0, 0, 0.75)',
  useAnim: true,
  useSpringAnim: false,
  animationDuration: 200,
  useCloseAnim: false,
  bottomOffset: 0,
}

export const DEFAULT_CONTEXT = {
  appendInstance: () => -1,
  dropInstance: () => null,
  dropAllInstances: () => null,
}
