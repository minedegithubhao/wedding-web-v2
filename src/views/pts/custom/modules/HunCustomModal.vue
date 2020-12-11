<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="900"
           :mask-closable="false"
           :body-style="{ padding: 0, height: '80vh' }"
           v-model="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit">
    <v-scroll>
      <a-form :form="form"
              style="padding: 24px;">
        <a-form-item style="display:none">
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-row :gutter="64">
          <a-col :span="12"
                 style="border-right: 1px solid #eaeaea">
            <div class="modal-divider-text">基本信息</div>
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
                         label="民族">
              <a-input placeholder="民族"
                       suffix="族"
                       v-decorator="['nation', {initialValue: '汉',rules: [{ required: true, message: '请输入民族' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="籍贯">
              <a-input placeholder="籍贯"
                       v-decorator="['nativePlace', {rules: [{ required: true, message: '请输入籍贯' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="婚姻状况">
              <a-select placeholder="婚姻状况"
                        v-decorator="['maritalStatus', {rules: [{ required: true, message: '请选择婚姻状况' }]}]">
                <a-select-option v-for="(b, index) in maritalStatusArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="血型">
              <a-select placeholder="血型"
                        v-decorator="['blood', {rules: [{ required: false, message: '请选择血型' }]}]">
                <a-select-option v-for="(b, index) in bloodArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="出生日期">
              <a-date-picker placeholder="出生日期"
                             v-decorator="['birthday', {rules: [{ required: true, message: '请选择出生日期' }]}]" />
            </a-form-item>
            <div class="modal-divider-text">资产信息</div>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="收入状况">
              <a-select placeholder="收入状况"
                        v-decorator="['salary', {rules: [{ required: false, message: '请选择收入状况' }]}]">
                <a-select-option v-for="(b, index) in salaryArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="是否有房">
              <a-select v-decorator="['house', {initialValue: '2', rules: [{ required: true, message: '请选择是否有房' }]}]">
                <a-select-option v-for="(b, index) in houseArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="是否有车">
              <a-select v-decorator="['car', {initialValue: '2', rules: [{ required: true, message: '请选择是否有车' }]}]">
                <a-select-option v-for="(b, index) in carArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="房产说明">
              <a-textarea placeholder="房产说明..."
                          v-decorator="['houseDesc', {rules: [{ required: false, message: '请输入房产说明' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="车子说明">
              <a-textarea placeholder="车子说明..."
                          v-decorator="['carDesc', {rules: [{ required: false, message: '请输入车子说明' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
            <div class="modal-divider-text">家庭信息</div>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="代理人">
              <a-input placeholder="代理人"
                       style="display: none"
                       v-decorator="['agent', {rules: [{ required: false, message: '请选择代理人' }]}]" />
              <a-button type="primary"
                        icon="plus"
                        @click="$refs.hunAgentListModal.handleOpen(mdl.hunAgent)">选择</a-button>
              <span v-if="agentName">
                已选择<span class="warning-color"
                      style="margin: 0 4px">{{ agentName }}</span>
              </span>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="家庭住址">
              <a-textarea placeholder="家庭住址..."
                          v-decorator="['homeAddr', {rules: [{ required: true, message: '请输入家庭住址' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="家庭情况">
              <a-textarea placeholder="家庭情况..."
                          v-decorator="['homeDesc', {rules: [{ required: false, message: '请输入家庭情况' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <div class="modal-divider-text">个人信息</div>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="手机号">
              <a-input placeholder="11 位手机号"
                       v-decorator="['phone', {rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ } ], validateTrigger: ['change', 'blur'] }]">
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
                         label="工作状态">
              <a-select placeholder="工作状态"
                        v-decorator="['status', {rules: [{ required: true, message: '请选择工作状态' }]}]">
                <a-select-option v-for="(b, index) in statusArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="职业">
              <a-input placeholder="职业"
                       v-decorator="['job', {rules: [{ required: true, message: '请输入职业' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="学历">
              <a-select placeholder="学历"
                        v-decorator="['education', {initialValue: '5', rules: [{ required: true, message: '请选择学历' }]}]">
                <a-select-option v-for="(b, index) in educationArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="毕业院校">
              <a-input placeholder="毕业院校"
                       v-decorator="['graduationCollage', {rules: [{ required: false, message: '请输入毕业院校' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="微信号">
              <a-input placeholder="微信号"
                       v-decorator="['wechat', {rules: [{ required: false, message: '请输入微信号' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="QQ号">
              <a-input placeholder="QQ号"
                       v-decorator="['qq', {rules: [{ required: false, message: '请输入QQ号' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="邮箱">
              <a-input placeholder="邮箱"
                       v-decorator="['email', {rules: [{ required: false, message: '请输入邮箱' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="工作地址">
              <a-textarea placeholder="工作地址..."
                          v-decorator="['jobAddr', {rules: [{ required: false, message: '请输入工作地址' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="兴趣好爱">
              <a-textarea placeholder="兴趣好爱..."
                          v-decorator="['hobby', {rules: [{ required: false, message: '请输入兴趣好爱' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
            <div class="modal-divider-text">隐私信息</div>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="个人照片">
              <!-- <a-input placeholder="菜单图标" v-decorator="['icon']" /> -->
              <s-upload list-type="picture"
                        accept-type="jpeg,png,svg+xml,ico"
                        max-size="100"
                        max-length="1"
                        ref="upload"
                        is-open="true"
                        v-decorator="['pic',{initialValue: '',rules: [{ required: false, message: '请上传个人照片' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="身高">
              <a-input placeholder="身高"
                       suffix="CM"
                       v-decorator="['height', {rules: [{ required: true, message: '请输入身高' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="体重">
              <a-input placeholder="体重"
                       suffix="KG"
                       v-decorator="['weight', {rules: [{ required: true, message: '请输入体重' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="身份证号">
              <a-input-number style="width: 100%"
                              placeholder="身份证号"
                              v-decorator="['idCard', {rules: [{ required: false, message: '请输入身份证号' }]}]" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label="身体状况">
              <a-textarea placeholder="身体状况..."
                          v-decorator="['physicalCondition', {initialValue: '健康', rules: [{ required: false, message: '请输入身体状况' }]}]"
                          :auto-size="{ minRows: 3, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="modal-divider-text">备注信息</div>
        <a-form-item label=""
                     :wrapperCol="remarkwrapperCol">
          <a-textarea placeholder="备注..."
                      v-decorator="['remark', {initialValue: '', rules: [{ required: false, message: '请输入备注' }]}]"
                      :auto-size="{ minRows: 3, maxRows: 6 }" />
        </a-form-item>
      </a-form>
      <hun-agent-list-modal ref="hunAgentListModal"
                            @ok="handleHunAgentListOk"></hun-agent-list-modal>
    </v-scroll>
  </a-modal>
