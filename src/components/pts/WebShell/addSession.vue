<template>
  <a-modal
    title="新建会话"
    :width="400"
    v-model="visible"
    :confirmLoading="confirmLoading"
    :get-container="container"
    wrap-class-name="session-model"
    @ok="handleSubmit"
  >
    <a-form :form="form" hideRequiredMark>
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item label="连接名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="连接名称"
          v-decorator="['name',{rules: [{ required: true, message: '请输入连接名称' }]}]"
        />
      </a-form-item>
      <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="IP地址"
          v-decorator="['ip',{rules: [{ validator: checkMultipleInput }]}]"
        />
      </a-form-item>
      <a-form-item label="端口" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="端口"
          v-decorator="['port',{initialValue: '22', rules: [{ required: true, message: '请输入端口' }]}]"
        />
      </a-form-item>
      <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="用户名"
          v-decorator="['username',{rules: [{ required: true, message: '请输入用户名' }]}]"
        />
      </a-form-item>
      <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          placeholder="密码"
          type="password"
          v-decorator="['password',{rules: [{ required: true, message: '请输入密码' }]}]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
// import { saveConfig } from '@/api/system'
import pick from 'lodash.pick'
import { createUuid } from '@/utils/util'

export default {
  name: 'AddSession',
  props: ['container'],
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
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {},
  created() {},
  methods: {
    add() {
      this.form.resetFields()
      this.edit({ id: createUuid() })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'id',
            'name',
            'ip',
            'port',
            'username',
            'password'
          )
        )
      })
    },
    checkMultipleInput(rule, value, callback) {
      if (value) {
        const patt = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (patt.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的ip地址'))
        }
      }
      callback(new Error('请输入IP地址'))
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('ok', values)
          this.visible = false
          // this.confirmLoading = true
          // saveConfig(values)
          //   .then(res => {
          //     if (res.code === 0) {
          //       this.$message.success('保存成功')
          //       this.$emit('ok')
          //       this.visible = false
          //     } else {
          //       this.$message.success(res.msg)
          //     }
          //   })
          //   .catch(() => {
          //     this.$message.error('系统错误，请稍后再试')
          //   })
          //   .finally(() => {
          //     this.confirmLoading = false
          //   })
        }
      })
    }
  }
}
</script>
