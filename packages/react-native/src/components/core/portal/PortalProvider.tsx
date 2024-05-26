import React, { useCallback, useMemo, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { PortalContext } from './PortalContext'
import { DEFAULT_PORTAL_OPTIONS } from './constants'
import { IPortalInstance, IPortalProviderProps, PortalOptions } from './types'

export const PortalProvider: React.FC<IPortalProviderProps> = props => {
  const { children } = props

  /**
   * An auto-increment counter to generate unique id for each portal instance.
   */
  const _cnt = useRef(0)

  /**
   * Why use a ref to store the render instance
   * instead of using state to directly trigger a re-render?
   *
   * State creates a closure, aka a snapshot.
   *
   *
   * Consider the following scenario:
   *
   * When a user invokes a show method to append a new portal instance,
   * you may pass some callbacks in the options,
   * such as destroying the portal in the onPressMask callback.
   *
   * The problem occurs here:
   * This callback captures a closure which is the state before the instance has been actually created,
   * where at this moment, the instance list has not been updated yet (does not include the instance you're about to create).
   *
   * Thus, when you try to destroy a portal instance,
   * dropInstance() will not be able to find the instance you just created.
   *
   * Therefore, to solve this problem, we use a ref to store all the instances.
   * Then we use setRenderCnt to manually trigger a re-render when it's necessary.
   */
  const [, setRenderCnt] = useState(0)
  const instanceMap = useRef<
    Map<
      number,
      {
        id: number
        renderInstance: React.ReactElement
        options: PortalOptions
        instance?: IPortalInstance
      }
    >
  >(new Map())

  const appendInstance = useCallback(
    (renderFn: React.FC<{ id: number }>, options?: Partial<PortalOptions>) => {
      const id = _cnt.current++
      const _options = options
        ? {
            ...DEFAULT_PORTAL_OPTIONS,
            ...options,
          }
        : DEFAULT_PORTAL_OPTIONS
      const renderInstance = React.createElement(renderFn, {
        key: id,
        id,
      })
      instanceMap.current.set(id, {
        id,
        renderInstance,
        options: _options,
      })
      setRenderCnt(r => r + 1)
      return id
    },
    [],
  )

  const dropInstance = useCallback((id: number) => {
    if (!instanceMap.current.has(id)) {
      return
    }
    const portal = instanceMap.current.get(id)!
    /**
     * if useAnim is enabled, then close the portal using exploded instance,
     * otherwise just drop its instance.
     */
    if (portal.options.useAnim) {
      portal.instance?.close().then(() => {
        instanceMap.current.delete(id)
        setRenderCnt(r => r + 1)
      })
    } else {
      instanceMap.current.delete(id)
      setRenderCnt(r => r + 1)
    }
  }, [])

  const dropAllInstances = useCallback(() => {
    instanceMap.current.clear()
    setRenderCnt(r => r + 1)
  }, [])

  const getInstance = useCallback((id: number) => {
    return instanceMap.current.get(id)?.instance || undefined
  }, [])

  const setInstance = useCallback((id: number, instance: IPortalInstance) => {
    if (!instanceMap.current.has(id)) {
      return
    }
    instanceMap.current.get(id)!.instance = instance
  }, [])

  const value = useMemo(
    () => ({
      appendInstance,
      dropInstance,
      dropAllInstances,
      getInstance,
      setInstance,
    }),
    [appendInstance, dropInstance, dropAllInstances, getInstance, setInstance],
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalContext.Provider value={value}>
        {[...instanceMap.current.values()].map(e => e.renderInstance)}
        {children}
      </PortalContext.Provider>
    </GestureHandlerRootView>
  )
}
