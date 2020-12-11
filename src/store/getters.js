const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  allTopMenus: state => state.permission.allTopMenus,
  topMenuList: state => state.permission.topMenuList,
  multiTab: state => state.app.multiTab,
  scrollInfo: state => state.app.scrollInfo,
  backTop: state => state.app.backTop,
  backToView: state => state.app.backToView,
  lang: state => state.i18n.lang,
  // 从后台获取的用户 按钮权限
  buttons: state => state.user.buttons,
  userId: state => state.user.userId
}

export default getters
