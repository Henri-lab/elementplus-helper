<template>
  <div class="enhanced-tabs">
    <!-- Tab 列表 -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      class="demo-tabs"
      :stretch="stretchTabs"
      :before-leave="beforeLeave"
    >
      <!-- 渲染标签内容 -->
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" lazy>
        <!-- 使用插槽自定义标签内容 -->
        <template #label>
          <span>
            <i :class="tab.icon" v-if="tab.icon"></i>
            {{ tab.label }}
          </span>
        </template>
        <!-- 动态加载的组件内容 -->
        <div class="stringComp comp" v-if="typeof tab.component == 'string'">
          {{ tab.component }}
        </div>
        <component
          class="comp"
          v-else
          :is="tab.component"
          :content="tab.content"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 控制面板 -->
    <div class="control-panel">
      <el-checkbox v-model="stretchTabs">Stretch Tabs</el-checkbox>
      <el-input v-model="newTabName" placeholder="New Tab Name" />
      <el-button type="primary" @click="addTab">Add Tab</el-button>
      <el-button type="danger" @click="removeTab">Remove Active Tab</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, type Component, type PropType } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { TabsPaneContext } from 'element-plus';

type tabsItem = {
  label: string;
  name: string;
  component: Component | string;
  icon?: string;
  content?: string;
};

type helpInfo = {
  enabled: boolean;
  createInfo?: Function;
  type: 'info' | 'warning' | 'error' | 'success';
};
const props = defineProps({
  isGuard: {
    type: Boolean,
    default: true,
  },
  helpInfo: {
    type: Object as PropType<helpInfo> | any, //不能直接使用 TypeScript 自定义的类型
    default: {
      enabled: false,
      createInfo: () => 'This is a helpInfo',
      type: 'info',
    },
  },
  tabs: {
    type: Array<tabsItem>,
    default: () => [
      {
        label: 'User',
        name: 'first',
        component: 'UserComponent',
        icon: 'el-icon-user',
        content: 'User content',
      },
      {
        label: 'Config',
        name: 'second',
        component: 'ConfigComponent',
        icon: 'el-icon-setting',
        content: 'Config content',
      },
      {
        label: 'Role',
        name: 'third',
        component: 'RoleComponent',
        icon: 'el-icon-role',
        content: 'Role content',
      },
      {
        label: 'Task',
        name: 'fourth',
        component: 'TaskComponent',
        icon: 'el-icon-task',
        content: 'Task content',
      },
    ],
  },
});
// 定义 Tab 数据和选项
const activeName = ref('first');
const stretchTabs = ref(false);
const newTabName = ref('New Tab');
const tabs: Array<tabsItem> = reactive(props.tabs);

// 动态添加 Tab
const addTab = () => {
  const name = `tab-${Date.now()}`;
  tabs.push({ label: newTabName.value, name, component: 'NewComponent' });
  activeName.value = name;
  newTabName.value = '';
};

// 动态删除 Tab
const removeTab = () => {
  if (!props.isGuard) {
    const tabIndex = tabs.findIndex(
      (tab: { name: string }) => tab.name === activeName.value
    );
    if (tabIndex >= 0) {
      tabs.splice(tabIndex, 1);
      activeName.value = tabs.length
        ? tabs[Math.max(tabIndex - 1, 0)].name
        : '';
    }
  }
};

// 处理 Tab 点击事件
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (props.helpInfo.enabled) {
    const createInfo = props.helpInfo.createInfo;
    const messageType = props.helpInfo.type;
    let info = createInfo ? createInfo(tab.props.name) : '';
    ElMessage({
      message: `${info}`,
      type: messageType,
    });
  }
};

// 离开前确认
const beforeLeave = async (newTabName: any) => {
  if (props.isGuard) {
    try {
      await ElMessageBox.confirm(
        `Are you sure you want to switch to Tab-${newTabName}?`
      );
      return true;
    } catch {
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.enhanced-tabs {
  height: 100% !important;
  background: url('@/assets/image/earthDark.png') no-repeat;
  background-size: cover;
  position: relative;
  .control-panel {
    position: absolute;
    bottom: 0;
  }
}
</style>
