<template>
  <div class="main">
    <a-form id="formLogin"
            class="user-layout-login"
            ref="formLogin"
            :form="form"
            @submit="handleSubmit">
      <div class="login-pane">
        <div class="login-pane-inner">
          <p class="login-title">用户登录</p>
          <a-form-item>
            <a-input size="large"
                     type="text"
                     class="self-input"
                     placeholder="用户名"
                     v-decorator="['username',{initialValue:'wedding',rules: [{ required: true, message: '请输入用户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}]">
              <!-- <img slot="prefix" src="~@/assets/login/yh.png" class="item-prefix" /> -->
              <a-icon slot="prefix"
                      type="user"
                      class="primary-text-color" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input size="large"
                     type="password"
                     autocomplete="false"
                     class="self-input"
                     placeholder="密码"
                     v-decorator="['password',{ initialValue:'111111',rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]">
              <!-- <img slot="prefix" src="~@/assets/login/mm.png" class="item-prefix" /> -->
              <a-icon slot="prefix"
                      type="lock"
                      class="primary-text-color" />
            </a-input>
          </a-form-item>
          <a-row :gutter="16">
            <a-col class="gutter-row"
                   :span="16">
              <a-form-item>
                <a-input size="large"
                         type="text"
                         class="self-input"
                         placeholder="验证码"
                         v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <!-- <img slot="prefix" src="~@/assets/login/anquan.png" class="item-prefix" /> -->
                  <a-icon slot="prefix"
                          type="safety-certificate"
                          class="primary-text-color" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row"
                   :span="8">
              <img class="getCaptcha"
                   :src="codesrc"
                   @click="getImgCode" />
            </a-col>
          </a-row>
          <a-form-item v-show="false">
            <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
            <router-link :to="{ name: 'recover', params: { user: 'aaa'} }"
                         class="forge-password"
                         style="float: right;">忘记密码</router-link>
          </a-form-item>
          <a-form-item>
            <a-button size="large"
                      type="primary"
                      htmlType="submit"
                      class="login-button"
                      :loading="state.loginBtn"
                      :disabled="state.loginBtn">登录</a-button>
          </a-form-item>

          <div class="user-login-other"
               v-show="false">
            <span>其他登录方式</span>
            <a>
              <a-icon class="item-icon"
                      type="alipay-circle"></a-icon>
            </a>
            <a>
              <a-icon class="item-icon"
                      type="taobao-circle"></a-icon>
            </a>
            <a>
              <a-icon class="item-icon"
                      type="weibo-circle"></a-icon>
            </a>
            <router-link class="register"
                         :to="{ name: 'register' }">注册账户</router-link>
          </div>
        </div>
      </div>
      <a-alert v-if="isLoginError"
               type="error"
               showIcon
               style="margin: 0 24px;"
               :message="errorMsg" />
    </a-form>

    <two-step-captcha v-if="requiredTwoStepCaptcha"
                      :visible="stepCaptchaVisible"
                      @success="stepCaptchaSuccess"
                      @cancel="stepCaptchaCancel"></two-step-captcha>
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
// eslint-disable-next-line no-unused-vars
import md5 from 'md5'
// eslint-disable-next-line no-unused-vars
import { getSmsCaptcha, get2step, imgcode } from '@/api/login'

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      codesrc: null,
      randomStr: null,
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      errorMsg: '',
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created() {
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
    this.getImgCode()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'captcha'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          // loginParams.password = md5(values.password)
          loginParams.randomStr = this.randomStr
          Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile })
            .then(res => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    async getImgCode() {
      await imgcode().then(res => {
        const raw = res.data
        const { randomstr } = res.headers
        this.randomStr = randomstr
        this.codesrc = URL.createObjectURL(raw)
      })
    },
    loginSuccess(res) {
      if (res.code === 0) {
        this.$router.push({ name: 'portalClient' }, () => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        this.isLoginError = false
      } else {
        this.requestFailed(res)
      }
    },
    requestFailed(err) {
      this.isLoginError = true
      this.getImgCode()
      this.errorMsg = ((err.response || {}).data || {}).msg || err.msg || '请求出现错误，请稍后再试'
      this.$notification['error']({
        message: '错误',
        description: this.errorMsg,
        duration: 4
      })
    }
  }
}
</script>
<style lang="less">
.login-pane-inner {
  .self-input {
    .ant-input {
      border-color: #ececec;
    }
  }
}
</style>
<style lang="less" scoped>
.user-layout-login {
  width: 400px;
  margin-right: 8%;
  float: right;
  label {
    font-size: 14px;
  }

  .item-prefix {
    height: 20px;
    position: absolute;
    left: -4px;
  }
  .login-title {
    width: 100%;
    height: 30px;
    margin: 0 auto 30px;
    font-size: 26px;
    color: #007fe1;
    height: 42px;
  }

  .login-pane {
    height: auto;
    // background: url(~@/assets/login/border_03.png) no-repeat center/cover;
    padding: 8px;
    border: 2px solid #358ae1;
    position: relative;
    background: #79b5f3;
  }
  .login-pane-inner {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 2px solid #2a6fd4;
    margin: 0 auto;
    padding: 24px;
    .self-input {
      height: 54px;
    }
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 54px;
    cursor: pointer;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 44px;
    width: 100%;
    background: linear-gradient(90deg, #556ee6, #8296fc);
    transition: all 0.5s;
    border: none;
    border-radius: 4px;
    &.disabled,
    &[disabled] {
      cursor: default;
      &:hover,
      &:focus {
        background: linear-gradient(90deg, #556ee6, #8296fc);
      }
    }
  }
  button.login-button:hover,
  button.login-button:focus {
    background: linear-gradient(90deg, #8296fc, #556ee6);
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #556ee6;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
