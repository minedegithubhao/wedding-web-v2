<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="业务ID">
        <a-input placeholder="业务ID" v-decorator="['busId']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="删除标识">
        <a-input placeholder="删除标识" v-decorator="['delFlag']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建人">
        <a-input placeholder="创建人" v-decorator="['createBy']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="修改人">
        <a-input placeholder="修改人" v-decorator="['updateBy']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveTSysFile } from '@/api/pts/sys/TSysFile'
import pick from 'lodash.pick'
export default {
  name: 'TSysFileModal',
  props: {},
  components: {},
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    add() {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'id',
            'fileRealname',
            'fileFullpath',
            'storageName',
            'busId',
            'storageType',
            'status',
            'delFlag',
            'createBy',
            'createTime',
            'updateBy',
            'updateTime',
            'remark'
          )
        )
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveTSysFile(values)
            .then(res => {
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
              this.confirmLoading = false
            })
        }
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
