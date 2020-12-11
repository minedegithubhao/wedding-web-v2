<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="会员卡类型">
              <a-select placeholder="会员卡类型"
                        v-model="queryParam.cardType">
                <a-select-option value="">所有</a-select-option>
                <a-select-option v-for="(b, index) in cardTypeArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="会员卡编号">
              <a-input placeholder="会员卡编号"
                       v-model="queryParam.cardId" />
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="会员类型">
              <a-select placeholder="会员类型"
                        v-model="queryParam.memberType">
                <a-select-option value="">所有</a-select-option>
                <a-select-option v-for="(b, index) in memberTypeArray"
                                 :key="index"
                                 :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5"
                 :sm="15">
            <a-form-item label="会员卡名称">
              <a-select placeholder="会员卡名称"
                        v-model="queryParam.cardName">
                <a-select-option value="">所有</a-select-option>
                <a-select-option v-for="(b, index) in cardNameArray"
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
      <span slot="cardTypeSlot"
            slot-scope="text">
        {{ text | dictFilter(cardTypeMap) }}
      </span>
      <span slot="memberTypeSlot"
            slot-scope="text">
        {{ text | dictFilter(memberTypeMap) }}
      </span>
      <span slot="cardName"
            slot-scope="text">{{ text | dictFilter(cardNameMap) }}</span>
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
    <hunMember-modal ref="modal"
                     @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getHunMemberList, delHunMember } from '@/api/pts/member/member'
import HunMemberModal from './modules/HunMemberModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'TableList',
  components: {
    STable,
    HunMemberModal
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
        // {
        //   title: '顾客',
        //   dataIndex: 'hunCustom.name'
        // },
        {
          title: '会员姓名',
          dataIndex: 'hunCustom.name'
        },
        {
          title: '会员卡类型',
          scopedSlots: { customRender: 'cardTypeSlot' },
          dataIndex: 'cardType'
        },
        {
          title: '会员卡编号',
          dataIndex: 'cardId'
        },
        {
          title: '会员类型',
          scopedSlots: { customRender: 'memberTypeSlot' },
          dataIndex: 'memberType'
        },
        {
          title: '联系电话',
          dataIndex: 'hunCustom.phone'
        },
        {
          title: '会员等级',
          dataIndex: 'level'
        },
        {
          title: '入会时间',
          dataIndex: 'joinTime',
          sorter: true
        },
        {
          title: '会员卡名称',
          dataIndex: 'cardName',
          scopedSlots: { customRender: 'cardName' },
          sorter: true
        },
        {
          title: '已使用次数',
          dataIndex: 'useTimes'
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
        return getHunMemberList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      cardTypeArray: [],
      cardTypeMap: {},
      cardNameArray: [],
      cardNameMap: {},
      memberTypeArray: [],
      memberTypeMap: {},
      addEnable: checkPermission('member:hunMember:add'),
      editEnabel: checkPermission('member:hunMember:edit'),
      removeEnable: checkPermission('member:hunMember:remove')
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
      getDictArray('hun_member_card_type').then(data => {
        this.cardTypeArray = data
        const cardTypeMap = {}
        this.cardTypeArray.forEach(d => {
          cardTypeMap[d.dictValue] = { text: d.dictLabel }
        })
        this.cardTypeMap = cardTypeMap
      })
      getDictArray('hun_member_type').then(data => {
        this.memberTypeArray = data
        const memberTypeMap = {}
        this.memberTypeArray.forEach(d => {
          memberTypeMap[d.dictValue] = { text: d.dictLabel }
        })
        this.memberTypeMap = memberTypeMap
      })
      getDictArray('hun_member_card_name').then(data => {
        this.cardNameArray = data
        const cardNameMap = {}
        this.cardNameArray.forEach(d => {
          cardNameMap[d.dictValue] = { text: d.dictLabel }
        })
        this.cardNameMap = cardNameMap
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
      delHunMember({ ids: ids.join(',') }).then(res => {
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
