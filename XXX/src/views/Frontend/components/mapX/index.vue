<template>
  <div class="mapx-main">
    <div id="cesiumContainer1" ref="cesiumContainer1"></div>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
const Cesium = window.Cesium;
const viewer = window.viewer; //主地图-三维场景
let viewer1; //鹰眼地图-三维场景
let curRectangle = undefined;
onMounted(() => {
  viewer1 = window.viewer1 = new Cesium.Viewer('cesiumContainer1', {
    imageryProvider: new Cesium.UrlTemplateImageryProvider({
      url: '/tiles/{z}/{x}/{y}.jpg',
    }),
    sceneMode: Cesium.SceneMode.SCENE2D,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    //关闭点选出现的提示框
    selectionIndicator: false,
    infoBox: false,
  });
  viewer1._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权
  initLint();
  bindEvent();
});
const initLint = () => {
  // viewer1.entities.add({
  //   name: "mapX rectangle",
  //   rectangle: {
  //     coordinates: new Cesium.CallbackProperty(function () {
  //       return (
  //         curRectangle || new Cesium.Rectangle.fromDegrees(0.0, 0.0, 0.01, 0.01)
  //       );
  //     }, true),
  //     material: Cesium.Color.RED.withAlpha(0.01),
  //     outline: true,
  //     outlineColor: Cesium.Color.RED,
  //     outlineWidth: 5,
  //     height: 1,
  //   },
  // });
  // 引起事件监听的相机变化幅度
  viewer.camera.percentageChanged = 0.02;
  viewer1.camera.percentageChanged = 0.5;

  lockCamera(viewer1.scene.screenSpaceCameraController); //鹰眼图锁定事件
  viewer.camera.changed.addEventListener(syncViewer, this); // 鹰眼与主图同步
  viewer.scene.preRender.addEventListener(syncViewer, this); // 保证第一次刷新渲染时联动
};
/**
 * 禁用鹰眼地图鼠标事件
 * @param control
 */
const lockCamera = (control) => {
  // 旋转
  control.enableRotate = false;
  // 移动
  control.enableTranslate = false;
  // 放大
  control.enableZoom = false;
  // 倾斜
  control.enableTilt = false;
  // 看向
  control.enableLook = false;

  // 设置最小和最大缩放距离(3D模式下) ~ZoomDistance@hf
  // control.minimumZoomDistance = 1800000; // 最小高度，单位为米
  // control.maximumZoomDistance = 10000; // 最大高度，单位为米
};



// <@hf定义主视图和鹰眼图的缩放比例
const ratio1 = 1;
const ratio2 = 200;
const initH = 40000000;//鹰眼图初始高度
const syncViewer = () => {
  curRectangle = viewer.camera.computeViewRectangle();
  // if (!curRectangle) return; // 确保syncViewer成功

  const _x = Math.abs(curRectangle.east - curRectangle.west);
  const _y = Math.abs(curRectangle.north - curRectangle.south);
  const _d = Math.abs(_x - _y);

  // 限制矩形范围以控制鹰眼地图缩放（2D模式下加入）
  if (true) {
    const west = Math.max(curRectangle.west - _d, Cesium.Math.toRadians(-180));
    const east = Math.min(curRectangle.east + _d, Cesium.Math.toRadians(180));
    const south = Math.max(curRectangle.south, Cesium.Math.toRadians(-90));
    const north = Math.min(curRectangle.north, Cesium.Math.toRadians(90));
    viewer1.camera.setView({
      destination: new Cesium.Rectangle(west, south, east, north),
    });
  }

  // 控制鹰眼缩放 - 1 bug
  // const mainZoomHeight = viewer.camera.positionCartographic.height;
  // const viewer1ZoomHeight *=  ratio1;
  // viewer1.camera.positionCartographic.height = viewer1ZoomHeight;

  const viewer1Pos = viewer1.camera.positionCartographic.clone();
  viewer1Pos.height *= ratio2;
  viewer1Pos.height = Math.min(viewer1Pos.height, initH)
  viewer1.camera.setView({
    destination: Cesium.Cartesian3.fromRadians(viewer1Pos.longitude, viewer1Pos.latitude, viewer1Pos.height),
    orientation: { // 继承主视图的视角
      heading: viewer.camera.heading,
      pitch: viewer.camera.pitch,
      roll: viewer.camera.roll,
    },
  });
  // console.log(viewer1Pos.height, 'viewer1-height')



  // console.log('syncViewer,this done')
};
// @hf>


onBeforeUnmount(() => {
  viewer.camera.percentageChanged = 0.5;
  viewer.camera.changed.removeEventListener(syncViewer, this); // 取消鹰眼与主图同步
  viewer.scene.preRender.removeEventListener(syncViewer, this); // 取消第一次刷新渲染时联动
  viewer1.destroy();
});


//< @hf 点击鹰眼图 改变地图模式
const cesiumContainer1 = ref(null);
function bindEvent() {
  cesiumContainer1.value.addEventListener('click', () => {
    const targetMode =
      viewer1.scene.mode === Cesium.SceneMode.SCENE2D ? '3D' : '2D';
    changeSceneMode(viewer1, targetMode);
  });
}
function changeSceneMode(viewer, mode) {
  if (mode === '3D') {
    viewer.scene.mode = Cesium.SceneMode.SCENE3D;
  } else if (mode === '2D') {
    viewer.scene.mode = Cesium.SceneMode.SCENE2D;
  } else if (mode === 'ColumbusView') {
    viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
  } else {
    console.error('Invalid scene mode');
  }
}
//  @hf>
</script>
<style lang="scss" scoped>
.mapx-main {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 180px;
  height: 120px;
  z-index: 10;
  border: 1px solid #183049;

  #cesiumContainer1 {
    width: 100%;
    height: 100%;
    border: 1px solid rgb(56, 56, 56);
    border-radius: 5px;
  }
}
</style>
