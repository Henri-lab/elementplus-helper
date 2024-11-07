<template>
  <div class="descriptions">
    <!-- 基本信息说明表 -->
    <el-descriptions class="margin-top" :column="3" border>
      <template #title> 基本信息 </template>
      <template #extra>
        <el-dropdown trigger="click">
          <el-button type="primary">
            添加<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in arr" :key="item.id" @click="handOpen(item.name)">
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
        <el-input style="width: 160px" v-model="basicMessage.targetName" :title="basicMessage.targetName"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">所属区域</div>
        </template>
        <el-input style="width: 160px" v-model="basicMessage.area" :title="basicMessage.area"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">目标类别</div>
        </template>

        <el-select v-model="basicMessage.targetType" placeholder="请选择目标类别" style="width: 200px" allow-create filterable>
          <el-option v-for="item in typeData" :key="item" :label="item" :value="item" />
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
        <el-select v-model="basicMessage.country" placeholder="请选择国家（地区）" style="width: 180px" allow-create filterable>
          <el-option v-for="item in countryData" :key="item" :label="item" :value="item" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">经度</div>
        </template>
        <el-input v-model="basicMessage.centerLon" :title="basicMessage.centerLon"
          @change="testLon(basicMessage.centerLon)" :class="{ 'error-input-lon': !isLonInvalid }"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">纬度</div>
        </template>
        <el-input v-model="basicMessage.centerLat" :title="basicMessage.centerLat"
          @change="testLat(basicMessage.centerLat)" :class="{ 'error-input-lat': !isLatInvalid }"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">海拔高（米）</div>
        </template>
        <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model="basicMessage.highAltitude"
          :title="basicMessage.highAltitude"></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template #label>
          <div class="cell-item">地位作用</div>
        </template>
        <el-input v-model="basicMessage.positionFunction" :title="basicMessage.positionFunction" type="textarea"
          auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">地理位置</div>
        </template>
        <el-input v-model="basicMessage.positionGeographic" :title="basicMessage.positionGeographic" type="textarea"
          auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">主要设施</div>
        </template>
        <el-input v-model="basicMessage.mainFacility" :title="basicMessage.mainFacility" type="textarea"
          auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
      </el-descriptions-item>
      <el-descriptions-item :span="3">
        <template #label>
          <div class="cell-item">变化情况</div>
        </template>
        <el-input v-model="basicMessage.changeTrend" :title="basicMessage.changeTrend" type="textarea" auto-complete="off"
          :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
      </el-descriptions-item>
    </el-descriptions>
    <div v-for="(item, index) in tableList" :key="item.id">
      <!-- 设备说明表 -->
      <el-descriptions class="margin-top" :column="3" title="设施" border v-if="item.facilityType == 1">
        <template #title>
          <div class="descrTitle">
            <span>设施</span>
            <span style="cursor: pointer" @click="remDescr(item)">删除</span>
          </div>
        </template>
        <!-- items 是数据字段 -->
        <el-descriptions-item v-for="(items, indexs) in item.data" :key="items.id" :span="items.span">
          <template #label>
            <div class="cell-item">
              {{ items.name }}
            </div>
          </template>

          <div v-if="items.type == 'sel'">
            <el-select v-if="items.key == 'equipmentType'" v-model="items.value" :title="items.value">
              <el-option v-for="equip in equipData" :key="equip.id" :label="equip.dictLabel"
                :value="equip.dictLabel"></el-option>
            </el-select>
            <el-select v-if="items.key == 'fixedType'" v-model="items.value" :title="items.value"
              style="margin-top: 5%;padding: 0;">
              <el-option v-for="facility in facilityData" :key="facility.id" :label="facility.dictLabel"
                :value="facility.dictLabel"></el-option>
            </el-select>
          </div>
          <!-- 选择是否为新增设施 开关风格@hf-->
          <el-switch v-model="items.value" v-if="items.key == 'isNewFacility' && items.type == 'switch'" />
          <!-- 选择是否为新增设施 选框风格 -->
          <!-- <el-radio-group v-model="items.value" v-if="items.key == 'isNewFacility' && items.type == 'switch'">
            <el-radio value="new">新增</el-radio>
            <el-radio value="old">已有</el-radio>
          </el-radio-group> -->
          <!-- 选择是否为新增设施 按钮风格-->
          <!-- <span class="isNewFacility-span" style="color: #fff; margin-left: 1rem; font-weight: bolder">是否为新增设施：</span>
            <el-button v-for="button in isNewFacilityButtons" :key="button.text" :type="button.type" text round
              @click="handleIsNewFacilityClick(button.isNew)">
              {{ button.text }}
            </el-button> -->
          <el-input v-else v-model="items.value" :title="items.value"></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 雷达说明表 -->
      <el-descriptions class="margin-top" title="雷达" :column="3" border v-if="item.facilityType == 2">
        <template #title>
          <div class="descrTitle">
            <span>雷达</span>
            <span style="cursor: pointer" @click="remDescr(item)">删除</span>
          </div>
        </template>
        <!-- items 是数据字段 -->
        <el-descriptions-item v-for="(items, indexs) in item.data.filter((row) => row.type != 'none')" :key="items.id"
          :span="items.span">
          <!-- 字段名称 -->
          <template #label>
            <div class="cell-item">
              {{ items.name }}
            </div>
          </template>
          <!-- 字段类型 textarea 输入框-->
          <!-- --------------------------装备、诱饵  -->
          <el-input v-model="items.value" :title="items.value" v-if="items.type == 'textarea'" type="textarea"
            auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }" @change="setManuRadarParam(items)">
          </el-input>
          <el-select v-if="items.type == 'text-select'" :placeholder="curRadarType" allow-create filterable
            v-model="items.value">
            <el-option v-for="type_ in db_Radars" :key="type_.radarId" :label="type_.radar" :value="type_.radar"
              @click="changeRedar(type_, index)" />
          </el-select>
          <!-- 字段类型 自动补全 输入框 @hf-->
          <el-input v-if="items.type == 'text-auto'" v-model="items.value" placeholder=""
            @change="setManuRadarParam(items)">
          </el-input>
          <!-- 字段类型 普通 输入框-->
          <el-input v-model="items.value" :title="items.value" v-if="items.type == 'text-common'" allow-create filterable>
          </el-input>
          <el-input v-model="items.value" :title="items.value" v-if="!items.type" allow-create filterable>
          </el-input>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup>
