<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <venus-scroll :scrolling-x="false"
                    gutter-of-side="0px"
                    :only-show-bar-on-scroll="false"
                    :is-monitor-scroll="true"
                    :open-scroll-event="true"
                    size="4px">
        <router-view />
      </venus-scroll>
    </div>
  </a-config-provider>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
// 引用cdn还可以这么写
import { locales } from 'ant-design-vue'
import VenusScroll from '@/components/pts/Scroll'
const zhCN = locales.zh_CN

export default {
  mixins: [AppDeviceEnquire],
  components: {
    VenusScroll
  },
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {

  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
