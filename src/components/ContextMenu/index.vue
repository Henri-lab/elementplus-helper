<template>
    <!-- 右键菜单 -->
    <div v-if="menuVisible" :style="contextMenuStyle" class="context-menu">
        <ul>
            <li v-for="(item, index) in menuItems" :key="index" @click="item.action">
                {{ item.label }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    menuItems: {// 菜单选项
        type: Array,
        default: [
            { label: '删除', action: () => console.log('delete') },
            { label: '编辑', action: () => console.log('edit') },
        ],
    },
    el: {
        type: HTMLElement,
        default: null,
    }

});

const menuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const contextMenuStyle = ref({
    top: '0px',
    left: '0px',
});
let curLabel = null;
let nodeLabelClicked = null;

const menuItems = props.menuItems;
const el = props.el;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// 右键点击事件处理，显示自定义菜单
const handleClickRight = async (event) => {
    event.preventDefault(); // 阻止默认的右键菜单

    menuX.value = event.clientX;
    menuY.value = event.clientY;

    // 更新菜单的位置
    contextMenuStyle.value = {
        top: `${menuY.value}px`,
        left: `${menuX.value}px`,
    };

    // 显示菜单
    menuVisible.value = true;
};

// 点击页面其他地方时隐藏菜单
const handleClick = () => {
    menuVisible.value = false;
};

// 注册事件
onMounted(() => {
    document.addEventListener('click', handleClick);
    el || document.addEventListener('contextmenu', handleClickRight);
    console.log('contextmenu is now mounted')
});

// 移除事件
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
    el || document.removeEventListener('contextmenu', handleClickRight);
    console.log('contextmenu is now unmounted')
});
</script>

<style scoped>
.context-menu {
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 1000;
    width: 120px;
}

.context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.context-menu li:hover {
    background-color: #f2f2f2;
}
</style>