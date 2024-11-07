<template>
  <div>
    <!-- 修改图层样式弹层 -->
    <div class="setCanvaStyle">
      <div class="canvaBody">
        <div class="listStyle">
          <span>名称</span>
          <el-input
            @change="setText"
            v-model="state.styleFrom.content"
          />
        </div>
        <div v-show="state.styleFrom.type=='label'" class="listStyle">
          <span>字体</span>
          <!-- <el-input
            @change="setSize"
            v-model="state.styleFrom.wordFont"
          /> -->
           <el-select @change="setSize" v-model="state.styleFrom.wordFont">
              <el-option value="黑体" label="黑体"></el-option>
              <el-option value="宋体" label="宋体"></el-option>
              <el-option value="仿宋" label="仿宋"></el-option>
              <el-option value="微软雅黑" label="微软雅黑"></el-option>
              <el-option value="楷体" label="楷体"></el-option>
            </el-select>
        </div>
        <div v-show="state.styleFrom.type=='label'" class="listStyle">
          <span>字号</span>
          <el-input-number
              :min="1"
               controls-position="right"
            @change="setSize"
            v-model="state.styleFrom.size"
          />
        </div>
        <div v-show="state.styleFrom.type!='label'" class="listStyle">
          <span>线宽</span>
          <div>
            <el-input-number
              :min="1"
               controls-position="right"
              v-model="state.styleFrom.lineSize"
              @change="setWidth"
            />
          </div>
        </div>
        <div v-show="state.styleFrom.type=='label'" class="listStyle">
          <span>阴影宽</span>
          <div>
            <el-input-number
              :min="0"
               controls-position="right"
              v-model="state.styleFrom.strokeSize"
              @change="setBorderWidth"
            />
          </div>
        </div>
        <div v-show="state.styleFrom.type!='label'" class="listStyle">
          <span>线类型</span>
          <div>
            <el-select @change="setLineType" v-model="state.styleFrom.lineType">
              <el-option value="solid" label="实线"></el-option>
              <el-option value="dash" label="虚线"></el-option>
            </el-select>
          </div>
        </div>
        <div v-show="state.styleFrom.type=='label'" class="listStyle">
          <span>角度</span>
          <div>
            <el-input-number
              :min="0"
              :max="360"
              controls-position="right"
              @change="setRotation"
              v-model="state.styleFrom.wordAngle"
            />
          </div>
        </div>
        <div class="listStyle">
          <span>颜色</span>
          <div class="colorSty">
            <el-color-picker
              @change="setColor"
              v-model="state.styleFrom.color"
            />
            <el-input
              @change="setColor"
              v-model="state.styleFrom.color"
              style="width: 165px"
            />
          </div>
        </div>
        <div v-show="state.styleFrom.type=='label'" class="listStyle">
          <span>描边颜色</span>
          <div class="colorSty">
            <el-color-picker
              @change="setBorColor"
              v-model="state.styleFrom.strokeColor"
            />
            <el-input
              @change="setBorColor"
              v-model="state.styleFrom.strokeColor"
              style="width: 165px"
            />
          </div>
        </div>
      </div>
      <div class="canvaFooter">
        <el-button @click="primaryStyle">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import entities from '@/utils/entities';
