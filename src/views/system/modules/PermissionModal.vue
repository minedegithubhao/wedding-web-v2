<template>
  <a-modal title="操作" style="top: 20px;" :width="1000" v-model="visible" @ok="handleSubmit">
    <a-form :form="form">
      <a-row :gutter="64">
        <a-col :span="12" style="border-right: 1px solid #eaeaea">
          <div class="modal-divider-text">基本配置</div>
          <a-form-item style="display:none">
            <a-input v-decorator="['menuId']" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级权限">
            <a-tree-select
              v-decorator="['parentId', {rules: [{ required: true, message: '请选择上级权限' }]}]"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="permissions"
              placeholder="上级权限"
              treeDefaultExpandAll
            ></a-tree-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限类型">
            <a-select
              v-decorator="['menuType', {initialValue:'M',rules: [{ required: true, message: '请选择类型' }]}]"
              @select="menuTypeChange"
            >
              <a-select-option :value="'M'">目录</a-select-option>
              <a-select-option :value="'C'">菜单</a-select-option>
              <a-select-option :value="'F'">按钮</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限名称">
            <a-input
              v-decorator="['menuName',{rules: [{ required: true, message: '请输入权限名称' }]}]"
              placeholder="起一个名字"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="唯一标识">
            <a-input v-decorator="['menuKey']" placeholder="唯一标识：如'user'" />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="menuType!='M'"
            label="权限标识"
          >
            <a-input
              v-decorator="['perms',{rules: [{ required: false, message: '请输入权限标识' }]}]"
              placeholder="权限标识"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuType!=='F'">
            <span slot="label">组件</span>
            <a-input
              v-decorator="['component',{rules: [{ required: false, message: '请输入组件' }]}]"
              placeholder="组件"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="menuType!=='F'"
            label="图标"
          >
            <a-input
              v-decorator="['icon',{rules: [{ required: false, message: '请选择图标' }]}]"
              ref="iconInput"
              @click="iconselect()"
              enterButton="选择图标"
              placeholder="选择图标"
            >
              <a-icon slot="prefix" :type="icon" />
              <a-icon slot="suffix" type="close-circle" @click="emitEmpty" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <div class="modal-divider-text">其它配置</div>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="menuType==='C'"
            label="打开方式"
          >
            <a-select
              v-decorator="['target', {initialValue:'',rules: [{ required: false, message: '请选择打开方式' },{validator: validatePathTarget}]}]"
            >
              <a-select-option :value="''">当前窗口</a-select-option>
              <a-select-option :value="'_blank'">新窗口</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuType==='C'">
            <span slot="label">链接地址</span>
            <a-input
              v-decorator="['path',{ rules: [ { required: false,type:'string', message: '请输入正确的路径' } ] }]"
              placeholder="路径"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="menuType!=='F'"
            label="重定向地址"
          >
            <a-input
              v-decorator="['redirect',{rules: [{ required: false, message: '请输入重定向地址' }]}]"
              placeholder="重定向地址"
            />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="menuType!=='F'"
            label="隐藏子菜单"
          >
            <a-switch v-decorator="['hiddenChildren',{initialValue:false}]" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuType!=='F'">
            <span slot="label">隐藏头部信息</span>
            <a-switch v-decorator="['hiddenHeader',{initialValue:false}]" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示顺序">
            <a-input-number
              v-decorator="['orderNum',{initialValue:'1',rules: [{ required: true, message: '请输入顺序数字' }]}]"
              placeholder="显示顺序"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否显示">
            <a-select
              v-decorator="['visible', {initialValue:'0',rules: [{ required: true, message: '请选择是否显示' }]}]"
            >
              <a-select-option :value="'0'">显示</a-select-option>
              <a-select-option :value="'1'">隐藏</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="modal-divider-text">配置说明</div>
    <div style="margin-left: 24px">
      <detail-list size="small" :col="2" class="detail-list-info">
        <detail-list-item term="上级权限">当前菜单的父级菜单；</detail-list-item>
        <detail-list-item term="权限类型">当前菜单的类型，分为目录、菜单、按钮；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item
          term="唯一标识"
        >当前菜单Rest风格的URL标识，如设置父菜单为system，当前菜单为permission，则URL为/system/permission;</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="权限标识">控制数据权限、接口权限、页面组件权限的唯一标识，如system:user:list,表示用户管理的列表权限;</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="组件">前端项目的routerUtil文件中定义的组件或views文件夹下的页面路径；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="打开方式">点击菜单后在当前窗口或者在新窗口跳转路由；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="链接地址">跳转路由的URL地址，为外部链接地址时，必须设置“打开方式”为新窗口；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="重定向地址">当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="1" class="detail-list-info">
        <detail-list-item term="隐藏子菜单">选择为true后，将不会在页面上显示当前菜单的所有子菜单；</detail-list-item>
      </detail-list>
      <detail-list size="small" :col="2" class="detail-list-info">
        <detail-list-item term="隐藏头部信息">隐藏页面中的头部组件（面包屑）；</detail-list-item>
        <detail-list-item term="是否显示">显示或隐藏当前菜单及子菜单；</detail-list-item>
      </detail-list>
    </div>
    <iconSelector-modal ref="modal" @ok="setIcon" :icon="icon" />
  </a-modal>
