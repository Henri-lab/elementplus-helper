<!--
 * @Author: XC
 * @Date: 2024-07-17 13:59:12
 * @LastEditors: chenqiming chenqiming
 * @LastEditTime: 2024-07-21 10:52:30
 * @FilePath: \RuoYi-Vue3-3.8.6\src\components\record\index.vue
 * @Description: 
-->
<template>
  <div class="recordbox">
    <div v-show="!props.isMange" class="tit">
      <p>核查记录</p>
      <div class="butStyle">
        <el-button type="primary" @click="saveList">保存</el-button>
        <el-button type="primary" @click="submitCheck">提交审核</el-button>
        <el-button type="primary" @click="reportFile">导出结果</el-button>
      </div>
    </div>
    <div v-show="!props.isMange" class="dateLine">
      <div class="Lbth" @click="scrollLeft">
        <img src="@/assets/images/核查记录时间轴左滑.png" alt="" />
      </div>
      <div class="dateBox" id="scroll">
        <div class="dateList" :key="dateList">
          <ul v-for="item in dateList" :key="item.id">
            <li :style="item.stylecss">
              <i
                v-if="item.targetData.status == 0"
                class="iconfont icon-daishenhe1"
              ></i>
              <i
                v-if="item.targetData.status == 1"
                class="iconfont icon-yiwancheng1"
              ></i>
              <i
                v-if="item.targetData.status == 2"
                class="iconfont icon-bohui3"
              ></i>
              <i
                v-if="item.targetData.status == 3"
                class="iconfont icon-jinhangzhong2"
              ></i>
              <img
                v-show="item.checked == 1"
                src="@/assets/images/核查记录-时间轴时间点.png"
                alt=""
              /><img
                :style="item.imgcss"
                v-show="item.checked == 2"
                src="@/assets/images/核查记录-时间轴时间点选中.png"
                alt=""
              />
            </li>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="删除"
              trigger="contextmenu"
              placement="top"
            >
              <template #content>
                <span @click="delDate(item)"> 删除 </span>
              </template>
              <li>
                <el-checkbox
                  @change="setChecked(item)"
                  :disabled="item.disabled"
                  :checked="item.check"
                  size="large"
                  >{{
                    item.label ? item.label.substring(0, 19) : ''
                  }}</el-checkbox
                >
              </li>
            </el-tooltip>
          </ul>
        </div>
      </div>
      <div class="Rbth" @click="scrollRight">
        <img src="@/assets/images/核查记录时间轴右滑.png" alt="" />
      </div>
    </div>
    <div class="mapBox" id="mapBox">
      <div v-show="state.isChartList" class="chartListSty tableList">
        <div class="header">图层管理</div>
        <el-table :data="state.labelInfos" height="90%" :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="id" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="操作" label="操作">
            <template #default="{ row }">
              <i class="iconfont icon-dingwei" @click.native.stop="flowto(row)" alt="" title="定位"></i>
              <i class="iconfont icon-yincang1" @click.native.stop="isShow(row)" alt="" title="隐藏"></i>
              <i class="iconfont icon-bianji" @click.native.stop="setMapStyle(row)" alt="" title="编辑"></i>
              <i class="iconfont icon-shanchu" @click.native.stop="remMapStyle(row)" alt="" title="删除"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!props.isMange" class="leftBtn">
        <div
          @click="state.isTableList = !state.isTableList"
          title="目标列表"
          :class="state.isTableList ? 'noMBbtn' : 'MBbtn'"
        ></div>
      </div>
      <div class="tableList" v-show="state.isTableList">
        <div class="tableClass">
          <div @click="changeTable(1)" :class="tableNum == 1 ? 'left_table isleft_table' : 'left_table'">
            全部目标
          </div>
          <div @click="changeTable(2)" :class="tableNum == 2 ? 'right_table isRight_table' : 'right_table'">
            个人目标
          </div>
        </div>
        <div class="serch">
          <el-input v-model="queryParams.targetName" clearable style="
              width: 240px;
              height: 34px;
              border: 1px solid #1296db;
              border-radius: 5px;
            " placeholder="请输入目标名称" />
          <el-button type="primary" @click="getLogList">查询</el-button>
        </div>
        <el-table :data="leftTableData" height="82%" :row-class-name="tableRowClassName">
          <el-table-column prop="targetName" label="目标名称" />
          <el-table-column prop="user" label="操作人员">
            <template #default="{ row }">
              <el-select v-model="row.userId" @change="setUser(row)">
                <el-option v-for="name in userData" :key="name.id" :value="name.userId"
                  :label="name.userName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="操作" label="操作">
            <template #default="{ row }">
              <!-- <a href="javascript: void (0)" 
                >进度监控</a
              > -->
              <img src="../../assets/images/进度监控.png" @click.native.stop="showWatch(row)" alt="" title="进度监控" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :pager-count="3" class="pageStyle" v-model:current-page="queryParams.pageNum"
          :page-size="queryParams.pageSize" small layout="total, prev, pager, next,sizes," :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
      <div class="rBtn">
        <ul>
          <li @click="showChartList">图层管理</li>
          <li @click="showBox(1)">目标详情</li>
          <li @click="showBox(2)">相关文件</li>
          <li @click="showBox(3)">动态变化</li>
        </ul>
      </div>
      <div class="target" :style="{ right: targetShow + 'px' }">
        <div class="targetContainer">
          <descriptions ref="descriRef" :tableData="table"></descriptions>
        </div>
      </div>
      <div class="about" v-if="targetId" :style="{ right: targetShow2 + 'px' }">
        <mbDetailComponent :id="targetId" />
      </div>
      <div class="change" v-if="targetId" :style="{ right: targetShow3 + 'px' }">
        <developComponent :id="targetId" />
      </div>
      <div class="Labeled">
        <img @click="onShowYX" src="@/assets/images/ImageIcon.png" alt="" title="影像展示" />
        <img @click="layerManagerDialog = true" src="@/assets/images/图层.png" alt="" />
        <!-- <img @click="setline" src="@/assets/images/线.png" alt="" /> -->
        <div class="iconfont icon-icon-line-graph" title="绘制折线" @click="setline"></div>
        <div class="iconfont icon-xian" title="添加线" @click="setline1"></div>
        <div class="iconfont icon-polygon" title="绘制多边形" @click="setpolygon"></div>
        <!-- <img @click="setpolygon" src="@/assets/images/标注copy.png" alt="" /> -->
        <div class="iconfont icon-yuan" title="绘制圆形" @click="DrawCircle"></div>
        <div class="iconfont icon-wenzi" title="添加文字" @click="label"></div>
        <div class="iconfont icon-xingzhuang-juxing" title="绘制矩形" @click="DrawRectangle"></div>
        <!-- <div class="iconfont icon-xian" title="添加线" @click="polyline"></div> -->
      </div>
    </div>
    <!-- 影像列表 -->
    <div class="yxList" v-if="yxShow">
      <div class="yxListContainer">
        <div class="header">
          <div @click="uploadClicks(0)">
            <el-upload class="upload-demo" multiple :limit="10" :show-file-list="false"
              accept=".tiff,.tif,.geotiff,.geotif" :on-change="changeFile" :auto-upload="false" :data="uploadForm.data"
              :on-success="submitUpload">
              <el-button type="primary">
                <el-icon class="el-icon--left">
                  <Upload />
                </el-icon>
                上传
              </el-button>
            </el-upload>
          </div>
          <i class="close" @click="onCloseYx"></i>
        </div>
        <div class="main">
          <ul v-if="activities.length">
            <li v-for="(item, index) in activities" :key="index" @click="onLoadYx(item)">
              <span>{{ DateFormatPipe(item.fileTime, 'yyyy-MM-dd') }}</span>
              <span :title="item.fileName">{{ item.fileName }}</span>
            </li>
          </ul>
          <div v-else>
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      <!-- activities -->
    </div>
    <!-- 图层管理 -->
    <el-dialog class="dialog" v-model="layerManagerDialog" title="图层管理" width="500" draggable :modal="false"
      :close-on-click-modal="false">
      <el-tree node-key="id" highlight-current :data="layerData" :props="defaultProps" default-expand-all
        :default-checked-keys="defaultCheckedKeys" check-strictly show-checkbox @check-change="handleCheckChange">
      </el-tree>
    </el-dialog>
    <el-dialog v-model="state.mapStyle" title="请输入标绘信息" width="500" :before-close="handleClose">
      <div>
        <span>请输入名称</span>
        <el-input v-model="state.styleFrom.content" style="width: 240px" />
      </div>
      <div>
        <span>请输入字号</span>
        <el-input v-model="state.styleFrom.size" style="width: 240px" />
      </div>
      <div>
        <span>请输入颜色</span>
        <el-color-picker v-model="state.styleFrom.color" />
        <el-input v-model="state.styleFrom.color" style="width: 200px" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancleStyle">取消</el-button>
          <el-button type="primary" @click="primartStyle"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <div class="targetNameStyle">
      {{ state.targetName }}
    </div>
    <!-- 修改图层样式弹层 -->
    <canvaStyle @primaryStyle="primaryStyle" v-show="state.isCanvaStyle" :entityInfo="state.entityInfo"
      :labelInfo="state.labelInfo"></canvaStyle>
  </div>
