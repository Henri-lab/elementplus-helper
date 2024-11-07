<template>
    <div>
      <div class="time-line">
        <div class="time-line-box">
          <el-steps direction="vertical" :active="index">
            <el-step
              v-for="(activity, index) in activities"
              :title="DateFormatPipe(activity.fileTime, 'yyyy-MM-dd HH:mm:ss')"
              @click.native="meth_TQZY(activity, index)"
              :key="index"
            />
          </el-steps>
        </div>
        <div class="map-box">
          <div id="vue-openlayers" style="height: 100%; width: 100%"></div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, nextTick } from "vue";
  // import Tiff from "tiff.js";
  import { MoreFilled } from "@element-plus/icons-vue";
  import { getTasklist, coordinate } from  "@/api/fontInterface/mbDetail/index.js"
  import "ol/ol.css";
  import { Map, View } from "ol";
  import Tile from "ol/layer/Tile";
  import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
  import FullScreen from "ol/control/FullScreen";
  import ScaleLine from "ol/control/ScaleLine";
  import TileWMS from "ol/source/TileWMS";
  import LayerVector from "ol/layer/Vector";
  import WebGLTileLayer from "ol/layer/WebGLTile.js";
  import { defaults } from "ol/control";
  import XYZ from "ol/source/XYZ";
  import { Vector as VectorSource } from "ol/source";
  import Circle from "ol/style/Circle";
  import GeoTIFF from "ol/source/GeoTIFF";
  import OSM from "ol/source/OSM";
  import { Stroke, Style, Fill, Text } from "ol/style";
  import { fromLonLat, toLonLat, transform } from "ol/proj";
  const { proxy } = getCurrentInstance();

  const props = defineProps({
    id:{
        type:Number,
        required:true
    }
})

  const config = proxy.$config;
  onMounted(() => {
    // initMap("");
    initMap();
  });
  const route = useRoute();
  const router = useRouter();
  
  const DateFormatPipe = (date, type) => {
    if (date) {
      let year, month, day, HH, mm, ss;
      let time = new Date(date);
      let timeDate;
      year = time.getFullYear(); // 年
      month = time.getMonth() + 1; // 月
      day = time.getDate(); // 日
      HH = time.getHours(); // 时
      mm = time.getMinutes(); // 分
      ss = time.getSeconds(); // 秒
  
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      HH = HH < 10 ? "0" + HH : HH; // 时
      mm = mm < 10 ? "0" + mm : mm; // 分
      ss = ss < 10 ? "0" + ss : ss; // 秒
  
      switch (type) {
        case "yyyy":
          timeDate = String(year);
          break;
        case "yyyy-MM":
          timeDate = year + "-" + month;
          break;
        case "yyyy-MM-dd":
          timeDate = year + "-" + month + "-" + day;
          break;
        case "yyyy/MM/dd":
          timeDate = year + "/" + month + "/" + day;
          break;
        case "yyyy-MM-dd HH:mm:ss":
          timeDate =
            year + "-" + month + "-" + day + " " + HH + ":" + mm + ":" + ss;
          break;
        case "HH:mm:ss":
          timeDate = HH + ":" + mm + ":" + ss;
          break;
        case "MM":
          timeDate = String(month);
          break;
        default:
          timeDate = year + "-" + month + "-" + day;
          break;
      }
      return timeDate;
    } else {
      return "";
    }
  };
  const activities = ref([]);
  const index = ref(0);
  const init = () => {
    let paramss = {
      fileType: 0,
      targetId: props.id,
    };
    getTasklist(paramss).then((res) => {
      if (res.code === 200) {
        if (res.rows.length > 0) {
          activities.value = res.rows;
          onMounted_img(res.rows[0]);
          value1.value = res.rows[0].id;
          targetIdValue.value = res.rows[0].targetId;
        }
      }
    });
  };
  const map = ref("");
  const vectorSource = ref(new VectorSource({ wrapX: false }));
  const geoLayer = ref(null);
  const arcgisLayer = ref(null);
  const initMap = () => {
    nextTick(() => {
      // let raster = new Tile({
      //   source: new OSM(),
      // });
      let vector = new LayerVector({
        source: vectorSource.value,
        // Vector层显示的样式
        style: new Style({
          fill: new Fill({
            color: "#00f",
          }),
          stroke: new Stroke({
            width: 2,
            color: "#ff0",
          }),
          image: new Circle({
            //点样式
            radius: 5,
            fill: new Fill({
              color: "#ff0000",
            }),
          }),
        }),
      });
      map.value = new Map({
        target: "vue-openlayers",
        layers: [
          new VectorLayer({
            zIndex: 9,
            source: vectorSource.value,
            style: new Style({
              stroke: new Stroke({
                width: 2,
                color: "#ff0",
              }),
            }),
          }),
          // raster,
          vector,
        ],
        // 展示tif高清图层
        view: new View({
          center: [112.54004, 23.54726], //alq
          projection: "EPSG:4326",
          zoom: 16,
          maxZoom: 24,
          minZoom: 1,
        }),
        controls: defaults({
          attribution: false, //右下角的地图信息控件
          rotate: false, //指北针控件
          zoom: false, //缩放按钮控件
        }).extend([
          new FullScreen(), //全屏
          new ScaleLine(), //比例尺控件
        ]),
      });
    });
    init();
  };
  
  // 切换 GeoTIFF 图片
  const changeGeoTIFF = (url, centerCoordinates) => {
    if (geoLayer.value != "") {
      map.value.removeLayer(geoLayer.value);
    }
    loadwms(url, centerCoordinates);
  };
  
  const value1 = ref("");
  const targetIdValue = ref("");
  let meth_TQZY = (item, val) => {
    index.value = val;
    console.log(item);
    value1.value = item.id;
    targetIdValue.value = item.targetId;
    console.log(value1.value);
    onMounted_img(item);
  };
  //影像图跳转核查记录
  // let  mapCenter = re();
  // let mapFilePath = ref();
  let goCheck = () => {
    const url = router.resolve({
      path: "/checkRecord",
      query: {
        id: value1.value,
        targetId: props.id,
        mapCenter: mapCenter.value,
        mapFilePath: mapFilePath.value,
      },
    });
    window.open(url.href, "_blank");
  };
  const geoLayer_map = ref("");
  const loadwms = (geoTIFFUrl, centerCoordinates) => {
    console.log( geoTIFFUrl.split("?")[0].split("/")[1],'11111111111')
    // geotiff图层
    // const source = new GeoTIFF({
    //   sources: [
    //     {
    //       url: geoTIFFUrl, //24.6Mb
    //     },
    //   ],
    // });
  
    // geoLayer.value = new WebGLTileLayer({
    //   source: source,
    // });
  
    // map.value.addLayer(geoLayer.value);
    // map.value.getView().setCenter([centerCoordinates[0], centerCoordinates[1]]);
    // map.value.getView().setZoom(18);
    geoLayer.value = new TileLayer({
      source: new TileWMS({
        // url: "http://192.168.3.99:8777/geoserver/LFQ/wms",
        url: "/geoserver" + geoTIFFUrl.split("?")[0].split("/geoserver")[1],
        params: {
          SERVICE: "WMS",
          VERSION: "1.1.1",
          REQUEST: "GetMap",
          FORMAT: "image/png",
          TRANSPARENT: true,
          LAYERS: `intelligence:${geoTIFFUrl.split("=")[1]}`,
          STYLES: "",
          TILED: true,
          exceptions: "application/vnd.ogc.se_inimage",
        },
      }),
    });
    geoLayer.value.set("name", "wms");
    map.value.addLayer(geoLayer.value);
    map.value.getView().setCenter([centerCoordinates[0], centerCoordinates[1]]);
    map.value.getView().setZoom(14);
  };
  const canvas = ref(null);
  let mapCenter = ref();
  let mapFilePath = ref();
  const onMounted_img = (item) => {
    if (item == undefined) return;
    let paramss = {
      fileId: item.id,
    };
    coordinate(paramss).then((res) => {
      if (res.code === 200) {
        let data = [res.data.centerLon, res.data.centerLat];
        mapCenter.value = data;
  
        let filePath = item.visitPath;
        mapFilePath.value = filePath;
        changeGeoTIFF(filePath, data);
      }
    });
  };
  </script>
  <style lang="scss" scoped>
  .demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
  }
  .demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
  }
  .demo-date-picker .block:last-child {
    border-right: none;
  }
  .demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }
  .flex-header {
    // position: absolute;
    top: 40px;
    right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .time-line {
    display: flex;
    margin-top: 50px;
    padding: 0 20px;
    .map-box {
      width: 500px;
      // height: 400px;
      margin-left: 10px;
    }
  }
  .time-line-box {
    width: auto;
    height: 400px;
    position: relative;
    .date-marker {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: black;
      border-radius: 50%;
      position: absolute;
      right: -5px;
    }
  }
  </style>
  