import { getCanvas } from '@/utils/cloneCanvas';
const Entities = new entities();
const emit = defineEmits(['primaryStyle']);
const props = defineProps({
  entityInfo: {
    type: Object,
    required: true,
    default: () => ({})
  },
  labelInfo: {
    type: Object,
    required: true,
    default: () => ({
      content: '',
      size: 25,
      color: '#e7e91e',
      show: true
    })
  }
});
watch(
  () => props.labelInfo,
  (val) => {
    console.log(val, 'val');
    state.styleFrom = {...state.styleFrom,...val};
  }
);
const state = reactive({
  styleFrom: {
    content: '',
    size: 15,
    color: '#e7e91e',
    show: true,
    lineType: 'solid',
    lineSize: '1',
    strokeSize:0,
    coords:"",
    createTime:null,
    id:'',
    strokeColor:null,
    type:"",
    wordAngle:null,
    wordFont:null,
    wordAngle:0
  }
});
onMounted(() => {});
// 确认按钮
const primaryStyle = () => {
  emit('primaryStyle', state.styleFrom);
  // 判断是文字类型
  if (props.entityInfo.billboard) {
    props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();
  }
};
// 判断是否为合法颜色
const isValidColor = (value) => {
  const testElement = document.createElement('div');
  testElement.style.color = value;
  return testElement.style.color !== '';
};
// 设置旋转角度
const setRotation = (row) => {
  if (props.entityInfo.billboard) {
    props.entityInfo.billboard.rotation = Cesium.Math.toRadians(row);
  }
};
// 修改标绘颜色
const setColor = () => {
  let color = isValidColor(state.styleFrom.color);
  if (!color) return;
  // 判断是文字类型
  if (props.entityInfo.billboard) {
    props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();
  }
  // 判断是矩形
  if (props.entityInfo.rectangle) {
    props.entityInfo.rectangle.outlineColor =
      new Cesium.Color.fromCssColorString(state.styleFrom.color);
  }
  // 判断是圆形
  if (props.entityInfo.ellipse) {
    props.entityInfo.ellipse.outlineColor = new Cesium.Color.fromCssColorString(
      state.styleFrom.color
    );
  }
  // 判断是线形
  if (props.entityInfo.polyline) {
    console.log(state.styleFrom.lineType, 'state.styleFrom.lineType');
    if (state.styleFrom.lineType == 'solid') {
        props.entityInfo.polyline.material =new Cesium.Color.fromCssColorString(state.styleFrom.color);
    } 
    if (state.styleFrom.lineType == 'dash') {
      console.log('dash线类型',state.styleFrom.color);
      props.entityInfo.polyline.material =
      new Cesium.PolylineDashMaterialProperty({
        color: new Cesium.Color.fromCssColorString(state.styleFrom.color), // 线条颜色
        dashLength: 16 // 虚线的长度
      });
    }
    // props.entityInfo.polyline.material = new Cesium.Color.fromCssColorString(
    //   state.styleFrom.color
    // );
  }
};
// 修改描边颜色
const setBorColor =()=>{
 if (props.entityInfo.billboard) {
    props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();
  }
}
// 修改标绘字号
const setSize = (row) => {
  // if (props.entityInfo.label) {
  //   props.entityInfo.label.font._value = state.styleFrom.size + 'px sans-serif';
  // }
   if (props.entityInfo.billboard) {
    props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();
  }
};
// 修改标绘名称
const setText = (row) => {
  // if (props.entityInfo.label) {
  //   props.entityInfo.label.text._value = state.styleFrom.content;
  // }
   if (props.entityInfo.billboard) {
    props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();
  }
};
// 修改虚线
const setLineType = (row) => {
  console.log(row, '切换虚线实线');
  if (row == 'solid') {
  props.entityInfo.polyline.material =new Cesium.Color.fromCssColorString(state.styleFrom.color);
  } else if (row == 'dash') {
    props.entityInfo.polyline.material =
      new Cesium.PolylineDashMaterialProperty({
        color: new Cesium.Color.fromCssColorString(state.styleFrom.color), // 线条颜色
        dashLength: 16 // 虚线的长度
      });
  }
};
// 修改线的宽度
const setWidth = () => {
  props.entityInfo.polyline.width = state.styleFrom.lineSize;
};
// 修改文字边框宽度
const setBorderWidth =()=>{
  props.entityInfo.billboard.image = getCanvas(state.styleFrom).toDataURL();

}
</script>

<style lang="scss" scoped>
.setCanvaStyle {
  position: fixed;
  right: 90px;
  top: 150px;
  height: 50%;
  width: 300px;
  background: #182737d4;
  border: 1px solid #1263a1;
  padding: 20px;
  z-index: 10;
  .canvaFooter {
    position: absolute;
    bottom: 20px;
    right: 30px;

    .el-button {
      width: 74px;
      height: 35px;
      margin-left: 10px;
      color: #ffff;
      background: url('@/assets/images/四字按钮.png') no-repeat;
      background-size: 100% 100%;
    }
  }
  .canvaBody {
    .listStyle {
      display: flex;
      height: 35px;
      line-height: 34px;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #fff;
      width: 100%;
      .colorSty{
        ::v-deep(.el-input__inner){
          width: 150px;
        }
      }
    }
  }
  ::v-deep(.el-input) {
    width: 200px;

    .el-input__inner {
      width: 180px;
      height: 34px;
      border: 1px solid #1296db;
      border-radius: 5px;
    }
  }
  ::v-deep(.el-select){
    .el-input{
width: 180px;
      .el-input__wrapper{
       width: 130px;
       .el-input__inner{
         width: 150px;
         border: none;
       }
     }
    }
  }
  ::v-deep(.el-input-number){
    width: 180px;
    .el-input__wrapper{
      padding: 0;
    }
  }
  // ::v-deep(.el-select) {
  //   width: 180px;
  //   margin: 0 8px;
  //   .el-input__inner {
  //     border: none;
  //   }
  // }
}
</style>
