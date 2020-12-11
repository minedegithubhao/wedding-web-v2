<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="唯一标识">
              <a-input placeholder="唯一标识"
                       v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="菜单名称">
              <a-input placeholder="主菜单名称"
                       v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-if="addEnable"
                type="primary"
                icon="plus"
                @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-popconfirm :title="`确认删除${selectedRowKeys.length}条数据?`"
                      @confirm="() => delByIds(selectedRowKeys)">
          <a-button type="danger"
                    icon="delete">删除</a-button>
        </a-popconfirm>
      </a-dropdown>
    </div>
    <s-table size="default"
             ref="table"
             rowKey="id"
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
             :columns="columns"
             :data="loadData">
      <span slot="visible"
            slot-scope="text">{{ text | statusFilter(statusMap) }}</span>
      <span slot="action"
            slot-scope="text, record">
        <a-icon type="edit"
                v-if="editEnabel"
                class="icon-action edit"
                @click="handleEdit(record)" />
        <a-popconfirm title="确认删除本条记录?"
                      v-if="removeEnable"
                      @confirm="() => delByIds([record.id])">
          <a-icon type="delete"
                  class="icon-action delete" />
        </a-popconfirm>
      </span>
    </s-table>
    <sysTopMenu-modal ref="modal"
                      @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSysTopMenuList, delSysTopMenu } from '@/api/system'
import SysTopMenuModal from './modules/SysTopMenuModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'TableList',
  components: {
    STable,
    SysTopMenuModal
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'name'
        },
        {
          title: '唯一标识',
          dataIndex: 'code'
        },
        {
          title: '首页地址',
          dataIndex: 'component'
        },
        {
          title: '主菜单排序',
          dataIndex: 'orderNum'
        },
        // {
        //   title: '权限标识',
        //   dataIndex: 'perms'
        // },
        {
          title: '显示状态',
          dataIndex: 'visible',
          scopedSlots: { customRender: 'visible' }
        },
        {
          title: '操作',
          width: '100px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSysTopMenuList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusArry: [],
      statusMap: {},
      addEnable: checkPermission('system:topMenu:add'),
      editEnabel: checkPermission('system:topMenu:edit'),
      removeEnable: checkPermission('system:topMenu:remove')
    }
  },
  filters: {
    statusFilter(status, statusMap) {
      return statusMap[status].text
    }
  },
  async created() {
    await getDictArray('sys_show_hide').then(data => {
      this.statusArry = data
      const statusMap = {}
      this.statusArry.map(d => {
        statusMap[d.dictValue] = { text: d.dictLabel }
      })
      this.statusMap = statusMap
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh(true)
    },
    delByIds(ids) {
      delSysTopMenu({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.$refs.table.clearSelected()
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
