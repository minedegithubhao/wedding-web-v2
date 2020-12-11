<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="模块名称">
              <a-input placeholder="请输入模块名称"
                       v-model="queryParam.modelName" />
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="模块代码">
              <a-input placeholder="请输入模块代码"
                       v-model="queryParam.modelCode" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="5"
                   :sm="15">
              <a-form-item label="当前最大值">
                <a-input placeholder="请输入当前最大值"
                         v-model="queryParam.maxSerial" />
              </a-form-item>
            </a-col>
            <a-col :md="5"
                   :sm="15">
              <a-form-item label="缓存个数">
                <a-input placeholder="请输入缓存个数"
                         v-model="queryParam.preMaxNum" />
              </a-form-item>
            </a-col>
            <a-col :md="5"
                   :sm="15">
              <a-form-item label="自增标识">
                <a-input placeholder="请输入自增标识"
                         v-model="queryParam.autoIncrementFlag" />
              </a-form-item>
            </a-col>
            <a-col :md="5"
                   :sm="15">
              <a-form-item label="状态">
                <a-select placeholder="请选择"
                          v-model="queryParam.status"
                          default-value="0">
                  <a-select-option :value="''">全部</a-select-option>
                  <a-select-option v-for="(b, index) in statusArry"
                                   :key="index"
                                   :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8"
                 :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced"
                 style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
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
      <span slot="status"
            slot-scope="text">{{ text | statusFilter }}</span>
      <span slot="action"
            slot-scope="text, record">
        <a-icon type="edit"
                v-if="editEnabel"
                class="icon-action edit"
                @click="handleEdit(record)" />
        <a-popconfirm title="确认删除?"
                      v-if="removeEnable"
                      @confirm="() => delByIds([record.id])">
          <a-icon type="delete"
                  class="icon-action delete" />
        </a-popconfirm>
      </span>
    </s-table>
    <tSysSerialNumber-modal ref="modal"
                            @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getTSysSerialNumberList, delTSysSerialNumber } from '@/api/pts/sys/TSysSerialNumber'
import TSysSerialNumberModal from './modules/TSysSerialNumberModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
const statusMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    TSysSerialNumberModal
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
          title: '模块名称',
          dataIndex: 'modelName'
        },
        {
          title: '模块代码',
          dataIndex: 'modelCode'
        },
        {
          title: '参数模板',
          dataIndex: 'configTemplet'
        },
        {
          title: '当前最大值',
          dataIndex: 'maxSerial'
        },
        {
          title: '缓存个数',
          dataIndex: 'preMaxNum'
        },
        {
          title: '自增标识',
          dataIndex: 'autoIncrementFlag'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getTSysSerialNumberList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('pts:sys:tSysSerialNumber:add'),
      editEnabel: checkPermission('pts:sys:tSysSerialNumber:edit'),
      removeEnable: checkPermission('pts:sys:tSysSerialNumber:remove'),
      statusArry: []
    }
  },
  filters: {
    statusFilter(dataIndex) {
      return statusMap[dataIndex].text
    }
  },
  async created() {
    this.statusArry = await getDictArray('sys_normal_disable')
    this.statusArry.map(d => {
      statusMap[d.dictValue] = { text: d.dictLabel }
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
      delTSysSerialNumber({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.$refs.table.clearSelected()
      })
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
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
