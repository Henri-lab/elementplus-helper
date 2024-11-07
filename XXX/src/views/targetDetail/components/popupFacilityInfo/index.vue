<template>
  <!-- <el-button @click="getFacilityInfo" style="position: absolute; z-index: 2"
    >log:选中的设施</el-button
  > -->
  <div class="popupFacilityInfo" style="display: inline-block" v-draggable>
    <div class="popupFacilityInfoContainer">
      <div class="header">
        <i class="close" @click="onPopupClose"></i>
      </div>
      <div class="main">
        <!-- **test** -->
        <!-- 风格：表格 -->
        <!-- <div class="facilityList">
          <el-table :data="testData">
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
            />
          </el-table>
        </div> -->
        <!-- 风格：列表 -->
        <div class="facilityInfo-list">
          <el-descriptions title="" :column="1" :size="small" border>
            <el-descriptions-item v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
              class-name="facilityInfo-list-item" align="center" width="1">
              <span class="facilityInfo-list-item-value">{{
                column.prop
              }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="foot"></div>
    </div>
  </div>j
</template>

<script setup>
// popup facility info vue @hf
import bus from '@/utils/bus';
import { testDataObj } from './testData';

const popupInfo = defineProps({
  facility: {
    type: Object,
    default: () => {
      return [];
    },
  },
});
// 字段字典
const lableDict = {
  antennaAngle: "天线架设角",
  antennaHeight: "天线架设高度",
  antennaType: "天线类型",
  beamWidth: "波束宽度",
  carrierAlw: "载频容差",
  carrierType: "载频类型",
  carrierValue: "载频值",
  cycleAlw: "重周容差",
  cycleType: "重周类型",
  cycleValue: "重周值",
  decoy: "诱饵情况",
  equipment: "装备能力",
  // fixedType: "固定设施类型",// 
  pulseAlw: "脉宽容差",
  pulseType: "脉宽类型",
  pulseValue: "脉宽值",
  radar: "雷达型号",
  sender: "发射机输出功率",
  targetName: "目标名称",
  targetSize: "目标尺寸",
  workBand: "工作波段",
  camouflage: "伪装防护情况",
  
  feature: "识别特征",
// facilityType: "设施类型", // 1 表示常规，2 表示雷达  // 
  
  //  facilityId: "facilityId",//
  // radarId: "radarId",// 
  //  logId: "logId",//
  // infoId: "infoId",// 
  
  facilityName: "设施名称",
  equipmentType: "装备类型",
  fixedNote: "固定设施备注"
};



// const columns = computed(() => {
//   return Object.keys(popupInfo.facility).map((key) => {
//     if (key == 'facilityType') {
//       return {
//         label: lableDict[key], //filed
//         prop: popupInfo.facility[key] == 1 ? '普通' : '雷达', //value 
//       }
//     }
//     else {
//       return {
//         label: lableDict[key], //filed
//         prop: popupInfo.facility[key], //value
//       }
//     }
//   })
// });
const columns = computed(() => {
  return Object.keys(lableDict).map((key) => {
    // if (key == 'facilityType') {
    //   return {
    //     label: lableDict[key], //filed
    //     prop: popupInfo.facility[key] == 1 ? '普通' : '雷达', //value 
    //   }
    // }
    // else {
      return {
        label: lableDict[key], //filed
        prop: popupInfo.facility[key], //value
      }
    // }
  })
});
// const columns = getColumes(popupInfo.facility);
// 使用计算属性来动态生成列(--字段) bug
// function getColumes(row) {
//   return computed(() => {
//     return Object.keys(row).map((key) => ({
//       prop: row[key],
//       label: lableDict[key],
//     }));
//   });
// }

function getFacilityInfo() {
  console.log(popupInfo.facility, '--openFacilityInfo');
}

// 关闭标签
function onPopupClose() {
  console.log('popup close');
  bus.emit('popupFacilityInfoCloseClick');
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
