<template>
  <div class="app-container">
    <!-- 文件搜索、重置 -->
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item label="文件名称">
        <el-input
          v-model="queryParams.targetName"
          placeholder="请输入文件名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="文件类型">
        <!-- <el-input
          v-model="queryParams.targetType"
          placeholder="文件类型"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        /> -->
        <el-select
          v-model="queryParams.fileType"
          placeholder="请选择文件类型"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--  -->
      <el-form-item label="上传时间">
        <!-- <el-input
          v-model="queryParams.country"
          placeholder="上传时间"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        /> -->
        <el-date-picker
          v-model="queryParams.fileTime"
          type="datetime"
          placeholder="请选择上传时间"
          format="YYYY/MM/DD hh:mm:ss"
          value-format="YYYY-MM-DD h:m:s a"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文件删除、导入 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <!-- <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
               v-hasPermi="['system:role:export']"
            >导入文件</el-button> -->
        <!--   accept=".xls,.xlsx" -->
        <el-upload
          :limit="10"
          multiple
          :on-change="changeFile"
          :auto-upload="false"
          :data="uploadForm.data"
          :on-success="submitUpload"
        >
          <template #trigger>
            <el-button type="primary">导入文件</el-button>
          </template>
        </el-upload>
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <!-- 文件列表（表格）-->
    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件名称" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>
            {{ scope.row.fileName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" :show-overflow-tooltip="true">
        <template #default="scope">
          <span v-if="scope.row.fileType === 0"> 影像 </span>
          <span v-if="scope.row.fileType === 1"> 图片 </span>
          <span v-if="scope.row.fileType === 2"> 视频 </span>
          <span v-if="scope.row.fileType === 3"> 文档 </span>
          <span v-if="scope.row.fileType === 4"> 信号 </span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" prop="fileSize" />
      <el-table-column
        label="上传时间"
        prop="fileTime"
        :formatter="formatDate"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip
            content=" 预览"
            placement="top"
            v-if="scope.row.roleId !== 1"
          >
            <el-button
              link
              type="primary"
              icon="View"
              @click="ViewFile(scope.row)"
              v-hasPermi="['system:role:remove']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            content="下载"
            placement="top"
            v-if="scope.row.roleId !== 1"
          >
            <el-button
              link
              type="primary"
              icon="UploadFilled"
              @click="downloadFile(scope.row)"
              v-hasPermi="['system:role:remove']"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
            v-if="scope.row.roleId !== 1"
          >
            <el-button
              link
              type="primary"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:role:remove']"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 对话框 -->
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                placement="top"
              >
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="title"
      v-model="openDataScope"
      width="500px"
      append-to-body
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox
            v-model="deptExpand"
            @change="handleCheckedTreeExpand($event, 'dept')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="deptNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'dept')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.deptCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'dept')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 图像预览 -->
    <div class="img-viewer-box">
      <el-image-viewer
        v-if="visibleImg"
        :url-list="visibleImgUrl"
        @close="close"
      />
    </div>
    <YXmap v-if="yxRow.show" :row="yxRow.row" @changeShow="changeShow"></YXmap>
  </div>
</template>

<script setup name="Role">
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  getRole,
  listRole,
  updateRole,
  deptTreeSelect,
} from '@/api/system/role';
import { getTaskLog, uploadFile, FileInfo } from '@/api/behindInterface/check';
import {
  getInfoList,
  removeFileList,
  addFileInfo,
} from '@/api/behindInterface/file';
import {
  roleMenuTreeselect,
  treeselect as menuTreeselect,
} from '@/api/system/menu';
import { renderDocx } from '@/utils/file';
import YXmap from './components/YXmap.vue';
const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict('sys_normal_disable');

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref('');
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
const visibleImg = ref(false);
const visibleImgUrl = ref([]);
const yxRow = reactive({
  show: false,
  row: {},
});
//方法区
const changeShow = (val) => {
  yxRow.show = val;
};

