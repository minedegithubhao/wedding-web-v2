<template>
  <a-layout-sider :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
                  width="256px"
                  :collapsible="collapsible"
                  v-model="collapsed"
                  :trigger="null">
    <venus-scroll :scrolling-x="false"
                  gutter-of-side="0px"
                  :only-show-bar-on-scroll="false"
                  size="4px">
      <logo />
      <s-menu :collapsed="collapsed"
              :menu="menus"
              :theme="theme"
              :mode="mode"
              @select="onSelect"
              style="padding: 16px 0px;"></s-menu>
    </venus-scroll>
  </a-layout-sider>

</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'
import VenusScroll from '@/components/pts/Scroll/index'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu, VenusScroll },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>
