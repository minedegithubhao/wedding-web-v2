<template>
  <div class="screenshot-container"
       v-if="false">
    <venus-scroll>
      <img id="downImg"
           :src="file.url"
           v-for="file in fileList"
           :key="file.id"
           @click="(e)=> imgClick(file.url, e)" />
    </venus-scroll>
    <a-modal :visible="previewVisible"
             :footer="null"
             @cancel="previewVisible = false"
             width="60%"
             :bodyStyle="{ padding: 0, borderRadius: '3px', border: '1px solid rgba(66, 66, 66, 0.7)' }">
      <img alt="加载失败"
           style="width: 100%"
           :src="imgData" />
    </a-modal>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { createUuid } from '@/utils/util'
import VenusScroll from '@/components/pts/Scroll'

export default {
  name: 'Screenshot',
  components: {
    VenusScroll
  },
  props: {
    afterAction: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [],
      imgData: '',
      previewVisible: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  beforeDestroy () { },
  methods: {
    capture (element) {
      if (!element) {
        console.log(new Error('目标 Element 为空!'))
      } else if (typeof element === 'string') {
        this.setImage(document.getElementById(element))
      } else {
        this.setImage(element)
      }
    },
    // 截取图片
    setImage (nodeBox) {
      const that = this
      const canvas2 = document.createElement('canvas')
      // let _canvas = document.getElementById('child');
      const _canvas = nodeBox
      const w = parseInt(window.getComputedStyle(_canvas).width)
      const h = parseInt(window.getComputedStyle(_canvas).height)
      // 将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      canvas2.width = w
      canvas2.height = h
      canvas2.style.width = w + 'px'
      canvas2.style.height = h + 'px'
      // 可以按照自己的需求，对context的参数修改,translate指的是偏移量
      const context = canvas2.getContext('2d')
      // context.scale(2, 2)
      html2canvas(nodeBox, {
        canvas: canvas2,
        scale: 1
      }).then(function (canvas) {
        const img = that.getBlob(canvas)
        if (that.afterAction) {
          const oMyForm = new FormData()
          const fileName = 'mobile' + '.jpg'
          oMyForm.append('file', img.blob, fileName)
          // oMyForm.append("fileName", fileName);
          oMyForm.append('fileType', 'image')
          // oMyForm.append('user_id', that)
          that.$emit('uploadResult', 'success', { formData: oMyForm, img: img })
        }
      })
    },
    // onUploadProgress (e, id) {
    //   // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
    //   // 如果lengthComputable为false，就获取不到e.total和e.loaded
    //   // if (e.lengthComputable) {
    //   //     const rate = this.uploadRate = e.loaded / e.total;  //已上传的比例
    //   //     if (rate < 1) {
    //   //         // 这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
    //   //         // 因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
    //   //         // 等响应回来时，再将进度设为100%
    //   //         this.uploadRate = rate;
    //   //         this.uploadStyle.width = (rate *100).toFixed(2)+ '%';
    //   //     }
    //   // }
    //   console.log(e.loaded / e.total)
    //   this.$emit('uploadProgress', e)
    // },
    imgClick (imgUrl, e) {
      this.imgData = imgUrl
      this.previewVisible = true
    },
    getBlob (canvas) {
      // 获取blob对象
      let data = canvas.toDataURL('image/jpeg', 1)
      const uuid = createUuid()
      // 把图片添加到图片队列中
      this.fileList.push({ id: uuid, url: data })
      data = data.split(',')[1]
      data = window.atob(data)
      const ia = new Uint8Array(data.length)
      for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
      }
      return {
        blob: new Blob([ia], { type: 'image/jpeg' }),
        id: uuid
      }
    }
  }
}
</script>

<style lang="less" scoped>
.screenshot-container {
  padding: 6px;
  transition: all 0.3s;
  img {
    width: 100px;
    margin: 6px 6px;
    border-radius: 2px;
    border: 1px solid #495ba9;
    transition: all 0.3s;
    cursor: pointer;
    &:hover,
    &:focus {
      border-color: @primary-color;
    }
  }
}
</style>
