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
              <a-col :md="4"
                     :sm="15">
                <a-form-item label="姓名">
                  <a-input placeholder="请输入姓名"
                           v-model="queryParam.name" />
                </a-form-item>
              </a-col>
              <a-col :md="4"
                     :sm="15">
                <a-form-item label="学历">
                  <a-select placeholder="学历"
                            v-model="queryParam.education">
                    <a-select-option value="">所有</a-select-option>
                    <a-select-option v-for="(b, index) in educationArray"
                                     :key="index"
                                     :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="民族">
                    <a-input placeholder="请输入民族"
                             suffix="族"
                             v-model="queryParam.nation" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="籍贯">
                    <a-input placeholder="请输入籍贯"
                             v-model="queryParam.nativePlace" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="身高">
                    <a-input placeholder="请输入身高"
                             suffix="CM"
                             v-model="queryParam.height" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="体重">
                    <a-input placeholder="请输入体重"
                             suffix="KG"
                             v-model="queryParam.weight" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="职业">
                    <a-input placeholder="请输入职业"
                             v-model="queryParam.job" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="工作地址">
                    <a-input placeholder="请输入工作地址"
                             v-model="queryParam.jobAddr" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="家庭住址">
                    <a-input placeholder="请输入家庭住址"
                             v-model="queryParam.homeAddr" />
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="是否有房">
                    <a-select placeholder="是否有房"
                              v-model="queryParam.house">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in houseArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="是否有车">
                    <a-select placeholder="是否有车"
                              v-model="queryParam.car">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in carArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="血型">
                    <a-select placeholder="血型"
                              v-model="queryParam.blood">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in bloodArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="工作状态">
                    <a-select placeholder="工作状态"
                              v-model="queryParam.status">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in statusArray"
                                       :key="index"
                                       :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4"
                       :sm="15">
                  <a-form-item label="婚姻状况">
                    <a-select placeholder="婚姻状况"
                              v-model="queryParam.maritalStatus">
                      <a-select-option value="">所有</a-select-option>
                      <a-select-option v-for="(b, index) in maritalStatusArray"
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
          <span slot="nation"
                slot-scope="text">{{ text ? `${text}族` : '未知' }}</span>
          <span slot="height"
                slot-scope="text">{{ text ? `${text}CM` : '未知' }}</span>
          <span slot="weight"
                slot-scope="text">{{ text ? `${text}KG` : '未知' }}</span>
          <span slot="sex"
                slot-scope="text">{{ text | dictFilter(sexMap) }}</span>
          <span slot="education"
                slot-scope="text">{{ text | dictFilter(educationMap) }}</span>
          <span slot="maritalStatus"
                slot-scope="text">{{ text | dictFilter(maritalStatusMap) }}</span>
          <span slot="house"
                slot-scope="text">{{ text | dictFilter(houseMap) }}</span>
          <span slot="car"
                slot-scope="text">{{ text | dictFilter(carMap) }}</span>
          <span slot="status"
                slot-scope="text">
            <a-badge :status="text | statusTypeFilter"
                     :text="text | dictFilter(statusMap)" />
          </span>
        </s-table>
      </div>
    </v-scroll>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getHunCustomList } from '@/api/pts/custom/custom'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'

export default {
  name: 'HunCustomListModal',
  components: {
    STable
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
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '姓别',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' },
          sorter: true
        },
        {
          title: '民族',
          dataIndex: 'nation',
          scopedSlots: { customRender: 'nation' },
          sorter: true
        },
        {
          title: '出生日期',
          dataIndex: 'birthday',
          sorter: true
        },
        {
          title: '身高',
          dataIndex: 'height',
          scopedSlots: { customRender: 'height' },
          sorter: true
        },
        {
          title: '体重',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' },
          sorter: true
        },
        {
          title: '学历',
          dataIndex: 'education',
          scopedSlots: { customRender: 'education' },
          sorter: true
        },
        {
          title: '婚姻状况',
          dataIndex: 'maritalStatus',
          scopedSlots: { customRender: 'maritalStatus' },
          sorter: true
        },
        {
          title: '是否有房',
          dataIndex: 'house',
          scopedSlots: { customRender: 'house' },
          sorter: true
        },
        {
          title: '是否有车',
          dataIndex: 'car',
          scopedSlots: { customRender: 'car' },
          sorter: true
        },
        {
          title: '工作状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getHunCustomList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusArray: [],
      statusMap: {},
      relationArray: [],
      relationMap: {}
    }
  },
  filters: {
    dictFilter(dataIndex, Map) {
      return Map[dataIndex].text
    },
    statusTypeFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'error',
        '3': 'warning',
        '4': 'processing',
        '5': 'purple',
        '6': 'default'
      }
      return statusMap[status] || 'default'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDictArray('yes_no').then(data => {
        this.houseArray = data
        this.carArray = data
        const dataMap = {}
        data.map(d => {
          dataMap[d.dictValue] = { text: d.dictLabel }
        })
        this.houseMap = dataMap
        this.carMap = dataMap
      })
      getDictArray('hun_custom_blood').then(data => {
        this.bloodArray = data
        const bloodMap = {}
        this.bloodArray.map(d => {
          bloodMap[d.dictValue] = { text: d.dictLabel }
        })
        this.bloodMap = bloodMap
      })
      getDictArray('hun_custom_marital').then(data => {
        this.maritalStatusArray = data
        const maritalStatusMap = {}
        this.maritalStatusArray.map(d => {
          maritalStatusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.maritalStatusMap = maritalStatusMap
      })
      getDictArray('hun_custom_work_status').then(data => {
        this.statusArray = data
        const statusMap = {}
        this.statusArray.map(d => {
          statusMap[d.dictValue] = { text: d.dictLabel }
        })
        this.statusMap = statusMap
      })
      getDictArray('hun_custom_education').then(data => {
        this.educationArray = data
        const educationMap = {}
        this.educationArray.map(d => {
          educationMap[d.dictValue] = { text: d.dictLabel }
        })
        this.educationMap = educationMap
      })
      getDictArray('sys_sex').then(data => {
        this.sexArray = data
        const sexMap = {}
        this.sexArray.map(d => {
          sexMap[d.dictValue] = { text: d.dictLabel }
        })
        this.sexMap = sexMap
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOpen(param) {
      this.selectedRowKeys = []
      this.selectedRows = []
      // this.queryParam.sex = param.sex
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
        this.$message.warning('请选择待配对者')
      }
    }
  }
}
</script>
