<template>
  <div class="footer">
    <div class="links">
      <router-link :to="{ path: '/dashboard/welcome' }">
        <div class="links-item-left link-action action-left">
          主页
        </div>
      </router-link>
      <div class="footer-menu-wrapper">
        <div class="footer-menu-row">
          <a-tabs tab-position="bottom"
                  class="p-footer-menu">
            <template v-for="topMenu in topMenuList">
              <a-tab-pane v-if="`${topMenu.visible}` === '0'"
                          class="footer-menu-col"
                          :key="topMenu.id">
                <span slot="tab"
                      style="display: block">
                  <a-dropdown :trigger="['click']"
                              overlay-class-name="footer-menu-dropdown">
                    <span class="ant-dropdown-link dropdownSpan dropdown-title">
                      {{ topMenu.name }}
                    </span>
                    <s-menu slot="overlay"
                            class="venus-footer-menu-dropdown-menu-wrapper"
                            :menu="getSubMenu(topMenu)" />
                  </a-dropdown>
                </span>
              </a-tab-pane>
            </template>
          </a-tabs>
        </div>
      </div>
      <div class="links-item-right link-action action-right">
        工作台
      </div>
    </div>
    <!-- <s-menu class="venus-top-menu-dropdown-menu-wrapper"
            v-if="!!selectItem"
            :menu="allMenus[selectItem]"
            :theme="theme" /> -->
  </div>
</template>

<script>
import prefix from '@/config/prefix'
import SMenu from './SubMenu'

export default {
  name: 'PFooter',
  components: {
    SMenu
  },
  props: {
    topMenuList: {
      type: Array,
      required: true,
      default: () => []
    },
    allMenus: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      logoTitle: '婚介管理平台',
      selectItem: ''
    }
  },
  methods: {
    imgSrc(filePath) {
      return prefix.OPEN_URL_PREFIX + filePath
    },
    getSubMenu(topMenu) {
      return this.allMenus[topMenu.id]
    },
    handleFooterMenu(menuId) {
      this.selectItem = menuId
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 86px 16px 0px;
  text-align: center;
  .top-menu-icon {
    max-width: 20px;
    height: 20px;
  }
  .links {
    // height: 60px;
    // line-height: 60px;
    .links-item-left {
      float: left;
    }
    .links-item-right {
      float: right;
    }
    .footer-menu-wrapper {
      text-align: center;
      display: inline-block;
      width: calc(100% - 96px - 96px - 96px);
      .footer-menu-row {
        border-top: 4px solid #618eff;
        position: relative;
        height: 48px;
        &::before {
          content: '';
          display: inline-block;
          position: absolute;
          left: -61px;
          top: 25px;
          height: 4px;
          width: 76px;
          background: #618eff;
          transform: rotate(-51deg);
          -ms-transform: rotate(-51deg);
          -moz-transform: rotate(-51deg);
          -webkit-transform: rotate(-51deg);
          -o-transform: rotate(-51deg);
        }
        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          right: -61px;
          top: 25px;
          height: 4px;
          width: 76px;
          background: #618eff;
          transform: rotate(51deg);
          -ms-transform: rotate(51deg);
          -moz-transform: rotate(51deg);
          -webkit-transform: rotate(51deg);
          -o-transform: rotate(51deg);
        }
        .p-footer-menu {
          position: absolute;
          height: 100%;
          width: 100%;
          top: -64px;
        }
        .footer-menu-col {
        }
      }
    }
  }
  .link-action {
    cursor: pointer;
    color: #7ca2f2;
    transition: all 0.3s;
    width: 115px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    &:hover {
      color: @primary-color;
    }
    margin-right: -8px;
    &.action-right {
      background: url(~@/assets/ptsLayout/top_nav_border_right.png) no-repeat center/contain;
    }
    &.action-left {
      background: url(~@/assets/ptsLayout/top_nav_border_03.png) no-repeat center/contain;
    }
  }
}
</style>
<style lang="less">
.p-footer-menu {
  height: 64px !important;
  .ant-tabs-bottom-bar {
    border: none !important;
  }
  &,
  .ant-tabs-nav-container,
  .ant-tabs-nav-wrap,
  .ant-tabs-nav-scroll {
    overflow: visible !important;
  }
  .ant-tabs-nav-container {
    padding: 0 40px;
    .ant-tabs-tab-next,
    .ant-tabs-tab-prev {
      height: 48px !important;
      margin-top: 8px !important;
      background-color: #5f8bff !important;
      color: #eaeaea !important;
      width: 24px !important;
      .anticon {
        font-size: 16px !important;
      }
      &.ant-tabs-tab-btn-disabled {
        color: #bfbfbf !important;
      }
    }
  }
  .ant-tabs-nav-scroll {
    overflow-x: hidden !important;
    height: calc(64px + 18px);
  }
  .ant-tabs-bar {
    margin-top: 0px !important;
    .ant-tabs-ink-bar {
      display: none !important;
    }
    .ant-tabs-tab {
      user-select: none;
      border: 1px solid #3d69d7;
      background-color: #051237;
      height: 64px;
      line-height: 64px;
      width: 192px;
      padding: 0px;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 4px;
        height: 37px;
        position: absolute;
        left: 0px;
        top: calc((100% - 37px) / 2);
        background: url(~@/assets/ptsLayout/bottom_nav_border_14.png) no-repeat left/contain;
      }
      &::after {
        content: '';
        display: block;
        width: 4px;
        height: 37px;
        position: absolute;
        right: 0px;
        top: calc((100% - 37px) / 2);
        background: url(~@/assets/ptsLayout/bottom_nav_border_17.png) no-repeat right/contain;
      }
      .dropdown-title {
        display: block;
        &::before {
          content: '';
          display: block;
          width: 115px;
          height: 4px;
          position: absolute;
          left: calc((100% - 115px) / 2);
          top: 0px;
          background: url(~@/assets/ptsLayout/bottom_nav_border_10.png) no-repeat top/contain;
        }
        &::after {
          content: '';
          display: block;
          width: 105px;
          height: 36px;
          position: absolute;
          left: calc((100% - 115px) / 2);
          bottom: -18px;
          background: url(~@/assets/ptsLayout/bottom_nav_border_20.png) no-repeat center/contain;
        }
      }
      // &,
      // &:hover,
      // &:focus,
      // &.ant-tabs-tab-active {
      color: #dde8ff;
      font-size: 16px;
      // }
    }
  }
}
.footer-menu-dropdown {
  .venus-footer-menu-dropdown-menu-wrapper {
    background: #0e2466 !important;
  }
}
</style>
<style lang="less">
.pts-sub-menu {
  .ant-menu-sub {
    background: #0e2466 !important;
  }
}
</style>
