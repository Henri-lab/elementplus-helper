<!--
 * @Author: XC
 * @Date: 2024-07-18 09:25:48
 * @LastEditors: chenqiming chenqiming
 * @LastEditTime: 2024-07-21 10:34:01
 * @FilePath: \RuoYi-Vue3-3.8.6\src\components\management\index.vue
 * @Description: 
-->

<!--
 * @Author: XC
 * @Date: 2024-07-18 09:25:48
 * @LastEditors: XC
 * @LastEditTime: 2024-07-19 16:03:22
 * @FilePath: \RuoYi-Vue3-3.8.6\src\components\management\index.vue
 * @Description: 核查任务管理
-->
<template>
  <div class="management">
    <div class="tit">
      <p>核查任务管理</p>
    </div>
    <div class="tab">
      <div class="search">
        <div class="left">
          <el-input
            v-model="queryParams.taskName"
            clearable
            style="
              width: 240px;
              height: 34px;
              border: 1px solid #1296db;
              border-radius: 5px;
            "
            placeholder="请输入任务名称"
          />
          <el-select
            v-model="queryParams.userOperatorId"
            class="select_box"
            placeholder="请选择操作员"
            size="small"
            style="width: 240px"
            transfer="true"
            clearable
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in useOptions"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
          <el-select
            v-model="queryParams.createBy"
            class="select_box"
            placeholder="请选择下达任务领导"
            size="small"
            style="width: 240px"
            transfer="true"
            clearable
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in ass"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
          <el-select
            v-model="queryParams.taskStatus"
            class="select_box"
            placeholder="请选择状态"
            size="small"
            style="width: 240px"
            transfer="true"
            clearable
            :popper-append-to-body="false"
          >
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
          <el-button type="primary" @click="getList">查询</el-button>
        </div>
        <!-- <el-button
         style="margin-left: 10px"
         size="small"
         type="success"
         @click="submitUpload"
         >上传到服务器</el-button
        > -->
        <div class="right">
          <!-- <el-upload
            :on-change="changeFile"
            :auto-upload="false"
            :data="uploadForm.data"
            :on-success="submitUpload"
            accept=".xls,.xlsx"
          >
            <template #trigger>
              <el-button size="small" type="primary">导入任务</el-button>
            </template>
          </el-upload> -->
          <!-- getUserList -->
          <el-button type="primary" @click="importTaskxls">导入任务</el-button>
          <el-button type="primary" @click="addNewTask">新建任务</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :highlight-current-row="false"
        empty-text="暂无数据"
        max-height="900"
        border
        style="
          --el-table-border-color: none;
          border-right: 1px #143275 solid;
          border-left: 1px #143275 solid;
          border-bottom: 1px #143275 solid;
          margin-top: 15px;
        "
        :header-cell-style="{
          backgroundColor: '#0e2946',
          color: '#ffffff',
          fontSize: '14px',
          textAlign: 'center',
          borderLeft: '0.5px #154480 solid',
          borderBottom: '1px #154480 solid',
        }"
        :cell-style="{
          color: '#fff',
          fontSize: '14px',
          textAlign: 'center',
          borderBottom: '0.5px #143275 solid',
          borderLeft: '0.5px #143275 solid',
        }"
        :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center' }"
        stripe
      >
        <el-table-column prop="userOperator" label="核查人员" />
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="createBy" label="下达领导" />

        <el-table-column label="任务状态">
          <template #default="scope">
            <TableCellTip :content="scope.row"></TableCellTip>
          </template>
        </el-table-column>
        <el-table-column label="任务详情">
          <template #default="{ row }">
            <!-- <a href="javascript: void (0)" 
                >进度监控</a
              > -->
            <img
              src="../../assets/images/进度监控.png"
              @click.native.stop="showWatch(row)"
              alt=""
              title="进度监控"
              style="cursor: pointer"
            />
            <img
              src="../../assets/images/删除.png"
              @click.native.stop="delTask(row)"
              alt=""
              title="删除任务"
              style="margin-left: 40px; cursor: pointer"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="newTaskDiv" v-if="workShow">
      <div class="newTaskDivContainer">
        <div class="header">
          <i class="close" @click="onNewTaskDivClose"></i>
        </div>
        <div class="main">
          <el-form :model="form" label-width="100px" class="elFrom">
            <el-form-item label="任务名称 :">
              <el-select
                v-model="form.region"
                placeholder="请选择任务名称"
                filterable
                allow-create
                @change="onWorkSelect"
              >
                <el-option
                  v-for="(item, index) in optionSelect1"
                  :key="index"
                  :label="item.taskName"
                  :value="item.taskName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="任务时间 : ">
              <el-date-picker
                @change="onTimeChange"
                v-model="form.dataTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item label="任务描述 : ">
              <el-input
                v-model="form.content"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 20 }"
              />
            </el-form-item>
            <el-form-item label="任务分配 : ">
              <el-select
                v-model="form.user"
                class="select_box"
                placeholder="请选择操作员"
                transfer="true"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in useOptions"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分配模式 : ">
              <el-radio-group v-model="form.radio" @change="onRadioChange">
                <el-radio :label="1">指定目标分配</el-radio>
                <el-radio :label="2">指定范围分配</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div class="taskTree">
            <div class="taskSearch">
              <el-input
                placeholder="请输入关键字"
                v-model="taskTreeInp"
              ></el-input>
              <p class="searchTree" @click="onSearchTree">查询</p>
            </div>
            <el-scrollbar height="calc(300px - 50px)">
              <div class="mytreeContainer">
                <el-tree
                  show-checkbox
                  highlight-current
                  :data="taskTreeMB"
                  :props="defaultProps"
                  :disable-branch-nodes="true"
                  @check="handleChange"
                  ref="treeForm"
                  :filter-node-method="filterNode"
                ></el-tree>
              </div>
            </el-scrollbar>
          </div>
          <div class="treeSelect">
            <ul>
              <li v-for="(item, index) in selectTarget" :key="index">
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>

          <p @click="onSubmit" class="onSure">确定</p>
        </div>
      </div>
    </div>

     <div class="sub" v-show="submitShow">
    <!-- <div class="sub"> -->
      <div class="header">
        <i class="close" @click="submitShow = false"></i>
      </div>
      <div class="main">
        <div class="left">
          <div class="task-details">
            <p style="text-align: left; color: #fff; padding-left: 10px">
              <span>任务名称:</span>
              <span>{{ WatchRow.taskName }}</span>
            </p>
            <p style="text-align: left; color: #fff; padding-left: 10px">
              <span>任务时效:</span>
              <span>{{ WatchRow.startTime }}---{{ WatchRow.endTime }}</span>
            </p>
            <p style="text-align: left; color: #fff; padding-left: 10px">
              <span>任务描述:</span>
              <span>{{ WatchRow.taskExplain }}</span>
            </p>
          </div>
          <div class="task-tree">
            <el-tree
              :data="treeData"
              :indent="0"
              @node-click="checkTarget"
            ></el-tree>
          </div>
        </div>
        <div class="right">
          <Record :isMange=true ></Record>
          <!-- <div class="submap" id="submap">
            <div class="Labeled">
              <img @click="setline" src="@/assets/images/线.png" alt="" />
              <img
                @click="setpolygon"
                src="@/assets/images/标注copy.png"
                alt=""
              />
            </div>
            <div class="switch" :style="{ right: targetShow + 915 + 'px' }">
              <img
                @click="showBox"
                v-show="targetShowImg"
                class="openTar"
                src="@/assets/images/展开.png"
                alt=""
              />
              <img
                @click="showBox"
                v-show="!targetShowImg"
                class="closeTar"
                src="@/assets/images/收起.png"
                alt=""
              />
            </div>
            <div class="targetData" :style="{ right: targetShow + 'px' }">
              <descriptions
                ref="descriRef"
                :tableData="tableList"
              ></descriptions>
            </div>
          </div> -->
          <div class="btn">
            <el-button @click="addFail" type="primary">驳回</el-button>
            <el-button @click="addAssess" type="primary">提交更新</el-button>
            <el-button type="primary" @click="reportFile"> 导出结果 </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <!-- :on-progress="handleFileUploadProgress" -->

      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :auto-upload="false"
        :data="uploadForm.data"
        :on-success="submitUpload"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import initCesium from '@/utils/cesiuminit';
