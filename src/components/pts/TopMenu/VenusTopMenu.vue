<template>
  <div class="venus-top-menu">
    <ul class="list">
      <template v-for="menu in topMenu">
      <li :class="{ active: `${selectKey}` === `${menu.id}` }"
          @click.stop="handleSelectTopMenu(menu, $event)"
          v-if="getTopMenuStatus(menu.id)"
          :key="menu.id">
        <!-- <a-dropdown v-if="mode !== 'sidemenu' && itemClass(menu.id).active === true">
          <span class="ant-dropdown-link dropdownSpan">
            <span class="dropdownSpan-img">
              <img :src="imgSrc(menu.icon)"
                   class="top-menu-icon" />
            </span>
            {{ menu.name }}
            <div class="progress"></div>
          </span>
          <s-menu slot="overlay"
                  class="venus-top-menu-dropdown-menu-wrapper"
                  :menu="getSubMenu(menu)"
                  :theme="theme" />
        </a-dropdown> -->
        <span class="ant-dropdown-link dropdownSpan">
          <span class="dropdownSpan-img">
            <img :src="imgSrc(menu.icon)"
                 class="top-menu-icon" />
          </span>
          {{ menu.name }}
          <div class="progress"></div>
        </span>
      </li>
      </template>
    </ul>
  </div>
</template>

<script>
/**
 *  作者：姚正超
 *  描述：V1.0版本，请勿随意乱更改组件
 *  日期：2020年5月9日
 */
import NProgress from 'nprogress' // progress bar
import Vue from 'vue'
import { CURRENT_TOP_MENU } from '@/store/mutation-types'
import { getSessionStorage, setSessionStorage } from '@/utils/util'
import prefix from '@/config/prefix'
// import SubMenu from './SubMenu'
import SMenu from './SubMenu.js'

export default {
  name: 'VenusTopMenu',
  components: {
    SMenu
  },
  props: {
    topMenuList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'sidemenu'
    },
    theme: {
      type: String,
      default: 'dark'
    },
    subMenus: {
      type: Object,
      required: true,
      default: () => { }
    },
    allTopMenus: {
      type: Object,
      required: true,
      default: () => { }
    }
  },
  data() {
    return {
      topMenu: [],
      selectKey: ''
    }
  },
  computed: {
    currentTopMenu: function () {
      for (let i = 0; i < this.topMenuList.length; i++) {
        if (`${this.topMenuList[i].id}` === `${getSessionStorage(CURRENT_TOP_MENU)}`) {
          return this.topMenuList[i]
        }
      }
      this.$message.error('没有找到对应的主菜单项')
      return {}
    }
  },
  created() {
    this.topMenu = this.topMenuList.filter(menu => menu.visible === '0')
    const top = this.currentTopMenu
    if (top.layoutMode) {
      this.$store.dispatch('ToggleLayoutMode', top.layoutMode)
    }
    this.selectKey = getSessionStorage(CURRENT_TOP_MENU)
    // if (top.multiTab !== undefined && `${top.multiTab}` !== `${this.multiTab}`) {
    //   if (`${top.multiTab}` === 'true') {
    //     this.$store.dispatch('ToggleMultiTab', true)
    //   } else {
    //     this.$store.dispatch('ToggleMultiTab', false)
    //   }
    // }
  },
  methods: {
    // handleSelectTopMenu(topMenuId) {
    //   let menu = {}
    //   for (let i = 0; i < this.topMenu.length; i++) {
    //     if (`${this.topMenu[i].id}` === `${topMenuId}`) {
    //       menu = this.topMenu[i]
    //       break
    //     }
    //   }
    //   this.$emit('click', menu)
    // }
    imgSrc: function (filePath) {
      return prefix.OPEN_URL_PREFIX + filePath
    },
    getSubMenu: function (topMenu) {
      if (this.mode !== 'sidemenu') {
        return this.subMenus[topMenu.id]
      }
      return []
    },
    getTopMenuStatus(topMenuId) {
      if (this.allTopMenus && this.allTopMenus[topMenuId] && Array.isArray(this.allTopMenus[topMenuId]) && this.allTopMenus[topMenuId].length > 0) {
        return true
      } else {
        return false
      }
    },
    handleSelectTopMenu(topMenu, event) {
      // const parent = event.currentTarget.parentNode
      if (topMenu.target === '_blank') {
        setSessionStorage(CURRENT_TOP_MENU, topMenu.id)
        window.open(topMenu.redirect, '_blank')
      } else {
        // if (event.currentTarget.parentNode.children.length) {
        //   for (let i = 0; i < event.currentTarget.parentNode.children.length; i++) {
        //     if (event.currentTarget.parentNode.children[i].className.indexOf('active') > -1) {
        //       event.currentTarget.parentNode.children[i].className = event.currentTarget.parentNode.children[i].className.replace('active', '')
        //     }
        //   }
        // }
        this.selectKey = topMenu.id
        event.currentTarget.className = 'active'
        this.$emit('click', topMenu)
      }
    }
  }
}
</script>
