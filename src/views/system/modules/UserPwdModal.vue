<template>
  <a-modal
    title="重置密码"
    style="top: 20px;"
    :width="500"
    centered
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['userId']"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户名"
      >
        <a-input placeholder="用户名" disabled v-decorator="['loginName', {rules: [{ required: true, message: '请输入用户名' }]}]" />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="新密码"
      >
        <a-input type="password" placeholder="新密码" v-decorator="['password', {rules: formValidatorRules.password}]" />
        <div v-if="passwordStatus" class="password-strength">
          <span class="strength-label">密码强度:</span>
          <span class="strength-box" :class="strengthOne">弱</span>
          <span class="strength-box" :class="strengthTwo">中</span>
          <span class="strength-box" :class="strengthThree">强</span>
        </div>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="确认密码"
      >
        <a-input type="password" placeholder="确认密码" v-decorator="['password2', {rules: formValidatorRules.password2}]" />
      </a-form-item>

    </a-form>
  </a-modal>
</template>
<script>
import { resetPwd } from '@/api/system'
import pick from 'lodash.pick'
export default {
  name: 'UserPwdModal',
  components: {
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      formValidatorRules: {
        password: [
          { required: true, min: 6, max: 16, message: '请输入6到16位密码,区分大小写' },
          { validator: this.validatorPwdStrength }
        ],
        password2: [
          { required: true, min: 6, max: 16, message: '请输入6到16位密码,区分大小写' },
          { validator: this.validatorPassword2 }
        ]
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
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
  beforeCreate () {
  },
  created () {
  },
  methods: {
    edit (record) {
      this.form.resetFields()
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userId', 'loginName'))
        // this.form.setFieldsValue({ ...record })
      })
    },
    validatorPwdStrength(rule, value, callback) {
      // 密码长度大于等于8位数 包含大写字母[A-Z] + 小写字母[a-z] + 数字[0-9] + 非单词字符的特殊字符[标点符号，空格等]
      const strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g') // 强
      // 密码长度大于等于7位数 大写字母[A-Z] + 小写字母[a-z] 或者 大写字母[A-Z] + 数字[0-9] 或者 小写字母[a-z] + 数字[0-9] + 任意字符 结尾
      const mediumRegex = new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g') // 中
      // 大于等于6位 任何字符或者数字 (如果达不到这个条件就是弱)
      const enoughRegex = new RegExp('(?=.{6,}).*', 'g') // 弱
      if (strongRegex.test(value)) {
        this.strengthOne = 'password-strong'
        this.strengthTwo = 'password-strong'
        this.strengthThree = 'password-strong'
      } else if (mediumRegex.test(value)) {
        this.strengthOne = 'password-middle'
        this.strengthTwo = 'password-middle'
        this.strengthThree = 'password-normal'
      } else {
        this.strengthOne = 'password-weak'
        this.strengthTwo = 'password-normal'
        this.strengthThree = 'password-normal'
      }
      if (value.length >= 6 && value.length <= 16) {
        this.passwordStatus = true
      } else {
        this.passwordStatus = false
      }
      callback()
    },
    validatorPassword2(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value && password && value.length >= 6 && value.length <= 16 && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          resetPwd(values).then(res => {
            if (res.code === 0) {
              this.$message.success(`${values.loginName}` + '重置密码成功')
              // this.$emit('ok')
              this.visible = false
            } else {
              this.$message.success(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
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
<style lang="less" scoped>
.password-strength {
  margin-top: 8px;
  .strength-label {
    margin-right: 8px;
  }
  .strength-box {
    display: inline-block;
    text-align: center;
    font-size: 12px;
    margin: 0 3px;
    width: 70px;
    height: 16px;
    line-height: 16px;
    background-color: #dedcdc;
    color: #fff;
  }
  .password-weak {
    background: #ce4d1b;
  }
  .password-middle {
    background: #efc21f;
  }
  .password-strong {
    background: #1fbfef;
  }
  .password-normal {
    background: #dedcdc;
  }
}
</style>
