import { DEFAULT_ANIMATION_OPTIONS } from '../../../utils'
import { PortalOptions } from './types'

export const DEFAULT_PORTAL_OPTIONS: PortalOptions = {
  ...DEFAULT_ANIMATION_OPTIONS,
}

export const DEFAULT_CONTEXT = {
  appendInstance: () => -1,
  dropInstance: () => null,
  dropAllInstances: () => null,
  getInstance: () => undefined,
  setInstance: () => null,
}
