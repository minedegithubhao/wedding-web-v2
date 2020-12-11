<template>
  <div class="shell-container">
    <web-shell></web-shell>
  </div>
</template>

<script>
import WebShell from '@/components/pts/WebShell/index.vue'

export default {
  name: 'WebShellDemo',
  components: {
    WebShell
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.shell-container {
  // margin: 0px 20% 0px;
  // height: 500px;
}
</style>
