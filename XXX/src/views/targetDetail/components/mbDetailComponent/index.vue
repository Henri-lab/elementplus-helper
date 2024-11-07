<template>
  <div class="mbDetail">
    <div class="mbDetailContainer">
      <div class="header"><i class="close" @click="onDetailClose"></i></div>
      <div class="main" v-if="detailsFrom !== null">
        <!-- 基本信息 -->
        <p class="contentTitle">
          <span>基本信息</span>
        </p>
        <ul class="InfoUl">
          <li>
            <span>目标名称:</span>
            <span>{{
              detailsFrom.targetName ? detailsFrom.targetName : '暂无数据'
            }}</span>
          </li>
          <li>
            <span>目标类别:</span>
            <span>{{
              detailsFrom.targetType ? detailsFrom.targetType : '暂无数据'
            }}</span>
          </li>
          <li>
            <span> 海拔高:</span>
            <span>{{
              detailsFrom.highAltitude
              ? detailsFrom.highAltitude
              : '暂无数据'
            }}米</span>
          </li>
          <li>
            <span>国家地区:</span>
            <span>{{
              detailsFrom.country ? detailsFrom.country : '暂无数据'
            }}</span>
          </li>
          <li>
            <span :title="detailsFrom.lat">目标中心纬度: </span>
            <span>{{
              detailsFrom.centerLat ? detailsFrom.lat : '暂无数据'
            }}</span>
          </li>
          <li>
            <span :title="detailsFrom.lon">目标中心经度:</span>
            <span>{{
              detailsFrom.centerLon ? detailsFrom.lon : '暂无数据'
            }}</span>
          </li>
          <li>
            <span :title="detailsFrom.area">所属区域:</span>
            <span>{{
              detailsFrom.centerLon ? detailsFrom.area : '暂无数据'
            }}</span>
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
                {{
                  detailsFrom.positionFunction
                  ? detailsFrom.positionFunction
                  : '暂无数据'
                }}
              </div>
            </el-collapse-item>
            <el-collapse-item title="地理位置" name="2">
              <div>
                {{
                  detailsFrom.positionGeographic
                  ? detailsFrom.positionGeographic
                  : '暂无数据'
                }}
              </div>
            </el-collapse-item>
            <el-collapse-item title="主要设施" name="3">
              <div>
                {{
                  detailsFrom.positionFunction
                  ? detailsFrom.positionFunction
                  : '暂无数据'
                }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 子设施 -->
        <p class="contentTitle" v-if="detailsFrom.radars !== null">
          <span>子设施</span>
          <!-- 弹窗 设施详情 @hf -->
        <!-- <div style="display: inline-block;">
          <el-button style="position: absolute; right: 0px; top: -3px" size="small" round="true"
            @click="triggerFacilityInfo">详情</el-button>
        </div> -->
        </p>
        <div class="subFacility" v-if="detailsFrom.radars !== null">
          <el-table :data="detailsFrom.radars" style="width: 100%" max-height="300" @row-click="handleFacilityRowCheck"
            :row-class-name="rowClassName">
            <el-table-column prop="facilityName" label="名称">
              <template #default="scope">
                <span>
                  {{ scope.row.targetName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="targetSize" label="目标尺寸">
              <template #default="scope">
                <span>
                  {{ scope.row.targetSize }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="comouflage" label="伪装防护情况">
              <template #default="scope">
                <span>
                  {{ scope.row.camouflage }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="feature" label="识别特征">
              <template #default="scope">
                <span>
                  {{ scope.row.feature }}
                </span>
              </template>
            </el-table-column> -->
            <el-table-column prop="facilityType" label="设施类型">
              <template #default="scope">
                <span>
                  {{ scope.row.facilityType == 1 ? '普通' : '雷达' }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" fixed="right" >
                            <template #default="scope">
                            <el-button size="small" @click="handleCheck(scope.row)" v-if="scope.row.facilityType==2"
                                >详情</el-button
                            >
                            </template>
                        </el-table-column> -->
          </el-table>
        </div>

        <!-- 相关图片 -->
        <!-- <div class="contentTitle picTitle" v-if="detailsInfo.pic.length"> -->
        <div class="contentTitle picTitle">
          <span>相关图片</span>
          <!-- <span>上传</span> -->
          <div @click="uploadClicks(1)">
            <el-upload class="upload-demo" multiple :limit="10" :show-file-list="false" accept=".png,.jpg,.jpeg"
              :on-change="changeFile" :auto-upload="false" :data="uploadForm.data" :on-success="submitUpload">
              <el-button type="primary">
                <el-icon class="el-icon--left">
                  <Upload />
                </el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
        </div>
        <!-- <div class="allPurpose" v-if="detailsInfo.pic.length"> -->
        <div class="allPurpose">
          <ul class="pruposeList">
            <li v-for="(item, index) in detailsInfo.pic" :key="index">
              <el-image @click="cliImage('/dev-api' + item.filePath)" :src="'/dev-api' + item.filePath">
                <!-- :preview-src-list="detailsInfo.srcList" -->
              </el-image>
              <div class="picContent">
                <span>{{ item.fileTime }}</span>
                <span>{{ item.fileSize }}</span>
              </div>
              <span class="picName" :title="item.fileName">{{
                item.fileName
              }}</span>
            </li>
          </ul>
          <div class="Pagination">
            <div class="demonstration">
              共 {{ detailsInfo.picPagination.picTotal }} 条
            </div>
            <el-pagination v-model:current-page="detailsInfo.picPagination.picPageNum" small background :pager-count="5"
              layout="prev, pager, next" :total="detailsInfo.picPagination.picTotal" :page-count="Math.ceil(detailsInfo.picPagination.picTotal / params.pageSize)
                " @current-change="handleCurrentChangePic" class="mt-4" />
          </div>
        </div>
        <!-- 相关视频 -->
        <!-- <div class="contentTitle picTitle" v-if="detailsInfo.video.length"> -->
        <div class="contentTitle picTitle">
          <span>相关视频</span>
          <div @click="uploadClicks(2)">
            <el-upload class="upload-demo" multiple :limit="10" accept=".mp4" :show-file-list="false"
              :on-change="changeFile" :auto-upload="false" :data="uploadForm.data" :on-success="submitUpload">
              <el-button type="primary">
                <el-icon class="el-icon--left">
                  <Upload />
                </el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
        </div>
        <div class="allPurpose">
          <!-- <div class="allPurpose" v-if="detailsInfo.video.length"> -->
          <ul class="pruposeList">
            <li v-for="(item, index) in detailsInfo.video" :key="index">
              <video controls style="width: 90%; height: 100%">
                <source :src="'/dev-api' + item.filePath" type="video/mp4" />
                <source :src="'/dev-api' + item.filePath" type="video/webm" />
                <p>
                  你的浏览器不支持 HTML5 视频。这里有一个<a :href="'/dev-api' + item.filePath"
                    :download="'/dev-api' + item.filePath">视频</a>链接。
                </p>
              </video>
            </li>
          </ul>
          <div class="Pagination">
            <div class="demonstration">
              共 {{ detailsInfo.videoPagination.videoTotal }} 条
            </div>
            <el-pagination v-model:current-page="detailsInfo.videoPagination.videoPageNum" small background
              :pager-count="5" layout="prev, pager, next" :total="detailsInfo.videoPagination.videoTotal" :page-count="Math.ceil(
                detailsInfo.videoPagination.videoTotal / params.pageSize
              )
                " @current-change="handleCurrentChangeVideo" class="mt-4" />
          </div>
        </div>
        <!-- 相关文档 -->
        <div class="contentTitle picTitle">
          <!-- <div class="contentTitle picTitle" v-if="detailsInfo.doc.length"> -->
          <span>相关文档</span>
          <div @click="uploadClicks(3)">
            <el-upload class="upload-demo" multiple :show-file-list="false" :limit="10" accept=".pdf,.docx,.doc"
              :on-change="changeFile" :auto-upload="false" :data="uploadForm.data" :on-success="submitUpload">
              <el-button type="primary">
                <el-icon class="el-icon--left">
                  <Upload />
                </el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
        </div>
        <div class="allPurpose">
          <!-- <div class="allPurpose" v-if="detailsInfo.doc.length"> -->
          <ul class="docList">
            <li v-for="(item, index) in detailsInfo.doc" :key="index">
              <img src="../../../../assets/images/pdf.png" alt="" v-if="item.filePath.split('.')[1] == 'pdf'" />
              <img src="../../../../assets/images/word.png" alt="" v-if="item.filePath.split('.')[1] == 'docx'" />
              <div @click="onOpenDoc(item)">
                <span class="name" :title="item.fileName">{{
                  item.fileName
                }}</span>
                <p>
                  <span>{{ item.fileTime }}</span>
                  <span>{{ item.fileSize }}</span>
                </p>
              </div>
              <span class="identifyBtn">识别</span>
            </li>
          </ul>
          <div class="Pagination">
            <div class="demonstration">
              共 {{ detailsInfo.docPagination.docTotal }} 条
            </div>
            <el-pagination v-model:current-page="detailsInfo.docPagination.docPageNum" small :pager-count="5" background
              layout="prev, pager, next" :total="detailsInfo.docPagination.docTotal" :page-count="Math.ceil(detailsInfo.docPagination.docTotal / params.pageSize)
                " @current-change="handleCurrentChangeDoc" class="mt-4" />
          </div>
        </div>
        <!-- 相关信号 -->
        <!-- <div class="contentTitle picTitle" v-if="detailsInfo.signal.length"> -->
        <div class="contentTitle picTitle">
          <span>信号数据</span>
          <div @click="uploadClicks(4)">
            <el-upload class="upload-demo" multiple :limit="10" accept=".xlsx" :show-file-list="false"
              :on-change="changeFile" :auto-upload="false" :data="uploadForm.data" :on-success="submitUpload">
              <el-button type="primary">
                <el-icon class="el-icon--left">
                  <Upload />
                </el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
        </div>
        <!-- <div class="allPurpose" v-if="detailsInfo.signal.length"> -->
        <div class="allPurpose">
          <ul class="docList">
            <li v-for="(item, index) in detailsInfo.signal" :key="index" @click="onDownXSL(item)">
              <img src="../../../../assets/images/pdf.png" alt="" v-if="item.filePath.split('.')[1] == 'xlsx'" />
              <div>
                <span class="name" :title="item.fileName">{{
                  item.fileName
                }}</span>
                <p>
                  <span>{{ item.fileTime }}</span>
                  <span>{{ item.fileSize }}</span>
                </p>
              </div>
              <span class="identifyBtn">识别</span>
            </li>
          </ul>
          <div class="Pagination">
            <div class="demonstration">
              共 {{ detailsInfo.signalPagination.signalTotal }} 条
            </div>
            <el-pagination v-model:current-page="detailsInfo.docPagination.signalPageNum" small background
              :pager-count="5" layout="prev, pager, next" :total="detailsInfo.signalPagination.signalTotal" :page-count="Math.ceil(
                detailsInfo.signalPagination.signalTotal / params.pageSize
              )
                " @current-change="handleCurrentChangeSingle" class="mt-4" />
          </div>
        </div>
        <!-- 相关影像 -->
        <div class="contentTitle" v-if="activities.length">
          <span>相关影像</span>
        </div>
        <div class="allPurpose YxPurpose" v-if="activities.length">
          <imageMap :id="props.id"></imageMap>
        </div>
      </div>
      <!-- 侧方弹窗 设施信息 @hf-->
      <div class="side" v-show="isPopupFacilityShow">
        <popupFacilityInfo :facility="popupProps.value" />
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  getDetail,
  getFileInfo,
  uploadFile,
  FileInfo,
  getTasklist,
  coordinate,
} from '@/api/fontInterface/mbDetail/index.js';
import {
  ref,
  onMounted,
  nextTick,
  defineEmits,
  getCurrentInstance,
  computed,
} from 'vue';
import imageMap from '../imageMap/index.vue';
import { ElMessage } from 'element-plus';
import popupFacilityInfo from '../popupFacilityInfo/index.vue';
import bus from '@/utils/bus';
import testRadars from './testData'
const { proxy } = getCurrentInstance();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
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
    fileId: '1',
    name: '2',
    type: '3',
  },
});
const cliImage = (src) => {
  console.log(src, 'src');
  window.open(src);
};
const submitUpload = async () => {
  const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: 'application/json',
  });
  let formData = new FormData();
  formData.append('file', file.value.raw);
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
        proxy.$modal.msgSuccess('上传成功');
        if (fileType.value === 1) {
          getDetailInfoPic();
        } else if (fileType.value === 2) {
          getDetailInfoVideo();
        } else if (fileType.value === 3) {
          getDetailInfoDoc();
        } else if (fileType.value === 4) {
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

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    HH = HH < 10 ? '0' + HH : HH; // 时
    mm = mm < 10 ? '0' + mm : mm; // 分
    ss = ss < 10 ? '0' + ss : ss; // 秒

    switch (type) {
      case 'yyyy':
        timeDate = String(year);
        break;
      case 'yyyy-MM':
        timeDate = year + '-' + month;
        break;
      case 'yyyy-MM-dd':
        timeDate = year + '-' + month + '-' + day;
        break;
      case 'yyyy/MM/dd':
        timeDate = year + '/' + month + '/' + day;
        break;
      case 'yyyy-MM-dd HH:mm:ss':
        timeDate =
          year + '-' + month + '-' + day + ' ' + HH + ':' + mm + ':' + ss;
        break;
      case 'HH:mm:ss':
        timeDate = HH + ':' + mm + ':' + ss;
        break;
      case 'MM':
        timeDate = String(month);
        break;
      default:
        timeDate = year + '-' + month + '-' + day;
        break;
    }
    return timeDate;
  } else {
    return '';
  }
};
const detailsFrom = ref(null);
const detailsInfo = ref({
  pic: [],
  video: [],
  doc: [],
  signal: [],
  srcList: [],
  picPagination: {
    picTotal: 0,
    picPageNum: 1,
  },
  videoPagination: {
    videoTotal: 0,
    videoPageNum: 1,
  },
  docPagination: {
    docTotal: 0,
    docPageNum: 1,
  },
  signalPagination: {
    signalTotal: 0,
    signalPageNum: 1,
  },
});
//获取目标的详细信息
const testData = {
  radars: testRadars
};
const getDetailData = async () => {
  let result = await getDetail(props.id);
  if (result.code == 200) {
    console.log(result.data, 'detailsFrom');
    // 后台数据
    detailsFrom.value = result.data;
    //使用测试数据 @hf 
    // detailsFrom.value = testData;
  }
  // console.log(result);
};

