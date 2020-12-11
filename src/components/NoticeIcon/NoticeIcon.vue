<template>
  <a-popover v-model="visible"
             trigger="click"
             placement="bottomRight"
             overlayClassName="header-notice-wrapper"
             :getPopupContainer="() => $refs.noticeRef.parentElement"
             :autoAdjustOverflow="true"
             :arrowPointAtCenter="true"
             :overlayStyle="{ width: '300px', top: '50px' }">
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane tab="通知"
                      key="1">
            <a-list>
              <a-list-item>
                <a-list-item-meta title="通知一"
                                  description="一个小时前">
                  <a-avatar style="background-color: white"
                            slot="avatar"
                            :src="one" />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="通知二"
                                  description="一天前">
                  <a-avatar style="background-color: white"
                            slot="avatar"
                            :src="two" />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="通知三"
                                  description="两天前">
                  <a-avatar style="background-color: white"
                            slot="avatar"
                            :src="three" />
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="消息"
                      key="2">
            123
          </a-tab-pane>
          <a-tab-pane tab="待办"
                      key="3">
            123
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice"
          class="header-notice"
          ref="noticeRef"
          style="padding: 0 18px">
      <a-badge count="12"
               :numberStyle="{height:'12px',lineHeight:'12px',padding:'0 4px'}">
        <a-icon style="font-size: 20px; padding: 0 4px"
                type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import one from '@/assets/icons/ThXAXghbEsBCCSDihZxY.png'
import two from '@/assets/icons/OKJXDXrmkNshAMvwtvhu.png'
import three from '@/assets/icons/kISTdvpyTAhtGxpovNWd.png'
export default {
  name: 'HeaderNotice',
  data() {
    return {
      loading: false,
      visible: false,
      one: one,
      two: two,
      three: three
    }
  },
  methods: {
    fetchNotice() {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: middle;
  }
}
</style>
