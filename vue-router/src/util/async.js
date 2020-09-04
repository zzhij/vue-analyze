/* @flow */

export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) { // 次序执行后，调用回调函数
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
