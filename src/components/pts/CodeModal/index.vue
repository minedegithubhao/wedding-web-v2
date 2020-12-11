<template>
  <a-modal v-model="dialogVisible"
           :title="title"
           style="top: 20px;"
           width="30%"
           :bodyStyle="{ height: '600px',padding: 0 }"
           @ok="handleOk"
           :footer="null">
    <a-spin tip="Loading..."
            :spinning="loading"
            class="code-codemirror-spin">
      <venus-scroll :scrolling-x="true"
                    :only-show-bar-on-scroll="false"
                    size="8px"
                    gutter-of-side="0px">
        <div class="code-codemirror">
          <codemirror :value="flowJsonData"
                      :options="options"
                      class="code"></codemirror>
        </div>
      </venus-scroll>
    </a-spin>
  </a-modal>
</template>

<script>
import 'codemirror/lib/codemirror.css'
import { codemirror } from 'vue-codemirror'
import VenusScroll from '@/components/pts/Scroll'
require('codemirror/mode/javascript/javascript.js')

export default {
  props: {
    data: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    codemirror,
    VenusScroll
  },
  data() {
    return {
      dialogVisible: false,
      flowJsonData: {},
      loading: false,
      title: '流程数据信息',
      options: {
        mode: { name: 'javascript', json: true },
        lineNumbers: true,
        height: 500
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    setLoading(flag) {
      this.loading = flag || false
    },
    init(json, title) {
      if (!this.dialogVisible) {
        this.show()
      }
      this.title = title
      if (json) {
        this.flowJsonData = JSON.stringify(json, null, 4).toString()
      } else {
        this.flowJsonData = JSON.stringify(this.data, null, 4).toString()
      }
    }
  }
}
</script>
<style lang="less">
.CodeMirror {
  height: auto;
}
.CodeMirror-scroll {
  height: auto;
}
.code-codemirror-spin {
  height: 100%;
  .ant-spin-container {
    height: 100%;
    .venus-scroll {
      .__rail-is-vertical {
        z-index: 5 !important;
      }
      .__rail-is-horizontal {
        z-index: 5 !important;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.code-codemirror {
  padding: 0px;
}
</style>
