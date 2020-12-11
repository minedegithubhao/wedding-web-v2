<template>
  <div class="customer-detail">
    <div class="nav-button-group light">
      <div class="nav-button border-img">
        <span @click="rollback"
              title="返回上一页"
              style="--content: '\8fd4\56de\4e0a\4e00\9875'">
          <a-icon type="rollback" />
        </span>
      </div>
      <div class="nav-button border-img"
           v-if="pageType !== 'custom' && matchStatus">
        <span @click="handleEdit"
              title="保存修改"
              style="--content: '\4fdd\5b58\4fee\6539'">
          <img src="@/assets/custom/submitEdit.png"
               style="width: 24px;" />
        </span>
      </div>
      <div class="nav-button border-img"
           v-if="pageType === 'custom' && matchStatus">
        <span @click="handleOk"
              title="完成配对"
              style="--content: '\5b8c\6210\914d\5bf9'">
          <img src="@/assets/custom/submit.png"
               style="width: 24px;" />
        </span>
      </div>
      <div class="nav-button border-img"
           v-if="pageType === 'custom'">
        <span @click="handleMatch"
              :title="!matchStatus ? '立即配对' : '取消配对'"
              :style="{ '--content': !matchStatus ? `'\\7acb\\5373\\914d\\5bf9'` : `'\\53d6\\6d88\\914d\\5bf9'` }">
          <img src="@/assets/custom/match.png"
               v-if="!matchStatus"
               style="width: 24px;" />
          <img src="@/assets/custom/cancel.png"
               v-else
               style="width: 24px;" />
        </span>
      </div>
      <div class="back-top nav-button border-img"
           v-if="scrollInfo.vertical && scrollInfo.vertical.process > 0.1">
        <div title="回到顶部"
             class="backTop-box"
             @click="backTop">
          <div class="backTop-top">TOP</div>
        </div>
      </div>
    </div>
    <a-spin :spinning="loading"
            tip="正在加载...">
      <div class="table-page-search-wrapper"
           v-if="matchStatus">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5"
                   :sm="15">
              <a-form-item label="红娘信息">
                <a-button type="primary"
                          @click="$refs.hunMatchMakerListModal.handleOpen()">
                  选择红娘
                </a-button>
                <span v-if="Object.keys(matchMaker).length > 0">
                  已选择<span class="warning-color"
                        style="margin: 0 4px">{{ matchMaker.name }}</span>
                </span>
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="15">
              <a-form-item label="配对状态">
                <a-select placeholder="配对状态"
                          v-model="matchResult">
                  <a-select-option value="">所有</a-select-option>
                  <a-select-option v-for="(b, index) in matchStatusArray"
                                   :key="index"
                                   :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="15">
              <a-form-item label="备注">
                <a-textarea placeholder="配对备注信息..."
                            v-model="remark"
                            :auto-size="{ minRows: 1, maxRows: 6 }" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div :class="{ 'display-box': matchStatus }"
           class="custom-box">
        <div class="add-custom"
             v-if="matchStatus"
             :class="{ 'custom-info': Object.keys(customTwo).length > 0, 'sex-blue': custom.sex !== '1', 'sex-red': custom.sex === '1', 'float-left': matchStatus && custom.sex !== '1', 'float-right': matchStatus && custom.sex === '1' }">
          <div class="add-box"
               v-if="Object.keys(customTwo).length === 0"
               @click="addCustomTwo">
            <a-icon type="plus"
                    class="add-icon" />
          </div>
          <template v-else>
            <a-icon type="close"
                    v-if="pageType === 'custom'"
                    @click="deleteCustomTwo"
                    class="close-icon" />
            <span src="@/assets/custom/custom_title.png"
                  class="title-img">
            </span>
            <div class="custom-header">
              <div class="custom-left">
                <div class="custom-name">
                  {{ customTwo.name }}
                </div>
                <span class="custom-sex">{{ customTwo.sex | dictFilter(sexMap)}}</span>
              </div>
              <div class="custom-important-info">
                <div class="info-item">
                  <img src="@/assets/custom/phone.png"
                       class="item-img" />
                  <span class="title">手机号码：</span>
                  <span class="value">{{ customTwo.phone }}</span>
                </div>
                <div class="info-item">
                  <img src="@/assets/custom/marital_status.png"
                       class="item-img" />
                  <span class="title">婚姻状况：</span>
                  <span class="value">{{ customTwo.maritalStatus | dictFilter(maritalStatusMap) }}</span>
                </div>
                <div class="info-item">
                  <img src="@/assets/custom/sex.png"
                       class="item-img" />
                  <span class="title">年龄：</span>
                  <span class="value">{{ customTwo.birthday | birthdayFilter }}</span>
                </div>
                <div class="info-item">
                  <img src="@/assets/custom/education.png"
                       class="item-img" />
                  <span class="title">学历：</span>
                  <span class="value">{{ customTwo.education | dictFilter(educationMap) }}</span>
                </div>
                <div class="info-item">
                  <img src="@/assets/custom/house_car.png"
                       class="item-img" />
                  <span class="title">房车情况：</span>
                  <span class="value">{{ customTwo | houseAndCarFilter }}</span>
                </div>
              </div>
              <img :src="prefix.OPEN_URL_PREFIX + customTwo.filePath"
                   v-if="!!customTwo.filePath"
                   class="custom-pic" />
            </div>
            <div class="custom-body">
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/base_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/base_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">基本信息</span>
                </div>
                <div class="custom-body-item-content">
                  <a-row>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">性别：</span>
                        <span class="value">{{ customTwo.sex | dictFilter(sexMap) }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">民族：</span>
                        <span class="value">{{ customTwo.nation }}<span v-if="customTwo.nation">族</span></span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">籍贯：</span>
                        <span class="value">{{ customTwo.nativePlace }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">血型：</span>
                        <span class="value">{{ customTwo.blood | dictFilter(bloodMap) }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">出生日期：</span>
                        <span class="value">{{ customTwo.birthday }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/person_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/person_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">个人信息</span>
                </div>
                <div class="custom-body-item-content">
                  <a-row>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">工作状态：</span>
                        <span class="value">{{ customTwo.status | dictFilter(statusMap) }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">职业：</span>
                        <span class="value">{{ customTwo.job }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">毕业院校：</span>
                        <span class="value">{{ customTwo.graduationCollage }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">微信号：</span>
                        <span class="value">{{ customTwo.wechat }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">QQ号：</span>
                        <span class="value">{{ customTwo.qq }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">邮箱：</span>
                        <span class="value">{{ customTwo.email }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">工作地址：</span>
                        <span class="value">{{ customTwo.jobAddr }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">兴趣爱好：</span>
                        <span class="value">{{ customTwo.hobby }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/hide_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/person_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">隐私信息</span>
                </div>
                <div class="custom-body-item-content">
                  <a-row>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">身高：</span>
                        <span class="value">{{ customTwo.height }}<span v-if="customTwo.height">CM</span></span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">体重：</span>
                        <span class="value">{{ customTwo.weight }}<span v-if="customTwo.weight">KG</span></span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">身份证号：</span>
                        <span class="value">{{ customTwo.idCard }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">身体状况：</span>
                        <span class="value">{{ customTwo.physicalCondition }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/assets_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/person_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">资产信息</span>
                </div>
                <div class="custom-body-item-content">
                  <a-row>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">收入状况：</span>
                        <span class="value">{{ customTwo.salary | dictFilter(salaryMap) }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">房产说明：</span>
                        <span class="value">{{ customTwo.houseDesc }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">车子说明：</span>
                        <span class="value">{{ customTwo.carDesc }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/family_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/person_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">家庭信息</span>
                </div>
                <div class="custom-body-item-content">
                  <a-row>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">家庭住址：</span>
                        <span class="value">{{ customTwo.homeAddr }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">家庭情况：</span>
                        <span class="value">{{ customTwo.homeDesc }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">代理人：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.name }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">代理人联系方式：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.phone }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">与代理人关系：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.relation | dictFilter(relationMap) }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">代理人微信：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.wechat }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">代理人QQ：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.qq }}</span>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div class="info-item">
                        <span class="title">代理人邮箱：</span>
                        <span class="value">{{ customTwo.hunAgent && customTwo.hunAgent.email }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
              <div class="custom-body-item">
                <div class="custom-body-item-title">
                  <img src="@/assets/custom/remark_info.png"
                       v-if="customTwo.sex === '1'"
                       class="custom-body-item-title-icon" />
                  <img src="@/assets/custom/person_info_red.png"
                       v-else
                       class="custom-body-item-title-icon" />
                  <span class="custom-body-item-title-term">备注信息</span>
                </div>
                <div class="custom-body-item-content">
                  {{ customTwo.remark }}
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="custom-info"
             :class="{ 'sex-blue': custom.sex === '1', 'sex-red': custom.sex !== '1', 'float-left': matchStatus && custom.sex === '1', 'float-right': matchStatus && custom.sex !== '1' }">
          <span src="@/assets/custom/custom_title.png"
                class="title-img">
          </span>
          <div class="custom-header">
            <div class="custom-left">
              <div class="custom-name">
                {{ custom.name }}
              </div>
              <span class="custom-sex">{{ custom.sex | dictFilter(sexMap)}}</span>
            </div>
            <div class="custom-important-info">
              <div class="info-item">
                <img src="@/assets/custom/phone.png"
                     class="item-img" />
                <span class="title">手机号码：</span>
                <span class="value">{{ custom.phone }}</span>
              </div>
              <div class="info-item">
                <img src="@/assets/custom/marital_status.png"
                     class="item-img" />
                <span class="title">婚姻状况：</span>
                <span class="value">{{ custom.maritalStatus | dictFilter(maritalStatusMap) }}</span>
              </div>
              <div class="info-item">
                <img src="@/assets/custom/sex.png"
                     class="item-img" />
                <span class="title">年龄：</span>
                <span class="value">{{ custom.birthday | birthdayFilter }}</span>
              </div>
              <div class="info-item">
                <img src="@/assets/custom/education.png"
                     class="item-img" />
                <span class="title">学历：</span>
                <span class="value">{{ custom.education | dictFilter(educationMap) }}</span>
              </div>
              <div class="info-item">
                <img src="@/assets/custom/house_car.png"
                     class="item-img" />
                <span class="title">房车情况：</span>
                <span class="value">{{ custom | houseAndCarFilter }}</span>
              </div>
            </div>
            <img :src="prefix.OPEN_URL_PREFIX + custom.filePath"
                 v-if="!!custom.filePath"
                 class="custom-pic" />
          </div>
          <div class="custom-body">
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/base_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/base_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">基本信息</span>
              </div>
              <div class="custom-body-item-content">
                <a-row>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">性别：</span>
                      <span class="value">{{ custom.sex | dictFilter(sexMap) }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">民族：</span>
                      <span class="value">{{ custom.nation }}<span v-if="custom.nation">族</span></span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">籍贯：</span>
                      <span class="value">{{ custom.nativePlace }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">血型：</span>
                      <span class="value">{{ custom.blood | dictFilter(bloodMap) }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">出生日期：</span>
                      <span class="value">{{ custom.birthday }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/person_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/person_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">个人信息</span>
              </div>
              <div class="custom-body-item-content">
                <a-row>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">工作状态：</span>
                      <span class="value">{{ custom.status | dictFilter(statusMap) }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">职业：</span>
                      <span class="value">{{ custom.job }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">毕业院校：</span>
                      <span class="value">{{ custom.graduationCollage }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">微信号：</span>
                      <span class="value">{{ custom.wechat }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">QQ号：</span>
                      <span class="value">{{ custom.qq }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">邮箱：</span>
                      <span class="value">{{ custom.email }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">工作地址：</span>
                      <span class="value">{{ custom.jobAddr }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">兴趣爱好：</span>
                      <span class="value">{{ custom.hobby }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/hide_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/person_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">隐私信息</span>
              </div>
              <div class="custom-body-item-content">
                <a-row>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">身高：</span>
                      <span class="value">{{ custom.height }}<span v-if="custom.height">CM</span></span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">体重：</span>
                      <span class="value">{{ custom.weight }}<span v-if="custom.weight">KG</span></span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">身份证号：</span>
                      <span class="value">{{ custom.idCard }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">身体状况：</span>
                      <span class="value">{{ custom.physicalCondition }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/assets_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/person_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">资产信息</span>
              </div>
              <div class="custom-body-item-content">
                <a-row>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">收入状况：</span>
                      <span class="value">{{ custom.salary | dictFilter(salaryMap) }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">房产说明：</span>
                      <span class="value">{{ custom.houseDesc }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">车子说明：</span>
                      <span class="value">{{ custom.carDesc }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/family_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/person_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">家庭信息</span>
              </div>
              <div class="custom-body-item-content">
                <a-row>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">家庭住址：</span>
                      <span class="value">{{ custom.homeAddr }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">家庭情况：</span>
                      <span class="value">{{ custom.homeDesc }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">代理人：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.name }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">代理人联系方式：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.phone }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">与代理人关系：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.relation | dictFilter(relationMap) }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">代理人微信：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.wechat }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">代理人QQ：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.qq }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="info-item">
                      <span class="title">代理人邮箱：</span>
                      <span class="value">{{ custom.hunAgent && custom.hunAgent.email }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="custom-body-item">
              <div class="custom-body-item-title">
                <img src="@/assets/custom/remark_info.png"
                     v-if="custom.sex === '1'"
                     class="custom-body-item-title-icon" />
                <img src="@/assets/custom/person_info_red.png"
                     v-else
                     class="custom-body-item-title-icon" />
                <span class="custom-body-item-title-term">备注信息</span>
              </div>
              <div class="custom-body-item-content">
                {{ custom.remark }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <hun-custom-list-modal @ok="selectedCustom"
                           ref="hunCustomListModal"></hun-custom-list-modal>
    <hun-match-maker-list-modal @ok="selectedMatchMaker"
                                ref="hunMatchMakerListModal"></hun-match-maker-list-modal>
  </div>
</template>

<script>
import { getHunCustomList, getHunCustomById, delHunCustom } from '@/api/pts/custom/custom'
import { getHunMatchById, saveHunMatch } from '@/api/pts/match/match'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import prefix from '@/config/prefix'
import { getAge } from '@/utils/util'
import { mapGetters } from 'vuex'
import { mixin } from '@/utils/mixin'
import HunCustomListModal from './modules/HunCustomListModal.vue'
import HunMatchMakerListModal from './modules/HunMatchMakerListModal.vue'

export default {
  name: 'TableList',
  components: {
    HunCustomListModal,
    HunMatchMakerListModal
  },
  data() {
    return {
      matchStatus: false,
      loading: false,
      matchId: '',
      pageType: '',
      prefix,
      remark: '',
      matchResult: '3',
      custom: {},
      customTwo: {},
      matchMaker: {},
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getHunCustomList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('pts:custom:hunCustom:add'),
      editEnabel: checkPermission('pts:custom:hunCustom:edit'),
      removeEnable: checkPermission('pts:custom:hunCustom:remove'),
      detailEnable: checkPermission('pts:custom:hunCustom:detail'),
      educationArray: [],
      statusArray: [],
      maritalStatusArray: [],
      bloodArray: [],
      houseArray: [],
      sexArray: [],
      carArray: [],
      salaryArray: [],
      relationArray: [],
      matchStatusArray: [],
      educationMap: {},
      statusMap: {},
      maritalStatusMap: {},
      bloodMap: {},
      houseMap: {},
      sexMap: {},
      carMap: {},
      relationMap: {},
      salaryMap: {},
      matchStatusMap: {}
    }
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(['scrollInfo', 'backTop', 'backToView'])
  },
  filters: {
    dictFilter(dataIndex, map) {
      if (dataIndex && Object.keys(map).length > 0) {
        return map[dataIndex].text
      } else {
        return dataIndex
      }
    },
    birthdayFilter(birthday) {
      const age = getAge(birthday)
      if (typeof age === 'number' && !isNaN(age)) {
        return age + '岁'
      } else {
        return age
      }
    },
    houseAndCarFilter(custom) {
      let result = ''
      if (custom.house) {
        result = '有房'
      }
      if (custom.car) {
        if (result) {
          result += '、有车'
        } else {
          result = '有车'
        }
      }
      return result
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
  watch: {
    '$route.query.customId'(customId) {
      if (customId) {
        this.getCustomInfo(customId)
      }
    },
    '$route.query.matchId'(matchId) {
      if (matchId) {
        this.getMatchInfo(matchId)
      }
    }
  },
  created() {
    this.init()
    if (this.$route.query.customId) {
      this.getCustomInfo(this.$route.query.customId)
    } else if (this.$route.query.matchId) {
      this.getMatchInfo(this.$route.query.matchId)
    }
  },
  methods: {
    getCustomInfo(customId) {
      this.loading = true // 加载状态
      this.matchStatus = false // 是否配对
      this.remark = '' // 备注
      this.matchResult = '3' // 配对状态
      this.matchMaker = {} // 红娘信息
      this.pageType = 'custom' // 页面类型
      this.customTwo = {} // 配对者2
      getHunCustomById(customId)
        .then(res => {
          this.custom = res
          this.loading = false
        })
        .catch(() => {
          this.$message.error('系统错误，请稍后尝试')
        })
    },
    getMatchInfo(matchId) {
      this.loading = true // 加载状态
      this.matchStatus = true // 是否配对
      this.pageType = 'match' // 页面类型
      getHunMatchById(matchId)
        .then(res => {
          this.matchId = res.id
          this.custom = res.customOne
          this.remark = res.remark // 备注
          this.customTwo = res.customTwo // 配对者2
          this.matchMaker = res.matchMaker // 红娘信息
          this.matchResult = res.matchStatus // 配对状态
          this.loading = false
        })
        .catch(() => {
          this.$message.error('系统错误，请稍后尝试')
        })
    },
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
      getDictArray('hun_custom_salary').then(data => {
        this.salaryArray = data
        const salaryMap = {}
        this.salaryArray.map(d => {
          salaryMap[d.dictValue] = { text: d.dictLabel }
        })
        this.salaryMap = salaryMap
      })
      getDictArray('hun_agent_relation').then(data => {
        this.relationArray = data
        const relationMap = {}
        this.relationArray.map(d => {
          relationMap[d.dictValue] = { text: d.dictLabel }
        })
        this.relationMap = relationMap
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
    handleEdit() {
      if (this.matchId) {
        const param = {
          id: this.matchId,
          matchStatus: this.matchResult, // 配对中
          remark: this.remark,
          mmid: this.matchMaker.id
        }
        saveHunMatch(param)
          .then(res => {
            if (res.code === 0) {
              this.rollback()
              this.$message.success('修改成功')
            } else {
              this.$message.error(res.msg || '修改失败')
            }
          })
          .catch(() => {
            this.$message.error('修改失败,请稍后尝试')
          })
      } else {
        this.$message.error('系统异常，请刷新页面')
      }
    },
    handleOk() {
      if (this.custom.id && this.customTwo.id) {
        let mid = '' // 男id
        let wid = '' // 女id
        if (this.custom.sex === '1') {
          mid = this.custom.id
          wid = this.customTwo.id
        } else {
          mid = this.customTwo.id
          wid = this.custom.id
        }
        const param = {
          id: 0,
          status: '0', // 正常
          matchStatus: this.matchResult, // 配对中
          remark: this.remark,
          mid: mid,
          mmid: this.matchMaker.id,
          wid: wid
        }
        saveHunMatch(param)
          .then(res => {
            if (res.code === 0) {
              this.rollback()
              this.$message.success('配对成功')
            } else {
              this.$message.error(res.msg || '配对失败')
            }
          })
          .catch(() => {
            this.$message.error('配对失败')
          })
      } else {
        this.$message.warning('请选择待配对者')
      }
    },
    handleMatch() {
      if (!this.matchStatus) {
        this.matchStatus = true
      } else {
        this.matchStatus = false
        this.customTwo = {}
      }
    },
    deleteCustomTwo() {
      this.customTwo = {}
    },
    addCustomTwo() {
      const param = { sex: '1' }
      if (this.custom.sex === '1') {
        param.sex = '2'
      }
      this.$refs.hunCustomListModal.handleOpen(param)
    },
    selectedCustom(selectedRowKey, selectedRow) {
      this.customTwo = selectedRow
    },
    selectedMatchMaker(selectedRowKey, selectedRow) {
      this.matchMaker = selectedRow
    },
    rollback() {
      if (this.pageType === 'custom') {
        if (this.multiTab) {
          this.$multiTab.close(this.$route.fullPath)
          this.$multiTab.close('/person/customer')
        }
        this.$router.push({ name: 'customer', query: { refresh: true } })
      } else if (this.pageType === 'match') {
        if (this.multiTab) {
          this.$multiTab.close(this.$route.fullPath)
          this.$multiTab.close('/person/match')
        }
        this.$router.push({ name: 'match', query: { refresh: true } })
      } else {
        if (this.multiTab) {
          this.$multiTab.close(this.$route.fullPath)
        }
        this.$route.go(-1)
      }
    }
  }
}
</script>
<style lang="less">
@import './style/customMatch';
</style>
