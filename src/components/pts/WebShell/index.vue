<template>
  <div class="web-shell">
    <window-shell :show-title="false" :show-drawer="sessionWindow" :drawer-width="drawerWidth" :multi-tab="true">
      <template v-slot:toolBar>
        <div class="toolBar-container">
          <span @click="showSessionWindow" class="toolBar-btn"><a-icon :type="sessionWindow ? 'menu-fold' : 'menu-unfold'" title="打开会话管理器"/></span>
          <a-dropdown overlay-class-name="toolBar-dropdown" :trigger="['hover']">
            <span class="toolBar-btn ant-dropdown-link">
              <a-icon type="plus" class="toolBar-icon" />会话
            </span>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a @click="addSession"><span class="item-icon"><a-icon type="plus" class="toolBar-icon" /></span>新建会话</a>
              </a-menu-item>
              <a-menu-item key="1" :disabled="!selectKey">
                <a @click="() => editSession(selectRow)"><span class="item-icon"><a-icon type="folder-open" class="toolBar-icon" /></span>修改会话</a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="2" :disabled="!selectKey">
                <a @click="() => deleteSession(selectRow)"><span class="item-icon"><a-icon type="delete" class="toolBar-icon" /></span>删除会话</a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="3" :disabled="!selectKey">
                <a @click="() => openSessionConnect(selectRow)"><span class="item-icon"><a-icon type="folder-open" class="toolBar-icon" /></span>打开会话连接</a>
              </a-menu-item>
              <a-menu-item key="4" :disabled="!selectKey">
                <a @click="() => closeSessionConnect(selectRow)"><span class="item-icon"><a-icon type="close" class="toolBar-icon" /></span>断开会话连接</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span @click="handleScreenshot" class="toolBar-btn">截图</span>
        </div>
      </template>
      <template v-slot:sessionWindow>
        <a-drawer
          placement="left"
          :closable="true"
          :visible="sessionWindow"
          :get-container="false"
          :mask="sessionMask"
          :wrap-style="{ position: 'absolute' }"
          @close="closeSessionWindow"
          wrap-class-name="session-window"
          :width="185"
        >
          <template slot="title">
            会话管理器
            <a-icon type="pushpin" class="pushpin" :rotate="sessionMask ? 45 : -45" @click="handleMask"/>
          </template>
          <div v-for="(session, index) in sessionList" :key="index">
            <a-dropdown overlay-class-name="toolBar-dropdown" :trigger="['contextmenu']">
              <div class="session" :class="{ 'active': session.id === selectKey }" @dblclick="() => openSessionConnect(session)" @click="() => selectSession(session)">
                <div title="双击连接会话">{{ session.name }}</div>
              </div>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a @click="() => openSessionConnect(session)"><span class="item-icon"><a-icon type="plus" class="toolBar-icon" /></span>打开会话连接</a>
                </a-menu-item>
                <a-menu-item key="1">
                  <a @click="() => closeSessionConnect(session)"><span class="item-icon"><a-icon type="close" class="toolBar-icon" /></span>断开会话连接</a>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="2">
                  <a @click="() => editSession(session)"><span class="item-icon"><a-icon type="folder-open" class="toolBar-icon" /></span>修改会话</a>
                </a-menu-item>
                <a-menu-item key="3">
                  <a @click="() => deleteSession(session)"><span class="item-icon"><a-icon type="delete" class="toolBar-icon" /></span>删除会话</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-drawer>
      </template>
      <!-- <template v-slot:shellMultiTab> -->
        <multi-tab ref="sessionTab" :show-drawer="sessionWindow" :drawer-width="drawerWidth"></multi-tab>
      <!-- </template> -->
    </window-shell>
    <add-session ref="sessionModel" @ok="handleAndOk"></add-session>
    <screenshot ref="screenshot" class="screenshot" />
  </div>
</template>

<script>
import WindowShell from './window.vue'
import Logo from '@/components/tools/Logo'
import Screenshot from '@/components/pts/Screenshot/index.vue'
import AddSession from './addSession.vue'
import MultiTab from './MultiTab'