const formatDate = (row, column) => {
  // 获取单元格数据
  let data = row[column.property];
  if (data == null) {
    return null;
  }
  let dt = new Date(data);
  return (
    dt.getFullYear() +
    '-' +
    (dt.getMonth() + 1) +
    '-' +
    dt.getDate() +
    ' ' +
    dt.getHours() +
    ':' +
    dt.getMinutes() +
    ':' +
    dt.getSeconds()
  );
};
/**导入文件文件 */
const file = ref();
const changeFile = (uploadFile) => {
  file.value = uploadFile;
  // console.log(file.value, 'uploadFile');
  submitUpload();
};
const uploadForm = reactive({
  data: {
    fileId: '1',
    name: '2',
    type: '3',
  },
});
const submitUpload = async () => {
  const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: 'application/json',
  });
  let formData = new FormData();
  formData.append('file', file.value.raw);
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value, 'formData');
  // }
  const res = await uploadFile(formData);
  if (res.code == 200) {
    // 可以 将doc和docx文件用pdf格式上传 @hf
    // const file = { suffix: res.fileName.split('.')[1] };
    // if (file.suffix == 'doc' || file.suffix == 'docx') {
    //   res.fileName = res.fileName.replace(file.suffix, 'pdf');
    //   console.log(res.fileName, 'res.fileName')
    // }
    let params = {
      filePath: res.fileName,
      targetId: router.currentRoute.value.params.targetId,
    };
    await addFileInfo(params).then((resolveData) => {
      if (resolveData.code == 200) {
        proxy.$modal.msgSuccess('上传成功');
        getList();
      }
    });
  }
};
/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
]);

