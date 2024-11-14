import {
  defineComponent,
  ref,
  reactive,
  h,
  type Component,
  type PropType,
} from 'vue';
import {
  ElTabs,
  ElTabPane,
  ElCheckbox,
  ElInput,
  ElButton,
  ElMessageBox,
  ElMessage,
} from 'element-plus';
import type { TabsPaneContext } from 'element-plus';
import { def_tabsOption } from './config';

type TabsItem = {
  label: string;
  name: string;
  component: Component | string;
  icon?: string;
  content?: string;
  props?: Record<string, any>;
};

type HelpInfo = {
  enabled: boolean;
  createInfo?: (name: string) => string;
  type: 'info' | 'warning' | 'error' | 'success';
};

export default function createEnhancedTabsComponent() {
  return defineComponent({
    name: 'EnhancedTabs',
    props: {
      initName: {
        type: String,
        default: 'first',
      },
      isControlPanel: {
        type: Boolean,
        default: true,
      },
      isGuard: {
        type: Boolean,
        default: true,
      },
      helpInfo: {
        type: Object as PropType<HelpInfo>,
        default: () => ({
          enabled: false,
          createInfo: (name: string) => `Switched to ${name} successfully`,
          type: 'info',
        }),
      },
      tabs: {
        type: Array as PropType<TabsItem[]>,
        default: () => def_tabsOption,
      },
    },
    setup(props) {
      const activeName = ref(props.initName);
      const stretchTabs = ref(false);
      const newTabName = ref('New Tab');
      const tabs = reactive(props.tabs);

      // Add new tab
      const addTab = () => {
        const name = `tab-${Date.now()}`;
        tabs.push({
          label: newTabName.value,
          name,
          component: 'NewComponent',
          props: { exampleProp: 'Hello World' },
        });
        activeName.value = name;
        newTabName.value = '';
      };

      // Remove active tab
      const removeTab = () => {
        if (!props.isGuard) {
          const tabIndex = tabs.findIndex(
            (tab) => tab.name === activeName.value
          );
          if (tabIndex >= 0) {
            tabs.splice(tabIndex, 1);
            activeName.value = tabs.length
              ? tabs[Math.max(tabIndex - 1, 0)].name
              : '';
          }
        }
      };

      // Handle tab click
      const handleClick = (tab: TabsPaneContext) => {
        if (props.helpInfo.enabled) {
          const createInfo = props.helpInfo.createInfo;
          const messageType = props.helpInfo.type;
          const info = createInfo ? createInfo(tab.props.name as string) : '';
          ElMessage({
            message: `${info}`,
            type: messageType,
          });
        }
      };

      // Confirm before leaving a tab
      const beforeLeave = async (newTabName: string) => {
        if (props.isGuard) {
          try {
            await ElMessageBox.confirm(
              `Are you sure you want to switch to ${newTabName}?`
            );
            return true;
          } catch {
            return false;
          }
        }
        return true;
      };

      return () =>
        h('div', { class: 'enhanced-tabs' }, [
          h(
            ElTabs,
            {
              modelValue: activeName.value,
              type: 'card',
              onTabClick: handleClick,
              class: 'demo-tabs',
              stretch: stretchTabs.value,
              beforeLeave: beforeLeave,
            },
            () =>
              tabs.map((tab) =>
                h(
                  ElTabPane,
                  {
                    key: tab.name,
                    name: tab.name,
                    label: h('span', [
                      tab.icon ? h('i', { class: tab.icon }) : null,
                      ` ${tab.label}`,
                    ]),
                    lazy: true,
                  },
                  {
                    default: () => [
                      typeof tab.component === 'string'
                        ? h('div', { class: 'stringComp comp' }, tab.component)
                        : h('div', { class: 'realComp comp' }, [
                            h(tab.component, tab.props),
                          ]),
                    ],
                  }
                )
              )
          ),
          props.isControlPanel
            ? h('div', { class: 'control-panel' }, [
                h(
                  ElCheckbox,
                  {
                    modelValue: stretchTabs.value,
                    onChange: (val: boolean) => (stretchTabs.value = val),
                  },
                  'Stretch Tabs'
                ),
                h(ElInput, {
                  modelValue: newTabName.value,
                  onInput: (val: string) => (newTabName.value = val),
                  placeholder: 'New Tab Name',
                }),
                h(
                  ElButton,
                  {
                    type: 'primary',
                    onClick: addTab,
                  },
                  'Add Tab'
                ),
                h(
                  ElButton,
                  {
                    type: 'danger',
                    onClick: removeTab,
                  },
                  'Remove Active Tab'
                ),
              ])
            : null,
        ]);
    },
  });
}
