<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名"
                       v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="与代理人关系">
              <a-select placeholder="请选择与代理人关系"
                        v-model="queryParam.relation">
                <a-select-option v-for="(b, index) in relationArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="请选择状态"
                        v-model="queryParam.status">
                <a-select-option v-for="(b, index) in statusArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
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
      <span slot="statusSlot"
            slot-scope="text">
        {{ text | dictFilter(statusMap) }}
      </span>
      <span slot="relationSlot"
            slot-scope="text">
        {{ text | dictFilter(relationMap) }}
      </span>
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
    <hunAgent-modal ref="modal"
                    @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getHunAgentList, delHunAgent } from '@/api/pts/relation/agent'
import HunAgentModal from './modules/HunAgentModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'TableList',
  components: {
    STable,
    HunAgentModal
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
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '与代理人关系',
          scopedSlots: { customRender: 'relationSlot' },
          dataIndex: 'relation'
        },
        {
          title: '微信',
          dataIndex: 'wechat'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'statusSlot' },
          dataIndex: 'status'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          width: '120px',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getHunAgentList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusArray: [],
      statusMap: {},
      relationArray: [],
      relationMap: {},
      addEnable: checkPermission('agent:hunAgent:add'),
      editEnabel: checkPermission('agent:hunAgent:edit'),
      removeEnable: checkPermission('agent:hunAgent:remove')
    }
  },
  filters: {
    dictFilter(dataIndex, Map) {
      return Map[dataIndex].text
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('sys_normal_disable').then((data) => {
        this.statusArray = data
        const statusMap = {}
        this.statusArray.forEach((d) => {
          statusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.statusMap = statusMap
      })
      getDictArray('hun_agent_relation').then((data) => {
        this.relationArray = data
        const relationMap = {}
        this.relationArray.forEach((d) => {
          relationMap[d.dictValue] = { text: d.dictLabel }
        })
        this.relationMap = relationMap
      })
    },
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
      delHunAgent({ ids: ids.join(',') }).then((res) => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    }
  }
}
</script>