import drawLine from '@/utils/line';
import polygon from '@/utils/polygon';
import { onMounted, ref, getCurrentInstance } from 'vue';
import { listUser } from '@/api/system/user';
import { getToken } from '@/utils/auth';
import {
  getTaskList,
  getTaskSet,
  importTask,
  getTree,
  getTreeArea,
  addTask,
  taskass,
  taskprogress,
  checkassess,
  getLogInfo,
  delTaskInfo,
} from '@/api/frontend/task';
import { checkfail, getDrawList } from '@/api/frontend/record/index';
import TableCellTip from './TableCellTip.vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import descriptions from '@/components/descriptions/index.vue';
import entities from '@/utils/entities1';
const Entities = new entities();
import Record from '../record/index.vue'
import bus from '@/utils/bus';
const { proxy } = getCurrentInstance();
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/target/check/importTask',
});
let drawPolygon, drawLineFun;
onMounted(() => {
  getList();
  getUserList();
  getass();
});
// 用户列表
let useOptions = ref([]);
const getUserList = () => {
  listUser().then((res) => {
    useOptions.value = res.rows;
  });
};
// 领导列表
let ass = ref();
const getass = () => {
  taskass().then((res) => {
    ass.value = res.data;
  });
};
let queryParams = ref({
  taskName: '',
  userName: '',
  pageSize: 10,
  pageNum: 1,
});
let total = ref(0);
// 分页
const handleSizeChange = (val) => {
  queryParams.pageNum = val;
  getList();
};
const handleCurrentChange = (val) => {
  queryParams.pageSize = val;
  getList();
};

