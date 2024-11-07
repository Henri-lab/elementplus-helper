<template>
  <div>
    <!-- 左侧切换按钮 -->
    <ul class="leftBtnGroup" @click="toggleDrawer">
      <li v-for="item in leftBtnGroup" :key="item.id">
        <img :src="item.isShow ? item.urlGL : item.url" :title="item.name" />
      </li>
    </ul>
    <!-- 目标树 -->
    <pushPullDiv :modelValue="isDrawOpen" :title="'目标列表'">
      <div class="searchDiv">
        <el-input
          class="searchInp"
          placeholder="请输入关键字"
          v-model="targetDetailInp"
          clearable
        ></el-input>
        <span class="searchBtn" @click="onSearch"></span>
      </div>

      <el-scrollbar height="calc(100% - 35px)">
        <div class="mytree">
          <div class="mytreeContainer">
            <el-tree
              highlight-current
              :data="treeData"
              :props="defaultProps"
              :disable-branch-nodes="true"
              @node-click="handleNodeClick"
              ref="treeForm"
              :filter-node-method="filterNode"
            ></el-tree>
          </div>
        </div>
      </el-scrollbar>
    </pushPullDiv>

    <!-- 目标详情弹窗 -->
    <mbDetail
      v-if="turnCom.detailShow"
      :id="targetId"
      @onDetailClose="onDetailClose"
    ></mbDetail>

    <!--装备部署情况  -->
    <weaponArrange
      v-if="turnCom.weaponShow"
      :id="targetId"
      @onWeaponClose="onWeaponClose"
    ></weaponArrange>

    <!-- 发展变化图 -->
    <develop
      v-if="turnCom.changeMap"
      :id="targetId"
      @onDevelopClose="onDevelopClose"
    ></develop>

    <!-- 历史变化 -->
    <historyChange
      v-if="turnCom.historyChange"
      :id="targetId"
      @onHistoryClose="onHistoryClose"
    ></historyChange>

    <!-- 转盘 -->
    <div id="stateShow">
      <turnTable ref="ChildsDom" @getOpenShow="getOpenShow"></turnTable>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import {
  getMbTree,
  getFacilityPoint,
} from "@/api/fontInterface/mbDetail/index.js";
import pushPullDiv from "./components/pushPullComponent/index.vue";
import mbDetail from "./components/mbDetailComponent/index.vue";
import weaponArrange from "./components/weaponArrangeComponent/index.vue";
import develop from "./components/developComponent/index.vue";
import historyChange from "./components/historyChangeComponent/index.vue";
import turnTable from "./components/turnTableComponent/index.vue";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();

const targetId = ref(null); //当前点击的目标id
const turnCom = ref({
  detailShow: false, //目标详情
  weaponShow: false, //装备部署情况
  changeMap: false, //发展变化图
  aboutEvent: false, //相关事件
  targetStatus: false, //目标动态
  historyChange: false, //历史变化
});

//控制左侧树结构的btnGroup
const leftBtnGroup = [
  {
    name: "目标",
    url: new URL(`@/assets/images/check/target.png`, import.meta.url).href,
    urlGL: new URL(`@/assets/images/check/targetGL.png`, import.meta.url).href,
    isShow: false,
    id: 1,
  },
  {
    name: "事件信息",
    url: new URL(`@/assets/images/check/eventInfo.png`, import.meta.url).href,
    urlGL: new URL(`@/assets/images/check/eventInfoGL.png`, import.meta.url)
      .href,
    isShow: false,
    id: 2,
  },
  {
    name: "动态新闻",
    url: new URL(`@/assets/images/check/new.png`, import.meta.url).href,
    urlGL: new URL(`@/assets/images/check/newGL.png`, import.meta.url).href,
    isShow: false,
    id: 3,
  },
];
//控制左侧弹窗
const isDrawOpen = ref(false);
//切换点击高亮的图片和弹窗显隐
const toggleDrawer = (e) => {
  switch (e.target.title) {
    case "目标":
      leftBtnGroup[0].isShow = !leftBtnGroup[0].isShow;
      isDrawOpen.value = !isDrawOpen.value;
      break;
    // case "事件信息":
    //     leftBtnGroup[1].isShow = !leftBtnGroup[1].isShow;
    //   break;
    // case "动态新闻":
    //     leftBtnGroup[2].isShow = !leftBtnGroup[2].isShow;
    //   break;
  }
};
/**
 * 树结构
 *
 *
 */
