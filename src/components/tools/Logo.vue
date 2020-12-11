<template>
  <div class="logo">
    <a href=""
       v-if="isLink">
      <img src="~@/assets/logo.png"
           alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </a>
    <template v-else>
      <img src="~@/assets/logo.png"
           alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </template>
  </div>
</template>

<script>
// import LogoSvg from '@/assets/logo.png?inline'

export default {
  name: 'Logo',
  // components: {
  //   LogoSvg
  // },
  props: {
    title: {
      type: String,
      default: '婚介管理平台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    },
    isLink: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