//树结构

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
  return labels.some((label) => label.indexOf(value) !== -1);
};

let taskTreeMB = ref(null);
let taskTreeInp = ref(null); //inp
//树结构props
let defaultProps = {
  children: 'children',
  label: 'name',
};
let selectTarget = ref([]); //已选择目标的存放位置
let workShow = ref(false);
const form = reactive({
  region: '', //标签
  content: '', //内容
  dataTime: '', //时间
  associationDoc: '', //关联文件
  user: '',
  radio: 1,
});
const handleChange = (data, children) => {
  if (form.radio === 1) {
    selectTarget.value = children.checkedNodes.filter((item) => {
      return item.attributes.lon !== undefined;
    });
  } else if (form.radio === 2) {
    selectTarget.value = children.checkedNodes.filter((item) => {
      return item.children == undefined;
    });
  }
};

//任务列表
const optionSelect = ref([]);
const optionSelect1 = ref([]);
const onWorkSelect = (e) => {
  let works = optionSelect.value.find((item) => item.taskName === e);
  if (works !== undefined) {
    form.content = works.taskExplain;
    form.dataTime = [works.startTime, works.endTime];
  }
};

// 新建任务
const addNewTask = () => {
  workShow.value = true;
};

//关闭弹窗
const onNewTaskDivClose = () => {
  workShow.value = false;
  form.region = '';
  form.content = '';
  form.dataTime = '';
  form.user = '';
  selectTarget.value = [];
};
//获取目标树
const getMbTree = async () => {
  let result = await getTree();
  if (result.code === 200) {
    taskTreeMB.value = result.data;
  }
};
getMbTree();

//处理 根据指定范围分配查询出来的目标树  转换为 可以使用的树结构
const formatData = (data) => {
  const result = [];
  for (const country in data) {
    const countryNode = {
      name: country,
      children: [],
    };
    for (const area in data[country]) {
      const areaNode = {
        name: area,
        children: data[country][area].map((target) => ({
          name: target.targetName,
          ...target,
        })),
      };
      countryNode.children.push(areaNode);
    }
    result.push(countryNode);
  }
  return result;
};

