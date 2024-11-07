<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="目标名称">
        <el-input v-model="queryParams.targetName" placeholder="请输入目标名称" clearable style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="目标类别">
        <el-input v-model="queryParams.targetType" placeholder="请输入目标类别" clearable style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <!--  -->
      <el-form-item label="国家">
        <el-input v-model="queryParams.country" placeholder="请输入国家" clearable style="width: 240px"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:role:add']">新增</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:role:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <!-- <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:role:export']"
            >导入目标</el-button> -->
        <!--   accept=".xls,.xlsx" -->
        <el-upload :on-change="changeFile" :auto-upload="false" :data="uploadForm.data" :on-success="submitUpload"
          :on-progress="handleUploadProgress">
          <template #trigger>
            <el-button type="primary">导入目标</el-button>
          </template>
        </el-upload>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="目标名称" prop="targetName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="目标类型" prop="targetType" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="国家（地区）" prop="country" />
      <el-table-column label="经度" prop="centerLon" />
      <el-table-column label="纬度" prop="centerLat" />
      <el-table-column label="海拔高（米）" prop="highAltitude" />
      <!-- 相关文件 -->
      <el-table-column label="相关文件">
        <template #default="scope">
          <!-- <router-link :to="'/system/target-data/index/' + scope.row.id" class="link-type">
            <span> 相关文件</span>
          </router-link> -->

          <router-link :to="'/system/target-data/index/' + scope.row.id" class="link-type">
            相关文件
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!-- <el-tooltip
            content="详情"
            placement="top"
            v-if="scope.row.roleId !== 1"
          >
            <el-button
              link
              type="primary"
              icon="Warning"
              @click="handleUpdate(scope.row, '目标详情')"
              v-hasPermi="['system:role:remove']"
            ></el-button>
          </el-tooltip> -->
          <el-tooltip content="修改" placement="top" v-if="scope.row.roleId !== 1">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row, '修改目标')"
              v-hasPermi="['system:role:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" v-if="scope.row.roleId !== 1">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改角色配置对话框  NEED UPDATE@hf-->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body :before-close="cancel">
      <Table ref="anotherSon" @cancels="cancel" @getList="getList" :formData="formData"></Table>
      <template #footer>
        <div class="dialog-footer" v-show="disabledVal">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree class="tree-border" :data="deptOptions" show-checkbox default-expand-all ref="deptRef" node-key="id"
            :check-strictly="!form.deptCheckStrictly" empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <div v-if="loadingExport" v-loading="loadingExport" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)" :element-loading-text="loadingText" style="
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
      "></div>
  </div>
</template>

<script setup name="Role">
import { isValidLongitude, isValidLatitude } from '@/utils/validate';
import { lonDMS, latDMS, transformToNum } from '@/utils/lonLat'
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  getRole,
  listRole,
  updateRole,
  deptTreeSelect,
  details
} from "@/api/system/role";
import { uploadFile, FileInfo, getTargetList, removeTargetList } from "@/api/behindInterface/targetManage/index.js"
// import { getTaskLog, uploadFile, FileInfo } from "@/api/api/check";
// import { getTargetList, removeTargetList, getDetail } from "@/api/api/target";
import {
  roleMenuTreeselect,
  treeselect as menuTreeselect,
} from "@/api/system/menu";
import Table from "@/components/target/table";
import { ElMessage } from "element-plus";
const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const menuOptions = ref([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const openDataScope = ref(false);
const menuRef = ref(null);
const deptRef = ref(null);

const anotherSon = ref(null);

/**导入目标文件 */

const loadingExport = ref(false); // 遮罩层控制
const loadingText = ref("文件导入中......"); //遮罩层的文字

const file = ref();
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
  loadingText.value = "文件导入中......";
  loadingExport.value = true;
  const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: "application/json",
  });
  let formData = new FormData();
  formData.append("file", file.value.raw);
  const res = await uploadFile(formData);

  if (res.code == 200) {
    loadingExport.value = false;
    loadingText.value = "文件导入成功";
    let params = {
      path: res.fileName,
    };
    ElMessage({
      type: "success",
      message: "导入成功!",
    });
    await FileInfo(res.fileName).then((resolveData) => {
      if (resolveData.code == 200) {
        getList();
      }
    });
  }
};

