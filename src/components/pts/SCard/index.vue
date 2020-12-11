<template>
  <div class="venus-card-wrapper">
    <a-spin tip="Loading..."
            :spinning="localLoading">
      <a-row :gutter="gutter"
             class="venus-card-row"
             v-show="localDataSource.length>0">
        <a-col :xs="span.xs"
               :sm="span.sm"
               :md="span.md"
               :lg="span.lg"
               :xl="span.xl"
               :xxl="span.xxl"
               v-for="row in localDataSource"
               :key="row[rowKey]"
               class="venus-card">
          <div class="card-box">
            <div class="card-img-box"
                 @click="(e)=> imgClick(row[icon], e)">
              <img :src="getIcon(row[icon])"
                   class="card-img" />
              <div class="img-count"
                   v-if="checkIconNum(row[icon])">{{ checkIconNum(row[icon]).length }}</div>
            </div>
            <div class="card-word">
              <p class="card-title">
                <slot name="title"></slot>
                {{ row[title] }}
              </p>
              <p class="card-desc">
                <span class="indentation"></span>
                <slot name="description"></slot>
                {{ row[description] }}
              </p>
            </div>
            <div class="card-action">
              <slot name="action"
                    :row="row"></slot>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-empty v-show="localDataSource.length<=0"
               :image="emptyImg"
               :image-style="{ height: '100px',}">
        <span slot="description">
          暂无数据
          <!-- <a href="#API">Description</a> -->
        </span>
      </a-empty>
    </a-spin>
    <a-row gutter="0"
           v-if="localDataSource.length>0">
      <a-col span="24"
             class="footer-pagination">
        <a-pagination :page-size="localPagination.pageSize || 8"
                      :total="localPagination.total"
                      v-model="localPagination.current"
                      @change="loadData" />
      </a-col>
    </a-row>
    <a-modal :visible="previewVisible"
             :footer="null"
             @cancel="previewVisible = false"
             class="venus-card-modal"
             width="50%"
             :bodyStyle="{ padding: 0 }">
      <!-- <img alt="加载失败"
           style="width: 100%;border-radius: 3px"
      :src="imgData" />-->
      <a-carousel dots-class="slick-dots slick-thumb"
                  class="venus-card-carousel"
                  v-if="previewVisible">
        <a slot="customPaging"
           slot-scope="props">
          <img :src="imgData[props.i]" />
        </a>
        <div v-for="(item, index) in imgData"
             :key="index">
          <img :src="item" />
        </div>
      </a-carousel>
    </a-modal>
  </div>
</template>
<script>
import get from 'lodash.get'
import original from '@/assets/portalClient/original.png'
import prefix from '@/config/prefix'

