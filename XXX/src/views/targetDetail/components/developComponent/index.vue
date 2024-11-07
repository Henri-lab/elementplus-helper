<template>
    <div class="develop">
        <div class="developContainer">
            <div class="header"><i class="close" @click="onDevelopClose"></i>
            </div>
            <div class="main">
                <p class="infoBtn" @click="addInfoShow = true">
                    新增
                </p>
                <ul class="mainContent" v-if="changeData.length">
                    <li v-for="(item,index) in changeData" :key="index">
                        <div class="titleDiv">
                            <span>{{item.updateTime}}</span>
                            <span v-for="(items,index) in item.keywords" :key='index' :class="{'js':items==='军事演习','ysInfo':items==='预测事件'}">
                                {{items}}
                            </span>
                            <span class="aboutDoc" v-if="item.fileInfoIds.length" @click="onAboutFile(item)">相关文件</span>
                        </div>
                        <div class="content">
                            {{item.updateLog}}
                        </div>
                    </li>
                </ul>
                <div v-else style="color:white;font-size:22px;text-align: center;">
                    暂无数据
                  </div>
            </div>
        </div>
    </div>



    <!-- 预测信息弹窗 -->
    <div class="predictionInfo" v-if="addInfoShow">
        <div class="predictionInfoContainer">
            <div class="header"><i class="close" @click="onClosePredition"></i>
            </div>
            <div class="main">
                <el-form :model="form" label-width="100px" class="elFrom">
                    <el-form-item label="预测时间 : ">
                        <el-date-picker
                            v-model="form.dataTime"
                            type="date"
                            placeholder="请选择时间"
                        />
                    </el-form-item>
                    <el-form-item label="事件标签 :">
                    <el-select v-model="form.region" placeholder="请选择事件标签" multiple>
                        <el-option
                        v-for="(item,index) in optionSelect"
                        :key="index"
                        :label="item.dictLabel"
                        :value="item.dictLabel" />
                        
                    </el-select>
                    </el-form-item>
                    <el-form-item label="事件内容 : ">
                        <el-input v-model="form.content"  type="textarea" :autosize="{ minRows: 4, maxRows: 20 }"/>
                    </el-form-item>
                    <el-form-item label="关联文件 :">
                        <el-select v-model="form.associationDoc" 
                            filterable  
                            placeholder="请选择关联文件" 
                            multiple 
                            @change="onSelectDoc"
                            >
                            <el-option
                            v-for="(item,index) in associationData"
                            :key="index"
                            :label="item.fileName"
                            :value="item.id" />
                        </el-select>                 
                    </el-form-item>
                    <el-form-item label="上传文件 :" >
                        <el-upload
                            :on-change="changeFile"
                            :auto-upload="false"
                            :data="uploadForm.data"
                            :on-success="submitUpload"
                            :on-remove="onRemoveFile"
                            v-model:file-list="fileList"
                            multiple
                            accept=".xls,.xlsx"
                            >
                            <template #trigger>
                                <el-button class="btn" size="small" type="primary"
                                >上传文件</el-button
                                >
                            </template>
                        </el-upload>


                    </el-form-item>
                </el-form>
                <p @click="onSubmit" class="onSure">确定</p>
            </div>
        </div>
    </div>
    <!-- 关联文件弹窗 -->
    <div class="aboutInfo" v-if="aboutDocShow">
      <div class="aboutInfoContainer">
          <div class="header"><i class="close" @click="aboutDocShow = false"></i>
          </div>
          <div class="main">
            <el-table :data="tableData"  style="width: 100%;" max-height="400">
              <el-table-column prop="fileName" label="文件名称" width="340" fixed  />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button size="small" @click="handleCheck(scope.row)"
                    >下载</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import {onMounted, ref,reactive, nextTick,defineEmits} from 'vue';
import {getTaskLog,getChange,uploadFile,getSelect,addForecast,getFileTable,FileInfo} from "@/api/fontInterface/mbDetail/index.js"
const props = defineProps({
    id:{
        type:Number,
        required:true
    }
})
let aboutDocShow = ref(false);
const tableData = ref([]);
const form = reactive({
  region:"",//标签
  content:"", //内容
  dataTime:"", //时间
  associationDoc:''//关联文件
})
//上传文件需要的变量
const uploadForm = reactive({
  data: {
    fileId: "1",
    name: "2",
    type: "3",
  },
});
const fileList = ref([]);//上传的文件列表
const optionSelect = ref([]); //事件标签data
const changeData =  ref([]);//发展变化图数据
const associationData = ref([]);//关联文件data

