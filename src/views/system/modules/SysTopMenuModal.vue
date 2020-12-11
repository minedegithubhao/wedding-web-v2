<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="1000"
           v-model="visible"
           :bodyStyle="{ height: '600px',padding: 0 }"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit">
    <venus-scroll :only-show-bar-on-scroll="false">
      <div style="padding: 24px">
        <a-form :form="form">
          <a-row :gutter="64">
            <a-col :span="12"
                   style="border-right: 1px solid #eaeaea">
              <div class="modal-divider-text">基本配置</div>
              <a-form-item style="display:none">
                <a-input v-decorator="['id']" />
              </a-form-item>
              <a-form-item style="display:none">
                <a-input v-decorator="['icon']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="主菜单名称">
                <a-input placeholder="主菜单名称"
                         v-decorator="['name',{rules: [{ required: true, message: '请输入主菜单名称' }]}]" />
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="是否显示">
                <a-select v-decorator="['visible', {initialValue:'0',rules: [{ required: true, message: '是否显示' }]}]">
                  <a-select-option v-for="(b, index) in visibleArry"
                                   :key="index"
                                   :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="菜单图标">
                <!-- <a-input placeholder="菜单图标" v-decorator="['icon']" /> -->
                <s-upload list-type="picture"
                          accept-type="jpeg,png,svg+xml,ico"
                          max-size="20"
                          max-length="1"
                          ref="upload"
                          @success="uploadSuccess"
                          is-open="true"
                          v-decorator="['assignedId',{initialValue: '',rules: [{ required: true, message: '请上传菜单图标' }]}]" />
              </a-form-item>
              <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="权限标识">
        <a-input placeholder="权限标识" v-decorator="['perms']" />
              </a-form-item>-->
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="主菜单排序">
                <a-input-number v-decorator="['orderNum',{initialValue:1,rules: [{ required: true, message: '请输入顺序数字' }]}]"
                                placeholder="显示顺序" />
              </a-form-item>
              <div class="modal-divider-text">首页配置</div>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="首页唯一标识">
                <a-input placeholder="唯一标识"
                         v-decorator="['code']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="首页地址">
                <a-input placeholder="首页地址"
                         v-decorator="['component']" />
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="首页名称">
                <a-input placeholder="首页名称"
                         v-decorator="['source']" />
              </a-form-item>
              <div class="modal-divider-text">链接配置</div>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="打开方式">
                <a-select v-decorator="['target', {initialValue:'',rules: [{ required: false, message: '请选择打开方式' },{validator: validatePathTarget}]}]">
                  <a-select-option :value="''">当前窗口</a-select-option>
                  <a-select-option :value="'_blank'">新窗口</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol">
                <span slot="label">链接地址</span>
                <a-input placeholder="路径"
                         v-decorator="['redirect',{
                           rules: [
                             { required: false,type:'string', message: '请输入正确的路径' }
                           ]
                         }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <div class="modal-divider-text">布局配置</div>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="导航模式">
                <a-select @change="layoutModeChange"
                          v-decorator="['layoutMode', {initialValue:'sidemenu',rules: [{ required: true, message: '请选择导航模式' }]}]">
                  <a-select-option v-for="(b, index) in layoutModeArry"
                                   :key="index"
                                   :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="多页签模式">
                <a-switch :disabled="layoutMode === 'topmenu'"
                          v-decorator="['multiTab',{initialValue: true,valuePropName: 'checked',rules: [{ required: true, message: '请选择多页签模式' }]}]" />
              </a-form-item>
              <div class="modal-divider-text">权限配置</div>
              <a-form-item :labelCol="labelCol"
                           :wrapperCol="wrapperCol"
                           label="拥有权限">
                <a-tree checkable
                        v-model="checkedKeys"
                        @check="onCheck"
                        :treeData="permissions"></a-tree>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="modal-divider-text">配置说明</div>
        <div style="margin-left: 24px">
          <detail-list size="small"
                       :col="2"
                       class="detail-list-info">
            <detail-list-item term="唯一标识">主菜单的唯一标识，如：system;</detail-list-item>
            <detail-list-item term="首页地址">每个主菜单的欢迎页地址;</detail-list-item>
          </detail-list>
          <detail-list size="small"
                       :col="2"
                       class="detail-list-info">
            <detail-list-item term="首页名称">为多页签模式情况下，页签显示的名称；</detail-list-item>
            <detail-list-item term="打开方式">点击菜单后在当前窗口或者在新窗口跳转路由；</detail-list-item>
          </detail-list>
          <detail-list size="small"
                       :col="1"
                       class="detail-list-info">
            <detail-list-item term="链接地址">跳转路由的URL地址，为外部链接地址时，必须设置“打开方式”为新窗口；</detail-list-item>
          </detail-list>
          <detail-list size="small"
                       :col="2"
                       class="detail-list-info">
            <detail-list-item term="导航模式">主菜单下的菜单为侧边栏导航或顶部栏导航布局；</detail-list-item>
            <detail-list-item term="拥有权限">分配主菜单下的菜单；</detail-list-item>
          </detail-list>
          <detail-list size="small"
                       :col="1"
                       class="detail-list-info">
            <detail-list-item term="多页签模式">主菜单下的菜单设置是否为多页签路由布局模式，导航模式为“顶部栏导航”时，必须为<span style="color: #faad14">单页签模式</span>；</detail-list-item>
          </detail-list>
        </div>
      </div>
    </venus-scroll>
  </a-modal>