const treeData = ref([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const targetDetailInp = ref("");
//树结构接口调用-赋值
const getTreeData = () => {
  getMbTree().then((res) => {
    if (res.code === 200) {
      treeData.value = res.data;
      loadAllEntity();
    }
  });
};
//树节点点击事件
const handleNodeClick = (e) => {
  if (e.attributes.lon !== undefined) {
    window.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        e.attributes.lon,
        e.attributes.lat,
        1500.0
      ),
    });
  }
};
//目录树检索功能
const filterNode = (value, data, node) => {
  if (!value) return true;
  let parentNode = node.parent;
  let labels = [node.label];
  let level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some((label) => label&& label.indexOf(value) !== -1);
};
//递归遍历 获取树结构里面有经纬度的节点
const getLeafLatLng = (data) => {
  let result = [];
  function traverse(node) {
    // 如果节点没有 children 或者 children 为空，说明是最后一级
    if (!node.children || node.children.length === 0) {
      // 检查 attributes 中是否有 lon 和 lat
      if (
        node.attributes &&
        node.attributes.lon !== undefined &&
        node.attributes.lat !== undefined
      ) {
        result.push({
          lon: node.attributes.lon,
          lat: node.attributes.lat,
          id: node.attributes.target_id,
          name: node.name,
        });
      }
    } else {
      // 递归遍历每一个子节点
      node.children.forEach((child) => traverse(child));
    }
  }
  // 遍历顶级节点
  data.forEach((node) => traverse(node));
  return result;
};
//递归遍历 获取树结构里面有经纬度的节点  -----end

//在球上加载所有的点位
const loadAllEntity = () => {
  const AllPoint = getLeafLatLng(treeData.value);
  AllPoint.forEach((item) => {
    let point = window.viewer.entities.add({
      name: "点",
      id: item.id,
      description: item.name,
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat),
      point: {
        color: Cesium.Color.SKYBLUE,
        pixelSize: 5,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 1,
      },
      data: {
        id: item.id,
        name: item.name,
      },
    });
  });
};
const treeForm = ref ()
//搜索按钮
const onSearch = () => {
  // console.log(proxy.$refs.treeForm.filter(targetDetailInp.value),'proxy.$refs.treeForm');
  proxy.$refs.treeForm.filter(targetDetailInp.value);
};
let cartesian; // 射线与地球表面之间的交点
let updatePosition = () => {
  // 将WGS84坐标中的位置转换为窗口坐标
  let windowPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    window.viewer.scene,
    cartesian
  );
  // 数值是样式中定义的宽高
  if (windowPosition == undefined) return;

  document.getElementById("stateShow").style.left =
    windowPosition.x - 240 / 2 + "px";
  document.getElementById("stateShow").style.top =
    windowPosition.y - 120 + "px";
};

//控制转盘上面的组件显示隐藏
const getOpenShow = (e) => {
  switch (e) {
    case "目标详情":
      turnCom.value.detailShow = true;
      turnCom.value.weaponShow = false;
      turnCom.value.aboutEvent = false;
      turnCom.value.changeMap = false;
      turnCom.value.targetStatus = false;
      turnCom.value.historyChange = false;
      break;
    case "装备部署情况":
      turnCom.value.weaponShow = true;
      turnCom.value.detailShow = false;
      turnCom.value.aboutEvent = false;
      turnCom.value.changeMap = false;
      turnCom.value.targetStatus = false;
      turnCom.value.historyChange = false;
      break;
    case "相关事件":
      turnCom.value.aboutEvent = true;
      ElMessage({
        message: "模块暂未开发",
      });
      break;
    case "发展变化图":
      turnCom.value.changeMap = true;
      turnCom.value.detailShow = false;
      turnCom.value.weaponShow = false;
      turnCom.value.aboutEvent = false;
      turnCom.value.targetStatus = false;
      turnCom.value.historyChange = false;
      break;
    case "目标动态":
      turnCom.value.targetStatus = true;
      ElMessage({
        message: "模块暂未开发",
      });
      break;
    case "历史变化":
      turnCom.value.historyChange = true;
      turnCom.value.detailShow = false;
      turnCom.value.weaponShow = false;
      turnCom.value.aboutEvent = false;
      turnCom.value.changeMap = false;
      turnCom.value.targetStatus = false;
      break;
  }
};
//目标详情
const onDetailClose = () => {
  turnCom.value.detailShow = false;
};
//装备部署情况
const onWeaponClose = () => {
  turnCom.value.weaponShow = false;
};
//历史变化
const onHistoryClose = () => {
  turnCom.value.historyChange = false;
};
//发展变化图
const onDevelopClose = () => {
  turnCom.value.changeMap = false;
};
let facilityPointArr = [];
//获取所有设施的点位
const getAllFacility = async () => {
  let result = await getFacilityPoint();
  if (result.code === 200 && result.data.length) {
    facilityPointArr = [];
    result.data.forEach((item) => {
      let point = window.viewer.entities.add({
        name: "点几何对象",
        id: `${item.labelInfoId}-${new Date()}`,
        description: item.name,
        position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat),
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
          show: false,
        },
        label: {
          text: item.content,
          font: "12px sans-serif",
          fillColor: Cesium.Color.YELLOW,
          outlineColor: Cesium.Color.BLACK,
          showBackground: true,
          pixelOffset: new Cesium.Cartesian2(30, 5),
          show: false,
        },
      });
      facilityPointArr.push(point);
    });
    // console.log(facilityPointArr);
  }
};