//获取范围树
const getAreaTree = async () => {
  let result = await getTreeArea();
  if (result.code === 200) {
    taskTreeMB.value = formatData(result.data);
  }
};

//树结构查询
const onSearchTree = () => {
  proxy.$refs.treeForm.filter(taskTreeInp.value);
};
//

const onRadioChange = (e) => {
  selectTarget.value = [];
  if (e === 1) {
    getMbTree();
  } else if (e === 2) {
    getAreaTree();
  }
};

//新增确定按钮
const onSubmit = () => {
  let { region, dataTime, content, user } = form;
  let targetId = [];
  if (selectTarget.value.length) {
    targetId = selectTarget.value.map((item) => {
      return item.attributes.target_id;
    });
  } else {
    targetId = [];
  }
  let data = {
    taskName: region,
    startTime: form.dataTime[0],
    endTime: form.dataTime[1],
    taskExplain: content,
    targetIds: targetId, //选中目标的id
    userOperator: user,
    time: dataTime,
  };
  console.log(data);
  if (!data.taskName) {
    ElMessage({
      message: '请输入名称',
      type: 'info',
    });
    return;
  }
  addTask(data).then((res) => {
    if (res.code === 200) {
      ElMessage({
        message: '新增成功',
        type: 'success',
      });
      onNewTaskDivClose();
      getList();
    }
  });
};

const uploadForm = reactive({
  data: {
    fileId: '1',
    name: '2',
    type: '3',
  },
});

