export class SyncDataProxy {
  private getter: (key: string) => any

  private setter: (key: string, value: any) => void

  private initFn?: (key: string) => void

  constructor(
    getter: (key: string) => any,
    setter: (key: string, value: any) => void,
    init?: (key: string) => void,
  ) {
    this.getter = getter
    this.setter = setter
    this.initFn = init
  }

  get(key: string) {
    return this.getter(key)
  }

  set(key: string, value: any) {
    this.setter(key, value)
  }

  init(key: string) {
    this.initFn?.(key)
  }
}

export class SyncObject<T extends Record<string, any>> {
  private key: string

  private proxy: SyncDataProxy

  private cachedValue?: T

  constructor(key: string, proxy: SyncDataProxy) {
    this.key = key
    this.proxy = proxy
    this.proxy.init(this.key)
  }

  get(): T {
    if (this.cachedValue === undefined) {
      this.cachedValue = this.proxy.get(this.key)
    }
    return this.cachedValue
  }

  set(value: Partial<T>): void

  set(fn: (value: T) => Partial<T>): void

  set(valueOrFn: Partial<T> | ((value: T) => Partial<T>)) {
    const oldValue = this.get()
    const updates =
      typeof valueOrFn === 'function' ? valueOrFn(oldValue) : valueOrFn

    const newValue = { ...oldValue, ...updates }
    this.proxy.set(this.key, newValue)
    this.cachedValue = newValue
  }
}
