<template>
  <div class="footer portal-footer">
    <logo class="top-nav-header"
          :show-title="device !== 'mobile'"
          :title="logoTitle" />
    <div class="links">
      <a href="/portalClient/index"
         target="_blank">首页</a>
      <a href="/portalClient/script/index"
         target="_blank">指纹验证</a>
      <a href="/dashboard/welcome"
         target="_blank">系统管理</a>
      <a href="/portalClient/special/index"
         target="_blank">专项服务</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" />2020
      <span>PTS</span>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/tools/Logo'

export default {
  name: 'GlobalFooter',
  components: {
    Logo
  },
  data() {
    return { logoTitle: '婚介管理平台' }
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
