<template>
  <a-layout :class="['layout', device]" id="backStageManagement">
    <!-- SideMenu -->
    <a-drawer v-if="isMobile()"
              placement="left"
              :wrapClassName="`drawer-sider ${navTheme}`"
              :closable="false"
              :visible="collapsed"
              @close="drawerClose">
      <side-menu mode="inline"
                 :menus="menus"
                 :theme="navTheme"
                 :collapsed="false"
                 :collapsible="true"
                 @menuSelect="menuSelect"></side-menu>
    </a-drawer>

    <side-menu v-else-if="isSideMenu()"
               mode="inline"
               :menus="menus"
               :theme="navTheme"
               :collapsed="collapsed"
               :collapsible="true"></side-menu>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]"
              :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <!-- layout header -->
      <global-header :mode="layoutMode"
                     :menus="menus"
                     :all-menus="allMenus"
                     :top-menu-list="topMenuList"
                     :all-top-menus="allTopMenus"
                     :theme="navTheme"
                     :collapsed="collapsed"
                     :device="device"
                     @toggle="toggle"
                     @handle-select-top-menu="handleSelectTopMenu" />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '64px' : '0px' }">
        <div :class="{ 'page-header-bg-countent': isTopMenu() }"></div>
        <div class="page-header-bg-box"
             v-if="isTopMenu()"></div>
        <multi-tab v-if="multiTab && isSideMenu ()"
                   ref="multiTab"
                   :currentTopMenu="currentTopMenu"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer>
        <global-footer />
      </a-layout-footer>

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent, getSessionStorage, setSessionStorage } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { updateTheme, updateColorWeak } from '@/components/SettingDrawer/settingConfig'
import { convertRoutes } from '@/utils/routeConvert'
import Vue from 'vue'
import { CURRENT_TOP_MENU } from '@/store/mutation-types'
import router from '@/router'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data() {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      allMenus: {}
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      allTopMenus: state => state.permission.allTopMenus,
      topMenuList: state => state.permission.topMenuList
    }),
    currentTopMenu: function () {
      for (let i = 0; i < this.topMenuList.length; i++) {
        if (`${this.topMenuList[i].id}` === `${getSessionStorage(CURRENT_TOP_MENU)}`) {
          return this.topMenuList[i]
        }
      }
      this.$message.error('没有找到对应的主菜单项')
      return {}
    },
    contentPaddingLeft() {
      if (!this.fixSidebar || this.isMobile() || this.layoutMode === 'topmenu') {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened(val) {
      this.collapsed = !val
    }
  },
  created() {
    // const routes = convertRoutes(this.mainMenu[getSessionStorage(CURRENT_TOP_MENU)].find(item => item.path === '/'))
    // this.menus = (routes && routes.children) || []

    const _this = this
    const allRoutes = {}
    Object.keys(this.mainMenu).forEach(topMenuId => {
      const routes = convertRoutes(this.mainMenu[topMenuId].find(item => item.path === '/'))
      if (`${topMenuId}` === `${getSessionStorage(CURRENT_TOP_MENU)}`) {
        _this.menus = (routes && routes.children) || []
      }
      allRoutes[topMenuId] = (routes && routes.children) || []
    })
    this.allMenus = allRoutes
    this.collapsed = !this.sidebarOpened
  },
  mounted() {
    updateTheme(this.primaryColor)
    updateColorWeak(this.colorWeak)
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar', 'GenerateRoutes']),
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc() {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || (this.fixSidebar && '80px') || '0'
      }
      return left
    },
    menuSelect() {
      // if (!this.isDesktop()) {
      //   this.collapsed = false
      // }
    },
    drawerClose() {
      this.collapsed = false
    },
    handleSelectTopMenu(topMenu) {
      const topMenuId = topMenu.id
      setSessionStorage(CURRENT_TOP_MENU, topMenuId)
      if (this.mainMenu[topMenuId] && this.mainMenu[topMenuId].length) {
        const routes = convertRoutes(this.mainMenu[topMenuId].find(item => item.path === '/'))
        this.menus = (routes && routes.children) || []
        this.$nextTick(() => {
          if (`${topMenu.multiTab}` === 'true') {
            this.$refs.multiTab.indexPage = {
              fullPath: topMenu.component,
              name: topMenu.code,
              meta: { title: topMenu.name },
              closable: false
            }
          } else {
            this.$router.push({ path: topMenu.component })
          }
        })
        // this.$router.push({ name: 'dashboard' })
      } else {
        const _this = this
        // 调用 vuex 的 从后端获取用户的路由菜单，动态添加可访问路由表
        this.GenerateRoutes({ currentTopMenu: topMenuId }).then(() => {
          // 把已获取到的路由菜单加入到路由表中
          const route = _this.mainMenu
          let routeMap = []
          for (const key in route) {
            routeMap = routeMap.concat(route[key])
          }
          router.addRoutes(routeMap)
          const routes = convertRoutes(_this.mainMenu[topMenuId].find(item => item.path === '/'))
          _this.menus = (routes && routes.children) || []
          _this.$nextTick(() => {
            if (`${topMenu.multiTab}` === 'true') {
              _this.$refs.multiTab.indexPage = {
                fullPath: topMenu.component,
                name: topMenu.code,
                meta: { title: topMenu.source },
                closable: false
              }
            } else {
              _this.$router.push({ path: topMenu.component })
            }
          })
          // this.$router.push({ name: 'dashboard' })
        })
      }
      // 切换导航模式及其他系统配置
      if (topMenu.layoutMode) {
        this.$store.dispatch('ToggleLayoutMode', topMenu.layoutMode)
      }
      if (topMenu.multiTab !== undefined && `${topMenu.multiTab}` !== `${this.multiTab}`) {
        if (`${topMenu.multiTab}` === 'true') {
          this.$store.dispatch('ToggleMultiTab', true)
        } else {
          this.$store.dispatch('ToggleMultiTab', false)
        }
      }
    }
  }
}
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
