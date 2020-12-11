<template>
  <div class="window-container">
    <a-card :bordered="false" :bodyStyle="{ padding: cardPadding }">
      <div class="window-box">
        <div class="window-header" v-if="showHeader">
          <logo :show-title="false" :is-link="false" />
          <div class="title" v-if="showTitle">{{ termName }}</div>
          <slot name="toolBar"></slot>
        </div>
        <div class="window-layout">
          <slot name="sessionWindow"></slot>
          <template v-if="multiTab">
            <slot></slot>
          </template>
          <terminal
            v-else
            :show-drawer="showDrawer"
            :drawer-width="drawerWidth"
            :term-data="termData"
            :term-name="termName"
            ref="windowTerminal"
          ></terminal>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import Logo from '@/components/tools/Logo'
import Terminal from './terminal.vue'

export default {
  name: 'WebShellWindow',
  components: {
    Logo,
    Terminal
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerWidth: {
      type: String,
      default: '185px'
    },
    multiTab: {
      type: Boolean,
      default: false
    },
    termData: {
      type: Object,
      default: () => {}
    },
    cardPadding: {
      type: String,
      default: '0px'
    }
  },
  data() {
    return {
      termName: 'WebShell'
    }
  },
  computed: {},
  watch: {},
  methods: {
    connect(data) {
      if (!this.multiTab) {
        this.$refs.windowTerminal.handleConnect(data)
      }
    },
    close() {
      if (!this.multiTab) {
        this.$refs.windowTerminal.handleClose()
      }
    },
    send(data) {
      if (!this.multiTab) {
        this.$refs.windowTerminal.handleSend(data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@header-height: 32px;
.window-container {
  height: 100%;
  width: 100%;
  .form-box {
    height: 64px;
  }
}
.window-box {
  border-radius: 2px;
  overflow: hidden;
  height: 100%;
  position: relative;
  .window-layout {
    position: relative;
    overflow: hidden;
    min-height: 400px;
    background-color: #2b2b2b;
  }
}
.window-header {
  height: @header-height;
  background: #3c3f41;
  position: relative;
  .title {
    display: inline-block;
    color: #e5e5e5;
    height: 100%;
    line-height: @header-height;
    margin-right: 8px;
  }
}
</style>
<style lang="less">
.window-header {
  height: 100%;
  padding-left: 35px;
  .logo {
    position: absolute;
    left: 8px;
    top: 3.5px;
    display: inline-block;
    img {
      height: 20px;
    }
  }
}
</style>
