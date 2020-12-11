<template>
  <div>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title" @click="passwordClick">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value">:</span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a
            slot="actions"
            class="a-actions"
            @click="item.actions.callback"
          >{{ passwordUpdate?'取消':item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
    <a-row v-if="passwordUpdate" :style="{borderTop: '1px solid #ecebeb', paddingTop:'10px'}">
      <a-col :md="16" :lg="16">
        <a-form :form="form" layout="vertical" @submit="handleSubmit">
          <a-form-item style="display:none">
            <a-input v-decorator="['userId']" />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input
              placeholder="用户名"
              disabled
              v-decorator="['userName', {rules: formValidatorRules.userName}]"
            />
          </a-form-item>
          <a-form-item label="旧密码">
            <a-input
              placeholder="旧密码"
              type="password"
              autocomplete="false"
              v-decorator="['oldPassword', {rules: formValidatorRules.oldPassword}]"
            />
          </a-form-item>
          <a-form-item label="新密码">
            <a-input
              placeholder="新密码"
              type="password"
              autocomplete="false"
              v-decorator="['password', {rules: formValidatorRules.password}]"
            />
            <div v-if="passwordStatus" class="password-strength">
              <span class="strength-label">密码强度:</span>
              <span class="strength-box" :class="strengthOne">弱</span>
              <span class="strength-box" :class="strengthTwo">中</span>
              <span class="strength-box" :class="strengthThree">强</span>
            </div>
          </a-form-item>
          <a-form-item label="确认密码">
            <a-input
              placeholder="确认密码"
              type="password"
              autocomplete="false"
              v-decorator="['password2', {rules: formValidatorRules.password2}]"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              :loading="passwordLoading"
              htmlType="submit"
              class="password-button"
            >确定</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { updatePwd } from '@/api/system'
import pick from 'lodash.pick'

export default {
  data() {
    return {
      passwordUpdate: false,
      passwordLoading: false,
      passwordStatus: false,
      strengthOne: 'password-weak',
      strengthTwo: 'password-normal',
      strengthThree: 'password-normal',
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      formValidatorRules: {
        userName: [{ required: true, message: '请输入用户名' }],
        oldPassword: [{ required: true, min: 6, max: 16, message: '请输入6到16位密码,区分大小写' }],
        password: [
          { required: true, min: 6, max: 16, message: '请输入6到16位密码,区分大小写' },
          { validator: this.validatorPwdStrength }
        ],
        password2: [
          { required: true, min: 6, max: 16, message: '请输入6到16位密码,区分大小写' },
          { validator: this.validatorPassword2 }
        ]
      },
      data: [
        {
          title: '账户密码',
          description: '用户密码设置',
          value: '',
          actions: {
            title: '修改',
            callback: () => {
              this.passwordUpdate = !this.passwordUpdate
              this.$nextTick(() => {
                this.form.setFieldsValue(pick(this.userInfo, 'userId', 'userName'))
              })
            }
          }
        }
        // { title: '密保手机', description: '已绑定手机', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
        // { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('This is a message of error') } } },
        // { title: '备用邮箱', description: '已绑定邮箱', value: 'ant***sign.com', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning') } } }
        // { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', actions: { title: '绑定', callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
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
    passwordClick() {
      this.passwordUpdate = !this.passwordUpdate
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.userInfo, 'userId', 'userName'))
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      validateFields((err, values) => {
        if (!err) {
          const self = this
          this.$confirm({
            title: '确定要修改密码?',
            onOk() {
              self.passwordLoading = true
              updatePwd(values)
                .then(res => {
                  if (res.code === 0) {
                    self.$message.success(`${values.userName} ` + '修改密码成功')
                    // this.$emit('ok')
                    self.visible = false
                    self.passwordUpdate = false
                  } else {
                    self.$message.error(res.msg)
                  }
                })
                .catch(() => {
                  self.$message.error('系统错误，请稍后再试')
                })
                .finally(() => {
                  self.passwordLoading = false
                })
            },
            onCancel() {}
          })
        }
      })
    }
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

.a-actions {
  user-select: none;
}
.password-button {
  margin: 0 auto;
}
</style>
