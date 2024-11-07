<template>
  <el-dialog
    v-model="target.show"
    :title="'影像'"
    draggable
    :size="'small'"
    @close="closeChangeDialg"
  >
    <div class="content-box">
      <div class="map-box">
        <div id="vue-openlayers2" style="height: 100%; width: 100%"></div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="target.show = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
  
<script setup>
import {
  reactive,
  onMounted,
  getCurrentInstance,
  watch,
  ref,
  nextTick,
} from "vue";
// import Tiff from "tiff.js";
import { MoreFilled } from "@element-plus/icons-vue";
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
const config = proxy.$config;
onMounted(() => {
  // initMap("");
  initMap();
});
const route = useRoute();
const router = useRouter();
const $emit = defineEmits(["changeShow"]);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  row:{
    type: Object,
    default: {},
  },
  title: {
    type: String,
    default: "",
  },
});
let target = reactive({
  show: true,
});
const map = ref("");
const vectorSource = ref(new VectorSource({ wrapX: false }));
const geoLayer = ref(null);
const arcgisLayer = ref(null);
const initMap = () => {
  nextTick(() => {
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
      target: "vue-openlayers2",
      layers:[
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
    init(props.row)
  });
};
const init = (row) => {
  if (geoLayer.value != "") {
    map.value.removeLayer(geoLayer.value);
  }
  console.log(row.visitPath.split("?")[0].split("/geoserver"))
  geoLayer.value = new TileLayer({
    source: new TileWMS({
      // url: "http://192.168.3.99:8777/geoserver/LFQ/wms",
      url: "/geoserver" + row.visitPath.split("?")[0].split("/geoserver")[1],
      params: {
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: true,
        LAYERS: `intelligence:${row.visitPath.split("=")[1]}`,
        STYLES: "",
        TILED: true,
        exceptions: "application/vnd.ogc.se_inimage",
      },
    }),
  });
  geoLayer.value.set("name", "wms");
  console.log(row.note.split(","))
  map.value.addLayer(geoLayer.value);
  map.value.getView().setCenter([row.note.split(",")[0]*1, row.note.split(",")[1]*1]);
  map.value.getView().setZoom(14);
};
const closeChangeDialg = () => {};
watch(
  () => target.show,
  (newVal) => {
    $emit("changeShow",newVal)
  }
);
</script>
<style scoped lang="scss">
.content-box {
  height: 540px;
  position: relative;
  overflow: hidden;
  .map-box {
    width: 100%;
    height: 100%;
  }
}
::v-deep .tooltipCss {
  width: 600px;
}
</style>
<style>
</style>
  
