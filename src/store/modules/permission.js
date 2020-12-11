import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter, generatorGetTopMenu } from '@/utils/routerUtil'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: {},
    allTopMenus: {},
    topMenuList: []
  },
  mutations: {
    SET_ROUTERS: (state, params) => {
      state.addRouters = params.routers.routersByTopMenu
      state.allTopMenus = params.routers.allTopMenus
      state.routers = constantRouterMap.concat(params.routers[params.data.currentTopMenu])
    },
    SET_TOP_ROUTERS: (state, topMenuList) => {
      state.topMenuList = topMenuList
    }
  },
  actions: {
    /**
     * 构建获取和构建路由和菜单信息
     * @param commit
     * @param data
     * @returns {Promise<any>}
     * @constructor
     */
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        generatorDynamicRouter(data).then(routers => {
          commit('SET_ROUTERS', { routers, data })
          resolve()
        })
      })
    },
    /**
     * 获取主菜单信息
     * @param commit
     * @param data
     * @returns {Promise<any>}
     * @constructor
     */
    GetTopMenu({ commit }, data) {
      return new Promise(resolve => {
        generatorGetTopMenu(data).then(topMenuList => {
          commit('SET_TOP_ROUTERS', topMenuList)
          resolve()
        })
      })
    }
  }
}

export default permission