</template>
<script>
import { saveHunCustom } from '@/api/pts/custom/custom'
import pick from 'lodash.pick'
import VScroll from '@/components/pts/Scroll/index'
import { getDictArray } from '@/utils/dict'
import SUpload from '@/components/pts/Upload'
import HunAgentListModal from './HunAgentListModal.vue'

export default {
  name: 'HunCustomModal',
  props: {},
  components: {
    VScroll,
    SUpload,
    HunAgentListModal
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
        sm: { span: 17 }
      },
      remarkwrapperCol: {
        xs: { span: 24 },
        sm: { span: 23 }
      },
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this),
      educationArray: [],
      statusArray: [],
      maritalStatusArray: [],
      bloodArray: [],
      salaryArray: [],
      houseArray: [],
      sexArray: [],
      carArray: [],
      agentArray: [],
      agentName: ''
    }
  },
  beforeCreate() { },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('yes_no').then(data => {
        this.houseArray = data
        this.carArray = data
      })
      getDictArray('hun_custom_blood').then(data => {
        this.bloodArray = data
      })
      getDictArray('hun_custom_marital').then(data => {
        this.maritalStatusArray = data
      })
      getDictArray('hun_custom_work_status').then(data => {
        this.statusArray = data
      })
      getDictArray('hun_custom_education').then(data => {
        this.educationArray = data
      })
      getDictArray('sys_sex').then(data => {
        this.sexArray = data
      })
      getDictArray('hun_custom_salary').then(data => {
        this.salaryArray = data
      })
    },
    add() {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit(record) {
      this.mdl = Object.assign(record)
      this.agentName = this.mdl.hunAgent && this.mdl.hunAgent.name ? this.mdl.hunAgent.name : ''
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'id',
            'name',
            'sex',
            'nation',
            'birthday',
            'nativePlace',
            'blood',
            'idCard',
            'height',
            'weight',
            'physicalCondition',
            'hobby',
            'graduationCollage',
            'education',
            'job',
            'jobAddr',
            'pic',
            'homeAddr',
            'homeDesc',
            'phone',
            'wechat',
            'qq',
            'email',
            'maritalStatus',
            'status',
            'salary',
            'house',
            'houseDesc',
            'car',
            'carDesc',
            'agent',
            'remark'
          )
        )
      })
    },
    handleHunAgentListOk(selectedRowKey, selectedRow) {
      this.form.setFieldsValue({ agent: selectedRowKey })
      this.agentName = selectedRow.name
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // if (this.$refs.upload.sFileList.length > 0) {
          this.confirmLoading = true
          saveHunCustom(values)
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
          // } else {
          //   this.$message.error('请上传个人照片')
          // }
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