//< 某设施详情中全部信息 @hf
let popupProps = reactive({});
// 设施列表项的点击 
const selectedRow = ref({})
const lastSelectedRow = ref({})
const rowClassName = ({ row, rowIndex }) => {//bug 点击效果类没有加载成功
  console.log(row, 'row')
  return row === selectedRow.value ? 'selected-row' : ''
}
const handleFacilityRowCheck = (row) => {
  selectedRow.value = row;
  popupProps.value = row;
  // if (row === lastSelectedRow.value || !lastSelectedRow.value || !selectedRow.value) {
  //   triggerFacilityInfo();
  // }
  lastSelectedRow.value = row;
  isPopupFacilityShow.value=true
  // 改变颜色 -.-
};
// 弹窗显示标识 
const isPopupFacilityShow = ref(false);
// 监听 popup弹窗组件 关闭按钮 
bus.on('popupFacilityInfoCloseClick', () => {
  isPopupFacilityShow.value = false;
})
// 弹窗开关 \'详细'\ 
const triggerFacilityInfo = (e) => {
  if (popupProps.value) {
    isPopupFacilityShow.value = !isPopupFacilityShow.value;
    // 改变颜色 -.-
  } else {
    ElMessage.warning('请选择设施');
  }
};
// @hf />

//相关文件需要传的参数
let params = {
  pageNum: 1,
  pageSize: 4,
  fileType: 1, //文件类型0 影像 1相关图片 2视频 3文档 4信号
  targetId: props.id,
};
//获取目标详情中的图片
const getDetailInfoPic = async (num = 1) => {
  params.fileType = 1;
  params.pageNum = num;
  params.targetId = props.id;
  let result = await getFileInfo(params);
  if (result.code === 200) {
    detailsInfo.value.srcList = [];
    detailsInfo.value.pic = result.rows;
    detailsInfo.value.picPagination.picTotal = result.total;
    // detailsInfo.value.picPagination.picPageNum = Math.ceil(result.total/params.pageSize);
    detailsInfo.value.pic.forEach((item) => {
      item.fileTime = DateFormatPipe(item.fileTime, 'yyyy-MM-dd HH:mm:ss');
      detailsInfo.value.srcList.push('/dev-api' + item.filePath);
    });
  }
};

