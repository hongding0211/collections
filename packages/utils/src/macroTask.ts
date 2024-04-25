type F = (...args: any) => any
type Task = {
  fn: F
  timeOut: number
  args: any[]
}

interface ICtx {
  timers: any[]
}

function wrapFn(this: ICtx, fn: F, timeOut: number, args: any[]) {
  const timers = this.timers
  return new Promise(resolve => {
    timers.push(
      setTimeout(() => {
        resolve(fn.apply(null, args))
      }, timeOut),
    )
  })
}

function runPromiseSequently(this: ICtx, queue: Task[]) {
  const task = queue.shift()
  if (!task) {
    return
  }
  const { fn, timeOut, args } = task
  const promisifiedFn = wrapFn.call(this, fn, timeOut, args)
  promisifiedFn.then(() => runPromiseSequently.call(this, queue))
}

function macroTask(fn: F, timeOut = 0, ...fnArgs: any) {
  const queue: Task[] = []
  let start = false
  const ctx: ICtx = {
    timers: [],
  }

  function stop() {
    ctx.timers.forEach(clearTimeout)
    queue.length = 0
  }

  return (function run(fn: F, timeOut: number, ...fnArgs: any) {
    queue.push({
      fn,
      timeOut,
      args: fnArgs,
    })
    if (!start) {
      runPromiseSequently.call(ctx, queue)
      start = true
    }
    return {
      next: (fn: F, timeOut = 0, ...fnArgs: any) => run(fn, timeOut, ...fnArgs),
      stop,
    }
  })(fn, timeOut, ...fnArgs)
}

export { macroTask }
