/*
 * @Author: XC
 * @Date: 2024-07-12 14:56:23
 * @LastEditors: XC
 * @LastEditTime: 2024-07-20 18:02:06
 * @FilePath: \RuoYi-Vue3-3.8.6\src\utils\cesiuminit.js
 * @Description:
 */
class initCeium {
  constructor(){
    this.wmsLayerArr = []
  }
  rendererMap(dom) {
    window.viewer = this.viewer = new Cesium.Viewer(dom, {
      shouldAnimate: false,
      animation: false, // 是否创建动画小器件，左下角仪表
      vrButton: false, //vr模式
      baseLayerPicker: false, // 是否显示图层选择器
      //   imageryProviderViewModels:imageryViewModels,
      // selectedImageryProviderViewModel:tianditujd,
      fullscreenButton: false, // 是否显示全屏按钮
      geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
      homeButton: false, // 是否显示Home按钮
      infoBox: false, // 是否显示信息框
      sceneModePicker: false, // 是否显示3D/2D选择器
      selectionIndicator: false, // 是否显示选取指示器组件
      timeline: false, // 是否显示时间轴
      // navigationHelpButton: new Cesium.NavigationHelpButton({
      //     container : 'navigationHelpButtonContainer'
      // }), // 是否显示右上角的帮助按钮
      navigationHelpButton: false, //帮助按钮
      scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
      sceneMode: Cesium.SceneMode.SCENE3D, //3/2D展示
      clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
      selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
      // imageryProviderViewModels:
      // Cesium.createDefaultImageryProviderViewModels(), // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
      selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
      // skyAtmosphere:true,//地球光芒设置
      terrainExaggeration: 1.0,
      clampToGround: true,
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true, //设置canvas截图使用，不设置截屏图片黑色
        },
      },

      useBrowserRecommendedResolution: true, //那浏览器建议分辨路渲染
      selectionIndicator: false,
      fullscreenElement: document.body, // 全屏时渲染的HTML元素,
      useDefaultRenderLoop: true, // 如果需要控制渲染循环，则设为true
      targetFrameRate: undefined, // 使用默认render loop时的帧率
      showRenderLoopErrors: true, // 如果设为true，将在一个HTML面板中显示错误信息
    });
    // 加载动画
    this.viewer.camera.setView({
      // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
      // fromDegrees()方法，将经纬度和高程转换为世界坐标
      destination: Cesium.Cartesian3.fromDegrees(107.48, 39.67, 25000000.0),
      orientation: {
        // 指向
        heading: Cesium.Math.toRadians(0, 0),
        // 视角
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0,
      },
    });

    this.viewer.scene.globe.depthTestAgainstTerrain = false; //开启地形深度检测 解决鼠标指针和点不重合
    this.viewer._cesiumWidget._creditContainer.style.display = "none"; //去除cesium广告
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    this.viewer.scene.skyBox.show = false; //去掉天空盒子
    // this.viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#1e3352')

    this.viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0); //修改地邱球体背景透明
    this.XYZMap();
  }
  XYZMap() {
    this.viewer.imageryLayers.removeAll();
    console.log(window.mapUrl,'window.mapUrl ');
    this.viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: window.mapUrl,
        // 修改图片地址
      })
    );
  }
  setGeo(row) {
    let url = `/geoserver/${row[0].imagePath
      .split("?")[0]
      .replace("/geoserver", "")}`;

    let layers = row[0].imagePath.split("=")[1];
    let imageryProvider = new Cesium.WebMapServiceImageryProvider({
      url: url,
      layers: `intelligence:${layers}`,
      parameters: {
        service: "WMS",
        format: "image/png",
        transparent: true,
      },
    });
    let wmsLayer = new Cesium.ImageryLayer(imageryProvider);
    this.wmsLayerArr.push({layer:wmsLayer,id:row[0].id})
    this.viewer.imageryLayers.add(wmsLayer);
    // timeLayerMap[index] = wmsLayer;
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        row[0].centerLon,
        row[0].centerLat,
        8000.0
      ),
    });
  }
  // 单个影像显示隐藏
  showLayer(id,show){
    this.wmsLayerArr.map(item=>{
      if(id == item.id){
        item.layer.show = show
      }
      // this.viewer.imageryLayers.add(item.layer);
    })
  }
  // 删除加载的影像
  delLayer(){
    this.wmsLayerArr.map(item=>{
      this.viewer.imageryLayers.remove(item.layer);
    })
  }
  
}
export default new initCeium();