</template>

<script setup>
import initCeium from '@/utils/cesiuminit';
import drawLine from '@/utils/line';
import polygon from '@/utils/polygon';
// 预测信息
import developComponent from '@/views/targetDetail/components/developComponent/index.vue';
import mbDetailComponent from '@/views/targetDetail/components/mbDetailComponent/index.vue';
import canvaStyle from './canvaStyle.vue';
import {
  checkList,
  getCountry,
  getType,
  getchecklog,
  taskEdit,
  exportPdf,
  getDrawList,
  savelabel,
  addlabel,
  delLog
} from '@/api/frontend/record/index';
import { checkassess } from '@/api/frontend/task';
import bus from '@/utils/bus';
import {
  getTasklist,
  uploadFile,
  FileInfo,
  facility
} from '@/api/fontInterface/mbDetail/index.js';
import { listUser, listUserAll } from '@/api/system/user';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { nextTick, reactive, ref, provide, onUnmounted } from 'vue';
import descriptions from '@/components/descriptions/index.vue';
import { getUserProfile } from '@/api/system/user';
import entities from '@/utils/entities1';
const Entities = new entities();
const { proxy } = getCurrentInstance();
import { getCanvas } from '@/utils/cloneCanvas';
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {},
  mapStyle: false,
  styleFrom: {
    content: '',
    size: 25,
    color: '#e7e91e',
    show: true,
    lineType: 'solid',
    width: 1
  },
  newMapAll: [],
  mapInfo: {},
  isTableList: false, // 是否展示右侧目标
  targetName: '', // 用来存储当前目标名
  labelInfos: [], // 用来存储返回的标绘
  isChartList: false, // 图层管理弹层显隐
  isCanvaStyle: false, // 修改图层样式
  entityInfo: {}, // 存储当前操作的标绘
  labelInfo: {}, // 存储列表内选中的标绘
  leftTableInfo: {} // 存储点击的列表详情
});
// 时间轴删除按钮
const delDate = async (row) => {
  console.log(row, state.leftTableInfo, '点击了删除');
  await delLog({ id: row.id });
  showWatch(state.leftTableInfo);
};
// 保存标汇
let drawData = ref([]);
let input = ref();
const setline = () => {
  drawLineFun.startDraw('');
};
const setline1 = () => {
  drawLineFun.startDraw1();
};
bus.on('busEntity', (data) => {
  let color = '#D1CB15';
  if (data.type == 'line') {
    // 获取当前标绘颜色 转为css识别的颜色
    let getColor = data.entity.polyline?.material.color.getValue();
    if (getColor) {
      // 从 Cesium.Color 中提取 RGB 组件，并转换为 0-255 范围内的整数
      const r = Math.round(getColor.red * 255);
      const g = Math.round(getColor.green * 255);
      const b = Math.round(getColor.blue * 255);
      // 格式化为十六进制颜色字符串，确保每个组件都是两位数
      color = `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()}`;
    }
  }

  let str = '';
  let linejson = drawLineFun.toGeoJSON(data.entity).geometry.coordinates;
  linejson.map((item) => {
    str += item[0] + ',';
    str += item[1] + ';';
  });
  state.labelInfos.push({
    color: color,
    id: data.entity.id,
    type: data.type,
    coords: str,
    content: drawLineFun.getlabel(data.entity),
    show: true,
    lineType: 'solid',
    width: 1
  });
});
bus.on('setMap', (data) => {
  // state.newMapAll.forEach((item) => {
  state.labelInfos.forEach((item) => {
    if (item.id == data.data.id) {
      state.styleFrom = item;
      item.coords = data.data.coords;
      // data.isShow ? (state.mapStyle = true) : false;
    }
  });
});
bus.on('remMap', (id) => {
  state.newMapAll = state.newMapAll.filter((item) => item.id != id);
  state.labelInfos = state.labelInfos.filter((item) => item.id != id);
});
// 鼠标双击实体
bus.on('leftDouble', (data) => {
  state.labelInfo = state.labelInfos.filter((item) => item.id == data.id.id)[0];
  state.entityInfo = viewer.entities.getById(data.id.id);
  state.isCanvaStyle = true;
});
// 绘制圆形
const DrawCircle = () => {
  Entities.DrawCircle().then((res) => {
    // state.mapStyle = true
    state.styleFrom = { ...state.styleFrom, ...res };
    primartStyle();
    // Entities.getStyle(state.styleFrom)
  });
};
// 绘制矩形
const DrawRectangle = () => {
  Entities.DrawRectangle().then((res) => {
    state.styleFrom = { ...state.styleFrom, ...res };
    primartStyle();
  });
};
// 地图添加文字标绘
const label = () => {
  Entities.label().then((res) => {
    // state.mapStyle = true;
    state.styleFrom = { ...state.styleFrom, ...res };
    state.labelInfo = state.styleFrom;
    state.labelInfos.push(state.styleFrom);
    state.entityInfo = viewer.entities.getById(res.id);
    state.isCanvaStyle = true;
    // Entities.getStyle(state.styleFrom)
  });
};
// 添加线
const polyline = () => {
  Entities.polyline();
};
// 修改地图样式前的回调
const handleClose = () => {
  console.log('关闭了地图标绘样式');
};
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
// 定义标绘样式确认按钮
const primartStyle = () => {
  // state.mapStyle = false;
  // Entities.getStyle(state.styleFrom);
  // if (!!state.newMapAll.length) {
  //   let isTrue = state.newMapAll.some((item) => item.id == state.styleFrom.id);
  //   if (isTrue) {
  //     state.newMapAll.forEach((item) => {
  //       if (item.id == state.styleFrom.id) {
  //         item = state.styleFrom;
  //       }
  //     });
  //   } else {
  //     state.newMapAll.push(state.styleFrom);
  //     state.labelInfos.push(state.styleFrom); // 添加进图层管理列表
  //   }
  // } else {
  //   state.newMapAll.push(state.styleFrom);
  state.labelInfos.push(state.styleFrom); // 添加进图层管理列表
  // }
};
// 取消样式
const cancleStyle = () => {
  state.mapStyle = false;
  let isTrue = state.newMapAll.some((item) => item.id == state.styleFrom.id);
  if (!isTrue) {
    viewer.entities.removeById(state.styleFrom.id);
  }
};
const uploadForm = reactive({
  data: {
    fileId: '1',
    name: '2',
    type: '3'
  }
});
const submitUpload = async () => {
  const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: 'application/json'
  });
  let formData = new FormData();
  formData.append('file', file.value.raw);
  const res = await uploadFile(formData);
  if (res.code == 200) {
    let params = {
      targetId: targetId.value,
      fileType: fileType.value,
      filePath: res.fileName
    };
    await FileInfo(params).then((resolveData) => {
      if (resolveData.code == 200) {
        proxy.$modal.msgSuccess('上传成功');
        if (fileType.value === 0) {
          YXinit();
        }
      }
    });
  }
};
const setpolygon = () => {
  drawPolygon.startDraw('');
};