export default {
  name: 'VenusSCard',
  data() {
    return {
      localLoading: false,
      previewVisible: false,
      imgData: [],
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      emptyImg: original
    }
  },
  props: Object.assign(
    {},
    {
      rowKey: {
        type: [String, Function],
        default: 'key'
      },
      pagination: {
        type: [Object, Boolean],
        default: false
      },
      data: {
        type: Function,
        required: true
      },
      pageNum: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 8
      },
      showSizeChanger: {
        type: Boolean,
        default: true
      },
      showQuickJumper: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'default'
      },
      /**
       * alert: {
       *   show: true,
       *   clear: Function
       * }
       */
      alert: {
        type: [Object, Boolean],
        default: null
      },
      rowSelection: {
        type: Object,
        default: null
      },
      /** @Deprecated */
      showAlertInfo: {
        type: Boolean,
        default: false
      },
      showPagination: {
        type: String | Boolean,
        default: 'false'
      },
      /**
       * enable page URI mode
       *
       * e.g:
       * /users/1
       * /users/2
       * /users/3?queryParam=test
       * ...
       */
      pageURI: {
        type: Boolean,
        default: false
      },
      rangPicker: {
        type: Array,
        default: null
      },
      title: {
        type: String,
        default: 'name'
      },
      icon: {
        type: String,
        default: 'icon'
      },
      description: {
        type: String,
        default: 'remark'
      },
      iconPrefix: {
        type: String,
        default: undefined
      },
      gutter: {
        type: Number,
        default: 0
      },
      span: {
        type: Object,
        default: () => { return { xs: 24, md: 8 } }
      }
    }
  ),
  watch: {
    'localPagination.current'(val) {
      this.pageURI &&
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNo: val
          })
        })
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    },
    showQuickJumper(val) {
      Object.assign(this.localPagination, {
        showQuickJumper: val
      })
    }
  },
  created() {
    const { pageNo } = this.$route.params
    const localPageNum = (this.pageURI && pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination =
      (['auto', true].includes(this.showPagination) &&
        Object.assign({}, this.localPagination, {
          current: localPageNum,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          showQuickJumper: this.showQuickJumper
        })) ||
      false
    this.loadData()
  },
  methods: {
    checkIconNum(icon) {
      const arr = icon ? icon.split(',') : []
      if (arr.length > 1) {
        return arr
      }
      return false
    },
    getIcon(icon) {
      const arr = this.checkIconNum(icon)
      if (arr) {
        return this.iconPrefix === undefined ? prefix.OPEN_URL_PREFIX + arr[0] : this.iconPrefix + arr[0]
      } else {
        return this.iconPrefix === undefined ? prefix.OPEN_URL_PREFIX + icon : this.iconPrefix + icon
      }
    },
    imgClick(icon, e) {
      const arr = icon ? icon.split(',') : []
      this.imgData = arr.map(item => {
        return this.iconPrefix === undefined ? prefix.OPEN_URL_PREFIX + icon : this.iconPrefix + icon
      })
      this.$nextTick(() => {
        this.previewVisible = true
      })
    },
    /**
     * 卡片列表重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(current, pageSize) {
      this.localLoading = true
      // console.log('rangPicker', this.rangPicker)
      const parameter = Object.assign(
        {
          pageNum: current || (this.showPagination && this.localPagination.current) || this.pageNum,
          pageSize: pageSize || (this.showPagination && this.localPagination.pageSize) || this.pageSize
        },
        (this.rangPicker &&
          this.rangPicker.length === 2 && {
          beginTime: this.rangPicker[0].format('YYYY-MM-DD'),
          endTime: this.rangPicker[1].format('YYYY-MM-DD')
        }) ||
        {}
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        const _this = this
        result.then(r => {
          _this.localPagination =
            (_this.showPagination &&
              Object.assign({}, _this.localPagination, {
                current: r.pageNum, // 返回结果中的当前分页数
                total: r.total, // 返回结果中的总记录数
                showSizeChanger: _this.showSizeChanger,
                showQuickJumper: _this.showQuickJumper,
                showTotal: total => `共 ${r.total} 条数据`,
                pageSize: (_this.showPagination && pageSize) || _this.localPagination.pageSize || this.pageSize
              })) ||
            false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.rows.length === 0 && _this.showPagination && _this.localPagination.current > 1) {
            _this.localPagination.current--
            _this.loadData()
            return
          }
          // console.log('localPagination', this.localPagination)
          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if (
              ['auto', true].includes(_this.showPagination) &&
              r.total <= r.pageNum * _this.localPagination.pageSize
            ) {
              _this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            _this.localPagination = false
          }
          _this.localDataSource = r.rows // 返回结果中的数组数据
          _this.localLoading = false
        })
      }

      this.pagination = false
    }
  }
  // render() {
  //   const cardWrapper = this.localDataSource.map(row => {
  //     const key = row[this.rowKey]
  //     return <a-col span="6" key={key} class="venus-card">
  //       <img src={prefix.OPEN_URL_PREFIX + row.icon} class="card-img" />
  //       <div class="card-word">
  //         <p class="card-title">{row[this.title]}</p>
  //         <p class="card-desc"><span class="indentation"></span>{row[this.description]}</p>
  //       </div>
  //       {Object.keys(this.$slots).map(name => (<slot name={name} row={row} class="card-action">{this.$slots[name]}</slot>))}
  //     </a-col>
  //   })
  //   const paginationRender = this.showPagination ? (<a-pagination
  //     // show-size-changer={this.localPagination.showSizeChanger}
  //     default-page-size={this.localPagination.pageSize || 8}
  //     show-total={this.localPagination.showTotal}
  //     current={this.localPagination.current}
  //     show-quick-jumper={this.localPagination.showQuickJumper}
  //     on={{ change: this.loadData, showSizeChange: this.loadData }}
  //   />) : ''
  // }
}
</script>
<style lang="less">
@import './index.less';
.venus-card-modal {
  .ant-modal-content {
    background: none;
    box-shadow: none;
    height: 0px;
    // .ant-modal-close {
    //   display: none;
    // }
  }
}
.venus-card-carousel {
  .slick-dots {
    height: auto;
  }
}
.venus-card-carousel {
  .slick-slide img {
    // border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 100%;
  }
}
.venus-card-carousel {
  .slick-thumb {
    bottom: -53px;
  }
}
.venus-card-carousel {
  .slick-thumb li {
    width: 60px;
    height: 45px;
  }
}
.venus-card-carousel {
  .slick-thumb li img {
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    filter: grayscale(100%);
  }
}
.venus-card-carousel {
  .slick-thumb li.slick-active img {
    filter: grayscale(0%);
    box-shadow: 0px 0px 2px 2px @primary-color;
  }
}
</style>
