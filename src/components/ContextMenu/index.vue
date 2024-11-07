<template>
    <!-- 右键菜单 -->
    <div v-if="menuVisible" :style="contextMenuStyle" class="context-menu">
        <ul>
            <li v-for="(item, index) in menuItems" :key="index" @click="handleMenuItemClick(item.action)">
                {{ item.label }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    menuItems: {
        type: Array,
        default: () => [
            { label: '删除', action: () => console.log('delete') },
            { label: '编辑', action: () => console.log('edit') },
        ],
    },
    // 绑定的目标元素选择器或 DOM 元素
    targetElement: {
        type: [String, Object],
        default: 'app',
    },
    global: {
        type: Boolean,
        default: false,
    },
});

const menuVisible = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const contextMenuStyle = ref({
    top: '0px',
    left: '0px',
});
const targetRef = ref(null);

function handleMenuItemClick(action) {
    action();
    menuVisible.value = false;
}

// 右键点击事件处理
const handleClickRight = (event) => {
    event.preventDefault();

    menuX.value = event.clientX;
    menuY.value = event.clientY;

    contextMenuStyle.value = {
        top: `${menuY.value}px`,
        left: `${menuX.value}px`,
    };

    menuVisible.value = true;
};

// 点击其他地方时隐藏菜单
const handleClick = () => {
    menuVisible.value = false;
};

// 根据 props.targetElement 动态绑定右键菜单事件
function bindContextMenu() {
    if (props.global) {
        document.addEventListener('contextmenu', handleClickRight);
        console.log('contextmenu is now globally bound');
    } else {
        // 如果 targetElement 是字符串，按选择器查询元素
        targetRef.value = typeof props.targetElement === 'string'
            ? document.getElementById(props.targetElement)
            : props.targetElement;

        if (targetRef.value) {
            targetRef.value.addEventListener('contextmenu', handleClickRight);
            console.log('contextmenu is now bound to element:', targetRef.value.id || targetRef.value);
        } else {
            console.warn(`Element with selector "${props.targetElement}" not found.`);
        }
    }
}

// 移除绑定的右键菜单事件
function unbindContextMenu() {
    if (props.global) {
        document.removeEventListener('contextmenu', handleClickRight);
        console.log('contextmenu is now unbound globally');
    } else if (targetRef.value) {
        targetRef.value.removeEventListener('contextmenu', handleClickRight);
        console.log('contextmenu is now unbound from element:', targetRef.value.id || targetRef.value);
    }
}

// 监听 targetElement 变化
watch(() => props.targetElement, (newTarget) => {
    unbindContextMenu();
    bindContextMenu();
});

onMounted(() => {
    document.addEventListener('click', handleClick);
    bindContextMenu();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClick);
    unbindContextMenu();
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