// 获取登陆人信息
const getUser = () => {
  getUserProfile().then((response) => {
    console.log(response, 'response');
    state.user = response.data;
    state.roleGroup = response.roleGroup;
    state.postGroup = response.postGroup;
  });
};
// 图层选择start
// 默认选中所有
let defaultCheckedKeys = ref([]);
// 获取图层
let layerData = ref([]);
// 图层管理
let layerManagerDialog = ref(false);

let defaultProps = {
  children: 'children',
  label: 'label'
};
let tableNum = ref(1);
// 左侧table切换
const changeTable = (num) => {
  tableNum.value = num;
  queryParams.value.userId = num == 2 ? state.user.userId : '';
  getLogList();
};
// 图层点击
const handleCheckChange = (val, check, or) => {
  if (val.type == 'images') {
    initCeium.showLayer(val.pid, check);
  } else if (val.type == 'draw') {
    // // 获取线
    // let line = drawLineFun.SetEntity();
    // // 获取面
    // let polygon = drawPolygon.SetEntity();
    viewer.entities.values.map((item) => {
      if (item.entitId == val.pid) {
        item.show = check;
      }
    });
    // line.map((item) => {
    //   if (item.entitId == val.pid) {
    //     item.show = check;
    //   }
    // });
    // polygon.map((item) => {
    //   if (item.entitId == val.pid) {
    //     item.show = check;
    //   }
    // });
  }
};
const props = defineProps({
  isMange: {
    type: Boolean,
    required: true,
    default: false
  }
});
// 图层选择end
let drawPolygon, drawLineFun;
onMounted(() => {
  
  initCeium.rendererMap('mapBox');
  //  initCeium.viewer.scene.backgroundColor = '#1e3352'
  initCeium.viewer.scene.backgroundColor =
    Cesium.Color.fromCssColorString('#1e3352');
  Entities.doubleClick();
  // 绘制线
  drawLineFun = new drawLine({
    viewer: initCeium.viewer,
    onStopDrawing: function (entity) {
      let json = drawLineFun.toGeoJSON(entity);
      let length = drawLineFun.toGeoJSON(entity).geometry.coordinates.length;
      let postioin =
        drawLineFun.toGeoJSON(entity).geometry.coordinates[length - 1];
      drawLineFun.addlabel('', postioin);
    }
  });
  // 绘制面
  drawPolygon = new polygon({
    viewer: initCeium.viewer,
    onStopDrawing: function (entity) {
      let json = drawPolygon.toGeoJSON(entity);
      let length = drawPolygon.toGeoJSON(entity).geometry.coordinates.length;
      let postioin =
        drawPolygon.toGeoJSON(entity).geometry.coordinates[length - 1];
      drawPolygon.addlabel('', postioin);
    }
  });
  if (!props.isMange) {
    getUserList();
  getUser();
    state.isTableList = true;
    getLogList();
  }
  // 核查管理页面点击提交更新
bus.on('addAssess', ({ id, targetId }) => {
  console.log(descriRef.value,'descriRef.value');
  if (descriRef.value) {
    let obj = dataFun();
    obj.id = id;
    obj.targetId = targetId;
    checkassess(obj).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.msg);
      }
    });
  }
});
// 核查管理树形解构点击触发
bus.on('getDrawList', ({ id, tableList }) => {
  checkboxes = [id];
  (table.value = tableList), getDraw();
});
});
onUnmounted(()=>{
  bus.off('addAssess')
  bus.off('getDrawList')
})
// 查询用户列表
let userData = ref([]);
const getUserList = () => {
  listUser().then((res) => {
    // listUserAll().then((res) => {
    userData.value = res.rows;
  });
};
// 修改操作用户
const setUser = (row) => {
  // 调用接口修改
  let data = {
    targetIds: [row.targetId],
    userOperatorId: row.userId
  };
  taskEdit(data).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
    }
  });
};
// 核查记录列表
let leftTableData = ref([]);
// 获取记录
const getLogList = (distinction = { targetId: 1 }) => {
  if (distinction.targetId === 1) {
    checkList(queryParams.value).then((res) => {
      leftTableData.value = res.rows;
      total.value = res.total;
      showWatch(res.rows[0]);
    });
  } else {
    checkList(queryParams.value).then((res) => {
      leftTableData.value = res.rows;
      total.value = res.total;
      showWatch(distinction);
    });
  }
};
// 分页
const total = ref(0);
const queryParams = ref({
  targetName: '',
  pageNum: 1,
  pageSize: 20,
  userId: ''
});
const handleSizeChange = (val) => {
  queryParams.value.pageSize = val;
  getLogList();
};
const handleCurrentChange = (val) => {
  queryParams.value.pageNum = val;
  getLogList();
};
//status
const statusTimeLine = ref(1);
// 传递表单
let table = ref();
// 保存当前目标
let tableRow = ref();
// 保存targetid
let targetId = ref(null);
let devid = ref();
// 查看详情
const showWatch = (row) => {
  state.leftTableInfo = row;
  state.targetName = row.targetName;
  if (row.lat && row.lon) {
    window.viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(
        row.lon,
        row.lat,
        8000.0
      )
    });
  }
  checkboxes = [];
  // 清除线跟面
  initCeium.delLayer();
  drawLineFun.deleteAll();
  drawPolygon.deleteAll();
  state.labelInfos = [];
  // state.newMapAll = [];
  viewer.entities.removeAll();
  targetId.value = row.targetId;
  if (row.targetId !== undefined) {
    getchecklog({ targetId: row.targetId }).then((res) => {
      dateList.value = [];
      // dateList.value = res.rows;
      if (res.rows.length) {
        tableRow.value = res.rows;
        res.rows.map((item) => {
          dateList.value.push({
            id: item.id,
            checked: 1,
            label: item.updateTime,
            disabled: false,
            targetData: item
          });
        });
        dateList.value[0].check = true;
        checkboxes = [];
        layerData.value = [];
        setChecked(dateList.value[0]);
        statusTimeLine.value = dateList.value[0].targetData.status;
        table.value = JSON.parse(JSON.stringify(res.rows[0]));
      } else {
        table.value = {};
      }
    });
    YXinit();
  } else {
    dateList.value = [];
    table.value = {};
  }
};
// 时间轴
let active = ref('');
let dateList = ref();
// 判断是否勾选两个
let checkboxes = [];
// 保存时间段id
let timerId = ref();
// 时间轴点击
const setChecked = (val) => {
  //每次清除全部的数据
  drawLineFun.deleteAll();
  drawPolygon.deleteAll();
  // Entities.deleteAll()
  // state.newMapAll = [];
  state.labelInfos = [];
  state.isCanvaStyle = false;
  viewer.entities.removeAll();
  statusTimeLine.value = val.targetData.status;
  if (val.checked == 1) {
    active.value = 'active';
    val.checked = 2;
    checkboxes.push(val.id);
    val.stylecss = {
      borderBottom: '1px solid #ffe240!important'
    };
    val.imgcss = {
      width: '20px!important',
      top: '8px!important',
      left: '47% !important'
    };
    timerId.value = val.id;
    getDraw();
    // start、
    table.value = JSON.parse(JSON.stringify(val.targetData));
    layerData.value.push({
      label: val.label.substring(0, 19),
      id: val.id,
      children: [
        {
          pid: val.id,
          label: '影像图层',
          id: val.id + 10000,
          type: 'images'
        },
        {
          pid: val.id,
          label: '标注图层',
          id: val.id + 10001,
          type: 'draw'
        }
      ]
    });
    defaultCheckedKeys.value = layerData.value
      .map((item) => {
        return [item.id, item.id + 10000, item.id + 10001];
      })
      .flat();
    // end
  } else {
    active.value = '';
    val.checked = 1;
    checkboxes = checkboxes.filter((item) => item !== val.id);
    layerData.value = layerData.value.filter((item) => item.id !== val.id);
    val.stylecss = {};
    val.imgcss = {};
    if (checkboxes.length == 0) {
      table.value = [];
      timerId.value = '';
      // alert(123123123)
      // 清除线跟面
      initCeium.delLayer();
      drawLineFun.deleteAll();
      drawPolygon.deleteAll();
    } else {
      timerId.value = checkboxes[0];
      getDraw();
      tableRow.value.map((item) => {
        if (item.id == checkboxes[0]) {
          table.value = JSON.parse(JSON.stringify(item));
        }
      });
    }
  }
  setdisabled();
};
// 判断是否勾选两个
const setdisabled = () => {
  if (checkboxes.length > 1) {
    dateList.value.map((item) => {
      if (item.checked == 1) {
        item.disabled = true;
      }
    });
  } else {
    dateList.value.map((item) => {
      if (item.checked == 1) {
        item.disabled = false;
      }
    });
  }
};
// 滚动
let setp = 500;
let scroll = 0;
const scrollLeft = () => {
  let div = document.getElementById('scroll');
  scroll -= setp;
  div.scrollTo(scroll, 0);
};
const scrollRight = () => {
  let div = document.getElementById('scroll');
  scroll += setp;
  div.scrollTo(scroll, 0);
};

