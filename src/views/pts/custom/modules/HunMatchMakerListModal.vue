<template>
  <a-modal title="操作"
           style="top: 20px;"
           :width="1200"
           :body-style="{ padding: 0, height: '80vh' }"
           v-model="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit">
    <v-scroll>
      <div style="padding: 24px">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="5"
                     :sm="15">
                <a-form-item label="姓名">
                  <a-input placeholder="姓名"
                           v-model="queryParam.name" />
                </a-form-item>
              </a-col>
              <a-col :md="5"
                     :sm="15">
                <a-form-item label="红娘类型">
                  <a-select placeholder="红娘类型"
                            v-model="queryParam.type">
                    <a-select-option value="">所有</a-select-option>
                    <a-select-option v-for="(b, index) in typeArray"
                                     :key="index"
                                     :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="5"
                       :sm="15">
                  <a-form-item label="性别">
                    <a-select placeholder="性别"
                              v-model="queryParam.sex">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in sexArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="5"
                       :sm="15">
                  <a-form-item label="是否掌握资源">
                    <a-select placeholder="是否掌握资源"
                              v-model="queryParam.source">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in sourceArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="5"
                       :sm="15">
                  <a-form-item label="提成类型">
                    <a-select placeholder="提成类型"
                              v-model="queryParam.presentType">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in salaryExtraArray"
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
                <a-col :md="5"
                       :sm="15">
                  <a-form-item label="联系电话">
                    <a-input placeholder="联系电话"
                             v-model="queryParam.phone" />
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
                  <a @click="advanced = !advanced"
                     style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <s-table size="default"
                 ref="table"
                 rowKey="id"
                 :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                 :columns="columns"
                 :data="loadData">
          <span slot="sexSlot"
                slot-scope="text">
            {{ text | dictFilter(sexMap) }}
          </span>
          <span slot="statusSlot"
                slot-scope="text">{{ text | dictFilter(statusMap) }}</span>
          <span slot="typeSlot"
                slot-scope="text">{{ text | dictFilter(typeMap) }}</span>
          <span slot="sourceSlot"
                slot-scope="text">{{ text | dictFilter(sourceMap) }}</span>
          <span slot="salaryExtraSlot"
                slot-scope="text">{{ text | dictFilter(salaryExtraMap) }}</span>
          <span slot="action"
                slot-scope="text, record">
            <a v-if="editEnabel"
               @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"
                       v-if="removeEnable" />
            <a v-if="removeEnable"
               @click="delByIds([record.id])">删除</a>
          </span>
        </s-table>
        <hunMatchmaker-modal ref="modal"
                             @ok="handleOk" />
      </div>
    </v-scroll>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import HunMatchmakerModal from '@/views/pts/matchmaker/modules/HunMatchmakerModal.vue'
import { getHunMatchmakerList, delHunMatchmaker } from '@/api/pts/matchmaker/matchmaker'

export default {
  name: 'HunCustomListModal',
  components: {
    STable,
    HunMatchmakerModal
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
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
          title: '性别',
          scopedSlots: { customRender: 'sexSlot' },
          dataIndex: 'sex'
        },
        {
          title: '联系电话',
          dataIndex: 'phone'
        },
        {
          title: '微信号',
          dataIndex: 'wechat'
        },
        {
          title: 'qq号',
          dataIndex: 'qq'
        },
        {
          title: '红娘类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'typeSlot' },
          sorter: true
        },
        {
          title: '是否掌握资源',
          dataIndex: 'source',
          scopedSlots: { customRender: 'sourceSlot' },
          sorter: true
        },
        {
          title: '提成类型',
          dataIndex: 'presentType',
          scopedSlots: { customRender: 'salaryExtraSlot' },
          sorter: true
        },
        {
          title: '提成值',
          dataIndex: 'persentValue'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusSlot' }
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
        return getHunMatchmakerList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      sexArray: [],
      sexMap: {},
      typeArray: [],
      typeMap: {},
      sourceArray: [],
      sourceMap: {},
      salaryExtraArray: [],
      salaryExtraMap: {},
      statusArray: [],
      statusMap: {},
      addEnable: checkPermission('matchmaker:hunMatchmaker:add'),
      editEnabel: checkPermission('matchmaker:hunMatchmaker:edit'),
      removeEnable: checkPermission('matchmaker:hunMatchmaker:remove')
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
      getDictArray('sys_sex').then(data => {
        this.sexArray = data
        const sexMap = {}
        this.sexArray.forEach(d => {
          sexMap[d.dictValue] = { text: d.dictLabel }
        })
        this.sexMap = sexMap
      })
      getDictArray('hun_matchmaker_type').then(data => {
        this.typeArray = data
        const typeMap = {}
        this.typeArray.forEach(d => {
          typeMap[d.dictValue] = { text: d.dictLabel }
        })
        this.typeMap = typeMap
      })
      getDictArray('hun_matchmaker_resources').then(data => {
        this.sourceArray = data
        const sourceMap = {}
        this.sourceArray.forEach(d => {
          sourceMap[d.dictValue] = { text: d.dictLabel }
        })
        this.sourceMap = sourceMap
      })
      getDictArray('hun_matchmaker_extra_salary_type').then(data => {
        this.salaryExtraArray = data
        const salaryExtraMap = {}
        this.salaryExtraArray.forEach(d => {
          salaryExtraMap[d.dictValue] = { text: d.dictLabel }
        })
        this.salaryExtraMap = salaryExtraMap
      })
      getDictArray('sys_normal_disable').then(data => {
        this.statusArray = data
        const statusMap = {}
        this.statusArray.forEach(d => {
          statusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.statusMap = statusMap
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOpen(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = true
      if (this.$refs.table) {
        this.$refs.table.refresh(true)
      }
    },
    handleSubmit() {
      if (this.selectedRowKeys.length === 1) {
        this.$emit('ok', this.selectedRowKeys[0], this.selectedRows[0])
        this.visible = false
      } else {
        this.$message.warning('请选择红娘')
      }
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
      delHunMatchmaker({ ids: ids.join(',') }).then(res => {
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
