<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="存储名称">
              <a-input placeholder="存储名称"
                       v-model="queryParam.storageName" />
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
             rowKey="id"
             :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
             :columns="columns"
             :data="loadData">
      <span slot="action"
            slot-scope="text, record">
        <a-popconfirm title="确认删除?"
                      v-if="removeEnable"
                      @confirm="() => delByIds([record.id])">
          <a-icon type="delete"
                  class="icon-action delete" />
        </a-popconfirm>
      </span>
    </s-table>
    <tSysFile-modal ref="modal"
                    @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getTSysFileList, delTSysFile } from '@/api/pts/sys/TSysFile'
import TSysFileModal from './modules/TSysFileModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictMap } from '@/utils/dict'
import { keyToValue } from '@/utils/dataDictionaryUtil'

export default {
  name: 'TableList',
  components: {
    STable,
    TSysFileModal
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
          title: '存储名称',
          dataIndex: 'storageName',
          ellipsis: true
        },
        {
          title: '文件名称',
          dataIndex: 'fileRealname',
          ellipsis: true
        },
        {
          title: '文件全路径',
          dataIndex: 'fileFullpath',
          ellipsis: true
        },
        {
          title: '存储类型',
          dataIndex: 'storageTypeName',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100
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
        const fileSaveTypeMap = getDictMap('t_sys_file')
        const statusMap = getDictMap('sys_normal_disable')
        const request = getTSysFileList(Object.assign(parameter, this.queryParam))
        return new Promise(resolve => {
          request.then(res => {
            fileSaveTypeMap.then(dic => {
              res.rows = keyToValue(res.rows, [{ name: 'storageType', aliasName: 'storageTypeName' }], dic)
              resolve(res)
            }).catch(e => {
              resolve(res)
            })
            statusMap.then(dic => {
              res.rows = keyToValue(res.rows, [{ name: 'status', aliasName: 'status' }], dic)
              resolve(res)
            }).catch(e => {
              resolve(res)
            })
          })
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('pts:sys:tSysFile:add'),
      editEnabel: checkPermission('pts:sys:tSysFile:edit'),
      removeEnable: checkPermission('pts:sys:tSysFile:remove')
    }
  },
  filters: {},
  created() { },
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
      delTSysFile({ ids: ids.join(',') }).then(res => {
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
