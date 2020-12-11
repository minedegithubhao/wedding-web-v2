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
                 v-decorator="['name', {rules: [{ required: true, message: '请输入姓名' }]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="性别">
        <a-select placeholder="性别"
                  v-decorator="['sex', {rules: [{ required: true, message: '请选择性别' }]}]">
          <a-select-option v-for="(b, index) in sexArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="生日">
        <a-date-picker placeholder="生日"
                       v-decorator="['birthday']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="家庭住址">
        <a-textarea placeholder="家庭住址..."
                    v-decorator="['homeAddr', {rules: [{ required: false, message: '请输入家庭住址' }]}]"
                    :auto-size="{ minRows: 3, maxRows: 6 }" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="联系电话">
        <a-input placeholder="联系电话"
                 v-decorator="['phone', {rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ } ], validateTrigger: ['change', 'blur'] }]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="微信号">
        <a-input placeholder="微信号"
                 v-decorator="['wechat']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="QQ号">
        <a-input placeholder="QQ号"
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
                   label="红娘类型">
        <a-select placeholder="红娘类型"
                  v-decorator="['type', {rules: [{ required: true, message: '请选择红娘类型' }]}]">
          <a-select-option v-for="(b, index) in typeArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="是否掌握资源">
        <a-select placeholder="是否掌握资源"
                  v-decorator="['source', {rules: [{ required: true, message: '请选择是否掌握资源' }]}]">
          <a-select-option v-for="(b, index) in sourceArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="提成类型">
        <a-select placeholder="提成类型"
                  v-decorator="['presentType', {rules: [{ required: true, message: '请选择提成类型' }]}]">
          <a-select-option v-for="(b, index) in presentTypeArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="提成值">
        <a-input placeholder="提成值"
                 v-decorator="['persentValue']" />
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
    </a-form>
  </a-modal>
</template>
<script>
import { saveHunMatchmaker } from '@/api/pts/matchmaker/matchmaker'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'
import moment from 'moment'

export default {
  name: 'HunMatchmakerModal',
  props: {
  },
  components: {
  },
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
      sexArray: [],
      sourceArray: [],
      presentTypeArray: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('sys_sex').then(data => {
        this.sexArray = data
      })
      getDictArray('hun_matchmaker_type').then(data => {
        this.typeArray = data
      })
      getDictArray('hun_matchmaker_resources').then(data => {
        this.sourceArray = data
      })
      getDictArray('hun_matchmaker_extra_salary_type').then(data => {
        this.presentTypeArray = data
      })
      getDictArray('sys_normal_disable').then(data => {
        this.statusArray = data
      })
    },
    add() {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      if (this.mdl.birthday) {
        this.mdl.birthday = moment(this.mdl.birthday, 'YYYY-MM-DD')
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'delFlag', 'status', 'createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parse1', 'parse2', 'parse3', 'parse4', 'parse5', 'name', 'sex', 'birthday', 'homeAddr', 'phone', 'wechat', 'qq', 'email', 'type', 'source', 'presentType', 'persentValue'))
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.birthday) {
            values.birthday = values.birthday.format('YYYY-MM-DD')
          }
          this.confirmLoading = true
          saveHunMatchmaker(values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  }
}
</script>
