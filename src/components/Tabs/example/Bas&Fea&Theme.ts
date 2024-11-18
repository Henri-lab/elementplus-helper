import { markRaw } from 'vue';
//@ts-ignore
import { createTabsComponent } from '@openUI/OpenTabs/creater';
//@ts-ignore
import C1 from '@/components/Other/BasicInfosList.vue';
//@ts-ignore
import C2 from '@/components/Other/FeatureInfosList.vue';
//@ts-ignore
import C3 from '@/components/Other/ThemeImagesList.vue';

const tabsConfigArr = [
  {
    label: '基本信息',
    name: 'first',
    component: markRaw(C1),
  },
  {
    label: '要素信息',
    name: 'second',
    component: markRaw(C2),
  },
  {
    label: '专题图',
    name: 'third',
    component: markRaw(C3),
  },
];

const comp = createTabsComponent(tabsConfigArr);
export default comp;
