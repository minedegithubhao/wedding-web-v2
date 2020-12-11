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
                   label="顾客">
        <a-input placeholder="顾客"
                 style="display: none"
                 v-decorator="['cid', {rules: [{ required: false, message: '请选择顾客' }]}]" />
        <a-button type="primary"
                  icon="plus"
                  @click="$refs.hunCustomListModal.handleOpen(mdl.hunCustom)">选择</a-button>
        <span v-if="customName">
          已选择<span class="warning-color"
                style="margin: 0 4px">{{ customName }}</span>
        </span>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="会员卡类型">
        <a-select placeholder="会员卡类型"
                  v-decorator="['cardType']">
          <a-select-option v-for="(b, index) in cardTypeArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="会员卡编号">
        <a-input placeholder="会员卡编号"
                 v-decorator="['cardId']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="会员类型">
        <a-select placeholder="会员类型"
                  v-decorator="['memberType']">
          <a-select-option v-for="(b, index) in memberTypeArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="会员等级">
        <a-input placeholder="会员等级"
                 v-decorator="['level']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="入会时间">
        <a-date-picker placeholder="入会时间"
                       v-decorator="['joinTime']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="会员卡名称">
        <a-select placeholder="会员卡名称"
                  v-decorator="['cardName']">
          <a-select-option v-for="(b, index) in cardNameArray"
                           :key="index"
                           :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol"
                   :wrapperCol="wrapperCol"
                   label="已使用次数">
        <a-input placeholder="已使用次数"
                 v-decorator="['useTimes']" />
      </a-form-item>
    </a-form>
    <hun-custom-list-modal ref="hunCustomListModal"
                           @ok="handleHunCustomListOk"></hun-custom-list-modal>
  </a-modal>
</template>
<script>
import { saveHunMember } from '@/api/pts/member/member'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'
import HunCustomListModal from './HunCustomListModal.vue'
export default {
  name: 'HunMemberModal',
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
      cardTypeArray: [],
      memberTypeArray: [],
      cardNameArray: [],
      customName: '',
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
      getDictArray('hun_member_card_type').then(data => {
        this.cardTypeArray = data
      })
      getDictArray('hun_member_type').then(data => {
        this.memberTypeArray = data
      })
      getDictArray('hun_member_card_name').then(data => {
        this.cardNameArray = data
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
        this.form.setFieldsValue(pick(this.mdl, 'id', 'delFlag', 'status', 'createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parse1', 'parse2', 'parse3', 'parse4', 'parse5', 'cid', 'cardType', 'cardId', 'memberType', 'level', 'joinTime', 'cardName', 'useTimes'))
      })
    },
    handleHunCustomListOk(selectedRowKey, selectedRow) {
      this.form.setFieldsValue({ cid: selectedRowKey })
      this.customName = selectedRow.name
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveHunMember(values).then(res => {
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
