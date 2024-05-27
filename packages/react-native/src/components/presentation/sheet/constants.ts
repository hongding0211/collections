import { DEFAULT_ANIMATION_OPTIONS } from '../../../utils'
import { ISheetInstanceContext, SheetOptions } from './types'

export const DEFAULT_SHEET_OPTIONS: SheetOptions = {
  type: 'Hug',
  maxHeight: Infinity,
  showMask: true,
  maskColor: 'rgba(0, 0, 0, 0.75)',
  bottomOffset: 0,
  ...DEFAULT_ANIMATION_OPTIONS,
}

export const DEFAULT_SHEET_INSTANCE_CONTEXT: ISheetInstanceContext = {
  addEventListener: () => null,
  removeEventListener: () => null,
}
