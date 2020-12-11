<template>
  <div id="userLayout"
       :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo.png"
                 class="logo"
                 alt="logo" />
            <span class="title">婚介管理平台</span>
            <img src="~@/assets/login/dian_03.png"
                 class="dot"
                 alt="dot" />
          </a>
        </div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <logo class="global-logo login-footer-logo"
              :show-title="device !== 'mobile'"
              :title="logoTitle" />
        <!-- <div class="links">
          <a href="/portalClient/index"
             target="_blank">首页</a>
          <a href="/portalClient/script/index"
             target="_blank">指纹验证</a>
          <a href="/dashboard/welcome"
             target="_blank">系统管理</a>
          <a href="/portalClient/special/index"
             target="_blank">专项服务</a>
        </div> -->
        <div class="copyright">
          Copyright
          <a-icon type="copyright" />2020
          <span>WEDDING</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import Logo from '@/components/tools/Logo'

export default {
  name: 'UserLayout',
  components: { RouteView, Logo },
  mixins: [mixinDevice],
  data() {
    return {
      logoTitle: '婚介管理平台'
    }
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>
<style lang="less">
#userLayout.user-layout-wrapper {
  height: 100vh;

  &.mobile {
    .container {
      .main {
        .user-layout-login {
          float: none;
          margin-right: 0;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100vh;

  &.mobile {
    .container {
      .main {
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    background: url(~@/assets/login/bg.jpg) no-repeat top/cover;
    padding: 4vh 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      width: 100%;
      text-align: left;
      padding: 0 4%;
      height: 100px;
      margin: 0 auto;

      .header {
        // height: 44px;
        line-height: 60px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 60px;
          vertical-align: top;
          // margin-right: 16px;
          border-style: none;
          margin-bottom: 18px;
        }
        .dot {
          display: block;
          margin-left: 18px;
        }
        .title {
          font-size: 26px;
          color: #fff;
          font-family: '微软雅黑';
          // font-weight: 600;
          position: relative;
          top: 2px;
          letter-spacing: 2px;
          margin-left: 8px;
          // word-spacing: ;
        }
        .title_left {
          color: #556ee6;
        }
      }
      .desc {
        font-size: 14px;
        color: #fff;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      // min-width: 1200px;
      width: 100%;
      height: calc(100vh - 100px - 5vh - 4vh - 144px);
      min-height: 480px;
      padding: 4% 2% 0;
      margin-top: 5vh;
      position: relative;
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: 2%;
        top: 0;
        width: calc(600px * (933 / 638));
        height: 600px;
        background: url(~@/assets/login/left.png) no-repeat center/contain;
      }
    }
    // @media only screen and (min-height: 500px) {
    //   .main {
    //     margin-top: 2vh;
    //     height: calc(100vh - 100px - 2vh - 4vh - 144px);
    //   }
    // }
    // @media only screen and (min-height: 700px) {
    //   .main {
    //     margin-top: 5vh;
    //     height: calc(100vh - 100px - 5vh - 4vh - 144px);
    //   }
    // }
    // @media only screen and (min-height: 850px) {
    //   .main {
    //     margin-top: 7vh;
    //     height: calc(100vh - 100px - 7vh - 4vh - 144px);
    //   }
    // }
    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: #fff;
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>
