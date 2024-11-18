import { markRaw } from 'vue';
//@ts-ignore
import { createTabsComponent } from '@openUI/OpenTabs/creater';
//@ts-ignore
import C1 from '@/components/Table/example/TargetBasicInfo.ts';
//@ts-ignore
import C2 from '@/components/Table/example/ThemeImages.ts';

const tabsConfigArr = [
  {
    label: '基本信息',
    name: 'first',
    component: markRaw(C1),
  },
  {
    label: '专题图',
    name: 'second',
    component: markRaw(C2),
  },
];

const comp = createTabsComponent(tabsConfigArr);
export default comp;