//获取目标详情中的文件视频
const getDetailInfoVideo = async (num = 1) => {
  params.fileType = 2;
  params.pageNum = num;
  params.targetId = props.id;
  let result = await getFileInfo(params);
  if (result.code === 200) {
    detailsInfo.value.video = result.rows;
    detailsInfo.value.videoPagination.videoTotal = result.total;
    // detailsInfo.value.videoPagination.videoPageNum = Math.ceil(result.total/params.pageSize);
  }
  console.log(result);
};

//获取目标详情中的文档
const getDetailInfoDoc = async (num = 1) => {
  params.fileType = 3;
  params.pageNum = num;
  params.targetId = props.id;
  let result = await getFileInfo(params);
  if (result.code === 200) {
    detailsInfo.value.doc = result.rows;
    detailsInfo.value.docPagination.docTotal = result.total;
    // detailsInfo.value.docPagination.docPageNum = Math.ceil(result.total/params.pageSize);
    detailsInfo.value.doc.forEach((item) => {
      item.fileTime = DateFormatPipe(item.fileTime, 'yyyy-MM-dd HH:mm:ss');
    });
  }
};

//获取目标详情中的信号
const getDetailInfoSingle = async (num = 1) => {
  params.fileType = 4;
  params.pageNum = num;
  params.targetId = props.id;
  let result = await getFileInfo(params);
  if (result.code === 200) {
    detailsInfo.value.signal = result.rows;
    detailsInfo.value.signalPagination.signalTotal = result.total;
    // detailsInfo.value.signalPagination.signalPageNum = Math.ceil(result.total/params.pageSize);
    console.log(Math.ceil(result.total / params.pageSize));
    detailsInfo.value.signal.forEach((item) => {
      item.fileTime = DateFormatPipe(item.fileTime, 'yyyy-MM-dd HH:mm:ss');
    });
  }
};
//分页切换功能
const handleCurrentChangePic = (e) => {
  getDetailInfoPic(e);
};