//上传进度检测
const handleUploadProgress = (event, file, fileList) => {
  console.log(event);
};

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    targetName: undefined,
    targetType: undefined,
    country: undefined,
  },
  rules: {
    roleName: [
      { required: true, message: "角色名称不能为空", trigger: "blur" },
    ],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [
      { required: true, message: "角色顺序不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询角色列表 */
function getList() {
  loading.value = true;

  getTargetList(queryParams.value).then((response) => {
    roleList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
  // listRole(proxy.addDateRange(queryParams.value, dateRange.value)).then(
  //   (response) => {
  //     roleList.value = response.rows;
  //     total.value = response.total;
  //     loading.value = false;
  //   }
  // );
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    targetName: undefined,
    targetType: undefined,
    country: undefined,
  };
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id || ids.value;
  console.log(roleIds);
  proxy.$modal
    .confirm("是否确认删除该目标?")
    .then(function () {
      return removeTargetList(roleIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
  // proxy.download("system/role/export", {
  //   ...queryParams.value,
  // }, `role_${new Date().getTime()}.xlsx`);
  console.log(11111, "123123");
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.roleName + '"角色吗?')
    .then(function () {
      return changeRoleStatus(row.roleId, row.status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + "成功");
    })
    .catch(function () {
      row.status = row.status === "0" ? "1" : "0";
    });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleDataScope":
      handleDataScope(row);
      break;
    case "handleAuthUser":
      handleAuthUser(row);
      break;
    default:
      break;
  }
}
/** 分配用户 */
function handleAuthUser(row) {
  router.push("/system/role-auth/user/" + row.roleId);
}
/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then((response) => {
    menuOptions.value = response.data;
  });
}
/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  form.value = {
    roleId: undefined,
    roleName: undefined,
    roleKey: undefined,
    roleSort: 0,
    status: "0",
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined,
  };
  proxy.resetForm("roleRef");
}
/** 添加角色 */
function handleAdd() {
  // reset();
  // getMenuTreeselect();
  open.value = true;
  title.value = "添加目标";
}
/** 修改角色 */
let formData = ref();
let disabledVal = ref(true);
function handleUpdate(row, val) {
  if (val == "目标详情") {
    disabledVal.value = false;
  } else {
    disabledVal.value = true;
  }
  //NEED UPDATE@hf 
  title.value = val;
  details({ id: row.id }).then((res) => {  //首页/系统管理/目标管理>目标名称--id:目标索引
    formData.value = clone(res.data);//parse
    open.value = true;
    setTimeout(() => {
      anotherSon.value.handleUpdates(formData);
    }, 100);
  })
  // open.value = true;
  // reset();
  // const roleId = row.roleId || ids.value;
  // const roleMenu = getRoleMenuTreeselect(roleId);
  // getRole(roleId).then((response) => {
  //   form.value = response.data;
  //   form.value.roleSort = Number(form.value.roleSort);
  //   open.value = true;
  //   nextTick(() => {
  //     roleMenu.then((res) => {
  //       let checkedKeys = res.checkedKeys;
  //       checkedKeys.forEach((v) => {
  //         nextTick(() => {
  //           menuRef.value.setChecked(v, true, false);
  //         });
  //       });
  //     });
  //   });
  //   title.value = "修改角色";
  // });
}
/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(roleId) {
  return roleMenuTreeselect(roleId).then((response) => {
    menuOptions.value = response.menus;
    return response;
  });
}
/** 根据角色ID查询部门树结构 */
function getDeptTree(roleId) {
  return deptTreeSelect(roleId).then((response) => {
    deptOptions.value = response.depts;
    return response;
  });
}
/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value ? true : false;
  }
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}
/** 提交按钮 */
function submitForm() {
  // 修改目标时提交验证@hf
  // console.log('提交按钮（修改目标）')
  // console.log(form.value, 'form.value')
  // console.log(formData.value, 'formData.value')
  const lonFlag = lonDMS(formData.value.centerLon) || isValidLongitude(formData.value.centerLon)
  const latFlag = latDMS(formData.value.centerLat) || isValidLatitude(formData.value.centerLat)
  if (!lonFlag || !latFlag) {
    ElMessage.error('监测您的中心点坐标有误，请检查后重新提交');
    return;
  }
  if (!formData.value.targetName) {
    ElMessage.error('请填写目标名称');
    return
  }
  if (!formData.value.targetType) {
    ElMessage.error('请填写目标类别');
    return
  }
  if (!formData.value.country) {
    ElMessage.error('请填写国家（地区）');
    return
  }

  // 将d-m-s转换为数字
  if (lonDMS(formData.value.centerLon)) {
    formData.value.centerLon = transformToNum(formData.value.centerLon)
    console.log(formData.value.centerLon, 'formData.value.centerLon')
  }
  if (latDMS(formData.value.centerLon)) {
    formData.value.centerLat = transformToNum(formData.value.centerLat)
    console.log(formData.value.centerLat, 'formData.value.centerLat')
  }
  anotherSon.value.addTargetMethod();
  // proxy.$refs["roleRef"].validate((valid) => {
  //   if (valid) {
  //     if (form.value.roleId != undefined) {
  //       form.value.menuIds = getMenuAllCheckedKeys();
  //       updateRole(form.value).then((response) => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         getList();
  //       });
  //     } else {
  //       form.value.menuIds = getMenuAllCheckedKeys();
  //       addRole(form.value).then((response) => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         getList();
  //       });
  //     }
  //   }
  // });
}
/** 取消按钮 */
function cancel() {
  anotherSon.value.clear();
  open.value = false;
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== "2") {
    deptRef.value.setCheckedKeys([]);
  }
}
/** 分配数据权限操作 */
function handleDataScope(row) {
  reset();
  const deptTreeSelect = getDeptTree(row.roleId);
  getRole(row.roleId).then((response) => {
    form.value = response.data;
    openDataScope.value = true;
    nextTick(() => {
      deptTreeSelect.then((res) => {
        nextTick(() => {
          if (deptRef.value) {
            deptRef.value.setCheckedKeys(res.checkedKeys);
          }
        });
      });
    });
    title.value = "分配数据权限";
  });
}
/** 提交按钮（数据权限） */
function submitDataScope() {

  if (form.value.roleId != undefined) {
    form.value.deptIds = getDeptAllCheckedKeys();
    dataScope(form.value).then((response) => {
      proxy.$modal.msgSuccess("修改成功");
      openDataScope.value = false;
      getList();
    });
  }
}
/** 取消按钮（数据权限）*/
function cancelDataScope() {
  openDataScope.value = false;
  reset();
}

getList();
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
</script>

<style>
.el-upload-list {
  display: none !important;
}

.el-form-item {
  margin-right: 10px !important;
}

.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  background: #fff;
  color: #000;
}
</style>

<style scoped>
::v-deep .el-textarea__inner {
  color: black;
  /* border: none;
  box-shadow: none; */
}
</style>
