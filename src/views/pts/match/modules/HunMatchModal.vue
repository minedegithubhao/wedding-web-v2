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
                   label="珊瑚标记">
        <a-input placeholder="珊瑚标记"
                 v-decorator="['delFlag']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="状态">
        <a-radio-group v-decorator="['status']">
          <a-radio :value="b.dictValue"
                   v-for="(b, index) in statusArray"
                   :key="index">
            {{ b.dictLabel }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="创建人">
        <a-input placeholder="创建人"
                 v-decorator="['createBy']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="创建时间">
        <a-date-picker placeholder="创建时间"
                       v-decorator="['createTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="更新人">
        <a-input placeholder="更新人"
                 v-decorator="['updateBy']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="更新时间">
        <a-date-picker placeholder="更新时间"
                       v-decorator="['updateTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备注">
        <a-textarea :rows="3"
                    placeholder="备注"
                    v-decorator="['remark']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备用字段">
        <a-input placeholder="备用字段"
                 v-decorator="['parse1']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备用字段">
        <a-input placeholder="备用字段"
                 v-decorator="['parse2']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备用字段">
        <a-input placeholder="备用字段"
                 v-decorator="['parse3']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备用字段">
        <a-input placeholder="备用字段"
                 v-decorator="['parse4']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备用字段">
        <a-input placeholder="备用字段"
                 v-decorator="['parse5']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="男id">
        <a-input placeholder="男id"
                 v-decorator="['mid']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="女id">
        <a-input placeholder="女id"
                 v-decorator="['wid']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="红娘id">
        <a-input placeholder="红娘id"
                 v-decorator="['mmid']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="配对时间">
        <a-date-picker placeholder="配对时间"
                       v-decorator="['matchTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="配对状态">
        <a-radio-group v-decorator="['matchStatus']">
          <a-radio :value="b.dictValue"
                   v-for="(b, index) in matchStatusArray"
                   :key="index">
            {{ b.dictLabel }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="配对成功时间">
        <a-date-picker placeholder="配对成功时间"
                       v-decorator="['successTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="配对失败时间">
        <a-date-picker placeholder="配对失败时间"
                       v-decorator="['failedTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="配对失败原因">
        <a-textarea :rows="3"
                    placeholder="配对失败原因"
                    v-decorator="['failedReason']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveHunMatch } from '@/api/pts/match/match'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'HunMatchModal',
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
      matchStatusArray: [],
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
      getDictArray('sys_normal_disable').then(data => {
        this.statusArray = data
      })
      getDictArray('hun_match_status').then(data => {
        this.matchStatusArray = data
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
        this.form.setFieldsValue(pick(this.mdl, 'id', 'delFlag', 'status', 'createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parse1', 'parse2', 'parse3', 'parse4', 'parse5', 'mid', 'wid', 'mmid', 'matchTime', 'matchStatus', 'successTime', 'failedTime', 'failedReason'))
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveHunMatch(values).then(res => {
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