// 详情显示
let targetShow = ref(-1400);
let targetShow2 = ref(-1000);
let targetShow3 = ref(-700);
const showBox = (val) => {
  state.isChartList = false;
  // targetShow.value = -1000
  // targetShow2.value = -1000
  // targetShow3.value = -1000
  if (val == 1) {
    targetShow2.value = -1000;
    targetShow3.value = -700;
    if (targetShow.value < 0) {
      targetShow.value = 50;
    } else {
      targetShow.value = -1300;
    }
  } else if (val == 2) {
    targetShow.value = -1400;
    targetShow3.value = -700;
    if (targetShow2.value < 0) {
      targetShow2.value = 50;
    } else {
      targetShow2.value = -700;
    }
  } else if (val == 3) {
    targetShow.value = -1400;
    targetShow2.value = -1000;
    if (targetShow3.value < 0) {
      targetShow3.value = 50;
    } else {
      targetShow3.value = -700;
    }
  }
};
// 是否展示图层管理
const showChartList = () => {
  targetShow2.value = -1000;
  targetShow3.value = -700;
  targetShow.value = -1400;
  state.isChartList = !state.isChartList;
};
// 修改标绘样式
const setMapStyle = (row) => {
  state.labelInfo = row;
  flowto(row); // 定位到标绘位置
  state.entityInfo = viewer.entities.getById(row.id); // 获取标绘实例
  state.isCanvaStyle = true;
};
const remMapStyle = (row) => {
  state.labelInfos = state.labelInfos.filter((item) => item.id != row.id);
  viewer.entities.removeById(row.id);
};
// 点击确认关闭样式弹层
const primaryStyle = (row) => {
  // state.newMapAll.forEach((item) => {

  state.labelInfos.forEach((item, index) => {
    if (item.id == row.id) {
      state.labelInfos[index] = row;
    }
  });
  state.isCanvaStyle = false;
};
// 控制标绘展示隐藏
const isShow = (row) => {
  row.show = !row.show;
  let entity = viewer.entities.getById(row.id);
  entity.show = row.show;
};
// 点击标绘列表的定位
const flowto = (row) => {
  if (row.coords) {
    let lonLat = row.coords.split(';')[0].split(',');
    window.viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(
        lonLat[0],
        lonLat[1],
        8000.0
      )
    });
  }
};
// 保存fileID
let fileId = ref();