import { getRadar } from '@/api/fontInterface/mbDetail/index';
import {
  checkList,
  getCountry,
  getType,
  getchecklog,
  dictType
} from '@/api/frontend/record/index';
import { isValidLongitude, isValidLatitude } from '@/utils/validate';
import { lonDMS, latDMS } from '@/utils/lonLat';
import { ElMessage } from 'element-plus';
import {
  onMounted,
  defineProps,
  computed,
  watch,
  defineExpose,
  ref
} from 'vue';
const props = defineProps({
  tableData: Object
});

// 查询装备和设施
let equipData = ref();
let facilityData = ref();
const getDictType = (str) => {
  dictType(str).then((res) => {
    if (str == 'equip_type') {
      equipData.value = res.data;
    } else if (str == 'fixed_type') {
      facilityData.value = res.data;
    }
  });
};
let remId = ref([]);
// 删除
const remDescr = (row) => {
  if (!!row.data[1].facilityId) {
    remId.value.push(row.data[1].facilityId);
  }
  tableList.value = tableList.value.filter(
    (item) => JSON.stringify(item) != JSON.stringify(row)
  );
};
const returnIds = () => {
  return remId.value;
};
let basic = computed(() => props.tableData);
watch(basic, (newValue, oldValue) => {
  console.log(basic, newValue, '==========================');
  basicMessage.value = newValue.targetInfo || newValue;
  if (newValue.radars && newValue.radars.length != 0) {
    setAddTab(newValue.radars);
  } else {
    tableList.value = [];
    remId.value = [];
    // tableList.value = [];
  }
});
// 回显
const setAddTab = (data) => {
  tableList.value = [];
  remId.value = [];
  data.forEach((item, index) => {
    if (item.facilityType == 1) {
      let obj = {};
      let mainArr = ref([]);
      for (var i in item) {
        obj.facilityId = item.facilityId;
        switch (i) {
          case 'facilityName':
            obj = {
              name: '名称',
              value: item.facilityName,
              span: 1,
              key: 'facilityName'
            };
            mainArr.value.push(obj);
            break;
          case 'targetSize':
            obj = {
              name: '目标尺寸',
              value: item.targetSize,
              span: 1,
              key: 'targetSize'
            };
            mainArr.value.push(obj);
            break;
          case 'camouflage':
            obj = {
              name: '伪装防护情况',
              value: item.camouflage,
              span: 1,
              key: 'camouflage'
            };
            mainArr.value.push(obj);
            break;
          case 'feature':
            obj = {
              name: '识别特征',
              value: item.feature,
              span: 1,
              key: 'feature'
            };
            mainArr.value.push(obj);
            break;
          // case "equipmentType":
          //   obj = {
          //     name: "装备类型",
          //     value: item.equipmentType,
          //     span: 1,
          //     key: "equipmentType",
          //   };
          //   mainArr.value.push(obj);
          //   break;
          case 'fixedType':
            obj = {
              name: '固定设施类型',
              value: item.fixedType,
              span: 1,
              key: 'fixedType'
            };
            mainArr.value.push(obj);
            break;
        }
      }
      tableList.value.push({ facilityType: 1, data: mainArr.value });
    }

    if (item.facilityType == 2) {
      let obj1 = {};
      let mainArr1 = ref([]);
      for (var i in item) {
        obj1.facilityId = item.facilityId;
        switch (i) {
          case 'facilityName':
            obj1 = {
              name: '名称',
              value: item.facilityName,
              span: 1,
              key: 'facilityName'
            };
            mainArr1.value.push(obj1);
            break;
          case 'targetSize':
            obj1 = {
              name: '目标尺寸',
              value: item.targetSize,
              span: 1,
              key: 'targetSize'
            };
            mainArr1.value.push(obj1);
            break;
          case 'camouflage':
            obj1 = {
              name: '伪装防护情况',
              value: item.camouflage,
              span: 1,
              key: 'camouflage'
            };
            mainArr1.value.push(obj1);
            break;
          case 'feature':
            obj1 = {
              name: '识别特征',
              value: item.feature,
              span: 1,
              key: 'feature'
            };
            mainArr1.value.push(obj1);
            break;
          case 'radar':
            obj1 = {
              name: '雷达型号',
              value: item.radar,
              span: 1,
              key: 'radar'
            };
            mainArr1.value.push(obj1);
            break;
          case 'antennaType':
            obj1 = {
              name: '天线类型',
              value: item.antennaType,
              span: 1,
              key: 'antennaType'
            };
            mainArr1.value.push(obj1);
            break;
          case 'workBand':
            obj1 = {
              name: '工作波段',
              value: item.workBand,
              span: 1,
              key: 'workBand'
            };
            mainArr1.value.push(obj1);
            break;

          case 'sender':
            obj1 = {
              name: '发射机输出功率(w)',
              value: item.sender,
              span: 1,
              key: 'sender'
            };
            mainArr1.value.push(obj1);
            break;

          case 'carrierType':
            obj1 = {
              name: '载频类型',
              value: item.carrierType,
              span: 1,
              key: 'carrierType'
            };
            mainArr1.value.push(obj1);
            break;

          case 'carrierValue':
            obj1 = {
              name: '载频值(MHz)',
              value: item.carrierValue,
              span: 1,
              key: 'carrierValue'
            };
            mainArr1.value.push(obj1);
            break;

          case 'carrierAlw':
            obj1 = {
              name: '载频容差(MHz)',
              value: item.carrierAlw,
              span: 1,
              key: 'carrierAlw'
            };
            mainArr1.value.push(obj1);
            break;

          case 'cycleType':
            obj1 = {
              name: '重周类型',
              value: item.cycleType,
              span: 1,
              key: 'cycleType'
            };
            mainArr1.value.push(obj1);
            break;

          case 'cycleValue':
            obj1 = {
              name: '重周值(μs)',
              value: item.cycleValue,
              span: 1,
              key: 'cycleValue'
            };
            mainArr1.value.push(obj1);
            break;

          case 'cycleAlw':
            obj1 = {
              name: '重周容差(μs)',
              value: item.cycleAlw,
              span: 1,
              key: 'cycleAlw'
            };
            mainArr1.value.push(obj1);
            break;

          case 'pulseType':
            obj1 = {
              name: '脉宽类型',
              value: item.pulseType,
              span: 1,
              key: 'pulseType'
            };
            mainArr1.value.push(obj1);
            break;

          case 'pulseValue':
            obj1 = {
              name: '脉宽值(μs)',
              value: item.pulseValue,
              span: 1,
              key: 'pulseValue'
            };
            mainArr1.value.push(obj1);
            break;

          case 'pulseAlw':
            obj1 = {
              name: '脉宽容差(μs)',
              value: item.pulseAlw,
              span: 1,
              key: 'pulseAlw'
            };
            mainArr1.value.push(obj1);
            break;

          case 'antennaHeight':
            obj1 = {
              name: '天线架设高度（米）',
              value: item.antennaHeight,
              span: 1,
              key: 'antennaHeight'
            };
            mainArr1.value.push(obj1);
            break;

          case 'antennaAngle':
            obj1 = {
              name: '天线架设角(°）',
              value: item.antennaAngle,
              span: 1,
              key: 'antennaAngle'
            };
            mainArr1.value.push(obj1);
            break;

          case 'beamWidth':
            obj1 = {
              name: '波束宽度(°）',
              value: item.beamWidth,
              span: 1,
              key: 'beamWidth'
            };
            mainArr1.value.push(obj1);
            break;

          case 'decoy':
            obj1 = {
              name: '诱饵情况',
              value: item.decoy,
              span: 3,
              key: 'decoy'
            };
            mainArr1.value.push(obj1);
            break;
          case 'equipment':
            obj1 = {
              name: '装备能力',
              value: item.equipment,
              span: 3,
              key: 'equipment'
            };
            obj1.facilityId = item.facilityId;
            mainArr1.value.push(obj1);
            break;
          case 'changeTrend':
            obj1 = {
              name: '变化情况',
              value: item.changeTrend,
              span: 3,
              key: 'changeTrend'
            };
            mainArr1.value.push(obj1);
            break;
        }
      }
      tableList.value.push({ facilityType: 2, data: mainArr1.value });
    }
  });
};
// <是否为新增设施 默认为新增 @hf
// 按钮风格
const isNewFacilityButtons = [
  {
    text: '是',
    type: 'primary',
    isNew: true
  },
  {
    text: '否',
    type: 'danger',
    isNew: false
  }
];
const handleIsNewFacilityClick = (isNew) => {
  if (isNew) basicMessage.value.isNewFacility = 1;
  else basicMessage.value.isNewFacility = 0;
};

