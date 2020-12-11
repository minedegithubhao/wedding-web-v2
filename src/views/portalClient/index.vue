<template>
  <div id="portalLayout"
       :class="['portal-layout-wrapper', device]">
    <div class="container">
      <!-- <point-wave element="portalLayout" /> -->
      <div class="top">
        <div class="header-box">
          <img src="@/assets/portalClient/index/zhuangshi_03.png"
               class="header-bg"
               alt="logo" />
          <span class="title">婚介管理平台</span>
          <div @click="toLogin"
               v-if="isLogin"
               class="login-btn">登&nbsp;&nbsp;&nbsp;&nbsp;录</div>
          <a-dropdown v-else>
            <span class="portalAction ant-dropdown-link user-dropdown-menu">
              <a-avatar class="avatar"
                        size="small"
                        :src="avatar" />
              <span class="name">{{ nickname }}</span>
              <!-- <a-icon type="caret-down" class="user-jiantou" /> -->
              <a href="javascript:;"
                 @click="handleLogout"
                 class="logout">
                <a-icon type="poweroff"
                        class="avatar" />
                <span>退出登录</span>
              </a>
            </span>
          </a-dropdown>
          <div class="clearfix" />
        </div>
      </div>
      <div class="content">
        <a-row :gutter="[20, 0]"
               class="swiper-box">
          <a-col :span="6"
                 class="col-box"
                 v-for="(item, index) in Object.keys(contentList)"
                 @click="toPush(contentList[item])"
                 :key="index">
            <div class="button-box box-hover">
              <img :src="contentList[item].img" />
              <div class="word">
                <p class="title">{{ contentList[item].title }}</p>
                <!-- <p class="desc">{{ contentList[item].desc }}</p> -->
              </div>
            </div>
          </a-col>
        </a-row>
        <div class="nav-button">
          <div class="button-box">
            <div class="button"
                 v-for="(item, index) in Object.keys(contentList)"
                 @click="toPush(contentList[item])"
                 :key="index">
              <span class="top-left"></span>
              <span class="top-right"></span>
              <span class="bottom-left"></span>
              <span class="bottom-right"></span>
              {{ contentList[item].title }}
            </div>
          </div>
        </div>
        <a-layout-footer>
          <global-footer class="portal-index-footer" />
        </a-layout-footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import defaultSettings from '../../config/defaultSettings'
import { ACCESS_TOKEN, CURRENT_TOP_MENU } from '@/store/mutation-types'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { checkPermission } from '@/utils/permissions'
import GlobalFooter from '@/components/GlobalFooter'

import system from '@/assets/portalClient/index/system.png'
import help from '@/assets/portalClient/index/help.png'
import service from '@/assets/portalClient/index/service.png'
import script from '@/assets/portalClient/index/script.png'

export default {
  name: 'PortalIndex',
  components: {
    GlobalFooter
  },
  mixins: [mixinDevice],
  data () {
    return {
      contentList: [],
      sysEnable: checkPermission('portal:system:view'),
      specialEnable: checkPermission('portal:special:view'),
      scriptEnable: checkPermission('portal:script:view')
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar']),
    contentStyle () {
      return { backgroundColor: defaultSettings.primaryColor }
    },
    listCard () {
      return { borderColor: defaultSettings.primaryColor }
    },
    isLogin () {
      return !Vue.ls.get(ACCESS_TOKEN)
    }
  },
  watch: {
  },
  created () {
    this.contentList = {
      script: {
        id: 4,
        permission: this.scriptEnable || this.isLogin,
        title: '指纹验证',
        target: '_blank',
        desc: 'Script Execution',
        img: script,
        action: '/portalClient/script/index'
      },
      system: {
        id: 1,
        permission: this.sysEnable || this.isLogin,
        title: '系统管理',
        target: '_blank',
        desc: 'System Management',
        img: system,
        action: '/system/user'
      },
      special: {
        id: 2,
        permission: this.specialEnable || this.isLogin,
        title: '专项服务',
        target: '_blank',
        desc: 'Special Services',
        img: service,
        action: '/portalClient/special/index'
      },
      help: {
        id: 3,
        permission: false || this.isLogin,
        title: '帮助',
        target: '_blank',
        desc: 'Help',
        img: help,
        action: '/'
      }
      // report: {
      //   id: 3,
      //   permission: false || this.isLogin,
      //   title: '报表管理',
      //   target: '_blank',
      //   desc: 'Report Management',
      //   img: baobiao,
      //   action: '/'
      // }
    }
  },
  mounted () {
    document.body.classList.add('portalLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('portalLayout')
  },
  methods: {
    ...mapActions(['Logout']),
    toLogin () {
      this.$router.push({ name: 'login' })
    },
    toPush (content) {
      if (content.permission) {
        // Vue.ls.remove(CURRENT_TOP_MENU)
        const routeData = this.$router.resolve({
          path: content.action,
          query: {}
        })
        window.open(routeData.href, content.target)
      } else {
        this.$warning({
          title: '权限提示',
          content: '账号暂无本功能权限！'
        })
      }
    },
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        cancelText: '取消',
        okText: '退出登录',
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
        onCancel () { }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index';
</style>
<style lang="less">
.ant-carousel .slick-slide {
  text-align: center;
  // height: 160px;
  // line-height: 160px;
  overflow: hidden;
}

.ant-carousel .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel .custom-slick-arrow:before {
  display: none;
}
.ant-carousel .custom-slick-arrow:hover {
  color: #fff;
  opacity: 0.5;
}
</style>