// 数据列表
let tableData = ref([]);
const getList = () => {
  getTaskList(queryParams.value).then((res) => {
    tableData.value = res.rows;
    total.value = res.total;
    optionSelect.value = res.rows;
  });
  getTaskSet().then((res) => {
    optionSelect1.value = res.data;
  });
};
// 重置搜索
const reset = () => {
  queryParams.value = {
    taskName: '',
    userName: '',
    createBy: '',
    pageSize: 10,
    pageNum: 1,
  };
  getList();
};
//  操作显示
let submitShow = ref(false);
// 显示数据
let WatchRow = ref({
  taskName: '',
  startTime: '',
  endTime: '',
  taskExplain: '',
});
// tree
let treeData = ref([]);
// 保存id
let logID = ref();
let fileId = ref();
// 目标tab'
let tableList = ref();
// tree点击
let targetId = ref();
const state = reactive({
  user: {},
  roleGroup: {},
  postGroup: {},
  mapStyle: false,
  styleFrom: {
    content: '',
    size: 25,
    color: '#e7e91e',
  },
  newMapAll: [],
  mapInfo: {},
});
const checkTarget = (row, nodeInfo) => {
  targetId.value = row.targetId;
  logID.value = row.checkLogId;
  // 清除线跟面
  // drawLineFun.deleteAll();
  // drawPolygon.deleteAll();
  viewer.entities.removeAll();
  if (row.checkLogId) {
   
    // 获取影像标注
    // getDrawList({ logId: row.checkLogId }).then((res) => {
    //   fileId.value = res.rows[0].fileId;
    //   // console.log(res.rows, "返回数据");
    //   // 加载底图
    //   if (res.rows[0].imagePath) {
    //     initCesium.setGeo(res.rows);
    //   }
    //   // 加载标汇
    //   if (res.rows[0].labelInfos) {
    //     res.rows[0].labelInfos.map((item) => {
    //       item.coords = item.coords.slice(0, -1);
    //       if (item.type == 'line') {
    //         let position = item.coords.split(';');
    //         const arr = [];
    //         for (let pair of position) {
    //           const coords = pair.split(',').map(Number);
    //           arr.push(coords);
    //         }
    //          drawLineFun.setline(item.content, arr, res.rows[0].id, item);
    //       } else if (item.type == 'face') {
    //         let position = item.coords.split(';');
    //         const arr = [];
    //         for (let pair of position) {
    //           const coords = pair.split(',').map(Number);
    //           arr.push(coords);
    //         }
    //          drawPolygon.setPolygon(item.content, arr, res.rows[0].id, item);
    //       } else if (item.type == 'ellipse') {
    //         state.newMapAll.push(item);
    //         Entities.ellipse(item, res.rows[0].id);
    //       } else if (item.type == 'rectangle') {
    //         Entities.rectangle(item, res.rows[0].id);
    //         state.newMapAll.push(item);
    //       } else if (item.type == 'label') {
    //         state.newMapAll.push(item);
    //         Entities.lookLabel(item, res.rows[0].id);
    //       } else if (item.type == 'polyline') {
    //         state.newMapAll.push(item);
    //         Entities.lookPolyline(item.coords, res.rows[0].id);
    //       }
    //     });
    //   }
    // });
    getLogInfo({ id: row.checkLogId }).then((res) => {
      tableList.value = res.data;
      bus.emit('getDrawList',{id:row.checkLogId,
        tableList:tableList.value
      })
    });
  }
};
// 标汇信息
let drawData = ref([]);
// 进度监控
const showWatch = (val) => {
  WatchRow.value = val;
  submitShow.value = true;
  getTreeData(val.id);
  // initCesium.rendererMap('submap');
  // 绘制线
  drawLineFun = new drawLine({
    viewer: initCesium.viewer,
    onStopDrawing: function (entity) {
      let json = drawLineFun.toGeoJSON(entity);
      let length = drawLineFun.toGeoJSON(entity).geometry.coordinates.length;
      // console.log(entity, "line", json);
      let postioin =
        drawLineFun.toGeoJSON(entity).geometry.coordinates[length - 1];
      //     that.viewWindow.plotlist.plotEnd();
      // that.saveEntity(entity);
      ElMessageBox.prompt('请输入文字', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          drawLineFun.addlabel(value, postioin);
          drawData.value.push(json);
          ElMessage({
            type: 'success',
            message: '添加成功',
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '停止标汇',
          });
          drawLineFun.deleteId(entity);
        });
    },
  });
  // 绘制面
  drawPolygon = new polygon({
    viewer: initCesium.viewer,
    onStopDrawing: function (entity) {
      let json = drawPolygon.toGeoJSON(entity);
      // console.log(entity, json, "mian");
      let length = drawPolygon.toGeoJSON(entity).geometry.coordinates.length;
      let postioin =
        drawPolygon.toGeoJSON(entity).geometry.coordinates[length - 1];
      ElMessageBox.prompt('请输入文字', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          drawPolygon.addlabel(value, postioin);
          ElMessage({
            type: 'success',
            message: '添加成功',
          });
          drawData.value.push(json);
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '停止标汇',
          });
          drawPolygon.deleteId(entity);
        });
    },
  });
};

const setline = () => {
  drawLineFun.startDraw();
};