// 保存数据处理
const addTargetMethod = () => {
  console.log(tableList.value, '0000000');
  let dataList = basicMessage.value;
  dataList.radars = [];
  tableList.value.forEach((item) => {
    let obj = {};
    item.data.forEach((it) => {
      obj[it.key] = it.value;
      obj.facilityId = it.facilityId;
      // obj.facilityId = '';
    });
    obj.facilityType = item.facilityType;

    dataList.radars.push(obj);
  });
  return dataList;
};
// @hf>
// 详情参数
let basicMessage = ref({
  targetName: '',
  targetType: '',
  country: '',
  centerLon: '',
  centerLat: '',
  highAltitude: '',
  positionFunction: '',
  positionGeographic: '',
  mainFacility: '',
  changeTrend: '',
  id: '',
  isNewFacility: true, //@新字段（是否新增设施） @hf
  // 添加雷达表单字段 -?- @hf
  radars: []
});

// 详情添加
let arr = ref([
  { id: 1, name: '设施' },
  { id: 2, name: '雷达' }
]);
let tableList = ref([]);
// 添加设施或雷达 表单渲染方式
const handOpen = (itemName) => {
  if (itemName === '设施') {
    tableList.value.push({
      facilityType: 1,
      data: [
        {
          name: '名称',
          value: '',
          span: 3,
          key: 'facilityName'
        },
        {
          name: '目标尺寸',
          value: '',
          span: 3,
          key: 'targetSize'
        },
        {
          name: '伪装防护情况',
          value: '',
          span: 3,
          key: 'camouflage'
        },
        {
          name: '识别特征',
          value: '',
          span: 3,
          key: 'feature'
        },
        // {
        //   name: "装备类型",
        //   value: "",
        //   span: 1,
        //   key: "equipmentType",
        //   type: "sel",
        // },
        {
          name: '固定设施类型',
          value: '',
          span: 1,
          key: 'fixedType',
          type: 'sel'
        },
        {
          name: '新增情况',
          value: '',
          span: 1,
          key: 'isNewFacility',
          type: 'switch'
        }
      ]
    });
  } else if (itemName === '雷达') {
    tableList.value.push({
      facilityType: 2,
      data: [
        {
          name: '名称',
          value: '',
          span: 3,
          key: 'facilityName',
          status: true,
          type: 'text-common'
        },
        {
          name: '目标尺寸',
          value: '',
          span: 3,
          key: 'targetSize',
          type: 'text-common'
        },
        {
          name: '伪装防护情况',
          value: '',
          span: 3,
          key: 'camouflage',
          type: 'text-common'
        },
        {
          name: '识别特征',
          value: '',
          span: 3,
          key: 'feature',
          type: 'text-common'
        },
        {
          name: '雷达型号',
          value: '',
          span: 1,
          key: 'radar',
          status: true,
          // type: 'sel',
          type: 'text-select'
        },
        {
          name: '雷达ID',
          value: '',
          span: 0,
          key: 'radarId',
          status: true,
          type: 'none'
        },

        // {
        //   name: "",
        //   value: "",
        //   span: 1,
        //   key: "type",
        //   status: false,
        // },

        // 自动补全字段
        {
          name: '天线类型',
          inputing: 1, //开启自动补全
          value: '',
          span: 1,
          key: 'antennaType',
          status: true,
          type: 'text-auto'
        },
        {
          name: '工作波段',
          inputing: 1,
          value: null,
          span: 1,
          key: 'workBand',
          status: true,
          type: 'text-auto'
        },

        {
          name: '发射机输出功率(w)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'sender',
          status: true,
          type: 'text-auto'
        },
        {
          name: '载频类型',
          inputing: 1,
          value: '',
          span: 1,
          key: 'carrierType',
          status: true,
          type: 'text-auto'
        },

        {
          name: '载频值(MHz)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'carrierValue',
          status: true,
          type: 'text-auto'
        },
        {
          name: '载频容差(MHz)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'carrierAlw',
          status: true,
          type: 'text-auto'
        },

        {
          name: '重周类型',
          inputing: 1,
          value: '',
          span: 1,
          key: 'cycleType',
          status: true,
          type: 'text-auto'
        },
        {
          name: '重周值(μs)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'cycleValue',
          status: true,
          type: 'text-auto'
        },
        // {
        //   name: "重周值(μs)",
        //   inputing: 1,
        //   value: "cycleValue",
        //   span: 1,
        //   key: "cycleValue",
        //   type: 'text-auto',
        // },
        {
          name: '重周容差(μs)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'cycleAlw',
          status: true,
          type: 'text-auto'
        },
        {
          name: '脉宽类型',
          inputing: 1,
          value: '',
          span: 1,
          key: 'pulseType',
          status: true,
          type: 'text-auto'
        },
        {
          name: '脉宽值(μs)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'pulseValue',
          status: true,
          type: 'text-auto'
        },
        {
          name: '脉宽容差(μs)',
          inputing: 1,
          value: '',
          span: 1,
          key: 'pulseAlw',
          status: true,
          type: 'text-auto'
        },
        {
          name: '天线架设高度（米）',
          inputing: 1,
          value: '',
          span: 1,
          key: 'antennaHeight',
          status: true,
          type: 'text-auto'
        },
        {
          name: '天线架设角(°）',
          inputing: 1,
          value: '',
          span: 1,
          key: 'antennaAngle',
          status: true,
          type: 'text-auto'
        },
        {
          name: '波束宽度(°）',
          inputing: 1,
          value: '',
          span: 1,
          key: 'beamWidth',
          status: true,
          type: 'text-auto'
        },
        // textarea字段
        {
          name: '诱饵情况',
          value: '',
          span: 3,
          key: 'decoy',
          status: true,
          type: 'textarea'
        },
        {
          name: '装备能力',
          value: '',
          span: 3,
          key: 'equipment',
          status: true,
          type: 'textarea'
        }
      ]
    });
  }
};
// 国家类别数据
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

