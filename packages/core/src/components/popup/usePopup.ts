import { useContext } from 'react'
import { PopupContext } from './PopupContext'
import { UsePopup } from './types'

export function usePopup(): UsePopup {
  const popupContext = useContext(PopupContext)
  const { appendInstance, dropInstance, dropAllInstances } = popupContext

  return {
    show: appendInstance,
    destroy: dropInstance,
    destroyAll: dropAllInstances,
  }
}
