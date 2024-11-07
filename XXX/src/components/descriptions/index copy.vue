<template>
  <div class="descriptions">
    <el-descriptions class="margin-top" :column="3" border>
      <template #title> 基本信息 </template>
      <template #extra>
        <el-dropdown trigger="click">
          <el-button type="primary">
            添加<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in arr"
                :key="item.id"
                @click="handOpen(item.name)"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">目标名称</div>
        </template>
        <el-input
          style="width: 160px"
          v-model="basicMessage.targetName"
          :title="basicMessage.targetName"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">目标类别</div>
        </template>

        <el-select
          v-model="basicMessage.targetType"
          placeholder="请选择目标类别"
          style="width: 200px"
          allow-create
          filterable
        >
          <el-option
            v-for="item in typeData"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <!-- <el-input v-model="basicMessage.targetType" :title="basicMessage.targetType" ></el-input> -->
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">国家（地区）</div>
        </template>
        <!-- <el-input
          v-model="basicMessage.country"
          :title="basicMessage.country"
        ></el-input> -->
        <el-select
          v-model="basicMessage.country"
          placeholder="请选择国家（地区）"
          style="width: 180px"
          allow-create
          filterable
        >
          <el-option
            v-for="item in countryData"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">经度</div>
        </template>
        <el-input
          v-model="basicMessage.centerLon"
          :title="basicMessage.centerLon"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">纬度</div>
        </template>
        <el-input
          v-model="basicMessage.centerLat"
          :title="basicMessage.centerLat"
        ></el-input>
      </el-descriptions-item>

      <el-descriptions-item>
        <template #label>
          <div class="cell-item">海拔高（米）</div>
        </template>
        <el-input
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="basicMessage.highAltitude"
          :title="basicMessage.highAltitude"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">地位作用</div>
        </template>
        <el-input
          v-model="basicMessage.positionFunction"
          :title="basicMessage.positionFunction"
          type="textarea"
          auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">地理位置</div>
        </template>
        <el-input
          v-model="basicMessage.positionGeographic"
          :title="basicMessage.positionGeographic"
          type="textarea"
          auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">主要设施</div>
        </template>
        <el-input
          v-model="basicMessage.mainFacility"
          :title="basicMessage.mainFacility"
          type="textarea"
          auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">变化情况</div>
        </template>
        <el-input
          v-model="basicMessage.changeTrend"
          :title="basicMessage.changeTrend"
          type="textarea"
          auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"
        ></el-input>
      </el-descriptions-item>
    </el-descriptions>
    <div v-for="item in tableData" :key="item.id">
        
    </div>
    <el-descriptions
      class="margin-top"
      :column="3"
      :size="size"
      title="设施"
      border
      
    >
      <el-descriptions-item
        v-for="(items, indexs) in item"
        :key="items.id"
        :span="items.span"
      >
        <template #label>
          <div class="cell-item">
            {{ items.name }}
          </div>
        </template>

        <div v-if="items.type == 'sel'">
          <el-select v-if="items.key == 'equipmentType'" v-model="items.value" :title="items.value">
            <el-option v-for="equip in equipData" :key="equip.id" :label="equip.dictLabel" :value="equip.dictLabel"></el-option>
        </el-select>
        <el-select v-if="items.key == 'fixedType'" v-model="items.value" :title="items.value">
            <el-option v-for="facility in facilityData" :key="facility.id" :label="facility.dictLabel" :value="facility.dictLabel"></el-option>
        </el-select>
        </div>
        
        <el-input v-else v-model="items.value" :title="items.value"> </el-input>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      class="margin-top"
      title="雷达"
      :column="3"
      :size="size"
      border
      
    >
      <el-descriptions-item
        v-for="items in item"
        :key="items.id"
        :span="items.span"
      >
        <template #label>
          <div class="cell-item">
            {{ items.name }}
          </div>
        </template>
        <el-input
          v-model="items.value"
          :title="items.value"
          v-if="items.name === '诱饵情况' || items.name === '装备能力'"
          type="textarea"
          auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"
        >
        </el-input>
        <el-input v-model="items.value" :title="items.value" v-else> </el-input>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import {
  checkList,
  getCountry,
  getType,
  getchecklog,
  dictType
} from "@/api/frontend/record/index";
import { onMounted,defineProps,computed,watch } from "vue";
const props = defineProps({
    tableData:Object
});
// 查询装备和设施
let equipData = ref()
let facilityData = ref()
const getDictType = (str)=>{
    dictType(str).then(res=>{
        if(str == "equip_type"){
            equipData.value = res.data
        }else if(str == "fixed_type"){
            facilityData.value = res.data
        }
    })
}

