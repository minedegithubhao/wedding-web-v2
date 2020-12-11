<template>
  <transition name="showHeader">
    <div v-if="visible"
         class="header-animat">
      <a-layout-header v-if="visible"
                       :class="[fixedHeader && 'ant-header-fixedHeader', 'pts-header' ]"
                       :style="{ padding: '0' }">
        <div :class="['top-nav-header-index', theme]">
          <div class="header-index-wide"
               ref="header">
            <div class="header-index-left">
              <a-avatar class="avatar"
                        :src="avatar" />
              <span>{{ nickname }}</span>
            </div>
            <div class="header-index-center">
              {{ logoTitle }}
            </div>
            <div class="header-index-right">
              <router-link :to="{ path: '/portalClient/index' }">
                <span class="action">
                  门户首页
                </span>
              </router-link>
              <span @click="handleScreen"
                    class="action">
                {{ fullscreen ? '退出全屏' : '全屏显示' }}
              </span>
              <router-link :to="{ name: 'settings' }">
                <span class="action">
                  个人设置
                </span>
              </router-link>
              <span @click="handleLogout"
                    class="action">
                退出登录
              </span>
            </div>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PHeader',
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
    }
  },
  data() {
    return {
      logoTitle: '婚介管理平台',
      haveNotice: true,
      visible: true,
      oldScrollTop: 0,
      fullscreen: false
    }
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
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
    beforeDestroy() {
      document.body.removeEventListener('scroll', this.handleScroll, true)
    },
    handleScreen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 16)
            })
            .catch((err) => {
              this.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
  .pts-header {
    height: 81px;
    background: rgba(8, 15, 51, 0.7) !important;
    .top-nav-header-index {
      height: 100%;
      .header-index-wide {
        height: 100%;
      }
    }
  }
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
.header-index-wide {
  text-align: center;
  position: relative;
  .header-index-center {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url(~@/assets/ptsLayout/tit_bg_02.png) no-repeat center/contain;
    font-size: 30px;
    letter-spacing: 1px;
    color: #ffffff;
    position: relative;
    font-weight: bold;
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 232px;
      height: 75px;
      bottom: -18px;
      left: calc((100% - 232px) / 2);
      background: url(~@/assets/ptsLayout/tit_light_03.png) no-repeat center/contain;
    }
  }
  .header-index-left {
    position: absolute;
    height: 100%;
    line-height: 81px;
    left: 24px;
    color: #7ca2f2;
    font-size: 16px;
    .avatar {
      background: @primary-color;
      margin-right: 8px;
    }
  }
  .header-index-right {
    position: absolute;
    user-select: none;
    height: 100%;
    line-height: 81px;
    top: 0px;
    right: 24px;
    .action {
      cursor: pointer;
      color: #7ca2f2;
      transition: all 0.3s;
      width: 115px;
      height: 32px;
      line-height: 32px;
      display: inline-block;
      background: url(~@/assets/ptsLayout/top_nav_border_03.png) no-repeat center/contain;
      &:hover {
        color: @primary-color;
      }
      margin-right: -8px;
    }
  }
}
.ant-header-fixedHeader {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  transition: width 0.2s;
}
</style>
