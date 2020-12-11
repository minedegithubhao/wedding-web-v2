<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="500"
           v-model="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit">
    <a-form :form="form">
      <div class="modal-divider-text">基本配置</div>
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="模块名称">
        <a-input placeholder="模块名称"
                 v-decorator="['modelName',{rules: formValidatorRules.modelName}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="模块代码">
        <a-input placeholder="模块代码"
                 v-decorator="['modelCode',{rules: formValidatorRules.modelCode}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="参数模版">
        <a-input placeholder="参数模版"
                 v-decorator="['configTemplet',{rules: [{ required: true, message: '请输入参数模版' }]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="当前最大值">
        <a-input-number placeholder="当前最大值"
                        v-decorator="['maxSerial',{rules: [{ required: true, message: '请输入当前最大值' }]}]"
                        :min="1"
                        style="width: 200px"
                        :max="1000000" />

      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="缓存个数">

        <a-input-number placeholder="缓存个数"
                        v-decorator="['preMaxNum',{rules: [{ required: true, message: '请输入缓存个数' }]}]"
                        :min="1"
                        style="width: 200px"
                        :max="1000000" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="自增标识">
        <a-input-number placeholder="自增标识"
                        v-decorator="['autoIncrementFlag',{rules: [{ required: true, message: '请输入自增标识' }]}]"
                        :min="1"
                        style="width: 200px"
                        :max="1000000" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="状态">
        <a-select v-decorator="['status', {initialValue:'0',rules: [{ required: true, message: '请选择状态' }]}]">
          <a-select-option v-for="(b, index) in statusArry"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="备注">
        <a-textarea :rows="5"
                    placeholder="..."
                    v-decorator="['remark',{rules: [{ required: false, message: '请输入备注' }]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveTSysSerialNumber, uniqueTSysSerialNumber } from '@/api/pts/sys/TSysSerialNumber'
import { getDictArray } from '@/utils/dict'
import pick from 'lodash.pick'
const statusMap = {}
export default {
  name: 'TSysSerialNumberModal',
  props: {},
  components: {},
  data () {
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
      form: this.$form.createForm(this),
      formValidatorRules: {
        modelName: [{ required: true, message: '请输入名称' }, { validator: this.validatorModelName }],
        modelCode: [{ required: true, message: '请输入编号' }, { validator: this.validatorModelCode }]
      },
      statusArry: []
    }
  },
  async beforeCreate () {
    this.statusArry = await getDictArray('sys_normal_disable')
    this.statusArry.map(d => {
      statusMap[d.dictValue] = { text: d.dictLabel }
    })
  },
  created () {
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'id',
            'modelName',
            'modelCode',
            'configTemplet',
            'maxSerial',
            'preMaxNum',
            'autoIncrementFlag',
            'remark'
          )
        )
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveTSysSerialNumber(values)
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
    },
    validatorModelName (rule, value, callback) {
      const id = this.form.getFieldValue('id')
      const errors = []
      if (value && value !== '') {
        uniqueTSysSerialNumber({ idValue: id, colName: 'model_name', colValue: value })
          .then(res => {
            if (res.code !== 0) {
              errors.push(value + '已存在')
            }
            callback(errors)
          })
          .catch(() => {
            this.$message.error('系统错误，请稍后再试')
          })
          .finally(() => {
            this.confirmLoading = false
          })
      } else {
        return errors
      }
    },
    validatorModelCode (rule, value, callback) {
      const id = this.form.getFieldValue('id')
      const errors = []
      if (value && value !== '') {
        uniqueTSysSerialNumber({ idValue: id, colName: 'model_code', colValue: value })
          .then(res => {
            if (res.code !== 0) {
              errors.push(value + '已存在')
            }
            callback(errors)
          })
          .catch(() => {
            this.$message.error('系统错误，请稍后再试')
			errors.push('系统错误，请稍后再试')
            callback(errors)
          })
          .finally(() => {
            this.confirmLoading = false
          })
      } else {
        callback()
      }
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