let basic = computed(()=>props.tableData)
watch(basic, (newValue, oldValue) => {
  basicMessage.value = newValue.targetInfo
  console.log(newValue)
});
// 详情参数
let basicMessage = ref({
  targetName: "",
  targetType: "",
  country: "",
  centerLon: "",
  centerLat: "",
  highAltitude: "",
  positionFunction: "",
  positionGeographic: "",
  mainFacility: "",
  changeTrend: "",
  id: "",
});
// 详情添加
let arr = ref([{ name: "设施" }, { name: "雷达" }]);
let tableData = ref([]);
let tableData1 = ref([]);
// 添加设置或雷达
const handOpen = (item) => {
  if (item === "设施") {
    tableData.value.push([
      {
        name: "名称",
        value: "",
        span: 3,
        key: "facilityName",
      },
      {
        name: "目标尺寸",
        value: "",
        span: 3,
        key: "targetSize",
      },
      {
        name: "伪装防护情况",
        value: "",
        span: 3,
        key: "camouflage",
      },
      {
        name: "识别特征",
        value: "",
        span: 3,
        key: "feature",
      },
      {
        name: "装备类型",
        value: "",
        span: 1,
        key: "equipmentType",
        type:'sel'
      },
      {
        name: "固定设施类型",
        value: "",
        span: 1,
        key: "fixedType",
        type:'sel'
      },
    ]);
  } else {
    tableData1.value.push([
      {
        name: "名称",
        value: "",
        span: 3,
        key: "facilityName",
        status: true,
      },
      {
        name: "目标尺寸",
        value: "",
        span: 3,
        key: "targetSize",
      },
      {
        name: "伪装防护情况",
        value: "",
        span: 3,
        key: "camouflage",
      },
      {
        name: "识别特征",
        value: "",
        span: 3,
        key: "feature",
      },
      {
        name: "雷达型号",
        value: "",
        span: 1,
        key: "radar",
        status: true,
      },

      // {
      //   name: "",
      //   value: "",
      //   span: 1,
      //   key: "type",
      //   status: false,
      // },
      {
        name: "天线类型",
        value: "",
        span: 1,
        key: "antennaType",
        status: true,
      },
      {
        name: "工作波段",
        value: "",
        span: 1,
        key: "work_band",
        status: true,
      },

      {
        name: "发射机输出功率(w)",
        value: "",
        span: 1,
        key: "sender",
        status: true,
      },
      {
        name: "载频类型",
        value: "",
        span: 1,
        key: "carrierType",
        status: true,
      },

      {
        name: "载频值(MHz)",
        value: "",
        span: 1,
        key: "carrierValue",
        status: true,
      },
      {
        name: "载频容差(MHz)",
        value: "",
        span: 1,
        key: "carrierAlw",
        status: true,
      },

      {
        name: "重周类型",
        value: "",
        span: 1,
        key: "cycleType",
        status: true,
      },
      {
        name: "重周值(μs)",
        value: "",
        span: 1,
        key: "cycleValue",
        status: true,
      },
      // {
      //   name: "重周值(μs)",
      //   value: "cycleValue",
      //   span: 1,
      //   key: "cycleValue",
      // },
      {
        name: "重周容差(μs)",
        value: "",
        span: 1,
        key: "cycleAlw",
        status: true,
      },
      {
        name: "脉宽类型",
        value: "",
        span: 1,
        key: "pulseType",
        status: true,
      },
      {
        name: "脉宽值(μs)",
        value: "",
        span: 1,
        key: "pulseValue",
        status: true,
      },
      {
        name: "脉宽容差(μs)",
        value: "",
        span: 1,
        key: "pulseAlw",
        status: true,
      },
      {
        name: "天线架设高度（米）",
        value: "",
        span: 1,
        key: "antennaHeight",
        status: true,
      },
      {
        name: "天线架设角(°）",
        value: "",
        span: 1,
        key: "antennaAngle",
        status: true,
      },
      {
        name: "波束宽度(°）",
        value: "",
        span: 1,
        key: "beamWidth",
        status: true,
      },
      {
        name: "诱饵情况",
        value: "",
        span: 3,
        key: "decoy",
        status: true,
      },
      {
        name: "装备能力",
        value: "",
        span: 3,
        key: "equipment",
      },
    ]);
  }
};
// 类别数据
let typeData = ref([]);
// 国家数据
let countryData = ref([]);
let gettypeData = () => {
  getType().then((res) => {
    typeData.value = res.data;
  });
};
let getCountryData = () => {
  getCountry().then((res) => {
    countryData.value = res.data;
  });
};
onMounted(()=>{
    gettypeData();
  getCountryData();
  getDictType("equip_type")
  getDictType("fixed_type")

})
</script>

<style lang="scss">
.descriptions {
  padding: 5px 10px;
}
.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  background: #152a41;
  color: #fff;
  width: 80px;
}
.el-descriptions__body
  .el-descriptions__table.is-bordered
  .el-descriptions__cell {
  border: 1px solid #276989 !important;
  background: #152a41;
}
.el-descriptions__title {
  color: #fff;
}
.el-descriptions__header {
  margin: 10px;
}
.el-input__wrapper {
  background: none !important;
  box-shadow: none !important;
}
.el-input__inner{
    color: #fff;
}
.el-textarea__inner {
  background: none !important;
  box-shadow: none !important;
  border: 1px solid #1296db !important;
  border-radius: 5px;
  color: #fff;
}
.el-input__inner::placeholder {
  color: #fff;
}
.el-select {
  outline: none;
  background-color: transparent !important;
  border: 1px solid #1296db !important;
  border-radius: 5px;
  box-shadow: none !important;
}
$selectBg: #264e74;
$selectHover: #4475ad;
.el-select-dropdown__empty {
  background-color: $selectBg;
  color: #fff;
}
.el-select__popper.el-popper {
  background-color: $selectBg; /* 这里设置下拉框的背景颜色 */
  border: none;
  .el-select-dropdown__item {
    color: #fff;
  }
  .el-select-dropdown__item.hover {
    background: $selectHover;
    color: #fff;
  }
}
.el-select-dropdown {
  background-color: $selectBg; /* 这里设置下拉框的背景颜色 */
  border: none;
}
.el-popper.is-light .el-popper__arrow::before {
  background: $selectBg;
  border: none;
}
.el-popper.is-light {
  background: $selectBg;
//   border:1px solid #1a5076;
  .el-dropdown-menu {
    background: $selectBg;
    border: none;
    .el-dropdown-menu__item {
      color: #fff;
    }
    .el-dropdown-menu__item:not(.is-disabled):focus {
      background: $selectHover;
      color: #fff;
    }
  }
}
</style>