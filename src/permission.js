import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { notification } from 'ant-design-vue'
import { ACCESS_TOKEN, CURRENT_TOP_MENU } from '@/store/mutation-types'

import { getSessionStorage, setSessionStorage } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult', 'portalClient'] // no redirect whitelist
// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      // next({ path: '/dashboard/workplace' })
      next()
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store
          .dispatch('GetInfo')
          .then(() => {
            // 先获取主菜单
            store.dispatch('GetTopMenu').then(() => {
              let currentTopMenu = getSessionStorage(CURRENT_TOP_MENU)
              if (!currentTopMenu) {
                const topMenu = store.getters.topMenuList

                currentTopMenu = (topMenu[0] && topMenu[0].id) || '1'
                setSessionStorage(CURRENT_TOP_MENU, currentTopMenu)
              }
              // 调用 vuex 的 从后端获取用户的路由菜单，动态添加可访问路由表
              store.dispatch('GenerateRoutes', { currentTopMenu: currentTopMenu }).then(() => {
                // 把已获取到的路由菜单加入到路由表中
                const route = store.getters.addRouters
                let routeMap = []
                for (const key in route) {
                  routeMap = routeMap.concat(route[key])
                }
                routeMap.push(notFoundRouter)
                router.addRoutes(routeMap)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      if (to.fullPath !== '/' && to.fullPath !== '') {
        next({ path: '/user/login', query: { redirect: to.fullPath } })
      } else {
        next({ path: '/portalClient/index' })
      }
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
