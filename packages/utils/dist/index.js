// src/macroTask.ts
function wrapFn(fn, timeOut, args) {
  const timers = this.timers;
  return new Promise((resolve) => {
    timers.push(
      setTimeout(() => {
        resolve(fn.apply(null, args));
      }, timeOut)
    );
  });
}
function runPromiseSequently(queue) {
  const task = queue.shift();
  if (!task) {
    return;
  }
  const { fn, timeOut, args } = task;
  const promisifiedFn = wrapFn.call(this, fn, timeOut, args);
  promisifiedFn.then(() => runPromiseSequently.call(this, queue));
}
function macroTask(fn, timeOut = 0, ...fnArgs) {
  const queue = [];
  let start = false;
  const ctx = {
    timers: []
  };
  function stop() {
    ctx.timers.forEach(clearTimeout);
    queue.length = 0;
  }
  return function run(fn2, timeOut2, ...fnArgs2) {
    queue.push({
      fn: fn2,
      timeOut: timeOut2,
      args: fnArgs2
    });
    if (!start) {
      runPromiseSequently.call(ctx, queue);
      start = true;
    }
    return {
      next: (fn3, timeOut3 = 0, ...fnArgs3) => run(fn3, timeOut3, ...fnArgs3),
      stop
    };
  }(fn, timeOut, ...fnArgs);
}
export {
  macroTask
};
