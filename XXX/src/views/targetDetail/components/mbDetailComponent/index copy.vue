<template>
    <div class="mbDetail">
        <div class="mbDetailContainer">
            <div class="header"><i class="close" @click="onDetailClose"></i>
            </div>
            <div class="main" v-if="detailsFrom!==null">
                <!-- 基本信息 -->
                <p class="contentTitle">
                    <span>基本信息</span>
                </p>
                <ul class="InfoUl">
                    <li>
                        <span>目标名称:</span>
                        <span>{{detailsFrom.targetName ? detailsFrom.targetName : "暂无数据"}}</span>
                    </li>
                    <li>
                        <span>目标类别:</span>
                        <span>{{detailsFrom.targetType ? detailsFrom.targetType : "暂无数据"}}</span>
                    </li>
                    <li>
                        <span> 海拔高:</span>
                        <span>{{detailsFrom.highAltitude ? detailsFrom.highAltitude : "暂无数据"}}米</span>
                    </li>
                    <li>
                        <span>国家地区:</span>
                        <span>{{ detailsFrom.country ? detailsFrom.country : "暂无数据" }}</span>
                    </li>
                    <li>
                        <span :title="detailsFrom.lat">目标中心纬度: </span>
                        <span>{{ detailsFrom.centerLat ? detailsFrom.lat : "暂无数据" }}</span>
                    </li>
                    <li>
                        <span :title="detailsFrom.lon">目标中心经度:</span>
                        <span>{{ detailsFrom.centerLon ? detailsFrom.lon : "暂无数据" }}</span>
                    </li>
                </ul>
                <!-- 要素信息 -->
                <p class="contentTitle">
                    <span>要素信息</span>
                </p>
                <div class="demo-collapse">
                    <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="地位作用" name="1">
                    <div>
                    {{ detailsFrom.positionFunction?detailsFrom.positionFunction:'暂无数据' }}
                    </div>
                </el-collapse-item>
                <el-collapse-item title="地理位置" name="2">
                    <div>
                    {{ detailsFrom.positionGeographic?detailsFrom.positionGeographic:'暂无数据' }}
                    </div>
                </el-collapse-item>
                <el-collapse-item title="主要设施" name="3">
                    <div>
                    {{ detailsFrom.positionFunction? detailsFrom.positionFunction:'暂无数据' }}
                    </div>
                </el-collapse-item>
                </el-collapse>
                </div>
                <!-- 相关图片 -->
                <div class="contentTitle picTitle" v-if="detailsInfo.pic.length">
                    <span>相关图片</span>
                    <!-- <span>上传</span> -->
                    <div @click="uploadClicks(1)">
                        <el-upload
                            class="upload-demo"
                            multiple
                            :limit="10"
                            :show-file-list="false"
                            accept=".png,.jpg,.jpeg"
                            :on-change="changeFile"
                            :auto-upload="false"
                            :data="uploadForm.data"
                            :on-success="submitUpload"
                        >
                            <el-button type="primary">
                            <el-icon class="el-icon--left">
                                <Upload />
                            </el-icon>
                            上传
                            </el-button>
                        </el-upload>
                    </div>
                    
                </div>
                <div class="allPurpose" v-if="detailsInfo.pic.length">
                    <ul class="pruposeList">
                        <li v-for="(item,index) in detailsInfo.pic" :key="index">
                            <el-image
                                :src="'/dev-api'+ item.filePath"
                                :preview-src-list="detailsInfo.srcList"
                            >
                        </el-image>
                            <div class="picContent">
                                <span>{{item.fileTime}}</span>
                                <span>{{item.fileSize}}</span>
                            </div>
                            <span class="picName">{{item.fileName}}</span>
                            
                        </li>
                    </ul>
                    <div class="Pagination">
                        <div class="demonstration">共 {{detailsInfo.picPagination.picTotal }} 条</div>
                        <el-pagination
                            v-model:current-page="detailsInfo.picPagination.picPageNum"
                            small
                            background
                            :pager-count="5"
                            layout="prev, pager, next"
                            :total="detailsInfo.picPagination.picTotal"
                            :page-count="Math.ceil(detailsInfo.picPagination.picTotal/params.pageSize)"
                            @current-change="handleCurrentChangePic"
                            class="mt-4"
                        />
                    </div>
                </div>
                <!-- 相关视频 -->
                <div class="contentTitle picTitle" v-if="detailsInfo.video.length">
                    <span>相关视频</span>
                    <div @click="uploadClicks(2)">
                        <el-upload
                            class="upload-demo"
                            multiple
                            :limit="10"
                            accept=".mp4"
                            :show-file-list="false"
                            :on-change="changeFile"
                            :auto-upload="false"
                            :data="uploadForm.data"
                            :on-success="submitUpload"
                        >
                            <el-button type="primary">
                            <el-icon class="el-icon--left">
                                <Upload />
                            </el-icon>
                            上传
                            </el-button>
                        </el-upload>
                    </div>                 
                </div>
                <div class="allPurpose" v-if="detailsInfo.video.length">
                    <ul class="pruposeList">
                        <li v-for="(item,index) in detailsInfo.video" :key="index">
                            <video controls style="width: 90%; height: 100%">
                                <source :src="'/dev-api' + item.filePath" type="video/mp4" />
                                <source
                                :src="'/dev-api' + item.filePath"
                                type="video/webm"
                                />
                                <p>
                                你的浏览器不支持 HTML5 视频。这里有一个<a
                                    :href="'/dev-api' + item.filePath"
                                    :download="'/dev-api' + item.filePath"
                                    >视频</a
                                >链接。
                                </p>
                            </video>
                        </li>
                    </ul>
                    <div class="Pagination">
                        <div class="demonstration">共 {{detailsInfo.videoPagination.videoTotal }} 条</div>
                        <el-pagination
                            v-model:current-page="detailsInfo.videoPagination.videoPageNum"
                            small
                            background
                            :pager-count="5"
                            layout="prev, pager, next"
                            :total="detailsInfo.videoPagination.videoTotal"
                            :page-count="Math.ceil(detailsInfo.videoPagination.videoTotal/params.pageSize)"
                            @current-change="handleCurrentChangeVideo"
                            class="mt-4"
                        />
                    </div>
                </div>
                <!-- 相关文档 -->
                <div class="contentTitle picTitle" v-if="detailsInfo.doc.length">
                    <span>相关文档</span>
                    <div @click="uploadClicks(3)">
                        <el-upload
                            class="upload-demo"
                            multiple
                            :show-file-list="false"
                            :limit="10"
                            accept=".pdf,.docx.doc"
                            :on-change="changeFile"
                            :auto-upload="false"
                            :data="uploadForm.data"
                            :on-success="submitUpload"
                        >
                            <el-button type="primary">
                            <el-icon class="el-icon--left">
                                <Upload />
                            </el-icon>
                            上传
                            </el-button>
                        </el-upload>
                    </div>                            
                </div>
                <div class="allPurpose" v-if="detailsInfo.doc.length">
                    <ul class="docList">
                        <li v-for="(item,index) in detailsInfo.doc" :key="index">
                            <img src="../../../../assets/images/pdf.png" alt="">
                            <div @click="onOpenDoc(item)">
                                <span class="name" :title="item.fileName">{{item.fileName}}</span>
                                <p>
                                    <span>{{item.fileTime}}</span>  
                                    <span>{{item.fileSize}}</span> 
                                </p>
                            </div>
                            <span class="identifyBtn">识别</span>
                        </li>
                    </ul>
                    <div class="Pagination">
                        <div class="demonstration">共 {{detailsInfo.docPagination.docTotal }} 条</div>
                        <el-pagination
                            v-model:current-page="detailsInfo.docPagination.docPageNum"
                            small
                            :pager-count="5"
                            background
                            layout="prev, pager, next"
                            :total="detailsInfo.docPagination.docTotal"
                            :page-count="Math.ceil(detailsInfo.docPagination.docTotal/params.pageSize)"
                            @current-change="handleCurrentChangeDoc"
                            class="mt-4"
                        />
                    </div>
                </div>
                <!-- 相关信号 -->
                <div class="contentTitle picTitle" v-if="detailsInfo.signal.length">
                    <span>信号数据</span>
                    <div @click="uploadClicks(4)">
                        <el-upload
                            class="upload-demo"
                            multiple
                            :limit="10"
                            accept=".xlsx"
                            :show-file-list="false"
                            :on-change="changeFile"
                            :auto-upload="false"
                            :data="uploadForm.data"
                            :on-success="submitUpload"
                        >
                            <el-button type="primary">
                            <el-icon class="el-icon--left">
                                <Upload />
                            </el-icon>
                            上传
                            </el-button>
                        </el-upload>
                    </div>                              
                </div>
                <div class="allPurpose" v-if="detailsInfo.signal.length">
                    <ul class="docList">
                        <li v-for="(item,index) in detailsInfo.signal" :key="index">
                            <img src="../../../../assets/images/pdf.png" alt="">
                            <div>
                                <span class="name" :title="item.fileName">{{item.fileName}}</span>
                                <p>
                                    <span>{{item.fileTime}}</span>  
                                    <span>{{item.fileSize}}</span> 
                                </p>
                            </div>
                            <span class="identifyBtn">识别</span>
                        </li>
                    </ul>
                    <div class="Pagination">
                        <div class="demonstration">共 {{detailsInfo.signalPagination.signalTotal }} 条</div>
                        <el-pagination
                            v-model:current-page="detailsInfo.docPagination.signalPageNum"
                            small
                            background
                            :pager-count="5"
                            layout="prev, pager, next"
                            :total="detailsInfo.signalPagination.signalTotal"
                            :page-count="Math.ceil(detailsInfo.signalPagination.signalTotal/params.pageSize)"
                            @current-change="handleCurrentChangeSingle"
                            class="mt-4"
                        />
                    </div>
                </div>
                <!-- 相关影像 -->
                <div class="contentTitle" v-if="detailsInfo.signal.length">
                    <span>相关影像</span>                  
                </div>
                <div class="allPurpose">
                    <imageMap :id="props.id"></imageMap>
                    <!-- <div class="time-line">
                        <div class="time-line-box">
                            <el-steps direction="vertical" :active="indexStep">
                            <el-step
                                v-for="(activity, index) in activities"
                                :title="activity.fileTime"
                                @click.native="meth_TQZY(activity, index)"
                                :key="index"
                            >
                                <template #default=""></template>    
                            </el-step>
                            </el-steps>
                        </div>
                        <div class="map-box">
                            <div id="vue-openlayers" style="height: 100%; width: 100%"></div>
                        </div>
                    </div> -->
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
import {getDetail,getFileInfo,uploadFile,FileInfo,getTasklist,coordinate} from "@/api/fontInterface/mbDetail/index.js"
import {ref,onMounted, nextTick,defineEmits,getCurrentInstance} from "vue";
import imageMap from "../imageMap/index.vue";

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
//上传
const file = ref();
const fileType = ref();
let uploadClicks = (val) => {
  fileType.value = val;
};
const changeFile = (uploadFile) => {
  file.value = uploadFile;
  submitUpload();
};