const handleCurrentChangeVideo = (e) => {
  getDetailInfoVideo(e);
};

const handleCurrentChangeDoc = (e) => {
  getDetailInfoDoc(e);
};

const handleCurrentChangeSingle = (e) => {
  getDetailInfoSingle(e);
};
//文档预览 @hf - ? -
const onOpenDoc = (e) => {
  if (e.fileName.split('.')[1] == 'pdf') {
    window.open('/dev-api' + e.filePath, '_blank');
  } else {
    window.open('/dev-api' + e.visitPath, '_blank');
  }
};

const onDownXSL = (e) => {
  console.log(e.filePath);
  if (e.filePath) {
    window.open('/dev-api' + e.filePath, '_blank');
    ElMessage({
      type: 'success',
      message: '下载成功',
    });
  }
};

//上传
const uploadClick = (e) => {
  console.log(e);
};
const activeNames = ref(['1']);
const handleChange = (val) => {
  console.log(val);
};
const emits = defineEmits(['onDetailClose']);

const onDetailClose = () => {
  emits('onDetailClose');
};

//影像
const activities = ref([]); //影像时间轴信息
const YXinit = () => {
  let paramss = {
    fileType: 0,
    targetId: props.id,
  };
  getTasklist(paramss).then((res) => {
    if (res.code === 200) {
      //   if (res.rows.length > 0) {
      activities.value = res.rows;
      console.log(activities.value, '12312312312312323123123123123123');
      //   }
    }
  });
};

let ids = computed(() => props.id);

watch(
  () => props.id,
  (newVal) => {
    getDetailData();
    getDetailInfoPic();
    getDetailInfoVideo();
    getDetailInfoDoc();
    getDetailInfoSingle();
    YXinit();
  }
);

onMounted(() => {
  nextTick(() => {
    getDetailData();
    getDetailInfoPic();
    getDetailInfoVideo();
    getDetailInfoDoc();
    getDetailInfoSingle();
    YXinit();
    console.log(detailsFrom.radars);
  });
});
</script>
<style lang="scss" scoped>
.selected-row {
  background-color: #b7db15;
}

@import './index.scss';
</style>
