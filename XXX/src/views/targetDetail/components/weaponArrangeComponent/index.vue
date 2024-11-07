<template>
    <div class="weapon">
        <div class="weaponContainer">
            <div class="header"><i class="close" @click="onWeaponClose"></i>
            </div>
            <div class="main" >
                <div class="checkBtn">
                    <span @click="onBtnCheck(1)" :class="{'special':btnIndex===1}">时间轴</span>
                    <span @click="onBtnCheck(2)" :class="{'special':btnIndex===2}">折线图</span>
                </div>
                <div class="timeLine" v-if="btnIndex===1">
                    <div v-if="logTimeData.length">
                      <el-timeline  v-for="(item,index) in logTimeData" :key="index" >
                          <el-timeline-item
                              :timestamp="item.updateTime"
                              placement="top"
                          >
                          <el-card>
                              <p>{{ item.content }}</p>
                          </el-card>
                          </el-timeline-item>
                      </el-timeline>
                    </div>
                    <div v-else style="color:white;font-size:22px;text-align: center;">
                      暂无数据
                    </div>
                </div>
                <div class="linePic" v-if="btnIndex===2">
                    <div id="echartLine" style="width:100%;
                    height:400px;color:white;" v-if="echartsData.serierData.length"></div>
                    <div v-else style="color:white;font-size:22px;text-align: center;">
                      暂无数据
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import {ref,onMounted, nextTick,defineEmits} from "vue";
import {getTaskLog,getFacility} from "@/api/fontInterface/mbDetail/index.js";
import * as echarts from "echarts";
const props = defineProps({
    id:{
        type:Number,
        required:true
    }
})
//时间轴和折线图切换事件
let btnIndex = ref(1);
const onBtnCheck = (e)=>{
    if(e === 1){
        btnIndex.value = 1;
    }else if(e===2){
        btnIndex.value = 2;
        setTimeout(()=>{
          initEcharts();
        },100)
        
    }
}
const logTimeData = ref([]);//时间轴data
//获取时间轴数据
const getTaskLogData = async() =>{
    let params = {
        status: 1,
        targetId: props.id,
    };
    let result = await getTaskLog(params);
    if(result.code === 200){
        logTimeData.value =result.rows.filter(item=>item.updateLog!=='');
        logTimeData.value.forEach(item=>{
            item.updateTime = DateFormatPipe(item.updateTime,'yyyy-MM-dd');
        })
    }
}
let colors = ["#5470c6","#91cc75","#EE6666","#FAC858","#73C0DE","#FFF00C","#73FFCC","#FF0FFD"];
//获取折线图数据
const getFacilityData = async()=>{
    let params = {
        id: props.id,
    };
    let result = await getFacility(params);
    if(result.code === 200){
        let resultLine = {};
        if(result.data.length){
          logTimeData.value = result.data.map((item)=>{
            return {
              updateTime: DateFormatPipe(item.date,'yyyy-MM-dd'),
              content: item.content
            }
          })
          colors = ["#5470c6","#91cc75","#EE6666","#FAC858","#73C0DE","#FFF00C","#73FFCC","#FF0FFD"];
          //用当前的颜色组对比动态的数据,数量小于动态数据的话，随机生成颜色。
          while (colors.lenght<result.data[0].equip.length){
            colors.push("#" + Math.floor(Math.random()* 16777215).toString(16));//随机生成颜色
          }

          result.data[0].equip.forEach(item=>{
            echartsData.value.legendData.push(item.facilityName)
          })
          result.data.forEach(item=>{
            echartsData.value.timeData.push(DateFormatPipe(item.date,"MM-dd"));
            //处理数据--符合echarts 折线图要求的数据
            item.equip.forEach(items=>{
              if(!resultLine[items.facilityName]){
                resultLine[items.facilityName] = [];
              }
              resultLine[items.facilityName].push(items.facilityNum);
            })
            echartsData.value.serierData = Object.keys(resultLine).map((key,index)=>({
                name:key,
                data:resultLine[key],
                type:"line",
                lineStyle:{
                  color: colors[index]
                },
            }))
          })
        }
        
    }
}
const echartsData = ref({
  legendData:[],
  serierData:[],
  timeData:[]
})
const initEcharts = ()=>{
  var chartDom = document.getElementById("echartLine");
  var myChart = echarts.init(chartDom);
  var option;
  option = {
    color:colors,//使用生成的颜色数组
    title:{
      text:"单位:架",
      textStyle:{
        fontSize:14,
        color:"#fff"
      }
    },
    tooltip:{
      trigger:'axis',
    },
    legend:{
      data:echartsData.value.legendData,
      left:'15%',
      textStyle:{
        color:'#fff',
      }
    },
    grid:{
      left:"3%",
      right:"4%",
      bottom:"3%",
      containLabel:true,
    },
    xAxis:{
      type:"category",
      boundaryGap:false,
      data:echartsData.value.timeData,
    },
    yAxis:{
      type:"value",
    },
    series:echartsData.value.serierData
  }

  option && myChart.setOption(option);

  console.log(echartsData.value)
}
watch(()=>props.id,(newVal)=>{
    // getTaskLogData();
    getFacilityData();
})
onMounted(()=>{
  nextTick(()=>{
    // getTaskLogData();
    getFacilityData();
  })
    
})
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


const emits = defineEmits([
    "onWeaponClose",
  ]);

const onWeaponClose = ()=>{
    emits("onWeaponClose")
}




</script>




<style lang="scss" scoped>
@import "./index.scss";


</style>

<style>
.el-timeline-item__tail {
  display: block !important;
  border-left: 2px solid #124e8a !important;
}
.el-timeline-item__node {
  background-color: #12427D !important;
  /* box-shadow: 2px 2px #ccc;  */
  box-shadow: 1px 1px 9px 2px #02b1e0;
}
.el-timeline-item__wrapper {
  border: 1px solid #193c62;
  margin-left: 17px;
  border-top: none;
  background: url("@/assets/images/装备部署情况-框.png");
  background-size: 100% 100%;
}
.el-timeline-item__timestamp {
  text-align: left;
  border-bottom: 1px solid #2d4f73;
  padding-bottom: 5px;
  margin-right: 10px;
  color: #02b1e0;
  font-weight: 800;
}
.el-card {
  background: none;
  border: none;
  color:white;
}

::v-deep.el-timeline-item__content{
    background: url("@/assets/images/装备部署情况-框.png");
    background-size: 100% 100%;
}

</style>