const uploadForm = reactive({
  data: {
    fileId: "1",
    name: "2",
    type: "3",
  },
});

const submitUpload = async () => {
  const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: "application/json",
  });
  let formData = new FormData();
  formData.append("file", file.value.raw);
  const res = await uploadFile(formData);
  if (res.code == 200) {
    let params = {
      targetId: props.id,
      fileType: fileType.value,
      filePath: res.fileName,
    };
    await FileInfo(params).then((resolveData) => {
      if (resolveData.code == 200) {
        // let paramss = {
        //   pageNum: 1,
        //   pageSize: 10,
        //   fileType: fileType.value,
        //   targetId: props.id,
        // };
        proxy.$modal.msgSuccess("上传成功");
        if(fileType.value === 1){
            getDetailInfoPic();
        }else if(fileType.value ===2 ){
            getDetailInfoVideo();
        }else if(fileType.value ===3 ){
            getDetailInfoDoc();
        }else if(fileType.value ===4 ){
            getDetailInfoSingle();
        }
      }
    });
  }
};



//时间转换器
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
const detailsFrom = ref(null);
const detailsInfo = ref({
    pic:[],
    video:[],
    doc:[],
    signal:[],
    srcList:[],
    picPagination:{
        picTotal:0,
        picPageNum:1
    },
    videoPagination:{
        videoTotal:0,
        videoPageNum:1
    },
    docPagination:{
        docTotal:0,
        docPageNum:1
    },
    signalPagination:{
        signalTotal:0,
        signalPageNum:1
    },
})
//获取目标的详细信息
const getDetailData = async()=>{
    let result = await getDetail(props.id);
    if(result.code == 200){
        detailsFrom.value = result.data;
    }
    console.log(result);
}
//相关文件需要传的参数
let  params = {
    pageNum: 1,
    pageSize: 4,
    fileType: 1,//文件类型0 影像 1相关图片 2视频 3文档 4信号
    targetId: props.id,
};
//获取目标详情中的图片
const getDetailInfoPic = async(num = 1)=>{
    params.fileType = 1;
    params.pageNum = num;
    params.targetId = props.id
    let result = await getFileInfo(params);
    if(result.code === 200){
        detailsInfo.value.srcList = []
        detailsInfo.value.pic = result.rows;
        detailsInfo.value.picPagination.picTotal = result.total;
        // detailsInfo.value.picPagination.picPageNum = Math.ceil(result.total/params.pageSize);
        detailsInfo.value.pic.forEach(item=>{
            item.fileTime = DateFormatPipe(item.fileTime,'yyyy-MM-dd HH:mm:ss')
            detailsInfo.value.srcList.push("/dev-api"+item.filePath);
        })
    }
}

