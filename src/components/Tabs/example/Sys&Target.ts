import { markRaw } from 'vue';
//@ts-ignore
import { createTabsComponent } from '@openUI/OpenTabs/creater';
import C1 from '@/components/Tree/example/Sys.vue';
import C2 from '@/components/Tree/example/SingleTarget.vue';

const tabsConfigArr = [
  {
    label: '目标体系',
    name: 'first',
    component: markRaw(C1),
  },
  {
    label: '单目标',
    name: 'second',
    component: markRaw(C2),
  },
];

const comp = createTabsComponent(tabsConfigArr);
export default comp;
