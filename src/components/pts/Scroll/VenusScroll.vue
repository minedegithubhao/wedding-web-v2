<template>
  <vuescroll :ops="ops"
             class="venus-scroll"
             ref="vs"
             @handle-scroll="handleScroll"
             @handle-resize="handleResize">
    <slot></slot>
  </vuescroll>
</template>
<script>
import vuescroll from 'vuescroll'
import { mixinDevice, mixin } from '@/utils/mixin'

export default {
  name: 'VenusScroll',
  props: {
    enable: {
      type: Boolean,
      default: false
    },
    onlyShowBarOnScroll: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: '4px'
    },
    gutterOfSide: {
      type: String,
      default: '2px'
    },
    sizeStrategy: {
      type: [Number, String],
      default: '100%'
    },
    initialScrollY: {
      type: [Number, String, Boolean],
      default: false
    },
    initialScrollX: {
      type: [Number, String, Boolean],
      default: false
    },
    // 是否启用横向滚动条，设置为true时，确保父级元素宽度是否固定
    scrollingX: {
      type: Boolean,
      default: false
    },
    scrollingY: {
      type: Boolean,
      default: true
    },
    disable: {
      type: Boolean,
      default: false
    },
    detectResize: {
      type: Boolean,
      default: false
    },
    gutterOfEnds: {
      type: String,
      default: '0px'
    },
    background: {
      type: String,
      default: '#556EE6'
    },
    barOpacity: {
      type: Number,
      default: 0.52
    },
    keepShow: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: Number,
      default: undefined
    },
    mode: {
      type: String,
      default: undefined
    },
    isMonitorScroll: {
      type: Boolean,
      default: false
    },
    openScrollEvent: {
      type: Boolean,
      default: false
    }
  },
  mixins: [mixinDevice, mixin],
  components: {
    vuescroll
  },
  watch: {
    detectResize(val) {
      this.ops.vuescroll.detectResize = val
    },
    mode(val) {
      this.ops.vuescroll.mode = val
    }
  },
  data() {
    const ops = {
      vuescroll: {
        mode: this.mode || 'native',
        sizeStrategy: this.sizeStrategy,
        detectResize: this.detectResize,
        wheelScrollDuration: 400
      },
      scrollPanel: {
        initialScrollY: this.initialScrollY,
        initialScrollX: this.initialScrollX,
        scrollingX: this.scrollingX,
        scrollingY: this.scrollingY,
        maxHeight: this.maxHeight,
        speed: 300
      },
      rail: {
        gutterOfEnds: this.gutterOfEnds,
        gutterOfSide: this.gutterOfSide,
        size: this.size
      },
      bar: {
        disable: false,
        background: this.background,
        keepShow: this.keepShow,
        size: this.size,
        opacity: this.barOpacity,
        minSize: 0.2,
        onlyShowBarOnScroll: this.onlyShowBarOnScroll
      },
      scrollButton: {
        enable: this.enable,
        background: this.background,
        opacity: 1,
        step: 30,
        mousedownStep: 30
      }
    }
    return {
      ops: ops
    }
  },
  created() {
    this.ops.bar.background = this.background || this.primaryColor
    this.ops.scrollButton.background = this.background || this.primaryColor
    if (this.mode && ['native', 'slide'].indexOf(this.mode) > -1) {
      this.ops.vuescroll.mode = this.mode
    } else {
      this.ops.vuescroll.mode = this.isMobile() ? 'slide' : 'native'
    }
    if (this.openScrollEvent) {
      this.$store.dispatch('BackTop', this.scrollToTop)
      this.$store.dispatch('BackToView', this.scrollToView)
    }
  },
  methods: {
    handleScroll(vertical, horizontal, e) {
      this.$store.dispatch('HandleScroll', { vertical, horizontal, e })
    },
    handleResize(vertical, horizontal, nativeEvent) {
      this.$refs['vs'].scrollTo(
        {
          y: nativeEvent.height
        },
        500,
        'easeInQuad'
      )
    },
    scrollToTop() {
      this.$refs['vs'].scrollTo(
        {
          y: 0
        },
        500,
        'easeInQuad'
      )
    },
    scrollToView(elementId) {
      if (elementId) {
        this.$refs['vs'].scrollIntoView(elementId, 500)
      }
    },
    scrollToX(height) {
      this.$refs['vs'].scrollBy(
        {
          dx: height
        },
        500,
        'easeInQuad'
      )
    },
    scrollToY(height) {
      this.$refs['vs'].scrollBy(
        {
          dy: height
        },
        500,
        'easeInQuad'
      )
    }
  }
}
</script>
<style lang="less">
.venus-scroll {
  .__view {
    min-height: auto !important;
  }
}
</style>