//获取目标详情中的文件视频
const getDetailInfoVideo= async(num = 1)=>{
    params.fileType = 2;
    params.pageNum = num;
    params.targetId = props.id
    let result = await getFileInfo(params);
    if(result.code === 200){
        detailsInfo.value.video = result.rows;
        detailsInfo.value.videoPagination.videoTotal = result.total;
        // detailsInfo.value.videoPagination.videoPageNum = Math.ceil(result.total/params.pageSize);
    }
    console.log(result);
}

//获取目标详情中的文档
const getDetailInfoDoc = async(num = 1)=>{
    params.fileType = 3;
    params.pageNum = num;
    params.targetId = props.id
    let result = await getFileInfo(params);
    if(result.code === 200){
        detailsInfo.value.doc = result.rows;
        detailsInfo.value.docPagination.docTotal = result.total;
        // detailsInfo.value.docPagination.docPageNum = Math.ceil(result.total/params.pageSize);
        detailsInfo.value.doc.forEach(item=>{
            item.fileTime = DateFormatPipe(item.fileTime,'yyyy-MM-dd HH:mm:ss')
        })
    }
}

//获取目标详情中的信号
const getDetailInfoSingle = async(num = 1)=>{
    params.fileType = 4;
    params.pageNum = num;
    params.targetId = props.id
    let result = await getFileInfo(params);
    if(result.code === 200){
        detailsInfo.value.signal = result.rows;
        detailsInfo.value.signalPagination.signalTotal = result.total;
        // detailsInfo.value.signalPagination.signalPageNum = Math.ceil(result.total/params.pageSize);
        console.log(Math.ceil(result.total/params.pageSize))
        detailsInfo.value.signal.forEach(item=>{
            item.fileTime = DateFormatPipe(item.fileTime,'yyyy-MM-dd HH:mm:ss')
        })
    }
}
//分页切换功能
const handleCurrentChangePic =(e)=>{
    getDetailInfoPic(e);
}

