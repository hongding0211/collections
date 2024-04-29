/**
 * 在一段时间内快速调用（时间间隔不大于 span）该函数后 n 次才触发
 * 可以在 debug 时使用
 * @parm fn - 在 count 次调用后才触发的函数
 * @param [fnInvokedWhenCalledOnce] - 每次调用都会触发的函数
 * @param [span=100] - 时间间隔
 * @param [count=5] - 调用次数
 */
export function smashHit(
  fn: () => void,
  fnInvokedWhenCalledOnce?: (...args: any) => void,
  span = 200,
  count = 5,
): (...args: any) => void {
  let n = count
  let lastInvoked: undefined | number

  return function smashHitFn(...args: any) {
    if (!lastInvoked) {
      setTimeout(() => {
        if (!lastInvoked || Date.now() - lastInvoked > span) {
          lastInvoked = undefined
          if (typeof fnInvokedWhenCalledOnce === 'function') {
            fnInvokedWhenCalledOnce(...args)
          }
        }
      }, span * 2)
    }
    if (lastInvoked && Date.now() - lastInvoked > span) {
      n = count
      lastInvoked = undefined
      return
    }
    lastInvoked = Date.now()
    if (n > 0) {
      n--
    } else {
      setTimeout(() => {
        lastInvoked = undefined
      }, span * 2)
      n = count
      fn()
    }
  }
}
