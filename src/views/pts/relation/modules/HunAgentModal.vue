<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="800"
           v-model="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit">
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="姓名">
        <a-input placeholder="姓名"
                 v-decorator="['name', {rules: [{required: true, message: '请输入姓名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="联系方式">
        <a-input placeholder="11 位手机号"
                 v-decorator="['phone', {rules: [{ required: true, message: '请输入正确的联系方式', pattern: /^1[3456789]\d{9}$/ } ], validateTrigger: ['change', 'blur'] }]">
          <a-select slot="addonBefore"
                    size="large"
                    defaultValue="+86">
            <a-select-option value="+86">+86</a-select-option>
            <a-select-option value="+87">+87</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="与代理人关系">
        <a-select placeholder="与代理人关系"
                  v-decorator="['relation', {initialValue: undefined, rules: [{required: true, message: '请选择与代理人关系'}]}]">
          <a-select-option v-for="(b, index) in relationArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="微信">
        <a-input placeholder="微信"
                 v-decorator="['wechat']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="QQ">
        <a-input placeholder="QQ"
                 v-decorator="['qq']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="邮箱">
        <a-input placeholder="邮箱"
                 v-decorator="['email']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="状态">
        <a-select v-decorator="['status', {initialValue:'0', rules: [{required: true, message: '请选择状态'}]}]">
          <a-select-option v-for="(b, index) in statusArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备注">
        <a-textarea :rows="3"
                    placeholder="备注"
                    v-decorator="['remark']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveHunAgent } from '@/api/pts/relation/agent'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'HunAgentModal',
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
      statusArray: [],
      relationArray: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() { },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('sys_normal_disable').then((data) => {
        this.statusArray = data
      })
      getDictArray('hun_agent_relation').then((data) => {
        this.relationArray = data
      })
    },
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
            'status',
            'remark',
            'name',
            'phone',
            'relation',
            'wechat',
            'qq',
            'email'
          )
        )
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveHunAgent(values)
            .then((res) => {
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
  }
}
</script>