const handleCurrentChangeVideo =(e)=>{
    getDetailInfoVideo(e);
}

const handleCurrentChangeDoc = (e)=>{
    getDetailInfoDoc(e);
}

const handleCurrentChangeSingle = (e)=>{
    getDetailInfoSingle(e);
}
//文档预览 @hf- ？-
const  onOpenDoc =(e)=>{
if (e.fileName.split(".")[1] == "pdf") {
        window.open("/dev-api"+e.filePath,"_blank");
  } else {
    window.open("/dev-api"+e.visitPath,"_blank");
  }
   
}
//上传
const uploadClick = (e)=>{
    console.log(e);
}
const activeNames = ref(['1'])
const handleChange = (val) => {
  console.log(val)
}
const emits = defineEmits([
    "onDetailClose",
  ]);

const onDetailClose = ()=>{
    emits("onDetailClose")
}


//影像
const activities = ref([]);//影像时间轴信息
const YXinit = ()=>{
    let paramss = {
        fileType: 0,
        targetId: props.id,
    };
  getTasklist(paramss).then((res) => {
    if (res.code === 200) {
      if (res.rows.length > 0) {
        activities.value = res.rows;
        activities.value.forEach(item=>{
            item.fileTime = DateFormatPipe(item.fileTime,"yyyy-MM-dd")
        })
        onMounted_img(res.rows[0]);
        value1.value = res.rows[0].id;
        // targetIdValue.value = res.rows[0].targetId;
      }
    }
  });
}
const value1 = ref("");
const indexStep = ref(0);
let meth_TQZY = (item, val) => {
  indexStep.value = val;
  value1.value = item.id;
  console.log(item)
//   targetIdValue.value = item.targetId;
  onMounted_img(item);
};