// 获取标汇信息
const getDraw = () => {
  (state.labelInfos = []), // 点击时间轴获取标绘信息时制空存储的标绘信息
    checkboxes.map((item) => {
      getDrawList({ logId: item }).then((res) => {
        fileId.value = res.rows[0].fileId;
        // 加载底图
        if (res.rows[0].imagePath) {
          initCeium.setGeo(res.rows);
        } else {
          // ElMessage.warning("不存在图层！");
        }
        // 加载标汇
        if (res.rows[0].labelInfos)
          state.labelInfos.push(...res.rows[0].labelInfos); // 将获取到的标绘加进展示列表

        res.rows[0].labelInfos.map((item) => {
          if (item.coords.endsWith(';')) {
            item.coords = item.coords.slice(0, -1);
          }
          if (item.type == 'line') {
            // if (item.coords.endsWith(';')) {
            //   item.coords = item.coords.slice(0, -1);
            // }
            let position = item.coords.split(';');
            const arr = [];
            for (let pair of position) {
              const coords = pair.split(',').map(Number);
              arr.push(coords);
            }
            drawLineFun.setline(item.content, arr, res.rows[0].id, item);
          } else if (item.type == 'face') {
            // if (item.coords.endsWith(';')) {
            //   item.coords = item.coords.slice(0, -1);
            // }
            let position = item.coords.split(';');
            const arr = [];
            for (let pair of position) {
              if (item.coords.endsWith(';')) {
                item.coords = item.coords.slice(0, -1);
              }
              const coords = pair.split(',').map(Number);
              arr.push(coords);
            }
            drawPolygon.setPolygon(item.content, arr, res.rows[0].id, item);
          } else if (item.type == 'ellipse') {
            state.newMapAll.push(item);
            Entities.ellipse(item, res.rows[0].id);
          } else if (item.type == 'rectangle') {
            Entities.rectangle(item, res.rows[0].id);
            state.newMapAll.push(item);
          } else if (item.type == 'label') {
            state.newMapAll.push(item);
            Entities.lookLabel(item, res.rows[0].id);
          } else if (item.type == 'polyline') {
            state.newMapAll.push(item);
            Entities.lookPolyline(item.coords, res.rows[0].id);
          }
        });
      });
    });
};
// 子组件
const descriRef = ref(null);
// 保存
const saveList = () => {
  // bus.emit('submitRadarClick');
  let obj = dataFun();
  let nub = '';
  let status = null;
  for (const item of checkboxes) {
    if (dateList.value.find((info) => info.id == item).targetData.status == 2) {
      status = 2;
      nub = item;
      break;
    } else if (
      dateList.value.find((info) => info.id == item).targetData.status == 0
    ) {
      status = 0;
      nub = item;
      break;
    } else if (
      dateList.value.find((info) => info.id == item).targetData.status == 3
    ) {
      status = 3;
      nub = item;
    }
  }
  let string = '';
  string =
    status == 2
      ? '系统将替换当前记录为正在作业任务，请确认是否继续操作'
      : status == 0
      ? '当前记录为已提交审核，再次更改将撤回审核并替换为正在作业任务，请确认是否继续操作'
      : '';
  if (status == 2 || status == 0) {
    ElMessageBox.confirm(string, '确认提交？', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        obj.id = nub;
        savelabel(obj).then((res) => {
          if (res.code == 200) {
            ElMessage.success(res.msg);
            getLogList({ targetId: targetId.value });
            // showWatch({targetId:targetId.value})//保存之后的数据回显
          }
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消提交'
        });
      });
  } else {
    obj.id = nub;
    savelabel(obj).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.msg);
        getLogList({ targetId: targetId.value });
        // showWatch({targetId:targetId.value})//保存之后的数据回显
      }
    });
  }
};
// // 提交审核
// const submitCheck = () => {
//   // //判断是新增还是编辑
//   let obj = dataFun();
//   let nub = '';
//   checkboxes.forEach((item) => {
//     if (dateList.value.find((info) => info.id == item).targetData.status == 3) {
//       nub = item;
//     }
//   });
//   obj.id = nub;
//   addlabel(obj).then((res) => {
//     if (res.code == 200) {
//       ElMessage.success(res.msg);
//       getLogList({ targetId: targetId.value });
//       // showWatch({targetId:targetId.value})//保存之后的数据回显
//     }
//   });
// };
// 提交审核
const submitCheck = () => {
  let obj = dataFun();
  let nub = '';
  let status = null;
  for (const item of checkboxes) {
    if (dateList.value.find((info) => info.id == item).targetData.status == 2) {
      status = 2;
      nub = item;
      break;
    } else if (
      dateList.value.find((info) => info.id == item).targetData.status == 0
    ) {
      status = 0;
      nub = item;
      break;
    } else if (
      dateList.value.find((info) => info.id == item).targetData.status == 3
    ) {
      status = 3;
      nub = item;
    }
  }
  let string = '';
  string =
    status == 2
      ? '系统将替换当前记录为正在作业任务，请确认是否继续操作'
      : status == 0
      ? '当前记录为已提交审核，再次更改将撤回审核并替换为正在作业任务，请确认是否继续操作'
      : '';
  if (status == 2 || status == 0) {
    ElMessageBox.confirm(string, '确认提交？', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        obj.id = nub;
        addlabel(obj).then((res) => {
          if (res.code == 200) {
            ElMessage.success(res.msg);
            getLogList({ targetId: targetId.value });
          }
        });
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消提交'
        });
      });
  } else {
    obj.id = nub;
    addlabel(obj).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.msg);
        getLogList({ targetId: targetId.value });
      }
    });
  }
};
// 数据处理
const dataFun = () => {
  let returnIds = descriRef.value.returnIds();
  if (returnIds.length > 0) {
    facility(returnIds);
  }
  // let entitiesAll = Entities.entitiesInfo();
  // 目标信息
  let targetInfo = descriRef.value.addTargetMethod();
  // 获取线
  let line = drawLineFun.SetEntity();
  // 获取面
  let polygon = drawPolygon.SetEntity();
  let lineArr = [];
  // 线
  // console.log(line,'lin查看全部线');
  // line.map((item) => {
  //   let str = '';
  //   let linejson = drawLineFun.toGeoJSON(item).geometry.coordinates;
  //   linejson.map((item) => {
  //     str += item[0] + ',';
  //     str += item[1] + ';';
  //   });
  //   lineArr.push({
  //     type: 'line',
  //     coords: str,
  //     content: drawLineFun.getlabel(item)
  //   });
  // });
  // // 面
  // polygon.map((item) => {
  //   let str = '';
  //   let linejson = drawPolygon.toGeoJSON(item).geometry.coordinates;
  //   linejson.map((item) => {
  //     str += item[0] + ',';
  //     str += item[1] + ';';
  //   });
  //   lineArr.push({
  //     type: 'face',
  //     coords: str,
  //     content: drawPolygon.getlabel(item)
  //   });
  // });
  // state.labelInfos.forEach((item) => {
  //   item.id = '';
  //   lineArr.push(item);
  // });
  // let data = state.labelInfos.map((item) => {
  //   item.id = '';
  //   return item;
  // });
  state.labelInfos.forEach((item) => {
    const itemCopy = { ...item, id: '' };
    lineArr.push(itemCopy);
  });
  // if (!!entitiesAll) {
  //   entitiesAll.forEach(item => {
  //     lineArr.push(item)
  //   });
  //   // entitiesAll.forEach(element => {
  //   //   let arr = Object.assign({},element)
  //   //   lineArr.push(arr)
  //   // });
  //   // console.log(Object.assign({}, entitiesAll[0]),'Object.assign({}, entitiesAll[0])');
  //   // lineArr.push(entitiesAll)
  // }
  return {
    targetDto: targetInfo,
    labelInfos: lineArr,
    id: timerId.value,
    fileId: fileId.value,
    targetId: targetId.value
  };
};
// 导出记录
const reportFile = () => {
  //
  // let loadingInstance = ElLoading.service({
  //   lock: true,
  //   text: "生成报告中...",
  //   background: "rgba(0, 0, 0, 0.7)",
  // });
  // exportPdf(timerId.value).then((res) => {
  //   if (res.code == 200) {
  //     loadingInstance.close();
  //     window.open(`${config.fileUrl}/${res.msg}`);
  //   }
  // });
  proxy.download(
    '/target/check/report?id=' + timerId.value,
    {},
    `task_template_${new Date().getTime()}.xlsx`
  );
};
//影像
let timeLayerMap = null; //保存影像实体删除
const yxShow = ref(false);
let YXInfo = ref(null);
const activities = ref([]); //影像时间轴信息
const YXinit = () => {
  let params = {
    fileType: 0,
    targetId: targetId.value
  };
  getTasklist(params).then((res) => {
    if (res.code === 200) {
      activities.value = res.rows;
    }
  });
};

