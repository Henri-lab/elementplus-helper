import { defineComponent, markRaw, h, reactive, toRefs } from 'vue';
import Tabs from '../index.vue';

interface TabConfig {
  label: string;
  name: string;
  componentPath: string;
  icon?: string;      // 可选的图标
  content?: string;   // 可选的内容
  initName?: string;  // 初始激活项的名称（可以用第一个 Tab 配置的 name 作为默认激活项）
}

// 动态加载组件
const loadComponent = async (path: string) => {
  const component = await import(path);
  return markRaw(component.default || component);
};

// 使用函数生成 Tabs 组件
export function createTabsComponent(tabsConfig: TabConfig[]) {
  return defineComponent({
    name: 'DynamicTabs',
    components: { Tabs },
    async setup() {
      // 动态加载所有组件并应用配置
      const tabs = reactive(
        await Promise.all(
          tabsConfig.map(async (tab) => ({
            label: tab.label,
            name: tab.name,
            component: await loadComponent(tab.componentPath),
            icon: tab.icon || 'el-icon-default', // 默认图标，可自定义
            content: tab.content || '',           // 自定义内容
          }))
        )
      );

      // 默认激活第一个 Tab 的 name，如果提供了 initName 则使用其值
      const initName = tabsConfig[0]?.initName || tabsConfig[0]?.name || '';

      // 生成提示信息
      const helpInfo = () => ({
        enabled: true,
        createInfo: (name: string) => `切换至${name}成功`,
        type: 'success',
      });

      return () =>
        h('div', { class: 'tabs-basicInfos-and-images' }, [
          h(Tabs, {
            tabs,
            isGuard: false,
            isControlPanel: false,
            initName: initName, // 默认激活的 Tab 名称
          }),
        ]);
    },
  });
}