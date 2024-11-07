<!--
 * @Author: chenqiming chenqiming
 * @Date: 2024-07-15 14:05:39
 * @LastEditors: chenqiming chenqiming
 * @LastEditTime: 2024-07-15 15:19:46
 * @FilePath: \RuoYi-Vue3-3.8.6\src\views\targetDetail\components\pushPullDiv\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div :class="['drawer',{open:isOpen}]" @click.self = "closeDrawer">
        <div class="drawer-content">
            <p>{{titles}}</p>
            <slot></slot>
        </div>
    </div> 
</template>
<script setup>
import {ref ,watch} from "vue";
const props = defineProps({
    modelValue : { 
        type:Boolean,
        required:true
    },
    title:{
        type:String,
        required:true
    }
})
const isOpen = ref(false);
const titles = props.title;
watch(
    ()=>props.modelValue,
    (newVal)=>{
        isOpen.value  = newVal;
    }
)
</script>
<style lang="scss" scoped>
.drawer{
    width: 300px;
    height: calc(100vh - 120px);
    position:fixed;
    left: 50px;
    top: 90px;
    opacity:0;
    visibility:hidden;
    transition:  opacity 0.3s, visibility  0.3s;
    &.open{
        opacity:1;
        visibility: visible;
        .drawer-content{
            transform: translateX(0);
        }
    }
    .drawer-content{
        position:absolute;
        top:0;
        left:0;
        width: 300px;
        height: 100%;
        // background-color: red;
        background: url("@/assets/images/目标列表.png");
        background-size: 100% 100%;
        transform:translateX(-100%);
        transition: transform 0.3s;
        padding: 55px 5px 15px 15px;
        p{
            position: absolute;
            top: 8px;
            left: 10%;
            color: white;
            font-size: 18px;
            
        }
    }
}
</style>