//展示影像列表
const onShowYX = () => {
  YXinit();
  yxShow.value = true;
};
//关闭影像列表
const onCloseYx = () => {
  yxShow.value = false;
};
//加载影像
const onLoadYx = (item) => {
  if (timeLayerMap !== null) {
    window.viewer.imageryLayers.remove(timeLayerMap);
  }
  fileId.value = item.id;
  timerId.value = '';
  YXInfo.value = item;
  let url = `/geoserver${item.visitPath
    .split('?')[0]
    .replace('/geoserver', '')}`;
  let layers = item.visitPath.split('=')[1];
  let imageryProvider = new window.Cesium.WebMapServiceImageryProvider({
    url: `${url}`,
    layers: `intelligence:${layers}`,
    parameters: {
      service: 'WMS',
      format: 'image/png',
      transparent: true
    }
  });
  let wmsLayer = new Cesium.ImageryLayer(imageryProvider);
  window.viewer.imageryLayers.add(wmsLayer);
  timeLayerMap = wmsLayer;
  window.viewer.camera.flyTo({
    destination: window.Cesium.Cartesian3.fromDegrees(
      item.note.split(',')[0],
      item.note.split(',')[1],
      8000.0
    )
  });
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

const tableRowClassName = ({ row, rowIndex }) => {
  if (targetId.value == row.targetId) {
    return 'success-row';
  }
};
</script>

<style lang="scss">
// .setCanvaStyle {
//   position: fixed;
//   right: 90px;
//   top: 150px;
//   height: 50%;
//   width: 300px;
//   background: #182737d4;
//   border: 1px solid #1263a1;
//   padding: 20px;
//   z-index: 10;
//   .canvaFooter {
//     position: absolute;
//     bottom: 20px;
//     right: 30px;

//     .el-button {
//       width: 74px;
//       height: 35px;
//       margin-left: 10px;
//       color: #ffff;
//       background: url('@/assets/images/四字按钮.png') no-repeat;
//       background-size: 100% 100%;
//     }
//   }
//   .canvaBody {
//     .listStyle {
//       display: flex;
//       height: 35px;
//       line-height: 34px;
//       justify-content: space-between;
//       margin-bottom: 8px;
//       color: #fff;
//     }
//   }
//   .el-input {
//     width: 180px;

//     .el-input__inner {
//       // width: 240px;
//       height: 34px;
//       border: 1px solid #1296db;
//       border-radius: 5px;
//     }
//   }
// }

.targetNameStyle {
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: -15px;
  text-align: center;
  font-size: 13px;
  color: #93dcfe;
  z-index: 1;
}

.iconfont {
  font-size: 30px;
  text-align: center;
  color: #9aafbd;
  border-bottom: 1px dashed #114875;
}

.el-overlay {
  .el-overlay-dialog {
    .el-dialog {
      background-color: #152a41 !important;

      .el-dialog__body {
        &>div {
          text-align: center;
          margin-bottom: 10px;
        }
      }

      span {
        color: #fff;
      }

      .el-button--default {
        span {
          color: #000;
        }
      }

      input {
        border: 1px solid #1296db;
      }
    }
  }
}

.recordbox {
  width: 98%;
  height: calc(100% - 50px);
  margin: 0 20px;
  background: url('@/assets/images/recordBg.png') no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;

  .tit {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    background: url('@/assets/images/全屏弹窗头部.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;

    .butStyle {
      position: absolute;
      right: 25px;
      top: 63px;
    }

    .el-button {
      width: 90px;
      height: 30px;
      color: #ffff;
      background: url('@/assets/images/四字按钮.png') no-repeat;
      background-size: 100% 100%;
      margin-top: 5px;
      margin-right: 10px;
    }

    &>p {
      color: #fff;
      line-height: 40px;
      margin-left: 30px;
      font-size: 16px;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
  }

  .dateLine {
    width: 82%;
    height: 55px;
    margin: 10px 0;
    border: 1px solid #13639e9e;
    background: #1e3352;
    display: flex;
    justify-content: space-around;

    .Lbth,
    .Rbth {
      margin-top: 10px;
      cursor: pointer;
    }

    .dateBox {
      width: 92%;
      overflow-x: auto;
      overflow-y: hidden;
      // overflow-x: auto;

      .dateList {
        width: 100%;
        display: flex;
        .icon-daishenhe1 {
          color: #F7E300;
        }
        .icon-yiwancheng1 {
          color: #39ff14;
        }
        .icon-bohui3 {
          color: #FF0000;
        }
        .icon-jinhangzhong2{
          color: #00BFFF;
        }
        ul {
          width: 180px;
          height: 60px;

          li:nth-child(1) {
            width: 100%;
            height: 20px;
            text-align: center;
            border-bottom: 1px solid #13639f;
            position: relative;

            img {
              width: 10px;
              position: absolute;
              top: 13px;
            }
          }

          li:nth-child(2) {
            text-align: center;
            color: #fff;
            padding: 0 10px;

            .el-checkbox {
              .el-checkbox__inner {
                background: #1e3352;
                border-color: #13639f;
              }

              .el-checkbox__inner::after {
                border-color: #000; // 你可以在这里定义你想要的颜色
                background-color: #ffe240;
              }

              .el-checkbox__input.is-checked .el-checkbox__inner {
                background-color: #ffe240; // 你可以在这里定义你想要的颜色
                border-color: #000;
                /* 如果你希望选中时的背景颜色有变化，可以单独设置 */
              }

              .el-checkbox__label {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }

  .mapBox {
    width: 98%;
    margin: auto;
    border: 1px solid #13639e9e;
    height: calc(100% - 150px);
    position: relative;

    // overflow: hidden;
    .tableList {
      top: 40px;

      .pageStyle {}

      &::before {
        content: '';
        height: 20px;
        width: 20px;
        position: absolute;
        top: -12px;
        left: 0;
        background: url('@/assets/images/三角.png') no-repeat;
        background-size: 100% 100%;
      }

      .tableClass {
        position: absolute;
        top: -40px;
        left: 0;
        width: 100%;
        width: calc(100% + 20px);
        display: flex;
        height: 40px;

        &>div {
          width: 50%;
          text-align: center;
          line-height: 40px;
          color: #fff;
          font-weight: bold;
        }

        .left_table {
          margin-right: -10px;
          background: url('@/assets/images/tab目标列表-未选中.png') no-repeat;
          background-size: 100% 100%;
        }

        .isleft_table {
          background: url('@/assets/images/tab目标列表-选中.png') no-repeat;
          background-size: 100% 100%;
        }

        .right_table {
          margin-left: -10px;
          background: url('@/assets/images/tab核查目标列表-未选中.png') no-repeat;
          background-size: 100% 100%;
        }

        .isRight_table {
          background: url('@/assets/images/isRight_table.png') no-repeat;
          background-size: 100% 100%;
        }
      }

      position: absolute;
      left: 40px;
      width: 370px;
      // height: 600px;
      height: 100%;
      background: url('@/assets/images/目标列表框.png') no-repeat;
      background-size: 100% 100%;
      z-index: 9;
      padding: 10px 20px;
      $pageBtnBgCol: #182f4e;
      $pageBtnCol: #409eff;
      $pageBtnHoverCol: #114875;

      .serch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        height: 60px;

        .el-button {
          width: 74px;
          height: 35px;
          margin-left: 10px;
          color: #ffff;
          background: url('@/assets/images/四字按钮.png') no-repeat;
          background-size: 100% 100%;
        }
      }

      .el-pagination__total {
        color: #fff;
      }

      .el-pagination button.is-disabled,
      .el-pagination button:disabled {
        background: $pageBtnBgCol;
      }

      .el-pagination button {
        background: $pageBtnBgCol;
        color: #fff;
      }

      .el-pagination button:hover {
        color: $pageBtnCol;
        background: $pageBtnHoverCol;
      }

      .el-pager li {
        background: $pageBtnBgCol;
        color: #fff;
      }

      .el-pager li:hover {
        color: $pageBtnCol;
        background: $pageBtnHoverCol;
      }

      .el-pager li.is-active {
        color: $pageBtnCol;
        background: $pageBtnHoverCol;
      }

      .el-table {
        --el-table-border-color: none;
      }

      /* 
  // 表格部分样式
   // 最外层透明 */
      .el-table,
      .el-table__expanded-cell {
        background-color: transparent;
        color: #93dcfe;
        font-size: 24px;
      }

      .el-table .el-table__header-wrapper th,
      .el-table .el-table__fixed-header-wrapper th {
        background: transparent;
      }

      /* 表格内背景颜色 */
      .el-table th,
      .el-table tr,
      .el-table td {
        background-color: transparent;
        border: 0px;
        color: #93dcfe;
        font-size: 24px;
        height: 5px;
        font-family: Source Han Sans CN Normal, Source Han Sans CN Normal-Normal;
        font-weight: Normal;
      }

      /* // 设置表格行高度 */
      .el-table__body tr,
      .el-table__body td {
        padding: 0;
        height: 54px;
      }

      .el-table__cell {
        text-align: center;
      }

      /* // 修改高亮当前行颜色 */
      .el-table tbody tr:hover>td {
        background: #063570 !important;
      }

      .el-table .success-row {
        background: #063570 !important;
      }

      // .el-table tbody tr:active > td {
      //   background: #063570 !important;
      // }

      /* 修改表头样式-加边框 */
      /* .el-table__header-wrapper {
   border: solid 1px #04c2ed;
  } */

      /* // 表格斑马自定义颜色 */
      .el-table__row.warning-row {
        background: #182f4e;
      }

      /* 去掉表格里的padding */
      .el-table .cell,
      .el-table th div {
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .el-input__wrapper {
        background: none !important;
        box-shadow: none !important;
      }

      .el-select {
        outline: none;
        background-color: transparent !important;
        border: 1px solid #1296db !important;
        border-radius: 5px;
        box-shadow: none !important;
      }

      .el-input__inner {
        color: #fff;
      }

      height: calc(100% - 40px);
    }

    .chartListSty {
      width: 300px;
      height: 500px;
      position: absolute;
      top: 15%;
      left: auto;
      right: 2%;
      background: #182737d4;
      border: 1px solid #1263a1;

      .header {
        background: url('@/assets/images/新建核查任务 弹窗头部.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 30px;
        position: absolute;
        top: 0px;
        left: 0px;
        color: #ffff;
        line-height: 30px;
        padding-left: 15px;
        font-size: 15px;
      }

      .iconfont {
        font-size: 18px;
        color: #1263a1;
      }

      .el-table--default {
        margin-top: 20px;

        .el-table__row {
          height: 35px;

          .el-table__cell {
            height: 35px;
          }
        }
      }

      &::before {
        display: none;
      }
    }

    .Labeled {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      z-index: 9;
      background: #0a1c31;

      img {
        cursor: pointer;
        padding: 5px;
        border-bottom: 1px dashed #114875;
        width: 35px;
        height: 35px;
      }

      img:nth-child(3) {
        width: 25px;
        padding: 15px 0;
        margin-left: 4px;
      }
    }

    .rBtn {
      z-index: 9;
      position: absolute;
      right: 0;
      top: 40%;

      ul {
        color: #fff;
        display: flex;
        flex-direction: column;

        li {
          writing-mode: vertical-lr;
          padding: 20px 10px;
          background: url('@/assets/images/后台管理.png') no-repeat;
          background-size: 100% 100%;
          margin: 10px 0;
          cursor: pointer;
        }
      }
    }

    .leftBtn {
      position: fixed;
      left: 0;
      left: 40px;
      top: 15%;
      z-index: 1;

      .MBbtn {
        background: url('@/assets/images/check/target.png') no-repeat;
        background-size: 100% 100%;
        width: 40px;
        height: 40px;
      }

      .noMBbtn {
        background: url('@/assets/images/check/targetGL.png') no-repeat;
        background-size: 100% 100%;
        width: 40px;
        height: 40px;
      }
    }

    .target {
      // height: 500px;
      max-height: 100%;
      overflow: auto;
      position: absolute;
      right: -1300px;
      z-index: 9;
      background: #152a41;
      transition: all 1s;
      padding-top: 40px;

      .targetContainer {
        height: 100%;

        overflow: hidden;
        overflow-y: scroll;
      }

      .el-descriptions__extra {
        position: absolute;
        top: 5px;
        right: 20px;
      }
    }

    .about {
      width: 450px;
      height: 100%;
      overflow-y: auto;
      position: absolute;
      right: -500px;
      z-index: 9;
      background: #152a41;
      transition: all 1s;

      .mbDetail {
        position: static !important;
        width: 100%;
        height: 100%;

        .close {
          display: none;
        }

        .main {
          height: calc(100% - 30px);
        }
      }

      .contentTitle,
      .InfoUl,
      .contentTitle,
      .demo-collapse,
      .subFacility,
      .YxPurpose {
        display: none;
      }

      .picTitle {
        display: block;
      }
    }

    .change {
      width: 450px;
      height: 630px;
      overflow-y: auto;
      position: absolute;
      right: -500px;
      z-index: 9;
      background: #152a41;
      transition: all 1s;

      .develop {
        position: static !important;
        width: 100%;
        height: 100%;

        .close {
          display: none;
        }

        .main {
          height: calc(100% - 30px);

          .mainContent {
            height: calc(100% - 40px);
          }
        }
      }
    }
  }

  .yxList {
    width: 300px;
    height: 60vh;
    position: fixed;
    top: 240px;
    right: 200px;

    .yxListContainer {
      width: 100%;
      height: 100%;
      background: #0c1c33;

      .header {
        .upload-demo {
          text-align: end;
          margin-right: 30px;

          .el-button--primary {
            height: 30px;
          }
        }

        background: url('@/assets/images/新建核查任务 弹窗头部.png') no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 30px;
        position: absolute;
        top: 0px;
        left: 0px;

        &::before {
          content: '影像列表';
          position: absolute;
          top: 5px;
          left: 20px;
          font-size: 14px;
          color: white;
        }

        .close {
          position: absolute;
          top: 8px;
          right: 10px;
          background: url('@/assets/images/关闭.png');
          background-size: 100% 100%;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
      }

      .main {
        width: 100%;
        height: calc(60vh - 30px);
        position: absolute;
        top: 30px;
        left: 0px;
        border: 1px solid #1263a1;
        padding: 10px 10px 25px 10px;
        box-sizing: border-box;
        overflow: hidden;
        overflow-y: scroll;
        color: white;

        ul {
          li {
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            line-height: 35px;
            border-bottom: 1px dashed #1296db;

            span:nth-child(2) {
              width: 60%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: right;
            }
          }
        }
      }
    }
  }
}

.el-message-box {
  background: #152a41;

  .el-message-box__title {
    color: #fff;
  }

  .el-message-box__content {
    color: #fff;
  }

  .el-input__wrapper {
    border: 1px solid #1296db;
  }
}

.dialog {
  padding: 0;
  background: #0c1c34;

  .el-dialog__title {
    color: #fff;
  }

  .el-tree {
    background: none !important;
    color: #fff !important;
  }

  .el-tree>.el-tree-node:after {
    border-top: none;
    background-color: transparent !important;
  }

  .el-tree-node:before {
    border-left: 1px dashed #ffffff;
    bottom: 0px;
    height: 100%;
    top: -1.3542vw;
    width: 1px;
    background-color: transparent !important;
  }

  .el-tree-node:after {
    border-top: 1px dashed #ffffff;
    height: 1.0417vw;
    top: 0.625vw;
    width: 1.25vw;
    background-color: transparent !important;
  }

  .el-tree-node__content {
    &:hover {
      background-color: transparent !important;
    }
  }

  .el-tree-node:focus>.el-tree-node__content {
    background-color: transparent !important;
  }

  .el-tree-node.is-current>.el-tree-node__content {
    background-color: transparent !important;
    // font-size: 1vw;
    font-weight: normal;
    letter-spacing: 0vw;
    color: #f2b530;
  }

  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    background: none;
  }
}
</style>
