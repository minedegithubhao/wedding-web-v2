// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

/**
 * 这里不再保留原来默认的菜单asyncRouterMap
 * https://github.com/sendya/ant-design-pro-vue/blob/master/src/router/generator-routers.js
 */
export const defaultRouterMap = [
  {
    title: '首页',
    key: 'dashboard',
    // 'component': 'RouteView',
    hidden: true,
    component: 'PageView',
    redirect: '/dashboard/welcome',
    icon: bxAnaalyse,
    children: [
      //   // {
      // //   'title': '分析页',
      // //   'path': 'analysis/:pageNum([1-9]\\d*)?',
      // //   'key': 'analysis',
      // //   'icon': ''
      // // },
      {
        title: '主页',
        key: 'welcome',
        icon: ''
      }
      // // {
      // //   'title': '工作台',
      // //   'path': 'workplace',
      // //   'key': 'workplace',
      // //   'icon': ''
      // // }
    ]
  },
  {
    title: '个人页',
    key: 'account',
    component: 'PageView',
    hidden: true,
    icon: 'user',
    children: [
      // {
      //   'hiddenHeaderContent': true,
      //   'title': '个人中心',
      //   'key': 'center'
      // },
      {
        title: '个人设置',
        key: 'settings',
        hideChildrenInMenu: true,
        redirect: '/account/settings/base',
        children: [
          {
            hiddenHeaderContent: true,
            title: '基本信息',
            key: 'base'
          },
          {
            hiddenHeaderContent: true,
            title: '安全设置',
            key: 'security'
          },
          {
            hiddenHeaderContent: true,
            title: '个性化设置',
            key: 'custom'
          },
          {
            hiddenHeaderContent: true,
            title: '账户绑定',
            key: 'binding'
          },
          {
            hiddenHeaderContent: true,
            title: '新消息通知',
            key: 'notification'
          }
        ]
      }
    ]
  }
]
//
// /**
//  *
//  * 基础路由
//  * @type { *[] }
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/portalClient',
    component: BlankLayout,
    redirect: '/portalClient/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'portalClient',
        component: () => import(/* webpackChunkName: "user" */ '@/views/portalClient/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
