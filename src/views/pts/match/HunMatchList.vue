<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="配对状态">
              <a-select placeholder="配对状态"
                        v-model="queryParam.matchStatus">
                <a-select-option value="">所有</a-select-option>
                <a-select-option v-for="(b, index) in matchStatusArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="状态">
              <a-select placeholder="状态"
                        v-model="queryParam.status">
                <a-select-option value="">所有</a-select-option>
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
      <!-- <a-button v-if="addEnable"
                type="primary"
                icon="plus"
                @click="$refs.modal.add()">新建</a-button> -->
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
      <span slot="customOneSlot"
            slot-scope="text, record"
            class="table-cell-link"
            @click="handleQuery('mid', record.mid)">
        {{ text }}
      </span>
      <span slot="customTwoSlot"
            slot-scope="text, record"
            class="table-cell-link"
            @click="handleQuery('wid', record.wid)">
        {{ text }}
      </span>
      <span slot="matchMakerSlot"
            slot-scope="text, record"
            class="table-cell-link"
            @click="handleQuery('mmid', record.mmid)">
        {{ text }}
      </span>
      <span slot="statusSlot"
            slot-scope="text">
        {{ text | dictFilter(statusMap) }}
      </span>
      <span slot="matchStatusSlot"
            slot-scope="text">
        {{ text | dictFilter(matchStatusMap) }}
      </span>
      <span slot="action"
            slot-scope="text, record">
        <!-- <a-icon type="edit"
                v-if="editEnabel"
                class="icon-action edit"
                @click="handleEdit(record)" /> -->
        <a-popconfirm title="确认删除本条记录?"
                      v-if="removeEnable"
                      @confirm="() => delByIds([record.id])">
          <a-icon type="delete"
                  class="icon-action delete" />
        </a-popconfirm>
        <!-- 配对详情 -->
        <a-icon type="solution"
                v-if="detailEnable"
                class="icon-action other"
                style="--content: '\914d\5bf9\8be6\60c5'"
                @click="handleDetail(record.id)" />
      </span>
    </s-table>
    <hunMatch-modal ref="modal"
                    @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getHunMatchList, delHunMatch } from '@/api/pts/match/match'
import HunMatchModal from './modules/HunMatchModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'TableList',
  components: {
    STable,
    HunMatchModal
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
          title: '男',
          scopedSlots: { customRender: 'customOneSlot' },
          dataIndex: 'customOne.name'
        },
        {
          title: '女',
          scopedSlots: { customRender: 'customTwoSlot' },
          dataIndex: 'customTwo.name'
        },
        {
          title: '红娘',
          scopedSlots: { customRender: 'matchMakerSlot' },
          dataIndex: 'matchMaker.name'
        },
        {
          title: '配对时间',
          dataIndex: 'matchTime',
          sorter: true
        },
        {
          title: '配对状态',
          scopedSlots: { customRender: 'matchStatusSlot' },
          dataIndex: 'matchStatus'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'statusSlot' },
          dataIndex: 'status'
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
      loadData: parameter => {
        return getHunMatchList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusArray: [],
      statusMap: {},
      matchStatusArray: [],
      matchStatusMap: {},
      addEnable: checkPermission('match:hunMatch:add'),
      editEnabel: checkPermission('match:hunMatch:edit'),
      removeEnable: checkPermission('match:hunMatch:remove'),
      detailEnable: checkPermission('pts:custom:hunCustom:detail')
    }
  },
  filters: {
    dictFilter(dataIndex, Map) {
      return Map[dataIndex].text
    }
  },
  activated() {
    if (this.$route.query.refresh === true && this.$refs.table) {
      this.$refs.table.refresh()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('sys_normal_disable').then(data => {
        this.statusArray = data
        const statusMap = {}
        this.statusArray.forEach(d => {
          statusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.statusMap = statusMap
      })
      getDictArray('hun_match_status').then(data => {
        this.matchStatusArray = data
        const matchStatusMap = {}
        this.matchStatusArray.forEach(d => {
          matchStatusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.matchStatusMap = matchStatusMap
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
    handleQuery(key, value) {
      if (!this.queryParam[key]) {
        this.queryParam[key] = value
      } else {
        delete this.queryParam[key]
      }
      this.$refs.table.refresh(true)
    },
    handleDetail(id) {
      this.$router.push({ name: 'customerDetail', query: { matchId: id } })
    },
    delByIds(ids) {
      delHunMatch({ ids: ids.join(',') }).then(res => {
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
