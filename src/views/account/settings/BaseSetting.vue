<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-row :gutter="24" class="row-info">
          <a-col :md="24" :lg="24">
            <span class="left">昵称：</span>
            <span>{{ userInfo.userName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="row-info">
          <a-col :md="24" :lg="24">
            <span class="left">部门：</span>
            <span>{{ userInfo.dept.deptName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="row-info">
          <a-col :md="24" :lg="24">
            <span class="left">角色：</span>
            <span>
              <a-tag v-for="role in roles" :key="role.roleId" color="#108ee9">{{ role.roleName }}</a-tag>
            </span>
          </a-col>
        </a-row>
        <a-row :gutter="24" class="row-info">
          <a-col :md="24" :lg="24">
            <span class="left">描述：</span>
            <span>
              {{ userInfo.remark ||'VENUS PTS' }}
            </span>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <!-- <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>-->
        <div class="account-center-avatarHolder">
          <div class="avatar">
            <img :src="avatar" />
          </div>
          <div class="username">{{ nickname }}</div>
          <!-- <div class="bio">{{userInfo.remark ||'VENUS PTS'}}</div> -->
        </div>
      </a-col>
    </a-row>

    <!-- <avatar-modal ref="modal" @ok="setavatar" /> -->
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { mapGetters } from 'vuex'

export default {
  components: {
    AvatarModal
  },
  data() {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'avatar', 'nickname']),
    roles() {
      return this.userInfo.roles
    }
  },
  mounted() {
    // console.log(this.userInfo)
  },
  methods: {
    setavatar(url) {
      // console.log(url)
      this.option.img = url
    }
  }
}
</script>

<style lang="less" scoped>
.row-info {
  margin-bottom: 20px;
  font-size: 14px;
}
.left {
  margin-right: 10px;
  font-weight: bold;
}
.row-info .ant-tag{
  background: #fff;
}
.account-center-avatarHolder {
  text-align: center;
  margin-bottom: 24px;

  & > .avatar {
    margin: 0 auto;
    width: 180px;
    height: 180px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .username {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
