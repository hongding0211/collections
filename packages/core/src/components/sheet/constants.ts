import { SheetOptions } from './types'

export const DEFAULT_SHEET_OPTIONS: SheetOptions = {
  showMask: true,
  maskColor: 'rgba(0, 0, 0, 0.2)',
  useAnim: true,
  useCloseAnim: false,
  bottomOffset: 0,
  onPressMask: () => void 0,
}

export const DEFAULT_CONTEXT = {
  appendInstance: () => -1,
  dropInstance: () => null,
  dropAllInstances: () => null,
}
