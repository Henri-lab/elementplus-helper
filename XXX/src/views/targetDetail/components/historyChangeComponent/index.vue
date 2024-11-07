<template>
<div class="history">
        <div class="historyContainer">
            <div class="header"><i class="close" @click="onHistoryClose"></i>
            </div>
            <div class="main">
                <el-timeline class="timeLine" v-if="logTimeData.length">
                    <el-timeline  v-for="(item,index) in logTimeData" :key="index">
                        <el-timeline-item
                            :timestamp="item.updateTime"
                            placement="top"
                        >
                        <el-card>
                            <p>{{ item.fixed }}</p>
                        </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </el-timeline>
                <div v-else style="color:white;font-size:22px;text-align: center;">
                      暂无数据
                    </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {historyData} from "@/api/fontInterface/mbDetail/index.js"
import {onMounted, ref,defineEmits, nextTick} from 'vue';
const props = defineProps({
    id:{
        type:Number,
        required:true
    }
})
const historyShow = ref(false);
const logTimeData = ref([]);
const getHistoryData = async()=>{
    let params ={
        targetId: props.id
    }
    let result = await historyData(params);
    if(result.code === 200){
        logTimeData.value =result.rows.filter(item=>item.fixed!=='');
        logTimeData.value.forEach(item=>{
            item.updateTime = DateFormatPipe(item.updateTime,'yyyy-MM-dd');
        })
    }
}

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


watch(()=>props.id,(newVal)=>{
    getHistoryData();
})

onMounted(()=>{
  nextTick(()=>{
    getHistoryData();
  })
})


const emits = defineEmits([
    "onHistoryClose",
  ]);

const onHistoryClose = ()=>{
    emits("onHistoryClose")
}



</script>



<style lang="scss" scoped>
@import "./index.scss";
</style>