</template>
<script>
import { getPermissions, savePerm } from '@/api/system'
import pick from 'lodash.pick'
import IconSelectorModal from './IconSelectorModal.vue'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'UserModal',
  components: {
    IconSelectorModal,
    DetailList,
    DetailListItem
  },
  data () {
    return {
      description:
        '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      permissions: [{ key: 0, value: '0', title: '无' }],
      mdl: {},
      icon: 'smile',
      menuType: '',
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () { },
  created () {
    this.loadPermissions()
  },
  methods: {
    menuTypeChange (type) {
      this.menuType = type
    },
    emitEmpty () {
      this.$refs.iconInput.focus()
      this.form.setFieldsValue({ icon: '' })
    },
    iconselect () {
      this.$refs.modal.show()
    },
    setIcon (icon) {
      this.icon = icon
      this.form.setFieldsValue({ icon: icon })
    },
    add (parentId) {
      this.form.resetFields()
      this.edit({ parentId: parentId || '0' })
    },
    edit (record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
      this.menuType = this.mdl.menuType || 'M'
      this.$nextTick(() => {
        this.mdl.icon ? (this.icon = this.mdl.icon) : (this.icon = 'smile')
        this.mdl.parentId += ''
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'icon',
            'menuId',
            'parentId',
            'menuType',
            'visible',
            'perms',
            'target',
            'orderNum',
            'menuName',
            'menuKey',
            'component',
            'path',
            'redirect',
            'hiddenChildren',
            'hiddenHeader'
          )
        )
        // this.form.setFieldsValue({ ...record })
      })
    },
    validatePathTarget (rule, value, callback) {
      const path = this.form.getFieldValue('path')
      if (path && path.startsWith('http') && value !== '_blank') {
        callback(new Error('链接地址为外链时，打开方式必须为新窗口（antd限制）'))
      } else {
        callback()
      }
    },
    loadPermissions () {
      getPermissions().then((res) => {
        this.buildtree(res.rows, this.permissions, 0)
      })
    },
    buildtree (list, arr, parentId) {
      list.forEach((item) => {
        if (item.parentId === parentId) {
          var child = {
            key: item.menuId,
            value: item.menuId + '',
            title: item.menuName,
            children: []
          }
          this.buildtree(list, child.children, item.menuId)
          arr.push(child)
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          savePerm(values)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.$emit('ok')
                this.visible = false
              } else {
                this.$message.success(res.msg)
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
<style lang="less">
.detail-list-info {
  .term {
    color: #d2000099 !important;
    padding-bottom: 6px !important;
  }
  .content {
    color: #a5a4a4 !important;
    padding-bottom: 6px !important;
  }
}
</style>
