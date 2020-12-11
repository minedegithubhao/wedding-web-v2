import Dropdown from 'ant-design-vue/es/dropdown'
import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

export default {
  name: 'HMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    slot: {
      type: String,
      required: false
    },
    className: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted() {
    this.updateMenu()
  },
  watch: {
    collapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function() {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange(openKeys) {
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    onSelect({ item, key, selectedKeys }) {
      this.selectedKeys = selectedKeys
      this.$emit('select', { item, key, selectedKeys })
    },
    updateMenu() {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      this.selectKey = this.$route.name
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }

      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },

    // render
    renderItem(menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderCustomTag(menu) {
      const target = menu.meta.target || null
      const CustomTag = (target && 'a') || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta.target }
      return (
        <CustomTag {...{ props, attrs }}>
          {this.renderIcon(menu.meta.icon)}
          <span>{menu.meta.title}</span>
        </CustomTag>
      )
    },
    renderMenuItem(menu) {
      if (menu.children && menu.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }

      return <Menu.Item {...{ key: menu.path }}>{this.renderCustomTag(menu)}</Menu.Item>
    },
    renderSubMenu(menu) {
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        <Menu.SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </Menu.SubMenu>
      )
    },
    renderIcon(icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof icon === 'object' ? (props.component = icon) : (props.type = icon)
      return <Icon {...{ props }} />
    },
    renderDropdown(menu) {
      const dynamicProps = {
        props: {
          mode: this.mode,
          theme: this.theme,
          openKeys: this.openKeys,
          selectedKeys: this.selectedKeys,
          class: this.class
        },
        on: {
          openChange: this.onOpenChange,
          select: this.onSelect
        }
      }

      const menuTree =
        menu.children && !menu.hideChildrenInMenu
          ? menu.children.map(item => {
              return this.renderItem(item)
            })
          : null
      let flag = false
      if (menu.children && menu.children.length > 0) {
        flag = menu.children.some(item => item.name === this.selectKey)
      } else if (menu.name === this.selectKey) {
        flag = true
      }
      const active = flag ? 'active' : undefined
      return menuTree ? (
        <Dropdown>
          <a class={`horizontal-menu-dropdown-link ${active}`} on={{ click: e => e.preventDefault() }}>
            {this.renderIcon(menu.meta.icon)}
            {menu.meta.title}
            <Icon type="down" />
          </a>
          <Menu {...dynamicProps} slot="overlay" class="horizontal-menu-dropdown">
            {menuTree}
          </Menu>
        </Dropdown>
      ) : (
        <a class={`horizontal-menu-dropdown-link ${active}`} on={{ click: e => e.preventDefault() }}>
          {this.renderCustomTag(menu)}
        </a>
      )
    }
  },

  render() {
    const dropdownTree = this.menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderDropdown(item)
    })
    return (
      <div class="horizontal-menu">
        <div class={this.className}>{dropdownTree}</div>
      </div>
    )
  }
}
