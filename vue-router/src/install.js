import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) { // install 方法
  if (install.installed && _Vue === Vue) return
  install.installed = true // 判断是否加载

  _Vue = Vue

  const isDef = v => v !== undefined // 是否为undefined
  // undefined === undefined
  // true
  // null === null
  // true
  // NaN === NaN
  // false

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode // 父组件节点
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) { // 判断是否为根组件
        this._routerRoot = this // 赋值根组件
        this._router = this.$options.router // 赋值router
        this._router.init(this) // 初始化
        Vue.util.defineReactive(this, '_route', this._router.history.current) // 双向绑定 
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this // 确定父路由
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', { // 双向数据 绑定
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', { // 双向数据 绑定
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