</template>
<script>
import { getPermissions, getMenuPermIds, saveSysTopMenu } from '@/api/system'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'
import SUpload from '@/components/pts/Upload'
import VenusScroll from '@/components/pts/Scroll'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'SysTopMenuModal',
  props: {},
  components: {
    SUpload,
    DetailList,
    DetailListItem,
    VenusScroll
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      mdl: {},
      layoutModeArry: [],
      visibleArry: [],
      form: this.$form.createForm(this),
      permissions: [],
      treeCheck: false,
      pidSet: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      layoutMode: ''
    }
  },
  beforeCreate() { },
  async created() {
    this.layoutModeArry = await getDictArray('layout_mode')
    this.visibleArry = await getDictArray('sys_show_hide')
    this.loadPermissions()
  },
  methods: {
    layoutModeChange(value) {
      this.layoutMode = value
      if (value === 'topmenu') {
        this.form.setFieldsValue({ multiTab: false })
      }
    },
    add() {
      this.form.resetFields()
      this.checkedKeys = []
      this.pidSet = []
      this.edit({ id: 0 })
    },
    edit(record) {
      this.layoutMode = ''
      if (record.id !== 0) {
        getMenuPermIds(record.id).then(res => {
          const pidSet = new Set(res.map(m => m.parentId).filter(id => id > 0))
          this.pidSet = pidSet
          // 因为antd 树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
          this.checkedKeys = res.map(m => m.menuId).filter(id => !pidSet.has(id))
        })
      }
      this.mdl = Object.assign(record)
      this.mdl.multiTab = this.mdl.multiTab === 'true' || this.mdl.multiTab === true || this.mdl.multiTab === undefined
      this.mdl.assignedId = this.mdl.busId || null
      this.treeCheck = false
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.mdl,
            'id',
            'code',
            'name',
            'component',
            'source',
            'target',
            // 'perms',
            'icon',
            'redirect',
            'visible',
            'layoutMode',
            'multiTab',
            'orderNum',
            'assignedId'
          )
        )
      })
    },
    validatePathTarget(rule, value, callback) {
      const redirect = this.form.getFieldValue('redirect')
      if (redirect && redirect.startsWith('http') && value !== '_blank') {
        callback(new Error('链接地址为外链时，打开方式必须为新窗口（antd限制）'))
      } else {
        callback()
      }
    },
    onCheck(checkedKeys, info) {
      if (!this.treeCheck) this.treeCheck = true
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    loadPermissions() {
      getPermissions().then(res => {
        this.buildtree(res.rows, this.permissions, 0)
      })
    },
    buildtree(list, permissions, parentId) {
      list.forEach(item => {
        if (item.parentId === parentId) {
          var child = {
            key: item.menuId,
            title: item.menuName,
            children: []
          }
          this.buildtree(list, child.children, item.menuId)
          permissions.push(child)
        }
      })
    },
    uploadSuccess(res) {
      // console.log(res.filePath)
      this.form.setFieldsValue({ icon: res.filePath })
    },
    handleSubmit(e) {
      e.preventDefault()
      const _this = this
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      const checkedAll = this.treeCheck
        ? _this.checkedKeys.concat(_this.halfCheckedKeys)
        : _this.checkedKeys.concat(Array.from(_this.pidSet))
      // if (!checkedAll.length > 0) {
      //   _this.$message.warning('请至少选择一个权限')
      //   return
      // }
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.$refs.upload.sFileList.length > 0) {
            values.menuIds = checkedAll
            values.id = values.id === 0 ? '' : values.id
            this.confirmLoading = true
            saveSysTopMenu(values)
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
          } else {
            this.$message.error('请上传菜单图标')
          }
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
