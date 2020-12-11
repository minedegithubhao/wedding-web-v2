<template>
  <a-layout :class="['pts-layout', device]" id="backStageManagement" :style="{minHeight: '100vh' }">
    <a-layout :class="[`content-width-${contentWidth}`]"
              :style="{ minHeight: '100vh' }">
      <!-- layout header -->
      <p-header :theme="navTheme"/>

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: '24px 24px 0', paddingTop: fixedHeader ? '81px' : '0px' }">
        <multi-tab v-if="multiTab && isSideMenu ()"
                   ref="multiTab"
                   :currentTopMenu="currentTopMenu"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer class="pts-footer">
        <p-footer :top-menu-list="topMenuList" :all-menus="allMenus" />
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
import PFooter from '@/components/pts/Layout/PFooter.vue'
import PHeader from '@/components/pts/Layout/PHeader.vue'
import SettingDrawer from '@/components/SettingDrawer'
import { updateTheme, updateColorWeak } from '@/components/SettingDrawer/settingConfig'
import { convertRoutes } from '@/utils/routeConvert'
import Vue from 'vue'
import { CURRENT_TOP_MENU } from '@/store/mutation-types'
import router from '@/router'

export default {
  name: 'PTSLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    PHeader,
    PFooter,
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
    // 添加新版PTS body类名
    document.body.classList.add('pts-body-layout')

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
.pts-layout {
  .page-header,
  .ant-layout-header,
  .ant-pro-multi-tab,
  .ant-pro-multi-tab .ant-tabs-tab,
  .ant-layout-footer,
  .content-width-Fixed {
    background-color: transparent !important;
  }
  .ant-pro-multi-tab {
    margin: 0 0 8px !important;
    .ant-tabs-nav-container {
      height: 50px !important;
      padding-right: 24px;
      padding-left: 24px;
    }
    .ant-tabs-tab-prev,
    .ant-tabs-tab-next {
      color: #fff;
      background: #051237;
      transition: all 0.3s;
      width: 24px;
      .ant-tabs-tab-prev-icon-target,
      .ant-tabs-tab-next-icon-target {
        font-size: 16px;
      }
      &.ant-tabs-tab-btn-disabled {
        color: #909090;
      }
      &:hover:not(.ant-tabs-tab-btn-disabled) {
        background-color: @primary-color;
      }
    }
    .ant-tabs-tab {
      height: 30px !important;
      line-height: 30px !important;
      border-radius: 0px !important;
      border: solid 1px #3d69d7 !important;
      background-color: #051237 !important;
      margin-right: 8px !important;
      &,
      .anticon-close {
        color: #7ca2f2 !important;
      }
      letter-spacing: 1px;
      &.ant-tabs-tab-active {
        border: solid 1px #37f3ff !important;
        &,
        .anticon-close {
          color: #37f3ff !important;
        }
      }
    }
    .ant-tabs-nav-wrap {
      background: #0d1244 !important;
      opacity: 0.7;
      padding: 10px 0px;
    }
    .ant-tabs-bar {
      border-color: transparent !important;
    }
  }
  .page-header {
    border: none !important;
    .breadcrumb {
      &,
      .ant-breadcrumb-link,
      .ant-breadcrumb-separator {
        color: #6889d0;
      }
      .router-link-active {
        color: @primary-color;
      }
    }
  }
  background: url(~@/assets/ptsLayout/bg.png) no-repeat bottom/cover !important;
}
.pts-layout {
.ant-layout-content {
  margin-bottom: 148px !important;
}
}
.pts-footer {
  padding: 0px !important;
  // background: url(~@/assets/ptsLayout/bg.png) no-repeat bottom/cover !important;
  .footer {
    background: rgba(0, 12, 45, 0.86) !important;
  }
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 10;
}
</style>
