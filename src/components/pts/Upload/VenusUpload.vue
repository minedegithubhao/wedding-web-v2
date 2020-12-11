<template>
  <a-upload :list-type="listType || 'text'"
            :multiple="multiple"
            :accept="accept"
            :method="method"
            :directory="directory"
            :customRequest="customRequest"
            :data="data"
            :disabled="disabled"
            :name="name"
            :previewFile="previewFile"
            :showUploadList="showUploadList"
            :supportServerRender="supportServerRender"
            :withCredentials="withCredentials"
            :openFileDialogOnClick="openFileDialogOnClick"
            :transformFile="transformFile"
            :headers="headers"
            :fileList="sFileList"
            :action="action || defaultAction"
            @change="fileChange"
            @download="download"
            @preview="filePreview"
            @reject="reject"
            :beforeUpload="beforeUpload"
            :remove="fileDelete"
            class="venus-upload">
    <a-button v-if="!maxLength || (maxLength && sFileList.length < maxLength)"
              :disabled="disabled"
              v-show="!disabledUpload">
      <a-icon type="upload" />点击上传
      <!-- <a-input :value="UUID" @change="handleChange" class="busId"></a-input> -->
    </a-button>
  </a-upload>
</template>

<script>
/**
 *  作者：姚正超
 *  描述：V1.0版本，请勿随意乱更改组件
 *  日期：2020年5月9日
 */
import { Upload as U } from 'ant-design-vue'
import { UUIDTSysSerialNumber } from '@/api/pts/sys/TSysSerialNumber'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import { downloadTSysFile, initTSysFileList, delTSysFile } from '@/api/pts/sys/TSysFile'
import prefix from '@/config/prefix'

