<!--
 * @Author: XC
 * @Date: 2024-07-16 13:44:35
 * @LastEditors: XC
 * @LastEditTime: 2024-07-20 14:45:41
 * @FilePath: \RuoYi-Vue3-3.8.6\src\views\Frontend\verifyTask\index.vue
 * @Description: 目标详情核查
-->
<!--
 * @Author: XC
 * @Date: 2024-07-16 13:44:35
 * @LastEditors: XC
 * @LastEditTime: 2024-07-17 14:15:17
 * @FilePath: \RuoYi-Vue3-3.8.6\src\views\Frontend\verifyTask\index.vue
 * @Description: 
-->
<template>
  <div class="verifyTask">
    <div class="menu">
      <div class="timer">
        <p>{{ info.data }}</p>
        <p>{{ info.timer }} {{ info.week }}</p>
      </div>
      <div class="menulist lmenulist">
        <ul>
          <li @click="pathLine(2)">核查记录</li>
          <li @click="pathLine(1)">核查任务管理</li>
        </ul>
      </div>
      <p class="logoName"><img src="@/assets/images/系统名.png" alt="" /></p>

      <el-dropdown class="userDiv">
        <div class="user"><img src="@/assets/images/用户.png" alt="">{{userName}}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onQuit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <div class="user"><img src="@/assets/images/用户.png" alt="" />admin</div> -->
    </div>
    <div class="menulist lmenulist">
      <ul>
        <li @click="pathLine(2)">核查记录</li>
        <li @click="pathLine(1)">核查任务管理</li>
      </ul>
    </div>
    <record v-if="!show" />
    <management v-if="show" />
    <div class="footer"></div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { timerdata } from "@/utils/function";
import record from '@/components/record/index.vue'
import management from "@/components/management/index.vue"
import useUserStore from '@/store/modules/user'
import { getUserProfile } from "@/api/system/user"

const userStore = useUserStore()
let info = ref({
  data: "",
  timer: "",
  week: "",
});
onMounted(()=>{
  getUser()
})
let userName = ref('')
// 获取登陆人信息
const getUser = () => {
  getUserProfile().then(response => {
    userName.value = response.data.userName
  })
}
const onQuit = ()=>{
  console.log('退出登录')
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });

}

setInterval(() => {
  info.value = timerdata();
}, 1000);
// 切换
let show = ref(false)
const pathLine = (val)=>{
    if(val == 1){
        show.value = true
    }else {
        show.value = false
    }
}
</script>

<style lang="scss">
.verifyTask {
  position: fixed;
  // margin-top: -42px;
      .menulist {
          // /src/assets/images/菜单左-未选中.png
          width: 15%;
          // margin-top: 40px;
              position: fixed;
                top: 10px;
                left: 10%;
          position: fixed;
            z-index: 1;
          ul {
            display: flex;
            justify-content: space-between;
            color: #fff;
      
            li {
              background: url("@/assets/images/菜单左-未选中.png") no-repeat;
              background-size: 100% 100%;
              width: 45%;
              height: 35px;
              line-height: 35px;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              cursor: pointer;
            }
      
            li:hover {
              background: url("@/assets/images/菜单左-选中.png") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      
        .lmenulist {
          margin-left: 4%;
        }
  width: 100%;
  height: 100%;
  background: url("@/assets/images/bg.png") no-repeat;
  background-size: 100% 100%;
  .menu {
    width: 100%;
    height: 80px;
    background: url("@/assets/images/topmenu.png") no-repeat;
    background-size: 100% 100%;

    z-index: 9;
    display: flex;
    overflow: hidden;
    display: none;
    .timer {
      width: 9%;
      min-width: 80px;
      height: 80px;
      color: #7597b1;
      text-align: center;
      font-size: 14px;
      overflow: hidden;
      p {
        line-height: 28px;
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
          background: url("@/assets/images/菜单左-未选中.png") no-repeat;
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
          background: url("@/assets/images/菜单左-选中.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .lmenulist {
      margin-left: 4%;
    }

    .logoName {
      width: 34%;
      text-align: center;
      img {
        margin-top: 20px;
      }
    }
    


      .userDiv {
        width: 4%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        margin-left: 26%;
        .user{
          display: flex;
        align-items: center;
        justify-content: space-between;
        }
      }
    
    
  }

  .footer {
    background: url("@/assets/images/底部.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
  }
}
</style>