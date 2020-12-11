<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <a href="/portalClient/index"
         target="_blank"> -->
      <router-link :to="{ path: '/portalClient/index' }">
        <a-tooltip>
          <template slot="title">门户首页</template>
          <span class="action">
            <a-icon type="home"></a-icon>
            <!-- <img src="~@/assets/back.png" class="back-index"/> -->
          </span>
        </a-tooltip>
      </router-link>
      <!-- </a> -->
      <!-- <notice-icon class="action"
                   v-if="!haveNotice" /> -->
      <lang-select v-if="false" />
      <a-tooltip>
        <template slot="title">全屏显示</template>
        <span class="action"
              @click="screen">
          <a-icon :type="getFullscreenIcon"></a-icon>
        </span>
      </a-tooltip>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar"
                    :src="avatar" />
          <span>{{ nickname }}</span>
          <img src="@/assets/jiantou_03.png"
               class="user-jiantou" />
        </span>
        <a-menu slot="overlay"
                :theme="theme"
                class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>-->
          <a-menu-item key="1">
            <router-link :to="{ name: getHeaderType }">
              <a-icon type="setting" />
              <span>账户设置</span>
            </router-link>
          </a-menu-item>
          <!-- <a-menu-divider/> -->
          <a-menu-item key="3">
            <a href="javascript:;"
               @click="handleLogout">
              <a-icon type="logout"
                      style="color: #ff6262" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import LangSelect from '@/components/tools/LangSelect'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  props: ['theme', 'haveNotice', 'headerType'],
  components: {
    LangSelect,
    NoticeIcon
  },
  data() {
    return {
      fullscreen: false
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    getHeaderType: function () {
      return this.headerType === 'portal' ? 'portalBase' : 'settings'
    },
    getFullscreenIcon: function () {
      return this.fullscreen ? 'fullscreen-exit' : 'fullscreen'
    }
  },
  methods: {
    ...mapActions(['Logout']),
    screen() {
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
            .catch(err => {
              this.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() { }
      })
    }
  }
}
</script>
<style scoped>
.user-jiantou {
  margin-left: 12px;
  width: 10px;
}
</style>
