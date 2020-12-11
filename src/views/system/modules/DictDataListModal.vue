<template>
  <a-modal title="字典数据"
           style="top: 20px;"
           :width="1100"
           v-model="visible"
           :footer="null">
    <div class="table-operator"
         style="margin-bottom: 18px">
      <a-button v-if="addEnable"
                type="primary"
                icon="plus"
                @click="$refs.modal.add(dictType)">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-popconfirm title="确认删除?"
                      @confirm="() => delByIds(selectedRowKeys)">
          <a-button type="danger"
                    icon="delete">删除</a-button>
        </a-popconfirm>
      </a-dropdown>
    </div>
    <s-table size="default"
             ref="table"
             rowKey="dictCode"
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
             :columns="columns"
             :data="loadData">
      <span slot="status"
            slot-scope="text">
        <a-badge :status="text | statusTypeFilter"
                 :text="text | statusFilter" />
      </span>
      <span slot="action"
            slot-scope="text, record">
        <a-icon type="edit"
                v-if="editEnabel"
                class="icon-action edit"
                @click="handleEdit(record)" />
        <a-popconfirm title="确认删除?"
                      v-if="removeEnable"
                      @confirm="() => delByIds([record.dictCode])">
          <a-icon type="delete"
                  class="icon-action delete" />
        </a-popconfirm>
      </span>
    </s-table>
    <dict-data-modal ref="modal"
                     @ok="handleOk" />
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getDictDataList, delDictData } from '@/api/system'
import DictDataModal from './DictDataModal.vue'
import { checkPermission } from '@/utils/permissions'

const statusMap = {
  0: {
    status: 'success',
    text: '正常'
  },
  1: {
    status: 'default',
    text: '停用'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    DictDataModal
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
      form: this.$form.createForm(this),
      mdl: {},
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '字典编码',
          dataIndex: 'dictCode'
        },
        {
          title: '字典标签',
          dataIndex: 'dictLabel'
        },
        {
          title: '字典键值',
          dataIndex: 'dictValue'
        },
        {
          title: '字典排序',
          dataIndex: 'dictSort'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
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
        return getDictDataList(Object.assign(parameter, this.queryParam))
      },
      dictType: '',
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('system:dict:add'),
      editEnabel: checkPermission('system:dict:edit'),
      removeEnable: checkPermission('system:dict:remove')
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
  },
  methods: {
    show(dictType) {
      this.visible = true
      this.queryParam.dictType = dictType
      this.dictType = dictType
      this.$refs.table && this.$refs.table.refresh(true)
      this.$refs.table && this.$refs.table.clearSelected()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh(true)
    },
    delByIds(ids) {
      delDictData({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success(`删除成功`)
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