export default {
  name: 'WebShell',
  components: {
    WindowShell,
    Logo,
    Screenshot,
    AddSession,
    MultiTab
  },
  data() {
    return {
      name: 'WebShell',
      sessionWindow: true,
      sessionMask: false,
      drawerWidth: '185px',
      selectKey: '',
      selectRow: {},
      sessionList: [
        {
          id: '1',
          name: '192.168.1.231',
          ip: '192.168.1.231',
          port: '22',
          username: 'root',
          password: 'xa-11'
        },
        {
          id: '2',
          name: '192.168.1.233',
          ip: '192.168.1.233',
          port: '22',
          username: 'root',
          password: 'xa-11'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    openSessionConnect(row) {
      this.$refs.sessionTab.open(row)
    },
    closeSessionConnect(row) {
      this.$refs.sessionTab.close(row.id)
    },
    selectSession(row) {
      this.selectKey = row.id
      this.selectRow = row
    },
    addSession() {
      this.$refs.sessionModel.add()
    },
    editSession(row) {
      this.$refs.sessionModel.edit(row)
    },
    deleteSession(row) {
      const self = this
      this.$confirm({
        title: '提示',
        content: <span>确定要删除<span style="color: red">{row.name}</span>会话吗？</span>,
        okText: '删除',
        cancelText: '取消',
        onOk() {
          self.sessionList = self.sessionList.filter(item => item.id !== row.id)
          self.closeSessionConnect(row)
          self.selectRow = {}
          self.selectKey = ''
        }
      })
    },
    handleAndOk(row) {
      const sessionList = this.sessionList.filter(item => item.id !== row.id)
      if (sessionList.length > 0) {
        this.sessionList = this.sessionList.map(item => {
          if (item.id === row.id) {
            return row
          } else {
            return item
          }
        })
        this.selectRow = row
        this.closeSessionConnect(row)
      } else {
        this.sessionList.push(row)
      }
    },
    handleScreenshot() {
      this.$refs.screenshot.capture(document.getElementById('terminal'))
    },
    showSessionWindow() {
      this.sessionWindow = !this.sessionWindow
    },
    closeSessionWindow() {
      this.sessionWindow = false
    },
    handleMask() {
      this.sessionMask = !this.sessionMask
    }
  }
}
</script>

<style lang="less" scoped>
@header-height: 32px;
.web-shell {
  position: relative;
  .toolBar-container {
    height: 100%;
    display: inline-block;
    user-select: none;
    .toolBar-btn {
      height: 100%;
      display: inline-block;
      line-height: @header-height;
      padding: 0 10px;
      color: #eeecec;
      cursor: pointer;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .toolBar-icon {
        margin-right: 4px;
      }
    }
  }
}
.toolBar-dropdown {
  .ant-dropdown-menu {
    background-color: #3c3f41;
    border-radius: 2px;
    box-shadow: #1c1b1b 0px 0px 4px 0px;
    .ant-dropdown-menu-item {
      a {
        min-width: 180px;
        color: rgba(255, 253, 253, 0.79);
        .item-icon {
          display: inline-block;
          width: 22px;
        }
      }
      &:hover,
      &.ant-dropdown-menu-item-active {
        color: #fff;
        background-color: @primary-color;
      }
    }
    .ant-dropdown-menu-item-disabled {
      a {
        cursor: default;
        color: rgba(236, 233, 233, 0.25);
      }
      &:hover {
        background-color: transparent;
        color: rgba(236, 233, 233, 0.25);
      }
    }
    .ant-dropdown-menu-item-divider {
      background-color: #767676;
    }
  }
}
</style>
<style lang="less">
.session-window {
  // .ant-drawer-content-wrapper {
  //   box-shadow: none !important;
  // }
  .ant-drawer-mask {
    background-color: transparent;
  }
  .ant-drawer-content {
    background-color: #3c3f41;
    .ant-drawer-header {
      background-color: #3c3f41;
      border-bottom: 1px solid #616161;
      padding: 0;
      .ant-drawer-close {
        height: 34px;
        width: 34px;
        line-height: 34px;
        color: rgba(255, 253, 253, 0.79);
        font-size: 12px;
        &:focus,
        &:hover {
          color: @primary-color;
        }
      }
      .ant-drawer-title {
        color: rgba(255, 253, 253, 0.79);
        position: relative;
        padding: 6px 16px;
        font-size: 14px;
        .pushpin {
          position: absolute;
          right: 32px;
          top: 0px;
          line-height: 34px;
          font-size: 12px;
          height: 34px;
          cursor: pointer;
          transition: all 0.3s;
          &:focus,
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
    .ant-drawer-body {
      padding: 0px;
      color: rgba(255, 253, 253, 0.59);
      .session {
        padding: 6px 24px;
        user-select: none;
        cursor: pointer;
        transition: all 0.3s;
        &.active {
          background-color: @primary-color;
          color: #fff;
        }
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