const setpolygon = () => {
  drawPolygon.startDraw();
};
// 获取属性列表
const getTreeData = (id) => {
  taskprogress({ taskId: id }).then((res) => {
    const tree = res.data;
    tree.forEach((item, index) => {
      item.label = item.user;
      item.children = item.list;
      if (item.children.length) {
        item.children.forEach((sonItem) => {
          sonItem.label = sonItem.targetName;
        });
      }
    });
    treeData.value = tree;
  });
};
// 驳回
const addFail = () => {
  checkfail({ logId: logID.value }).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
    }
  });
};
// 提交更新
const addAssess = () => {
  bus.emit('addAssess',{id:logID.value,
    targetId:targetId.value
  })
  // let obj = dataFun();
  // checkassess(obj).then((res) => {
  //   if (res.code == 200) {
  //     ElMessage.success(res.msg);
  //   }
  // });
};
// 数据处理
let descriRef = ref();
const dataFun = () => {
  // 目标信息
  let targetInfo = descriRef.value.addTargetMethod();
  // 获取线
  let line = drawLineFun.SetEntity();
  // 获取面
  let polygon = drawPolygon.SetEntity();
  // console.log(line, polygon);
  let lineArr = [];
  // 线
  line.map((item) => {
    let str = '';
    let linejson = drawLineFun.toGeoJSON(item).geometry.coordinates;
    linejson.map((item) => {
      str += item[0] + ',';
      str += item[1] + ';';
    });
    lineArr.push({
      type: 'line',
      coords: str,
      content: drawLineFun.getlabel(item),
    });
  });
  // 面
  polygon.map((item) => {
    let str = '';
    let linejson = drawPolygon.toGeoJSON(item).geometry.coordinates;
    linejson.map((item) => {
      str += item[0] + ',';
      str += item[1] + ';';
    });
    lineArr.push({
      type: 'face',
      coords: str,
      content: drawPolygon.getlabel(item),
    });
  });
  state.newMapAll.forEach((item) => {
    item.id = '';
    lineArr.push(item);
  });
  return {
    targetDto: targetInfo,
    labelInfos: lineArr,
    id: logID.value,
    fileId: fileId.value,
    targetId: targetId.value,
  };
};
// 目标信息显示隐藏
let targetShow = ref(-915);
let targetShowImg = ref(true);
const showBox = () => {
  targetShowImg = !targetShowImg;
  if (targetShowImg) {
    targetShow.value = -915;
  } else {
    targetShow.value = 0;
  }
};
const importTaskxls = () => {
  upload.title = '数据导入';
  upload.open = true;
};
// 导出结果
const reportFile = () => {
  proxy.download(
    '/target/check/report?id=' + logID.value,
    {},
    `task_template_${new Date().getTime()}.xlsx`
  );
};
// 下载模板
const importTemplate = () => {
  proxy.download(
    '/target/check/exportTask',
    {},
    `task_template_${new Date().getTime()}.xlsx`
  );
};
// 确定导入
const submitFileForm = () => {
  proxy.$refs['uploadRef'].submit();
};
// 上传过程
// const changeFile = (uploadFile) => {
//   file.value = uploadFile;
//   submitUpload();
// };
// 上传成功
const submitUpload = async (response, file, fileList) => {
  // const jsonStr = JSON.stringify(uploadForm.data);
  // const blob = new Blob([jsonStr], {
  //   type: "application/json",
  // });
  // let formData = new FormData();
  // formData.append("file", file.value.raw);
  // const res = await uploadFile(formData);
  // if (res.code == 200) {
  //   await importTask(res.fileName).then((resolveData) => {
  //     if (resolveData.code == 200) {
  //       console.log(resolveData, "res");
  //       getList();
  //     }
  //   });
  // }
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs['uploadRef'].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      '</div>',
    '导入结果',
    { dangerouslyUseHTMLString: true }
  );
  getList();
};

//删除任务
const delTask = (row) => {
  console.log(row.id);
  delTaskInfo(row.id).then((res) => {
    console.log(res);
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getList();
    }
  });
};
</script>

