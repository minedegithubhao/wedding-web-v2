<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="900"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleOk"
           @cancel="handleCancel">
    <a-form :form="form">
      <a-row :gutter="64">
        <a-col :span="12">
          <div class="modal-divider-text">基本配置</div>
          <a-form-item style="display:none">
            <a-input v-decorator="['roleId']" />
          </a-form-item>

          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="角色名称">
            <a-input v-decorator="[
                'roleName',
                {
                  rules: [{ required: true, message: '请输入角色名称' }]
                }
              ]"
                     placeholder="起一个名字" />
          </a-form-item>
          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="权限字符">
            <a-input v-decorator="['roleKey',{rules: [{ required: true, message: '请输入权限字符' }]}]"
                     placeholder="权限字符" />
          </a-form-item>
          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="显示顺序">
            <a-input-number v-decorator="['roleSort',{initialValue:'1',rules: [{ required: true, message: '请输入顺序数字' }]}]"
                            placeholder="显示顺序" />
          </a-form-item>

          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="状态">
            <a-select v-decorator="['status', {initialValue:'0',rules: [{ required: true, message: '请选择状态' }]}]">
              <a-select-option :value="'0'">正常</a-select-option>
              <a-select-option :value="'1'">禁用</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12"
               style="border-left: 1px solid #eaeaea">
          <div class="modal-divider-text">权限配置</div>
          <a-form-item :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="拥有权限">
            <!-- v-decorator="['parentId',{initialValue:'0'}]" -->
            <!-- <a-tree
          checkable
          autoExpandParent
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          v-model="checkedKeys"
          @select="onSelect"
          @check="onCheck"
          :selectedKeys="selectedKeys"
          :checkedKeys="checkedKeys"
          :treeData="permissions"
            >-->
            <a-tree checkable
                    v-model="checkedKeys"
                    @check="onCheck"
                    :treeData="permissions"></a-tree>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { getPermissions, getRolePermIds, saveRole } from '@/api/system'
import pick from 'lodash.pick'

export default {
  name: 'RoleModal',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},

      form: this.$form.createForm(this),
      permissions: [],
      treeCheck: false,
      pidSet: [],
      checkedKeys: [],
      halfCheckedKeys: []
    }
  },
  created() {
    this.loadPermissions()
  },
  methods: {
    add() {
      this.form.resetFields()
      this.checkedKeys = []
      this.pidSet = []
      this.edit({})
    },
    edit(record) {
      if (record.roleId) {
        getRolePermIds(record.roleId).then(res => {
          const pidSet = new Set(res.map(m => m.parentId).filter(id => id > 0))
          this.pidSet = pidSet
          // 因为antd 树插件勾选父节点会导致所有子节点选中,所以过滤所有父节点
          this.checkedKeys = res.map(m => m.menuId).filter(id => !pidSet.has(id))
        })
      }
      this.mdl = Object.assign({}, record)
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      this.treeCheck = false
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'roleId', 'roleName', 'status', 'roleSort', 'roleKey'))
        // this.form.setFieldsValue(...record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      if (!this.treeCheck) this.treeCheck = true
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = info.halfCheckedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
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
    handleOk(e) {
      const _this = this
      // 如果没有check过，半选节点是拿不到的，只能通过预先设置的pidSet获取
      const checkedAll = this.treeCheck
        ? _this.checkedKeys.concat(_this.halfCheckedKeys)
        : _this.checkedKeys.concat(Array.from(_this.pidSet))
      if (!checkedAll.length > 0) {
        _this.$message.warning('请至少选择一个权限')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          values.menuIds = checkedAll
          _this.confirmLoading = true
          saveRole(Object.assign(values))
            .then(res => {
              if (res.code === 0) {
                _this.$message.success('保存成功')
                _this.$emit('ok')
                _this.visible = false
              } else {
                _this.$message.success(res.msg)
              }
            })
            .catch(() => {
              _this.$message.error('系统错误，请稍后再试')
            })
            .finally(() => {
              _this.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
