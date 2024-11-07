<script setup>
import {
  ref,
  defineExpose,
  defineEmits,
  defineProps,
  watch,
  onMounted,
} from "vue";
import { addTarget, changeTarget, getType, getCountry, getAlias } from "@/api/behindInterface/target/index.js";
import {
  dictType,
} from "@/api/frontend/record/index";
import { ElMessage } from "element-plus";
import { isValidLongitude, isValidLatitude } from '@/utils/validate';
import { lonDMS, latDMS } from '@/utils/lonLat'
const { proxy } = getCurrentInstance();
const emit = defineEmits(["cancels", "getList"]);
const props = defineProps(["formData"]);
let basicMessage = ref({
  targetName: "",
  targetType: "",
  targetAlias: "",
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


// 查询装备和设施
let equipData = ref();
let facilityData = ref();
const getDictType = (str) => {
  dictType(str).then((res) => {
    if (str == "equip_type") {
      equipData.value = res.data;
    } else if (str == "fixed_type") {
      facilityData.value = res.data;
    }
  });
};


let currenTableData = ref();
let currenTableData1 = ref();
// 类别数据
let typeData = ref([]);
// 别名数据@hf
let aliasData = ref([]);
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

let getAliasData = () => {
  getAlias().then((res) => {
    aliasData.value = res.data;
  });
};
const lonFlag = ref(true);
const latFlag = ref(true);
const validLon = (rule, value, callback) => {

  if (!lonDMS(value) && !isValidLongitude(value)) {
    lonFlag.value = false;
    callback(new Error('经度格式错误'));
  }
  else {
    lonFlag.value = true;
    callback();
  }
};

const validLat = (rule, value, callback) => {
  if (!latDMS(value) && !isValidLatitude(value)) {
    latFlag.value = false;
    callback(new Error('纬度格式错误'));
  } else {
    latFlag.value = true;
    callback();
  }
};

const rules = {//NEED @hf
  targetName: [
    { required: true, message: "请输入名称", trigger: "blur" }
  ],
  targetType: [
    { required: true, message: "请选择类型", trigger: "blur" }
  ],
  country: [
    { required: true, message: "请选择国家(地区)", trigger: "blur" }
  ],
  centerLon: [
    { required: true, message: "请输入经度", trigger: "blur" },
    { validator: validLon, message: '经度格式错误', trigger: 'blur' }
  ],
  centerLat: [
    { required: true, message: "请输入纬度", trigger: "blur" },
    { validator: validLat, message: '纬度格式错误', trigger: 'blur' }
  ]
};

const isLonInvalid = ref(true);
const isLatInvalid = ref(true);
const testLon = (value) => {

};
const testLat = (value) => {
};

const labelStyle = {
  "text-align": "center",
  "font-weight": "600",
  height: "60px",
  width: "30%",
};
const contentStyle = {
  "text-align": "center",
  "min-width": "200px",
  "word-break": "break-all",
};
onMounted(() => {
  gettypeData();
  getCountryData();
  getAliasData();
  getDictType("equip_type");
  getDictType("fixed_type");
});
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
let currentBasicMessage = ref();
const handleUpdates = (newVal) => {
  console.log(newVal.value, 'handleUpdate======')//后台返回的数据
  currenTableData.value = newVal.value.radars?.filter(item => item.facilityType === 1);
  currenTableData1.value = newVal.value.radars?.filter(item => item.facilityType === 2);
  basicMessage.value = newVal.value;
  currentBasicMessage.value = clone(basicMessage.value);
  let obj = {};
  let mainArr = ref([]);
  let disabledVal = ref(false);
  if (currenTableData.value) {
    currenTableData.value.forEach((item, index) => {
      mainArr.value[index] = [];
      for (var i in item) {
        obj.facilityId = item.facilityId;
        switch (i) {
          case "facilityName":
            obj = {
              name: "名称",
              value: item.facilityName,
              span: 1,
              key: "facilityName",
            };
            mainArr.value[index].push(obj);
            break;
          case "targetSize":
            obj = {
              name: "目标尺寸",
              value: item.targetSize,
              span: 1,
              key: "targetSize",
            };
            mainArr.value[index].push(obj);
            break;
          case "camouflage":
            obj = {
              name: "伪装防护情况",
              value: item.camouflage,
              span: 1,
              key: "camouflage",
            };
            mainArr.value[index].push(obj);
            break;
          case "feature":
            obj = {
              name: "识别特征",
              value: item.feature,
              span: 1,
              key: "feature",
            };
            mainArr.value[index].push(obj);
            break;
        }
      }
    });
    tableData.value = mainArr.value;
  }

  let obj1 = {};
  let mainArr1 = ref([]);
  if (currenTableData1.value) {
    currenTableData1.value.forEach((item, index) => {
      mainArr1.value[index] = [];
      for (var i in item) {
        obj1.facilityId = item.facilityId;
        switch (i) {
          case "radar":
            obj1 = {
              name: "名称",
              value: item.radar,
              span: 1,
              key: "radar",
            };
            mainArr1.value[index].push(obj1);
            break;
          case "antennaType":
            obj1 = {
              name: "天线类型",
              value: item.antennaType,
              span: 1,
              key: "antennaType",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "work_band":
            obj1 = {
              name: "工作波段",
              value: item.work_band,
              span: 1,
              key: "work_band",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "sender":
            obj1 = {
              name: "发射机输出功率(w)",
              value: item.sender,
              span: 1,
              key: "sender",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "carrierType":
            obj1 = {
              name: "载频类型",
              value: item.carrierType,
              span: 1,
              key: "carrierType",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "carrierValue":
            obj1 = {
              name: "载频值(MHz)",
              value: item.carrierValue,
              span: 1,
              key: "carrierValue",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "carrierAlw":
            obj1 = {
              name: "载频容差(MHz)",
              value: item.carrierAlw,
              span: 1,
              key: "carrierAlw",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "cycleType":
            obj1 = {
              name: "重周类型",
              value: item.cycleType,
              span: 1,
              key: "cycleType",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "cycleValue":
            obj1 = {
              name: "重周值(μs)",
              value: item.cycleValue,
              span: 1,
              key: "cycleValue",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "cycleAlw":
            obj1 = {
              name: "重周容差(μs)",
              value: item.cycleAlw,
              span: 1,
              key: "cycleAlw",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "pulseType":
            obj1 = {
              name: "脉宽类型",
              value: item.pulseType,
              span: 1,
              key: "pulseType",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "pulseValue":
            obj1 = {
              name: "脉宽值(μs)",
              value: item.pulseValue,
              span: 1,
              key: "pulseValue",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "pulseAlw":
            obj1 = {
              name: "脉宽容差(μs)",
              value: item.pulseAlw,
              span: 1,
              key: "pulseAlw",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "antennaHeight":
            obj1 = {
              name: "天线架设高度（米）",
              value: item.antennaHeight,
              span: 1,
              key: "antennaHeight",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "antennaAngle":
            obj1 = {
              name: "天线架设角(°）",
              value: item.antennaAngle,
              span: 1,
              key: "antennaAngle",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "beamWidth":
            obj1 = {
              name: "波束宽度(°）",
              value: item.beamWidth,
              span: 1,
              key: "beamWidth",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "decoy":
            obj1 = {
              name: "诱饵情况",
              value: item.decoy,
              span: 3,
              key: "decoy",
            };
            mainArr1.value[index].push(obj1);
            break;

          case "changeTrend":
            obj1 = {
              name: "变化情况",
              value: item.changeTrend,
              span: 3,
              key: "changeTrend",
            };
            mainArr1.value[index].push(obj1);
            break;
        }
      }
    });
    tableData1.value = mainArr1.value;
    // tableData1.value.forEach((item) => {
    //   console.log(item,'item');
    //   if (item.name === "") {
    //     item.status = false;
    //   } else {
    //     item.status = true;
    //   }
    // });
  }
};
const tableData = ref([]);
const tableData1 = ref([]);
let arr = ref([{ name: "设施" }, { name: "雷达" }]);
let handOpen = (item) => {
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
      // {
      //     name: "装备类型",
      //     value: "",
      //     span: 1,
      //     key: "equipmentType",
      //     type: "sel",
      //   },
      {
        name: "固定设施类型",
        value: "",
        span: 1,
        key: "fixedType",
        type: "sel",
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
const emitSonData = () => {
  emit("cancels");
};
const clear = () => {
  basicMessage.value = {};
  tableData.value = [];
  tableData1.value = [];
};
const getList = () => {
  emit("getList");
};

// 提交表单 submit
let addTargetMethod = () => {
  let arr = [];
  // let obj1 = {};
  let arr1 = [];

  tableData.value.forEach((item) => {
    let obj1 = {};
    item.forEach((items) => {
      obj1[items.key] = items.value;
      obj1.facilityType = 1;
      obj1.facilityId = items.facilityId;
    });
    obj1.facilityId = item[0].facilityId;
    arr.push(obj1);
  });

  tableData1.value.forEach((item) => {
    let obj2 = {};
    item.forEach((items) => {
      obj2[items.key] = items.value;
      obj2.facilityType = 2;
      obj2.facilityId = items.facilityId;
    });
    obj2.facilityId = item[0].facilityId;
    arr1.push(obj2);
  });
  basicMessage.value.radars = [...arr, ...arr1]
  // basicMessage.value.mainFacilityList = arr;
  // basicMessage.value.radars = arr1;
  if (basicMessage.value.id) {
    // 修改目标基本信息   put  --- /target/tree
    changeTarget(basicMessage.value).then((res) => {
      if (res.code === 200) {
        proxy.$modal.msgSuccess("修改成功");
        emitSonData();
        getList();
        basicMessage.value = {};
        tableData.value = [];
        tableData1.value = [];
      }
    });
  } else {
    addTarget(basicMessage.value).then((res) => {
      if (res.code === 200) {
        proxy.$modal.msgSuccess("新增成功");
        emitSonData();
        getList();
        basicMessage.value = {};
        tableData.value = [];
        tableData1.value = [];
      }
    });
  }
};
let getbasicMessage = () => {
  let arr = [];
  // let obj1 = {};
  let arr1 = [];

  tableData.value.forEach((item) => {
    let obj1 = {};
    item.forEach((items) => {
      obj1[items.key] = items.value;
      obj1.facilityType = 1;
      obj1.facilityId = items.facilityId;
    });
    obj1.facilityId = item[0].facilityId;
    arr.push(obj1);
  });

  tableData1.value.forEach((item) => {
    let obj2 = {};
    item.forEach((items) => {
      obj2[items.key] = items.value;
      obj2.facilityType = 2;
      obj2.facilityId = items.facilityId;
    });
    obj2.facilityId = item[0].facilityId;
    arr1.push(obj2);
  });
  basicMessage.value.radars = [...arr1, ...arr]
  // basicMessage.value.mainFacilityList = arr;
  // basicMessage.value.radars = arr1;
  localStorage.setItem("basicMessage", JSON.stringify(basicMessage.value));
  // currentBasicMessage
  // changeData.value = [];
  // compareObjectsAndPrint(currentBasicMessage.value, basicMessage.value);
  // console.log(changeData, "123");
  // let obj = {
  //   radars:[],
  //   mainFacilityList:[]
  // };
  // changeData.value.forEach((item, index) => {
  //   if (!index == 0) {
  //     if (item.data.facilityType === 1) {
  //       obj.mainFacilityList.push(item.dataVal);
  //     } else if (item.data.facilityType === 2) {
  //       obj.radars.push(item.dataVal);
  //     }else {
  //       obj[item.key] = item.val
  //     }
  //   }
  // });
  // obj.id = basicMessage.value.id;
  // console.log(obj,'修改');
};
let changeData = ref({});
let compareObjectsAndPrint = (obj1, obj2) => {
  // 获取对象的所有属性名
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);

  // 检查属性数量是否相同
  if (keys1.length !== keys2.length) {
    console.log("属性数量不一致");
    return;
  }

  // 遍历属性名，检查每个属性的值是否相同
  for (var i = 0; i < keys1.length; i++) {
    var key = keys1[i];
    if (obj1[key] instanceof Array && obj2[key] instanceof Array) {
      // console.log(obj1[key],'obj1[key]');
      // console.log(obj2[key],'obj2[key]');

      for (var k = 0; k < obj2[key].length; k++) {
        console.log(obj1[key][k]);
        console.log(obj2[key][k]);
        // radar
        if (!obj1[key][k]) {
          changeData.value.push({
            newVal: obj1[key][k],
            key: key,
            val: obj2[key][k],
            data: obj2[key][k],
            dataVal: obj2[key][k],
            isNew: true,
          });
        } else {
          if (obj2[key][k].facilityType == 2) {
            obj1[key][k].facilityType = 2;
          } else if (obj2[key][k].facilityType == 1) {
            obj1[key][k].facilityType = 1;
          }
          compareObjectsAndPrint(obj1[key][k], obj2[key][k]);
        }
      }
    } else {
      if (obj1[key] !== obj2[key]) {
        // console.log(
        //   "属性 '" +
        //     key +
        //     "' 不一致" +
        //     "  第一个对象值: " +
        //     obj1[key] +
        //     "  第二个对象值: " +
        //     obj2[key]
        // );

        changeData.value.push(
          obj2.id
            ? {
              key: key,
              id: obj2.facilityId ? obj2.facilityId : obj2.id,
              val: obj2[key],
              data: obj2,
              dataVal: {
                [key]: obj2[key],
                id: obj2.id,
              },
            }
            : {
              key: key,
              id: obj2.facilityId ? obj2.facilityId : obj2.id,
              val: obj2[key],
              data: obj2,
              dataVal: {
                [key]: obj2[key],
                facilityId: obj2.facilityId,
              },
            }
        );
      } else {
        // console.log(
        //   "属性 '" +
        //     key +
        //     "'一致" +
        //     "   第一个对象值: " +
        //     obj1[key] +
        //     "  第二个对象值: " +
        //     obj2[key]
        // );
      }
    }
  }
};
let newVal = ref();
let oldVal = ref();
watch(
  () => basicMessage.value,
  (newVal, oldVal) => {
    // newVal.value = newVal;
    // oldVal.value = oldVal;
    // console.log(newVal,'val');
    // console.log(oldVal,'val');
    // compareObjectsAndPrint(newVal, oldVal);
    // console.log(oldVal.targetType, '--目标类别')
    // console.log(oldVal.country, '--国家(地区)')
    // const warn = () => {
    //   if (!oldVal.targetType) return '请选择目标类别';
    //   else if (!oldVal.country) return '请选择国家(地区)';
    //   return null;
    // };
    // const warningMessage = warn();
    // if (warningMessage) {
    //   ElMessage.error(warningMessage);
    // }
  },
  {
    deep: true,
    // immediate: true,
  }
);
defineExpose({ addTargetMethod, handleUpdates, clear, getbasicMessage });
</script>
<template>
  <!-- NEED UPDATE@hf -->
  <el-form :model="basicMessage" label-width="100px" :size="size" :rules=rules>
    <div class="descriptions">
      <el-descriptions class="margin-top" :style="contentStyle" :column="3" :size="size" border>
        <!-- 标题 -->
        <template #title> 基本信息 </template>
        <!-- 添加按钮 -->
        <template #extra>
          <el-dropdown style="position:absolute;top:25px;right:50px">
            <el-button type="primary">
              添加<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in arr" @click="handOpen(item.name)">
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
        <!-- 目标名称 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">目标名称</div>
          </template>
          <el-form-item prop="targetName" :rules="rules.targetName" class="form-item">
            <el-input style="width: 160px" v-model="basicMessage.targetName" :title="basicMessage.targetName"></el-input>
          </el-form-item>

        </el-descriptions-item>
        <!-- 目标别名 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">目标别名</div>
          </template>
          <el-select v-model="basicMessage.targetAlias" placeholder="请选择目标别名" style="width: 200px" allow-create
            filterable>
            <el-option v-for="item in aliasData" :key="item" :label="item" :value="item" />
          </el-select>
          <!-- <el-input v-model="basicMessage.targetType" :title="basicMessage.targetType" ></el-input> -->
        </el-descriptions-item>
        <!-- 目标类别 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">目标类别</div>
          </template>
          <el-form-item prop="targetType" :rules="rules.targetType" class="form-item">
            <el-select v-model="basicMessage.targetType" placeholder="请选择目标类别" style="width: 200px" allow-create
              filterable>
              <el-option v-for="item in typeData" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
        <!-- 国家（地区） -->
        <el-descriptions-item :rules="rules.country">
          <template #label>
            <div class="cell-item">国家（地区）</div>
          </template>
          <!-- <el-input
          v-model="basicMessage.country"
          :title="basicMessage.country"
        ></el-input> -->
          <el-form-item prop="country" :rules="rules.country" class="form-item">
            <el-select v-model="basicMessage.country" placeholder="请选择国家（地区）" style="width: 180px" allow-create
              filterable>
              <el-option v-for="item in countryData" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
        <!-- 经度 -->
        <el-descriptions-item :rules="rules.centerLon">
          <template #label>
            <div class="cell-item">经度</div>
          </template>
          <el-form-item prop="centerLon" :rules="rules.centerLon" class="form-item">
            <el-input v-model="basicMessage.centerLon" :title="basicMessage.centerLon"
              @change="testLon(basicMessage.centerLon)"></el-input>
          </el-form-item>
        </el-descriptions-item>
        <!-- 纬度 -->
        <el-descriptions-item :rules="rules.centerLat">
          <template #label>
            <div class="cell-item">纬度</div>
          </template>
          <el-form-item prop="centerLat" :rules="rules.centerLat" class="form-item">
            <el-input v-model="basicMessage.centerLat" :title="basicMessage.centerLat"
              @change="testLat(basicMessage.centerLat)"></el-input>
          </el-form-item>
        </el-descriptions-item>
        <!-- 所属区域 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">所属区域</div>
          </template>
          <el-input style="width: 160px" v-model="basicMessage.area" :title="basicMessage.area"></el-input>
        </el-descriptions-item>
        <!-- 海拔高（米） -->
        <el-descriptions-item :span="2">
          <template #label>
            <div class="cell-item">海拔高（米）</div>
          </template>
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model="basicMessage.highAltitude"
            :title="basicMessage.highAltitude"></el-input>
        </el-descriptions-item>
        <!-- 地位作用 -->
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">地位作用</div>
          </template>
          <el-input v-model="basicMessage.positionFunction" :title="basicMessage.positionFunction" type="textarea"
            auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
        </el-descriptions-item>
        <!-- 地理位置 -->
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">地理位置</div>
          </template>
          <el-input v-model="basicMessage.positionGeographic" :title="basicMessage.positionGeographic" type="textarea"
            auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
        </el-descriptions-item>
        <!-- 主要设置 -->
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">主要设施</div>
          </template>
          <el-input v-model="basicMessage.mainFacility" :title="basicMessage.mainFacility" type="textarea"
            auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
        </el-descriptions-item>
        <!-- 变化情况 -->
        <el-descriptions-item :span="3">
          <template #label>
            <div class="cell-item">变化情况</div>
          </template>
          <el-input v-model="basicMessage.changeTrend" :title="basicMessage.changeTrend" type="textarea"
            auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
      <!--设施  -->
      <el-descriptions class="margin-top" title="设施" :column="3" :size="size" border v-for="item in tableData">
        <el-descriptions-item v-for="(items, indexs) in item" :span="items.span">
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
            <el-select v-if="items.key == 'fixedType'" v-model="items.value" :title="items.value">
              <el-option v-for="facility in facilityData" :key="facility.id" :label="facility.dictLabel"
                :value="facility.dictLabel"></el-option>
            </el-select>
          </div>
          <el-input v-else v-model="items.value" :title="items.value"> </el-input>
        </el-descriptions-item>
      </el-descriptions>
      <!-- --------------------------------------------------------------------------------------------------------------------------------------- -->
      <!-- 雷达 -->
      <el-descriptions class="margin-top" title="雷达" :column="3" :size="size" border v-for="item in tableData1">
        <el-descriptions-item v-for="items in item" :span="items.span">
          <template #label>
            <div class="cell-item">
              {{ items.name }}
            </div>
          </template>
          <el-input v-model="items.value" :title="items.value" v-if="items.name === '诱饵情况' || items.name === '装备能力'"
            type="textarea" auto-complete="off" :autosize="{ minRows: 1, maxRows: 10 }">
          </el-input>
          <el-input v-model="items.value" :title="items.value" v-else> </el-input>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-form>
</template>
<style scoped lang="scss">
.descriptions {
  width: 100%;
  // margin: 0 auto;
  overflow-y: scroll;
  height: 550px;
}

// 修改  input  textarea 的样式

::v-deep .el-textarea__inner {
  background: transparent !important;
  color: white;
  border: none;
  box-shadow: none;
  // overflow: hidden; /* 禁用滚动条 */
  // resize: none; /* 禁止用户手动调整文本框的尺寸 */
  // height: auto !important; /* 强制将高度设置为自适应 */
  // max-height: none !important; /* 禁用最大高度限制 */
}
</style>
<style>
.el-descriptions__title {
  color: #fff;
}

.el-descriptions__header {
  margin: 10px;
}

/* background: #152a41; */
.el-descriptions {
  background: #152a41;
  margin-top: 45px;
}

.el-descriptions__body {
  /* background: #152a41; */
}

.el-descriptions__content {
  color: #ffff !important;
}

.dialog-footer {
  margin-top: -12px;
  margin-right: 10px;
}

/* .cell-item {
  background: #1d3856 !important;
  color: #fff;
} */
.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell {
  border: 1px solid #276989 !important;
}

.el-dropdown {
  margin-top: 10px;
}
</style>
<style>
.el-descriptions__label.el-descriptions__cell.is-bordered-label {
  background: #063570;
  color: #fff;
  width: 80px;
}

.form-item {
  /* background-color: red; */
  margin-left: -100px;
}
</style>
