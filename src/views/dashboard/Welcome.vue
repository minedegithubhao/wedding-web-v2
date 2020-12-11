<template>
  <div class="page-header-index-wide welcome-index">
    <a-row :gutter="[24, 24]">
      <a-col :xxl="4"
             :xl="6"
             :lg="8"
             :md="12"
             :xs="24"
             class="welcome-menu-mask"
             v-for="menu in menuList"
             :key="menu.id">
        <div class="welcome-menu-box">
          <div class="menu-img"><img :src="menu.img" /></div>
          <div class="menu-name">{{ menu.title }}</div>
          <div class="separator"></div>
          <div class="menu-desc">{{ menu.desc }}</div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { checkPermission } from '@/utils/permissions'

import script from '@/assets/welcome/zhiwen.png'
import special from '@/assets/welcome/special.png'
import chain from '@/assets/welcome/shezhi.png'
import assets from '@/assets/welcome/zichan.png'
import services from '@/assets/welcome/user.png'
import job from '@/assets/welcome/zuoye.png'

export default {
  name: 'Analysis',
  components: {},
  data() {
    return {
      menuList: [
        {
          id: 1,
          permission: checkPermission('pts:script:tScript:view'),
          title: '指纹验证',
          desc: '指纹验证指针对系统各种漏洞原理针对性编写脚本配合系统代码对目标服务进行专项渗透',
          img: script,
          action: '/pts/script/TScriptList'
        },
        {
          id: 2,
          permission: checkPermission('pts:special:tSpecial:view'),
          title: '专项服务管理',
          desc: 'Script Execution',
          img: special,
          action: '/pts/special/TSpecialList'
        },
        {
          id: 3,
          permission: checkPermission('pts:flow:flowChain:view'),
          title: '专项服务配置',
          desc: 'Script Execution',
          img: chain,
          action: '/pts/flow/TSpecialFlowChainList'
        },
        {
          id: 4,
          permission: checkPermission('pts:penetration:TPenetrationObjIp:view'),
          title: '资产管理',
          desc: 'Script Execution',
          img: assets,
          action: '/pts/penetration/TPenetrationObjIpList'
        },
        {
          id: 5,
          permission: checkPermission('pts:penetration:TPenetrationObj:view'),
          title: '服务管理',
          desc: 'Script Execution',
          img: services,
          action: '/pts/penetration/TPenetrationObjList'
        },
        {
          id: 6,
          permission: checkPermission('pts:job:TJob:view'),
          title: '作业管理',
          desc: 'Script Execution',
          img: job,
          action: '/pts/job/TJobList'
        }
      ]
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.welcome-index {
  // 100vh：窗口高度  81px: 顶部导航高度  75px：多签页高度    37px：面包屑高度  139px：底部高度  48px：.ant-layout-content类 margin高度
  min-height: calc(100vh - 81px - 75px - 37px - 139px - 48px);
  border-left: 1px solid #0c88d6;
  border-right: 1px solid #0c88d6;
  border-bottom: 1px solid #0c88d6;
  position: relative;
  padding: 80px 120px 40px;
  overflow: hidden;
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 32px;
    background: url(~@/assets/welcome/bg_border_top.png) no-repeat center/contain;
  }
  .welcome-menu-mask {
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: -207px;
      right: 0;
      height: 219px;
      background: transparent;
      z-index: 5;
    }
  }
  .welcome-menu-box {
    width: 240px;
    height: 360px;
    // border-image-source: linear-gradient(0deg, #167dca 0%, #26f2ff 100%);
    // border-image-slice: 1;
    // border-style: solid;
    // border-width: 1px;
    border: 1px solid #26f2ff;
    padding: 48px;
    background: url(~@/assets/welcome/content_bg_03.png) no-repeat center/cover;
    border-radius: 8px;
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    &:hover {
      .menu-name {
        color: @primary-color;
      }
      .menu-img {
        img {
          -webkit-transition-property: -webkit-transform;
          -webkit-transition-duration: 1s;
          -moz-transition-property: -moz-transform;
          -moz-transition-duration: 1s;
          -webkit-animation: rotate 3s linear infinite;
          -moz-animation: rotate 3s linear infinite;
          -o-animation: rotate 3s linear infinite;
          animation: rotate 3s linear infinite;
        }
      }
    }
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: -35px;
      right: 0;
      height: 66px;
      z-index: 1;
      background: url(~@/assets/welcome/content_bottom_light_03.png) no-repeat center/contain;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: -219px;
      right: 0;
      height: 219px;
      background: url(~@/assets/welcome/inverted_image.png) no-repeat top/contain;
    }
    .menu-img {
      width: 112px;
      height: 112px;
      background-color: #071045;
      border: 2px solid #2d386a;
      border-radius: 50%;
      line-height: 112px;
      text-align: center;
      margin: 0 auto;
      margin-bottom: 28px;
      img {
        width: 48px;
        height: auto;
      }
    }
    .menu-name {
      font-size: 16px;
      color: #fff;
      text-align: center;
      transition: all 0.3s;
    }
    .separator {
      width: 100%;
      height: 1px;
      background: url(~@/assets/welcome/fengexian_03.png) no-repeat center/contain;
      margin: 28px 0px;
    }
    .menu-desc {
      width: 100%;
      color: #7d8bdb;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
    }
  }
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotateY(0deg);
  }

  to {
    -webkit-transform: rotateY(360deg);
  }
}

@-moz-keyframes rotate {
  from {
    -moz-transform: rotateY(0deg);
  }

  to {
    -moz-transform: rotateY(359deg);
  }
}

@-o-keyframes rotate {
  from {
    -o-transform: rotateY(0deg);
  }

  to {
    -o-transform: rotateY(359deg);
  }
}

@keyframes rotate {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(359deg);
  }
}
</style>
