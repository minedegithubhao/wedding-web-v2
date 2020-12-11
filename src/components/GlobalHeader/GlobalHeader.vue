<template>
  <transition name="showHeader">
    <div v-if="visible"
         class="header-animat">
      <h-menu v-if="device !== 'mobile' && layoutMode === 'topmenu'"
              class="page-header-menu"
              :className="[`content-width-${contentWidth}`]"
              mode="horizontal"
              slot="overlay"
              :menu="menus"
              theme="light" />
      <a-layout-header v-if="visible"
                       :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', theme ]"
                       :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'"
             class="header"
             :class="theme">
          <div ref="header">
            <a-icon v-if="device==='mobile'"
                    class="trigger"
                    :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                    @click="toggle"
                    style="float:left"
                    ref="headerIcon" />
            <a-icon v-else
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="toggle"
                    style="float:left"
                    ref="headerIcon" />
            <top-menu :top-menu-list="topMenuList"
                      :all-top-menus="allTopMenus"
                      @click="handleSelectTopMenu"
                      :style="{maxWidth: topMenuWidth}"></top-menu>
            <user-menu ref="userMenu"
                       :theme="theme"></user-menu>
          </div>
        </div>
        <div v-else
             :class="['top-nav-header-index', theme]">
          <div class="header-index-wide"
               ref="header">
            <div class="header-index-left">
              <logo class="top-nav-header"
                    :show-title="device !== 'mobile'" />
              <!-- <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme" /> -->
              <top-menu :top-menu-list="topMenuList"
                        @click="handleSelectTopMenu"
                        :style="{maxWidth: topMenuWidth}"
                        :sub-menus="allMenus"
                        :all-top-menus="allTopMenus"
                        :theme="theme"
                        :mode="mode"></top-menu>
              <a-icon v-if="device === 'mobile'"
                      class="trigger"
                      :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                      @click="toggle" />
            </div>
            <user-menu class="header-index-right"
                       ref="userMenu"
                       :theme="theme"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import TopMenu from '@/components/pts/TopMenu'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'
import HMenu from '@/components/pts/HorizontalMenu/'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
    HMenu,
    TopMenu
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    allMenus: {
      type: Object,
      required: true
    },
    allTopMenus: {
      type: Object,
      required: true
    },
    topMenuList: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data() {
    return {
      visible: true,
      oldScrollTop: 0,
      topMenuWidth: 0,
      headerWidth: '0px'
    }
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
    this.headerWidth = this.$refs.header.clientWidth
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.headerWidth = this.$refs.header.clientWidth
      })()
    }
  },
  created() { },
  watch: {
    headerWidth(val) {
      const userMenu = this.$refs.userMenu.$el.clientWidth
      const headerIcon = this.mode === 'sidemenu' ? this.$refs.headerIcon.clientWidth : 0

      this.topMenuWidth = val - userMenu - headerIcon + 'px'
    },
    collapsed(val) {
      this.$nextTick(() => {
        const userMenu = this.$refs.userMenu.$el.clientWidth
        const headerIcon = this.mode === 'sidemenu' ? this.$refs.headerIcon.clientWidth : 0
        if (val) {
          this.topMenuWidth = this.$refs.header.offsetWidth - userMenu - headerIcon - 80 + 256 + 'px'
        } else {
          this.topMenuWidth = this.$refs.header.offsetWidth - userMenu - headerIcon - 176 + 'px'
        }
      })
    }
  },
  methods: {
    handleScroll() {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    handleSelectTopMenu(topMenu) {
      this.$emit('handle-select-top-menu', topMenu)
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
@import '../index.less';
.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
</style>
