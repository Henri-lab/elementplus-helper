<!--
 * @Author: XC
 * @Date: 2024-07-18 09:25:48
 * @LastEditors: XC
 * @LastEditTime: 2024-07-18 13:59:19
 * @FilePath: \RuoYi-Vue3-3.8.6\src\components\management\index.vue
 * @Description: 
-->
<!--
 * @Author: XC
 * @Date: 2024-07-18 09:25:48
 * @LastEditors: XC
 * @LastEditTime: 2024-07-18 13:43:05
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
            v-model="queryParams.taskStatus"
            class="select_box"
            placeholder="请选择状态"
            size="small"
            style="width: 240px"
            transfer="true"
            :popper-append-to-body="false"
          >
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
        <!-- <el-button
         style="margin-left: 10px"
         size="small"
         type="success"
         @click="submitUpload"
         >上传到服务器</el-button
        > -->
        <div class="right">
          <el-upload
            :on-change="changeFile"
            :auto-upload="false"
            :data="uploadForm.data"
            :on-success="submitUpload"
            accept=".xls,.xlsx"
          >
            <template #trigger>
              <el-button size="small" type="primary">导入任务</el-button>
            </template>
          </el-upload>
          <!-- getUserList -->
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
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="userOperator" label="操作员" />
        <el-table-column prop="123" label="任务状态">
          <template #default="scope">
            <TableCellTip :content="scope.row"></TableCellTip>
          </template>
        </el-table-column>
        <el-table-column prop="操作" label="操作">
          <template #default="{ row }">
            <!-- <a href="javascript: void (0)" 
                >进度监控</a
              > -->
            <img
              src="../../assets/images/进度监控.png"
              @click.native.stop="showWatch(row)"
              alt=""
              title="进度监控"
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { listUser } from "@/api/system/user";
import { getTaskList,importTask } from "@/api/frontend/task";
import TableCellTip from "./TableCellTip.vue";
onMounted(() => {
  getList();
  getUserList();
});
// 用户列表
let useOptions = ref([]);
const getUserList = () => {
  listUser().then((res) => {
    useOptions.value = res.rows;
  });
};
let queryParams = ref({
  taskName: "",
  userName: "",
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
// 新建任务
const addNewTask = () => {};
const uploadForm = reactive({
  data: {
    fileId: "1",
    name: "2",
    type: "3",
  },
});
// 上传过程
const changeFile = (uploadFile) => {
    file.value = uploadFile;
  submitUpload();
};
// 上传成功
const submitUpload = async () => {
     const jsonStr = JSON.stringify(uploadForm.data);
  const blob = new Blob([jsonStr], {
    type: "application/json"
  });
  let formData = new FormData();
  formData.append("file", file.value.raw);
  const res = await uploadFile(formData);
  if (res.code == 200) {
    await importTask(res.fileName).then((resolveData) => {
      if (resolveData.code == 200) {
        console.log(resolveData, "res");
        getList();
      }
    });
  }
};
// 数据列表
let tableData = ref([]);
const getList = () => {
  getTaskList(queryParams.value).then((res) => {
    tableData.value = res.rows;
    total.value = res.total;
  });
};
// 重置搜索
const reset = () => {
  queryParams.value = {
    taskName: "",
    userName: "",
    pageSize: 10,
    pageNum: 1,
  };
  getList()
};
// 进度监控
const showWatch = () => {};
</script>

<style lang="scss">
.management {
  width: 98%;
  height: calc(100% - 140px);
  margin: 1% 20px;
  background: url("@/assets/images/recordBg.png") no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  position: relative;
  .tit {
    width: 100%;
    height: 35px;
    margin-top: 10px;
    background: url("@/assets/images/全屏弹窗头部.png") no-repeat;
    background-size: 100% 100%;
    & > p {
      color: #fff;
      line-height: 35px;
      margin-left: 30px;
      font-size: 14px;
      font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
        "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
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
        margin-top: 10px;
      }
      .el-button {
        width: 100px;
        height: 41px;
        margin-left: 10px;
        color: #ffff;
        background: url("@/assets/images/四字按钮.png") no-repeat;
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
      .el-input__inner{
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
}
</style>