<!--
 * @Author: XC
 * @Date: 2024-07-11 15:58:40
 * @LastEditors: XC
 * @LastEditTime: 2024-07-20 11:21:43
 * @FilePath: \RuoYi-Vue3-3.8.6\src\views\Frontend\index.vue
 * @Description: 前端显示首页
-->
<template>
  <div class="frontend">
    <!-- 顶部导航 -->
    <div class="menu">
      <!-- 时钟 -->
      <div class="timer">
        <p>{{ info.data }}</p>
        <p>{{ info.timer }} {{ info.week }}</p>
      </div>
      <!-- 左侧 -->
      <div class="menulist lmenulist">
        <ul>
          <li>动态信息生成</li>
          <li>军事事件分析</li>
        </ul>
      </div>
      <!-- 标题 -->
      <p class="logoName"><img src="@/assets/images/系统名.png" alt="" /></p>
      <!-- 右侧 -->
      <div class="menulist Rmenulist">
        <ul>
          <li @click="pathLine">目标详情核查</li>
          <li @click="goManage">后台管理</li>
        </ul>
      </div>
      <!-- 用户 -->
      <el-dropdown>
        <div class="user">
          <img src="@/assets/images/用户.png" alt="" />{{ userName }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onQuit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 主地图 -->
    <div class="boxmap" id="boxmap"></div>
    <!-- 侧边导航-->
    <targetDetail></targetDetail>
    <!-- 鹰眼图 -->
    <mapX v-if="mapShow"></mapX>
  </div>
</template>
<script setup>
import { ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { timerdata } from '@/utils/function'; //时间控制函数
import initCeium from '@/utils/cesiuminit'; //cesium初始化函数
import targetDetail from '../targetDetail/index.vue';
import mapX from './components/mapX/index.vue';
import useUserStore from '@/store/modules/user';
import { useRouter } from 'vue-router';
const router = useRouter();
const userStore = useUserStore();
import { getUserProfile } from '@/api/system/user';

let mapShow = ref(false);
onMounted(() => {
  initCeium.rendererMap('boxmap');

  mapShow.value = true;
  getUser();
});
let userName = ref('');
// 获取登陆人信息
const getUser = () => {
  getUserProfile().then((response) => {
    userName.value = response.data.userName;
  });
};
const goManage = () => {
  const url = router.resolve({
    path: 'system/target',
  });
  console.log(url);
  window.open(url.href, '_blank');
};
const pathLine = (val) => {
  const url = router.resolve({
    path: '/verifyTask',
  });
  window.open(url.href, '_blank');
};
const onQuit = () => {
  console.log('退出登录');
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '/index';
      });
    })
    .catch(() => {});
};

//左上角时间
let info = ref({
  data: '',
  timer: '',
  week: '',
});
setInterval(() => {
  info.value = timerdata();
}, 1000);
//左上角时间end ---
</script>

<style lang="scss" spcoed>
.frontend {
  width: 100%;
  height: 100%;
  .boxmap {
    width: 100%;
    height: 100%;
  }
  .menu {
    width: 100%;
    height: 80px;
    background: url('@/assets/images/topmenu.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    display: flex;
    overflow: hidden;
    .timer {
      width: 9%;
      min-width: 80px;
      height: 80px;
      color: #7597b1;
      text-align: center;
      font-size: 14px;
      overflow: hidden;
      p {
        line-height: 26px;
        white-space: nowrap;
      }
    }
    .menulist {
      // /src/assets/images/菜单左-未选中.png
      width: 20%;
      margin-top: 40px;

      ul {
        display: flex;
        justify-content: space-between;
        color: #fff;

        li {
          background: url('@/assets/images/菜单左-未选中.png') no-repeat;
          background-size: 100% 100%;
          width: 45%;
          height: 45px;
          line-height: 45px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
        }
        li:hover {
          background: url('@/assets/images/菜单左-选中.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .lmenulist {
      margin-left: 4%;
    }
    .Rmenulist {
      margin-left: 1%;
      margin-right: 7%;
    }
    .logoName {
      width: 34%;
      text-align: center;
      img {
        margin-top: 20px;
      }
    }
    .user {
      width: 4%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      margin-left: 4%;
    }
  }
}

::v-deep .el-dropdown {
  display: block;
  line-height: 60px;
  margin-left: 60px;
}
</style>
