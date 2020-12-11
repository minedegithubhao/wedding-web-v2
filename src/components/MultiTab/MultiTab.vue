<script>
import events from './events'

export default {
  name: 'MultiTab',
  props: {
    currentTopMenu: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    const curTopMenu = {
      fullPath: this.currentTopMenu.component,
      name: this.currentTopMenu.code,
      meta: { title: this.currentTopMenu.source },
      closable: false
    }
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0,
      indexPage: curTopMenu
    }
  },
  created() {
    // bind event
    events
      .$on('open', val => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`)
        }
        this.activeKey = val
      })
      .$on('close', val => {
        if (!val) {
          this.closeThat(this.activeKey)
          return
        }
        this.closeThat(val)
      })

    if (this.$route.path !== this.indexPage.fullPath) {
      this.pages.push(this.indexPage)
      this.fullPathList.push(this.indexPage.fullPath)
    }

    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.selectedLastPath()
  },
  methods: {
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    remove(targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath() {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },

    // content menu
    closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        if (e !== this.indexPage.fullPath) {
          this.remove(e)
        } else {
          this.$message.info('这是首页, 无法被关闭')
        }
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    closeLeft(e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex > 0) {
        if (currentIndex === 1 && this.fullPathList[0] === this.indexPage.fullPath) {
          this.$message.info('左侧没有标签')
        } else {
          this.fullPathList.forEach((item, index) => {
            if (index < currentIndex) {
              if (item !== this.indexPage.fullPath) {
                this.remove(item)
              }
            }
          })
        }
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    closeRight(e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex < this.fullPathList.length - 1) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            if (item !== this.indexPage.fullPath) {
              this.remove(item)
            }
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    closeOther(e) {
      const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex && item !== this.indexPage.fullPath) {
          this.remove(item)
        }
      })
    },
    closeAll() {
      // const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (item !== this.indexPage.fullPath) {
          this.remove(item)
        }
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
          <a-menu-item key="closeThat">关闭当前标签</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeOther">关闭其它</a-menu-item>
          <a-menu-item key="closeAll">关闭全部</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane(title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{title}</span>
        </a-dropdown>
      )
    }
  },
  watch: {
    $route: function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        // 使欢迎页不能关闭
        if (newVal.fullPath === this.indexPage.fullPath) {
          // newVal['closable'] = false
          this.pages.push({ ...newVal, closable: false })
        } else {
          this.pages.push(newVal)
        }
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    },
    indexPage: function (newIndex) {
      this.indexPage = newIndex
      this.$router.push({ path: newIndex.fullPath })
      this.closeAll()
    }
  },
  render() {
    const {
      onEdit,
      $data: { pages }
    } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.title, page.fullPath)}
          key={page.fullPath}
          closable={!(pages.length <= 1 || (page.closable !== undefined && !page.closable))}
        ></a-tab-pane>
      )
    })

    return (
      <div class="ant-pro-multi-tab">
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ margin: 0, paddingLeft: '2px', paddingTop: '1px' }}
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
