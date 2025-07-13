export class AsyncSyncDataProxy {
  private getter: (key: string) => Promise<any>

  private setter: (key: string, value: any) => Promise<void>

  private initFn?: (key: string) => Promise<void>

  constructor(
    getter: (key: string) => Promise<any>,
    setter: (key: string, value: any) => Promise<void>,
    init?: (key: string) => Promise<void>,
  ) {
    this.getter = getter
    this.setter = setter
    this.initFn = init
  }

  async get(key: string) {
    return this.getter(key)
  }

  async set(key: string, value: any) {
    await this.setter(key, value)
  }

  async init(key: string) {
    await this.initFn?.(key)
  }
}

export class AsyncSyncObject<T extends Record<string, any>> {
  private key: string

  private proxy: AsyncSyncDataProxy

  private hasInit = false

  private cachedValue?: T

  constructor(key: string, proxy: AsyncSyncDataProxy) {
    this.key = key
    this.proxy = proxy
  }

  private async _init() {
    await this.proxy.init(this.key)
    this.hasInit = true
  }

  async get(): Promise<T> {
    if (!this.hasInit) {
      await this._init()
    }

    if (this.cachedValue === undefined) {
      this.cachedValue = await this.proxy.get(this.key)
    }

    return this.cachedValue
  }

  async set(value: Partial<T>): Promise<void>

  async set(fn: (value: T) => Partial<T>): Promise<void>

  async set(valueOrFn: Partial<T> | ((value: T) => Partial<T>)) {
    if (!this.hasInit) {
      await this._init()
    }

    const oldValue = await this.get()
    const updates =
      typeof valueOrFn === 'function' ? valueOrFn(oldValue) : valueOrFn

    const newValue = { ...oldValue, ...updates }
    await this.proxy.set(this.key, newValue)
    this.cachedValue = newValue
  }
}
