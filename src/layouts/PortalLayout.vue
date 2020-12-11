<template>
  <a-layout :class="['layout', device, 'portal-layout']"
            id="portal-layout">
    <portal-header header-type="portal" />
    <div class="portal-container">
      <transition name="page-transition">
        <router-view />
      </transition>
    </div>
    <portal-footer />
  </a-layout>
</template>

<script>
import PortalFooter from '@/components/pts/PortalFooter'
import PortalHeader from '@/components/pts/PortalHeader'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'PortalLayout',
  mixins: [mixin, mixinDevice],
  components: {
    PortalHeader,
    PortalFooter
  }
}
</script>

<style lang="less">
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