export default {
  name: 'VenusUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: Object.assign({}, U.props, {
    headers: {
      type: Object,
      default: function () {
        return { token: Vue.ls.get(ACCESS_TOKEN) }
      }
    },
    action: {
      type: String,
      default: ''
    },
    // 文件类型限制
    acceptType: {
      type: String,
      default: '*'
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: undefined
    },
    // 最大列表长度，如上传多个文件此属性必须存在
    maxLength: {
      type: Number,
      default: undefined
    },
    // 由于antd => Form表单组件限制所加属性，无需关注
    value: {
      type: String,
      default: ''
    },
    // 是否上传到静态资源开放路径
    isOpen: {
      type: [Boolean, String],
      default: false
    },
    // 上传成功的回调方法
    uploadSuccess: {
      // type: Function
    },
    // 上传成功的回调方法
    uploadError: {
      // type: Function
    },
    disabledUpload: {
      type: Boolean,
      default: false
    }
  }),
  data () {
    const value = !this.value || this.value === 0 || this.value === '0' ? '' : this.value
    if (this.disabledUpload && this.disabled && this.value && this.value !== '0') {
      this.UUID = value
      this.sFileList = []
      this.initUpload()
    }
    return {
      sFileList: [],
      UUID: value
      // busId: value
    }
  },
  computed: {
    defaultAction: function () {
      const busId = this.UUID || this.value
      return process.env.VUE_APP_API_BASE_URL + '/pts/sys/TSysFile/upload?busId=' + busId + '&isOpen=' + this.matchOpen
    },
    matchOpen: function () {
      return this.isOpen === true || this.isOpen === 'true' ? 1 : 0
    }
  },
  // async mounted() {
  //   this.UUID = this.value
  // },
  beforeDestroy () {
    this.sFileList = []
  },
  watch: {
    value (val = '') {
      if ((!val || val === '0') && !this.disabledUpload) {
        this.sFileList = []
        this.handleUUID()
      } else if ((this.UUID && this.UUID !== val) || !this.UUID) {
        this.UUID = val
        this.sFileList = []
        this.initUpload()
      }
    }
  },
  created () { },
  methods: {
    triggerChange (e) {
      // Should provide an event to pass value to Form.
      this.$emit('change', this.UUID)
    },
    async handleUUID () {
      await UUIDTSysSerialNumber().then(res => {
        if (res.code === 0) {
          this.UUID = res.data
        } else {
          console.log(new Error('获取busId失败'))
          this.$message.error('上传组件出现意外错误')
        }
      })
    },
    handleChange (e) {
      this.$emit('change', e.target.value)
    },
    fileChange ({ file, fileList }) {
      if (file.status !== 'uploading') {
      }
      if (file.status === 'done') {
        // this.initUpload()
        if (file.response.code === 0) {
          fileList.map(el => {
            if (el.uid === file.uid) {
              el['linkProps'] = { download: 'current' }
            }
            return el
          })
          this.$message.success(`${file.name} 文件上传成功`)
          this.$emit('success', file.response)
          // }
        } else {
          fileList.map(el => {
            if (el.uid === file.uid) {
              el['linkProps'] = { download: 'current' }
            }
            return el
          })
          this.$message.error(`${file.name} 文件上传失败` + file.response.msg)
          this.$emit('error', file.response)
        }
      } else if (file.status === 'error') {
        fileList.map(el => {
          if (el.uid === file.uid) {
            el['linkProps'] = { download: 'current' }
          }
          return el
        })
        this.$message.error(`${file.name} 文件上传失败`)
        this.$emit('error', file.response)
      }
      if (file.status !== undefined) {
        this.sFileList = fileList
        this.triggerChange()
      }
    },
    filePreview (file) {
      if (file.status === 'done') {
        if (file.linkProps.download === 'error') {
          this.$message.error(`${file.name} 文件上传失败，无法下载`)
        } else {
          downloadTSysFile({ fileId: file.response.fileId, delete: false })
        }
      } else {
        this.$message.error(`${file.name} 文件下载出现错误`)
      }
    },
    initUpload () {
      const self = this
      initTSysFileList({ busId: this.value }).then(res => {
        if (res.code === 0) {
          // console.log('文件列表初始化开始-------------')
          if (self.listType === 'text' && this.matchOpen === 1) {
            res.data.some((item, i) => {
              self.sFileList.push({
                uid: item.id,
                name: <a-tooltip><template slot="title">{'点击下载文件'}</template>{item.fileRealname}</a-tooltip>,
                status: 'done',
                response: { fileId: item.id },
                linkProps: { download: 'current' }
              })
            })
          } else {
            res.data.some((item, i) => {
              self.sFileList.push({
                uid: item.id,
                name: <a-tooltip><template slot="title">{'点击下载文件'}</template>{item.fileRealname}</a-tooltip>,
                status: 'done',
                url: self.defaultAction,
                thumbUrl: prefix.OPEN_URL_PREFIX + item.filePath,
                response: { fileId: item.id },
                linkProps: { download: 'current' }
              })
            })
          }
          // res.data.some((item, i) => {
          //   self.sFileList.push({
          //     uid: item.id,
          //     name: item.fileRealname,
          //     status: 'done',
          //     response: { fileId: item.id },
          //     linkProps: { download: 'current' }
          //   })
          // })
        }
      })
    },
    async fileDelete (info) {
      // 删除
      await delTSysFile({ fileId: info.response.fileId, delete: true })
        .then(res => {
          if (res.code === 0) {
            this.sFileList = this.sFileList.filter(file => file.response.fileId !== info.response.fileId)
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        })
        .catch(() => {
          this.$message.error('系统错误，请稍后再试')
        })
        .finally(() => {
        })
    },
    beforeUpload (file, fileList) {
      const isAcceptType = this.typeMatch(file.type)
      if (!isAcceptType) {
        this.$message.error(`文件类型限制为 ${this.acceptType}!`)
      }
      const lessThanMaxSize = !this.maxSize || (this.maxSize && file.size / 1024 / 1024 < this.maxSize)
      if (!lessThanMaxSize) {
        this.$message.error(`文件大小限制为 ${this.maxSize}MB!`)
      }
      return isAcceptType && lessThanMaxSize
    },
    typeMatch (fileType) {
      if (this.acceptType === '*' || this.acceptType === '*/*') {
        return true
      }
      const accept = this.acceptType.split(',')
      const type = fileType.indexOf('/') > -1 ? fileType.split('/')[1] : fileType
      for (let i = 0; i < accept.length; i++) {
        if (accept[i] === type) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.busId {
  display: none;
  width: 0px;
  height: 0px;
}
.venus-upload {
  cursor: pointer;
}
.ant-upload .ant-upload-list .ant-upload-list-item .ant-upload-list-item {
  height: 40px;
}
// .venus-upload {
//   .ant-upload-list-item-card-actions {
//     opacity: 1;
//   }
// }
</style>