<style lang="scss">
.management {
  width: 98%;
  height: calc(100% - 50px);
  margin: 0 20px;
  background: url('@/assets/images/recordBg.png') no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  position: relative;
  .tit {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    background: url('@/assets/images/全屏弹窗头部.png') no-repeat;
    background-size: 100% 100%;
    & > p {
      color: #fff;
      line-height: 35px;
      margin-left: 30px;
      font-size: 14px;
      font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
        'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
  }
  .tab {
    .search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 60px;
      .el-select {
        margin: 0 10px;
        .select-trigger {
          line-height: 30px;
          padding: 5px 8px;
          background-color: transparent !important;
          border: 1px solid #1296db !important;
          box-shadow: none !important;
          border-radius: 5px;
        }
      }
      .el-input__wrapper {
        background: none !important;
        box-shadow: none !important;
      }
      .el-input__inner {
        background: transparent;
        color: #fff;
      }
      .el-input__inner::placeholder {
        color: #fff;
      }
      .right {
        display: flex;
      }
      .el-button {
        width: 100px;
        height: 41px;
        margin-left: 10px;
        color: #ffff;
        background: url('@/assets/images/四字按钮.png') no-repeat;
        background-size: 100% 100%;
      }
    }
    .el-table {
      width: 98%;
      margin: 0 auto;
      border: 1px solid #14639f;
      margin-top: 10px;
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
    .el-table tbody tr:hover > td {
      background: #063570 !important;
    }

    /* // 表格斑马自定义颜色 */
    .el-table--striped
      .el-table__body
      tr.el-table__row--striped
      td.el-table__cell {
      background: #182f4e;
    }
    $pageBtnBgCol: #182f4e;
    $pageBtnCol: #409eff;
    $pageBtnHoverCol: #114875;
    .el-pagination {
      position: absolute;
      right: 10px;
      bottom: 10px;
      .el-input__inner {
        color: #fff;
      }
    }
    .el-pagination__total,
    .el-pagination__classifier,
    .el-pagination__goto {
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
  }
  .newTaskDiv {
    width: 550px;
    height: 80vh;
    // background: rgba(255,255,255,0.6);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    .newTaskDivContainer {
      width: 100%;
      height: 100%;
      background: rgba(15, 31, 52);
      .header {
        background: url('@/assets/images/新建核查任务 弹窗头部.png');
        background-size: 100% 100%;
        width: 100%;
        height: 30px;
        position: absolute;
        top: 0px;
        left: 0px;
        &::before {
          content: '新建核查任务';
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
        height: calc(80vh - 30px);
        position: absolute;
        top: 30px;
        left: 0px;
        border: 1px solid #1263a1;
        padding: 10px 5px 25px 15px;
        box-sizing: border-box;
        .onSure {
          background: url('@/assets/images/按钮.png');
          background-size: 100% 100%;
          width: 80px;
          height: 35px;
          text-align: center;
          color: white;
          position: absolute;
          bottom: 20px;
          right: 20px;
          line-height: 35px;
          font-size: 14px;
          cursor: pointer;
        }
        .searchTree {
          background: url('@/assets/images/按钮.png');
          background-size: 100% 100%;
          width: 80px;
          height: 35px;
          text-align: center;
          color: white;
          line-height: 35px;
          font-size: 14px;
          cursor: pointer;
        }
        .taskTree {
          width: 60%;
          height: 300px;
          border: 1px dashed #0f5b9c;
          padding: 10px;
          float: left;
          .taskSearch {
            display: flex;
            justify-content: space-between;
            .el-input {
              width: 200px !important;
            }
            .el-input__wrapper {
              background: #022544 !important;
              border: 1px solid #0e4c79 !important;
            }
          }
        }
        .treeSelect {
          width: 35%;
          height: 300px;
          border: 1px dashed #0f5b9c;
          padding: 10px;
          float: right;
          overflow: hidden;
          overflow-y: scroll;
          ul {
            li {
              color: white;
              font-size: 12px;
              line-height: 25px;
            }
          }
        }

        // main滚动条
        .main::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: rgba(149, 148, 148, 0.2);
        }

        .main::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .main::-webkit-scrollbar-track {
          background-color: transparent;
        }
        //main  滚动条---end

        .el-form-item__label {
          color: white !important;
        }

        .el-textarea__inner {
          width: 99% !important;
          background: #022544;
          border: 1px solid #0e4c79;
          box-shadow: none;
          color: white;
        }

        .el-select {
          width: 99% !important;
          background: #022544;
          border: 1px solid #0e4c79;
          color: white;
        }
        .el-select__tags .el-tag--info {
          background: #0e4c79;
          color: #34c390;
        }

        .el-tag .el-icon {
          color: white;
        }

        .el-input__wrapper {
          background: transparent;
          box-shadow: none;
        }
        .el-input__inner {
          color: white;
        }

        .el-date-editor.el-input,
        .el-date-editor.el-input__wrapper {
          width: 97% !important;
          background: #022544 !important;
          border: 1px solid #0e4c79 !important;
        }
        .el-radio {
          color: white !important;
        }
        .el-date-editor .el-range-input {
          color: white !important;
        }
      }
    }
  }
  .sub {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    background: rgba(15, 31, 52);
    .header {
      background: url('@/assets/images/新建核查任务 弹窗头部.png');
      background-size: 100% 100%;
      width: 100%;
      height: 30px;
      position: absolute;
      top: 0px;
      left: 0px;
      &::before {
        content: '进度监控';
        position: absolute;
        top: 5px;
        left: 60px;
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
      height: calc(100% - 30px);
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 20%;
        .task-details {
          width: 100%;
          height: 200px;
          background: #152a41;
          border: 1px solid #143355;
          margin: 10px;
          padding: 10px;
          p {
            line-height: 30px;
          }
        }
        .task-tree {
          width: 100%;
          height: 400px;
          background: #152a41;
          border: 1px solid #143355;
          margin: 10px;
          padding: 10px;
          .el-tree {
            background: none !important;
            color: #fff !important;
          }
          .el-tree > .el-tree-node:after {
            border-top: none;
            background-color: transparent !important;
          }

          .el-tree-node {
            position: relative;
            padding-left: 0.5208vw;
          }

          .el-tree-node__children {
            padding-left: 0.8333vw;
          }

          .el-tree-node :last-child:before {
            height: 1.9792vw;
          }

          .el-tree > .el-tree-node:before {
            border-left: none;
          }

          .el-tree > .el-tree-node:after {
            border-top: none;
          }

          .el-tree-node:before {
            content: '';
            left: -4px;
            position: absolute;
            right: auto;
            border-width: 1px;
          }

          .el-tree-node:after {
            content: '';
            left: -4px;
            position: absolute;
            right: auto;
            border-width: 1px;
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

          /* // 修改按钮 */
          .el-tree .el-tree-node__expand-icon.expanded {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          .el-tree .el-icon.el-tree-node__expand-icon svg {
            display: none !important;
          }
          .el-tree .el-icon.el-tree-node__expand-icon {
            background: url('@/assets/images/add.png') no-repeat 0 !important;
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            font-size: 14px;
            background-size: 16px;
          }
          .el-tree .el-icon.el-tree-node__expand-icon.expanded {
            background: url('../../assets/images/del.png') no-repeat 0 !important;
            content: '';
            display: block;
            width: 16px;
            height: 16px;
            font-size: 14px;
            background-size: 16px;
          }

          .is-leaf.el-icon.el-tree-node__expand-icon {
            display: none !important;
          }

          .el-tree-node__content {
            &:hover {
              background-color: transparent !important;
            }
          }

          .el-tree-node:focus > .el-tree-node__content {
            background-color: transparent !important;
          }

          .el-tree-node.is-current > .el-tree-node__content {
            background-color: transparent !important;
            // font-size: 1vw;
            font-weight: normal;
            letter-spacing: 0vw;
            color: #f2b530;
          }
        }
      }
      .right {
        width: 78%;
        height: 100%;
        overflow: hidden;
        .submap {
          width: 100%;
          height: 90%;
          position: relative;
          .switch {
            position: absolute;
            top: 40%;
            right: 0px;
            width: 30px;
            z-index: 9;
            transition: all 1s;
          }
          .targetData {
            height: 500px;
            overflow-y: auto;
            position: absolute;
            right: 0px;
            z-index: 9;
            background: #152a41;
            transition: all 1s;
          }
          .Labeled {
            position: absolute;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            z-index: 9;
            background: #0a1c31;

            img {
              cursor: pointer;
              padding: 10px 5px;
              border-bottom: 1px dashed #114875;
            }
            img:nth-child(1) {
              width: 25px;
              padding: 15px 0;
              margin-left: 3px;
            }
          }
        }
        .btn {
          position: absolute;
          right: 0;
          bottom: 10px;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/styles/tree.scss';
::v-deep .el-select-dropdown__item:hover {
  background-color: #4475ad !important;
}
::v-deep .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background-color: transparent !important;
}
</style>
