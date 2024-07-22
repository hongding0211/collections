export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const shallowCopy = { ...obj }
  keys.forEach(key => {
    delete shallowCopy[key]
  })
  return shallowCopy
}