const canvas = ref(null);
let mapCenter = ref();
let mapFilePath = ref();
const onMounted_img = (item) => {
  if (item == undefined) return;
  console.log(item,'ppp')
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

const map = ref("");
const vectorSource = ref(new VectorSource({ wrapX: false }));
const geoLayer = ref(null);
const arcgisLayer = ref(null);
const init = () => {
  let paramss = {
    fileType: 0,
    targetId: props.id,
  };
  getTasklist(paramss).then((res) => {
    if (res.code === 200) {
      if (res.rows.length > 0) {
        activities.value = res.rows;
        activities.value.forEach(item=>{
            item.fileTime = DateFormatPipe(item.fileTime,"yyyy-MM-dd")
        })
        onMounted_img(res.rows[0]);
        value1.value = res.rows[0].id;
      }
    }
  });
};

const loadwms = (geoTIFFUrl, centerCoordinates) => {
    console.log(geoTIFFUrl,centerCoordinates,'lll')
  geoLayer.value = new TileLayer({
    source: new TileWMS({
      url: "/dev-api" + geoTIFFUrl.split("?")[0],
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

// 切换 GeoTIFF 图片
const changeGeoTIFF = (url, centerCoordinates) => {
  if (geoLayer.value != "") {
    map.value.removeLayer(geoLayer.value);
  }
  loadwms(url, centerCoordinates);
};

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


watch(()=>props.id,(newVal)=>{
    getDetailData();
    getDetailInfoPic();
    getDetailInfoVideo();
    getDetailInfoDoc();
    getDetailInfoSingle();
})

onMounted(()=>{
    nextTick(()=>{
        getDetailData();
        getDetailInfoPic();
        getDetailInfoVideo();
        getDetailInfoDoc();
        getDetailInfoSingle();
        YXinit();
        initMap();
    })
  

})
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>