//监听场景的渲染事件
// const postRenders = ()=>{
//   window.viewer.clock.onTick.addEventListener(function(){
//     //获取相机的位置和方向
//     const cameraPosition = window.viewer.camera.position;
//     const cameraDirction = window.viewer.camera.direction;

//     //假设球体的位置为原点
//     const sphereCenter = Cesium.Cartesian3.ZERO;

//     //计算相机到球心的向量
//     const toSphereCenter = Cesium.Cartesian3.subtract(sphereCenter,cameraPosition,new Cesium.Cartesian3());

//     //计算相机的视线方向与球心到相机位置向量的点积
//     const dotProduct = Cesium.Cartesian3.dot(cameraDirction,toSphereCenter);

//     console.log(dotProduct,'123123123123123123')

//     //如果点积小于0,表示相机背对球体
//     if(dotProduct<0){
//       document.getElementById("stateShow").style.display = "none";
//     }else{
//       document.getElementById("stateShow").style.display = "block";
//     }

//   })
// }

onMounted(() => {
  //初始化调用树结构接口
  getTreeData();
  getAllFacility();

  setTimeout(() => {
    // postRenders();
    let handler = new Cesium.ScreenSpaceEventHandler(
      window.viewer.scene.canvas
    );
    handler.setInputAction(function (event) {
      let pick = window.viewer.scene.pick(event.position);
      if (pick && pick.id.id) {
        if (pick.id.name === "点") {
          targetId.value = pick.id.id;
          //每次点击目标点位的时候 关闭所有的弹窗
          turnCom.value.detailShow = false;
          turnCom.value.weaponShow = false;
          turnCom.value.aboutEvent = false;
          turnCom.value.changeMap = false;
          turnCom.value.targetStatus = false;
          turnCom.value.historyChange = false;
          document.getElementById("stateShow").style.display = "block";
          let ray = window.viewer.camera.getPickRay(event.position);
          cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
          // 实时更新位置
          updatePosition();
          window.viewer.scene.postRender.addEventListener(updatePosition);
        }
      } else {
        document.getElementById("stateShow").style.display = "none";
        // 移除事件监听
        window.viewer.scene.postRender.removeEventListener(updatePosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (event) {
      const height = window.viewer.camera.positionCartographic.height;

      // if(height<200000){
      //   document.getElementById("stateShow").style.display = "block";
      // }else{
      //   document.getElementById("stateShow").style.display = "none";
      // }

      if (height < 100000) {
        facilityPointArr.forEach((item) => {
          item.point.show._value = true;
          item.label.show._value = true;
        });
      } else {
        facilityPointArr.forEach((item) => {
          item.point.show._value = false;
          item.label.show._value = false;
        });
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }, 1000);
});
</script>
<style lang="scss" scoped>
@import "@/assets/styles/tree.scss";
@import "./index.scss";

// input框
::v-deep .el-input__wrapper {
  background: #022544 !important;
  border: 1px solid #0d4876;
  box-shadow: none;
}
</style>
