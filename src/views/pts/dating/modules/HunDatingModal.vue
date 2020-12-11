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
                   label="男方">
        <a-input placeholder="请选择男方"
                 style="display: none"
                 v-decorator="['mid', {rules: [{ required: true, message: '请选择男方' }]}]" />
        <a-button type="primary"
                  icon="plus"
                  @click="handleSelect('mid')">选择</a-button>
        <span v-if="mname.mid">
          已选择<span class="warning-color"
                style="margin: 0 4px">{{ mname.mid }}</span>
        </span>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="女方">
        <a-input placeholder="请选择女方"
                 style="display: none"
                 v-decorator="['wid', {rules: [{ required: true, message: '请选择女方' }]}]" />
        <a-button type="primary"
                  icon="plus"
                  @click="handleSelect('wid')">选择</a-button>
        <span v-if="mname.wid">
          已选择<span class="warning-color"
                style="margin: 0 4px">{{ mname.wid }}</span>
        </span>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="红娘">
        <a-input placeholder="红娘"
                 v-decorator="['mmid']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="标题">
        <a-input placeholder="标题"
                 v-decorator="['title']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="约会时间">
        <a-date-picker placeholder="约会时间"
                       v-decorator="['datingTime']" />
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
        <a-input placeholder="备注"
                 v-decorator="['remark']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="约会经过">
        <a-textarea :rows="3"
                    placeholder="约会经过"
                    v-decorator="['result']" />
      </a-form-item>
    </a-form>
    <hun-custom-list-modal ref="hunCustomListModal"
                           @ok="handleHunCustomListOk"></hun-custom-list-modal>
  </a-modal>
</template>
<script>
import { saveHunDating } from '@/api/pts/dating/dating'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'
import HunCustomListModal from '@/views/pts/member/modules/HunCustomListModal.vue'
export default {
  name: 'HunDatingModal',
  props: {
  },
  components: {
    HunCustomListModal
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
      form: this.$form.createForm(this),
      statusArray: [],
      mname: {},
      openKey: ''
    }
  },
  beforeCreate() {
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('sys_normal_disable').then((data) => {
        this.statusArray = data
      })
    },
    add() {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      this.mname['wid'] = this.mdl.wname || ''
      this.mname['mid'] = this.mdl.mname || ''
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'delFlag', 'status', 'createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parse1', 'parse2', 'parse3', 'parse4', 'parse5', 'mid', 'wid', 'mmid', 'title', 'datingTime', 'result'))
      })
    },
    handleHunCustomListOk(selectedRowKey, selectedRow) {
      this.form.setFieldsValue({ [this.openKey]: selectedRowKey })
      this.mname[this.openKey] = selectedRow.name
    },
    handleSelect(key) {
      this.openKey = key
      this.$refs.hunCustomListModal.handleOpen()
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveHunDating(values).then(res => {
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