const data = reactive({
  form: {},
  queryParams: {
    //上传的文件列表 查询参数
    pageNum: 1,
    pageSize: 10,
    fileTime: undefined,
    country: undefined,
    targetId: router.currentRoute.value.params.targetId,
  },
  rules: {
    roleName: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' },
    ],
    roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
    roleSort: [
      { required: true, message: '角色顺序不能为空', trigger: 'blur' },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);
// 文件类型0 影像 1相关图片 2视频 3文档 4信号
const options = [
  {
    value: 0,
    label: '影像',
  },
  {
    value: 1,
    label: '图片',
  },
  {
    value: 2,
    label: '视频',
  },
  {
    value: 3,
    label: '文档',
  },
  {
    value: 4,
    label: '信号',
  },
];
/** 查询角色列表 */
function getList() {
  loading.value = true;
  getInfoList(queryParams.value).then((response) => {
    roleList.value = response.rows; //全部文件列表
    total.value = response.total; //全部文件条目
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
  proxy.resetForm('queryRef');
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    fileType: undefined,
    fileTime: undefined,
    targetId: router.currentRoute.value.params.targetId,
  };
  handleQuery();
}
/** 删除按钮操作 */
function handleDelete(row) {
  const roleIds = row.id || ids.value;
  proxy.$modal
    .confirm('是否确认删除该文件?')
    .then(function () {
      return removeFileList(roleIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess('删除成功');
    })
    .catch(() => {});
}
// 下载
const config = proxy.$config;
const downloadFile = (row) => {
  proxy.download(
    '/common/download',
    {
      filePath: row.filePath,
    },
    row.fileName
  );
  // let type = row.fileName.split(".")[1];
  // console.log(row);
  // // if(type === "pdf") {
  // let fileName = row.fileName;
  // if ("download" in document.createElement("a")) {
  //   let a = document.createElement("a");
  //   a.href = config.imgUrl + row.filePath;
  //   a.download = fileName;
  //   a.style.display = "none";
  //   document.body.appendChild(a);
  //   a.click();
  //   URL.revokeObjectURL(a.href);
  //   document.body.removeChild(a);
  // } else {
  //   navigator.msSaveBlob(blob, fileName);
  // }
  // }
};
const ViewFile = async (row) => {
  // let fileName = row.fileName;
  // if ("download" in document.createElement("a")) {
  //   let a = document.createElement("a");
  //   a.href = config.imgUrl + row.filePath;
  //   a.download = fileName;
  //   a.style.display = "none";
  //   document.body.appendChild(a);
  //   a.click();
  //   URL.revokeObjectURL(a.href);
  //   document.body.removeChild(a);
  // } else {
  //   navigator.msSaveBlob(blob, fileName);
  // }

  // const url = config.imgUrl + row.filePath;
  // window.open(url, "_blank");
  if (row.fileType == 0) {
    yxRow.show = true;
    yxRow.row = row;
  } else {
    let url = '/dev-api' + row.filePath;
    // 增加docx/doc文件的预览功能 @hf
    const suffix = url.split('.').pop().toLowerCase(); // 获取文件后缀
    if (suffix === 'doc') {
      // 预览 .doc 文件 (online) -bug-@hf
      const docUrl = 'https://localhost:9000' + url;
      const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        docUrl
      )}`;
      window.open(viewerUrl, '_blank');
    } else if (suffix === 'docx') {
      // 预览 .docx 文件 (online)
      // const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
      //   url
      // )}`;
      // window.open(viewerUrl, '_blank');
      renderDocx(url);
    } else {
      // For non-docx/doc files, just open them as usual
      window.open(url, '_blank');
    }
  }
};
/** 导出按钮操作 */
function handleExport() {
  // proxy.download("system/role/export", {
  //   ...queryParams.value,
  // }, `role_${new Date().getTime()}.xlsx`);
  console.log(11111, '123123');
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status === '0' ? '启用' : '停用';
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.roleName + '"角色吗?')
    .then(function () {
      return changeRoleStatus(row.roleId, row.status);
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功');
    })
    .catch(function () {
      row.status = row.status === '0' ? '1' : '0';
    });
}
/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case 'handleDataScope':
      handleDataScope(row);
      break;
    case 'handleAuthUser':
      handleAuthUser(row);
      break;
    default:
      break;
  }
}
/** 分配用户 */
function handleAuthUser(row) {
  router.push('/system/role-auth/user/' + row.roleId);
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
    status: '0',
    menuIds: [],
    deptIds: [],
    menuCheckStrictly: true,
    deptCheckStrictly: true,
    remark: undefined,
  };
  proxy.resetForm('roleRef');
}
/** 添加角色 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  open.value = true;
  title.value = '添加角色';
}
/** 修改角色 */
function handleUpdate(row) {
  reset();
  const roleId = row.roleId || ids.value;
  const roleMenu = getRoleMenuTreeselect(roleId);
  getRole(roleId).then((response) => {
    form.value = response.data;
    form.value.roleSort = Number(form.value.roleSort);
    open.value = true;
    nextTick(() => {
      roleMenu.then((res) => {
        let checkedKeys = res.checkedKeys;
        checkedKeys.forEach((v) => {
          nextTick(() => {
            menuRef.value.setChecked(v, true, false);
          });
        });
      });
    });
    title.value = '修改角色';
  });
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
  if (type == 'menu') {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == 'dept') {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == 'menu') {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == 'dept') {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == 'menu') {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == 'dept') {
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
  proxy.$refs['roleRef'].validate((valid) => {
    if (valid) {
      if (form.value.roleId != undefined) {
        form.value.menuIds = getMenuAllCheckedKeys();
        updateRole(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功');
          open.value = false;
          getList();
        });
      } else {
        form.value.menuIds = getMenuAllCheckedKeys();
        addRole(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功');
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== '2') {
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
    title.value = '分配数据权限';
  });
}
/** 提交按钮（数据权限） */
function submitDataScope() {
  if (form.value.roleId != undefined) {
    form.value.deptIds = getDeptAllCheckedKeys();
    dataScope(form.value).then((response) => {
      proxy.$modal.msgSuccess('修改成功');
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
</script>

<style>
.el-upload-list {
  display: none !important;
}
.el-form-item {
  margin-right: 10px !important;
}
</style>

