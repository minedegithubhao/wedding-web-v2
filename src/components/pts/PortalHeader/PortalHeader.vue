<template>
  <transition name="showHeader">
    <div v-if="visible"
         class="header-animat">
      <a-layout-header v-if="visible"
                       :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
                       :style="{ padding: '0' }">
        <div :class="['top-nav-header-index', theme]">
          <div class="header-index-wide"
               ref="header">
            <div class="header-index-left">
              <logo class="top-nav-header"
                    :show-title="device !== 'mobile'"
                    :title="logoTitle" />
            </div>
            <user-menu class="header-index-right"
                       :theme="theme"
                       :have-notice="haveNotice"
                       :header-type="headerType"></user-menu>
          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import Logo from '@/components/tools/Logo'
import { mixin } from '@/utils/mixin'
import UserMenu from '@/components/tools/UserMenu'

export default {
  name: 'GlobalHeader',
  components: {
    Logo,
    UserMenu
  },
  mixins: [mixin],
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    headerType: {
      type: String,
      required: false,
      default: 'portal'
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data() {
    return {
      logoTitle: '婚介管理平台',
      haveNotice: true,
      visible: true,
      oldScrollTop: 0
    }
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  created() { },
  watch: {
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
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
@import '~@/components/index.less';
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
.top-nav-header {
  width: 20px;
}
</style>