let addInfoShow = ref(false);//预测信息显隐
//获取发展变化图的数据以及数据的处理
const getChangeData = async()=>{
    let params = {
        status: 1,
        targetId:props.id,
      };
    let result = await getChange(params);
    if(result.code === 200){
        console.log(result)
        changeData.value = result.rows;
        changeData.value.forEach(item=>{
            item.updateTime = DateFormatPipe(item.updateTime,"yyyy-MM-dd")
            if(item.keywords !==null && item.keywords.includes(",")){
                item.keywords = item.keywords.split(",");
            }else if(item.keywords !==null){
                item.keywords = [item.keywords]
            }
        })
    }
}
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
      case "MM-dd":
        timeDate =  month + "-" + day;
        break;
      case "yyyy/MM/dd":
        timeDate = year + "/" + month + "/" + day;
        break;
      case "yyyy-MM-dd HH:mm:ss":
        timeDate =
          year + "-" + month + "-" + day + "" + HH + ":" + mm + ":" + ss;
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

//下拉框接口数据
const getSelectData = async()=>{
    let result  = await getSelect("keyword");
    if(result.code === 200){
        optionSelect.value = result.data;
    }
}

//新增预测信息
const onSubmit= async()=>{
    let fileIdArr = [];
    if(fileInfoList.value.length){
      fileIdArr.push(...fileInfoList.value.map(item=>item.id))
    }
    if(form.associationDoc.length){
      fileIdArr.push(...form.associationDoc)
    }
    let params = {
        fileIds: fileIdArr,//上传的文件
        keywords: form.region.join(","),
        updateLog: form.content,
        updateTime: form.dataTime,
        targetId: props.id,
    };
    let result = await addForecast(params);
    if(result.code == 200){
        ElMessage({
            message: '新增成功',
            type: 'success',
        })
        addInfoShow.value = false;
        getChangeData();
    }
}
//关闭预测信息弹窗
const onClosePredition = ()=>{
  fileList.value = [];
  addInfoShow.value =false;
  form.region = "";
  form.content = "";
  form.dataTime = "";
  form.associationDoc = ""

}


//获取关联文件列表
const getAssociationDoc = async()=>{
    let result  = await getFileTable(props.id);
    if(result.code === 200){
        console.log(result);
        associationData.value = result.rows;
    }
}

//关联文件change事件
const onSelectDoc =(e)=>{
    console.log(e,form.associationDoc)
}
const file = ref(null);
//上传文件触发事件
const changeFile = (uploadFile) => {
  file.value = uploadFile;
  submitUpload();
};
//删除删除的文件
const onRemoveFile = (uploadFile,uploadFiles)=>{
    let id = fileInfoList.value.find(item=>item.fileName === uploadFile.raw.name)
    fileInfoList.value.splice(id,1);
}
//存储上传功能的文件
const fileInfoList = ref([]);
//确定事件
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
      filePath: res.fileName,
    };
    await FileInfo(params).then((resolveData) => {
      if (resolveData.code == 200) {
        console.log(resolveData, "resolveData");
        fileInfoList.value.push(resolveData.data)
      }
    });
  }
};
//获取表格数据
const onAboutFile = (item)=>{
  tableData.value = item.fileInfoIds;
  aboutDocShow.value = true;
}

//下载excel
const handleCheck = (row)=>{
  window.open(`/dev-api/${row.filePath}`)  
}


watch(()=>props.id,(newVal)=>{
    getChangeData();
    getSelectData();
    getAssociationDoc();
})

onMounted(()=>{
  nextTick(()=>{
    getChangeData();
    getSelectData();
    getAssociationDoc();
  })
    
})


const emits = defineEmits([
    "onDevelopClose",
  ]);

const onDevelopClose = ()=>{
    emits("onDevelopClose")
}


</script>




<style lang="scss" scoped>
@import "./index.scss";
</style>