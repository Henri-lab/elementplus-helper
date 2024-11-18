import {
  defineComponent,
  markRaw,
  reactive,
  ref,
  onMounted,
  type Component,
  type Ref,
} from 'vue';
import Tabs from '@/components/Tabs/index.vue';

interface TabConfig {
  label: string;
  name: string;
  component: Component | string;
  icon?: string;
  content?: string;
  initName?: string;
}

// 动态加载组件
const loadComponentPath = async (path: string): Promise<Component | null> => {
  try {
    const component = await import(path);
    return markRaw(component.default || component);
  } catch (error) {
    console.error(`Failed to load component at path: ${path}`, error);
    return null; // 返回空组件或错误占位组件
  }
};

// 使用函数生成 Tabs 组件
export function createTabsComponent(tabsConfig: TabConfig[]) {
  return defineComponent({
    name: 'DynamicTabs',
    components: { Tabs },
    setup() {
      const tabs: Ref<TabConfig[]> = ref([]);
      const initName = tabsConfig.length > 0 ? tabsConfig[0]?.initName || tabsConfig[0]?.name || '' : '';

      onMounted(async () => {//将异步加载逻辑放入 onMounted 中，避免 setup 返回 Promise后还需要suspense来处理。
        //@ts-ignore
        tabs.value = await Promise.all(
          tabsConfig.map(async (tab) => ({
            label: tab.label,
            name: tab.name,
            component:
              typeof tab.component === 'string'
                ? await loadComponentPath(tab.component)
                : tab.component,
            icon: tab.icon || 'el-icon-default',
            content: tab.content || '',
          }))
        );
      });

      return () => (
        <div class="tabs-basicInfos-and-images">
          <Tabs
            tabs={tabs.value}
            isGuard={false}
            isControlPanel={false}
            initName={initName}
          />
        </div>
      );
    },
  });
}