// fake version @hf
const radarTypes = ref([]);
const db_Radars = ref([]); //数据库已有radar(数据库缓存)
const curRadarType = ref('');
const curRadarParams = ref({});
const getAllRadarInfos = async () => {
  const res = await getRadar();
  if (res.code != 200) return;
  const radarInfos = res.data;
  radarTypes.value = radarInfos.map((item) => item.radar);
  db_Radars.value = res.data.filter((item) => item.radar != null);
};
onMounted(() => {
  getAllRadarInfos();
});
// 点击雷达型号下拉选
const changeRedar = (row, index) => {
  tableList.value[index].data.forEach((item) => {
    if (item.key == 'facilityName' ||
      item.key == 'targetSize' ||
      item.key == 'camouflage' ||
      item.key == 'feature'
    ) return

    item.value = row[item.key];
  });
};
let manuRadar = {};
let lastManuRadar = {};
const paramsCount = 17;
const setManuRadarParam = ({ key, value, inputing }) => {
  //  如果参数输入完毕 提交表单
  let _value_ = curRadarParams.value[key];
  if (Object.keys(manuRadar).length === paramsCount) {
    console.log('radar params complete', manuRadar, 'manuRadar-final');
    basicMessage.value.radars.push(manuRadar);
    console.log('manu radar has pushed to radars array');
    lastManuRadar = manuRadar;
    // 防止污染下一次提交
    manuRadar = {};
    return;
  }

  console.log(_value_, key, '-radar params manu input');
  // 更新 雷达输入数据
  manuRadar[key] = _value_;
  lastManuRadar[key] = _value_;


  console.log(manuRadar, 'manuRadar');
  // console.log(lastManuRadar, 'lastManuRadar')//可以在提交后的基础上新增参数
  //  更新表单
  // getAllRadarInfos()
};
// < 经纬度验证 @hf
const isLonInvalid = ref(true);
const isLatInvalid = ref(true);
const testLon = (value) => {
  if (!value) return;
  const valid = lonDMS(value) || isValidLongitude(value);
  console.log(valid, 'valid')
  if (!valid) {
    isLonInvalid.value = false;
    ElMessage({
      type: 'error',
      message: '超出经度范围'
    });
  } else {
    isLatInvalid.value = true;
    isLonInvalid.value = true;
  };
};
const testLat = (value) => {
  if (!value) return;
  const valid = latDMS(value) || isValidLatitude(value);
  if (!valid) {
    isLonInvalid.value = false;
    ElMessage({
      type: 'error',
      message: '超出纬度范围'
    });
    isLatInvalid.value = false;
  } else {
    isLatInvalid.value = true;
    isLonInvalid.value = true;
  };
};
// @hf>
onMounted(() => {
  gettypeData();
  getCountryData();
  getDictType('equip_type');
  getDictType('fixed_type');
});
defineExpose({ addTargetMethod, returnIds });
</script>

<style lang="scss">
.error-input-lon .el-input__inner {
  color: red;
}

.error-input-lat .el-input__inner {
  color: red;
}

.el-descriptions__header {
  .el-descriptions__title {
    width: 100%;

    .descrTitle {
      width: 98%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.descriptions {
  padding: 5px 10px;
  overflow-y: auto;
}

.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  background: #152a41;
  color: #fff;
  width: 80px;
}

.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell {
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

.el-input__inner {
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
  background-color: $selectBg;
  /* 这里设置下拉框的背景颜色 */
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
  background-color: $selectBg;
  /* 这里设置下拉框的背景颜色 */
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
