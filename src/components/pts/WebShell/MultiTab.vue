<script>
import Terminal from './terminal'
import { cloneDeep } from 'lodash'
import { createUuid } from '@/utils/util.js'

export default {
  name: 'ShellMultiTab',
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerWidth: {
      type: String,
      default: '185px'
    }
  },
  data() {
    return {
      keyList: [],
      pages: [],
      activeKey: '',
      indexPage: {}
    }
  },
  created() {
  },
  methods: {
    open(session) {
      const link = cloneDeep(session)
      const pages = this.pages.filter(page => page.id === link.id)
      link.key = createUuid()
      if (pages.length === 0) {
        this.pages.push(link)
      } else {
        link.name = `${link.name}(${pages.length + 1})`
        this.pages.push(link)
      }
      this.keyList.push(link.key)
      this.activeKey = link.key
    },
    close(id) {
      const pages = this.pages.filter(page => page.id === id)
      pages.forEach(page => {
        this.remove(page.key)
      })
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    remove(targetKey) {
      this.pages = this.pages.filter(page => page.key !== targetKey)
      this.keyList = this.keyList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.keyList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath() {
      this.activeKey = this.keyList[this.keyList.length - 1]
    },
    closeConnect(e) {
      const pages = this.pages.filter(page => page.key === e)
      pages.forEach(page => {
        this.close(page.id)
      })
    },

    // content menu
    closeThat(e) {
      this.remove(e)
    },
    closeLeft(e) {
      const currentIndex = this.keyList.indexOf(e)
      if (currentIndex > 0) {
        this.keyList.forEach((key, index) => {
          if (index < currentIndex) {
            this.remove(key)
          }
        })
      } else {
        this.$message.info('左侧没有会话标签')
      }
    },
    closeRight(e) {
      const currentIndex = this.keyList.indexOf(e)
      if (currentIndex < this.keyList.length - 1) {
        this.keyList.forEach((key, index) => {
          if (index > currentIndex) {
            this.remove(key)
          }
        })
      } else {
        this.$message.info('右侧没有会话标签')
      }
    },
    closeOther(e) {
      const currentIndex = this.keyList.indexOf(e)
      this.keyList.forEach((key, index) => {
        if (index !== currentIndex) {
          this.remove(key)
        }
      })
    },
    closeAll() {
      this.keyList.forEach((key, index) => {
        this.remove(key)
      })
    },
    closeMenuClick(key, route) {
      this[key](route)
    },
    renderTabPaneMenu(e) {
      return (
        <a-menu
          {...{
            on: {
              click: ({ key, item, domEvent }) => {
                this.closeMenuClick(key, e)
              }
            }
          }}
        >
          <a-menu-item key="closeConnect">关闭当前会话</a-menu-item>
          <a-menu-item key="closeThat">关闭当前会话连接</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧会话连接</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧会话连接</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧会话连接</a-menu-item>
          <a-menu-item key="closeOther">关闭其它会话连接</a-menu-item>
          <a-menu-item key="closeAll">关闭全部会话连接</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane(title, key) {
      const menu = this.renderTabPaneMenu(key)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{title}</span>
        </a-dropdown>
      )
    }
  },
  watch: {
  },
  render() {
    const {
      onEdit,
      $data: { pages }
    } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          tab={this.renderTabPane(page.name, page.key)}
          key={page.key}
          closable={true}
          forceRender={true}
        ><Terminal termData={page} key={page.key}></Terminal></a-tab-pane>
      )
    })

    return (
      <div class="shell-tab" style={ `marginLeft: ${ this.showDrawer ? this.drawerWidth : '0px' }` }>
        <div class="shell-tab-wrapper">
          <a-tabs
            hideAdd
            size="small"
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#3b3b3b', height: '35px', margin: 0, paddingLeft: '8px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
<style lang="less">
.shell-tab {
  transition: all 0.4s ease 0s;
  .shell-tab-wrapper {
    .ant-tabs-bar {
      border-bottom-color: #616161;
      .ant-tabs-nav-container {
        height: 35px;
        .ant-tabs-nav-wrap {
          .ant-tabs-nav {
            .ant-tabs-tab {
              height: 34px;
              line-height: 33px;
              background: #e5e5e5;
            }
          }
        }
      }
    }
  }
}
</style>
